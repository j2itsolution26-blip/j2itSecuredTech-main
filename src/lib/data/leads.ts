import 'server-only';
import type { MessageStatus, Prisma, QuoteStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export const LEADS_PER_PAGE = 20;

export type LeadQuery = {
  page?: number;
  status?: QuoteStatus;
  search?: string;
};

export async function listQuoteRequests({ page = 1, status, search }: LeadQuery = {}) {
  const where: Prisma.QuoteRequestWhereInput = {
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { company: { contains: search, mode: 'insensitive' } },
            { reference: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const currentPage = Math.max(1, page);

  const [items, total] = await Promise.all([
    prisma.quoteRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * LEADS_PER_PAGE,
      take: LEADS_PER_PAGE,
    }),
    prisma.quoteRequest.count({ where }),
  ]);

  return { items, total, page: currentPage, totalPages: Math.max(1, Math.ceil(total / LEADS_PER_PAGE)) };
}

export function getQuoteRequestById(id: string) {
  return prisma.quoteRequest.findUnique({ where: { id } });
}

export async function listContactMessages({
  page = 1,
  status,
  search,
}: { page?: number; status?: MessageStatus; search?: string } = {}) {
  const where: Prisma.ContactMessageWhereInput = {
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { subject: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const currentPage = Math.max(1, page);

  const [items, total] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * LEADS_PER_PAGE,
      take: LEADS_PER_PAGE,
    }),
    prisma.contactMessage.count({ where }),
  ]);

  return { items, total, page: currentPage, totalPages: Math.max(1, Math.ceil(total / LEADS_PER_PAGE)) };
}

export function getContactMessageById(id: string) {
  return prisma.contactMessage.findUnique({ where: { id } });
}

/**
 * Human-readable reference (e.g. `Q-2603-8FK2`) returned to the client on
 * submission and used by the sales team to locate the record.
 */
export function generateQuoteReference(): string {
  const now = new Date();
  const yearMonth = `${now.getFullYear().toString().slice(-2)}${String(now.getMonth() + 1).padStart(2, '0')}`;
  const random = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `Q-${yearMonth}-${random}`;
}
