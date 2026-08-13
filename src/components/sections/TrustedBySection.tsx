import { TRUSTED_SECTORS } from '@/lib/constants';
import { Icon } from '@/components/shared/Icon';

/**
 * Sector marquee. We name the industries we serve rather than displaying
 * client logos, which would require written brand permission from each one.
 */
export function TrustedBySection() {
  const track = [...TRUSTED_SECTORS, ...TRUSTED_SECTORS];

  return (
    <section className="overflow-hidden border-b border-border py-14" aria-label="Sectors we serve">
      <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-subtle">
        Trusted across regulated and high-availability sectors
      </p>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

        <ul className="flex w-max animate-marquee items-center gap-4" aria-hidden="true">
          {track.map((sector, index) => (
            <li
              key={`${sector.name}-${index}`}
              className="flex shrink-0 items-center gap-2.5 rounded-xl border border-border bg-card/50 px-5 py-3"
            >
              <Icon name={sector.icon} className="size-4 text-secondary" />
              <span className="whitespace-nowrap text-sm font-medium text-slate-300">{sector.name}</span>
            </li>
          ))}
        </ul>

        {/* Static, screen-reader accessible equivalent of the marquee. */}
        <ul className="sr-only">
          {TRUSTED_SECTORS.map((sector) => (
            <li key={sector.name}>{sector.name}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
