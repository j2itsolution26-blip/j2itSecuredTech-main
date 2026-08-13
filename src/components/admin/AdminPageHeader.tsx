import * as React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function AdminPageHeader({
  title,
  description,
  breadcrumbs = [],
  actions,
}: {
  title: string;
  description?: string;
  breadcrumbs?: { name: string; href?: string }[];
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-border pb-6">
      {breadcrumbs.length > 0 ? (
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-subtle">
            <li>
              <Link href="/admin" className="transition-colors hover:text-secondary">
                Dashboard
              </Link>
            </li>
            {breadcrumbs.map((crumb) => (
              <li key={crumb.name} className="flex items-center gap-1.5">
                <ChevronRight className="size-3.5" aria-hidden="true" />
                {crumb.href ? (
                  <Link href={crumb.href} className="transition-colors hover:text-secondary">
                    {crumb.name}
                  </Link>
                ) : (
                  <span className="text-slate-300">{crumb.name}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{title}</h1>
          {description ? <p className="mt-1.5 max-w-2xl text-sm text-muted">{description}</p> : null}
        </div>

        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
