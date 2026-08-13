import { notFound } from 'next/navigation';
import { Building2, CalendarClock, Mail, Phone, Wallet } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { QuoteStatusBadge } from '@/components/admin/StatusBadge';
import { QuoteStatusForm } from '@/components/admin/LeadStatusForm';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { Button } from '@/components/ui/button';
import { getQuoteRequestById } from '@/lib/data/leads';
import { deleteQuote } from '@/lib/actions/admin-actions';
import { formatDateTime } from '@/lib/utils';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

export default async function QuoteDetailPage({ params }: PageProps) {
  const { id } = await params;
  const quote = await getQuoteRequestById(id);

  if (!quote) notFound();

  const facts = [
    { icon: Mail, label: 'Email', value: quote.email, href: `mailto:${quote.email}` },
    { icon: Phone, label: 'Phone', value: quote.phone, href: `tel:${quote.phone.replace(/[^+\d]/g, '')}` },
    ...(quote.company ? [{ icon: Building2, label: 'Company', value: quote.company }] : []),
    ...(quote.budget ? [{ icon: Wallet, label: 'Budget', value: quote.budget }] : []),
    ...(quote.timeline ? [{ icon: CalendarClock, label: 'Timeline', value: quote.timeline }] : []),
  ];

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title={quote.reference}
        description={`Submitted ${formatDateTime(quote.createdAt)} from ${quote.ipAddress ?? 'an unknown address'}.`}
        breadcrumbs={[{ name: 'Quote requests', href: '/admin/quotes' }, { name: quote.reference }]}
        actions={
          <>
            <QuoteStatusBadge status={quote.status} />
            <Button asChild variant="outline" size="sm">
              <a
                href={`mailto:${quote.email}?subject=${encodeURIComponent(
                  `Your quote request ${quote.reference}`,
                )}`}
              >
                <Mail className="size-4" aria-hidden="true" />
                Reply by email
              </a>
            </Button>
            <DeleteButton
              id={quote.id}
              label={`${quote.reference} — ${quote.name}`}
              entityLabel="quote request"
              action={deleteQuote}
              redirectTo="/admin/quotes"
            />
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-6">
          <section className="rounded-2xl border border-border bg-card/60 p-6">
            <h2 className="font-heading text-base font-semibold text-foreground">Requirements</h2>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
              {quote.description}
            </p>
          </section>

          <QuoteStatusForm id={quote.id} status={quote.status} notes={quote.notes} />
        </div>

        <aside className="rounded-2xl border border-border bg-card/60 p-6 lg:sticky lg:top-24 lg:self-start">
          <h2 className="font-heading text-base font-semibold text-foreground">Contact</h2>
          <p className="mt-1 text-sm text-muted">{quote.name}</p>

          <dl className="mt-5 flex flex-col gap-4">
            {facts.map((fact) => (
              <div key={fact.label} className="flex items-start gap-3">
                <fact.icon className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden="true" />
                <div className="min-w-0">
                  <dt className="text-xs uppercase tracking-wider text-subtle">{fact.label}</dt>
                  <dd className="mt-0.5 break-words text-sm text-slate-200">
                    {'href' in fact && fact.href ? (
                      <a href={fact.href} className="hover:text-secondary">
                        {fact.value}
                      </a>
                    ) : (
                      fact.value
                    )}
                  </dd>
                </div>
              </div>
            ))}
          </dl>

          <div className="mt-6 border-t border-border pt-5">
            <p className="text-xs uppercase tracking-wider text-subtle">Service requested</p>
            <p className="mt-1 text-sm text-slate-200">{quote.service}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
