import Link from 'next/link';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { AdminIcon } from '@/components/admin/AdminIcon';
import { cn, formatNumber } from '@/lib/utils';

export function StatCard({
  label,
  value,
  icon,
  href,
  hint,
  trend,
}: {
  label: string;
  value: number | string;
  icon: string;
  href?: string;
  hint?: string;
  /** Percentage change against the previous period. */
  trend?: number;
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm text-muted">{label}</span>
        <span className="rounded-lg bg-primary/15 p-2 text-secondary">
          <AdminIcon name={icon} className="size-4" />
        </span>
      </div>

      <p className="mt-4 font-heading text-3xl font-bold text-foreground">
        {typeof value === 'number' ? formatNumber(value) : value}
      </p>

      <div className="mt-2 flex items-center gap-2 text-xs">
        {typeof trend === 'number' ? (
          <span
            className={cn(
              'inline-flex items-center gap-1 font-medium',
              trend >= 0 ? 'text-success' : 'text-danger',
            )}
          >
            {trend >= 0 ? (
              <TrendingUp className="size-3.5" aria-hidden="true" />
            ) : (
              <TrendingDown className="size-3.5" aria-hidden="true" />
            )}
            {trend >= 0 ? '+' : ''}
            {trend}%
          </span>
        ) : null}
        {hint ? <span className="text-subtle">{hint}</span> : null}
      </div>
    </>
  );

  const className = 'rounded-2xl border border-border bg-card/60 p-6 transition-colors';

  return href ? (
    <Link href={href} className={cn(className, 'hover:border-secondary/40')}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}
