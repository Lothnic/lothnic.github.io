"use client";

import { useScrollParallax } from "@/hooks/useScrollParallax";
import { useFooterReveal } from "@/hooks/useFooterReveal";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Nav } from "@/components/Nav";
import { HeroHeader } from "@/components/HeroHeader";
import { DownloadCards } from "@/components/DownloadCards";
import { FeaturePanel } from "@/components/FeaturePanel";
import { Footer } from "@/components/Footer";
import { GrainOverlay } from "@/components/GrainOverlay";
import { HeroCanvas } from "@/components/HeroCanvas";
import { LatestPosts } from "@/components/LatestPosts";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function Home() {
  const parallaxRef = useScrollParallax();
  useFooterReveal();

  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-theme") as "light" | "dark";
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(saved);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("portfolio-theme", next);
  };

  return (
    <div className={cn("portfolio-web", theme)}>
      <SmoothScroll />
      <HeroCanvas theme={theme} />
      <main className="relative z-2 mx-auto max-w-[1600px]">
        <div className="hw-scroll">
          <Nav theme={theme} toggleTheme={toggleTheme} />
          <HeroHeader />
          <DownloadCards />
          <div ref={parallaxRef}>
            <FeaturePanel />
          </div>
          <LatestPosts />
        </div>

        <Footer />
        <GrainOverlay />

        <div className="hw-frame" aria-hidden="true" />
      </main>
    </div>
  );
}
