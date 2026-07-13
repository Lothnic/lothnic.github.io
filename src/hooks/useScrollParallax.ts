"use client";

import { useCallback, useEffect, useRef } from "react";

const PARALLAX_RATE = 0.14;
const PARALLAX_MAX_FRAC = 0.18;
const IMAGE_PARALLAX_FACTOR = 0.1;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function useScrollParallax() {
  const containerRef = useRef<HTMLDivElement>(null);

  const updateParallax = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const panelTop = rect.top + window.scrollY;
    const scroll = window.scrollY;
    const t = clamp(
      (viewportHeight - Math.max(panelTop - scroll, 0)) * PARALLAX_RATE,
      0,
      PARALLAX_MAX_FRAC * viewportHeight,
    );
    const py = -t;

    const panel = container.querySelector<HTMLElement>(".hw-feature-panel");
    if (panel) {
      panel.style.setProperty("--py", `${py}px`);
    }

    const images = container.querySelectorAll<HTMLElement>(".hw-parallax");
    for (const img of images) {
      const parent = img.parentElement;
      if (!parent) continue;
      const pRect = parent.getBoundingClientRect();
      const parentTop = pRect.top + window.scrollY;
      const parentH = pRect.height;
      const e = clamp(
        (parentTop - scroll + parentH / 2 - viewportHeight / 2) /
          (viewportHeight / 2 + parentH / 2),
        -1,
        1,
      );
      const pyImg = -(e * parentH * IMAGE_PARALLAX_FACTOR);
      img.style.setProperty("--py-img", `${pyImg}px`);
    }
  }, []);

  useEffect(() => {
    let rafId: number;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      rafId = requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
      ticking = true;
    };

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateParallax, 100);
    };

    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
    };
  }, [updateParallax]);

  return containerRef;
}
