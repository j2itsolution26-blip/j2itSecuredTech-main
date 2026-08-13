import { notFound } from 'next/navigation';
import { Building2, Mail, Phone } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { MessageStatusBadge } from '@/components/admin/StatusBadge';
import { MessageStatusForm } from '@/components/admin/LeadStatusForm';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { Button } from '@/components/ui/button';
import { getContactMessageById } from '@/lib/data/leads';
import { deleteMessage } from '@/lib/actions/admin-actions';
import { formatDateTime } from '@/lib/utils';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

export default async function MessageDetailPage({ params }: PageProps) {
  const { id } = await params;
  const message = await getContactMessageById(id);

  if (!message) notFound();

  const facts = [
    { icon: Mail, label: 'Email', value: message.email, href: `mailto:${message.email}` },
    ...(message.phone
      ? [
          {
            icon: Phone,
            label: 'Phone',
            value: message.phone,
            href: `tel:${message.phone.replace(/[^+\d]/g, '')}`,
          },
        ]
      : []),
    ...(message.company ? [{ icon: Building2, label: 'Company', value: message.company }] : []),
  ];

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title={message.subject}
        description={`Received ${formatDateTime(message.createdAt)} from ${message.ipAddress ?? 'an unknown address'}.`}
        breadcrumbs={[{ name: 'Contact messages', href: '/admin/messages' }, { name: 'Message' }]}
        actions={
          <>
            <MessageStatusBadge status={message.status} />
            <Button asChild variant="outline" size="sm">
              <a href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}>
                <Mail className="size-4" aria-hidden="true" />
                Reply by email
              </a>
            </Button>
            <DeleteButton
              id={message.id}
              label={message.subject}
              entityLabel="message"
              action={deleteMessage}
              redirectTo="/admin/messages"
            />
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-6">
          <section className="rounded-2xl border border-border bg-card/60 p-6">
            <h2 className="font-heading text-base font-semibold text-foreground">Message</h2>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
              {message.message}
            </p>
          </section>

          <MessageStatusForm id={message.id} status={message.status} notes={message.notes} />
        </div>

        <aside className="rounded-2xl border border-border bg-card/60 p-6 lg:sticky lg:top-24 lg:self-start">
          <h2 className="font-heading text-base font-semibold text-foreground">Sender</h2>
          <p className="mt-1 text-sm text-muted">{message.name}</p>

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
        </aside>
      </div>
    </div>
  );
}
