export default function About() {
  return (
    <section className="about section" id="about">
      <div className="container">
        <span className="section-label">AB0UT</span>
        <h2 className="section-title">BUILDING INTELLIGENT SYSTEMS</h2>

        <div className="about-grid">
          <div className="about-content">
            <p className="about-text">
              I&apos;m <strong>Mayank Joshi</strong>, an ML Developer passionate
              about creating intelligent systems that solve real-world problems.
              With expertise in <strong>Neural Machine Translation</strong>,{" "}
              <strong>Generative AI</strong>, and <strong>Computer Vision</strong>,
              I bridge the gap between cutting-edge research and practical
              applications.
            </p>
            <p className="about-text">
              My work focuses on developing robust machine learning pipelines,
              from data preprocessing to model deployment. I believe in writing
              clean, maintainable code and building systems that scale.
            </p>
            <p className="about-text">
              Currently <strong>open to new opportunities</strong> where I can
              contribute to innovative ML projects and collaborate with talented
              teams.
            </p>
          </div>

          <div className="skills-section">
            <h3 className="skills-title">TECHN0L0GIES & T00LS</h3>
            <div className="skills-grid">
              <span className="skill-item">Python</span>
              <span className="skill-item">PyTorch</span>
              <span className="skill-item">TensorFlow</span>
              <span className="skill-item">Hugging Face</span>
              <span className="skill-item">OpenCV</span>
              <span className="skill-item">LangChain</span>
              <span className="skill-item">FastAPI</span>
              <span className="skill-item">Docker</span>
              <span className="skill-item">AWS/GCP</span>
              <span className="skill-item">MLflow</span>
              <span className="skill-item">Weights & Biases</span>
              <span className="skill-item">Git</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
