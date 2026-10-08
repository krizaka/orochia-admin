# Orochia Admin — Repository Contract (agent-neutral)

> Scope of [`krizaka/orochia-admin`](https://github.com/krizaka/orochia-admin), the operator console of Orochia.
> The platform-wide rules — invariants, API conventions, definition of done — live in the
> [Orochia contract](https://github.com/krizaka/orochia/blob/main/AGENTS.md) and apply here unchanged.
> `CLAUDE.md` only imports this file.

## 1. What this repository is

- A Next.js 16 **server-side BFF**: it has **no database and no secret of its own**. Every figure and every action
  goes through Orochia's `/api/admin/*` endpoints with the operator's ADMIN session.
- The session lives in the httpOnly `orochia_admin_session` cookie (`lib/orochia.ts`); it never reaches client code.
  An expired, suspended or non-admin session is sent back to `/login`.
- Screens: overview · 2257 creator verification · content reports · catalogue (takedown / restore) · auctions
  (status, money held, cancel with a reason) · treasury & payouts · creator registry · accounts (suspend / reinstate /
  role) · platform & database (environment, migration history, rows per table, backups, factory reset).
- Desktop is the target: tables and dialogs are laid out for a wide screen.

## 2. Rules

- **A capability is an Orochia admin endpoint first.** This console never computes money, access or compliance
  state itself; it renders what the API returns and posts what the operator decides.
- Mutations are **server actions** (`app/actions.ts`) that call the API, then `revalidatePath` the screens they change.
- Every operator decision that removes something records its **reason** (takedown, suspension, failed payout,
  cancelled auction).
- **Every decision is confirmed in a dialog** (`components/ConfirmDialog.tsx`, the kit's `Sheet`): it says what will
  happen, collects the reason or reference, shows the API's refusal in place. What cannot be undone asks the operator to
  type a phrase (the factory reset: `reset <database>`), and offers a backup first. Only benign, reversible steps
  (start review, reopen) run in one click (`direct`).
- **Factory reset** is an Orochia endpoint (`/api/admin/platform/reset`), refused unless the deployment sets
  `OROCHIA_ALLOW_DATABASE_RESET=true` and is not the indexed production. Backups are gzipped JSON in Orochia's private
  storage, downloaded through this console's `/api/backups/[name]` (the session never reaches the browser).
- Pages render empty states, never sample data. Links to the consumer app use `NEXT_PUBLIC_OROCHIA_APP_URL`.
- UI comes from [`@krizaka/orochia-design-system`](https://github.com/krizaka/orochia-design-system) on npm (the
  `OrochiaLogo`, `buttonClass` for actions, the Tailwind CSS v4 `theme.css`); never a copy. A missing component is
  added to the design system first. Tailwind CSS v4 is configured in `app/globals.css` (no `tailwind.config.js`).

## 3. Run

```bash
npm install
OROCHIA_API_URL=http://localhost:3000 npm run dev -- -p 3001   # Orochia must be running (npm run setup && npm run dev)
```

Sign in with an administrator account (`admin@orochia.org` / `admin1234` in the development seed).
`OROCHIA_API_URL` is mandatory in production.

## 4. Definition of done

1. `npx tsc --noEmit`, `npm run lint` and `npm run build` pass.
2. The screen works against a seeded Orochia (`npm run db:reset -- --yes` there) with an admin session, and a
   member session is refused.
3. Any new admin endpoint it relies on is documented and tested in the Orochia repository.
