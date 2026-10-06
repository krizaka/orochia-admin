# 🛡️ OROCHIA ADMIN — Control Plane & Operations Governance

> Operational contract and architecture specification for **`orochia-admin`**, the administrative control plane, 18 U.S.C. § 2257 compliance vault, Bunny.net CDN telemetry monitor, and multi-tier treasury settlement station for the Orochia ecosystem.

---

## 1. Role & Identity

- **Repository**: `krizaka/orochia-admin`
- **Application**: Next.js 14+ App Router, TypeScript, Tailwind CSS, Lucide Icons.
- **Port Allocation**: Runs on `http://localhost:3001` to operate concurrently with the consumer platform on `http://localhost:3000`.
- **Purpose**:
  1. **18 U.S.C. § 2257 Compliance Vault**: Federal record keeper custody verification, primary producer government ID validation, certified federal audit export.
  2. **DMCA & Emergency Triage**: Single-click worldwide Bunny CDN edge purge and instant takedown desk.
  3. **Platform Treasury & Monetization Desk**: 10% protocol rake extraction, $49 federal onboarding audit fee, Sanctuary Spotlight sponsored placement management, 1.5% express payout processing, batch multi-sig settlement.
  4. **Bunny.net Stream Telemetry**: Real-time 114 PoP edge metrics, bandwidth auditing, DRM configuration, video collection governance.
  5. **Creator & User Registry**: Role-based access control (RBAC), verification badges, account lifecycle enforcement.

---

## 2. Local Development & DevX

```bash
# Install dependencies
npm install

# Start Admin Control Plane on Port 3001
npm run dev -- -p 3001
```

- When running locally, the consumer app runs on `http://localhost:3000` and the admin app runs on `http://localhost:3001`.
- Fast switching links exist in both headers and navigation bars.

---

## 3. Security & Access Control

- All routes are protected by administrative session verification (`role === "ADMIN"`).
- Destructive actions (Emergency CDN Purge, Performer Suspension, Treasury Batch Settlement) require explicit confirmation and audit log generation.
