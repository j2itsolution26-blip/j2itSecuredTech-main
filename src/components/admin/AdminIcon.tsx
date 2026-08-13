import {
  Briefcase, Building2, ChartLine, CircleHelp, FileText, FolderKanban, Images, Layers,
  LayoutDashboard, Mail, Newspaper, Quote, ScrollText, Search, Settings, Users,
  type LucideIcon,
} from 'lucide-react';

/** Icon registry scoped to the admin navigation. */
const ADMIN_ICONS = {
  Briefcase, Building2, ChartLine, CircleHelp, FileText, FolderKanban, Images, Layers,
  LayoutDashboard, Mail, Newspaper, Quote, ScrollText, Search, Settings, Users,
} satisfies Record<string, LucideIcon>;

export function AdminIcon({ name, className }: { name: string; className?: string }) {
  const Component = ADMIN_ICONS[name as keyof typeof ADMIN_ICONS] ?? LayoutDashboard;
  return <Component className={className} aria-hidden="true" />;
}
