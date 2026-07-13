import { projects } from "@/data/projects";
import { FeatureItem } from "./FeatureItem";
import { Wordmark } from "./Wordmark";

export function FeaturePanel() {
  return (
    <div className="hw-feature-parallax">
      <section id="projects" className="hw-feature-panel bg-[var(--hw-paper)] text-[var(--hw-fg)] relative pt-[calc(100*var(--u))]">
        <div className="flex absolute top-[calc(100*var(--u))] right-[var(--hw-gutter)] z-2">
          <span className="hw-mono border border-current px-[calc(15*var(--u))] py-[calc(10*var(--u))] text-[0.75rem] opacity-90">
            Projects
          </span>
          <span className="hw-mono border border-current px-[calc(15*var(--u))] py-[calc(10*var(--u))] text-[0.75rem] opacity-90 not-first:border-l-0">
            Preview
          </span>
        </div>

        <div className="relative z-1 grid grid-cols-1 gap-x-[calc(30*var(--u))] gap-y-[calc(150*var(--u))] pt-[calc(160*var(--u))] px-[var(--hw-gutter)] max-md:gap-y-[calc(90*var(--u))] md:grid-cols-3">
          {projects.map((project) => (
            <FeatureItem
              key={project.slug}
              number={project.number}
              title={project.title}
              techStack={project.techStack}
              description={project.description}
              image={project.image}
              link={`/projects/${project.slug}`}
            />
          ))}
        </div>

        <Wordmark />
      </section>
    </div>
  );
}
