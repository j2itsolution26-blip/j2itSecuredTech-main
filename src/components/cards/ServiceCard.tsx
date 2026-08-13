import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import type { ServiceCard as ServiceCardData } from '@/lib/data/services';
import { Icon } from '@/components/shared/Icon';
import { humanizeEnum } from '@/lib/utils';

export function ServiceCard({ service, featureLimit = 4 }: { service: ServiceCardData; featureLimit?: number }) {
  return (
    <article className="card-hover group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/70 p-7">
      <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-primary/10 blur-3xl transition-opacity group-hover:opacity-100 opacity-60" />

      <div className="relative flex items-start justify-between gap-4">
        <span className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-secondary/15 text-secondary">
          <Icon name={service.icon} className="size-6" />
        </span>
        <span className="rounded-full border border-border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-subtle">
          {humanizeEnum(service.category)}
        </span>
      </div>

      <h3 className="relative mt-6 font-heading text-xl font-semibold text-foreground">
        {service.title}
      </h3>

      <p className="relative mt-3 text-sm leading-relaxed text-muted">{service.summary}</p>

      {service.features.length > 0 ? (
        <ul className="relative mt-6 flex flex-col gap-2">
          {service.features.slice(0, featureLimit).map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm text-slate-300">
              <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
              <span>{feature}</span>
            </li>
          ))}
          {service.features.length > featureLimit ? (
            <li className="pl-6 text-xs text-subtle">
              +{service.features.length - featureLimit} more capabilities
            </li>
          ) : null}
        </ul>
      ) : null}

      <Link
        href={`/services/${service.slug}`}
        className="relative mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-secondary transition-colors hover:text-accent"
      >
        Explore service
        <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        <span className="sr-only">— {service.title}</span>
      </Link>
    </article>
  );
}
