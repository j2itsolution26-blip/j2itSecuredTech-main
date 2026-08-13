'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Upload } from 'lucide-react';
import { MediaType } from '@prisma/client';
import { createUploadSignature } from '@/lib/actions/media-actions';
import { saveMedia } from '@/lib/actions/admin-actions';
import { IDLE_STATE, type ActionState } from '@/lib/action-result';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/feedback';

type CloudinaryResponse = {
  secure_url: string;
  public_id: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
  resource_type?: string;
};

function toMediaType(resourceType?: string): MediaType {
  if (resourceType === 'video') return MediaType.VIDEO;
  if (resourceType === 'raw') return MediaType.DOCUMENT;
  return MediaType.IMAGE;
}

/**
 * Direct-to-Cloudinary upload.
 *
 * The browser never sees the API secret: it requests a short-lived signature
 * from the server, uploads straight to the CDN, then registers the resulting
 * asset in our database through a Server Action.
 */
export function MediaUploader() {
  const [state, setState] = React.useState<ActionState>(IDLE_STATE);
  const [isUploading, setIsUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;

    setIsUploading(true);
    setState(IDLE_STATE);

    try {
      const signatureResult = await createUploadSignature();

      if (!signatureResult.ok) {
        setState({ status: 'error', message: signatureResult.error });
        return;
      }

      const { signature, timestamp, apiKey, cloudName, folder } = signatureResult.signature;
      let uploaded = 0;

      for (const file of Array.from(files)) {
        const payload = new FormData();
        payload.append('file', file);
        payload.append('api_key', apiKey);
        payload.append('timestamp', String(timestamp));
        payload.append('signature', signature);
        payload.append('folder', folder);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
          method: 'POST',
          body: payload,
        });

        if (!response.ok) {
          throw new Error(`Cloudinary rejected “${file.name}”`);
        }

        const asset = (await response.json()) as CloudinaryResponse;

        const record = new FormData();
        record.set('name', file.name);
        record.set('url', asset.secure_url);
        record.set('publicId', asset.public_id);
        record.set('type', toMediaType(asset.resource_type));
        record.set('format', asset.format ?? '');
        record.set('width', String(asset.width ?? 0));
        record.set('height', String(asset.height ?? 0));
        record.set('bytes', String(asset.bytes ?? file.size));
        record.set('folder', folder);

        const result = await saveMedia(IDLE_STATE, record);
        if (result.status === 'error') {
          setState(result);
          return;
        }

        uploaded += 1;
      }

      setState({
        status: 'success',
        message: `${uploaded} ${uploaded === 1 ? 'asset' : 'assets'} uploaded to the media library.`,
      });
      router.refresh();
    } catch (error) {
      console.error('[media] upload failed', error);
      setState({
        status: 'error',
        message: error instanceof Error ? error.message : 'The upload failed. Please try again.',
      });
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {state.status !== 'idle' ? (
        <Alert tone={state.status === 'success' ? 'success' : 'error'}>{state.message}</Alert>
      ) : null}

      <div className="rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/15 text-secondary">
          <Upload className="size-5" aria-hidden="true" />
        </span>

        <h2 className="mt-4 font-heading text-base font-semibold text-foreground">Upload assets</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Images, video and documents are uploaded directly to Cloudinary and registered here
          automatically.
        </p>

        <label htmlFor="media-upload" className="sr-only">
          Choose files to upload
        </label>
        <input
          ref={inputRef}
          id="media-upload"
          type="file"
          multiple
          className="sr-only"
          onChange={(event) => handleFiles(event.target.files)}
          disabled={isUploading}
        />

        <Button
          type="button"
          className="mt-6"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Uploading…
            </>
          ) : (
            <>
              <Upload className="size-4" aria-hidden="true" />
              Select files
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
