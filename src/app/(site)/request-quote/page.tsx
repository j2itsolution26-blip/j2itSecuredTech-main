import { Suspense } from 'react';
import { CheckCircle2, Clock3, FileText, ShieldCheck } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { Reveal } from '@/components/shared/Reveal';
import { JsonLd } from '@/components/shared/JsonLd';
import { QuoteForm } from '@/components/forms/QuoteForm';
import { Skeleton } from '@/components/ui/feedback';
import { getPublishedServices } from '@/lib/data/services';
import { getSettings } from '@/lib/data/settings';
import { SERVICE_OPTIONS } from '@/lib/constants';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { telHref } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'Request a Quote',
  description:
    'Request a documented proposal for enterprise software, website and e-commerce development, CCTV installation, structured cabling, networking or cloud services.',
  path: '/request-quote',
});

const EXPECTATIONS = [
  {
    icon: Clock3,
    title: 'Response within one business day',
    body: 'A solutions engineer acknowledges every request and confirms what additional information is needed.',
  },
  {
    icon: FileText,
    title: 'Documented proposal',
    body: 'You receive a solution architecture, bill of materials, schedule and fixed commercial terms — not a verbal estimate.',
  },
  {
    icon: ShieldCheck,
    title: 'Free technical survey',
    body: 'For infrastructure and security work we inspect the site before quoting, so the price reflects real conditions.',
  },
];

export default async function RequestQuotePage() {
  const [services, settings] = await Promise.all([getPublishedServices(), getSettings()]);

  // Prefer live catalogue titles, falling back to the static list before seeding.
  const serviceOptions = services.length > 0 ? services.map((service) => service.title) : [...SERVICE_OPTIONS];

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Request a Quote', path: '/request-quote' }])} />

      <PageHero
        eyebrow="Request a quote"
        title="Tell us what you need built, secured or connected"
        description="The more detail you provide, the more precise the proposal. Everything you submit is treated as confidential."
        breadcrumbs={[{ name: 'Request a Quote', path: '/request-quote' }]}
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <Reveal className="rounded-2xl border border-border bg-card/70 p-7 lg:p-9">
            <Suspense fallback={<Skeleton className="h-[720px] w-full" />}>
              <QuoteForm services={serviceOptions} />
            </Suspense>
          </Reveal>

          <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
            {EXPECTATIONS.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06}>
                <div className="rounded-2xl border border-border bg-card/70 p-6">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-secondary">
                    <item.icon className="size-5" aria-hidden="true" />
                  </span>
                  <h2 className="mt-4 font-heading text-base font-semibold text-foreground">{item.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
                </div>
              </Reveal>
            ))}

            <Reveal delay={0.2}>
              <div className="rounded-2xl border border-secondary/20 bg-primary/5 p-6">
                <h2 className="flex items-center gap-2 font-heading text-base font-semibold text-foreground">
                  <CheckCircle2 className="size-4 text-success" aria-hidden="true" />
                  Prefer to speak first?
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Call{' '}
                  <a
                    href={telHref(settings['contact.phone'])}
                    className="text-secondary hover:underline"
                  >
                    {settings['contact.phone']}
                  </a>{' '}
                  or email{' '}
                  <a href={`mailto:${settings['contact.salesEmail']}`} className="text-secondary hover:underline">
                    {settings['contact.salesEmail']}
                  </a>
                  .
                </p>
                <p className="mt-3 text-xs text-subtle">{settings['contact.hours']}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
}
