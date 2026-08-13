import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowRight, Check, Package } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { Reveal } from '@/components/shared/Reveal';
import { JsonLd } from '@/components/shared/JsonLd';
import { Icon } from '@/components/shared/Icon';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { CallToAction } from '@/components/sections/CallToAction';
import { Button } from '@/components/ui/button';
import { getPublishedServices, getServiceBySlug } from '@/lib/data/services';
import { getSettings } from '@/lib/data/settings';
import { breadcrumbSchema, buildMetadata, serviceSchema } from '@/lib/seo';
import { humanizeEnum, truncate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return buildMetadata({
      title: 'Service not found',
      description: 'The requested service could not be found.',
      path: `/services/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: service.metaTitle || service.title,
    description: service.metaDesc || truncate(service.summary, 155),
    path: `/services/${service.slug}`,
    image: service.image,
  });
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) notFound();

  const [allServices, settings] = await Promise.all([getPublishedServices(), getSettings()]);
  const related = allServices
    .filter((item) => item.slug !== service.slug && item.category === service.category)
    .slice(0, 3);

  const breadcrumbs = [
    { name: 'Services', path: '/services' },
    { name: service.title, path: `/services/${service.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbs),
          serviceSchema({
            name: service.title,
            description: service.summary,
            path: `/services/${service.slug}`,
            serviceType: humanizeEnum(service.category),
          }),
        ]}
      />

      <PageHero
        eyebrow={humanizeEnum(service.category)}
        title={service.title}
        description={service.summary}
        breadcrumbs={breadcrumbs}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href={`/request-quote?service=${encodeURIComponent(service.title)}`}>
              Request a Quote
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">Talk to an engineer</Link>
          </Button>
        </div>
      </PageHero>

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col gap-12">
            {service.image ? (
              <Reveal className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </Reveal>
            ) : null}

            <Reveal>
              <h2 className="font-heading text-2xl font-bold text-foreground">Overview</h2>
              <div
                className="prose-article mt-5"
                dangerouslySetInnerHTML={{ __html: service.description }}
              />
            </Reveal>

            {service.features.length > 0 ? (
              <Reveal>
                <h2 className="font-heading text-2xl font-bold text-foreground">What is included</h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 rounded-xl border border-border bg-card/60 p-4 text-sm text-slate-300"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-border bg-card/70 p-7">
              <span className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-secondary/15 text-secondary">
                <Icon name={service.icon} className="size-6" />
              </span>

              {service.deliverables.length > 0 ? (
                <>
                  <h2 className="mt-6 flex items-center gap-2 font-heading text-base font-semibold text-foreground">
                    <Package className="size-4 text-secondary" aria-hidden="true" />
                    Deliverables
                  </h2>
                  <ul className="mt-4 flex flex-col gap-2.5">
                    {service.deliverables.map((deliverable) => (
                      <li key={deliverable} className="flex items-start gap-2 text-sm text-muted">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-secondary" aria-hidden="true" />
                        {deliverable}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              <div className="mt-7 border-t border-border pt-6">
                <p className="text-sm text-muted">
                  Need this scoped against your site conditions? We run free technical surveys across
                  Metro Manila and key regional centres.
                </p>
                <Button asChild block className="mt-5">
                  <Link href={`/request-quote?service=${encodeURIComponent(service.title)}`}>
                    Book a site survey
                  </Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>

        {related.length > 0 ? (
          <section className="mt-24" aria-labelledby="related-services">
            <h2 id="related-services" className="font-heading text-2xl font-bold text-foreground">
              Related services
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ServiceCard key={item.id} service={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <CallToAction phone={settings['contact.phone']} />
    </>
  );
}
