import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Default country calling code — Philippines. */
const DEFAULT_DIAL_CODE = '63';

/**
 * Converts a displayed phone number to E.164 for `tel:` links and schema.org.
 *
 * Numbers are written locally (`0955 557 3319`) because that is what visitors
 * recognise, but a leading zero is meaningless outside the country: it strands
 * international callers and produces invalid structured data. This maps the
 * trunk prefix to the country code while leaving numbers that already carry
 * one untouched.
 */
export function toE164(value: string, dialCode = DEFAULT_DIAL_CODE): string {
  const trimmed = value.trim();
  if (!trimmed) return '';

  if (trimmed.startsWith('+')) return `+${trimmed.slice(1).replace(/\D/g, '')}`;

  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return '';

  // Local trunk prefix, e.g. 0955… -> +63955…
  if (digits.startsWith('0')) return `+${dialCode}${digits.slice(1)}`;

  // Already includes the country code without a plus.
  if (digits.startsWith(dialCode)) return `+${digits}`;

  return `+${dialCode}${digits}`;
}

/** Builds a dialable `tel:` href from a displayed number. */
export function telHref(value: string): string {
  return `tel:${toE164(value)}`;
}

/**
 * Normalises a date to an ISO string for `datetime` attributes and JSON-LD.
 *
 * Values read back from `unstable_cache` are ISO strings rather than `Date`
 * instances, because the cache serialises to JSON. Prisma's generated types
 * still declare them as `Date`, so TypeScript cannot catch the difference and
 * calling `.toISOString()` directly throws on any cache hit. Always route
 * through this helper.
 */
export function toIsoString(value: Date | string | null | undefined): string | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function formatRelativeTime(date: Date | string): string {
  const target = new Date(date).getTime();
  const diffSeconds = Math.round((target - Date.now()) / 1000);

  const thresholds: [Intl.RelativeTimeFormatUnit, number][] = [
    ['second', 60],
    ['minute', 60],
    ['hour', 24],
    ['day', 7],
    ['week', 4.35],
    ['month', 12],
    ['year', Number.POSITIVE_INFINITY],
  ];

  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  let value = diffSeconds;

  for (const [unit, limit] of thresholds) {
    if (Math.abs(value) < limit) return formatter.format(Math.round(value), unit);
    value /= limit;
  }

  return formatter.format(Math.round(value), 'year');
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

/** Average adult reading speed, rounded up to whole minutes. */
export function estimateReadingTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function truncate(value: string, length: number): string {
  if (value.length <= length) return value;
  return `${value.slice(0, length).trimEnd()}…`;
}

/** Words that don't follow standard title-casing when humanizing enum members. */
const ENUM_WORD_OVERRIDES: Record<string, string> = {
  iot: 'IoT',
};

/** Converts SCREAMING_SNAKE enum members into readable labels. */
export function humanizeEnum(value: string): string {
  return value
    .toLowerCase()
    .split('_')
    .map((word) => ENUM_WORD_OVERRIDES[word] ?? word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function initialsOf(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

/** Safely coerces a search param that may arrive as an array. */
export function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function parsePage(value: string | string[] | undefined): number {
  const parsed = Number.parseInt(firstParam(value) ?? '1', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}
