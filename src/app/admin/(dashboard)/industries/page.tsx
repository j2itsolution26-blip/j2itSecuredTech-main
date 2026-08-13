import Link from 'next/link';
import { Plus, SquarePen } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ActiveBadge } from '@/components/admin/StatusBadge';
import { DeleteButton } from '@/components/admin/DeleteButton';
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
import { listIndustriesForAdmin } from '@/lib/data/marketing';
import { deleteIndustry } from '@/lib/actions/content-actions';
import { truncate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminIndustriesPage() {
  const industries = await listIndustriesForAdmin();

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Industries"
        description="Sector profiles shown on the home page and the industries page."
        breadcrumbs={[{ name: 'Industries' }]}
        actions={
          <Button asChild size="sm">
            <Link href="/admin/industries/new">
              <Plus className="size-4" aria-hidden="true" />
              Add industry
            </Link>
          </Button>
        }
      />

      {industries.length === 0 ? (
        <EmptyState
          title="No industries yet"
          description="Describe the sectors you serve and the problems you solve for each."
          action={
            <Button asChild>
              <Link href="/admin/industries/new">Add an industry</Link>
            </Button>
          }
        />
      ) : (
        <TableWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Industry</TableHeaderCell>
                <TableHeaderCell>Description</TableHeaderCell>
                <TableHeaderCell>Order</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell className="text-right">Actions</TableHeaderCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {industries.map((industry) => (
                <TableRow key={industry.id}>
                  <TableCell>
                    <Link
                      href={`/admin/industries/${industry.id}`}
                      className="font-medium text-foreground hover:text-secondary"
                    >
                      {industry.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-subtle">
                      {industry.challenges.length} challenges · {industry.solutions.length} solutions
                    </p>
                  </TableCell>
                  <TableCell className="max-w-md text-xs">
                    {truncate(industry.description, 120)}
                  </TableCell>
                  <TableCell className="text-subtle">{industry.order}</TableCell>
                  <TableCell>
                    <ActiveBadge active={industry.isActive} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/industries/${industry.id}`}>
                          <SquarePen className="size-4" aria-hidden="true" />
                          Edit
                        </Link>
                      </Button>
                      <DeleteButton
                        id={industry.id}
                        label={industry.title}
                        entityLabel="industry"
                        action={deleteIndustry}
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
