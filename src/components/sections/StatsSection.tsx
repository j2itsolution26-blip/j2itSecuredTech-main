import { STATS } from '@/lib/constants';
import { Counter } from '@/components/shared/Counter';
import { Reveal } from '@/components/shared/Reveal';

export function StatsSection() {
  return (
    <section className="border-y border-border bg-surface/50 py-16" aria-label="Company performance">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        {STATS.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 0.08} className="text-center">
            <p className="font-heading text-4xl font-bold text-white sm:text-5xl">
              <Counter
                value={stat.value}
                suffix={stat.suffix}
                decimals={'decimals' in stat ? stat.decimals : 0}
              />
            </p>
            <p className="mt-2 text-sm text-muted">{stat.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
