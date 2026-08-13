/**
 * Administrator password reset.
 *
 * The seed intentionally never overwrites an existing password, so re-running
 * it cannot restore access to a locked-out account. This is the supported
 * recovery path.
 *
 *   npm run admin:password                        # uses SEED_ADMIN_* from .env
 *   npm run admin:password -- user@example.com 'NewPassw0rd'
 *
 * Enforces the same policy as the admin console, so a password set here can
 * also be set through the UI later.
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';

const BCRYPT_ROUNDS = 12;

/** Mirrors passwordPolicy in src/lib/validations/auth.ts. */
function validate(password: string): string[] {
  const problems: string[] = [];
  if (password.length < 10) problems.push('at least 10 characters');
  if (!/[A-Z]/.test(password)) problems.push('one uppercase letter');
  if (!/[a-z]/.test(password)) problems.push('one lowercase letter');
  if (!/[0-9]/.test(password)) problems.push('one number');
  return problems;
}

async function main() {
  const [emailArg, passwordArg] = process.argv.slice(2);

  const email = (emailArg ?? process.env.SEED_ADMIN_EMAIL ?? '').toLowerCase().trim();
  const password = passwordArg ?? process.env.SEED_ADMIN_PASSWORD ?? '';

  if (!email || !password) {
    console.error('\nUsage: npm run admin:password -- <email> <password>');
    console.error('Or set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env\n');
    process.exitCode = 1;
    return;
  }

  const problems = validate(password);
  if (problems.length > 0) {
    console.error(`\nPassword rejected. The admin console requires ${problems.join(', ')}.`);
    console.error('Choose a password that satisfies the policy, otherwise it cannot');
    console.error('be re-entered through the UI later.\n');
    process.exitCode = 1;
    return;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('\nDATABASE_URL is not set.\n');
    process.exitCode = 1;
    return;
  }

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

  try {
    const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Upsert so this doubles as account recovery if the row was deleted.
    const user = await prisma.user.upsert({
      where: { email },
      update: { password: hashed, isActive: true },
      create: {
        email,
        password: hashed,
        name: process.env.SEED_ADMIN_NAME ?? 'System Administrator',
        role: UserRole.ADMIN,
        isActive: true,
      },
      select: { email: true, role: true, isActive: true },
    });

    console.log(`\nPassword updated for ${user.email} (${user.role}).`);
    console.log('Sign in at /admin/login\n');
  } catch (error) {
    console.error('\nFailed to update the password:');
    console.error(error instanceof Error ? error.message : error, '\n');
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
