import {
  Activity, ArrowRight, Award, Boxes, Building2, Camera, Cctv, CheckCircle2, CircuitBoard,
  Cloud, Code2, Cpu, Database, Factory, FileCheck, Fingerprint, Gauge, Globe, GraduationCap,
  Handshake, HardDrive, Headset, Hotel, Landmark, Laptop, Layers, Lock, MonitorSmartphone,
  Network, Package, Phone, Radio, Router, Server, ServerCog, Settings2, Shield, ShieldAlert,
  ShieldCheck, ShoppingBag, ShoppingCart, Stethoscope, Truck, Users, Wifi, Wrench, Zap,
  type LucideIcon,
} from 'lucide-react';

/**
 * Explicit icon registry.
 *
 * The CMS stores icons by name, but importing the whole Lucide barrel would
 * defeat tree-shaking. Registering the icons the site actually uses keeps the
 * client bundle small while still allowing editors to pick one by name.
 */
const ICON_REGISTRY = {
  Activity, ArrowRight, Award, Boxes, Building2, Camera, Cctv, CheckCircle2, CircuitBoard,
  Cloud, Code2, Cpu, Database, Factory, FileCheck, Fingerprint, Gauge, Globe, GraduationCap,
  Handshake, HardDrive, Headset, Hotel, Landmark, Laptop, Layers, Lock, MonitorSmartphone,
  Network, Package, Phone, Radio, Router, Server, ServerCog, Settings2, Shield, ShieldAlert,
  ShieldCheck, ShoppingBag, ShoppingCart, Stethoscope, Truck, Users, Wifi, Wrench, Zap,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICON_REGISTRY;

export const ICON_NAMES = Object.keys(ICON_REGISTRY) as IconName[];

export function resolveIcon(name: string | null | undefined): LucideIcon {
  if (name && name in ICON_REGISTRY) return ICON_REGISTRY[name as IconName];
  return Cpu;
}

export function Icon({
  name,
  className,
}: {
  name: string | null | undefined;
  className?: string;
}) {
  // Resolved inline from the static registry — no component is created here.
  const IconComponent = name && name in ICON_REGISTRY ? ICON_REGISTRY[name as IconName] : Cpu;
  return <IconComponent className={className} aria-hidden="true" />;
}
