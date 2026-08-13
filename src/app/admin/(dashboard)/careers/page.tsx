import Link from 'next/link';
import { Plus, SquarePen } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ActiveBadge } from '@/components/admin/StatusBadge';
import { DeleteButton } from '@/components/admin/DeleteButton';
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
import { listCareersForAdmin } from '@/lib/data/marketing';
import { deleteCareer } from '@/lib/actions/content-actions';
import { formatDate, humanizeEnum } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminCareersPage() {
  const careers = await listCareersForAdmin();

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Careers"
        description="Open positions listed on the public careers page with JobPosting structured data."
        breadcrumbs={[{ name: 'Careers' }]}
        actions={
          <Button asChild size="sm">
            <Link href="/admin/careers/new">
              <Plus className="size-4" aria-hidden="true" />
              Post a role
            </Link>
          </Button>
        }
      />

      {careers.length === 0 ? (
        <EmptyState
          title="No roles posted"
          description="Publish a role to have it indexed in Google for Jobs."
          action={
            <Button asChild>
              <Link href="/admin/careers/new">Post a role</Link>
            </Button>
          }
        />
      ) : (
        <TableWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Role</TableHeaderCell>
                <TableHeaderCell>Department</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Closes</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell className="text-right">Actions</TableHeaderCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {careers.map((career) => (
                <TableRow key={career.id}>
                  <TableCell>
                    <Link
                      href={`/admin/careers/${career.id}`}
                      className="font-medium text-foreground hover:text-secondary"
                    >
                      {career.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-subtle">{career.location}</p>
                  </TableCell>
                  <TableCell>{career.department}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{humanizeEnum(career.type)}</Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-subtle">
                    {formatDate(career.closesAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      <ActiveBadge active={career.isActive} />
                      {career.isRemote ? <Badge variant="info">Remote</Badge> : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/careers/${career.id}`}>
                          <SquarePen className="size-4" aria-hidden="true" />
                          Edit
                        </Link>
                      </Button>
                      <DeleteButton
                        id={career.id}
                        label={career.title}
                        entityLabel="role"
                        action={deleteCareer}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      )}
    </div>
  );
}
