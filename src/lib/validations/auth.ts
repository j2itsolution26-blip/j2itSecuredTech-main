import { z } from 'zod';
import { UserRole } from '@prisma/client';

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;

const passwordPolicy = z
  .string()
  .min(10, 'Password must be at least 10 characters')
  .regex(/[A-Z]/, 'Include at least one uppercase letter')
  .regex(/[a-z]/, 'Include at least one lowercase letter')
  .regex(/[0-9]/, 'Include at least one number');

export const userCreateSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(120),
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  password: passwordPolicy,
  role: z.nativeEnum(UserRole).default(UserRole.EDITOR),
  isActive: z.boolean().default(true),
});

export const userUpdateSchema = userCreateSchema
  .extend({
    id: z.string().min(1),
    password: z.union([passwordPolicy, z.literal('')]).optional(),
  })
  .strict();

export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
