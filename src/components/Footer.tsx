export function Footer() {
  return (
    <footer className="hw-footer">
      <div className="hw-footer-cta">
        <p className="hw-mono text-[var(--hw-text-eyebrow)] tracking-[0.18em]">
          LET&apos;S BUILD THE FUTURE TOGETHER
        </p>

        <h2 className="text-[min(calc(112*var(--u)),8dvh)] leading-none font-light tracking-[0.03em] max-md:text-[2.6rem]">
          GET IN TOUCH
        </h2>

        <p className="hw-mono w-[calc(800*var(--u))] max-w-full text-[var(--hw-text-body)] leading-[1.4] opacity-90">
          Open to full-time opportunities, machine learning research collaborations, and systems/ML consulting.
        </p>

        <a
          href="mailto:joshimayank08012007@gmail.com"
          className="group bg-[var(--hw-fg)] text-[var(--hw-bg)] relative inline-flex items-center px-[calc(30*var(--u))] py-[calc(20*var(--u))] shadow-[0_4px_14px_rgba(0,0,0,0.25)] transition-colors hover:bg-[var(--hw-accent)] hover:text-[var(--hw-bg)]"
        >
          <span className="hw-mono text-[var(--hw-text-body)] leading-none">Send an Email</span>
        </a>
      </div>

      <div className="hw-footer-stage max-md:hidden">
        <img
          className="hw-footer-art"
          src="/images/desktop/adam_flipped.png"
          alt=""
          aria-hidden="true"
        />
        {/* <div className="hw-footer-wordmark-wrap">
          <div className="hw-ghost hw-footer-wordmark">
            <span>LOTH<span style={{ display: "inline-block", transform: "scaleX(-1)" }}>N</span>IC</span>
            <span data-portal-word>PORTFOLIO</span>
          </div>z
        </div> */}
      </div>

      <div className="hw-footer-meta">
        <p className="hw-mono text-[var(--hw-text-eyebrow)] leading-none max-md:text-[0.62rem]">
          PORTFOLIO V2.0
        </p>

        <div className="hw-mono flex flex-col items-end gap-[calc(8*var(--u))] text-right text-[var(--hw-text-eyebrow)] leading-none max-md:items-start max-md:text-left max-md:text-[0.62rem]">
          <p></p>
          <p>Lothnic &bull; 2026</p>
        </div>
      </div>
    </footer>
  );
}
