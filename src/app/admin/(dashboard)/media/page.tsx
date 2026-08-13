import Image from 'next/image';
import { MediaType } from '@prisma/client';
import { FileText, Film, Images } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { AdminForm, FormSection, TextField, SelectField } from '@/components/admin/AdminForm';
import { Badge } from '@/components/ui/badge';
import { EmptyState, Alert } from '@/components/ui/feedback';
import { listMedia } from '@/lib/data/admin';
import { deleteMedia, saveMedia } from '@/lib/actions/admin-actions';
import { isCloudinaryConfigured } from '@/lib/env';
import { formatBytes, formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const TYPE_OPTIONS = Object.values(MediaType).map((value) => ({
  value,
  label: value.charAt(0) + value.slice(1).toLowerCase(),
}));

export default async function AdminMediaPage() {
  const assets = await listMedia();

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Media library"
        description="Central store of image, video and document URLs used across the site."
        breadcrumbs={[{ name: 'Media library' }]}
      />

      {isCloudinaryConfigured ? (
        <MediaUploader />
      ) : (
        <Alert tone="info" title="Cloudinary is not configured">
          Set <code>CLOUDINARY_CLOUD_NAME</code>, <code>CLOUDINARY_API_KEY</code> and{' '}
          <code>CLOUDINARY_API_SECRET</code> to enable direct uploads. Until then, register assets by
          URL using the form below.
        </Alert>
      )}

      <section aria-labelledby="register-asset">
        <h2 id="register-asset" className="sr-only">
          Register an asset by URL
        </h2>
        <AdminForm action={saveMedia} submitLabel="Add asset">
          <FormSection
            title="Add an asset by URL"
            description="Useful for assets already hosted elsewhere."
            columns={2}
          >
            <TextField name="name" label="Name" required placeholder="hospital-network-rack.jpg" />
            <TextField name="url" label="URL" required placeholder="https://res.cloudinary.com/…" />
            <SelectField name="type" label="Type" options={TYPE_OPTIONS} defaultValue={MediaType.IMAGE} />
            <TextField name="alt" label="Alternative text" hint="Describe the asset for screen readers." />
          </FormSection>
        </AdminForm>
      </section>

      <section aria-labelledby="library-heading">
        <h2 id="library-heading" className="mb-4 font-heading text-base font-semibold text-foreground">
          Library
          <span className="ml-2 text-sm font-normal text-subtle">{assets.length} assets</span>
        </h2>

        {assets.length === 0 ? (
          <EmptyState
            icon={Images}
            title="The library is empty"
            description="Upload an asset or register one by URL to get started."
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {assets.map((asset) => (
              <li
                key={asset.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card/60"
              >
                <div className="relative aspect-[4/3] bg-surface">
                  {asset.type === MediaType.IMAGE ? (
                    <Image
                      src={asset.url}
                      alt={asset.alt ?? asset.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-subtle">
                      {asset.type === MediaType.VIDEO ? (
                        <Film className="size-8" aria-hidden="true" />
                      ) : (
                        <FileText className="size-8" aria-hidden="true" />
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <p className="truncate text-sm font-medium text-foreground" title={asset.name}>
                    {asset.name}
                  </p>
                  <p className="mt-1 text-xs text-subtle">
                    {asset.width && asset.height ? `${asset.width}×${asset.height} · ` : ''}
                    {formatBytes(asset.bytes)} · {formatDate(asset.createdAt)}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <Badge variant="outline">{asset.format ?? asset.type.toLowerCase()}</Badge>
                    <DeleteButton
                      id={asset.id}
                      label={asset.name}
                      entityLabel="asset"
                      action={deleteMedia}
                      size="icon"
                    />
                  </div>

                  <input
                    readOnly
                    value={asset.url}
                    aria-label={`URL for ${asset.name}`}
                    className="mt-3 w-full truncate rounded-lg border border-border bg-surface/80 px-2.5 py-1.5 font-mono text-[11px] text-muted"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
