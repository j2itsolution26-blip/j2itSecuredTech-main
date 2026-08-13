import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { TestimonialForm } from '@/components/admin/forms/SimpleForms';
import { getTestimonialById } from '@/lib/data/marketing';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

export default async function TestimonialEditorPage({ params }: PageProps) {
  const { id } = await params;
  const isNew = id === 'new';

  const testimonial = isNew ? null : await getTestimonialById(id);
  if (!isNew && !testimonial) notFound();

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title={isNew ? 'Add testimonial' : `Edit: ${testimonial?.name}`}
        description="Publish only feedback you have written permission to display."
        breadcrumbs={[
          { name: 'Testimonials', href: '/admin/testimonials' },
          { name: isNew ? 'New' : 'Edit' },
        ]}
      />

      <TestimonialForm testimonial={testimonial} />
    </div>
  );
}
