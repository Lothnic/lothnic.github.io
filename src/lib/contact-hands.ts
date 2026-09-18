export type ContactHandsOptions = {
  basePath?: string;
  leftAsset?: string;
  rightAsset?: string;
  reveal?: () => number;
  startThreshold?: number;
  idleGate?: number;
  desktopBoost?: number;
  mobileBoost?: number;
  pixelCap?: number;
  budgetScale?: number;
};

export type ContactHandsHandle = {
  play: () => void;
  setPaused: (value: boolean) => void;
  destroy: () => void;
};

const IMG_W = 2560;
const IMG_H = 1135;
const ALPHA_MIN = 26;
const DURATION = 2600;
const SCAN_DONE = 0.44;
const RIGHT_START = 0.28;
const RIGHT_DELAY_SPAN = 0.24;
const RIGHT_FLIGHT = 0.46;
const SETTLE = 1.0;
const SETTLE_END = 1.34;
const TAU = Math.PI * 2;

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const fract = (v: number) => v - Math.floor(v);

export function createContactHands(
  root: HTMLElement,
  options: ContactHandsOptions = {}
): ContactHandsHandle {
  const noop: ContactHandsHandle = {
    play: () => {},
    setPaused: () => {},
    destroy: () => {},
  };

  const viewport = root.querySelector<HTMLElement>("[data-hands-viewport]");
  const stage = root.querySelector<HTMLElement>("[data-hands-stage]");
  const parallax = root.querySelector<HTMLElement>("[data-hands-parallax]");
  const leftEl = root.querySelector<HTMLElement>("[data-hands-left]");
  const rightEl = root.querySelector<HTMLElement>("[data-hands-right]");
  const canvas = root.querySelector<HTMLCanvasElement>("[data-hands-canvas]");
  const scanEl = root.querySelector<HTMLElement>("[data-hands-scan]");
  const sparkEl = root.querySelector<HTMLElement>("[data-hands-spark]");
  if (!viewport || !stage || !parallax || !leftEl || !rightEl || !canvas || !scanEl || !sparkEl) {
    return noop;
  }

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return noop;

  const sampleCanvas = document.createElement("canvas");
  const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });
  const bufCanvas = document.createElement("canvas");
  const bufCtx = bufCanvas.getContext("2d");
  const bloomCanvas = document.createElement("canvas");
  const bloomCtx = bloomCanvas.getContext("2d");
  if (!sampleCtx || !bufCtx || !bloomCtx) return noop;

  const basePath = options.basePath ?? "/images/contact";
  const leftAsset = options.leftAsset ?? "hands-darkmode-left.webp";
  const rightAsset = options.rightAsset ?? "hands-darkmode-right.webp";
  const reveal = options.reveal ?? (() => 1);
  const startThreshold = options.startThreshold ?? 0.4;
  const idleGate = options.idleGate ?? 0.02;
  const desktopBoost = options.desktopBoost ?? 1;
  const mobileBoost = options.mobileBoost ?? 1.5;
  const pixelCap = options.pixelCap ?? 2.4e6;
  const budgetScale = options.budgetScale ?? 1;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarse = window.matchMedia("(pointer: coarse)");

  let leftImg: HTMLImageElement | null = null;
  let rightImg: HTMLImageElement | null = null;
  let imagesReady = false;

  let W = 0;
  let H = 0;
  let dpr = 1;
  let cssW = 0;
  let cssH = 0;
  let frame: ImageData | null = null;
  let pixels: Uint8ClampedArray | null = null;
  let pixels32: Uint32Array | null = null;

  let xs = new Float32Array(0);
  let ys = new Float32Array(0);
  let sxs = new Float32Array(0);
  let sys = new Float32Array(0);
  let uArr = new Float32Array(0);
  let vArr = new Float32Array(0);
  let phase = new Float32Array(0);
  let red = new Uint8Array(0);
  let green = new Uint8Array(0);
  let blue = new Uint8Array(0);
  let alpha0 = new Uint8Array(0);
  let sideArr = new Int8Array(0);
  let all: Uint32Array = new Uint32Array(0);
  let shimmer: Uint32Array = new Uint32Array(0);

  let elapsed = 0;
  let last = 0;
  let started = false;
  let externalPaused = false;
  let paused = document.hidden;
  let destroyed = false;
  let raf = 0;

  let pointerX = 0;
  let pointerY = 0;
  let pointerActive = false;
  let smoothX = 0;
  let smoothY = 0;
  let strength = 0;

  const isSmall = () => window.innerWidth < 768 || coarse.matches;

  function pickBudget() {
    const area = cssW * cssH;
    const small = isSmall();
    let budget = (area / (small ? 40 : 20)) * budgetScale;
    if ((navigator.hardwareConcurrency || 8) <= 4) budget *= 0.7;
    return clamp(Math.round(budget), small ? 9000 : 22000, small ? 32000 : 72000);
  }

  function putPx(x: number, y: number, r: number, g: number, b: number, a: number, soft: boolean) {
    if (!pixels) return;
    const xi = x | 0;
    const yi = y | 0;
    if (xi < 0 || yi < 0 || xi >= W || yi >= H) return;
    const i4 = (yi * W + xi) << 2;
    pixels[i4] = r;
    pixels[i4 + 1] = g;
    pixels[i4 + 2] = b;
    const av = a * 255;
    if (av > pixels[i4 + 3]) pixels[i4 + 3] = av;
    if (!soft) return;
    const ha = av * 0.3;
    if (xi > 0) {
      const l = i4 - 4;
      if (ha > pixels[l + 3]) {
        pixels[l] = r;
        pixels[l + 1] = g;
        pixels[l + 2] = b;
        pixels[l + 3] = ha;
      }
    }
    if (xi < W - 1) {
      const rr = i4 + 4;
      if (ha > pixels[rr + 3]) {
        pixels[rr] = r;
        pixels[rr + 1] = g;
        pixels[rr + 2] = b;
        pixels[rr + 3] = ha;
      }
    }
    if (yi > 0) {
      const up = i4 - (W << 2);
      if (ha > pixels[up + 3]) {
        pixels[up] = r;
        pixels[up + 1] = g;
        pixels[up + 2] = b;
        pixels[up + 3] = ha;
      }
    }
    if (yi < H - 1) {
      const dn = i4 + (W << 2);
      if (ha > pixels[dn + 3]) {
        pixels[dn] = r;
        pixels[dn + 1] = g;
        pixels[dn + 2] = b;
        pixels[dn + 3] = ha;
      }
    }
  }

  function sample() {
    if (!imagesReady || !leftImg || !rightImg || !pixels) return;
    sampleCanvas.width = W;
    sampleCanvas.height = H;
    const draw = (img: HTMLImageElement) => {
      sampleCtx!.clearRect(0, 0, W, H);
      sampleCtx!.drawImage(img, 0, 0, W, H);
      return sampleCtx!.getImageData(0, 0, W, H).data;
    };
    const A = draw(leftImg);
    const B = draw(rightImg);

    let probes = 0;
    for (let i = 3; i < A.length; i += 16) if (A[i] > ALPHA_MIN) probes++;
    for (let i = 3; i < B.length; i += 16) if (B[i] > ALPHA_MIN) probes++;
    const coverage = Math.max(1, probes * 16);

    const budget = pickBudget();
    const density = clamp(budget / coverage, 0.05, 1);
    const cap = Math.round(coverage * density) + 2048;

    let leftMax = 0;
    let rightMin = W;
    for (let y = 0; y < H; y += 2) {
      const row = y * W;
      for (let x = 0; x < W; x += 2) {
        if (A[(row + x) * 4 + 3] > ALPHA_MIN && x > leftMax) leftMax = x;
        if (B[(row + x) * 4 + 3] > ALPHA_MIN && x < rightMin) rightMin = x;
      }
    }
    if (leftMax < 1) leftMax = Math.round(W * 0.5);
    if (rightMin > W - 1) rightMin = Math.round(W * 0.5);
    const rightSpan = Math.max(1, W - rightMin);

    xs = new Float32Array(cap);
    ys = new Float32Array(cap);
    sxs = new Float32Array(cap);
    sys = new Float32Array(cap);
    uArr = new Float32Array(cap);
    vArr = new Float32Array(cap);
    phase = new Float32Array(cap);
    red = new Uint8Array(cap);
    green = new Uint8Array(cap);
    blue = new Uint8Array(cap);
    alpha0 = new Uint8Array(cap);
    sideArr = new Int8Array(cap);

    let n = 0;
    const collect = (data: Uint8ClampedArray, side: 1 | -1) => {
      for (let y = 0; y < H; y++) {
        const row = y * W;
        for (let x = 0; x < W; x++) {
          if (n >= cap) return;
          const i4 = (row + x) * 4;
          const a = data[i4 + 3];
          if (a <= ALPHA_MIN) continue;
          if (Math.random() > density) continue;
          xs[n] = x + (Math.random() - 0.5);
          ys[n] = y + (Math.random() - 0.5);
          if (side === 1) {
            uArr[n] = clamp(x / leftMax, 0, 1);
            sxs[n] = xs[n];
            sys[n] = ys[n];
          } else {
            vArr[n] = clamp((W - x) / rightSpan, 0, 1);
            sxs[n] = xs[n] + (0.34 + Math.random() * 0.5) * W;
            sys[n] = ys[n] + (Math.random() - 0.5) * H * 0.42;
          }
          phase[n] = Math.random();
          red[n] = data[i4];
          green[n] = data[i4 + 1];
          blue[n] = data[i4 + 2];
          alpha0[n] = a;
          sideArr[n] = side;
          n++;
        }
      }
    };
    collect(A, 1);
    collect(B, -1);

    if (n === 0) return;
    all = new Uint32Array(n);
    for (let i = 0; i < n; i++) all[i] = i;
    const shimmerIdx: number[] = [];
    for (let i = 0; i < n; i += 11) shimmerIdx.push(i);
    shimmer = new Uint32Array(shimmerIdx);
  }

  function layout() {
    const rect = viewport!.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;
    const boost = isSmall() ? mobileBoost : desktopBoost;
    const scale = Math.min(rect.width / IMG_W, rect.height / IMG_H) * boost;
    cssW = Math.max(1, Math.round(IMG_W * scale));
    cssH = Math.max(1, Math.round(IMG_H * scale));
    stage!.style.width = `${cssW}px`;
    stage!.style.height = `${cssH}px`;
    stage!.style.left = `${Math.round((rect.width - cssW) / 2)}px`;
    stage!.style.top = `${Math.round((rect.height - cssH) / 2)}px`;

    let d = Math.min(window.devicePixelRatio || 1, 1.5);
    const area = cssW * cssH;
    if (area * d * d > pixelCap) d = Math.max(1, Math.sqrt(pixelCap / area));
    dpr = d;
    W = Math.max(1, Math.round(cssW * dpr));
    H = Math.max(1, Math.round(cssH * dpr));
    canvas!.width = W;
    canvas!.height = H;
    canvas!.style.width = `${cssW}px`;
    canvas!.style.height = `${cssH}px`;
    bufCanvas.width = W;
    bufCanvas.height = H;
    bloomCanvas.width = Math.max(1, Math.round(W / 5));
    bloomCanvas.height = Math.max(1, Math.round(H / 5));
    frame = ctx!.createImageData(W, H);
    pixels = frame.data;
    pixels32 = new Uint32Array(pixels.buffer);
    try {
      sample();
    } catch {
      imagesReady = false;
      delete root.dataset.ready;
      showStatic();
    }
  }

  function render(p: number, now: number) {
    if (!pixels || !pixels32 || !frame || !ctx) return;
    pixels32.fill(0);
    const settled = p >= SETTLE_END;
    const idle = smoothstep(SETTLE, SETTLE_END, p);
    const list = settled ? shimmer : all;
    const front = -0.1 + 1.2 * easeInOutSine(clamp(p / SCAN_DONE, 0, 1));
    const driftPx = smoothX * 18 * dpr;
    const reachPx = (-16 + strength * 36) * smoothstep(0.85, 1.15, p) * dpr;

    for (let k = 0; k < list.length; k++) {
      const i = list[k];
      const side = sideArr[i];
      const ph = phase[i] * TAU;
      let x = xs[i];
      let y = ys[i];
      let a = 0;
      let soft = alpha0[i] > 176;
      let r = red[i];
      let g = green[i];
      let b = blue[i];

      if (side === 1) {
        const u = uArr[i];
        const local = 1 - smoothstep(front - 0.04, front + 0.04, u);
        if (local <= 0.002) continue;
        const writing = 1 - local;
        if (writing > 0.002) x += Math.sin(ph * 7.1 + now * 0.05) * 2.6 * writing * dpr;
        a = local;
        if (writing > 0.002) a *= 0.7 + 0.3 * Math.sin(now * 0.016 + ph * 3.7);
        const hot = Math.max(0, 1 - Math.abs(u - front) / 0.04);
        if (hot > 0.002) {
          r = mix(r, 255, hot * 0.9);
          g = mix(g, 248, hot * 0.9);
          b = mix(b, 226, hot * 0.9);
        }
      } else {
        const q = clamp((p - RIGHT_START - vArr[i] * RIGHT_DELAY_SPAN) / RIGHT_FLIGHT, 0, 1);
        if (q <= 0.002) continue;
        const e = easeOutCubic(q);
        const inv = 1 - e;
        x = xs[i] + (sxs[i] - xs[i]) * inv;
        y = ys[i] + (sys[i] - ys[i]) * inv;
        const amp = inv * 24 * (0.35 + phase[i] * 0.65) * dpr;
        x += Math.sin(ph + q * 8.5) * amp;
        y += Math.cos(ph + q * 8.5) * amp * 0.72;
        a = clamp(e * 1.5, 0, 1) * (0.45 + 0.55 * e);
        if (q < 0.999) {
          a *= mix(0.72 + 0.28 * Math.sin(now * 0.011 + ph * 5), 1, e);
          soft = soft || q < 0.85;
        }
      }

      if (idle > 0) {
        x += Math.sin(now * 0.0008 + ph) * 1.3 * idle * dpr;
        y += Math.cos(now * 0.0011 + ph) * 1.3 * idle * dpr;
        const tw = 0.5 + 0.5 * Math.sin(now * 0.0016 + ph * 3);
        const sh = (side === 1 ? 0.13 : 0.18) * (0.35 + 0.65 * tw);
        a = a * (1 - idle) + sh * idle;
      }

      if (a <= 0.004) continue;
      x += driftPx + reachPx * side;
      putPx(x, y, r, g, b, a * (0.65 + (alpha0[i] / 255) * 0.35), soft);
    }

    bufCtx!.putImageData(frame, 0, 0);
    ctx.clearRect(0, 0, W, H);
    bloomCtx!.clearRect(0, 0, bloomCanvas.width, bloomCanvas.height);
    bloomCtx!.drawImage(bufCanvas, 0, 0, bloomCanvas.width, bloomCanvas.height);
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 0.6;
    ctx.drawImage(bloomCanvas, 0, 0, W, H);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(bufCanvas, 0, 0);
  }

  function frameLoop(now: number) {
    raf = requestAnimationFrame(frameLoop);
    if (destroyed || !imagesReady || paused || externalPaused) {
      last = now;
      return;
    }
    const gate = reveal();
    if (!started) {
      if (gate >= startThreshold) {
        started = true;
        elapsed = 0;
        last = now;
      } else {
        last = now;
        return;
      }
    }
    if (gate < idleGate) {
      started = false;
      elapsed = 0;
      last = now;
      return;
    }
    const dt = Math.min(64, now - (last || now));
    last = now;
    elapsed = Math.min(elapsed + dt, DURATION * 2.5);
    const p = elapsed / DURATION;

    smoothX += (pointerX - smoothX) * 0.07;
    smoothY += (pointerY - smoothY) * 0.07;
    const dist = Math.hypot(pointerX, pointerY * 0.6);
    const near = pointerActive ? 1 - clamp(dist, 0, 1) : 0;
    const targetStrength = near * near * (3 - 2 * near);
    strength += (targetStrength - strength) * 0.08;

    const reach = (-16 + strength * 36) * smoothstep(0.85, 1.15, p);
    const drift = smoothX * 18;
    parallax!.style.transform = `translate3d(${(smoothX * 10).toFixed(2)}px, ${(smoothY * 10).toFixed(2)}px, 0)`;
    leftEl!.style.transform = `translate3d(${(reach + drift).toFixed(2)}px, 0, 0)`;
    rightEl!.style.transform = `translate3d(${(-reach + drift).toFixed(2)}px, 0, 0)`;

    const revealAmount = smoothstep(SETTLE, SETTLE_END, p);
    let leftOpacity = revealAmount;
    if (revealAmount > 0.995) {
      const rnd = fract(Math.sin(Math.floor(now / 130) * 12.9898) * 43758.5453);
      if (rnd > 0.9) leftOpacity *= 0.72;
    }
    leftEl!.style.opacity = leftOpacity.toFixed(3);
    rightEl!.style.opacity = revealAmount.toFixed(3);

    const sweep = clamp(p / SCAN_DONE, 0, 1);
    const front = -0.1 + 1.2 * easeInOutSine(sweep);
    scanEl!.style.setProperty("--scan-x", `${(front * cssW).toFixed(1)}px`);
    scanEl!.style.opacity = (sweep >= 1 ? 0 : Math.sin(sweep * Math.PI) * 0.9).toFixed(3);

    const burst = Math.exp(-Math.pow((p - 0.66) / 0.13, 2));
    const idleBreath = 0.16 + 0.1 * Math.sin(now * 0.0011);
    const sparkIdle = smoothstep(SETTLE_END, SETTLE_END + 0.3, p) * idleBreath;
    const sparkOpacity = Math.max(burst, sparkIdle);
    sparkEl!.style.opacity = (sparkOpacity * 0.95).toFixed(3);
    sparkEl!.style.transform = `translate(-50%, -50%) scale(${(0.5 + burst * 0.85 + sparkIdle * 0.3).toFixed(3)})`;

    render(p, now);
  }

  function showStatic() {
    ctx!.canvas.style.opacity = "0";
    leftEl!.style.opacity = "1";
    rightEl!.style.opacity = "1";
  }

  function loadImages() {
    const l = new Image();
    const r = new Image();
    let loaded = 0;
    let failed = false;
    const finish = () => {
      if (++loaded < 2 || failed) return;
      leftImg = l;
      rightImg = r;
      imagesReady = true;
      root.dataset.ready = "1";
      ctx!.canvas.style.opacity = "1";
      layout();
      last = performance.now();
    };
    const fail = () => {
      failed = true;
      imagesReady = false;
      delete root.dataset.ready;
      showStatic();
    };
    l.onload = finish;
    r.onload = finish;
    l.onerror = fail;
    r.onerror = fail;
    l.src = `${basePath}/${leftAsset}`;
    r.src = `${basePath}/${rightAsset}`;
  }

  function play() {
    if (destroyed || started) return;
    started = true;
    elapsed = 0;
    last = performance.now();
  }

  function setPaused(value: boolean) {
    externalPaused = value;
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    cancelAnimationFrame(raf);
    clearTimeout(resizeTimer);
    ro.disconnect();
    window.removeEventListener("pointermove", handlePointerMove);
    document.documentElement.removeEventListener("pointerleave", handlePointerReset);
    window.removeEventListener("blur", handlePointerReset);
    document.removeEventListener("visibilitychange", handleVisibility);
    delete root.dataset.ready;
  }

  let resizeTimer = 0;
  const ro = new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (!destroyed) layout();
    }, 120);
  });
  ro.observe(viewport);

  function handleVisibility() {
    paused = document.hidden;
  }

  function handlePointerMove(e: PointerEvent) {
    pointerActive = true;
    pointerX = (e.clientX / window.innerWidth) * 2 - 1;
    pointerY = (e.clientY / window.innerHeight) * 2 - 1;
  }

  function handlePointerReset() {
    pointerActive = false;
    pointerX = 0;
    pointerY = 0;
  }

  document.addEventListener("visibilitychange", handleVisibility);
  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", handlePointerReset, { passive: true });
  window.addEventListener("blur", handlePointerReset);

  layout();

  if (!reduce.matches) {
    root.dataset.ready = "1";
    loadImages();
    raf = requestAnimationFrame(frameLoop);
  }

  return { play, setPaused, destroy };
}
