"use server";

import { revalidatePath } from "next/cache";
import { orochia } from "@/lib/orochia";

/** Moves a content report through triage. */
export async function updateReport(formData: FormData) {
  await orochia(`/api/admin/reports/${String(formData.get("id"))}`, {
    method: "PATCH",
    body: JSON.stringify({ status: formData.get("status") }),
  });
  revalidatePath("/moderation");
  revalidatePath("/");
}

/** Records the outcome of a creator's 2257 review. */
export async function setCreatorVerified(formData: FormData) {
  await orochia(`/api/admin/creators/${String(formData.get("id"))}`, {
    method: "PATCH",
    body: JSON.stringify({ isVerified: formData.get("isVerified") === "true" }),
  });
  revalidatePath("/compliance");
  revalidatePath("/creators");
  revalidatePath("/");
}

/** Advances a payout request (settling needs the transfer reference, failing needs a reason). */
export async function updatePayout(formData: FormData) {
  const status = String(formData.get("status"));
  const note = String(formData.get("note") ?? "").trim();
  await orochia(`/api/admin/payouts/${String(formData.get("id"))}`, {
    method: "PATCH",
    body: JSON.stringify({
      status,
      ...(status === "SETTLED" ? { txHashOrReference: note } : {}),
      ...(status === "FAILED" ? { failureReason: note } : {}),
    }),
  });
  revalidatePath("/treasury");
  revalidatePath("/");
}

/** Takes a video down with a recorded reason (DMCA, terms, a confirmed report), or restores it. */
export async function moderateVideo(formData: FormData) {
  const action = String(formData.get("action"));
  await orochia(`/api/admin/videos/${String(formData.get("id"))}`, {
    method: "PATCH",
    body: JSON.stringify(action === "remove" ? { action, reason: String(formData.get("reason") ?? "").trim() } : { action }),
  });
  revalidatePath("/catalogue");
  revalidatePath("/moderation");
  revalidatePath("/");
}

/** Suspends or reinstates an account, or changes its role. */
export async function manageUser(formData: FormData) {
  const action = String(formData.get("action"));
  const body =
    action === "suspend"
      ? { action, reason: String(formData.get("reason") ?? "").trim() }
      : action === "set-role"
        ? { action, role: String(formData.get("role")) }
        : { action };
  await orochia(`/api/admin/users/${String(formData.get("id"))}`, { method: "PATCH", body: JSON.stringify(body) });
  revalidatePath("/users");
  revalidatePath("/creators");
}
