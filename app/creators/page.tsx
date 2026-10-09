import { setCreatorVerified } from "@/app/actions";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { cn, Empty, PageTitle, Panel, td, th } from "@/components/ui";
import { day, money,orochia } from "@/lib/orochia";

interface Creator {
  id: string;
  username: string;
  email: string;
  displayName: string;
  isVerified: boolean;
  createdAt: string;
  videosCount: number;
  totalTipsEarnedCents: number;
}

export default async function CreatorsPage() {
  const { creators } = await orochia<{ creators: Creator[] }>("/api/admin/creators");
  return (
    <div>
      <PageTitle title="Creator Registry" subtitle="Every creator account, its verification state and its activity" />
      {creators.length === 0 ? (
        <Empty>No creator account yet.</Empty>
      ) : (
        <Panel>
          <table className="w-full">
            <thead>
              <tr>
                <th className={th}>Creator</th>
                <th className={th}>Registered</th>
                <th className={th}>Videos</th>
                <th className={th}>Net earned</th>
                <th className={th}>2257</th>
                <th className={th}>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {creators.map((c) => (
                <tr key={c.id}>
                  <td className={td}>
                    <span className="font-semibold text-fg">{c.displayName}</span>
                    <span className="block text-fg-muted font-mono">@{c.username} · {c.email}</span>
                  </td>
                  <td className={cn(td, "font-mono")}>{day(c.createdAt)}</td>
                  <td className={cn(td, "font-mono")}>{c.videosCount}</td>
                  <td className={cn(td, "font-mono")}>{money(c.totalTipsEarnedCents)}</td>
                  <td className={td}>{c.isVerified ? <span className="text-success">verified</span> : <span className="text-warning">pending</span>}</td>
                  <td className={td}>
                    {c.isVerified ? (
                      <ConfirmDialog
                        action={setCreatorVerified}
                        fields={{ id: c.id, isVerified: "false" }}
                        trigger={{ label: "Suspend uploads", tone: "danger" }}
                        title={`Suspend the uploads of @${c.username}`}
                        description={<>Their 2257 verification is withdrawn: they can no longer open upload sessions until an operator approves their records again. Published videos stay online.</>}
                        confirmLabel="Suspend uploads"
                      />
                    ) : (
                      <ConfirmDialog
                        action={setCreatorVerified}
                        fields={{ id: c.id, isVerified: "true" }}
                        trigger={{ label: "Approve", tone: "primary" }}
                        tone="primary"
                        title={`Approve @${c.username}`}
                        description={<>Confirm that their 18 U.S.C. § 2257 records were checked: they can upload videos and stories from now on.</>}
                        confirmLabel="Records checked — approve"
                      />
                    )}
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
