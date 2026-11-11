# RRBizTech: Business & Digital Solutions

Production-oriented English-language website for RRBizTech's UAE business and digital support services. Built with Next.js App Router, React, TypeScript, Tailwind CSS v4, Zod, SMTP email delivery, MySQL, and Prisma ORM 7.

The database-backed site includes content management, persisted enquiries, customer-feedback moderation, manager workspaces, and audit history. The client portal and private document-upload flow remain out of scope.

## Local development

1. Install Node.js 20.19 or newer (or Node.js 22.12 or newer).
2. Install packages with `npm install`.
3. Copy `.env.example` to `.env.local` and fill in the SMTP, inbox, domain, and WhatsApp settings.
4. Start the site with `npm run dev`.
5. Verify with `npm run lint`, `npm run typecheck`, and `npm run build`.

## Database foundation

- MySQL/MariaDB schema: `prisma/schema.prisma`.
- Prisma 7 configuration and migration/seed commands: `prisma.config.ts`.
- The schema covers editable site content, blog posts, service groups and services, FAQs, trust content, Google-sourced testimonials, leads, hashed rate-limit keys, users and sessions, client cases, private document metadata, appointments, notifications, and audit events.
- `npm run postinstall` generates the Prisma client into the ignored `generated/prisma` directory.
- Set `DATABASE_URL` to a MySQL connection string before applying migrations or seeding. Generate and apply the initial migration with `npm run prisma:migrate:dev -- --name foundation`, then seed using `npm run prisma:seed`.
- The seed is repeatable: it creates four service groups, ten published initial services, starter guides, draft FAQs and legal pages, and an empty contact-settings record. It creates the first admin user only when `ADMIN_EMAIL` and `ADMIN_PASSWORD` are supplied.
- `npm run prisma:migrate:deploy` applies committed migrations in deployment. Do not run development migrations against production.
- No database credentials are included. A working MySQL instance is needed before migrations and seed data can be applied.

The home page, blog page, service listings and detail pages, navigation/footer, and contact details use published database content when `DATABASE_URL` is configured. They use typed starter content when it is not configured. Feedback submissions and enquiries require the database so submissions can be moderated and managed.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `SMTP_HOST` | Yes, for enquiries | SMTP server hostname |
| `SMTP_PORT` | Yes, for enquiries | SMTP port; port 465 uses TLS |
| `SMTP_USER` | Yes, for enquiries | Sender SMTP account |
| `SMTP_PASS` | Yes, for enquiries | Sender SMTP password |
| `LEAD_NOTIFY_EMAIL` | Yes, for enquiries | Inbox receiving new enquiries |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Yes for WhatsApp links | WhatsApp number in international format, digits only (no plus sign) |
| `NEXT_PUBLIC_SITE_URL` | Yes for deployment | Canonical production origin, e.g. `https://example.com` |
| `NEXT_PUBLIC_GA4_ID` | Optional | GA4 measurement ID; analytics loads only after consent |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Optional | Google Search Console HTML meta verification value |
| `DATABASE_URL` | Yes, for database operations | MySQL/MariaDB connection URL; never expose as a public variable |
| `AUTH_SECRET` | Required for the later auth phase | Generate a random secret of at least 32 characters |
| `ADMIN_EMAIL` | Required to provision the first administrator | Email used by the initial admin sign-in |
| `ADMIN_PASSWORD` | Required to provision the first administrator | Unique initial password; at least 14 characters, stored as a scrypt hash |
| `PORTAL_STORAGE_ROOT` | Required for the later portal phase | Private persistent storage directory outside the public web root |
| `PORTAL_ENCRYPTION_KEY` | Required for the later portal phase | Client-managed secret for encrypted document storage |

Do not commit `.env.local` or place SMTP, database, authentication, or storage secrets in `NEXT_PUBLIC_*` variables. The existing enquiry route validates submissions server-side, uses a honeypot and submission time check, and currently uses per-process IP rate limiting. Database-backed enquiry persistence and hashed shared rate limiting will be wired in the relevant implementation phase. Configure provider-side email retention and access controls.

## Admin content management

1. Configure `DATABASE_URL`, `ADMIN_EMAIL`, and a unique `ADMIN_PASSWORD` of at least 14 characters in the deployment environment.
2. Apply schema updates with `npm run prisma:migrate:deploy`.
3. Run `npm run prisma:seed` once to initialize services, starter blogs, and the initial administrator.
4. Open `/admin/login`. Admin and manager sessions use an HTTP-only, SameSite=Strict cookie and expire after eight hours; login attempts are rate-limited.
5. Administrators can update contact details, create/edit/archive blogs, manage verified Google reviews and services, review enquiries, approve customer feedback, inspect audit logs, and create or disable managers.
6. Managers sign in at `/admin/login` and are sent to `/manager`. Their workspace allows them to review and update enquiries, approve or reject customer feedback, and inspect audit logs. They cannot change public content or manage accounts.

Never publish a review unless the original Google source has been checked and permission to display the excerpt is confirmed. Ratings support half-star increments and must match the source. No review examples are seeded. Review cards remain hidden unless the review has a Google source URL, is explicitly published, and has an approval timestamp.

## Editing business content

- Starter content and fallback content remain in `content/services.ts`, `content/blogs.ts`, `content/faqs.ts`, and `content/site.ts`. Once the database is configured, published services/blog posts and contact settings are read from MySQL and edited through `/admin`.
- Replace bracketed contact placeholders only with client-approved information. Trust figures and testimonials are hidden unless supplied; testimonials must be approved before publication.
- Original image files are organized under `assets/source/brand`, `assets/source/hero`, `assets/source/process`, and `assets/source/services`. Optimized, app-served copies remain under their existing `public/` paths so current page references do not change.
- `public/brand/rrbiztech-logo.webp`: optimized supplied logo used in the header, footer, and favicon. It is shown as supplied. If a transparent PNG/SVG is supplied later, it can be used against the dark footer instead.

## Enquiry flow and email

The shared three-step form is on the home page, contact page, and every service page. It asks for contact details, service interest, nationality (optional), a short requirement, preferred contact method/time, and consent. Valid enquiries are saved as `Lead` records before notification email is attempted and are available in the admin/manager enquiry panel. If email delivery fails, the saved enquiry is retained and a failed notification is recorded. Do not ask visitors to upload or send identity documents.

Public customer feedback is stored as a draft. Managers or administrators must approve it before it appears in the testimonials and home-page feedback sections. Rejected feedback stays unpublished. Existing feedback present before this moderation release is grandfathered as approved by the migration.

## SEO, analytics, and deployment

- Metadata, canonical URLs, Open Graph/Twitter cards, JSON-LD, `robots.txt`, and a generated `sitemap.xml` are included.
- Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS domain before deployment. HTTPS termination is provided by Vercel or the VPS reverse proxy; security headers include HSTS, CSP, clickjacking protection, and content-type/referrer policies.
- Set the SMTP sender/domain up with SPF, DKIM, and DMARC with the chosen mail provider.
- `NEXT_PUBLIC_GA4_ID` is optional; the site does not load or configure GA4 until the visitor accepts analytics consent. Search Console verification is intentionally left to the domain owner through the Search Console deployment settings.
- Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to add the Search Console verification metadata when domain ownership is confirmed.
- For Vercel, import the repository, set environment variables in project settings, and deploy. For a VPS, install Node.js 20+, run `npm ci && npm run build`, run `npm start` behind an HTTPS reverse proxy, and configure process supervision and backups for mail configuration.

## Launch checklist

- [ ] Supply verified company legal name, phone, WhatsApp number, email, domain, and (only if verified) address.
- [ ] Configure and test SMTP delivery to both the company inbox and an enquiry visitor.
- [ ] Apply both Prisma migrations, seed the database, and sign in to `/admin/login` with the provisioned administrator.
- [ ] Add only verified Google reviews and confirm each source link before publishing.
- [ ] Replace all bracketed placeholders; add only approved statistics, testimonials, and social profiles.
- [ ] Obtain legal review and complete the Privacy Policy, Terms, and Disclaimer for the operating jurisdiction.
- [ ] Confirm selected destination-country support coverage and all service checklist details.
- [ ] Verify WhatsApp link number and contextual prefilled messages.
- [ ] Review the responsive layout at 360, 768, 1024, and 1440 px; run accessibility and Lighthouse checks on the deployed site.
- [ ] Configure DNS/TLS, mail SPF/DKIM/DMARC, Search Console, GA4 (if used), and production error monitoring.

## Delivered route checklist

- [x] Home, Services overview, 10 data-driven service pages, About, Contact, FAQ, Privacy Policy, Terms, Disclaimer, and Thank You.
- [x] Zod server-side validation, guided enquiry form, honeypot, time trap, rate limiter, consent, SMTP notification and acknowledgement.
- [x] Contextual WhatsApp links, call links, SEO metadata, sitemap, robots, JSON-LD, security headers, reduced-motion styles, loading state, error boundary, and custom 404.
- [ ] Live form email delivery and WhatsApp destination cannot be verified until the client supplies working SMTP credentials and a verified WhatsApp number.
