'use server';

import { UserRole } from '@prisma/client';
import { authorizeAction } from '@/lib/auth/guards';
import { getClientIp } from '@/lib/request-context';
import { rateLimit, RATE_LIMITS } from '@/lib/security/rate-limit';
import { isCloudinaryConfigured } from '@/lib/env';
import { createSignature, type UploadSignature } from '@/lib/media/cloudinary';

export type SignatureResult =
  | { ok: true; signature: UploadSignature }
  | { ok: false; error: string };

/**
 * Issues a Cloudinary upload signature to an authenticated editor.
 * Returns a typed failure instead of throwing so the client can present a
 * fallback "paste a URL" flow when the CDN is not configured.
 */
export async function createUploadSignature(): Promise<SignatureResult> {
  try {
    const session = await authorizeAction(UserRole.EDITOR);

    const ip = await getClientIp();
    const limit = rateLimit(`upload:${session.user.id}:${ip}`, RATE_LIMITS.mediaUpload);
    if (!limit.success) {
      return { ok: false, error: 'Upload limit reached. Please wait a moment and try again.' };
    }

    if (!isCloudinaryConfigured) {
      return {
        ok: false,
        error: 'Cloudinary is not configured. Add an asset by URL instead, or set the Cloudinary environment variables.',
      };
    }

    return { ok: true, signature: createSignature() };
  } catch (error) {
    console.error('[media] signature failed', error);
    return { ok: false, error: 'Unable to start the upload. Please sign in again and retry.' };
  }
}
