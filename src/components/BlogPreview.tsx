import Link from "next/link";

export default function BlogPreview() {
  return (
    <section className="blog section" id="blog">
      <div className="container">
        <div className="blog-section-header">
          <div>
            <span className="section-label">BL0G</span>
            <h2 className="section-title">LATEST P0STS</h2>
          </div>
          <Link href="/blog" className="btn">
            VIEW ALL P0STS
          </Link>
        </div>

        <div className="blog-grid">
          <article className="blog-card">
            <div className="blog-card-meta">
              <span className="blog-date">DEC 24, 2024</span>
              <span className="blog-read-time">8 MIN READ</span>
            </div>
            <h3 className="blog-card-title">
              <Link href="/blog/blog1">
                Lost in Alignment : Building a Word-Matching Engine for Any
                Language Pair
              </Link>
            </h3>
            <p className="blog-card-excerpt">
              Identifying correspondences between words in different languages: A
              technical deep dive into word alignment for NMT.
            </p>
            <Link href="/blog/blog1" className="blog-more-link">
              READ M0RE →
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
