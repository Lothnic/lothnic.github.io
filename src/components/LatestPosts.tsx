"use client";

import Link from "next/link";
import { posts } from "@/data/posts";

export function LatestPosts() {
  // Show the latest 3 posts
  const latest = posts.slice(0, 3);

  return (
    <section
      id="latest-posts"
      className="relative z-1 px-[var(--hw-gutter)] py-[calc(80*var(--u))] border-t border-[var(--hw-fg)]/10 bg-[var(--hw-bg)]"
    >
      <div className="flex flex-col gap-[calc(40*var(--u))] max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-[var(--hw-fg)]/10 pb-[calc(16*var(--u))]">
          <h2 className="hw-mono text-[var(--hw-text-eyebrow)] tracking-[0.18em] opacity-80">
            LATEST NOTES
          </h2>
          <Link
            href="/blog"
            className="hw-mono text-[var(--hw-text-eyebrow)] tracking-wider hover:text-[var(--hw-accent)] transition-colors"
          >
            [ view all ]
          </Link>
        </div>

        {/* Posts List */}
        <div className="flex flex-col gap-[calc(30*var(--u))]">
          {latest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col md:grid md:grid-cols-4 items-baseline py-[calc(20*var(--u))] border-b border-[var(--hw-fg)]/5 hover:border-[var(--hw-accent)]/30 transition-colors gap-[calc(12*var(--u))] md:gap-0"
            >
              {/* Category & Year (Col 1) */}
              <div className="flex flex-row md:flex-col gap-2 md:gap-[calc(4*var(--u))] hw-mono text-[var(--hw-text-eyebrow)] opacity-60 group-hover:opacity-100 group-hover:text-[var(--hw-accent)] transition-all">
                <span>{post.year}</span>
                <span className="md:hidden opacity-40">·</span>
                <span className="lowercase">{post.category}</span>
              </div>

              {/* Title & Excerpt (Col 2-4) */}
              <div className="md:col-span-3 flex flex-col gap-[calc(8*var(--u))]">
                <h3 className="font-fraunces font-medium text-[clamp(1.2rem,calc(32*var(--u)),1.8rem)] leading-tight text-[var(--hw-fg)] group-hover:text-[var(--hw-accent)] transition-colors normal-case">
                  {post.title}
                </h3>
                <p className="font-roboto-mono text-[clamp(0.75rem,calc(16*var(--u)),0.92rem)] text-[var(--hw-fg)] opacity-65 group-hover:opacity-85 transition-opacity normal-case leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
