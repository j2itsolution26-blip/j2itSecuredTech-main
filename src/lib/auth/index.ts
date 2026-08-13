import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { authConfig } from '@/lib/auth/auth.config';
import { getServerEnv } from '@/lib/env';
import { loginSchema } from '@/lib/validations/auth';

/**
 * Validated at module load so a missing or weak NEXTAUTH_SECRET fails the
 * build or the first request with a message naming the variable — rather than
 * as an opaque Auth.js error the first time an administrator tries to sign in.
 */
const env = getServerEnv();

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        // Compare against a decoy hash when no user exists so the response
        // time does not reveal whether an account is registered.
        const hash = user?.password ?? '$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinv';
        const passwordMatches = await bcrypt.compare(password, hash);

        if (!user || !user.isActive || !passwordMatches) return null;

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
});
