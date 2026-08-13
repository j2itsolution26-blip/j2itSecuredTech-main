import * as React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/shared/Reveal';

export type Crumb = { name: string; path: string };

/**
 * Standard hero used by every interior page — keeps spacing, breadcrumb
 * behaviour and heading hierarchy identical across the site.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs = [],
  children,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbs?: Crumb[];
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('relative overflow-hidden border-b border-border bg-grid-pattern', className)}>
      <div className="gradient-glow -top-32 left-1/2 h-[420px] w-[620px] -translate-x-1/2 bg-primary/40" />
      <div className="gradient-glow -bottom-40 right-0 h-[320px] w-[420px] bg-secondary/25" />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-20 lg:pt-20">
        {breadcrumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-subtle">
              <li>
                <Link href="/" className="transition-colors hover:text-secondary">
                  Home
                </Link>
              </li>
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.path} className="flex items-center gap-1.5">
                  <ChevronRight className="size-3.5" aria-hidden="true" />
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-slate-300" aria-current="page">
                      {crumb.name}
                    </span>
                  ) : (
                    <Link href={crumb.path} className="transition-colors hover:text-secondary">
                      {crumb.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <Reveal className="max-w-3xl">
          {eyebrow ? (
            <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.2em] text-secondary">
              {eyebrow}
            </span>
          ) : null}

          <h1 className="font-heading text-4xl font-bold leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
            {title}
          </h1>

          {description ? (
            <p className="mt-6 text-lg leading-relaxed text-muted">{description}</p>
          ) : null}

          {children ? <div className="mt-8">{children}</div> : null}
        </Reveal>
      </div>
    </section>
  );
}
