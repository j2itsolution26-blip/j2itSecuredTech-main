# J2 SecureTech — Enterprise Website & Content Platform

Production website and administration console for **J2 SecureTech** — *Secure. Build. Connect.*

An enterprise IT solutions provider delivering custom software, websites and e-commerce, CCTV and
biometric security, structured cabling and networking, cloud services and managed support.

---

## Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19, Server Components, Server Actions) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 with design tokens, shadcn-style primitives on Radix UI |
| Animation | Framer Motion (entrance, layout) · GSAP (counters, parallax) |
| Database | PostgreSQL via Prisma ORM 7 with the `pg` driver adapter — provider-agnostic (Supabase, Neon, RDS, local) |
| Auth | Auth.js v5 (NextAuth) — credentials provider, JWT sessions, bcrypt hashing |
| Validation | Zod schemas shared by client and server · React Hook Form on public forms |
| Media | Cloudinary signed direct uploads (optional) |
| Charts | Recharts |
| Hosting | Vercel |

---

## Getting started

### 1. Prerequisites

- Node.js 20 or newer
- A PostgreSQL 14+ database ([Supabase](https://supabase.com), [Neon](https://neon.tech), RDS or local)

### 2. Install

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Then set at minimum:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string. See the endpoint table below — the pooled and direct endpoints are not interchangeable. |
| `NEXTAUTH_SECRET` | Session signing key — generate with `npx auth secret`. |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin used for metadata, sitemap and OpenGraph. |

Cloudinary variables are optional; without them the media library accepts asset URLs instead of
direct uploads.

### 4. Create the schema and seed

```bash
npm run db:push     # or: npm run db:migrate   (creates a versioned migration)
npm run db:seed
```

The seed creates the service catalogue, industry profiles, six case studies, six articles,
testimonials, FAQs, open roles and an administrator account.

### 5. Run

```bash
npm run dev
```

- Website — <http://localhost:3000>
- Admin console — <http://localhost:3000/admin/login>

Default credentials come from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`
(`admin@j2securetech.com` / `ChangeMe123!` if unset). **Change the password immediately.**

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Generate the Prisma client and build for production |
| `npm start` | Serve the production build |
| `npm run typecheck` | TypeScript, no emit |
| `npm run lint` | ESLint |
| `npm run db:push` | Sync the schema without a migration file |
| `npm run db:migrate` | Create and apply a development migration |
| `npm run db:deploy` | Apply pending migrations (CI/production) |
| `npm run db:seed` | Seed reference and demonstration content |
| `npm run db:studio` | Prisma Studio |

---

## Architecture

```
src/
├── app/
│   ├── (site)/                  Public website — shares the marketing layout
│   │   ├── page.tsx             Home
│   │   ├── about/ services/[slug]/ portfolio/[slug]/ industries/
│   │   ├── blog/[slug]/ careers/[slug]/ testimonials/ faqs/
│   │   ├── contact/ request-quote/ privacy-policy/ terms/
│   ├── admin/
│   │   ├── login/               Standalone sign-in (outside the console shell)
│   │   └── (dashboard)/         Guarded console: layout enforces the session
│   ├── api/auth/[...nextauth]/  Auth.js route handlers
│   ├── sitemap.ts robots.ts     SEO endpoints
│   ├── opengraph-image.tsx      Generated social card
│   ├── icon.tsx                 Generated favicon
│   └── error.tsx global-error.tsx not-found.tsx
│
├── components/
│   ├── ui/                      Primitives: button, card, input, table, dialog, accordion…
│   ├── layout/                  Navbar, Footer
│   ├── sections/                Composable page sections (hero, stats, FAQ, CTA…)
│   ├── cards/                   Service, project, post and testimonial cards
│   ├── forms/                   Public forms + the RHF ⇄ Server Action bridge
│   ├── shared/                  Reveal, Counter, PageHero, Pagination, JsonLd, icons
│   └── admin/                   Console shell, form kit, tables, charts, entity forms
│
├── lib/
│   ├── prisma.ts                Prisma client with the pg driver adapter
│   ├── env.ts                   Zod-validated server environment
│   ├── auth/                    Auth.js config (edge-safe) + role guards
│   ├── data/                    Read layer — cached public reads, fresh admin reads
│   ├── actions/                 Server Actions (public leads, content CRUD, admin)
│   ├── validations/             Zod schemas shared by client and server
│   ├── security/                Rate limiting and HTML sanitisation
│   ├── cache.ts                 Cache tags and invalidation
│   ├── seo.ts                   Metadata builders and schema.org generators
│   └── audit.ts                 Immutable audit trail writer
│
├── middleware.ts                Admin route protection (edge)
└── types/                       Auth.js module augmentation
```

### Design decisions

**Read/write separation.** `lib/data/*` owns reads; `lib/actions/*` owns writes. Public reads run
through `unstable_cache` with tags; every write invalidates the matching tag with `updateTag`, so an
editor sees their change immediately and visitors get it on the next request — no redeploy.

**One mutation pipeline.** Every admin write goes through `runMutation()`, which authorises by role,
rate limits, executes, records an audit entry and invalidates the cache. A new entity cannot ship
without those guarantees.

**Dynamic rendering, cached data.** Pages are `force-dynamic` while their queries are cached. This
keeps content instantly editable and lets the project build without a live database, at the cost of
a cache read per request rather than a full static hit.

**Editor routes use one path.** `/admin/<entity>/new` creates and `/admin/<entity>/<id>` edits —
the same page component handles both, halving the surface area.

---

## Security

| Control | Implementation |
| --- | --- |
| Authentication | Auth.js credentials provider, bcrypt (12 rounds), 8-hour JWT sessions |
| Authorisation | Three roles (`VIEWER`/`EDITOR`/`ADMIN`) enforced in middleware, layouts *and* every action |
| CSRF | Server Actions carry framework-issued action IDs; Auth.js protects its own endpoints |
| XSS | Allow-list HTML sanitiser applied on write and again on render; strict CSP |
| Rate limiting | Per-IP on public forms and sign-in, per-user on admin writes |
| Validation | Zod on the client for feedback and again on the server as the authority |
| Spam | Honeypot field plus per-IP submission windows |
| Headers | CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options`, Referrer-Policy, Permissions-Policy |
| Audit | Immutable log of every create, update, delete, sign-in and failed sign-in with IP and user agent |
| Timing | Sign-in compares against a decoy hash when no account exists, so response time reveals nothing |

Login redirects only accept same-origin relative paths, closing the open-redirect vector.

---

## SEO

- Per-page metadata through a single `buildMetadata()` builder — canonical, OpenGraph, Twitter cards
- schema.org: `Organization`, `WebSite`, `ProfessionalService`, `BreadcrumbList`, `Service`,
  `BlogPosting`, `FAQPage`, `JobPosting`
- `sitemap.xml` covering static routes plus every service, project, article and open role
- `robots.txt` honouring the admin indexing switch
- Generated OpenGraph card and favicon — no stale binary assets
- Editable defaults (title, description, keywords, verification token, index switch) under
  **Admin → SEO**

---

## Accessibility (WCAG 2.2 AA)

Semantic landmarks and one `h1` per page · skip-to-content link · visible focus rings on every
interactive element · `aria-current` on active navigation · labelled form controls with
`aria-invalid` and errors announced via `role="alert"` · dialogs and accordions built on Radix
primitives · decorative marquee mirrored by a screen-reader list · `prefers-reduced-motion`
respected globally and inside every animation component.

---

## Deployment (Vercel)

1. Push the repository to GitHub and import it into Vercel.
2. Add the environment variables from `.env.example` (Production and Preview).
   Set `NEXT_PUBLIC_SITE_URL` to the live domain.
3. The build command runs `prisma generate && next build` — already configured in `vercel.json`.
4. Apply the schema to the production database once:

   ```bash
   DATABASE_URL="<production-url>" npm run db:deploy
   DATABASE_URL="<production-url>" npm run db:seed
   ```

5. Point the domain at the deployment and confirm `/sitemap.xml` and `/robots.txt` resolve.

### Connection endpoints

Managed PostgreSQL providers expose several endpoints for the same database. Using the wrong one
is the most common deployment failure — migrations hang, or the deployed app exhausts connections.

**Supabase** (Dashboard → **Connect** → Connection string):

| Endpoint | Port | Use for |
| --- | --- | --- |
| Session pooler `aws-0-<region>.pooler.supabase.com` | 5432 | Migrations, seeding, local development |
| Transaction pooler `aws-0-<region>.pooler.supabase.com` | 6543 | The deployed app — append `?pgbouncer=true&connection_limit=1` |
| Direct `db.<ref>.supabase.co` | 5432 | Avoid — IPv6-only on the free plan |

The transaction pooler runs PgBouncer in transaction mode, which rejects prepared statements;
`?pgbouncer=true` is required, and migrations cannot run through port 6543.

**Neon:** pooled host (`…-pooler…`) for the app, direct host for `migrate deploy`.

Run `npm run doctor` to have the endpoint identified and validated for you.

**Region:** `vercel.json` pins functions to `iad1` (Washington DC), which pairs with a database in
`us-east-1`. Keep compute and database co-located — every page issues several queries, so a
cross-region round trip costs far more than the single hop saved by placing compute near visitors.
Static assets serve from the global edge network regardless. Match this value to your database
region: `iad1` us-east-1, `cle1` us-east-2, `sfo1` us-west-1, `sin1` Singapore, `syd1` Sydney,
`fra1` Frankfurt.

### Rate limiting at scale

The limiter is in-process, which covers a single region correctly. For a multi-region deployment,
replace the store in `lib/security/rate-limit.ts` with Redis (`INCR` + `EXPIRE`) — the function
signature is storage-agnostic, so no caller changes.

---

## Admin console

| Section | Capability |
| --- | --- |
| Dashboard | Lead metrics, 12-month trend, recent submissions and audit activity |
| Analytics | Conversion, service demand and pipeline breakdown |
| Quote Requests | Filter, search, pipeline status, internal notes, email reply |
| Contact Messages | Filter, search, read/archive status, internal notes |
| Services · Portfolio · Blog · Industries · Testimonials · FAQs · Careers | Full CRUD |
| Media Library | Cloudinary direct upload or URL registration |
| Users | Accounts and roles (admin only; last administrator is protected) |
| Settings · SEO | Site-wide configuration (admin only) |
| Audit Logs | Immutable activity trail, filterable by entity (admin only) |

---

## Licence

Proprietary — © J2 SecureTech IT Solutions Inc. All rights reserved.
