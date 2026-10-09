import { setCreatorVerified } from "@/app/actions";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { cn, Empty, PageTitle, Panel, td, th } from "@/components/ui";
import { day,orochia } from "@/lib/orochia";

interface Creator {
  id: string;
  username: string;
  email: string;
  displayName: string;
  isVerified: boolean;
  createdAt: string;
  videosCount: number;
}

/**
 * The 18 U.S.C. § 2257 verification queue. Approving records that the creator's identity and age
 * documents were checked; until then the creator cannot open an upload session.
 */
export default async function CompliancePage() {
  const { creators } = await orochia<{ creators: Creator[] }>("/api/admin/creators?verified=false");
  return (
    <div>
      <PageTitle
        title="2257 Creator Verification"
        subtitle="Approve a creator only after their identity and age records have been checked and filed"
      />
      {creators.length === 0 ? (
        <Empty>No creator is waiting for verification.</Empty>
      ) : (
        <Panel>
          <table className="w-full">
            <thead>
              <tr>
                <th className={th}>Registered</th>
                <th className={th}>Creator</th>
                <th className={th}>E-mail</th>
                <th className={th}>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {creators.map((c) => (
                <tr key={c.id}>
                  <td className={cn(td, "font-mono")}>{day(c.createdAt)}</td>
                  <td className={td}>
                    <span className="font-semibold text-fg">{c.displayName}</span> <span className="text-fg-muted">@{c.username}</span>
                  </td>
                  <td className={cn(td, "font-mono")}>{c.email}</td>
                  <td className={td}>
                    <ConfirmDialog
                      action={setCreatorVerified}
                      fields={{ id: c.id, isVerified: "true" }}
                      trigger={{ label: "Records verified — approve", tone: "primary" }}
                      tone="primary"
                      title={`Approve @${c.username}`}
                      description={<>Confirm that the identity document, the age and the consent records match (18 U.S.C. § 2257). The creator can upload from now on; the decision is logged.</>}
                      confirmLabel="Approve the creator"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </div>
  );
}
