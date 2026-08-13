import { Reveal } from '@/components/shared/Reveal';
import { COMMITMENT, COMPANY_INFO } from '@/lib/constants';

/**
 * Closing statement on the home page. The full commitment sits on the About
 * page; this band carries the headline and strapline before the call to action.
 */
export function CommitmentBand() {
  return (
    <section className="border-y border-border bg-surface/40 py-20" aria-labelledby="commitment-band">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-secondary">
            Our commitment
          </p>
          <h2
            id="commitment-band"
            className="mt-5 font-heading text-3xl font-bold text-foreground sm:text-4xl"
          >
            At {COMPANY_INFO.name}, {COMMITMENT.headline}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted">{COMMITMENT.body}</p>
          <p className="mt-10 font-heading text-lg font-semibold text-secondary">
            {COMPANY_INFO.fullTagline}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
