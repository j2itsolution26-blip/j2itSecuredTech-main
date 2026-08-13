import Link from 'next/link';
import { ArrowRight, CheckCircle2, TriangleAlert } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { Reveal } from '@/components/shared/Reveal';
import { JsonLd } from '@/components/shared/JsonLd';
import { Icon } from '@/components/shared/Icon';
import { CallToAction } from '@/components/sections/CallToAction';
import { EmptyState } from '@/components/ui/feedback';
import { Button } from '@/components/ui/button';
import { getIndustries } from '@/lib/data/marketing';
import { getSettings } from '@/lib/data/settings';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'Industries We Serve',
  description:
    'Tailored IT, security and infrastructure solutions for government, healthcare, education, hospitality, retail, logistics, construction and manufacturing organisations.',
  path: '/industries',
});

export default async function IndustriesPage() {
  const [industries, settings] = await Promise.all([getIndustries(), getSettings()]);

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Industries', path: '/industries' }])} />

      <PageHero
        eyebrow="Industries"
        title="Sector-specific constraints, solved by people who have met them before"
        description="A hospital ward, a warehouse ceiling and a campus quadrangle each defeat a generic network design. We plan around the environment you actually operate in."
        breadcrumbs={[{ name: 'Industries', path: '/industries' }]}
      />

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {industries.length === 0 ? (
          <EmptyState
            title="Industry profiles coming soon"
            description="We are preparing detailed sector guidance. In the meantime, contact us to discuss your environment directly."
            action={
              <Button asChild variant="outline">
                <Link href="/contact">Contact us</Link>
              </Button>
            }
          />
        ) : (
          <div className="flex flex-col gap-8">
            {industries.map((industry, index) => (
              <Reveal key={industry.id} delay={index * 0.04}>
                <article
                  id={industry.slug}
                  className="scroll-mt-28 rounded-2xl border border-border bg-card/70 p-8 lg:p-10"
                >
                  <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
                    <div>
                      <span className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-secondary/15 text-secondary">
                        <Icon name={industry.icon} className="size-6" />
                      </span>
                      <h2 className="mt-5 font-heading text-2xl font-bold text-foreground">
                        {industry.title}
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-muted">{industry.description}</p>

                      <Button asChild variant="ghost" className="mt-6 px-0">
                        <Link href={`/request-quote?service=${encodeURIComponent(industry.title)}`}>
                          Discuss your requirement
                          <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>
                      </Button>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      {industry.challenges.length > 0 ? (
                        <div>
                          <h3 className="flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-wider text-warning">
                            <TriangleAlert className="size-4" aria-hidden="true" />
                            Common challenges
                          </h3>
                          <ul className="mt-4 flex flex-col gap-2.5">
                            {industry.challenges.map((challenge) => (
                              <li key={challenge} className="flex items-start gap-2 text-sm text-muted">
                                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-warning/70" aria-hidden="true" />
                                {challenge}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {industry.solutions.length > 0 ? (
                        <div>
                          <h3 className="flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-wider text-success">
                            <CheckCircle2 className="size-4" aria-hidden="true" />
                            How we solve them
                          </h3>
                          <ul className="mt-4 flex flex-col gap-2.5">
                            {industry.solutions.map((solution) => (
                              <li key={solution} className="flex items-start gap-2 text-sm text-slate-300">
                                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-success" aria-hidden="true" />
                                {solution}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      <CallToAction phone={settings['contact.phone']} />
    </>
  );
}
