"use client";

import { useEffect, useRef } from "react";

export function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SIZE = 256;
    canvas.width = SIZE;
    canvas.height = SIZE;

    const imageData = ctx.createImageData(SIZE, SIZE);
    const data = imageData.data;

    let resizeTimeout: ReturnType<typeof setTimeout>;

    function generateNoise() {
      for (let i = 0; i < data.length; i += 4) {
        const value = 128 + Math.random() * 40 - 20;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = 255;
      }
      ctx!.putImageData(imageData, 0, 0);
    }

    function animate(timestamp: number) {
      if (timestamp - lastFrameRef.current >= 64) {
        lastFrameRef.current = timestamp;
        generateNoise();
      }
      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);

    function handleResize() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        generateNoise();
      }, 150);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 h-full w-full"
      style={{
        mixBlendMode: "normal",
        opacity: 0.02,
        zIndex: 9999,
        imageRendering: "pixelated",
      }}
    />
  );
}
