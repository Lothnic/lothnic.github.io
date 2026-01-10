import Link from "next/link";

export default function Resume() {
  return (
    <section className="resume section" id="resume">
      <div className="container">
        <div className="resume-header">
          <div>
            <span className="section-label">RESUME</span>
            <h2 className="section-title">EXPERIENCE & EDUCATI0N</h2>
          </div>
          <Link href="/resume.pdf" className="btn" id="downloadResume" download target="_blank">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
            D0WNL0AD RESUME
          </Link>
        </div>

        <div className="resume-grid">
          <div className="resume-column">
            <h3>EXPERIENCE</h3>
            <div className="timeline">
              <div className="timeline-item">
                <span className="timeline-date">2025 - PRESENT</span>
                <h4 className="timeline-title">ML DEVEL0PER</h4>
                <span className="timeline-company">IIIT Una</span>
                <p className="timeline-description">
                  Worked on a Time Table scheduling project using Genetic Algorithm
                  and Machine Learning Techniques.
                </p>
              </div>
            </div>
          </div>

          <div className="resume-column">
            <h3>EDUCATI0N</h3>
            <div className="timeline">
              <div className="timeline-item">
                <span className="timeline-date">2024 - 2028</span>
                <h4 className="timeline-title">
                  B.TECH ELECTRONICS AND COMMUNICATION ENGINEERING
                </h4>
                <span className="timeline-company">IIIT Una</span>
                <p className="timeline-description">
                  Specialized in Machine Learning and Artificial Intelligence.
                </p>
              </div>
              <div className="timeline-item">
                <span className="timeline-date">CERTIFICATI0NS</span>
                <h4 className="timeline-title">ML SPECIALIZATI0NS</h4>
                <span className="timeline-company">Coursera / DeepLearning.AI</span>
                <p className="timeline-description">
                  Deep Learning Specialization, NLP Specialization, MLOps
                  Specialization
                </p>
              </div>
              <div className="timeline-item">
                <span className="timeline-date">CERTIFICATI0NS</span>
                <h4 className="timeline-title">Data Analysis</h4>
                <span className="timeline-company">Datacamp</span>
                <p className="timeline-description">
                  Data Analysis Specialization
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
