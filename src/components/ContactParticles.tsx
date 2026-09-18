"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./theme";
import { createContactParticles, type ContactParticlesHandle } from "@/lib/contact-particles";
import { createFooterRevealReader } from "@/lib/footer-reveal";

export function ContactParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<ContactParticlesHandle | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handle = createContactParticles(canvas, {
      theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
      reveal: createFooterRevealReader(),
      density: 1.15,
    });
    handleRef.current = handle;

    return () => {
      handle.destroy();
      handleRef.current = null;
    };
  }, []);

  useEffect(() => {
    handleRef.current?.setTheme(theme);
  }, [theme]);

  return <canvas ref={canvasRef} className="contact-particles" aria-hidden="true" />;
}
