import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { COMPANY_INFO } from '@/lib/constants';
import { SITE_URL } from '@/lib/env';
import { getSettings } from '@/lib/data/settings';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#020617',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

/**
 * Site-wide defaults. Individual pages override title/description through
 * `buildMetadata`; anything they omit falls back to these values.
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const indexable = settings['seo.robotsIndex'] !== 'false';

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: settings['seo.metaTitle'],
      template: `%s | ${settings['site.name']}`,
    },
    description: settings['seo.metaDescription'],
    keywords: settings['seo.keywords'].split(',').map((keyword) => keyword.trim()).filter(Boolean),
    applicationName: settings['site.name'],
    authors: [{ name: COMPANY_INFO.legalName, url: SITE_URL }],
    creator: COMPANY_INFO.legalName,
    publisher: COMPANY_INFO.legalName,
    category: 'technology',
    alternates: { canonical: SITE_URL },
    formatDetection: { telephone: true, address: true, email: true },
    verification: settings['seo.googleVerification']
      ? { google: settings['seo.googleVerification'] }
      : undefined,
    openGraph: {
      type: 'website',
      locale: 'en_PH',
      url: SITE_URL,
      siteName: settings['site.name'],
      title: settings['seo.metaTitle'],
      description: settings['seo.metaDescription'],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings['seo.metaTitle'],
      description: settings['seo.metaDescription'],
    },
    robots: indexable
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        }
      : { index: false, follow: false },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-body text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
