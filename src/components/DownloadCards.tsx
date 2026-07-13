"use client";

import Link from "next/link";

export function DownloadCards() {
  const cards = [
    {
      label: "Writing Stuff",
      title: "Blogs",
      img: "/images/desktop/platform-art-mac.webp",
      href: "/blog",
      btnText: "Read",
    },
    {
      label: "My Slop",
      title: "Projects",
      img: "/images/desktop/platform-art-windows.webp",
      href: "/projects",
      btnText: "Browse",
    },
    {
      label: "CV",
      title: "Resume",
      img: "/images/desktop/platform-art-linux.webp",
      href: "/resume.pdf",
      btnText: "Download",
    },
  ];

  return (
    <section
      id="downloads"
      className="relative z-1 grid grid-cols-1 gap-[var(--hw-gap)] px-[var(--hw-gutter)] pt-[calc(60*var(--u))] pb-[calc(120*var(--u))] md:grid-cols-3"
    >
      {cards.map((card) => (
        <div
          key={card.title}
          className="group hw-noise hw-vignette bg-[var(--hw-bg)] relative flex aspect-[627/547] flex-col items-center justify-center overflow-hidden text-center max-md:aspect-[2/1]"
        >
          <img
            src={card.img}
            alt=""
            loading="eager"
            className="pointer-events-none absolute inset-0 size-full object-cover opacity-45 transition-all duration-700 ease-out group-hover:opacity-60 hw-download-image"
          />
          <span className="hw-arc" />
          <div className="relative z-2 flex flex-col items-center gap-[calc(30*var(--u))]">
            <p className="hw-mono text-[var(--hw-text-eyebrow)] tracking-[0.18em] opacity-70">
              {card.label}
            </p>
            <h3 className="text-[calc(64*var(--u))] leading-none font-normal normal-case">
              {card.title}
            </h3>
            <Link
              href={card.href}
              className="group bg-[var(--hw-bg)] text-[var(--hw-fg)] relative inline-flex items-center px-[calc(30*var(--u))] py-[calc(20*var(--u))] shadow-[0_4px_14px_rgba(0,0,0,0.25)] transition-colors hover:bg-[var(--hw-accent)] hover:text-[var(--hw-bg)] pl-[calc(68*var(--u))]"
              {...(card.title === "Resume" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <svg
                fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"
                className="absolute"
                style={{ width: "calc(26 * var(--u))", height: "calc(26 * var(--u))", top: "50%", left: "calc(30 * var(--u))", transform: "translateY(-50%)" }}
              >
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
              <span className="hw-mono text-[var(--hw-text-body)] leading-none">{card.btnText}</span>
            </Link>
          </div>
        </div>
      ))}
    </section>
  );
}
