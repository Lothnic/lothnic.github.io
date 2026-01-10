"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "../blog.css";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  tag: string;
  category: string;
  excerpt: string;
  content: string;
}

interface TOCItem {
  id: string;
  label: string;
}

type BlogTheme = "portfolio" | "terminal";

export default function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [toc, setToc] = useState<TOCItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<BlogTheme>("portfolio");
  const [slug, setSlug] = useState<string>("");

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("blog-theme") as BlogTheme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-blog-theme", theme);
    localStorage.setItem("blog-theme", theme);
  }, [theme]);

  // Resolve params and fetch post
  useEffect(() => {
    params.then(({ slug: s }) => {
      setSlug(s);
      fetch(`/api/blog/post/${s}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setPost(null);
          } else {
            setPost(data);
            // Extract headings for TOC
            const headings = extractHeadingsFromHtml(data.content || "");
            setToc(headings);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    });
  }, [params]);

  if (loading) {
    return (
      <div className="blog-theme-root">
        <div className="blog-container" style={{ paddingTop: "100px", textAlign: "center" }}>
          <p style={{ color: "var(--blog-text-secondary)" }}>
            Loading<span className="blog-cursor"></span>
          </p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="blog-theme-root">
        <div className="blog-container" style={{ paddingTop: "100px", textAlign: "center" }}>
          <h1 className="blog-title">Post Not Found</h1>
          <Link href="/blog" style={{ color: "var(--blog-accent)" }}>
            ← Back to Index
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-theme-root">
      {/* Top Navigation Bar */}
      <nav className="blog-topbar">
        <Link href="/" className="blog-brand">
          <span className="blog-brand-icon">◈</span>
          <span className="blog-brand-text">Lothnic</span>
        </Link>

        <span className="blog-topbar-title">{post.title.split(":")[0]}</span>

        <div className="blog-topbar-controls">
          <button
            className={`blog-topbar-link ${theme === "terminal" ? "active" : ""}`}
            onClick={() => setTheme("terminal")}
          >
            Terminal
          </button>
          <button
            className={`blog-topbar-link ${theme === "portfolio" ? "active" : ""}`}
            onClick={() => setTheme("portfolio")}
          >
            Portfolio
          </button>
        </div>
      </nav>

      <div className="blog-container">
        <header className="blog-header" style={{ border: "none", marginBottom: "40px" }}>
          <Link
            href="/blog"
            style={{
              color: "var(--blog-accent)",
              textDecoration: "none",
              fontSize: "0.9rem",
              marginBottom: "20px",
              display: "inline-block",
            }}
          >
            ← INDEX
          </Link>
          <div
            style={{
              color: "var(--blog-accent)",
              fontSize: "0.9rem",
              marginBottom: "10px",
            }}
          >
            {post.date} // {post.tag}
          </div>
          <h1 className="blog-title" style={{ fontSize: "2.5rem" }}>
            {post.title}
          </h1>
        </header>

        <main className="blog-post-layout">
          <aside className="blog-sidebar" style={{ position: "sticky", top: "100px" }}>
            <h3 className="blog-toc-title">Table of Contents</h3>
            <ul className="blog-toc-list">
              {toc.map((item) => (
                <li key={item.id} className="blog-toc-item">
                  <a href={`#${item.id}`} className="blog-toc-link">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <article className="blog-content">
            <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />

            <div
              style={{
                marginTop: "80px",
                paddingTop: "40px",
                borderTop: "1px solid var(--blog-border)",
              }}
            >
              <Link href="/blog" className="blog-toc-link">
                ← Back to Index
              </Link>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}

// Helper to extract headings from HTML content
function extractHeadingsFromHtml(html: string): TOCItem[] {
  const headingRegex = /<h2[^>]*id="([^"]*)"[^>]*>([^<]*)<\/h2>/gi;
  const headings: TOCItem[] = [];
  let match;

  // First try to find h2 with id attributes
  while ((match = headingRegex.exec(html)) !== null) {
    headings.push({ id: match[1], label: match[2] });
  }

  // If no h2 with ids, extract h2 text and generate ids
  if (headings.length === 0) {
    const simpleH2Regex = /<h2[^>]*>([^<]*)<\/h2>/gi;
    while ((match = simpleH2Regex.exec(html)) !== null) {
      const label = match[1];
      const id = label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      headings.push({ id, label });
    }
  }

  return headings;
}
