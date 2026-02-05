"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import AsciiLogo from "@/components/AsciiLogo";
import "./blog.css";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  tag: string;
  category: string;
  excerpt: string;
}

interface NavSection {
  id: string;
  label: string;
  items: { label: string; slug: string; tag?: string }[];
}

type BlogTheme = "portfolio" | "terminal";

export default function BlogIndex() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>(["home"]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<BlogTheme>("portfolio");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

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

  useEffect(() => {
    fetch("/api/blog/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // Group posts by category for navigation
  const navSections: NavSection[] = [
    {
      id: "home",
      label: "Home",
      items: [{ label: "README", slug: "readme" }],
    },
    {
      id: "nlp",
      label: "Natural Language Processing",
      items: posts
        .filter((p) => p.category === "nlp")
        .map((p) => ({
          label: p.title.split(":")[0].trim(),
          slug: p.slug,
          tag: "NLP",
        })),
    },
    {
      id: "llm",
      label: "LLM & RAG Systems",
      items: posts
        .filter((p) => p.category === "llm")
        .map((p) => ({
          label: p.title.split(":")[0].trim(),
          slug: p.slug,
          tag: "RAG",
        })),
    },
    {
      id: "cv",
      label: "Computer Vision",
      items: posts
        .filter((p) => p.category === "cv")
        .map((p) => ({
          label: p.title.split(":")[0].trim(),
          slug: p.slug,
          tag: "CV",
        })),
    },
  ].filter((section) => section.id === "home" || section.items.length > 0);

  return (
    <div className="blog-theme-root">
      {/* Top Navigation Bar */}
      <nav className="blog-topbar">
        <Link href="/" className="blog-brand">
          <span className="blog-brand-icon">◈</span>
          <span className="blog-brand-text">Lothnic</span>
        </Link>

        <span className="blog-topbar-title">Technical Blog</span>

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
          <button
            className="blog-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="blog-layout">
        {/* Sidebar */}
        <aside className={`blog-sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <div className="blog-sidebar-header">
            <h2 className="blog-sidebar-title">Table of Contents</h2>
          </div>

          {navSections.map((section) => (
            <div
              key={section.id}
              className={`blog-nav-section ${expandedSections.includes(section.id) ? "expanded" : ""
                }`}
            >
              <div
                className={`blog-nav-header ${expandedSections.includes(section.id) ? "active" : ""
                  }`}
                onClick={() => toggleSection(section.id)}
              >
                <span className="blog-nav-label">{section.label}</span>
                <span className="blog-nav-toggle">
                  {expandedSections.includes(section.id) ? "−" : "+"}
                </span>
              </div>
              <ul className="blog-nav-items">
                {section.items.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      href={item.slug ? `/blog/${item.slug}` : "/blog"}
                      className="blog-nav-item"
                    >
                      {item.label}
                      {item.tag && <span className="blog-nav-tag">{item.tag}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        {/* Main Content */}
        <main className="blog-main">
          <AsciiLogo
            variant="dotted"
            onAnimationComplete={() => setAnimationComplete(true)}
          />

          {loading ? (
            <p style={{ color: "var(--blog-text-secondary)", marginTop: "20px" }}>
              Loading posts<span className="blog-cursor"></span>
            </p>
          ) : animationComplete ? (
            <div className="recent-blogs-section">
              <h3 className="recent-blogs-title">Recent Posts</h3>
              <div className="recent-blogs-grid">
                {posts.slice(0, 3).map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="recent-blog-card"
                  >
                    <span className="recent-blog-tag">{post.tag}</span>
                    <h4 className="recent-blog-title">{post.title}</h4>
                    <p className="recent-blog-excerpt">{post.excerpt}</p>
                  </Link>
                ))}
              </div>
              <Link href="/blog/readme" className="blog-readme-link">
                README
              </Link>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
