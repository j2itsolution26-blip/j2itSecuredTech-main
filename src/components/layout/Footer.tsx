import Link from 'next/link';
import { Clock, Mail, MapPin, Phone, Shield } from 'lucide-react';
import { COMPANY_INFO, FOOTER_NAV } from '@/lib/constants';
import type { SettingsMap } from '@/lib/data/settings';
import { telHref } from '@/lib/utils';
import { FacebookIcon, GitHubIcon, LinkedInIcon, XIcon } from '@/components/shared/BrandIcons';

const SOCIAL_ICONS = [
  { key: 'social.facebook', label: 'Facebook', Icon: FacebookIcon },
  { key: 'social.linkedin', label: 'LinkedIn', Icon: LinkedInIcon },
  { key: 'social.twitter', label: 'X (Twitter)', Icon: XIcon },
  { key: 'social.github', label: 'GitHub', Icon: GitHubIcon },
] as const;

export function Footer({ settings }: { settings: SettingsMap }) {
  const year = new Date().getFullYear();

  const columns = [
    { title: 'Services', links: FOOTER_NAV.services },
    { title: 'Company', links: FOOTER_NAV.company },
    { title: 'Support', links: FOOTER_NAV.support },
  ];

  return (
    <footer className="relative border-t border-border bg-surface/60">
      <div className="gradient-glow -top-20 left-1/4 h-64 w-96 bg-primary/20" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary text-white">
                <Shield className="size-5" aria-hidden="true" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-heading text-lg font-bold text-white">
                  J2 <span className="text-secondary">SecureTech</span>
                </span>
                <span className="mt-1 text-[10px] uppercase tracking-[0.18em] text-subtle">
                  {settings['site.tagline']}
                </span>
              </span>
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-muted">
              {COMPANY_INFO.shortDescription}
            </p>

            <ul className="flex flex-col gap-3 text-sm text-muted">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden="true" />
                <span>{settings['contact.address']}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-secondary" aria-hidden="true" />
                <a
                  href={telHref(settings['contact.phone'])}
                  className="transition-colors hover:text-white"
                >
                  {settings['contact.phone']}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-secondary" aria-hidden="true" />
                <a href={`mailto:${settings['contact.email']}`} className="transition-colors hover:text-white">
                  {settings['contact.email']}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden="true" />
                <span>{settings['contact.hours']}</span>
              </li>
            </ul>

            <ul className="flex items-center gap-3">
              {SOCIAL_ICONS.map(({ key, label, Icon: SocialIcon }) => {
                const href = settings[key];
                if (!href) return null;

                return (
                  <li key={key}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${COMPANY_INFO.name} on ${label}`}
                      className="flex size-9 items-center justify-center rounded-lg border border-border bg-card/60 text-muted transition-colors hover:border-secondary/40 hover:text-secondary"
                    >
                      <SocialIcon className="size-4" aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="flex flex-col gap-4">
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
                {column.title}
              </h2>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted transition-colors hover:text-secondary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-subtle sm:flex-row">
          <p>
            © {year} {COMPANY_INFO.legalName}. All rights reserved.
          </p>
          <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link href="/privacy-policy" className="transition-colors hover:text-secondary">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-secondary">
              Terms
            </Link>
            <Link href="/sitemap.xml" className="transition-colors hover:text-secondary">
              Sitemap
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
