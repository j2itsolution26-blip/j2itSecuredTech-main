import type { NextAuthConfig } from 'next-auth';

/**
 * Edge-safe authentication configuration.
 *
 * Deliberately free of Prisma and bcrypt so it can be evaluated inside the
 * middleware runtime. Providers that need Node APIs are attached in
 * `src/lib/auth/index.ts`.
 */
export const authConfig = {
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 8, // 8 hour working session
    updateAge: 60 * 30,
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
