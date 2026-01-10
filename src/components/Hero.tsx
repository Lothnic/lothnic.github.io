"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const photoRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const photo = photoRef.current;
    const heroContainer = containerRef.current;

    if (!photo || !heroContainer) return;

    let isDragging = false;
    let startX: number, startY: number;
    let initialX: number, initialY: number;
    let currentX = 0;
    let currentY = 0;

    // Position photo absolutely for free movement
    photo.style.position = "absolute";
    photo.style.cursor = "grab";
    photo.style.userSelect = "none";
    photo.style.zIndex = "10";

    const updatePosition = () => {
      photo.style.left = `${currentX}px`;
      photo.style.top = `${currentY}px`;
      photo.style.transform = "none"; // Remove the center transform
    };

    const resetToCenter = () => {
      if (!heroContainer || !photo) return;
      const containerRect = heroContainer.getBoundingClientRect();
      const photoRect = photo.getBoundingClientRect();
      currentX = (containerRect.width - photoRect.width) / 2;
      currentY = (containerRect.height - photoRect.height) / 2;
      updatePosition();
    };

    const onDragStart = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      photo.style.cursor = "grabbing";
      photo.style.transition = "none";

      if (e instanceof MouseEvent) {
        startX = e.clientX;
        startY = e.clientY;
      } else if (e instanceof TouchEvent) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }

      initialX = currentX;
      initialY = currentY;

      // Add slight rotation while dragging
      const imgContainer = photo.querySelector(".hero-image-container") as HTMLElement;
      if (imgContainer) {
        imgContainer.style.transform = "rotate(-2deg) scale(1.02)";
      }
    };

    const onDragMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;

      // Only prevent default if it's not a touch event to avoid blocking scroll on mobile?
      // Actually original script prevented default.
      if (e.cancelable) e.preventDefault();

      let clientX, clientY;
      if (e instanceof MouseEvent) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else if (e instanceof TouchEvent) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }

      // Add safety check
      if (typeof clientX === 'undefined' || typeof clientY === 'undefined') return;

      const deltaX = clientX - startX;
      const deltaY = clientY - startY;

      currentX = initialX + deltaX;
      currentY = initialY + deltaY;

      const containerRect = heroContainer.getBoundingClientRect();
      const photoRect = photo.getBoundingClientRect();
      const navHeight = 70;

      currentX = Math.max(0, Math.min(currentX, containerRect.width - photoRect.width));
      currentY = Math.max(navHeight, Math.min(currentY, containerRect.height - photoRect.height));

      updatePosition();
    };

    const onDragEnd = () => {
      if (!isDragging) return;
      isDragging = false;

      photo.style.cursor = "grab";
      photo.style.transition = "transform 0.3s ease";

      const imgContainer = photo.querySelector(".hero-image-container") as HTMLElement;
      if (imgContainer) {
        imgContainer.style.transform = "rotate(3deg)";
      }
    };

    // Event listeners
    photo.addEventListener("mousedown", onDragStart);
    document.addEventListener("mousemove", onDragMove);
    document.addEventListener("mouseup", onDragEnd);

    photo.addEventListener("touchstart", onDragStart, { passive: false });
    document.addEventListener("touchmove", onDragMove, { passive: false });
    document.addEventListener("touchend", onDragEnd);

    photo.addEventListener("dragstart", (e) => e.preventDefault());

    // Initial center
    resetToCenter();
    window.addEventListener("resize", resetToCenter);

    return () => {
      photo.removeEventListener("mousedown", onDragStart);
      document.removeEventListener("mousemove", onDragMove);
      document.removeEventListener("mouseup", onDragEnd);
      photo.removeEventListener("touchstart", onDragStart);
      document.removeEventListener("touchmove", onDragMove);
      document.removeEventListener("touchend", onDragEnd);
      window.removeEventListener("resize", resetToCenter);
    };
  }, []);

  return (
    <section className="hero" id="home">
      <div className="hero-container" ref={containerRef}>
        {/* Top Left - Status Info */}
        <div className="hero-top-left">
          <div className="status-info">
            <span className="section-label">STATUS INF0RMATI0N:</span>
            <span className="hero-title">ML DEVEL0PER</span>
            <span className="status-badge">0PEN T0 W0RK</span>
          </div>
        </div>

        {/* Top Right - Industries */}
        <div className="hero-top-right">
          <div className="industries-list">
            <span>NEURAL MACHINE TRANSLATI0N</span>
            <span>GENERATIVE AI</span>
            <span>C0MPUTER VISI0N</span>
          </div>
        </div>

        {/* Center - Photo */}
        <div className="hero-center" ref={photoRef}>
          <span className="hero-easter-egg">PEEK-A-B00</span>
          <div className="hero-image-container">
            <div
              className="project-placeholder"
              style={{
                fontSize: "48px",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src="/images/hero.jpg"
                alt="Portrait of Mayank Joshi - ML Developer"
                width={180}
                height={270}
                className="hero-image"
                priority
              />
            </div>
          </div>
        </div>

        {/* Bottom Left - Tech Stack */}
        <div className="hero-bottom-left">
          PYTH0N<br />
          PYT0RCH<br />
          LANGCHAIN
        </div>

        {/* Bottom Right - Features */}
        <div className="hero-bottom-right">
          <span className="features-label">FEATURES:</span>
          <div className="features-list">
            <span>DEEP LEARNING</span>
            <span>M0DEL DEVEL0PMENT</span>
            <span>DATA ENGINEERING</span>
            <span>MLOPS</span>
          </div>
        </div>

        {/* Bottom Center - CTA */}
        <div className="hero-bottom-center">
          <Link href="#about" className="btn">
            M0RE INF0
          </Link>
        </div>
      </div>
    </section>
  );
}
