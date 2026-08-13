import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ServiceCard as ServiceCardData } from '@/lib/data/services';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { StaggerGroup, StaggerItem } from '@/components/shared/Reveal';
import { Button } from '@/components/ui/button';

export function ServicesOverview({ services }: { services: ServiceCardData[] }) {
  if (services.length === 0) return null;

  return (
    <section className="relative py-24" aria-labelledby="services-heading">
      <div className="gradient-glow left-0 top-1/3 h-96 w-96 bg-primary/25" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What we do"
          title={<span id="services-heading">One partner for software, security and infrastructure</span>}
          description="From line-of-business systems to the cabling they run on, every layer is designed, installed and supported by the same accountable team."
        />

        <StaggerGroup className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <StaggerItem key={service.id} className="h-full">
              <ServiceCard service={service} />
            </StaggerItem>
          ))}
        </StaggerGroup>

        <div className="mt-12 flex justify-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/services">
              View all services
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
