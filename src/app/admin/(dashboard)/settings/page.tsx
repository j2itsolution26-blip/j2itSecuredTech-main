import { UserRole } from '@prisma/client';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminForm, FormSection, TextField, TextareaField } from '@/components/admin/AdminForm';
import { Alert } from '@/components/ui/feedback';
import { getSettingsForAdmin } from '@/lib/data/settings';
import { saveSettings } from '@/lib/actions/admin-actions';
import { requireRole } from '@/lib/auth/guards';

export const dynamic = 'force-dynamic';

const GROUPS = [
  {
    key: 'general',
    title: 'General',
    description: 'Site identity used across the header, footer and metadata.',
  },
  {
    key: 'contact',
    title: 'Contact details',
    description: 'Shown in the navigation, footer, contact page and call-to-action sections.',
  },
  {
    key: 'social',
    title: 'Social profiles',
    description: 'Linked from the footer and published as Organization structured data.',
  },
];

/** Long-form values get a textarea rather than a single-line input. */
const MULTILINE_KEYS = new Set(['site.description', 'contact.address']);

export default async function AdminSettingsPage() {
  await requireRole(UserRole.ADMIN);
  const settings = await getSettingsForAdmin();

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Settings"
        description="Site-wide configuration. Changes take effect on the public site immediately."
        breadcrumbs={[{ name: 'Settings' }]}
      />

      <Alert tone="info">
        Blank fields fall back to the built-in defaults, so the website always renders complete
        contact information.
      </Alert>

      <AdminForm action={saveSettings} submitLabel="Save settings">
        {GROUPS.map((group) => {
          const fields = settings.filter((setting) => setting.group === group.key);
          if (fields.length === 0) return null;

          return (
            <FormSection
              key={group.key}
              title={group.title}
              description={group.description}
              columns={2}
            >
              {fields.map((field) =>
                MULTILINE_KEYS.has(field.key) ? (
                  <TextareaField
                    key={field.key}
                    name={field.key}
                    label={field.label}
                    rows={3}
                    className="sm:col-span-2"
                    defaultValue={field.value}
                  />
                ) : (
                  <TextField
                    key={field.key}
                    name={field.key}
                    label={field.label}
                    defaultValue={field.value}
                  />
                ),
              )}
            </FormSection>
          );
        })}
      </AdminForm>
    </div>
  );
}
