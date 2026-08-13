import Link from 'next/link';
import { ArrowRight, Briefcase, MapPin } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { Reveal } from '@/components/shared/Reveal';
import { JsonLd } from '@/components/shared/JsonLd';
import { EmptyState } from '@/components/ui/feedback';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getOpenRoles } from '@/lib/data/marketing';
import { COMPANY_INFO } from '@/lib/constants';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { humanizeEnum } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'Careers',
  description:
    'Join J2 SecureTech. We are hiring software engineers, network engineers, CCTV technicians and project managers across the Philippines.',
  path: '/careers',
});

const BENEFITS = [
  'HMO coverage from day one, extended to one dependent after regularisation',
  'Certification sponsorship (Cisco, AWS, Azure, manufacturer training)',
  'Paid field allowances and transport for on-site deployments',
  'Hybrid schedules for engineering roles that do not require site presence',
  'Annual performance review with a documented salary band',
];

export default async function CareersPage() {
  const roles = await getOpenRoles();

  const departments = [...new Set(roles.map((role) => role.department))];

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Careers', path: '/careers' }])} />

      <PageHero
        eyebrow="Careers"
        title="Build systems that people depend on every day"
        description="Our engineers work on hospital networks, campus infrastructure and warehouse systems where the work is visible and the standards are high."
        breadcrumbs={[{ name: 'Careers', path: '/careers' }]}
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Open positions
              {roles.length > 0 ? (
                <span className="ml-3 align-middle text-sm font-normal text-subtle">
                  {roles.length} {roles.length === 1 ? 'role' : 'roles'} across {departments.length}{' '}
                  {departments.length === 1 ? 'department' : 'departments'}
                </span>
              ) : null}
            </h2>

            {roles.length === 0 ? (
              <div className="mt-8">
                <EmptyState
                  icon={Briefcase}
                  title="No open positions right now"
                  description={`We still review speculative applications. Send your CV to ${COMPANY_INFO.careersEmail} and we will contact you when a suitable role opens.`}
                  action={
                    <Button asChild variant="outline">
                      <a href={`mailto:${COMPANY_INFO.careersEmail}`}>Send your CV</a>
                    </Button>
                  }
                />
              </div>
            ) : (
              <ul className="mt-8 flex flex-col gap-4">
                {roles.map((role, index) => (
                  <li key={role.id}>
                    <Reveal delay={index * 0.05}>
                      <article className="card-hover group relative rounded-2xl border border-border bg-card/70 p-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <h3 className="font-heading text-lg font-semibold text-foreground">
                              <Link href={`/careers/${role.slug}`} className="after:absolute after:inset-0">
                                {role.title}
                              </Link>
                            </h3>
                            <p className="mt-1.5 text-sm text-muted">{role.department}</p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Badge variant="brand">{humanizeEnum(role.type)}</Badge>
                            {role.isRemote ? <Badge variant="success">Remote friendly</Badge> : null}
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-subtle">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="size-3.5" aria-hidden="true" />
                            {role.location}
                          </span>
                          {role.salaryRange ? <span>{role.salaryRange}</span> : null}
                        </div>

                        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-secondary">
                          View role
                          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                        </span>
                      </article>
                    </Reveal>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-border bg-card/70 p-7">
              <h2 className="font-heading text-base font-semibold text-foreground">What we offer</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5 text-sm text-muted">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-secondary" aria-hidden="true" />
                    {benefit}
                  </li>
                ))}
              </ul>

              <div className="mt-7 border-t border-border pt-6">
                <p className="text-sm text-muted">
                  Applications are reviewed by the hiring engineer, not an automated filter.
                </p>
                <Button asChild block className="mt-5">
                  <a href={`mailto:${COMPANY_INFO.careersEmail}`}>Email our recruitment team</a>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
