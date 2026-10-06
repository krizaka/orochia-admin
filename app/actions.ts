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
