import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { CareerForm } from '@/components/admin/forms/SimpleForms';
import { getCareerById } from '@/lib/data/marketing';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

export default async function CareerEditorPage({ params }: PageProps) {
  const { id } = await params;
  const isNew = id === 'new';

  const career = isNew ? null : await getCareerById(id);
  if (!isNew && !career) notFound();

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title={isNew ? 'Post a role' : `Edit: ${career?.title}`}
        description="Roles past their closing date are hidden from the public listing automatically."
        breadcrumbs={[{ name: 'Careers', href: '/admin/careers' }, { name: isNew ? 'New' : 'Edit' }]}
      />

      <CareerForm career={career} />
    </div>
  );
}
