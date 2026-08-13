import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Builds a compact page list: 1 … 4 5 6 … 20 */
function pageWindow(current: number, total: number): (number | 'gap')[] {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);

  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);

  const result: (number | 'gap')[] = [];
  let previous = 0;

  for (const page of sorted) {
    if (previous && page - previous > 1) result.push('gap');
    result.push(page);
    previous = page;
  }

  return result;
}

export function Pagination({
  page,
  totalPages,
  basePath,
  searchParams = {},
}: {
  page: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (target: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value) params.set(key, value);
    }
    if (target > 1) params.set('page', String(target));
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  const linkClass =
    'inline-flex h-10 min-w-10 items-center justify-center rounded-lg border border-border px-3 text-sm font-medium transition-colors';

  return (
    <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={cn(linkClass, 'text-muted hover:border-secondary/40 hover:text-foreground')} rel="prev">
          <ChevronLeft className="size-4" aria-hidden="true" />
          <span className="sr-only">Previous page</span>
        </Link>
      ) : null}

      {pageWindow(page, totalPages).map((entry, index) =>
        entry === 'gap' ? (
          <span key={`gap-${index}`} className="px-2 text-subtle" aria-hidden="true">
            …
          </span>
        ) : (
          <Link
            key={entry}
            href={hrefFor(entry)}
            aria-current={entry === page ? 'page' : undefined}
            className={cn(
              linkClass,
              entry === page
                ? 'border-secondary/50 bg-primary/15 text-secondary'
                : 'text-muted hover:border-secondary/40 hover:text-foreground',
            )}
          >
            {entry}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className={cn(linkClass, 'text-muted hover:border-secondary/40 hover:text-foreground')} rel="next">
          <ChevronRight className="size-4" aria-hidden="true" />
          <span className="sr-only">Next page</span>
        </Link>
      ) : null}
    </nav>
  );
}
