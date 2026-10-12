# 86 Casino redesign handover

Branch: `feature/86-casino-redesign`, based on the verified remote default-branch HEAD `3eff645df4b3c7189338cfc930574ee1ee47c30c` (main). No push, merge or deployment was performed. No production database or Railway volume was accessed.

## Design and architecture

Retained Next.js App Router, Prisma/PostgreSQL, the existing authentication flow, database schema, server actions and resource APIs. A full application rebuild was not warranted. Replaced the public visual system and homepage composition; applied consistent typography, spacing and responsive layouts across all 13 public routes.

The hero separates readable white text from the original casino photograph. Red is reserved for actions and small accents. Original logo and casino imagery are preserved. The mobile layout stacks the hero image below the introduction, and the navigation has active-page indication, keyboard focus, an Escape close action and a skip link. Motion respects reduced-motion preferences.

## Review findings and repairs

- Existing CMS settings, messages, authentication, collection APIs and uploads were present. The content screen had no collection editing forms; it now has create/edit/upload/publish controls for all five collections. Existing DELETE APIs remain intact; the editor emphasizes hiding records instead of deletion.
- Empty collections previously returned sample content, and unpublished known pages could fall back to published starter copy. Both now honor CMS publication state.
- Expired events and out-of-window promotions no longer appear as current listings. Dates display in Accra time. The CMS date inputs explicitly use UTC/Accra time.
- Startup seeding overwrote edited images and contact settings. Upserts now preserve existing records; new sample offers/events start inactive. No migrations or production-record updates were added.
- Contact form labels, pending state, network failure recovery and validation were improved. Messages continue to persist to the database; email delivery was not an existing feature and was not added.
- Authenticated sessions now enforce the existing 12-hour lifetime server-side and reject malformed signatures. Production requires SESSION_SECRET rather than silently using the development fallback.
- Uploads retain UUID filenames, the 8 MB limit and UPLOAD_DIR persistence. Basic file-signature validation and media-path restrictions were added. Uploaded files remain on the Railway Volume; no external image storage was introduced.
- Placeholder social links are omitted. CMS site title/description now feed page metadata. Visit and contact pages expose callable/email contact links.
- Build explicitly generates Prisma Client. Lint now runs non-interactively. The startup wrapper preserves migrate → seed → Next startup and PORT while also working on Windows.

## Preview and startup

Preview: http://localhost:3000 . Admin: http://localhost:3000/admin .

This machine has an ignored `.env` configured solely for the disposable local database on `127.0.0.1:55486`. Local uploads are in `%TEMP%/86-redesign-uploads`. The PostgreSQL cluster is in `%TEMP%/86-redesign-pg`. Existing PostgreSQL services were not changed. Local-only login credentials are in the ignored `.env`; do not use them in production.

If the preview is stopped, from the repository run:

```powershell
# Only if the isolated preview database has stopped:
& 'C:/Program Files/PostgreSQL/18/bin/pg_ctl.exe' -D "$env:TEMP/86-redesign-pg" -l "$env:TEMP/86-redesign-pg.log" -o '-p 55486 -h 127.0.0.1' start
npm run dev
```

For a clean checkout, configure `.env` from `.env.example` with a local PostgreSQL URL, local UPLOAD_DIR, admin credentials and SESSION_SECRET, then:

```powershell
npm ci
npx prisma generate
npx prisma migrate deploy
npm run db:seed
npm run dev
```

For the production-mode local preview: stop the dev server, run `npm run build`, then `npm start`. Do not run dev and build against the same `.next` directory concurrently. Railway configuration, schema and required variable names are unchanged. Railway continues to use `/app/uploads`, `/media/*`, and `/api/health`.

## Validation

- TypeScript: passes.
- ESLint (TypeScript and React Hooks): passes.
- Production build: passes.
- Nine database-backed integration tests: passes. Covers public pages, health, sitemap, robots, unknown pages, authentication protection/expiry, contact validation and persistence, CRUD for all collections, upload bytes and file rejection, unpublished pages, empty-game state, CMS-to-public rendering, expiry filtering, and seed preservation.
- Browser: CMS login, record edit/save, image upload/save/public rendering, settings save, contact submission, inbox display and read-state update verified against the disposable database.
- All 13 public pages checked at 390, 768 and 1440 px: no horizontal page overflow. Mobile menu opens, closes with Escape and closes after navigation.
- Screenshots in `docs/screenshots/` show homepage desktop/mobile and representative inner pages.

## Remaining limitations

- Source photos are mostly 680 × 453 px; two are 382 × 510. The 1920 × 1279 `hero-optimized.webp` is visibly soft and does not supply convincing additional detail. The redesign uses the original 001 photo in a contained layout, responsive Next image sizing and compression without artificial sharpening. Please supply the original full-resolution gaming-floor photograph (ideally 2400+ pixels wide) for a crisp high-density hero.
- The existing seed includes sample promotions/events and placeholder legal text. No new offers, schedules, testimonials, facilities or awards were invented. New sample listings start hidden. The local preview also hides its seed offers/events. Existing production records retain their own active state and content; operators should review their accuracy in the CMS before release.
- Existing hours and the broad Accra map destination are retained when stored in the CMS. An exact street address/map destination and confirmation of hours are still needed for more useful visitor directions.
- Public fallback information is available if the database is unavailable; saving forms and CMS operations require PostgreSQL. Database outages therefore cannot be assessed solely from the liveness health endpoint.
- The existing dependency lock produced 7 npm audit advisories (1 moderate, 6 high, including transitive build/image tooling). No forced framework/Prisma upgrades were bundled into this redesign. Dependency remediation remains a separate release task.
- Build reports the existing Prisma seed-config deprecation and notes that the standalone lint config does not include the Next ESLint plugin. These do not prevent successful build/type checking.
- Browser verification used the Codex Chromium browser at responsive viewports, not physical iOS/Android devices. Production Railway behavior was inspected/configuration preserved, but no live deployment was performed.

## Changed files

Public pages: `app/page.tsx`, `app/globals.css`, `app/layout.tsx`, `app/[slug]/page.tsx`, `app/casino/page.tsx`, `app/promotions/page.tsx`, `app/events/page.tsx`, `app/gallery/page.tsx`, `app/contact/page.tsx`, `app/contact/contact-form.tsx`.

Shared layout: `components/site-header.tsx`, `components/site-footer.tsx`.

CMS and operational repairs: `app/admin/page.tsx`, `app/admin/content/page.tsx`, `app/admin/content/content-editor.tsx`, `app/api/admin/upload/route.ts`, `app/api/contact/route.ts`, `app/media/[...path]/route.ts`, `lib/auth.ts`, `lib/content.ts`, `prisma/seed.ts`.

Build/testing/documentation: `next.config.ts`, `package.json`, `package-lock.json`, `eslint.config.mjs`, `scripts/start.mjs`, `scripts/integration.test.mjs`, `README.md`, this handover and screenshots.
