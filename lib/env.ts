/**
 * The console's environment — one module. `ENV_VARS` declares every variable it reads: its bounded context, whether
 * production needs it, whether it is a secret, a zod schema and what it does. Names follow the Krizaka convention
 * (krizaka/.github#46): `<CONTEXT>_<THING>`, never a product or a vendor; `NEXT_PUBLIC_` only where the browser needs
 * the value. README.md's table is generated from this list (`npm run docs:generate`); env.test.ts fails when code reads
 * an undeclared variable. `assertEnv()` (instrumentation.ts) stops a deployed production console whose environment is
 * incomplete or malformed — the platform keeps the previous release.
 */

import { z } from "zod";

export const ENV_CONTEXTS = {
  APP: "Application — environment, build",
  DATABASE: "Database — the console's own PostgreSQL",
  AUTH: "Authentication — the operator account, the network gate",
  OPERATOR: "Operator — the platform's admin API",
} as const;
export type EnvContext = keyof typeof ENV_CONTEXTS;
export type EnvNeed = "required" | "recommended" | "optional";

export interface EnvVar {
  name: string;
  context: EnvContext;
  need: EnvNeed;
  secret?: boolean;
  build?: boolean;
  default?: string;
  doc: string;
  schema: z.ZodTypeAny;
}

const text = z.string().min(1);
const url = z.string().url();

export const ENV_VARS: readonly EnvVar[] = [
  { name: "NEXT_PUBLIC_APP_ENV", context: "APP", need: "optional", build: true, default: "local", schema: z.enum(["local", "dev", "staging", "production"]), doc: "The build badge in the header (`v<version> · <env> · <commit>`), never shown with `production`." },
  { name: "APP_COMMIT_SHA", context: "APP", need: "optional", build: true, schema: text, doc: "The commit the image is built from (App Platform: `${_self.COMMIT_HASH}`); else `git rev-parse`." },
  { name: "DATABASE_URL", context: "DATABASE", need: "required", schema: text, doc: "The console's own database (operator account, sessions, operator log) — never the platform's." },
  { name: "DATABASE_CA_CERT", context: "DATABASE", need: "recommended", schema: text, doc: "CA of a managed PostgreSQL (App Platform: `${admin-db.CA_CERT}`): TLS verified against it." },
  { name: "AUTH_OPERATOR_EMAIL", context: "AUTH", need: "required", schema: z.string().email(), doc: "The single operator account: nobody signs up, there is no other user." },
  { name: "AUTH_OPERATOR_NAME", context: "AUTH", need: "required", schema: text, doc: "The operator's display name." },
  { name: "AUTH_OPERATOR_PASSWORD", context: "AUTH", need: "required", secret: true, schema: z.string().min(12, "must be at least 12 characters"), doc: "The operator's password (12+ characters), brought in line at sign-in." },
  { name: "AUTH_ALLOWED_IPS", context: "AUTH", need: "required", schema: text, doc: "Comma-separated client addresses (`do-connecting-ip`) allowed to reach the console, sign-in included. Empty in production: nobody." },
  { name: "OPERATOR_API_URL", context: "OPERATOR", need: "required", default: "http://localhost:3000", schema: url, doc: "The platform's API the console operates (`/api/admin/*`)." },
  { name: "OPERATOR_API_TOKEN", context: "OPERATOR", need: "required", secret: true, schema: z.string().min(32, "must be at least 32 characters"), doc: "Service token shared with the platform (same value and name on both deployments); never reaches the browser." },
  { name: "NEXT_PUBLIC_OPERATOR_PLATFORM_URL", context: "OPERATOR", need: "recommended", build: true, default: "http://localhost:3000", schema: url, doc: "The platform's public site, for the links to a video, a profile or the home." },
];

/** Problems of an environment against ENV_VARS, one line each — names only, never a value. */
export function checkEnv(env: Record<string, string | undefined> = process.env): string[] {
  const production = env.NODE_ENV === "production";
  const problems: string[] = [];
  for (const e of ENV_VARS) {
    const raw = env[e.name]?.trim();
    if (!raw) {
      if (production && e.need === "required" && !e.build) problems.push(`${e.name} is required in production`);
      continue;
    }
    const parsed = e.schema.safeParse(raw);
    if (!parsed.success) problems.push(`${e.name} ${parsed.error.issues[0]?.message ?? "is invalid"}`);
  }
  return problems;
}

/** At start-up: a deployed production console (dev, staging or production build) with a bad environment does not start. */
export function assertEnv(env: Record<string, string | undefined> = process.env, deployment = process.env.NEXT_PUBLIC_APP_ENV): void {
  const problems = checkEnv(env);
  if (problems.length === 0) return;
  const list = `\n  - ${problems.join("\n  - ")}`;
  if (env.NODE_ENV === "production" && (deployment === "dev" || deployment === "staging" || deployment === "production")) {
    throw new Error(`environment is invalid:${list}`);
  }
  console.warn(`env: ${problems.length} problem(s) — a deployment would refuse to start:${list}`);
}

/** The README's table, grouped by context. */
export function envMarkdown(): string {
  const need = { required: "✓", recommended: "recommended", optional: "—" } as const;
  return Object.entries(ENV_CONTEXTS)
    .flatMap(([context, label]) => {
      const vars = ENV_VARS.filter((e) => e.context === context);
      return [
        `### ${label.split(" — ")[0]} — \`${context}_\``,
        "",
        "| Variable | Production | Secret | Default | What it does |",
        "| :--- | :---: | :---: | :--- | :--- |",
        ...vars.map((e) => `| \`${e.name}\`${e.build ? " *(build)*" : ""} | ${need[e.need]} | ${e.secret ? "✓" : ""} | ${e.default ? `\`${e.default}\`` : ""} | ${e.doc} |`),
        "",
      ];
    })
    .join("\n");
}
