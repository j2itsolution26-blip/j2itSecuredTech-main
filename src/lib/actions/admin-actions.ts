'use server';

import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { AuditAction, UserRole } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { CACHE_TAGS, revalidateContent } from '@/lib/cache';
import { sanitizeText } from '@/lib/security/sanitize';
import { userCreateSchema, userUpdateSchema } from '@/lib/validations/auth';
import { idSchema, mediaSchema, settingsSchema } from '@/lib/validations/content';
import { messageStatusUpdateSchema, quoteStatusUpdateSchema } from '@/lib/validations/lead';
import { SETTING_DEFINITIONS } from '@/lib/data/settings';
import { fromZodError, failure, type ActionState } from '@/lib/action-result';
import { runMutation, toNullable } from '@/lib/actions/mutation';

const BCRYPT_ROUNDS = 12;

function toObject(formData: FormData): Record<string, FormDataEntryValue> {
  return Object.fromEntries(formData.entries());
}

// --- Users -------------------------------------------------------------------

export async function createUser(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = userCreateSchema.safeParse({
    ...toObject(formData),
    isActive: formData.get('isActive') === 'on' || formData.get('isActive') === 'true',
  });
  if (!parsed.success) return fromZodError(parsed.error);

  return runMutation(
    { entity: 'User', action: AuditAction.CREATE, role: UserRole.ADMIN },
    async () => {
      const user = await prisma.user.create({
        data: {
          name: sanitizeText(parsed.data.name),
          email: parsed.data.email,
          password: await bcrypt.hash(parsed.data.password, BCRYPT_ROUNDS),
          role: parsed.data.role,
          isActive: parsed.data.isActive,
        },
      });

      revalidatePath('/admin/users');

      return {
        entityId: user.id,
        message: 'User account created.',
        summary: `Created ${user.role.toLowerCase()} account for ${user.email}`,
      };
    },
  );
}

export async function updateUser(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = userUpdateSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password') ?? '',
    role: formData.get('role'),
    isActive: formData.get('isActive') === 'on' || formData.get('isActive') === 'true',
  });
  if (!parsed.success) return fromZodError(parsed.error);

  return runMutation(
    { entity: 'User', action: AuditAction.UPDATE, role: UserRole.ADMIN },
    async (session) => {
      const { id, password, ...rest } = parsed.data;

      // An administrator must not be able to lock themselves out.
      if (id === session.user.id && (!rest.isActive || rest.role !== UserRole.ADMIN)) {
        throw new Error('You cannot remove your own administrator access.');
      }

      const user = await prisma.user.update({
        where: { id },
        data: {
          name: sanitizeText(rest.name),
          email: rest.email,
          role: rest.role,
          isActive: rest.isActive,
          ...(password ? { password: await bcrypt.hash(password, BCRYPT_ROUNDS) } : {}),
        },
      });

      revalidatePath('/admin/users');

      return {
        entityId: user.id,
        message: password ? 'User updated and password reset.' : 'User updated.',
        summary: `Updated account ${user.email}${password ? ' (password reset)' : ''}`,
      };
    },
  );
}

export async function deleteUser(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = idSchema.safeParse(toObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  return runMutation(
    { entity: 'User', action: AuditAction.DELETE, role: UserRole.ADMIN },
    async (session) => {
      if (parsed.data.id === session.user.id) {
        throw new Error('You cannot delete the account you are signed in with.');
      }

      const remainingAdmins = await prisma.user.count({
        where: { role: UserRole.ADMIN, isActive: true, id: { not: parsed.data.id } },
      });
      if (remainingAdmins === 0) {
        throw new Error('At least one active administrator must remain.');
      }

      const user = await prisma.user.delete({ where: { id: parsed.data.id } });
      revalidatePath('/admin/users');

      return {
        entityId: user.id,
        message: 'User deleted.',
        summary: `Deleted account ${user.email}`,
      };
    },
  );
}

// --- Lead management ---------------------------------------------------------

export async function updateQuoteStatus(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = quoteStatusUpdateSchema.safeParse(toObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  return runMutation({ entity: 'QuoteRequest', action: AuditAction.UPDATE }, async () => {
    const quote = await prisma.quoteRequest.update({
      where: { id: parsed.data.id },
      data: {
        status: parsed.data.status,
        notes: toNullable(parsed.data.notes),
      },
    });

    revalidatePath('/admin/quotes');
    revalidatePath(`/admin/quotes/${quote.id}`);

    return {
      entityId: quote.id,
      message: 'Quote request updated.',
      summary: `Quote ${quote.reference} moved to ${quote.status}`,
    };
  });
}

export async function deleteQuote(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = idSchema.safeParse(toObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  return runMutation(
    { entity: 'QuoteRequest', action: AuditAction.DELETE, role: UserRole.ADMIN },
    async () => {
      const quote = await prisma.quoteRequest.delete({ where: { id: parsed.data.id } });
      revalidatePath('/admin/quotes');

      return {
        entityId: quote.id,
        message: 'Quote request deleted.',
        summary: `Deleted quote request ${quote.reference}`,
      };
    },
  );
}

export async function updateMessageStatus(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = messageStatusUpdateSchema.safeParse(toObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  return runMutation({ entity: 'ContactMessage', action: AuditAction.UPDATE }, async () => {
    const message = await prisma.contactMessage.update({
      where: { id: parsed.data.id },
      data: {
        status: parsed.data.status,
        notes: toNullable(parsed.data.notes),
      },
    });

    revalidatePath('/admin/messages');
    revalidatePath(`/admin/messages/${message.id}`);

    return {
      entityId: message.id,
      message: 'Message updated.',
      summary: `Message from ${message.email} marked ${message.status}`,
    };
  });
}

export async function deleteMessage(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = idSchema.safeParse(toObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  return runMutation(
    { entity: 'ContactMessage', action: AuditAction.DELETE, role: UserRole.ADMIN },
    async () => {
      const message = await prisma.contactMessage.delete({ where: { id: parsed.data.id } });
      revalidatePath('/admin/messages');

      return {
        entityId: message.id,
        message: 'Message deleted.',
        summary: `Deleted contact message from ${message.email}`,
      };
    },
  );
}

// --- Media -------------------------------------------------------------------

export async function saveMedia(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = mediaSchema.safeParse(toObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  return runMutation({ entity: 'Media', action: AuditAction.CREATE, tag: CACHE_TAGS.media }, async () => {
    const { id, ...input } = parsed.data;

    const record = id
      ? await prisma.media.update({
          where: { id },
          data: { name: sanitizeText(input.name), alt: toNullable(input.alt) },
        })
      : await prisma.media.create({
          data: {
            ...input,
            name: sanitizeText(input.name),
            publicId: toNullable(input.publicId),
            format: toNullable(input.format),
            alt: toNullable(input.alt),
          },
        });

    revalidatePath('/admin/media');

    return {
      entityId: record.id,
      message: id ? 'Asset updated.' : 'Asset added to the media library.',
      summary: `${id ? 'Updated' : 'Added'} media asset “${record.name}”`,
    };
  });
}

export async function deleteMedia(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = idSchema.safeParse(toObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  return runMutation(
    { entity: 'Media', action: AuditAction.DELETE, tag: CACHE_TAGS.media },
    async () => {
      const record = await prisma.media.delete({ where: { id: parsed.data.id } });

      // Remove the remote asset too, but never fail the request because the
      // CDN call did not succeed — the DB record is the source of truth.
      if (record.publicId) {
        try {
          const { destroyAsset } = await import('@/lib/media/cloudinary');
          await destroyAsset(record.publicId);
        } catch (error) {
          console.error('[media] remote delete failed', error);
        }
      }

      revalidatePath('/admin/media');

      return {
        entityId: record.id,
        message: 'Asset removed.',
        summary: `Deleted media asset “${record.name}”`,
      };
    },
  );
}

// --- Settings & SEO ----------------------------------------------------------

export async function saveSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const allowedKeys = new Map(SETTING_DEFINITIONS.map((definition) => [definition.key, definition]));

  const settings = [...formData.entries()]
    .filter(([key]) => allowedKeys.has(key as never))
    .map(([key, value]) => ({ key, value: String(value) }));

  const parsed = settingsSchema.safeParse({ settings });
  if (!parsed.success) return fromZodError(parsed.error);
  if (parsed.data.settings.length === 0) return failure('No recognised settings were submitted.');

  return runMutation(
    { entity: 'SiteSetting', action: AuditAction.UPDATE, role: UserRole.ADMIN, tag: CACHE_TAGS.settings },
    async () => {
      await prisma.$transaction(
        parsed.data.settings.map((setting) => {
          const definition = allowedKeys.get(setting.key as never)!;
          return prisma.siteSetting.upsert({
            where: { key: setting.key },
            update: { value: setting.value, label: definition.label, group: definition.group },
            create: {
              key: setting.key,
              value: setting.value,
              label: definition.label,
              group: definition.group,
            },
          });
        }),
      );

      revalidateContent(CACHE_TAGS.settings);
      revalidatePath('/admin/settings');
      revalidatePath('/admin/seo');

      return {
        message: 'Settings saved.',
        summary: `Updated ${parsed.data.settings.length} site setting(s)`,
      };
    },
  );
}
