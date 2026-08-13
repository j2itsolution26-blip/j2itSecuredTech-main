import { notFound } from 'next/navigation';
import { CalendarClock, MapPin, Wallet } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { Reveal } from '@/components/shared/Reveal';
import { JsonLd } from '@/components/shared/JsonLd';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getRoleBySlug } from '@/lib/data/marketing';
import { COMPANY_INFO } from '@/lib/constants';
import { breadcrumbSchema, buildMetadata, jobPostingSchema } from '@/lib/seo';
import { formatDate, humanizeEnum, truncate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const role = await getRoleBySlug(slug);

  if (!role) {
    return buildMetadata({
      title: 'Role not found',
      description: 'The requested position could not be found.',
      path: `/careers/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${role.title} — ${role.department}`,
    description: truncate(role.description.replace(/<[^>]*>/g, ' '), 155),
    path: `/careers/${role.slug}`,
  });
}

export default async function CareerDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const role = await getRoleBySlug(slug);

  if (!role) notFound();

  const breadcrumbs = [
    { name: 'Careers', path: '/careers' },
    { name: role.title, path: `/careers/${role.slug}` },
  ];

  const sections = [
    { title: 'Responsibilities', items: role.responsibilities },
    { title: 'Requirements', items: role.requirements },
    { title: 'Benefits', items: role.benefits },
  ].filter((section) => section.items.length > 0);

  const applyHref = `mailto:${COMPANY_INFO.careersEmail}?subject=${encodeURIComponent(
    `Application: ${role.title}`,
  )}`;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbs),
          jobPostingSchema({
            title: role.title,
            description: role.description,
            department: role.department,
            employmentType: role.type,
            location: role.location,
            isRemote: role.isRemote,
            datePosted: role.createdAt,
            validThrough: role.closesAt,
          }),
        ]}
      />

      <PageHero eyebrow={role.department} title={role.title} breadcrumbs={breadcrumbs}>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="brand">{humanizeEnum(role.type)}</Badge>
          {role.isRemote ? <Badge variant="success">Remote friendly</Badge> : null}
          <span className="inline-flex items-center gap-1.5 text-sm text-muted">
            <MapPin className="size-4 text-secondary" aria-hidden="true" />
            {role.location}
          </span>
          {role.salaryRange ? (
            <span className="inline-flex items-center gap-1.5 text-sm text-muted">
              <Wallet className="size-4 text-secondary" aria-hidden="true" />
              {role.salaryRange}
            </span>
          ) : null}
          {role.closesAt ? (
            <span className="inline-flex items-center gap-1.5 text-sm text-muted">
              <CalendarClock className="size-4 text-secondary" aria-hidden="true" />
              Applications close {formatDate(role.closesAt)}
            </span>
          ) : null}
        </div>
      </PageHero>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col gap-12">
            <Reveal>
              <h2 className="font-heading text-2xl font-bold text-foreground">About the role</h2>
              <div className="prose-article mt-5" dangerouslySetInnerHTML={{ __html: role.description }} />
            </Reveal>

            {sections.map((section) => (
              <Reveal key={section.title}>
                <h2 className="font-heading text-2xl font-bold text-foreground">{section.title}</h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-slate-300">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-secondary" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-border bg-card/70 p-7">
              <h2 className="font-heading text-base font-semibold text-foreground">Apply for this role</h2>
              <p className="mt-3 text-sm text-muted">
                Send your CV and a short note on relevant projects. Applications are reviewed by the
                hiring engineer and every applicant receives a reply.
              </p>
              <Button asChild block className="mt-6">
                <a href={applyHref}>Apply by email</a>
              </Button>
              <p className="mt-4 text-xs text-subtle">
                Reference the role title in your subject line so it reaches the right team.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
