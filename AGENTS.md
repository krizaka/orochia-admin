# Orochia Admin — Repository Contract (agent-neutral)

> Scope of [`krizaka/orochia-admin`](https://github.com/krizaka/orochia-admin), the operator console of Orochia.
> The platform-wide rules — invariants, API conventions, definition of done — live in the
> [Orochia contract](https://github.com/krizaka/orochia/blob/main/AGENTS.md) and apply here unchanged.
> `CLAUDE.md` only imports this file.

## 1. What this repository is

- A Next.js 14 **server-side BFF**: it has **no database and no secret of its own**. Every figure and every action
  goes through Orochia's `/api/admin/*` endpoints with the operator's ADMIN session.
- The session lives in the httpOnly `orochia_admin_session` cookie (`lib/orochia.ts`); it never reaches client code.
  An expired, suspended or non-admin session is sent back to `/login`.
- Screens: overview · 2257 creator verification · content reports · catalogue (takedown / restore) · treasury &
  payouts · creator registry · accounts (suspend / reinstate / role).

## 2. Rules

- **A capability is an Orochia admin endpoint first.** This console never computes money, access or compliance
  state itself; it renders what the API returns and posts what the operator decides.
- Mutations are **server actions** (`app/actions.ts`) that call the API, then `revalidatePath` the screens they change.
- Every operator decision that removes something records its **reason** (takedown, suspension, failed payout).
- Pages render empty states, never sample data. Links to the consumer app use `NEXT_PUBLIC_OROCHIA_APP_URL`.
- The brand mark is `components/OrochiaLogo.tsx`, identical to the design system's.

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
