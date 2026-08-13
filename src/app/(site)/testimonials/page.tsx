import Link from 'next/link';
import { PageHero } from '@/components/shared/PageHero';
import { StaggerGroup, StaggerItem } from '@/components/shared/Reveal';
import { JsonLd } from '@/components/shared/JsonLd';
import { TestimonialCard } from '@/components/cards/TestimonialCard';
import { CallToAction } from '@/components/sections/CallToAction';
import { EmptyState } from '@/components/ui/feedback';
import { Button } from '@/components/ui/button';
import { getTestimonials } from '@/lib/data/marketing';
import { getSettings } from '@/lib/data/settings';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'Client Testimonials',
  description:
    'Read what IT managers, operations leads and project sponsors say about working with J2 SecureTech on software, network and security deployments.',
  path: '/testimonials',
});

export default async function TestimonialsPage() {
  const [testimonials, settings] = await Promise.all([getTestimonials(), getSettings()]);

  const averageRating = testimonials.length
    ? (testimonials.reduce((total, item) => total + item.rating, 0) / testimonials.length).toFixed(1)
    : null;

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Testimonials', path: '/testimonials' }])} />

      <PageHero
        eyebrow="Client feedback"
        title="Accountability, measured by the people who live with the system"
        description={
          averageRating
            ? `Averaging ${averageRating} out of 5 across ${testimonials.length} verified client reviews collected after project handover.`
            : 'Feedback gathered from project sponsors and IT managers after handover and during maintenance reviews.'
        }
        breadcrumbs={[{ name: 'Testimonials', path: '/testimonials' }]}
      />

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {testimonials.length === 0 ? (
          <EmptyState
            title="No testimonials published yet"
            description="Client reviews are added as projects complete their post-handover review."
            action={
              <Button asChild variant="outline">
                <Link href="/portfolio">Browse case studies</Link>
              </Button>
            }
          />
        ) : (
          <StaggerGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <StaggerItem key={testimonial.id} className="h-full">
                <TestimonialCard testimonial={testimonial} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </div>

      <CallToAction
        title="Want a reference call?"
        description="We can arrange a conversation with a client operating a comparable deployment in your sector."
        phone={settings['contact.phone']}
      />
    </>
  );
}
