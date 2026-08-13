import { DELIVERY_PROCESS } from '@/lib/constants';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Reveal } from '@/components/shared/Reveal';

export function ProcessSection() {
  return (
    <section className="border-y border-border bg-surface/40 py-24" aria-labelledby="process-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How we deliver"
          title={<span id="process-heading">A predictable path from survey to sign-off</span>}
          description="Every engagement follows the same five stages, so you always know what happens next and what is expected from your team."
        />

        <ol className="relative mt-16 grid gap-8 lg:grid-cols-5">
          {/* Connecting rail, desktop only. */}
          <span
            className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block"
            aria-hidden="true"
          />

          {DELIVERY_PROCESS.map((stage, index) => (
            <li key={stage.step} className="relative">
              <Reveal delay={index * 0.08}>
                <span className="relative z-10 flex size-12 items-center justify-center rounded-xl border border-secondary/25 bg-background font-heading text-sm font-bold text-secondary">
                  {stage.step}
                </span>
                <h3 className="mt-5 font-heading text-base font-semibold text-foreground">{stage.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">{stage.description}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
