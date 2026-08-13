/**
 * Dependency-free error types.
 *
 * Kept in its own module because `action-result.ts` needs `instanceof` checks
 * against them, and that module is imported by Client Components. Declaring
 * them alongside the auth guards would drag Prisma and the pg driver into the
 * browser bundle.
 */
export class AuthorizationError extends Error {
  constructor(message = 'You do not have permission to perform this action.') {
    super(message);
    this.name = 'AuthorizationError';
  }
}
