import Link from "next/link";

export function FeatureItem({
  number,
  title,
  techStack,
  description,
  image,
  link,
}: {
  number: string;
  title: string;
  techStack: string;
  description: string;
  image: string;
  link?: string;
}) {
  return (
    <article className="group flex flex-col gap-[calc(60*var(--u))] text-left">
      <div className="flex flex-col gap-[calc(50*var(--u))] pr-[calc(180*var(--u))] max-md:pr-0">
        <p className="hw-mono text-[var(--hw-text-eyebrow)] tracking-[0.18em] opacity-80">
          #{number} {techStack}
        </p>
        <h2 className="w-[calc(486*var(--u))] max-w-full text-[calc(64*var(--u))] leading-none font-light normal-case">
          {link ? (
            <Link href={link} className="hover:no-underline">
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
      </div>
      <div className="hw-noise bg-[var(--hw-bg)] relative aspect-[666/574] overflow-hidden border border-transparent group-hover:border-current/20 transition-colors">
        {link ? (
          <Link href={link} className="block size-full">
            <img
              src={image}
              alt=""
              className="hw-parallax pointer-events-none absolute inset-0 size-full object-cover hw-project-image transition-transform duration-500 ease-out group-hover:scale-[1.05]"
            />
          </Link>
        ) : (
          <img
            src={image}
            alt=""
            className="hw-parallax pointer-events-none absolute inset-0 size-full object-cover hw-project-image"
          />
        )}
      </div>
      <p className="hw-mono pr-[calc(180*var(--u))] text-[var(--hw-text-body)] leading-[1.4] opacity-90 max-md:pr-0">
        {description}
      </p>
      {link && (
        <Link
          href={link}
          className="hw-mono text-[var(--hw-text-body)] flex items-center gap-[calc(8*var(--u))] text-current opacity-80 hover:opacity-100 transition-opacity mt-[calc(-20*var(--u))] self-start"
        >
          <span>Read Writeup</span>
          <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-[calc(18*var(--u))] h-[calc(18*var(--u))] transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </Link>
      )}
    </article>
  );
}
