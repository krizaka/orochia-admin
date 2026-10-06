# OROCHIA ADMIN — Governance scope (agent-neutral)

> Operator console of [Orochia](https://github.com/krizaka/orochia). The platform contract is
> [`krizaka/orochia/AGENTS.md`](https://github.com/krizaka/orochia/blob/main/AGENTS.md); this file
> scopes it to the console.

## 1. What this is

- Next.js 14 App Router, port **3001**. **No database of its own**: every figure and action goes
  through Orochia's `/api/admin/*` endpoints (and `/api/platform/treasury`, `/api/bunny/analytics`).
- Screens: Overview · 2257 Creator Verification · Content Reports · Treasury & Payouts · Catalogue ·
  Creator Registry.

## 2. Security invariants

- Sign-in goes through Orochia (`/api/auth/login`); the session is kept **only if the account is
  ADMIN**, in an httpOnly, SameSite=Strict cookie (8 h). `middleware.ts` protects every route; each API
  call re-validates the session and an expired or non-admin session is sent back to `/login`.
- Mutations are **server actions** calling Orochia; the browser never holds the Orochia session.
- No screen renders invented data. Anything Orochia does not record (CDN bandwidth, edge PoPs…) is
  linked to the provider's dashboard, not simulated.
- Responses carry `X-Robots-Tag: noindex` and frame denial. Deploy the console on a private network or
  behind an IP allow-list.

## 3. Definition of done

`npm run lint`, `npx tsc --noEmit` and `npm run build` are green; every new screen reads Orochia's API.
