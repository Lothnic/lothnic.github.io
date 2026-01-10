"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Resume from "@/components/Resume";
import BlogPreview from "@/components/BlogPreview";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  useEffect(() => {
    // Scroll Animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          target.style.opacity = "1";
          target.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    // Observe sections and cards
    const animatedElements = document.querySelectorAll(
      ".project-card, .blog-card, .timeline-item"
    );
    animatedElements.forEach((el) => {
      const target = el as HTMLElement;
      target.style.opacity = "0";
      target.style.transform = "translateY(20px)";
      target.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(target);
    });

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <main>
      <Navbar />
      <Hero />
      <Projects />
      <About />
      <Resume />
      <BlogPreview />
      <Contact />
      <Footer />
    </main>
  );
}