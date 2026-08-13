import Link from 'next/link';
import { Plus, SquarePen, Star } from 'lucide-react';
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
import { listTestimonialsForAdmin } from '@/lib/data/marketing';
import { deleteTestimonial } from '@/lib/actions/content-actions';
import { truncate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminTestimonialsPage() {
  const testimonials = await listTestimonialsForAdmin();

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Testimonials"
        description="Client feedback shown on the home page and the testimonials page."
        breadcrumbs={[{ name: 'Testimonials' }]}
        actions={
          <Button asChild size="sm">
            <Link href="/admin/testimonials/new">
              <Plus className="size-4" aria-hidden="true" />
              Add testimonial
            </Link>
          </Button>
        }
      />

      {testimonials.length === 0 ? (
        <EmptyState
          title="No testimonials yet"
          description="Add client feedback collected after project handover."
          action={
            <Button asChild>
              <Link href="/admin/testimonials/new">Add a testimonial</Link>
            </Button>
          }
        />
      ) : (
        <TableWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Client</TableHeaderCell>
                <TableHeaderCell>Testimonial</TableHeaderCell>
                <TableHeaderCell>Rating</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell className="text-right">Actions</TableHeaderCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {testimonials.map((testimonial) => (
                <TableRow key={testimonial.id}>
                  <TableCell>
                    <Link
                      href={`/admin/testimonials/${testimonial.id}`}
                      className="font-medium text-foreground hover:text-secondary"
                    >
                      {testimonial.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-subtle">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </TableCell>
                  <TableCell className="max-w-md text-xs">
                    {truncate(testimonial.content, 120)}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-warning">
                      <Star className="size-3.5 fill-warning" aria-hidden="true" />
                      {testimonial.rating}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      <ActiveBadge active={testimonial.isActive} />
                      {testimonial.isFeatured ? <Badge variant="brand">Featured</Badge> : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/testimonials/${testimonial.id}`}>
                          <SquarePen className="size-4" aria-hidden="true" />
                          Edit
                        </Link>
                      </Button>
                      <DeleteButton
                        id={testimonial.id}
                        label={`${testimonial.name} — ${testimonial.company}`}
                        entityLabel="testimonial"
                        action={deleteTestimonial}
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
