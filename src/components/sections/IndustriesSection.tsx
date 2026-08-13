import Link from 'next/link';
import type { Industry } from '@prisma/client';
import { ArrowUpRight } from 'lucide-react';
import { Icon } from '@/components/shared/Icon';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { StaggerGroup, StaggerItem } from '@/components/shared/Reveal';

export function IndustriesSection({ industries }: { industries: Industry[] }) {
  if (industries.length === 0) return null;

  return (
    <section className="border-y border-border bg-surface/40 py-24" aria-labelledby="industries-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Industries"
          title={<span id="industries-heading">Built for the sectors that cannot afford downtime</span>}
          description="Each sector brings its own compliance requirements, uptime expectations and physical constraints. We plan for them before the first cable is pulled."
        />

        <StaggerGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry) => (
            <StaggerItem key={industry.id} className="h-full">
              <Link
                href={`/industries#${industry.slug}`}
                className="card-hover group flex h-full flex-col rounded-2xl border border-border bg-card/70 p-6"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-secondary">
                  <Icon name={industry.icon} className="size-5" />
                </span>

                <h3 className="mt-5 flex items-start justify-between gap-2 font-heading text-base font-semibold text-foreground">
                  {industry.title}
                  <ArrowUpRight
                    className="size-4 shrink-0 text-subtle transition-colors group-hover:text-secondary"
                    aria-hidden="true"
                  />
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-muted">{industry.description}</p>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
