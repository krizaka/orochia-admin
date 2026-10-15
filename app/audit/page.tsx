import { AuditTable } from "@/components/AuditTable";
import { PageTitle } from "@/components/ui";
import { recentAudit } from "@/lib/account";

/** The operator log: every decision and sign-in of this console, newest first (the last 500). */
export default async function AuditPage() {
  const rows = await recentAudit(500);
  return (
    <div>
      <PageTitle title="Audit log" subtitle="Every decision and sign-in of this console, kept in its own database — who did what, to what, and whether Orochia accepted it." />
      <AuditTable rows={rows.map((r, i) => ({ id: `${new Date(r.at).getTime()}-${i}`, at: new Date(r.at).toISOString(), action: r.action, target: r.target, ok: r.ok, detail: r.detail }))} />
    </div>
  );
}
