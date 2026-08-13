import { UserRole } from '@prisma/client';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminForm, FormSection, TextField, TextareaField } from '@/components/admin/AdminForm';
import { Alert } from '@/components/ui/feedback';
import { Button } from '@/components/ui/button';
import { getSettingsForAdmin } from '@/lib/data/settings';
import { saveSettings } from '@/lib/actions/admin-actions';
import { requireRole } from '@/lib/auth/guards';
import { SITE_URL } from '@/lib/env';

export const dynamic = 'force-dynamic';

const MULTILINE_KEYS = new Set(['seo.metaDescription', 'seo.keywords']);

/** Structured data emitted automatically — informational, not editable. */
const AUTOMATED_SEO = [
  'Canonical URL on every page',
  'OpenGraph and Twitter card tags from page metadata',
  'Organization, WebSite and ProfessionalService structured data',
  'BreadcrumbList on every interior page',
  'Service, BlogPosting, FAQPage and JobPosting schema where applicable',
  'XML sitemap regenerated hourly and on content changes',
  'robots.txt honouring the indexing switch below',
];

export default async function AdminSeoPage() {
  await requireRole(UserRole.ADMIN);
  const settings = await getSettingsForAdmin();
  const seoFields = settings.filter((setting) => setting.group === 'seo');

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="SEO"
        description="Default metadata, verification tokens and the site-wide indexing switch."
        breadcrumbs={[{ name: 'SEO' }]}
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">
                Sitemap
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href="/robots.txt" target="_blank" rel="noopener noreferrer">
                robots.txt
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            </Button>
          </>
        }
      />

      <Alert tone="warning" title="Indexing switch">
        Setting <code>Allow search engine indexing</code> to <code>false</code> adds a site-wide
        noindex directive and blocks all crawlers in robots.txt. Use it only for staging deployments.
      </Alert>

      <AdminForm action={saveSettings} submitLabel="Save SEO settings">
        <FormSection
          title="Default metadata"
          description={`Applied to ${SITE_URL} wherever a page does not define its own values.`}
          columns={2}
        >
          {seoFields.map((field) =>
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
              <TextField key={field.key} name={field.key} label={field.label} defaultValue={field.value} />
            ),
          )}
        </FormSection>
      </AdminForm>

      <section className="rounded-2xl border border-border bg-card/60 p-6" aria-labelledby="automated-seo">
        <h2 id="automated-seo" className="font-heading text-base font-semibold text-foreground">
          Handled automatically
        </h2>
        <p className="mt-1 text-sm text-muted">
          These are generated per page and need no configuration.
        </p>

        <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {AUTOMATED_SEO.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-slate-300">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
