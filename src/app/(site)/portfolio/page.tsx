import Link from 'next/link';
import { PageHero } from '@/components/shared/PageHero';
import { StaggerGroup, StaggerItem } from '@/components/shared/Reveal';
import { JsonLd } from '@/components/shared/JsonLd';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { CallToAction } from '@/components/sections/CallToAction';
import { EmptyState } from '@/components/ui/feedback';
import { Button } from '@/components/ui/button';
import { getPortfolioCategories, getPortfolioProjects } from '@/lib/data/portfolio';
import { getSettings } from '@/lib/data/settings';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { cn, firstParam } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'Portfolio & Case Studies',
  description:
    'Enterprise software, e-commerce, CCTV, structured cabling and network projects delivered by J2 SecureTech for hospitals, universities, warehouses, hotels and government offices.',
  path: '/portfolio',
});

type PageProps = { searchParams: Promise<{ category?: string | string[] }> };

export default async function PortfolioPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const activeCategory = firstParam(params.category);

  const [projects, categories, settings] = await Promise.all([
    getPortfolioProjects(),
    getPortfolioCategories(),
    getSettings(),
  ]);

  const filtered = activeCategory
    ? projects.filter((project) => project.category === activeCategory)
    : projects;

  const filterClass =
    'rounded-full border px-4 py-2 text-sm font-medium transition-colors';

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Portfolio', path: '/portfolio' }])} />

      <PageHero
        eyebrow="Our work"
        title="Deployments running in production today"
        description="Every case study below reflects a live system — the technology stack, the constraints we worked within and the measurable outcome after handover."
        breadcrumbs={[{ name: 'Portfolio', path: '/portfolio' }]}
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {categories.length > 0 ? (
          <nav aria-label="Filter projects by category" className="mb-12 flex flex-wrap gap-2">
            <Link
              href="/portfolio"
              aria-current={!activeCategory ? 'true' : undefined}
              className={cn(
                filterClass,
                !activeCategory
                  ? 'border-secondary/50 bg-primary/15 text-secondary'
                  : 'border-border text-muted hover:border-secondary/40 hover:text-foreground',
              )}
            >
              All projects
              <span className="ml-2 text-xs text-subtle">{projects.length}</span>
            </Link>

            {categories.map((category) => {
              const count = projects.filter((project) => project.category === category).length;
              const isActive = activeCategory === category;

              return (
                <Link
                  key={category}
                  href={`/portfolio?category=${encodeURIComponent(category)}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    filterClass,
                    isActive
                      ? 'border-secondary/50 bg-primary/15 text-secondary'
                      : 'border-border text-muted hover:border-secondary/40 hover:text-foreground',
                  )}
                >
                  {category}
                  <span className="ml-2 text-xs text-subtle">{count}</span>
                </Link>
              );
            })}
          </nav>
        ) : null}

        {filtered.length === 0 ? (
          <EmptyState
            title={activeCategory ? `No projects in “${activeCategory}” yet` : 'Case studies coming soon'}
            description="Client approvals for publication are pending. Contact us and we will share relevant references privately."
            action={
              <Button asChild variant="outline">
                <Link href={activeCategory ? '/portfolio' : '/contact'}>
                  {activeCategory ? 'View all projects' : 'Contact us'}
                </Link>
              </Button>
            }
          />
        ) : (
          <StaggerGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, index) => (
              <StaggerItem key={project.id} className="h-full">
                <ProjectCard project={project} priority={index < 3} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </div>

      <CallToAction phone={settings['contact.phone']} />
    </>
  );
}
