import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { IndustryForm } from '@/components/admin/forms/SimpleForms';
import { getIndustryById } from '@/lib/data/marketing';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

export default async function IndustryEditorPage({ params }: PageProps) {
  const { id } = await params;
  const isNew = id === 'new';

  const industry = isNew ? null : await getIndustryById(id);
  if (!isNew && !industry) notFound();

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title={isNew ? 'Add industry' : `Edit: ${industry?.title}`}
        description="The slug is used as the anchor target on the public industries page."
        breadcrumbs={[
          { name: 'Industries', href: '/admin/industries' },
          { name: isNew ? 'New' : 'Edit' },
        ]}
      />

      <IndustryForm industry={industry} />
    </div>
  );
}
