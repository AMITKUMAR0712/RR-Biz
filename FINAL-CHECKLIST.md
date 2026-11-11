# RRBizTech delivery verification

## Expanded BRD — Foundation phase

- [x] Upgraded the locked Prisma CLI/client to patched Prisma 7.10.1 and added the MySQL/MariaDB driver adapter.
- [x] Added and validated the full schema for editable content, enquiries, authentication, audit events, client cases, private document metadata, appointments, and notifications.
- [x] Generated the Prisma client and initial MySQL migration SQL without requiring a live database connection.
- [x] Added an idempotent seed for the four service groups, all ten services as drafts, draft FAQs/legal pages, and blank contact settings. Existing edited seed rows are preserved on reruns.
- [x] Added DB/auth/private-storage environment placeholders and updated setup and deployment documentation.
- [x] Lead storage allows either email or phone, consistent with server-side enquiry validation.
- [x] ESLint, TypeScript checks, and an optimized production build passed.
- [x] `npm audit` reports zero dependency vulnerabilities using the updated lockfile.
- [ ] Apply the migration and run the seed against a client-provided MySQL instance.
- [ ] Reinstall dependencies from the updated lockfile in a clean environment; this workspace's current Prisma 6 CLI installation is held by Windows file locks, so Prisma 7 validation/generation used the matching CLI through `npm exec`.

## Verified in this workspace

- [x] All ten service detail URLs return HTTP 200 and are generated from `content/services.ts`.
- [x] Services overview includes group filters; homepage renders all ten service cards.
- [x] Shared enquiry form supports three steps, service preselection, searchable ISO nationality choices (249 unique country names), an international phone selector, consent, and sensitive-document guidance.
- [x] Invalid first-step submissions do not advance. A valid sample submission passed client/server validation and reached the email delivery step.
- [x] `robots.txt` and `sitemap.xml` return successfully; the sitemap includes 18 public/indexable routes (home, eight core pages, and ten service details).
- [x] Security headers are returned, including CSP, HSTS, X-Frame-Options, X-Content-Type-Options, and Referrer-Policy.
- [x] Responsive layout smoke-checked at 360, 768, 1024, and 1440 CSS pixels; no horizontal page overflow was detected. The mobile drawer opens, exposes service groups, and closes.
- [x] `npm run lint`, `npm run typecheck`, and `npm run build` passed.
- [x] `npm audit --omit=dev` reports zero production dependency vulnerabilities.

## Client configuration still required

- [ ] Configure working SMTP credentials and `LEAD_NOTIFY_EMAIL`. Live delivery and visitor acknowledgement cannot be verified without these. With this workspace’s unconfigured SMTP, the API correctly returns HTTP 503 and the form shows an error instead of false success.
- [ ] Supply a verified WhatsApp number and phone, company email, legal name, and production domain. Until configured, contact links use the contact page and display bracketed placeholders where appropriate.
- [ ] Complete jurisdiction-specific legal review of the Privacy Policy, Terms, and Disclaimer.
- [ ] Add only verified company address, trust metrics, approved testimonials, social URLs, and meeting URL.
- [ ] Test the configured domain, mail reputation (SPF/DKIM/DMARC), HTTPS deployment, and production Lighthouse scores after launch.
