import Link from 'next/link';
import { MessageStatus } from '@prisma/client';
import { Search } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { MessageStatusBadge } from '@/components/admin/StatusBadge';
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
import { listContactMessages } from '@/lib/data/leads';
import { cn, firstParam, formatRelativeTime, humanizeEnum, parsePage, truncate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

type PageProps = {
  searchParams: Promise<{ page?: string | string[]; status?: string | string[]; search?: string | string[] }>;
};

function parseStatus(value: string | undefined): MessageStatus | undefined {
  return value && value in MessageStatus ? (value as MessageStatus) : undefined;
}

export default async function AdminMessagesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = parseStatus(firstParam(params.status));
  const search = firstParam(params.search);

  const { items, total, page, totalPages } = await listContactMessages({
    page: parsePage(params.page),
    status,
    search,
  });

  const filterClass = 'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors';

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Contact messages"
        description={`${total} ${total === 1 ? 'message' : 'messages'} received through the contact form.`}
        breadcrumbs={[{ name: 'Contact messages' }]}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Filter by status" className="flex flex-wrap gap-2">
          <Link
            href="/admin/messages"
            className={cn(
              filterClass,
              !status
                ? 'border-secondary/50 bg-primary/15 text-secondary'
                : 'border-border text-muted hover:text-foreground',
            )}
          >
            All
          </Link>
          {Object.values(MessageStatus).map((value) => (
            <Link
              key={value}
              href={`/admin/messages?status=${value}`}
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

        <form action="/admin/messages" method="get" role="search" className="flex gap-2">
          {status ? <input type="hidden" name="status" value={status} /> : null}
          <label htmlFor="message-search" className="sr-only">
            Search messages
          </label>
          <Input
            id="message-search"
            name="search"
            type="search"
            defaultValue={search ?? ''}
            placeholder="Name, email or subject"
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
          title="No messages found"
          description="Contact form submissions will appear here."
          action={
            search || status ? (
              <Button asChild variant="outline">
                <Link href="/admin/messages">Clear filters</Link>
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
                  <TableHeaderCell>Subject</TableHeaderCell>
                  <TableHeaderCell>From</TableHeaderCell>
                  <TableHeaderCell>Received</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="max-w-md">
                      <Link
                        href={`/admin/messages/${message.id}`}
                        className="font-medium text-foreground hover:text-secondary"
                      >
                        {message.subject}
                      </Link>
                      <p className="mt-0.5 text-xs text-subtle">{truncate(message.message, 90)}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-slate-200">{message.name}</p>
                      <p className="mt-0.5 text-xs text-subtle">{message.email}</p>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-subtle">
                      {formatRelativeTime(message.createdAt)}
                    </TableCell>
                    <TableCell>
                      <MessageStatusBadge status={message.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>

          <Pagination
            page={page}
            totalPages={totalPages}
            basePath="/admin/messages"
            searchParams={{ status, search }}
          />
        </>
      )}
    </div>
  );
}
