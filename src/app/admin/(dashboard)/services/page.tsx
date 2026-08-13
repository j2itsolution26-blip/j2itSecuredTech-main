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
import { listServicesForAdmin } from '@/lib/data/services';
import { deleteService } from '@/lib/actions/content-actions';
import { humanizeEnum } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminServicesPage() {
  const services = await listServicesForAdmin();

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Services"
        description="The service catalogue that powers the public services pages and the quote form."
        breadcrumbs={[{ name: 'Services' }]}
        actions={
          <Button asChild size="sm">
            <Link href="/admin/services/new">
              <Plus className="size-4" aria-hidden="true" />
              New service
            </Link>
          </Button>
        }
      />

      {services.length === 0 ? (
        <EmptyState
          title="No services yet"
          description="Create your first service to populate the public catalogue."
          action={
            <Button asChild>
              <Link href="/admin/services/new">Create a service</Link>
            </Button>
          }
        />
      ) : (
        <TableWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Service</TableHeaderCell>
                <TableHeaderCell>Category</TableHeaderCell>
                <TableHeaderCell>Order</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell className="text-right">Actions</TableHeaderCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <Link
                      href={`/admin/services/${service.id}`}
                      className="font-medium text-foreground hover:text-secondary"
                    >
                      {service.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-subtle">/services/{service.slug}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{humanizeEnum(service.category)}</Badge>
                  </TableCell>
                  <TableCell className="text-subtle">{service.order}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      <ActiveBadge active={service.isActive} />
                      {service.isFeatured ? <Badge variant="brand">Featured</Badge> : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/services/${service.id}`}>
                          <SquarePen className="size-4" aria-hidden="true" />
                          Edit
                        </Link>
                      </Button>
                      <DeleteButton
                        id={service.id}
                        label={service.title}
                        entityLabel="service"
                        action={deleteService}
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
