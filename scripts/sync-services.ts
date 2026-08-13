/**
 * Service catalogue sync.
 *
 * Upserts the service catalogue and nothing else. Use this instead of the full
 * seed when updating a live database: `db:seed` replaces testimonials and FAQs
 * wholesale, which would discard anything edited through the admin console.
 *
 *   DATABASE_URL="<url>" npx tsx scripts/sync-services.ts
 *
 * Requires the ServiceCategory enum migration to be applied first (npm run
 * db:deploy), otherwise the new categories are rejected by the database.
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { SERVICES } from '../prisma/seed-data';

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('\nDATABASE_URL is not set.\n');
    process.exitCode = 1;
    return;
  }

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

  try {
    const before = await prisma.service.count();

    for (const service of SERVICES) {
      await prisma.service.upsert({
        where: { slug: service.slug },
        update: service,
        create: { ...service, isActive: true },
      });
      console.log(`  ✓ ${service.slug}`);
    }

    const after = await prisma.service.count();
    console.log(`\n${SERVICES.length} services synced. Catalogue went from ${before} to ${after} rows.\n`);
  } catch (error) {
    console.error('\nSync failed:');
    console.error(error instanceof Error ? error.message : error, '\n');
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
