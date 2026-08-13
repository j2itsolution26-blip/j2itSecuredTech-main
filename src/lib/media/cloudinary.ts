import 'server-only';
import { v2 as cloudinary } from 'cloudinary';
import { isCloudinaryConfigured } from '@/lib/env';

let configured = false;

function client() {
  if (!isCloudinaryConfigured) {
    throw new Error(
      'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.',
    );
  }

  if (!configured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    configured = true;
  }

  return cloudinary;
}

export type UploadSignature = {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
};

/**
 * Produces a short-lived signature so the browser can upload directly to
 * Cloudinary. The API secret never leaves the server and the folder is fixed
 * server-side, so a client cannot write outside the project namespace.
 */
export function createSignature(folder = 'j2securetech'): UploadSignature {
  const sdk = client();
  const timestamp = Math.round(Date.now() / 1000);

  const signature = sdk.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET as string,
  );

  return {
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY as string,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME as string,
    folder,
  };
}

export async function destroyAsset(publicId: string): Promise<void> {
  await client().uploader.destroy(publicId, { invalidate: true });
}
