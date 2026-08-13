import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatCard } from '@/components/admin/StatCard';
import { LeadTrendChart } from '@/components/admin/Charts';
import { MessageStatusBadge, QuoteStatusBadge } from '@/components/admin/StatusBadge';
import { Alert, EmptyState } from '@/components/ui/feedback';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableWrapper,
} from '@/components/ui/table';
import { getDashboardMetrics, getLeadTrend } from '@/lib/data/admin';
import { requireSession } from '@/lib/auth/guards';
import { formatRelativeTime, humanizeEnum } from '@/lib/utils';
import { firstParam } from '@/lib/utils';

export const dynamic = 'force-dynamic';

type PageProps = { searchParams: Promise<{ denied?: string | string[] }> };

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const [session, params] = await Promise.all([requireSession(), searchParams]);
  const denied = firstParam(params.denied);

  const [metrics, trend] = await Promise.all([getDashboardMetrics(), getLeadTrend()]);

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title={`Welcome back, ${(session.user.name ?? 'there').split(' ')[0]}`}
        description="Lead activity, content status and recent administrative changes at a glance."
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/analytics">
              Full analytics
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        }
      />

      {denied ? (
        <Alert tone="warning" title="Permission required">
          Your role does not grant access to that section. Contact an administrator if you need it.
        </Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Quote requests"
          value={metrics.totalQuotes}
          icon="FileText"
          href="/admin/quotes"
          trend={metrics.quoteGrowth}
          hint="vs previous 30 days"
        />
        <StatCard
          label="Awaiting response"
          value={metrics.pendingQuotes}
          icon="CircleHelp"
          href="/admin/quotes?status=PENDING"
          hint="pending review"
        />
        <StatCard
          label="Unread messages"
          value={metrics.unreadMessages}
          icon="Mail"
          href="/admin/messages?status=UNREAD"
          hint={`${metrics.totalMessages} total`}
        />
        <StatCard
          label="Published articles"
          value={metrics.publishedPosts}
          icon="Newspaper"
          href="/admin/blog"
          hint={`${metrics.draftPosts} drafts · ${metrics.totalViews} views`}
        />
      </div>

      <section className="rounded-2xl border border-border bg-card/60 p-6" aria-labelledby="trend-heading">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="trend-heading" className="font-heading text-base font-semibold text-foreground">
              Lead volume — last 12 months
            </h2>
            <p className="mt-1 text-sm text-muted">
              {metrics.quotesThisPeriod} quote requests in the last 30 days.
            </p>
          </div>
        </div>

        <LeadTrendChart data={trend} />
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="flex flex-col rounded-2xl border border-border bg-card/60" aria-labelledby="recent-quotes">
          <div className="flex items-center justify-between gap-3 border-b border-border p-5">
            <h2 id="recent-quotes" className="font-heading text-base font-semibold text-foreground">
              Latest quote requests
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/quotes">View all</Link>
            </Button>
          </div>

          {metrics.recentQuotes.length === 0 ? (
            <div className="p-5">
              <EmptyState title="No quote requests yet" description="New submissions will appear here." />
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {metrics.recentQuotes.map((quote) => (
                <li key={quote.id}>
                  <Link
                    href={`/admin/quotes/${quote.id}`}
                    className="flex items-center justify-between gap-4 p-5 transition-colors hover:bg-white/[0.03]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {quote.name}
                        {quote.company ? ` · ${quote.company}` : ''}
                      </p>
                      <p className="mt-1 truncate text-xs text-subtle">
                        {quote.reference} · {quote.service} · {formatRelativeTime(quote.createdAt)}
                      </p>
                    </div>
                    <QuoteStatusBadge status={quote.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="flex flex-col rounded-2xl border border-border bg-card/60" aria-labelledby="recent-messages">
          <div className="flex items-center justify-between gap-3 border-b border-border p-5">
            <h2 id="recent-messages" className="font-heading text-base font-semibold text-foreground">
              Latest contact messages
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/messages">View all</Link>
            </Button>
          </div>

          {metrics.recentMessages.length === 0 ? (
            <div className="p-5">
              <EmptyState title="No messages yet" description="Contact form submissions will appear here." />
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {metrics.recentMessages.map((message) => (
                <li key={message.id}>
                  <Link
                    href={`/admin/messages/${message.id}`}
                    className="flex items-center justify-between gap-4 p-5 transition-colors hover:bg-white/[0.03]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{message.subject}</p>
                      <p className="mt-1 truncate text-xs text-subtle">
                        {message.name} · {formatRelativeTime(message.createdAt)}
                      </p>
                    </div>
                    <MessageStatusBadge status={message.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section aria-labelledby="recent-activity">
        <h2 id="recent-activity" className="mb-4 font-heading text-base font-semibold text-foreground">
          Recent administrative activity
        </h2>

        {metrics.recentAudit.length === 0 ? (
          <EmptyState title="No activity recorded" description="Administrative changes appear here as they happen." />
        ) : (
          <TableWrapper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Action</TableHeaderCell>
                  <TableHeaderCell>Summary</TableHeaderCell>
                  <TableHeaderCell>User</TableHeaderCell>
                  <TableHeaderCell>When</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {metrics.recentAudit.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="whitespace-nowrap text-xs uppercase tracking-wide text-subtle">
                      {humanizeEnum(entry.action)} · {entry.entity}
                    </TableCell>
                    <TableCell>{entry.summary}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-subtle">
                      {entry.userEmail ?? 'System'}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-subtle">
                      {formatRelativeTime(entry.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
        )}
      </section>
    </div>
  );
}
