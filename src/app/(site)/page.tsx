import { HeroSection } from '@/components/sections/HeroSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { TrustedBySection } from '@/components/sections/TrustedBySection';
import { ServicesOverview } from '@/components/sections/ServicesOverview';
import { IndustriesSection } from '@/components/sections/IndustriesSection';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { FeaturedPortfolio } from '@/components/sections/FeaturedPortfolio';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { LatestPosts } from '@/components/sections/LatestPosts';
import { FAQSection } from '@/components/sections/FAQSection';
import { CallToAction } from '@/components/sections/CallToAction';
import { JsonLd } from '@/components/shared/JsonLd';
import { getFeaturedServices } from '@/lib/data/services';
import { getFeaturedProjects } from '@/lib/data/portfolio';
import { getLatestPosts } from '@/lib/data/blog';
import { getFaqs, getIndustries, getFeaturedTestimonials } from '@/lib/data/marketing';
import { getSettings } from '@/lib/data/settings';
import { buildMetadata, faqSchema } from '@/lib/seo';

/**
 * Rendered per request; the underlying queries are cached and tag-invalidated,
 * so a page view costs a cache read rather than a database round trip.
 */
export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'Enterprise Technology Solutions for Modern Businesses',
  description:
    'J2 SecureTech delivers enterprise software, IoT and automation, networks and cybersecurity, CCTV and biometric security, telephone systems, electronics repair, cloud services and TESDA technical training for organisations across the Philippines.',
  path: '/',
});

export default async function HomePage() {
  const [services, industries, projects, testimonials, posts, faqs, settings] = await Promise.all([
    getFeaturedServices(6),
    getIndustries(),
    getFeaturedProjects(3),
    getFeaturedTestimonials(3),
    getLatestPosts(3),
    getFaqs(6),
    getSettings(),
  ]);

  return (
    <>
      {faqs.length > 0 ? (
        <JsonLd data={faqSchema(faqs.map(({ question, answer }) => ({ question, answer })))} />
      ) : null}

      <HeroSection />
      <StatsSection />
      <TrustedBySection />
      <ServicesOverview services={services} />
      <IndustriesSection industries={industries.slice(0, 8)} />
      <WhyChooseUs />
      <ProcessSection />
      <FeaturedPortfolio projects={projects} />
      <TestimonialsSection testimonials={testimonials} />
      <LatestPosts posts={posts} />
      <FAQSection faqs={faqs} />
      <CallToAction phone={settings['contact.phone']} />
    </>
  );
}
