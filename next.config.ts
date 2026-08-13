import type { NextConfig } from 'next';

/**
 * Content Security Policy.
 *
 * `unsafe-inline` is required for styles because Next.js injects critical CSS
 * inline, and for scripts because the framework bootstraps hydration with
 * inline payloads. Everything else is locked to first-party origins plus the
 * image CDN.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com",
  "connect-src 'self' https://api.cloudinary.com https://res.cloudinary.com",
  "frame-src 'self' https://www.google.com https://maps.google.com",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  },

  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion'],
  },

  // The pg driver and Prisma engine must stay outside the bundler.
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-pg', 'pg', 'bcryptjs'],

  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },

  async redirects() {
    return [
      { source: '/quote', destination: '/request-quote', permanent: true },
      { source: '/privacy', destination: '/privacy-policy', permanent: true },
      { source: '/terms-of-service', destination: '/terms', permanent: true },
      { source: '/faq', destination: '/faqs', permanent: true },
    ];
  },
};

export default nextConfig;
