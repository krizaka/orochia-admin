/** Server start-up: a deployment whose environment is incomplete or malformed refuses to start (lib/env.ts). */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.NEXT_PHASE === "phase-production-build") return;
  const { assertEnv } = await import("./lib/env");
  assertEnv();
}
