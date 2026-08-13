import Link from 'next/link';
import { Reveal } from '@/components/shared/Reveal';

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

/**
 * Shared renderer for policy documents so Privacy and Terms stay structurally
 * identical — including the in-page contents list used for navigation.
 */
export function LegalDocument({
  sections,
  lastUpdated,
}: {
  sections: LegalSection[];
  lastUpdated: string;
}) {
  const slugFor = (heading: string) =>
    heading.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[240px_1fr]">
        <nav aria-label="Document contents" className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="font-heading text-xs font-semibold uppercase tracking-wider text-subtle">
            Contents
          </h2>
          <ol className="mt-4 flex flex-col gap-2">
            {sections.map((section, index) => (
              <li key={section.heading}>
                <Link
                  href={`#${slugFor(section.heading)}`}
                  className="text-sm text-muted transition-colors hover:text-secondary"
                >
                  <span className="mr-2 text-xs text-subtle">{index + 1}.</span>
                  {section.heading}
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <article className="max-w-3xl">
          <p className="text-sm text-subtle">Last updated: {lastUpdated}</p>

          <div className="mt-8 flex flex-col gap-12">
            {sections.map((section, index) => (
              <Reveal key={section.heading} delay={index * 0.02}>
                <section id={slugFor(section.heading)} className="scroll-mt-28">
                  <h2 className="font-heading text-xl font-bold text-foreground">
                    {index + 1}. {section.heading}
                  </h2>

                  {section.paragraphs?.map((paragraph) => (
                    <p key={paragraph} className="mt-4 text-sm leading-relaxed text-muted">
                      {paragraph}
                    </p>
                  ))}

                  {section.bullets ? (
                    <ul className="mt-4 flex flex-col gap-2.5">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-secondary" aria-hidden="true" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              </Reveal>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
