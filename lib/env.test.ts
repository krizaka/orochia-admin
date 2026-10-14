import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { ENV_VARS, assertEnv, checkEnv, envMarkdown } from "./env";

const ROOT = path.resolve(__dirname, "..");
const FRAMEWORK = new Set(["NODE_ENV", "PORT", "HOSTNAME", "NEXT_PHASE", "NEXT_RUNTIME", "DATABASE_RECONNECT_IT", "NEXT_PUBLIC_APP_VERSION", "NEXT_PUBLIC_APP_COMMIT_SHA", "CI"]);
const CONTEXT = /^(NEXT_PUBLIC_)?(APP|DATABASE|AUTH|MEDIA|MAIL|PUSH|PAYMENTS|REALTIME|ABUSE|OBSERVABILITY|AI|OPERATOR)_[A-Z0-9_]+$/;
const VENDOR_OR_PRODUCT = /^(NEXT_PUBLIC_)?(OROCHIA|KRIZAKA|ADMIN|BUNNY|MAILGUN|RESEND|STRIPE|VERCEL|DO|DIGITALOCEAN)_/;

describe("ENV_VARS — named by bounded context (krizaka/.github#46)", () => {
  it("names every variable <CONTEXT>_<THING>, never after a product or a vendor", () => {
    for (const e of ENV_VARS) {
      expect(e.name).toMatch(CONTEXT);
      expect(e.name).not.toMatch(VENDOR_OR_PRODUCT);
      expect(e.name.startsWith(`${e.context}_`) || e.name.startsWith(`NEXT_PUBLIC_${e.context}_`), e.name).toBe(true);
    }
  });

  it("declares every variable the code, .env.example and the App Platform spec use", () => {
    const declared = new Set(ENV_VARS.map((e) => e.name));
    const files = execSync("git ls-files", { cwd: ROOT, encoding: "utf8" }).split("\n").filter((f) => /\.(ts|tsx|mjs|js)$/.test(f) && !f.endsWith("env.test.ts"));
    const used = new Map<string, string>();
    for (const f of files) for (const m of fs.readFileSync(path.join(ROOT, f), "utf8").matchAll(/process\.env\.([A-Z][A-Z0-9_]+)/g)) used.set(m[1], f);
    for (const m of fs.readFileSync(path.join(ROOT, ".env.example"), "utf8").matchAll(/^#?\s?([A-Z][A-Z0-9_]+)=/gm)) used.set(m[1], ".env.example");
    for (const m of fs.readFileSync(path.join(ROOT, "deploy/app-spec.dev.yaml"), "utf8").matchAll(/key: ([A-Z][A-Z0-9_]+)/g)) used.set(m[1], "deploy/app-spec.dev.yaml");
    const undeclared = [...used].filter(([n]) => !declared.has(n) && !FRAMEWORK.has(n)).map(([n, f]) => `${n} (${f})`);
    expect(undeclared.join(", ")).toBe("");
  });

  it("README.md's table is generated from ENV_VARS (npm run docs:generate)", () => {
    const readme = path.join(ROOT, "README.md");
    const src = fs.readFileSync(readme, "utf8");
    const block = /(<!-- env -->\n)[\s\S]*?(<!-- \/env -->)/;
    expect(block.test(src)).toBe(true);
    const next = src.replace(block, (_, a, b) => `${a}${envMarkdown()}${b}`);
    if (process.env.UPDATE_DOCS === "1") fs.writeFileSync(readme, next);
    else expect(src, "README.md is stale — npm run docs:generate").toBe(next);
  });
});

describe("checkEnv / assertEnv — fail-closed in production", () => {
  const complete = {
    NODE_ENV: "production",
    DATABASE_URL: "postgresql://u:p@db:5432/admin",
    AUTH_OPERATOR_EMAIL: "operator@example.com",
    AUTH_OPERATOR_NAME: "Operator",
    AUTH_OPERATOR_PASSWORD: "x".repeat(12),
    AUTH_ALLOWED_IPS: "203.0.113.7",
    OPERATOR_API_URL: "https://dev.orochia.com",
    OPERATOR_API_TOKEN: "t".repeat(32),
  };

  it("accepts a complete production environment", () => {
    expect(checkEnv(complete)).toEqual([]);
  });

  it("names what is missing or malformed, never a value", () => {
    const problems = checkEnv({ ...complete, OPERATOR_API_TOKEN: "short-token", AUTH_ALLOWED_IPS: "" });
    expect(problems).toContain("AUTH_ALLOWED_IPS is required in production");
    expect(problems.some((p) => p.startsWith("OPERATOR_API_TOKEN must be at least 32"))).toBe(true);
    expect(problems.join(" ")).not.toContain("short-token");
  });

  it("stops a deployed production console, only warns elsewhere", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(() => assertEnv({ NODE_ENV: "production" }, "dev")).toThrow(/OPERATOR_API_TOKEN is required/);
    expect(() => assertEnv({ NODE_ENV: "production" }, "local")).not.toThrow();
    expect(() => assertEnv({ NODE_ENV: "development" }, "dev")).not.toThrow();
    expect(warn).toHaveBeenCalled();
    expect(() => assertEnv(complete, "production")).not.toThrow();
  });
});
