import type { UserRole } from '@prisma/client';
import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession['user'];
  }

  interface User {
    role: UserRole;
  }
}

/**
 * NextAuth v5 re-exports the JWT interface from `@auth/core`, so the
 * augmentation has to target the original module for declaration merging
 * to take effect inside callbacks.
 */
declare module '@auth/core/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
  }
}

export {};
