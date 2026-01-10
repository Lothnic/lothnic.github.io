import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostWithContent, getPostSlugs, formatDate, extractHeadings } from "@/lib/blog";
import "../blog.css";

// Generate static paths for all blog posts
export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostWithContent(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostWithContent(slug);

  if (!post) {
    notFound();
  }

  // Extract headings for table of contents
  const toc = post.content ? extractHeadingsFromHtml(post.content) : [];

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
          <span className="blog-topbar-link">Terminal</span>
          <span className="blog-topbar-link active">Light green</span>
          <span className="blog-topbar-link">Light</span>
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
            {formatDate(post.date)} // {post.tag}
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
function extractHeadingsFromHtml(html: string): { id: string; label: string }[] {
  const headingRegex = /<h2[^>]*id="([^"]*)"[^>]*>([^<]*)<\/h2>/gi;
  const headings: { id: string; label: string }[] = [];
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
