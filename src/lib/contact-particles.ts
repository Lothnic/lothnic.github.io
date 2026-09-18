export type ContactParticlesTheme = "light" | "dark";

export type ContactParticlesOptions = {
  theme?: ContactParticlesTheme;
  reveal?: () => number;
  idleGate?: number;
  density?: number;
};

export type ContactParticlesHandle = {
  setTheme: (theme: ContactParticlesTheme) => void;
  destroy: () => void;
};

type Particle = {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  phase: number;
  freq: number;
  kind: "petal" | "spark";
  alpha: number;
};

const PALETTES: Record<ContactParticlesTheme, { petal: string; spark: string }> = {
  light: { petal: "#d35400", spark: "#d35400" },
  dark: { petal: "#d0ff54", spark: "#e8f0ec" },
};

function hexA(hex: string, alpha: number) {
  const n = Number.parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

export function createContactParticles(
  canvas: HTMLCanvasElement,
  options: ContactParticlesOptions = {}
): ContactParticlesHandle {
  const ctx = canvas.getContext("2d", { alpha: true });
  const noop: ContactParticlesHandle = { setTheme: () => {}, destroy: () => {} };
  if (!ctx) return noop;

  const reveal = options.reveal ?? (() => 1);
  const idleGate = options.idleGate ?? 0.02;
  const density = options.density ?? 1;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  let theme: ContactParticlesTheme = options.theme ?? "dark";
  let W = 0;
  let H = 0;
  let DPR = 1;
  let t = 0;
  let particles: Particle[] = [];
  let raf = 0;
  let last = 0;
  let destroyed = false;
  let paused = document.hidden;

  const makeParticle = (spawnAnywhere: boolean): Particle => {
    const isPetal = Math.random() < 0.55;
    return {
      x: Math.random() * W,
      y: spawnAnywhere ? Math.random() * H : H + Math.random() * 60,
      r: isPetal ? 1.6 + Math.random() * 2.2 : 0.8 + Math.random() * 1.2,
      vy: -(0.12 + Math.random() * 0.35),
      vx: (Math.random() - 0.5) * 0.25,
      phase: Math.random() * Math.PI * 2,
      freq: 0.004 + Math.random() * 0.01,
      kind: isPetal ? "petal" : "spark",
      alpha: 0.35 + Math.random() * 0.5,
    };
  };

  const seed = () => {
    particles = [];
    const count = Math.min(
      84,
      Math.max(24, Math.floor(((W * H) / 24000) * density))
    );
    for (let i = 0; i < count; i++) particles.push(makeParticle(true));
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    W = Math.max(1, rect.width);
    H = Math.max(1, rect.height);
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    seed();
  };

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    const palette = PALETTES[theme];
    for (const p of particles) {
      if (p.kind === "petal") {
        ctx.fillStyle = hexA(palette.petal, p.alpha);
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.r * 1.4, p.r * 0.7, p.phase + t * 0.002, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = hexA(palette.spark, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const step = (dt: number) => {
    const k = dt / 16.6667;
    t += k;
    for (const p of particles) {
      p.y += p.vy * k;
      p.x += (p.vx + Math.sin(t * p.freq + p.phase) * 0.4) * k;
      if (p.y < -10 || p.x < -20 || p.x > W + 20) Object.assign(p, makeParticle(false));
    }
  };

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (destroyed || paused) {
      last = now;
      return;
    }
    if (reveal() < idleGate) {
      last = now;
      return;
    }
    const dt = Math.min(64, now - (last || now));
    last = now;
    step(dt);
    draw();
  };

  const setTheme = (next: ContactParticlesTheme) => {
    theme = next;
    if (reduce.matches) draw();
  };

  const handleVisibility = () => {
    paused = document.hidden;
  };

  const ro = new ResizeObserver(() => {
    if (destroyed) return;
    resize();
    if (reduce.matches) draw();
  });
  ro.observe(canvas);

  document.addEventListener("visibilitychange", handleVisibility);

  resize();
  if (reduce.matches) {
    draw();
  } else {
    raf = requestAnimationFrame(frame);
  }

  return {
    setTheme,
    destroy: () => {
      if (destroyed) return;
      destroyed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    },
  };
}
