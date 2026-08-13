import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ServiceForm } from '@/components/admin/forms/ServiceForm';
import { getServiceById } from '@/lib/data/services';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

/** `/admin/services/new` creates; any other id edits that record. */
export default async function ServiceEditorPage({ params }: PageProps) {
  const { id } = await params;
  const isNew = id === 'new';

  const service = isNew ? null : await getServiceById(id);
  if (!isNew && !service) notFound();

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title={isNew ? 'New service' : `Edit: ${service?.title}`}
        description={
          isNew
            ? 'Add a service to the public catalogue and the quote request selector.'
            : 'Changes go live as soon as they are saved.'
        }
        breadcrumbs={[
          { name: 'Services', href: '/admin/services' },
          { name: isNew ? 'New' : 'Edit' },
        ]}
      />

      <ServiceForm service={service} />
    </div>
  );
}
