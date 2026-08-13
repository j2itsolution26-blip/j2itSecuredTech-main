import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { PortfolioCard } from '@/lib/data/portfolio';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { StaggerGroup, StaggerItem } from '@/components/shared/Reveal';
import { Button } from '@/components/ui/button';

export function FeaturedPortfolio({ projects }: { projects: PortfolioCard[] }) {
  if (projects.length === 0) return null;

  return (
    <section className="py-24" aria-labelledby="portfolio-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Selected work"
            title={<span id="portfolio-heading">Systems in production, not prototypes</span>}
            description="A sample of deployments currently running in hospitals, campuses, warehouses and government offices."
            className="max-w-2xl"
          />

          <Button asChild variant="outline" className="shrink-0">
            <Link href="/portfolio">
              All case studies
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <StaggerItem key={project.id} className="h-full">
              <ProjectCard project={project} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
