import Link from 'next/link';
import { UserRole } from '@prisma/client';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Pagination } from '@/components/shared/Pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { getAuditEntities, listAuditLogs } from '@/lib/data/admin';
import { requireRole } from '@/lib/auth/guards';
import { cn, firstParam, formatDateTime, humanizeEnum, parsePage } from '@/lib/utils';

export const dynamic = 'force-dynamic';

type PageProps = {
  searchParams: Promise<{ page?: string | string[]; entity?: string | string[] }>;
};

const ACTION_TONE: Record<string, 'success' | 'info' | 'danger' | 'warning' | 'outline'> = {
  CREATE: 'success',
  UPDATE: 'info',
  DELETE: 'danger',
  LOGIN: 'outline',
  LOGOUT: 'outline',
  LOGIN_FAILED: 'warning',
};

export default async function AuditLogsPage({ searchParams }: PageProps) {
  await requireRole(UserRole.ADMIN);

  const params = await searchParams;
  const entity = firstParam(params.entity);

  const [{ items, total, page, totalPages }, entities] = await Promise.all([
    listAuditLogs({ page: parsePage(params.page), entity }),
    getAuditEntities(),
  ]);

  const filterClass = 'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors';

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Audit logs"
        description={`${total} recorded ${total === 1 ? 'event' : 'events'}. Entries are immutable and retained for compliance review.`}
        breadcrumbs={[{ name: 'Audit logs' }]}
      />

      {entities.length > 0 ? (
        <nav aria-label="Filter by entity" className="flex flex-wrap gap-2">
          <Link
            href="/admin/audit-logs"
            className={cn(
              filterClass,
              !entity
                ? 'border-secondary/50 bg-primary/15 text-secondary'
                : 'border-border text-muted hover:text-foreground',
            )}
          >
            All entities
          </Link>
          {entities.map((name) => (
            <Link
              key={name}
              href={`/admin/audit-logs?entity=${encodeURIComponent(name)}`}
              className={cn(
                filterClass,
                entity === name
                  ? 'border-secondary/50 bg-primary/15 text-secondary'
                  : 'border-border text-muted hover:text-foreground',
              )}
            >
              {name}
            </Link>
          ))}
        </nav>
      ) : null}

      {items.length === 0 ? (
        <EmptyState
          title="No audit entries"
          description="Administrative actions are recorded here as they occur."
          action={
            entity ? (
              <Button asChild variant="outline">
                <Link href="/admin/audit-logs">Clear filter</Link>
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
                  <TableHeaderCell>Action</TableHeaderCell>
                  <TableHeaderCell>Entity</TableHeaderCell>
                  <TableHeaderCell>Summary</TableHeaderCell>
                  <TableHeaderCell>User</TableHeaderCell>
                  <TableHeaderCell>IP address</TableHeaderCell>
                  <TableHeaderCell>Timestamp</TableHeaderCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <Badge variant={ACTION_TONE[entry.action] ?? 'outline'}>
                        {humanizeEnum(entry.action)}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-subtle">{entry.entity}</TableCell>
                    <TableCell className="max-w-md">{entry.summary}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-subtle">
                      {entry.userEmail ?? 'System'}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-mono text-xs text-subtle">
                      {entry.ipAddress ?? '—'}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-subtle">
                      {formatDateTime(entry.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>

          <Pagination
            page={page}
            totalPages={totalPages}
            basePath="/admin/audit-logs"
            searchParams={{ entity }}
          />
        </>
      )}
    </div>
  );
}
