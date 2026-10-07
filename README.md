<!-- krizaka-header -->
<div align="center">

<img src=".github/assets/orochia-logo.svg" alt="Orochia" width="132">

# Orochia Admin

**Creators get paid. Every cent, exactly once.**

The operator console of Orochia: 18 U.S.C. § 2257 creator verification, content-report triage, treasury and payouts — a server-side BFF over the Orochia admin API.

[![CI](https://github.com/krizaka/orochia-admin/actions/workflows/ci.yml/badge.svg)](https://github.com/krizaka/orochia-admin/actions/workflows/ci.yml)
[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Orochia](https://img.shields.io/badge/part%20of-Orochia-d946ef)](https://www.krizaka.com/en/products/orochia#guarantees)
[![Docs](https://img.shields.io/badge/docs-krizaka.com-6366f1)](https://www.krizaka.com/en/products/orochia/docs/getting_started)

[Documentation](https://www.krizaka.com/en/products/orochia/docs/getting_started) · [Website](https://www.krizaka.com) · [Krizaka on GitHub](https://github.com/krizaka)

</div>
<!-- /krizaka-header -->

---

## What it does

| Screen | Backed by | Purpose |
| :--- | :--- | :--- |
| Overview | `GET /api/admin/overview` | Ledger totals, catalogue state and the three queues that need a human |
| 2257 Creator Verification | `GET/PATCH /api/admin/creators` | Approve a creator after their identity and age records are checked — only verified creators can upload |
| Content Reports | `GET/PATCH /api/admin/reports` | Triage reports; suspected minors and non-consensual content first |
| Treasury & Payouts | `GET /api/platform/treasury`, `GET/PATCH /api/admin/payouts` | Revenue from the ledger; settle (with transfer reference) or fail (with reason, refunds the balance) payouts |
| Catalogue | `GET /api/bunny/analytics` | Videos by encoding state, total views |
| Creator Registry | `GET/PATCH /api/admin/creators` | All creators, activity, suspend/restore uploads |

```mermaid
flowchart LR
    Operator -->|sign-in, ADMIN only| Console[orochia-admin :3001]
    Console -->|server-side, operator session| API[Orochia /api/admin/*]
    API --> DB[(PostgreSQL)]
```

## Run locally

```bash
cp .env.example .env.local      # OROCHIA_API_URL=http://localhost:3000
npm install
npm run dev                     # http://localhost:3001 — sign in with an Orochia ADMIN account
```

Start [Orochia](https://github.com/krizaka/orochia) first (`npm run dev` there; the seed creates an
administrator for local use).

## Deploy

`deploy/Dockerfile` builds a standalone image (port 3001). Set `OROCHIA_API_URL` (internal URL of the
Orochia web service) and `NEXT_PUBLIC_OROCHIA_APP_URL`. Expose the console only on a private network or
behind an IP allow-list.

## License

Apache License 2.0 — see [LICENSE](LICENSE).
