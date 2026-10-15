# Orochia Admin — Repository Contract (agent-neutral)

> Scope of [`krizaka/orochia-admin`](https://github.com/krizaka/orochia-admin), the operator console of Orochia.
> The platform-wide rules — invariants, API conventions, definition of done — live in the
> [Orochia contract](https://github.com/krizaka/orochia/blob/main/AGENTS.md) and apply here unchanged.
> `CLAUDE.md` only imports this file.

## 1. What this repository is

- A Next.js 16 **server-side BFF** with **its own small database** (`DATABASE_URL`, `lib/db.ts`): the single operator
  account, its sessions and the **operator log** of every decision and sign-in. Orochia's data is never read from
  Orochia's database: every figure and every action goes through Orochia's `/api/admin/*` endpoints.
- **One account, the default operator**, defined by environment (`AUTH_OPERATOR_EMAIL`, `AUTH_OPERATOR_NAME`, `AUTH_OPERATOR_PASSWORD`,
  `lib/account.ts`): written to the console's database, refreshed when the environment changes (a new password closes
  every session). No sign-up, no second user. Sessions: random tokens stored hashed, httpOnly cookie, 8 hours.
- The console calls Orochia as a **service**: `Authorization: Bearer OPERATOR_API_TOKEN` (same value on both
  deployments). Orochia accepts it on ADMIN routes only and acts as its owner account. The token never reaches the browser.
- **Network gate** (`proxy.ts`): only the addresses in `AUTH_ALLOWED_IPS` reach the console, sign-in page included
  (client address from App Platform's `do-connecting-ip`). In production an empty list lets nobody in.
- Screens: overview · 2257 creator verification · content reports · catalogue (takedown / restore) · auctions
  (status, money held, cancel with a reason) · treasury & payouts · creator registry · accounts (suspend / reinstate /
  role) · storage & abuse (platform usage against its cap, largest accounts and their storage plans, reconciliation with
  Bunny, rate-limit store and bot challenge) · Explorer on Orazaka (the proof of use: engine host, public videos with a vector,
  each call to Orazaka with the run id it answered — counts and ids only) · platform & database (environment, migration history, rows per table,
  backups, factory reset).
- Desktop is the target: tables and dialogs are laid out for a wide screen.

## 2. Rules

- **A capability is an Orochia admin endpoint first.** This console never computes money, access or compliance
  state itself; it renders what the API returns and posts what the operator decides.
- Mutations are **server actions** (`app/actions.ts`) that call the API, then `revalidatePath` the screens they change.
- Every operator decision that removes something records its **reason** (takedown, suspension, failed payout,
  cancelled auction).
- **Every decision is confirmed in a dialog** (`components/ConfirmDialog.tsx`, the platform's `AlertDialog` and `Field`): it says what will
  happen, collects the reason or reference, shows the API's refusal in place. What cannot be undone asks the operator to
  type a phrase (the factory reset: `reset <database>`), and offers a backup first. Only benign, reversible steps
  (start review, reopen) run in one click (`direct`).
- **Factory reset** is an Orochia endpoint (`/api/admin/platform/reset`), refused unless the deployment sets
  `DATABASE_ALLOW_RESET=true` and is not the indexed production. Backups are gzipped JSON in Orochia's private
  storage, downloaded through this console's `/api/backups/[name]` (the session never reaches the browser).
- **Environment variables are named by bounded context** (krizaka/.github#46): `<CONTEXT>_<THING>` — `APP_`, `DATABASE_`,
  `AUTH_` (the operator account, `AUTH_ALLOWED_IPS`), `OPERATOR_` (the platform's admin API: `OPERATOR_API_URL`,
  `OPERATOR_API_TOKEN`, the same name and value as on the platform) — never a product (`OROCHIA_…`) nor a vendor;
  `NEXT_PUBLIC_` only where the browser needs it. Each one is declared in `lib/env.ts` (zod): `npm test` refuses an
  undeclared or misnamed one, a deployment with a bad environment does not start, README's table is generated
  (`npm run docs:generate`).
- Pages render empty states, never sample data. Links to the consumer app use `NEXT_PUBLIC_OPERATOR_PLATFORM_URL`.
- UI comes from the platform primitives [`@krizaka/ui`](https://github.com/krizaka/krizaka-ui) (`Button`/`buttonVariants`,
  `Card`, `Stat`, `PageHeader`, `EmptyState`, `AlertDialog`, `Field`, `Badge`, `Meter`, `Loader` / `Skeleton` in
  `app/loading.tsx`, theme), the charts of [`@krizaka/charts`](https://www.npmjs.com/package/@krizaka/charts) (overview:
  platform revenue and reports over 12 months, the catalogue; storage: the platform gauge, the largest accounts — under
  one `ChartsProvider brand="orochia"` in the layout; the series come from Orochia's admin API, never computed here) and the Orochia identity
  [`@krizaka/orochia-design-system`](https://github.com/krizaka/orochia-design-system) (`OrochiaLogo`, `theme.css`), on
  npm; never a copy. `components/ui.tsx` only wraps them with the console's words. A missing component is added to the
  platform first. Tailwind CSS v4 is configured in `app/globals.css` (no `tailwind.config.js`), in this order:
  `tailwindcss` → `@krizaka/tailwind` → `@krizaka/ui/tailwind.css` → `@krizaka/orochia-design-system/theme.css` →
  `@krizaka/tokens/brands/orochia.css`.
- **Dark and light** are both first-class (`ThemeScript` + `ThemeProvider`, the toggle in the header). Components use
  role utilities only (`bg-surface-*`, `text-fg*`, `border-border-*`, `text-accent`, `text-success|warning|danger`):
  `npm run lint` refuses raw palette colours, `light:`, `[var(--…)]` and template strings in `className`
  (`@krizaka/config`, as errors), and `krizaka-ratchet` keeps `lint-ratchet.json` at zero.

## 3. Run

```bash
npm install
cp .env.example .env.local      # its own database, the operator account, the token shared with Orochia
npm run dev                     # :3001 — Orochia must be running (npm run setup && npm run dev)
```

Sign in with `AUTH_OPERATOR_EMAIL` / `AUTH_OPERATOR_PASSWORD`. Locally, create the database once
(`docker exec orochia-postgres-dev psql -U orochia_user -d orochia_db -c "CREATE DATABASE orochia_admin"`); the
tables are created on first use. Deployment: `deploy/Dockerfile` and `deploy/app-spec.dev.yaml` (App Platform, project
`orochia`, its own dev database).

## 4. Definition of done

1. `npx tsc --noEmit`, `npm run lint` and `npm run build` pass.
2. The screen works against a seeded Orochia (`npm run db:reset -- --yes` there) with an admin session, and a
   member session is refused.
3. Any new admin endpoint it relies on is documented and tested in the Orochia repository.
4. PR captures (screenshots, recordings, metrics) are never committed: they go to Bunny Storage under `pr-assets/<repo>/<pr-or-topic>/` with [`scripts/pr-assets.mjs`](https://github.com/krizaka/krizaka-com/blob/main/scripts/pr-assets.mjs) of krizaka-com (its AGENTS.md §5.1), and the PR body links their CDN URLs. `docs/screenshots/` is git-ignored.
5. Every feature and every fix ships with its tests — no test, not done. This repository has no test runner yet: the
   first change that needs one adds Vitest and wires `npm test` into CI; a fix starts with a failing test that
   reproduces the bug; the endpoint side is tested in Orochia (3).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Search engines & AI assistants (Krizaka family contract)

The contract is defined once, in krizaka-com `AGENTS.md` §2.4, and checked here by `scripts/check-seo-family.mjs` (a copy of
the same dependency-free file in every site's repository — keep the copies identical; its unit test sits beside it).

admin.orochia.com is an operator console and is **never indexed**: `app/robots.ts` (`Disallow: /`, public — `proxy.ts` lets robots.txt through the IP and sign-in gates), `X-Robots-Tag: noindex, nofollow` on every response (`next.config.mjs`) and the robots meta. No sitemap, no llms.txt (`check-seo-family.mjs --console`). Tests: `lib/seo.test.ts`.
