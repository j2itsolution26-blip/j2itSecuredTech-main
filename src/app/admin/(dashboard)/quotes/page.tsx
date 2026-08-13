import Link from 'next/link';
import { QuoteStatus } from '@prisma/client';
import { Search } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { QuoteStatusBadge } from '@/components/admin/StatusBadge';
import { Pagination } from '@/components/shared/Pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/feedback';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableWrapper,
} from '@/components/ui/table';
import { listQuoteRequests } from '@/lib/data/leads';
import { cn, firstParam, formatRelativeTime, humanizeEnum, parsePage, truncate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

type PageProps = {
  searchParams: Promise<{ page?: string | string[]; status?: string | string[]; search?: string | string[] }>;
};

function parseStatus(value: string | undefined): QuoteStatus | undefined {
  return value && value in QuoteStatus ? (value as QuoteStatus) : undefined;
}

export default async function AdminQuotesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = parseStatus(firstParam(params.status));
  const search = firstParam(params.search);

  const { items, total, page, totalPages } = await listQuoteRequests({
    page: parsePage(params.page),
    status,
    search,
  });

  const filterClass = 'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors';

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Quote requests"
        description={`${total} ${total === 1 ? 'request' : 'requests'} received through the website.`}
        breadcrumbs={[{ name: 'Quote requests' }]}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Filter by status" className="flex flex-wrap gap-2">
          <Link
            href="/admin/quotes"
            className={cn(
              filterClass,
              !status
                ? 'border-secondary/50 bg-primary/15 text-secondary'
                : 'border-border text-muted hover:text-foreground',
            )}
          >
            All
          </Link>
          {Object.values(QuoteStatus).map((value) => (
            <Link
              key={value}
              href={`/admin/quotes?status=${value}`}
              className={cn(
                filterClass,
                status === value
                  ? 'border-secondary/50 bg-primary/15 text-secondary'
                  : 'border-border text-muted hover:text-foreground',
              )}
            >
              {humanizeEnum(value)}
            </Link>
          ))}
        </nav>

        <form action="/admin/quotes" method="get" role="search" className="flex gap-2">
          {status ? <input type="hidden" name="status" value={status} /> : null}
          <label htmlFor="quote-search" className="sr-only">
            Search quote requests
          </label>
          <Input
            id="quote-search"
            name="search"
            type="search"
            defaultValue={search ?? ''}
            placeholder="Name, email, company or reference"
            className="w-full lg:w-72"
          />
          <Button type="submit" variant="secondary">
            <Search className="size-4" aria-hidden="true" />
            <span className="sr-only">Search</span>
          </Button>
        </form>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No quote requests found"
          description={
            search || status
              ? 'Try clearing the filters to see all submissions.'
              : 'Submissions from the public quote form will appear here.'
          }
          action={
            search || status ? (
              <Button asChild variant="outline">
                <Link href="/admin/quotes">Clear filters</Link>
              </Button>
            ) : null
          }
        />
      ) : (
        <>
          <TableWrapper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Reference</TableHeaderCell>
                  <TableHeaderCell>Contact</TableHeaderCell>
                  <TableHeaderCell>Service</TableHeaderCell>
                  <TableHeaderCell>Budget</TableHeaderCell>
                  <TableHeaderCell>Received</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell>
                      <Link
                        href={`/admin/quotes/${quote.id}`}
                        className="font-mono text-xs font-medium text-secondary hover:underline"
                      >
                        {quote.reference}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-foreground">{quote.name}</p>
                      <p className="mt-0.5 text-xs text-subtle">
                        {quote.company ? `${quote.company} · ` : ''}
                        {quote.email}
                      </p>
                    </TableCell>
                    <TableCell className="max-w-[220px] text-xs">{truncate(quote.service, 60)}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-subtle">
                      {quote.budget ?? '—'}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-subtle">
                      {formatRelativeTime(quote.createdAt)}
                    </TableCell>
                    <TableCell>
                      <QuoteStatusBadge status={quote.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>

          <Pagination
            page={page}
            totalPages={totalPages}
            basePath="/admin/quotes"
            searchParams={{ status, search }}
          />
        </>
      )}
    </div>
  );
}
