import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ServiceCategory } from '@prisma/client';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { PageHero } from '@/components/shared/PageHero';
import { StaggerGroup, StaggerItem } from '@/components/shared/Reveal';
import { JsonLd } from '@/components/shared/JsonLd';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { CallToAction } from '@/components/sections/CallToAction';
import { EmptyState } from '@/components/ui/feedback';
import { Button } from '@/components/ui/button';
import { getPublishedServices } from '@/lib/data/services';
import { getSettings } from '@/lib/data/settings';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { humanizeEnum } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'IT Services & Solutions',
  description:
    'Software and system development, IoT and automation, IT infrastructure and networking, cybersecurity, CCTV and security systems, telephone and communication systems, electronics and board-level repair, technology training and TESDA programmes from J2 SecureTech.',
  path: '/services',
});

/**
 * Display order for the published catalogue. WEBSITE, CLOUD, CONSULTING and
 * SUPPORT remain in the enum for historical records but carry no published
 * services; groups with no items are filtered out below.
 */
const CATEGORY_ORDER: ServiceCategory[] = [
  ServiceCategory.SOFTWARE,
  ServiceCategory.IOT,
  ServiceCategory.NETWORK,
  ServiceCategory.CYBERSECURITY,
  ServiceCategory.SECURITY,
  ServiceCategory.TELEPHONY,
  ServiceCategory.ELECTRONICS,
  ServiceCategory.TRAINING,
];

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getPublishedServices(), getSettings()]);

  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: services.filter((service) => service.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Services', path: '/services' }])} />

      <PageHero
        eyebrow="Services"
        title="Everything your technology stack needs, under one contract"
        description="Software, connectivity and physical security are rarely separate problems. We scope, build and maintain them together so accountability never falls between vendors."
        breadcrumbs={[{ name: 'Services', path: '/services' }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/request-quote">
              Request a Quote
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/portfolio">See delivered projects</Link>
          </Button>
        </div>
      </PageHero>

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {grouped.length === 0 ? (
          <EmptyState
            title="Services are being updated"
            description="Our service catalogue is currently being revised. Please contact us directly and we will scope your requirement."
            action={
              <Button asChild variant="outline">
                <Link href="/contact">Contact us</Link>
              </Button>
            }
          />
        ) : (
          <div className="flex flex-col gap-20">
            {grouped.map((group) => (
              <section key={group.category} aria-labelledby={`category-${group.category}`}>
                <div className="mb-8 flex items-center gap-4">
                  <h2
                    id={`category-${group.category}`}
                    className="font-heading text-2xl font-bold text-foreground"
                  >
                    {humanizeEnum(group.category)}
                  </h2>
                  <span className="h-px flex-1 bg-border" aria-hidden="true" />
                  <span className="text-xs text-subtle">
                    {group.items.length} {group.items.length === 1 ? 'service' : 'services'}
                  </span>
                </div>

                <StaggerGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((service) => (
                    <StaggerItem key={service.id} className="h-full">
                      <ServiceCard service={service} />
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </section>
            ))}
          </div>
        )}
      </div>

      <ProcessSection />
      <CallToAction phone={settings['contact.phone']} />
    </>
  );
}
