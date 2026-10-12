# Approved release — 12 October 2026

## Git verification

The approved redesign was clean on `feature/86-casino-redesign` at `56ba9b8`. The final hero-animation adjustment and CMS upload-field correction were already in that commit. No uncommitted user edits were present. Remote `main` remained at `3eff645df4b3c7189338cfc930574ee1ee47c30c` when release work began.

## Dependency review

The original seven npm audit entries represented five underlying dependency groups (Prisma and @prisma/config inherited the deepmerge-ts finding). All are patched; a fresh full `npm audit` reports zero vulnerabilities.

| Package/group                          | Finding and exposure                                                                                                      | Release change                                                                                            |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Next.js                                | Response-cache poisoning; production framework, treated as release-blocking even though public content routes are dynamic | 15.5.26 → 15.5.27, pinned                                                                                 |
| sharp                                  | Vulnerable bundled librsvg; image-processing dependency available in production                                           | 0.35.4 → 0.35.5, explicit pinned dependency                                                               |
| PostCSS                                | Source-map file disclosure/path traversal and CSS output issues; trusted build input here, still patched                  | Override 8.5.29 within major 8 because Next pins an older version                                         |
| source-map-js                          | Event-loop denial of service from crafted indexed source maps; build tooling, no public source-map parsing endpoint       | Override 1.2.2                                                                                            |
| deepmerge-ts → @prisma/config → prisma | Recursive-object stack exhaustion; Prisma CLI configuration, no untrusted recursive JS objects enter from this website    | Override 8.0.2; retained Prisma 6.19.3 and validated CLI generation, migration and explicit local seeding |

The deepmerge override crosses a major version, so the Prisma CLI paths were specifically included in validation rather than relying on the audit count alone. The website does not pass attacker-controlled JavaScript object graphs to this package. No forced Prisma major upgrade, downgrade or database-schema change was made.

Primary advisory references:

- [Next.js cache poisoning](https://github.com/advisories/GHSA-mcj8-r9mp-w47p)
- [sharp/librsvg](https://github.com/advisories/GHSA-wq5f-xc86-pv6w)
- [PostCSS source-map disclosure](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp)
- [source-map-js denial of service](https://github.com/advisories/GHSA-68fv-2mgg-jv7q)
- [deepmerge-ts recursive objects](https://github.com/advisories/GHSA-ggr8-5vv4-36mx)

## Production data protection

Automatic seeding has been removed from `scripts/start.mjs`. Production startup applies existing pending migrations with `prisma migrate deploy`, then starts Next.js with the existing PORT. No new migrations are included in this release. Production data, environment variables, domains, service definitions and upload storage are not altered by this change. Seed remains an explicit local/new-install setup command and preserves existing records.

The existing `railway.toml`, Prisma schema, migrations and environment-variable names remain unchanged. The Railway Volume path continues to come from UPLOAD_DIR, and existing UUID media URLs continue to be served from it.

## Existing deployment identity

GitHub's latest Railway success status before publishing identified:

- Project: `thorough-rejoicing` (`26fb5102-bc39-4406-9bc5-1ecc0ef7bd17`)
- Service: `86-casino-website` (`84daf76d-ded3-439f-82ea-a9a205e84eff`)
- Production environment: `19c54840-9d48-4d66-9f2e-cc03002692ab`
- Previous successful deployment: `e3221581-7a0b-43ce-b6e8-0708a544d34c`
- Previous deployed commit: `3eff645df4b3c7189338cfc930574ee1ee47c30c`, matching remote `main`, the repository's sole pre-release remote branch.
- Live domain: https://www.86-casino.com (https://86-casino.com redirects here).

At release preparation time the CLI account could not access this project; direct Railway API returned Not Authorized. GitHub deployment statuses and the live site can still verify whether its existing GitHub integration deploys the merged commit. A successful Git push alone is not deployment confirmation. No replacement Railway service should be created.

## Release validation before push

- `npm run lint`, `npm run typecheck`, `npm run build`: passed on Next 15.5.27.
- Full `npm audit` and production-only `npm audit --omit=dev`: zero advisories.
- All 9 integration tests passed against the production-mode local server and isolated PostgreSQL instance.
- The test session fixture is now issued one second in the past to avoid a Windows cross-process clock race. Expired and future-dated session rejection tests remain unchanged; production authentication was not relaxed.
- Patched sharp 0.35.5 successfully decoded/resized/encoded an original photograph, and the Next image-optimization endpoint returned HTTP 200.
- Startup logs confirm migrations reported no pending work and no seed command ran.
- Predeployment public pages returned HTTP 200. Public HTML contained no `/media/` or `/uploads/` references, so a volume inventory or authenticated CMS access is required to verify unreferenced uploaded files; public photography alone cannot prove that inventory is intact.
