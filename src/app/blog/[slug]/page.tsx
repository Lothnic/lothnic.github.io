"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { posts } from "@/data/posts";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { GrainOverlay } from "@/components/GrainOverlay";
import { HeroCanvas } from "@/components/HeroCanvas";
import { Sun, Moon } from "lucide-react";

export default function BlogPost() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-theme") as "light" | "dark";
    if (saved) {
      setTheme(saved);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("portfolio-theme", next);
  };

  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className={cn("portfolio-web min-h-[100dvh] flex items-center justify-center bg-[var(--hw-bg)]", theme)}>
        <main className="relative z-2 text-center flex flex-col gap-4">
          <h1 className="font-fraunces text-2xl">Note not found</h1>
          <Link href="/blog" className="hw-mono text-xs hover:underline text-[var(--hw-accent)]">[← back to notes]</Link>
        </main>
        <GrainOverlay />
        <div className="hw-frame" aria-hidden="true" />
      </div>
    );
  }

  // High-fidelity custom renderer for technical markdown elements
  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```|\$\$[\s\S]*?\$\$)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith("```")) {
        // Code Block
        const lines = part.split("\n");
        const firstLine = lines[0];
        const lang = firstLine.replace("```", "").trim();
        const code = lines.slice(1, -1).join("\n");
        return (
          <pre key={index} className="my-6 p-5 bg-[var(--hw-paper)] border border-[var(--hw-fg)]/10 font-mono text-[clamp(0.7rem,calc(14*var(--u)),0.88rem)] overflow-x-auto leading-relaxed select-text rounded-sm relative group/code max-w-full shadow-sm">
            {lang && <div className="absolute right-3 top-2 text-[10px] hw-mono opacity-50 uppercase">{lang}</div>}
            <code>{code}</code>
          </pre>
        );
      } else if (part.startsWith("$$")) {
        // standalone Math Block
        const formula = part.replace(/\$\$/g, "").trim();
        return (
          <div key={index} className="my-6 py-4 px-6 bg-[var(--hw-accent)]/5 border-l-2 border-[var(--hw-accent)] text-center font-mono text-[clamp(0.75rem,calc(16*var(--u)),0.92rem)] overflow-x-auto leading-normal normal-case select-text">
            {formula}
          </div>
        );
      } else {
        // Paragraph Splitter
        return part.split("\n\n").map((para, pIndex) => {
          const trimmed = para.trim();
          if (!trimmed) return null;
          
          // Header 3
          if (trimmed.startsWith("### ")) {
            return (
              <h3 key={`${index}-${pIndex}`} className="font-fraunces font-medium text-[clamp(1.3rem,calc(32*var(--u)),1.85rem)] leading-tight text-[var(--hw-fg)] mt-10 mb-4 normal-case">
                {trimmed.replace("### ", "")}
              </h3>
            );
          }
          // Header 4
          if (trimmed.startsWith("#### ")) {
            return (
              <h4 key={`${index}-${pIndex}`} className="font-fraunces font-medium text-[clamp(1.1rem,calc(26*var(--u)),1.5rem)] leading-tight text-[var(--hw-fg)] mt-8 mb-3 normal-case">
                {trimmed.replace("#### ", "")}
              </h4>
            );
          }
          // Unordered Lists
          if (trimmed.startsWith("- ")) {
            const items = trimmed.split("\n");
            return (
              <ul key={`${index}-${pIndex}`} className="list-disc pl-5 my-5 flex flex-col gap-2.5 font-roboto-mono text-[clamp(0.85rem,calc(17*var(--u)),0.98rem)] leading-relaxed text-[var(--hw-fg)] opacity-90 normal-case">
                {items.map((item, iIndex) => {
                  const cleaned = item.replace("- ", "");
                  return (
                    <li key={iIndex}>
                      {cleaned.split(/(\*\*.*?\*\*)/g).map((chunk, cIdx) => {
                        if (chunk.startsWith("**") && chunk.endsWith("**")) {
                          return <strong key={cIdx} className="font-bold">{chunk.slice(2, -2)}</strong>;
                        }
                        return chunk;
                      })}
                    </li>
                  );
                })}
              </ul>
            );
          }
          
          // Regular Text Paragraph with Inline Parser
          return (
            <p key={`${index}-${pIndex}`} className="font-roboto-mono text-[clamp(0.85rem,calc(17*var(--u)),0.98rem)] leading-relaxed text-[var(--hw-fg)] opacity-90 mb-5 normal-case">
              {trimmed.split(/(\*\*.*?\*\*|\$.*?\$)/g).map((word, wIndex) => {
                if (word.startsWith("**") && word.endsWith("**")) {
                  return <strong key={wIndex} className="font-bold">{word.slice(2, -2)}</strong>;
                }
                if (word.startsWith("$") && word.endsWith("$")) {
                  return <code key={wIndex} className="bg-[var(--hw-paper)] border border-[var(--hw-fg)]/10 px-1.5 py-0.5 rounded font-mono text-[0.85em]">{word.slice(1, -1)}</code>;
                }
                return word;
              })}
            </p>
          );
        });
      }
    });
  };

  return (
    <div className={cn("portfolio-web min-h-[100dvh] bg-[var(--hw-bg)]", theme)}>
      <main className="relative z-2 mx-auto max-w-[850px] px-[var(--hw-gutter)] py-[calc(60*var(--u))]">
        {/* Navigation Header */}
        <header className="flex items-center justify-between border-b border-[var(--hw-fg)]/10 pb-[calc(20*var(--u))] mb-[calc(60*var(--u))]">
          <Link
            href="/blog"
            className="hw-mono text-[var(--hw-text-eyebrow)] tracking-wider hover:text-[var(--hw-accent)] transition-colors normal-case"
          >
            [← all notes]
          </Link>
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="flex items-center justify-center opacity-70 transition-opacity duration-200 ease-out hover:opacity-100 cursor-pointer p-[calc(4*var(--u))]"
          >
            {theme === "light" ? (
              <Moon style={{ height: "calc(24 * var(--u))", width: "auto" }} />
            ) : (
              <Sun style={{ height: "calc(24 * var(--u))", width: "auto" }} />
            )}
          </button>
        </header>

        {/* Article Metadata */}
        <article className="flex flex-col">
          <div className="flex items-center gap-3 hw-mono text-[var(--hw-text-eyebrow)] opacity-60 lowercase mb-[calc(14*var(--u))]">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.category}</span>
          </div>

          <h1 className="font-fraunces font-medium text-[clamp(1.8rem,calc(54*var(--u)),3.2rem)] leading-[1.1] text-[var(--hw-fg)] tracking-[-0.015em] normal-case mb-[calc(40*var(--u))]">
            {post.title}
          </h1>

          {/* Rendered Markdown Body */}
          <div className="flex flex-col mt-[calc(10*var(--u))]">
            {renderContent(post.content)}
          </div>
        </article>

        {/* Footer separator line */}
        <div className="mt-[calc(100*var(--u))] border-t border-[var(--hw-fg)]/10 pt-[calc(30*var(--u))] text-center">
          <p className="hw-mono text-[var(--hw-text-eyebrow)] opacity-40 leading-none">
            ~ ~ ~ ~ ~ ~ ~
          </p>
          <p className="hw-mono text-[var(--hw-text-eyebrow)] opacity-40 mt-[calc(16*var(--u))]">
            &copy; {new Date().getFullYear()} Mayank Joshi
          </p>
        </div>
      </main>

      <GrainOverlay />
      <div className="hw-frame" aria-hidden="true" />
    </div>
  );
}
