# 86 CASINO

Land-based casino website and content management system for 86 CASINO in Accra, Ghana. The app intentionally contains no online wagering, deposits, withdrawals or gambling functionality.

## Stack

- Next.js App Router and TypeScript
- PostgreSQL with Prisma ORM
- Railway-compatible single web service
- Railway Volume media at `/app/uploads`, served through `/media/*`
- Signed, secure HttpOnly admin session with bcrypt hash support

## Local development

1. Copy `.env.example` to `.env` and provide a PostgreSQL `DATABASE_URL`.
2. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD` for local development, or provide `ADMIN_PASSWORD_HASH` for production.
3. Set a long random `SESSION_SECRET`.
4. Run `npm ci`, `npx prisma generate`, `npx prisma migrate deploy`, `npm run db:seed`, then `npm run dev`. On Windows, set `UPLOAD_DIR` to a writable local folder; `/app/uploads` is the Railway mount.

The public site is available at `http://localhost:3000`. The CMS login is at `/admin`.

## Railway deployment

1. Create a Railway PostgreSQL service and attach its `DATABASE_URL` to this service.
2. Add the variables in `.env.example` in Railway. Use `ADMIN_PASSWORD_HASH` in production; generate it with `node -e "console.log(require('bcryptjs').hashSync('replace-me', 12))"` locally and do not commit it.
3. Add a Railway Volume mounted at `/app/uploads` and set `UPLOAD_DIR=/app/uploads`.
4. Deploy from the repository. `npm start` runs `prisma migrate deploy`, safely runs the idempotent seed, and starts Next.js on Railway's `PORT`.
5. Configure `NEXT_PUBLIC_SITE_URL` to the public Railway/custom domain so sitemap and Open Graph URLs are correct.

The `/api/health` endpoint is configured as the Railway health check. Uploaded files receive generated UUID names; original filenames are never trusted and files are limited to 8MB and common image MIME types.

## Content

Starter content is seeded for games, promotions, events, gallery items and editable legal/information pages. Public content reads from PostgreSQL with graceful starter fallbacks when a local database is unavailable. The admin dashboard provides settings, contact-message management and collection editors at `/admin/content`. Editors support creating and updating games, promotions, events, gallery items and pages, uploading photographs, ordering content and hiding records without deletion. Empty collections and unpublished pages stay hidden. Events use Accra time; expired events and out-of-window promotions are excluded from public listings. New sample promotions/events are seeded inactive. Existing records are never overwritten by the seed.

## Verification

```bash
npm run typecheck
npm run build
```

Database-backed regression checks: `npm run test:integration` with a running local server and disposable PostgreSQL on `127.0.0.1:55486`. The test suite refuses other database addresses. It temporarily edits fixtures and restores them; never point it at a shared database. Node 22+ is recommended.

The production startup command works on both Windows and Railway and honors `PORT`. Build before running `npm start`. See [redesign handover](docs/REDESIGN.md) for the review, preview instructions, screenshots and limitations.
