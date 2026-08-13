import type { Service } from '@prisma/client';
import { ServiceCategory } from '@prisma/client';
import {
  AdminForm,
  CheckboxField,
  FormSection,
  HiddenId,
  ListField,
  SelectField,
  TextField,
  TextareaField,
} from '@/components/admin/AdminForm';
import { ICON_NAMES } from '@/components/shared/Icon';
import { saveService } from '@/lib/actions/content-actions';
import { humanizeEnum } from '@/lib/utils';

const CATEGORY_OPTIONS = Object.values(ServiceCategory).map((value) => ({
  value,
  label: humanizeEnum(value),
}));

const ICON_OPTIONS = ICON_NAMES.map((name) => ({ value: name, label: name }));

export function ServiceForm({ service }: { service?: Service | null }) {
  return (
    <AdminForm
      action={saveService}
      submitLabel={service ? 'Update service' : 'Create service'}
      redirectOnSuccess="/admin/services"
    >
      <HiddenId value={service?.id} />

      <FormSection title="Service details" columns={2}>
        <TextField name="title" label="Title" required defaultValue={service?.title} />
        <TextField
          name="slug"
          label="URL slug"
          required
          defaultValue={service?.slug}
          hint="Lowercase letters, numbers and hyphens. Changing this breaks existing links."
        />
        <SelectField
          name="category"
          label="Category"
          required
          options={CATEGORY_OPTIONS}
          defaultValue={service?.category ?? ServiceCategory.SOFTWARE}
        />
        <SelectField name="icon" label="Icon" options={ICON_OPTIONS} defaultValue={service?.icon ?? 'Cpu'} />
        <TextareaField
          name="summary"
          label="Summary"
          required
          rows={3}
          className="sm:col-span-2"
          defaultValue={service?.summary}
          hint="Shown on service cards and used as the meta description fallback."
        />
        <TextareaField
          name="description"
          label="Full description"
          required
          rows={12}
          className="sm:col-span-2"
          defaultValue={service?.description}
          hint="Basic HTML is supported and sanitised on save."
        />
      </FormSection>

      <FormSection title="Capabilities" columns={2}>
        <ListField name="features" label="Features" defaultValue={service?.features} rows={8} />
        <ListField name="deliverables" label="Deliverables" defaultValue={service?.deliverables} rows={8} />
      </FormSection>

      <FormSection title="Presentation & SEO" columns={2}>
        <TextField name="image" label="Header image URL" defaultValue={service?.image} />
        <TextField name="order" label="Display order" type="number" defaultValue={service?.order ?? 0} />
        <TextField name="metaTitle" label="Meta title" defaultValue={service?.metaTitle} />
        <TextField name="metaDesc" label="Meta description" defaultValue={service?.metaDesc} />
        <CheckboxField
          name="isActive"
          label="Visible on the website"
          defaultChecked={service?.isActive ?? true}
        />
        <CheckboxField
          name="isFeatured"
          label="Feature on the home page"
          defaultChecked={service?.isFeatured ?? false}
        />
      </FormSection>
    </AdminForm>
  );
}
