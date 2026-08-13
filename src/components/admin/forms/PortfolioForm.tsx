import type { Portfolio } from '@prisma/client';
import {
  AdminForm,
  CheckboxField,
  FormSection,
  HiddenId,
  ListField,
  TextField,
  TextareaField,
} from '@/components/admin/AdminForm';
import { saveProject } from '@/lib/actions/content-actions';

/** `<input type="date">` needs an ISO yyyy-mm-dd value. */
function toDateInput(value: Date | null | undefined): string {
  return value ? new Date(value).toISOString().slice(0, 10) : '';
}

export function PortfolioForm({ project }: { project?: Portfolio | null }) {
  return (
    <AdminForm
      action={saveProject}
      submitLabel={project ? 'Update project' : 'Create project'}
      redirectOnSuccess="/admin/portfolio"
    >
      <HiddenId value={project?.id} />

      <FormSection title="Project details" columns={2}>
        <TextField name="title" label="Project title" required defaultValue={project?.title} />
        <TextField name="slug" label="URL slug" required defaultValue={project?.slug} />
        <TextField
          name="category"
          label="Category"
          required
          defaultValue={project?.category}
          hint="Used for the portfolio filters, e.g. “Enterprise Software”."
        />
        <TextField name="client" label="Client" required defaultValue={project?.client} />
        <TextField name="industry" label="Industry" defaultValue={project?.industry} />
        <TextField name="location" label="Location" defaultValue={project?.location} />
        <TextareaField
          name="summary"
          label="Summary"
          required
          rows={3}
          className="sm:col-span-2"
          defaultValue={project?.summary}
        />
      </FormSection>

      <FormSection title="Case study">
        <TextareaField
          name="overview"
          label="Project overview"
          required
          rows={10}
          defaultValue={project?.overview}
          hint="Basic HTML is supported and sanitised on save."
        />
        <TextareaField name="challenge" label="The challenge" rows={7} defaultValue={project?.challenge} />
        <TextareaField name="solution" label="Our solution" rows={7} defaultValue={project?.solution} />
      </FormSection>

      <FormSection title="Delivery detail" columns={2}>
        <ListField name="technologies" label="Technologies used" defaultValue={project?.technologies} />
        <ListField name="features" label="Delivered features" defaultValue={project?.features} />
        <ListField name="results" label="Measured results" defaultValue={project?.results} />
        <ListField
          name="images"
          label="Gallery image URLs"
          defaultValue={project?.images}
          hint="One image URL per line."
        />
      </FormSection>

      <FormSection title="Presentation & SEO" columns={2}>
        <TextField name="thumbnail" label="Thumbnail URL" required defaultValue={project?.thumbnail} />
        <TextField
          name="completedAt"
          label="Completion date"
          type="date"
          defaultValue={toDateInput(project?.completedAt)}
        />
        <TextField name="metaTitle" label="Meta title" defaultValue={project?.metaTitle} />
        <TextField name="metaDesc" label="Meta description" defaultValue={project?.metaDesc} />
        <TextField name="order" label="Display order" type="number" defaultValue={project?.order ?? 0} />
        <div className="flex flex-col gap-3">
          <CheckboxField name="isActive" label="Visible on the website" defaultChecked={project?.isActive ?? true} />
          <CheckboxField
            name="isFeatured"
            label="Feature on the home page"
            defaultChecked={project?.isFeatured ?? false}
          />
        </div>
      </FormSection>
    </AdminForm>
  );
}
