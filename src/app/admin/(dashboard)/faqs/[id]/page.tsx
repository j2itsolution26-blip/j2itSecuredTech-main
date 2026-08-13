import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { FaqForm } from '@/components/admin/forms/SimpleForms';
import { getFaqById } from '@/lib/data/marketing';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

export default async function FaqEditorPage({ params }: PageProps) {
  const { id } = await params;
  const isNew = id === 'new';

  const faq = isNew ? null : await getFaqById(id);
  if (!isNew && !faq) notFound();

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title={isNew ? 'Add FAQ' : 'Edit FAQ'}
        description="Answers are rendered as plain text and included in FAQ structured data."
        breadcrumbs={[{ name: 'FAQs', href: '/admin/faqs' }, { name: isNew ? 'New' : 'Edit' }]}
      />

      <FaqForm faq={faq} />
    </div>
  );
}
