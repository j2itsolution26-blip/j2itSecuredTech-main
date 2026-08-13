import Link from 'next/link';
import type { Testimonial } from '@prisma/client';
import { ArrowRight } from 'lucide-react';
import { TestimonialCard } from '@/components/cards/TestimonialCard';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { StaggerGroup, StaggerItem } from '@/components/shared/Reveal';
import { Button } from '@/components/ui/button';

export function TestimonialsSection({
  testimonials,
  showViewAll = true,
}: {
  testimonials: Testimonial[];
  showViewAll?: boolean;
}) {
  if (testimonials.length === 0) return null;

  return (
    <section className="border-y border-border bg-surface/40 py-24" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Client feedback"
          title={<span id="testimonials-heading">What operations teams say after go-live</span>}
          description="Feedback collected from project sponsors and IT managers after handover and during maintenance reviews."
        />

        <StaggerGroup className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.id} className="h-full">
              <TestimonialCard testimonial={testimonial} />
            </StaggerItem>
          ))}
        </StaggerGroup>

        {showViewAll ? (
          <div className="mt-12 flex justify-center">
            <Button asChild variant="ghost">
              <Link href="/testimonials">
                Read all testimonials
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
