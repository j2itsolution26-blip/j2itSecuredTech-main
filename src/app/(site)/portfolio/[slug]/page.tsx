import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Building2, CalendarDays, MapPin, Target, TrendingUp } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { Reveal } from '@/components/shared/Reveal';
import { JsonLd } from '@/components/shared/JsonLd';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { CallToAction } from '@/components/sections/CallToAction';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getProjectBySlug, getRelatedProjects } from '@/lib/data/portfolio';
import { getSettings } from '@/lib/data/settings';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { formatDate, truncate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return buildMetadata({
      title: 'Case study not found',
      description: 'The requested case study could not be found.',
      path: `/portfolio/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: project.metaTitle || project.title,
    description: project.metaDesc || truncate(project.summary, 155),
    path: `/portfolio/${project.slug}`,
    image: project.thumbnail,
  });
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const [related, settings] = await Promise.all([
    getRelatedProjects(project.category, project.slug, 3),
    getSettings(),
  ]);

  const breadcrumbs = [
    { name: 'Portfolio', path: '/portfolio' },
    { name: project.title, path: `/portfolio/${project.slug}` },
  ];

  const facts = [
    { icon: Building2, label: 'Client', value: project.client },
    ...(project.industry ? [{ icon: Target, label: 'Industry', value: project.industry }] : []),
    ...(project.location ? [{ icon: MapPin, label: 'Location', value: project.location }] : []),
    ...(project.completedAt
      ? [{ icon: CalendarDays, label: 'Completed', value: formatDate(project.completedAt) }]
      : []),
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <PageHero
        eyebrow={project.category}
        title={project.title}
        description={project.summary}
        breadcrumbs={breadcrumbs}
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border">
          <Image
            src={project.thumbnail}
            alt={`${project.title} — ${project.client}`}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="object-cover"
          />
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col gap-12">
            <Reveal>
              <h2 className="font-heading text-2xl font-bold text-foreground">Project overview</h2>
              <div
                className="prose-article mt-5"
                dangerouslySetInnerHTML={{ __html: project.overview }}
              />
            </Reveal>

            {project.challenge ? (
              <Reveal>
                <h2 className="font-heading text-2xl font-bold text-foreground">The challenge</h2>
                <div
                  className="prose-article mt-5"
                  dangerouslySetInnerHTML={{ __html: project.challenge }}
                />
              </Reveal>
            ) : null}

            {project.solution ? (
              <Reveal>
                <h2 className="font-heading text-2xl font-bold text-foreground">Our solution</h2>
                <div
                  className="prose-article mt-5"
                  dangerouslySetInnerHTML={{ __html: project.solution }}
                />
              </Reveal>
            ) : null}

            {project.features.length > 0 ? (
              <Reveal>
                <h2 className="font-heading text-2xl font-bold text-foreground">Delivered features</h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {project.features.map((feature) => (
                    <li
                      key={feature}
                      className="rounded-xl border border-border bg-card/60 p-4 text-sm text-slate-300"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}

            {project.results.length > 0 ? (
              <Reveal>
                <h2 className="flex items-center gap-2 font-heading text-2xl font-bold text-foreground">
                  <TrendingUp className="size-5 text-success" aria-hidden="true" />
                  Results
                </h2>
                <ul className="mt-6 flex flex-col gap-3">
                  {project.results.map((result) => (
                    <li
                      key={result}
                      className="flex items-start gap-3 rounded-xl border border-success/20 bg-success/5 p-4 text-sm text-slate-200"
                    >
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-success" aria-hidden="true" />
                      {result}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}

            {project.images.length > 0 ? (
              <Reveal>
                <h2 className="font-heading text-2xl font-bold text-foreground">Project gallery</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {project.images.map((image, index) => (
                    <div
                      key={image}
                      className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border"
                    >
                      <Image
                        src={image}
                        alt={`${project.title} — image ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </Reveal>
            ) : null}
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-border bg-card/70 p-7">
              <h2 className="font-heading text-base font-semibold text-foreground">Project facts</h2>

              <dl className="mt-5 flex flex-col gap-4">
                {facts.map((fact) => (
                  <div key={fact.label} className="flex items-start gap-3">
                    <fact.icon className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden="true" />
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-subtle">{fact.label}</dt>
                      <dd className="mt-0.5 text-sm text-slate-200">{fact.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>

              {project.technologies.length > 0 ? (
                <div className="mt-7 border-t border-border pt-6">
                  <h3 className="text-xs uppercase tracking-wider text-subtle">Technology used</h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {project.technologies.map((technology) => (
                      <li key={technology}>
                        <Badge variant="outline">{technology}</Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <Button asChild block className="mt-7">
                <Link href="/request-quote">
                  Request a similar solution
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </aside>
        </div>

        {related.length > 0 ? (
          <section className="mt-24" aria-labelledby="related-projects">
            <h2 id="related-projects" className="font-heading text-2xl font-bold text-foreground">
              Related case studies
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProjectCard key={item.id} project={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <CallToAction phone={settings['contact.phone']} />
    </>
  );
}
