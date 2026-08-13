import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/shared/Reveal';
import { telHref } from '@/lib/utils';

export function CallToAction({
  title = 'Ready to scope your next project?',
  description = 'Send us your requirements and we will return a documented solution architecture, bill of materials and fixed proposal — typically within three business days.',
  phone,
}: {
  title?: string;
  description?: string;
  phone: string;
}) {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="gradient-glow left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 bg-primary/35" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Reveal className="glass-card flex flex-col items-center gap-8 rounded-3xl border-secondary/20 px-8 py-14 text-center">
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">{title}</h2>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted">{description}</p>
          </div>

          <div className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/request-quote">
                Request a Quote
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <a href={telHref(phone)}>
                <Phone className="size-4 text-secondary" aria-hidden="true" />
                {phone}
              </a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
