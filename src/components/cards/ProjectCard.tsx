import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { PortfolioCard } from '@/lib/data/portfolio';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

export function ProjectCard({ project, priority = false }: { project: PortfolioCard; priority?: boolean }) {
  return (
    <article className="card-hover group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/70">
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        <Image
          src={project.thumbnail}
          alt={`${project.title} — ${project.client}`}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
        <Badge variant="brand" className="absolute left-4 top-4 backdrop-blur">
          {project.category}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-subtle">
          {project.client}
          {project.industry ? ` · ${project.industry}` : ''}
        </p>

        <h3 className="mt-2 font-heading text-lg font-semibold text-foreground">
          <Link href={`/portfolio/${project.slug}`} className="after:absolute after:inset-0">
            {project.title}
          </Link>
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{project.summary}</p>

        {project.technologies.length > 0 ? (
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((technology) => (
              <li
                key={technology}
                className="rounded-md border border-border bg-surface/70 px-2 py-1 text-[11px] text-slate-300"
              >
                {technology}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-3 pt-6 text-xs text-subtle">
          <span>{project.completedAt ? formatDate(project.completedAt) : 'Ongoing engagement'}</span>
          <span className="inline-flex items-center gap-1 font-semibold text-secondary">
            Case study
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </article>
  );
}
