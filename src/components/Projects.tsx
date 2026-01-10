import Link from "next/link";

export default function Projects() {
  return (
    <section className="projects section" id="projects">
      <div className="container">
        <div className="projects-header">
          <div>
            <span className="projects-meta">03 PR0JECTS / 2025</span>
            <h2 className="section-title">SELECTED W0RK</h2>
          </div>
        </div>

        <div className="projects-grid">
          {/* Project 1: LINGO */}
          <article className="project-card">
            <Link
              href="https://github.com/lothnic/LINGO"
              target="_blank"
              className="project-image"
            >
              <div className="project-placeholder">🌐</div>
            </Link>
            <div className="project-info">
              <div className="project-info-row">
                <h3 className="project-title">
                  <Link href="https://github.com/lothnic/LINGO" target="_blank">
                    LINGO: KANGRI-HINDI NMT FOR ARGOS TRANSLATE
                  </Link>
                </h3>
                <div className="project-tags">
                  PYTHON / PYTORCH
                  <br />
                  OPENNMT-PY / CTRANSLATE2
                  <br />
                  SENTENCEPIECE / MODAL
                </div>
              </div>
              <p className="project-description">
                Built the first installable Kangri-Hindi MT package for Argos
                Translate. Trained a 6-layer Transformer from scratch on 26,779
                parallel pairs achieving BLEU 9.89 (Kangri→Hindi) and 9.04
                (Hindi→Kangri).
                <br />
                Naming Credits goes to my friend :{" "}
                <span className="raj-singh">
                  <Link href="https://github.com/zyphorixx" target="_blank">
                    Raj Singh
                  </Link>
                </span>
              </p>
              <div className="project-meta">
                <span>TYPE:</span>
                <span className="project-client-link">RESEARCH PR0JECT</span>
              </div>
              <div className="project-actions">
                <Link
                  href="https://github.com/lothnic/LINGO"
                  target="_blank"
                  className="btn btn-small"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GITHUB
                </Link>
                <Link
                  href="/blog"
                  className="btn btn-small btn-secondary"
                >
                  READ ARTICLE
                </Link>
              </div>
            </div>
          </article>

          {/* Project 2: FloatChat */}
          <article className="project-card">
            <Link href="#" className="project-image">
              <div className="project-placeholder">🌊</div>
            </Link>
            <div className="project-info">
              <div className="project-info-row">
                <h3 className="project-title">
                  <Link href="#">
                    FLOATCHAT: LLM-POWERED OCEANOGRAPHIC ANALYSIS
                  </Link>
                </h3>
                <div className="project-tags">
                  PYTHON / POSTGRESQL
                  <br />
                  LANGCHAIN / RAG
                  <br />
                  FASTAPI / AIRFLOW
                </div>
              </div>
              <p className="project-description">
                AI-powered data platform for Argo float NetCDF datasets. Processed
                580+ NetCDF files with RAG architecture for natural language-to-SQL
                query generation.
              </p>
              <div className="project-meta">
                <span>TYPE:</span>
                <span className="project-client-link">SIH PR0JECT</span>
              </div>
              <div className="project-actions">
                <Link
                  href="https://sih-project-omega.vercel.app"
                  className="btn btn-small btn-secondary"
                  target="_blank"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  WEBSITE
                </Link>
              </div>
            </div>
          </article>

          {/* Project 3: DeltaVision */}
          <article className="project-card">
            <Link href="#" className="project-image">
              <div className="project-placeholder">👁️</div>
            </Link>
            <div className="project-info">
              <div className="project-info-row">
                <h3 className="project-title">
                  <Link href="#">DELTAVISION: VISUAL DIFFERENCE ENGINE</Link>
                </h3>
                <div className="project-tags">
                  PYTHON / OPENCV
                  <br />
                  PYTORCH / CNN
                  <br />
                  STREAMLIT / CONVLSTM
                </div>
              </div>
              <p className="project-description">
                AI-powered visual inspection system with 90% faster inspection time.
                Features convolutional feature extractor, ConvLSTM temporal
                module, and RLHF-inspired feedback dashboard.
              </p>
              <div className="project-meta">
                <span>TYPE:</span>
                <span className="project-client-link">PERS0NAL PR0JECT</span>
              </div>
              <div className="project-actions">
                <Link
                  href="https://deltavision.streamlit.app"
                  target="_blank"
                  className="btn btn-small btn-secondary"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  Streamlit
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
