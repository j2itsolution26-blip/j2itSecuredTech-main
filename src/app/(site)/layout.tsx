import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { JsonLd } from '@/components/shared/JsonLd';
import { getSettings } from '@/lib/data/settings';
import { localBusinessSchema, organizationSchema, websiteSchema } from '@/lib/seo';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={[organizationSchema(), websiteSchema(), localBusinessSchema()]} />

      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Navbar phone={settings['contact.phone']} />

      <main id="main-content" className="flex-1 pt-[68px]">
        {children}
      </main>

      <Footer settings={settings} />
    </div>
  );
}
