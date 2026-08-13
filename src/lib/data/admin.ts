import 'server-only';
import type { Prisma } from '@prisma/client';
import { MessageStatus, QuoteStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export const AUDIT_PAGE_SIZE = 25;

// --- Users -------------------------------------------------------------------

export function listUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });
}

export function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });
}

// --- Media -------------------------------------------------------------------

export function listMedia(search?: string) {
  return prisma.media.findMany({
    where: search ? { name: { contains: search, mode: 'insensitive' } } : undefined,
    orderBy: { createdAt: 'desc' },
    take: 200,
  });
}

// --- Audit -------------------------------------------------------------------

export async function listAuditLogs({
  page = 1,
  entity,
}: { page?: number; entity?: string } = {}) {
  const where: Prisma.AuditLogWhereInput = entity ? { entity } : {};
  const currentPage = Math.max(1, page);

  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * AUDIT_PAGE_SIZE,
      take: AUDIT_PAGE_SIZE,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    items,
    total,
    page: currentPage,
    totalPages: Math.max(1, Math.ceil(total / AUDIT_PAGE_SIZE)),
  };
}

export async function getAuditEntities(): Promise<string[]> {
  const rows = await prisma.auditLog.findMany({
    select: { entity: true },
    distinct: ['entity'],
    orderBy: { entity: 'asc' },
  });
  return rows.map((row) => row.entity);
}

// --- Dashboard analytics -----------------------------------------------------

export type DashboardMetrics = Awaited<ReturnType<typeof getDashboardMetrics>>;

export async function getDashboardMetrics() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const [
    totalQuotes,
    pendingQuotes,
    wonQuotes,
    quotesThisPeriod,
    quotesPreviousPeriod,
    unreadMessages,
    totalMessages,
    publishedPosts,
    draftPosts,
    activeProjects,
    activeServices,
    totalViews,
    recentQuotes,
    recentMessages,
    recentAudit,
  ] = await Promise.all([
    prisma.quoteRequest.count(),
    prisma.quoteRequest.count({ where: { status: QuoteStatus.PENDING } }),
    prisma.quoteRequest.count({ where: { status: QuoteStatus.WON } }),
    prisma.quoteRequest.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.quoteRequest.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
    prisma.contactMessage.count({ where: { status: MessageStatus.UNREAD } }),
    prisma.contactMessage.count(),
    prisma.blogPost.count({ where: { isPublished: true } }),
    prisma.blogPost.count({ where: { isPublished: false } }),
    prisma.portfolio.count({ where: { isActive: true } }),
    prisma.service.count({ where: { isActive: true } }),
    prisma.blogPost.aggregate({ _sum: { views: true } }),
    prisma.quoteRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, reference: true, name: true, company: true, service: true, status: true, createdAt: true },
    }),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, subject: true, status: true, createdAt: true },
    }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: { id: true, action: true, entity: true, summary: true, userEmail: true, createdAt: true },
    }),
  ]);

  const growth =
    quotesPreviousPeriod === 0
      ? quotesThisPeriod > 0
        ? 100
        : 0
      : Math.round(((quotesThisPeriod - quotesPreviousPeriod) / quotesPreviousPeriod) * 100);

  return {
    totalQuotes,
    pendingQuotes,
    wonQuotes,
    quotesThisPeriod,
    quoteGrowth: growth,
    unreadMessages,
    totalMessages,
    publishedPosts,
    draftPosts,
    activeProjects,
    activeServices,
    totalViews: totalViews._sum.views ?? 0,
    recentQuotes,
    recentMessages,
    recentAudit,
  };
}

/** Twelve month lead volume series for the analytics charts. */
export async function getLeadTrend() {
  const start = new Date();
  start.setMonth(start.getMonth() - 11, 1);
  start.setHours(0, 0, 0, 0);

  const [quotes, messages] = await Promise.all([
    prisma.quoteRequest.findMany({
      where: { createdAt: { gte: start } },
      select: { createdAt: true },
    }),
    prisma.contactMessage.findMany({
      where: { createdAt: { gte: start } },
      select: { createdAt: true },
    }),
  ]);

  const buckets = new Map<string, { month: string; quotes: number; messages: number }>();

  for (let index = 0; index < 12; index += 1) {
    const date = new Date(start);
    date.setMonth(start.getMonth() + index);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    buckets.set(key, {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      quotes: 0,
      messages: 0,
    });
  }

  const keyOf = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

  for (const quote of quotes) {
    const bucket = buckets.get(keyOf(quote.createdAt));
    if (bucket) bucket.quotes += 1;
  }

  for (const message of messages) {
    const bucket = buckets.get(keyOf(message.createdAt));
    if (bucket) bucket.messages += 1;
  }

  return [...buckets.values()];
}

/** Lead volume grouped by requested service, highest first. */
export async function getServiceDemand() {
  const rows = await prisma.quoteRequest.groupBy({
    by: ['service'],
    _count: { service: true },
    orderBy: { _count: { service: 'desc' } },
    take: 8,
  });

  return rows.map((row) => ({ service: row.service, count: row._count.service }));
}

export async function getQuoteStatusBreakdown() {
  const rows = await prisma.quoteRequest.groupBy({
    by: ['status'],
    _count: { status: true },
  });

  return Object.values(QuoteStatus).map((status) => ({
    status,
    count: rows.find((row) => row.status === status)?._count.status ?? 0,
  }));
}
