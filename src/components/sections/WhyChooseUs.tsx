import { VALUE_PROPS } from '@/lib/constants';
import { Icon } from '@/components/shared/Icon';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { StaggerGroup, StaggerItem } from '@/components/shared/Reveal';

export function WhyChooseUs() {
  return (
    <section className="py-24" aria-labelledby="why-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why J2 SecureTech"
          title={<span id="why-heading">Engineering discipline, not just installation</span>}
          description="We are hired when a previous vendor left systems undocumented, unsupported or unsecured. These are the commitments that prevent that outcome."
        />

        <StaggerGroup className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {VALUE_PROPS.map((item) => (
            <StaggerItem key={item.title} className="h-full">
              <article className="card-hover flex h-full flex-col rounded-2xl border border-border bg-card/70 p-7">
                <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-secondary/10 text-secondary">
                  <Icon name={item.icon} className="size-5" />
                </span>
                <h3 className="mt-5 font-heading text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
