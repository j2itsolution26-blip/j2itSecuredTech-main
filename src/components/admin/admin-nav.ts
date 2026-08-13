import { UserRole } from '@prisma/client';

export type AdminNavItem = {
  label: string;
  href: string;
  icon: string;
  /** Minimum role required to see the entry. */
  role?: UserRole;
  exact?: boolean;
};

export type AdminNavGroup = {
  title: string;
  items: AdminNavItem[];
};

/** Single source of truth for admin navigation and its role visibility. */
export const ADMIN_NAV: AdminNavGroup[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard', exact: true },
      { label: 'Analytics', href: '/admin/analytics', icon: 'ChartLine' },
    ],
  },
  {
    title: 'Leads',
    items: [
      { label: 'Quote Requests', href: '/admin/quotes', icon: 'FileText' },
      { label: 'Contact Messages', href: '/admin/messages', icon: 'Mail' },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Services', href: '/admin/services', icon: 'Layers' },
      { label: 'Portfolio', href: '/admin/portfolio', icon: 'FolderKanban' },
      { label: 'Blog', href: '/admin/blog', icon: 'Newspaper' },
      { label: 'Industries', href: '/admin/industries', icon: 'Building2' },
      { label: 'Testimonials', href: '/admin/testimonials', icon: 'Quote' },
      { label: 'FAQs', href: '/admin/faqs', icon: 'CircleHelp' },
      { label: 'Careers', href: '/admin/careers', icon: 'Briefcase' },
      { label: 'Media Library', href: '/admin/media', icon: 'Images' },
    ],
  },
  {
    title: 'Administration',
    items: [
      { label: 'Users', href: '/admin/users', icon: 'Users', role: UserRole.ADMIN },
      { label: 'Settings', href: '/admin/settings', icon: 'Settings', role: UserRole.ADMIN },
      { label: 'SEO', href: '/admin/seo', icon: 'Search', role: UserRole.ADMIN },
      { label: 'Audit Logs', href: '/admin/audit-logs', icon: 'ScrollText', role: UserRole.ADMIN },
    ],
  },
];
