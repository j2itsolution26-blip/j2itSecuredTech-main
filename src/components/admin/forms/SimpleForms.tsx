import type { Career, Faq, Industry, Testimonial } from '@prisma/client';
import { EmploymentType, UserRole } from '@prisma/client';
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
import { saveCareer, saveFaq, saveIndustry, saveTestimonial } from '@/lib/actions/content-actions';
import { createUser, updateUser } from '@/lib/actions/admin-actions';
import { humanizeEnum } from '@/lib/utils';

const ICON_OPTIONS = ICON_NAMES.map((name) => ({ value: name, label: name }));

function toDateInput(value: Date | null | undefined): string {
  return value ? new Date(value).toISOString().slice(0, 10) : '';
}

// --- Testimonial -------------------------------------------------------------

export function TestimonialForm({ testimonial }: { testimonial?: Testimonial | null }) {
  return (
    <AdminForm
      action={saveTestimonial}
      submitLabel={testimonial ? 'Update testimonial' : 'Add testimonial'}
      redirectOnSuccess="/admin/testimonials"
    >
      <HiddenId value={testimonial?.id} />

      <FormSection title="Client testimonial" columns={2}>
        <TextField name="name" label="Client name" required defaultValue={testimonial?.name} />
        <TextField name="role" label="Role / job title" required defaultValue={testimonial?.role} />
        <TextField name="company" label="Company" required defaultValue={testimonial?.company} />
        <TextField name="industry" label="Industry" defaultValue={testimonial?.industry} />
        <TextareaField
          name="content"
          label="Testimonial"
          required
          rows={6}
          className="sm:col-span-2"
          defaultValue={testimonial?.content}
        />
        <TextField name="image" label="Photo URL" defaultValue={testimonial?.image} />
        <TextField
          name="rating"
          label="Rating (1–5)"
          type="number"
          defaultValue={testimonial?.rating ?? 5}
        />
        <TextField name="order" label="Display order" type="number" defaultValue={testimonial?.order ?? 0} />
        <div className="flex flex-col gap-3">
          <CheckboxField name="isActive" label="Visible on the website" defaultChecked={testimonial?.isActive ?? true} />
          <CheckboxField
            name="isFeatured"
            label="Feature on the home page"
            defaultChecked={testimonial?.isFeatured ?? false}
          />
        </div>
      </FormSection>
    </AdminForm>
  );
}

// --- FAQ ---------------------------------------------------------------------

export function FaqForm({ faq }: { faq?: Faq | null }) {
  return (
    <AdminForm
      action={saveFaq}
      submitLabel={faq ? 'Update FAQ' : 'Add FAQ'}
      redirectOnSuccess="/admin/faqs"
    >
      <HiddenId value={faq?.id} />

      <FormSection title="Question & answer">
        <TextField name="question" label="Question" required defaultValue={faq?.question} />
        <TextareaField name="answer" label="Answer" required rows={7} defaultValue={faq?.answer} />
        <TextField
          name="category"
          label="Category"
          required
          defaultValue={faq?.category ?? 'General'}
          hint="FAQs are grouped by category on the public page."
        />
        <TextField name="order" label="Display order" type="number" defaultValue={faq?.order ?? 0} />
        <CheckboxField name="isActive" label="Visible on the website" defaultChecked={faq?.isActive ?? true} />
      </FormSection>
    </AdminForm>
  );
}

// --- Industry ----------------------------------------------------------------

export function IndustryForm({ industry }: { industry?: Industry | null }) {
  return (
    <AdminForm
      action={saveIndustry}
      submitLabel={industry ? 'Update industry' : 'Add industry'}
      redirectOnSuccess="/admin/industries"
    >
      <HiddenId value={industry?.id} />

      <FormSection title="Industry profile" columns={2}>
        <TextField name="title" label="Industry name" required defaultValue={industry?.title} />
        <TextField name="slug" label="URL slug" required defaultValue={industry?.slug} />
        <TextareaField
          name="description"
          label="Description"
          required
          rows={4}
          className="sm:col-span-2"
          defaultValue={industry?.description}
        />
        <SelectField name="icon" label="Icon" options={ICON_OPTIONS} defaultValue={industry?.icon ?? 'Building2'} />
        <TextField name="order" label="Display order" type="number" defaultValue={industry?.order ?? 0} />
        <ListField name="challenges" label="Common challenges" defaultValue={industry?.challenges} />
        <ListField name="solutions" label="How we solve them" defaultValue={industry?.solutions} />
        <CheckboxField name="isActive" label="Visible on the website" defaultChecked={industry?.isActive ?? true} />
      </FormSection>
    </AdminForm>
  );
}

// --- Career ------------------------------------------------------------------

const EMPLOYMENT_OPTIONS = Object.values(EmploymentType).map((value) => ({
  value,
  label: humanizeEnum(value),
}));

export function CareerForm({ career }: { career?: Career | null }) {
  return (
    <AdminForm
      action={saveCareer}
      submitLabel={career ? 'Update role' : 'Publish role'}
      redirectOnSuccess="/admin/careers"
    >
      <HiddenId value={career?.id} />

      <FormSection title="Position" columns={2}>
        <TextField name="title" label="Job title" required defaultValue={career?.title} />
        <TextField name="slug" label="URL slug" required defaultValue={career?.slug} />
        <TextField name="department" label="Department" required defaultValue={career?.department} />
        <SelectField
          name="type"
          label="Employment type"
          options={EMPLOYMENT_OPTIONS}
          defaultValue={career?.type ?? EmploymentType.FULL_TIME}
        />
        <TextField name="location" label="Location" required defaultValue={career?.location} />
        <TextField name="salaryRange" label="Salary range" defaultValue={career?.salaryRange} />
        <TextareaField
          name="description"
          label="Role description"
          required
          rows={8}
          className="sm:col-span-2"
          defaultValue={career?.description}
        />
      </FormSection>

      <FormSection title="Detail" columns={2}>
        <ListField name="responsibilities" label="Responsibilities" defaultValue={career?.responsibilities} />
        <ListField name="requirements" label="Requirements" defaultValue={career?.requirements} />
        <ListField name="benefits" label="Benefits" defaultValue={career?.benefits} />
        <div className="flex flex-col gap-5">
          <TextField
            name="closesAt"
            label="Applications close"
            type="date"
            defaultValue={toDateInput(career?.closesAt)}
          />
          <CheckboxField name="isRemote" label="Remote friendly" defaultChecked={career?.isRemote ?? false} />
          <CheckboxField name="isActive" label="Currently open" defaultChecked={career?.isActive ?? true} />
        </div>
      </FormSection>
    </AdminForm>
  );
}

// --- User --------------------------------------------------------------------

const ROLE_OPTIONS = Object.values(UserRole).map((value) => ({
  value,
  label: humanizeEnum(value),
}));

type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
};

export function UserForm({ user }: { user?: UserRecord | null }) {
  return (
    <AdminForm
      action={user ? updateUser : createUser}
      submitLabel={user ? 'Update user' : 'Create user'}
      redirectOnSuccess="/admin/users"
    >
      <HiddenId value={user?.id} />

      <FormSection title="Account" columns={2}>
        <TextField name="name" label="Full name" required defaultValue={user?.name} />
        <TextField name="email" label="Email address" type="email" required defaultValue={user?.email} />
        <SelectField
          name="role"
          label="Role"
          options={ROLE_OPTIONS}
          defaultValue={user?.role ?? UserRole.EDITOR}
          hint="Viewers read only, editors manage content, administrators manage everything."
        />
        <TextField
          name="password"
          label={user ? 'New password' : 'Password'}
          type="password"
          required={!user}
          hint={
            user
              ? 'Leave blank to keep the current password.'
              : 'Minimum 10 characters with upper case, lower case and a number.'
          }
        />
        <CheckboxField
          name="isActive"
          label="Account is active"
          hint="Deactivated accounts cannot sign in."
          defaultChecked={user?.isActive ?? true}
        />
      </FormSection>
    </AdminForm>
  );
}
