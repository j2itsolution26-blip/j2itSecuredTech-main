import 'dotenv/config';
import path from 'node:path';
import { defineConfig } from 'prisma/config';

/**
 * Prisma 7 moves the datasource connection string out of `schema.prisma`.
 * The CLI (migrate / db push / studio / seed) reads it from here, while the
 * application runtime supplies it through the pg driver adapter in
 * `src/lib/prisma.ts`.
 */
export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    path: path.join('prisma', 'migrations'),
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
});
