import { z } from 'zod';

/**
 * Fail fast on misconfiguration instead of surfacing cryptic runtime errors
 * deep inside a request. Only server-side variables are validated here; the
 * module must never be imported from a Client Component.
 *
 * `getServerEnv()` is invoked at module scope in `lib/auth/index.ts`, which the
 * Node runtime loads before any authenticated request or build-time page
 * collection. It is deliberately NOT called from `auth.config.ts`, because that
 * module runs in the edge proxy — throwing there would take the public
 * marketing site down over a variable only the admin console needs.
 */
const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  NEXTAUTH_SECRET: z.string().min(16, 'NEXTAUTH_SECRET must be at least 16 characters'),
  NEXTAUTH_URL: z.string().url().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cached) return cached;

  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => `  • ${issue.path.join('.')}: ${issue.message}`);
    throw new Error(
      `Invalid environment configuration:\n${issues.join('\n')}\n\n` +
        'Copy .env.example to .env and fill in the missing values. ' +
        'On Vercel, set them under Settings → Environment Variables and redeploy.',
    );
  }

  cached = parsed.data;
  return cached;
}

/** Canonical origin used for metadata, sitemaps and absolute links. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXTAUTH_URL ??
  'https://j2securetech.com'
).replace(/\/$/, '');

/** Cloudinary is optional — the media library degrades to URL entry without it. */
export const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET,
);
