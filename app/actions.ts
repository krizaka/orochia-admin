"use server";

import { revalidatePath } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { ApiError, orochia } from "@/lib/orochia";

/**
 * Operator decisions. Each action calls an Orochia admin endpoint and returns its outcome to the confirmation dialog
 * that sent it (components/ConfirmDialog.tsx): `ok`, or the API's error message — a refusal never crashes the screen.
 */

export type ActionState = { ok: boolean; error?: string; message?: string; at: number } | null;

async function attempt(paths: string[], run: () => Promise<string | void>): Promise<ActionState> {
  try {
    const message = await run();
    for (const p of paths) revalidatePath(p);
    return { ok: true, message: message || undefined, at: Date.now() };
  } catch (error) {
    unstable_rethrow(error);
    return { ok: false, error: error instanceof ApiError ? error.message : "Something went wrong. Try again.", at: Date.now() };
  }
}

const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

/** Moves a content report through triage. */
export async function updateReport(_: ActionState, form: FormData) {
  return attempt(["/moderation", "/"], async () => {
    await orochia(`/api/admin/reports/${text(form, "id")}`, { method: "PATCH", body: JSON.stringify({ status: text(form, "status") }) });
  });
}

/** Records the outcome of a creator's 2257 review. */
export async function setCreatorVerified(_: ActionState, form: FormData) {
  return attempt(["/compliance", "/creators", "/"], async () => {
    await orochia(`/api/admin/creators/${text(form, "id")}`, { method: "PATCH", body: JSON.stringify({ isVerified: text(form, "isVerified") === "true" }) });
  });
}

/** Advances a payout request (settling needs the transfer reference, failing needs a reason). */
export async function updatePayout(_: ActionState, form: FormData) {
  const status = text(form, "status");
  const note = text(form, "reason");
  return attempt(["/treasury", "/"], async () => {
    await orochia(`/api/admin/payouts/${text(form, "id")}`, {
      method: "PATCH",
      body: JSON.stringify({ status, ...(status === "SETTLED" ? { txHashOrReference: note } : {}), ...(status === "FAILED" ? { failureReason: note } : {}) }),
    });
  });
}

/** Takes a video down with a recorded reason (DMCA, terms, a confirmed report) — cancelling its auction — or restores it. */
export async function moderateVideo(_: ActionState, form: FormData) {
  const action = text(form, "action");
  return attempt(["/catalogue", "/moderation", "/auctions", "/"], async () => {
    await orochia(`/api/admin/videos/${text(form, "id")}`, { method: "PATCH", body: JSON.stringify(action === "remove" ? { action, reason: text(form, "reason") } : { action }) });
  });
}

/** Suspends (cancelling their open auctions) or reinstates an account, or changes its role. */
export async function manageUser(_: ActionState, form: FormData) {
  const action = text(form, "action");
  const body = action === "suspend" ? { action, reason: text(form, "reason") } : action === "set-role" ? { action, role: text(form, "role") } : { action };
  return attempt(["/users", "/creators", "/auctions"], async () => {
    await orochia(`/api/admin/users/${text(form, "id")}`, { method: "PATCH", body: JSON.stringify(body) });
  });
}

/** Cancels an auction with a recorded reason; the leading bid's credits go back to its bidder. */
export async function cancelAuction(_: ActionState, form: FormData) {
  return attempt(["/auctions", "/"], async () => {
    await orochia(`/api/admin/auctions/${text(form, "id")}`, { method: "DELETE", body: JSON.stringify({ reason: text(form, "reason") }) });
  });
}

/** Backs the database up now, into private storage. */
export async function backupDatabase(_: ActionState) {
  return attempt(["/platform"], async () => {
    const { backup } = await orochia<{ backup: { name: string; rows: number } }>("/api/admin/platform/backups", { method: "POST" });
    return `Backup ${backup.name} written (${backup.rows.toLocaleString("en-US")} rows).`;
  });
}

/** Deletes a backup file. */
export async function deleteBackup(_: ActionState, form: FormData) {
  return attempt(["/platform"], async () => {
    await orochia(`/api/admin/platform/backups/${encodeURIComponent(text(form, "name"))}`, { method: "DELETE" });
  });
}

/** Factory reset: (backup,) wipe, rebuild from the migrations, keep this operator and the owner. */
export async function factoryReset(_: ActionState, form: FormData) {
  return attempt(["/", "/platform"], async () => {
    const result = await orochia<{ migrationsApplied: number; backup: { name: string } | null }>("/api/admin/platform/reset", {
      method: "POST",
      body: JSON.stringify({ confirm: text(form, "phrase"), backup: form.get("backup") === "on" }),
    });
    return `Database rebuilt (${result.migrationsApplied} migration${result.migrationsApplied === 1 ? "" : "s"})${result.backup ? ` — backup ${result.backup.name}` : ""}.`;
  });
}
