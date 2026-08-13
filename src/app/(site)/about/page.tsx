import Link from 'next/link';
import { ArrowRight, BadgeCheck, Building2, Compass, Target } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/shared/Reveal';
import { JsonLd } from '@/components/shared/JsonLd';
import { Counter } from '@/components/shared/Counter';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { CallToAction } from '@/components/sections/CallToAction';
import { Button } from '@/components/ui/button';
import { CERTIFICATIONS, COMPANY_INFO, STATS, VALUE_PROPS } from '@/lib/constants';
import { Icon } from '@/components/shared/Icon';
import { getSettings } from '@/lib/data/settings';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'About Us',
  description:
    'J2 SecureTech is an engineering-led IT solutions provider delivering enterprise software, secure networks and surveillance infrastructure for institutions across the Philippines.',
  path: '/about',
});

const PILLARS = [
  {
    icon: Target,
    title: 'Our mission',
    body: 'To give organisations technology they can rely on without needing an in-house engineering department — designed properly, documented fully and supported for its whole life.',
  },
  {
    icon: Compass,
    title: 'Our approach',
    body: 'Survey before design, design before purchase. We refuse to quote infrastructure we have not inspected, because assumptions are what make projects overrun.',
  },
  {
    icon: Building2,
    title: 'Our clients',
    body: 'Government offices, hospitals, universities, hotels, retail chains, warehouses and manufacturers — environments where downtime carries real operational cost.',
  },
];

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'About', path: '/about' }])} />

      <PageHero
        eyebrow="Who we are"
        title="Engineering-led technology for organisations that cannot afford downtime"
        description={`Founded in ${COMPANY_INFO.founded}, ${COMPANY_INFO.name} brings software engineering, network infrastructure and physical security under a single accountable team — so systems are designed together rather than patched together.`}
        breadcrumbs={[{ name: 'About', path: '/about' }]}
      >
        <p className="mb-6 text-sm font-semibold uppercase tracking-[0.16em] text-secondary">
          {COMPANY_INFO.fullTagline}
        </p>
        <Button asChild size="lg">
          <Link href="/contact">
            Talk to our team
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </PageHero>

      <section className="border-b border-border bg-surface/40 py-16" aria-label="Company metrics">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {STATS.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.08} className="text-center">
              <p className="font-heading text-4xl font-bold text-white">
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={'decimals' in stat ? stat.decimals : 0}
                />
              </p>
              <p className="mt-2 text-sm text-muted">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StaggerGroup className="grid gap-6 lg:grid-cols-3">
            {PILLARS.map((pillar) => (
              <StaggerItem key={pillar.title} className="h-full">
                <article className="flex h-full flex-col rounded-2xl border border-border bg-card/70 p-8">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-primary/15 text-secondary">
                    <pillar.icon className="size-6" aria-hidden="true" />
                  </span>
                  <h2 className="mt-6 font-heading text-xl font-semibold text-foreground">{pillar.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{pillar.body}</p>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="border-y border-border bg-surface/40 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr]">
            <SectionHeading
              align="left"
              eyebrow="Standards"
              title="Credentials that matter on a tender document"
              description="Institutional procurement requires more than a price list. Our documentation, certifications and warranty terms are prepared for formal evaluation."
            />

            <div className="flex flex-col gap-4">
              {CERTIFICATIONS.map((certification, index) => (
                <Reveal key={certification} delay={index * 0.06}>
                  <div className="flex items-start gap-3 rounded-xl border border-border bg-card/60 p-5">
                    <BadgeCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
                    <p className="text-sm text-slate-300">{certification}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Commitments"
            title="What working with us actually means"
            description="These are the operating principles our clients hold us to, written into contracts rather than left as marketing claims."
          />

          <StaggerGroup className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {VALUE_PROPS.map((item) => (
              <StaggerItem key={item.title} className="h-full">
                <article className="card-hover flex h-full flex-col rounded-2xl border border-border bg-card/70 p-7">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-secondary/10 text-secondary">
                    <Icon name={item.icon} className="size-5" />
                  </span>
                  <h3 className="mt-5 font-heading text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <ProcessSection />
      <CallToAction phone={settings['contact.phone']} />
    </>
  );
}
