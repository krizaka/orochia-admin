// End-to-end walk of the console: sign in as the operator from an allowed address, open every screen, and check that an
// address outside AUTH_ALLOWED_IPS is refused. Needs a PostgreSQL for the console's own database (DATABASE_URL) and a
// Chromium for playwright-core. Run: `DATABASE_URL=… npm run e2e` (screenshots, dark, in $E2E_SHOTS when set).
import { spawn } from "node:child_process";
import crypto from "node:crypto";
import { mkdirSync } from "node:fs";

import { startMockPlatform } from "./mock-platform.mjs";

const { chromium } = await import("playwright-core");
const PLATFORM = 4189;
const APP = 4102;
const BASE = `http://localhost:${APP}`;
const ALLOWED = "203.0.113.7";
const OTHER = "198.51.100.9";
const email = `e2e-${Date.now()}@example.test`;
const password = crypto.randomBytes(18).toString("base64url");
const token = crypto.randomBytes(24).toString("hex");
const SCREENS = [["/", "Overview"], ["/compliance", null], ["/moderation", null], ["/treasury", null], ["/catalogue", null], ["/auctions", null], ["/creators", null], ["/users", "Accounts"], ["/storage", "Storage"], ["/explorer", null], ["/operations", "Operations"], ["/audit", "Audit log"], ["/platform", "Platform"]];

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL (a PostgreSQL for the console's own database) is required");
const out = (line) => process.stdout.write(`${line}\n`);
let failed = 0;
const check = (ok, what) => {
  out(`${ok ? "ok  " : "FAIL"} ${what}`);
  if (!ok) failed += 1;
};

const platform = await startMockPlatform(PLATFORM);
const app = spawn("npx", ["next", "dev", "-p", String(APP)], {
  env: { ...process.env, AUTH_ALLOWED_IPS: ALLOWED, AUTH_OPERATOR_EMAIL: email, AUTH_OPERATOR_NAME: "E2E Operator", AUTH_OPERATOR_PASSWORD: password, OPERATOR_API_URL: `http://127.0.0.1:${PLATFORM}`, OPERATOR_API_TOKEN: token, NEXT_PUBLIC_APP_ENV: "dev" },
  stdio: "ignore",
});
try {
  for (let i = 0; i < 120; i += 1) {
    try {
      if ((await fetch(`${BASE}/robots.txt`)).ok) break;
    } catch {
      /* starting */
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  const refused = await fetch(`${BASE}/login`, { headers: { "do-connecting-ip": OTHER } });
  check(refused.status === 403, `an address outside the list is refused, sign-in page included (${refused.status})`);

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "dark", extraHTTPHeaders: { "do-connecting-ip": ALLOWED } });
  await context.addInitScript(() => {
    try {
      localStorage.setItem("kz-theme", "dark");
    } catch {
      /* none */
    }
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500); // dev compile: let the form hydrate before it is submitted
  await page.locator('input[type="email"], input[name="email"]').first().fill(email);
  await page.locator('input[type="password"]').first().fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(`${BASE}/`, { timeout: 90_000 });
  check(true, "the operator signs in from an allowed address");

  if (process.env.E2E_SHOTS) mkdirSync(process.env.E2E_SHOTS, { recursive: true });
  for (const [path, text] of SCREENS) {
    const res = await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
    const ok = res?.status() === 200 && (text ? await page.getByText(text).first().isVisible() : (await page.locator("main").count()) > 0);
    check(ok, `${path} renders${text ? ` "${text}"` : ""}`);
    if (process.env.E2E_SHOTS) await page.screenshot({ path: `${process.env.E2E_SHOTS}/${path.slice(1) || "overview"}.png` });
  }
  await page.goto(`${BASE}/operations`, { waitUntil: "networkidle" });
  check(await page.getByText("Videos failed").first().isVisible(), "/operations lists the queues");
  await page.goto(`${BASE}/audit`, { waitUntil: "networkidle" });
  check(await page.getByText("sign-in", { exact: true }).first().isVisible().catch(() => false), "/audit lists the operator's own sign-in");
  await browser.close();
} finally {
  app.kill("SIGTERM");
  platform.close();
}
process.exit(failed ? 1 : 0);
