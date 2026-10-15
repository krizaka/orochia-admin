// A stand-in for Orochia's admin API for the console's end-to-end walk: the paths and shapes the console reads, with a
// small fixed dataset (a failed video, a held one, an open report) so the operations page has something to show.
import http from "node:http";

const iso = (minutesAgo) => new Date(Date.now() - minutesAgo * 60_000).toISOString();
const routes = {
  "/api/health": () => ({ status: "healthy", timestamp: iso(0), services: { database: "up" }, version: "1.0.0", commit: "92fd33b" }),
  "/api/admin/overview": () => ({ data: { treasury: { grossCents: 125000, platformFeeCents: 12500, creatorNetCents: 112500, creditsCount: 31, payoutsRequestedCents: 20000, payoutsSettledCents: 10000, protocolRakePercent: 10 }, catalogue: { videosByStatus: { READY: 40, PROCESSING: 2, HELD: 1, FAILED: 3 }, totalViews: 9120 }, queues: { openReports: 2, creatorsAwaitingVerification: 1, payoutsInProgress: 1 }, trends: [] } }),
  "/api/admin/platform": () => ({ platform: { environment: { appUrl: "https://dev.orochia.com", indexed: false, nodeEnv: "production" }, database: { name: "orochia_db", host: "db", sizeBytes: 8_000_000, serverVersion: "16.4 (Debian)" }, history: { kind: "current", applied: 12, pending: 0, known: 12, lastAppliedAt: iso(500) }, tables: [{ name: "users", rows: 4 }, { name: "videos", rows: 46 }], reset: { allowed: false, confirmPhrase: "reset orochia_db", ownerConfigured: true } } }),
  "/api/admin/platform/backups": () => ({ backups: [] }),
  "/api/admin/storage": () => ({ storage: { enabled: true, platform: { used: { bytes: 2_000_000_000, seconds: 7200 }, orphanBytes: 0, limit: { bytes: 50_000_000_000, seconds: null }, percent: 4, percentSeconds: null, level: "ok", alertThresholds: [80, 95] }, plans: { default: { bytes: 5_000_000_000, seconds: null } }, adminPlan: "default", perFile: { video: { maxBytes: 1_000_000_000, maxSeconds: 3600 }, story: { maxBytes: 100_000_000, maxSeconds: 60 }, draft: { maxBytes: 1_000_000_000, maxSeconds: 3600 } }, uploadsPerDay: 20, concurrentUploads: 2, imageUploadsPerDay: 50, topCreators: [], lastReconciliation: { takenAt: iso(120), libraryBytes: 2_000_000_000, libraryVideos: 46, zoneBytes: 2_000_000_000, zoneFiles: 46, appBytes: 0, orphanBytes: 0, orphanVideos: 0, missingVideos: 1, updatedRows: 0 } }, defences: { rateLimitStore: "postgres", challenge: { mode: "off", active: false } } }),
  "/api/admin/users": () => ({ users: [{ id: "a1b2c3d4-0000-4000-8000-000000000001", username: "eric", email: "eric@example.test", role: "MEMBER", displayName: "Eric", isVerified: true, isAgeVerified: true, suspendedAt: null, suspensionReason: null, createdAt: iso(9000) }] }),
  "/api/admin/creators": () => ({ creators: [] }),
  "/api/admin/auctions": () => ({ auctions: [] }),
  "/api/admin/payouts": () => ({ payouts: [] }),
  "/api/admin/reports": () => ({ reports: [] }),
  "/api/admin/videos": () => ({ videos: [] }),
  "/api/admin/explorer": () => ({ data: { configured: true, engine: "orazaka", breaker: { open: false, failures: 0, reopensAt: null }, discoverable: 10, embedded: 10, models: ["nomic-embed-text"], runs: [] } }),
  "/api/platform/treasury": () => ({ data: { protocolRakePercent: 10, grossCents: 125000, platformFeeCents: 12500, creatorNetCents: 112500, creditsCount: 31, payoutsRequestedCents: 20000, payoutsSettledCents: 10000 } }),
  "/api/bunny/analytics": () => ({ data: { videosByStatus: { READY: 40, PROCESSING: 2, HELD: 1, FAILED: 3 }, totalViews: 9120 } }),
};

/** Starts the mock on `port`; `.close()` stops it. */
export function startMockPlatform(port) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const path = new URL(req.url ?? "/", "http://x").pathname;
      if (path !== "/api/health" && !req.headers.authorization?.startsWith("Bearer ")) {
        res.writeHead(401, { "Content-Type": "application/json" });
        return res.end("{}");
      }
      const route = routes[path];
      res.writeHead(route ? 200 : 404, { "Content-Type": "application/json" });
      res.end(JSON.stringify(route ? route() : {}));
    });
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}
