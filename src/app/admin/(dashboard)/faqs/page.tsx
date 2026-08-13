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
import { listFaqsForAdmin } from '@/lib/data/marketing';
import { deleteFaq } from '@/lib/actions/content-actions';
import { truncate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminFaqsPage() {
  const faqs = await listFaqsForAdmin();

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="FAQs"
        description="Grouped by category on the public FAQ page and emitted as FAQ structured data."
        breadcrumbs={[{ name: 'FAQs' }]}
        actions={
          <Button asChild size="sm">
            <Link href="/admin/faqs/new">
              <Plus className="size-4" aria-hidden="true" />
              Add FAQ
            </Link>
          </Button>
        }
      />

      {faqs.length === 0 ? (
        <EmptyState
          title="No FAQs yet"
          description="Publishing FAQs improves search visibility through rich results."
          action={
            <Button asChild>
              <Link href="/admin/faqs/new">Add an FAQ</Link>
            </Button>
          }
        />
      ) : (
        <TableWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Question</TableHeaderCell>
                <TableHeaderCell>Category</TableHeaderCell>
                <TableHeaderCell>Order</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell className="text-right">Actions</TableHeaderCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {faqs.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell className="max-w-md">
                    <Link
                      href={`/admin/faqs/${faq.id}`}
                      className="font-medium text-foreground hover:text-secondary"
                    >
                      {faq.question}
                    </Link>
                    <p className="mt-0.5 text-xs text-subtle">{truncate(faq.answer, 110)}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{faq.category}</Badge>
                  </TableCell>
                  <TableCell className="text-subtle">{faq.order}</TableCell>
                  <TableCell>
                    <ActiveBadge active={faq.isActive} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/faqs/${faq.id}`}>
                          <SquarePen className="size-4" aria-hidden="true" />
                          Edit
                        </Link>
                      </Button>
                      <DeleteButton id={faq.id} label={faq.question} entityLabel="FAQ" action={deleteFaq} />
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
