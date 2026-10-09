import { updatePayout } from "@/app/actions";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { cn, Empty, PageTitle, Panel, Stat, td, th } from "@/components/ui";
import { day, money,orochia } from "@/lib/orochia";

interface Treasury {
  protocolRakePercent: number;
  grossCents: number;
  platformFeeCents: number;
  creatorNetCents: number;
  creditsCount: number;
  payoutsRequestedCents: number;
  payoutsSettledCents: number;
}

interface Payout {
  id: string;
  amountCents: number;
  status: string;
  payoutMethod: string;
  payoutDestination: string;
  txHashOrReference: string | null;
  failureReason: string | null;
  createdAt: string;
  creatorUsername: string;
}

export default async function TreasuryPage() {
  const [{ data: t }, { payouts }] = await Promise.all([
    orochia<{ data: Treasury }>("/api/platform/treasury"),
    orochia<{ payouts: Payout[] }>("/api/admin/payouts"),
  ]);
  const open = payouts.filter((p) => !["SETTLED", "FAILED"].includes(p.status));
  const closed = payouts.filter((p) => ["SETTLED", "FAILED"].includes(p.status));

  return (
    <div>
      <PageTitle title="Treasury & Payouts" subtitle="Figures computed from the ledger; payouts are settled by an operator" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <Stat label="Gross volume" value={money(t.grossCents)} hint={`${t.creditsCount} payments`} />
        <Stat label="Platform fees" value={money(t.platformFeeCents)} hint={`${t.protocolRakePercent}% of gross`} tone="success" />
        <Stat label="Creator earnings" value={money(t.creatorNetCents)} hint="net of fees" />
        <Stat label="Payouts in progress" value={money(t.payoutsRequestedCents)} tone="warning" />
        <Stat label="Payouts settled" value={money(t.payoutsSettledCents)} />
      </div>

      <h2 className="mb-3 text-sm font-bold text-fg">Payouts to process ({open.length})</h2>
      {open.length === 0 ? (
        <Empty>No payout waiting.</Empty>
      ) : (
        <Panel>
          <table className="w-full">
            <thead>
              <tr>
                <th className={th}>Requested</th>
                <th className={th}>Creator</th>
                <th className={th}>Amount</th>
                <th className={th}>Method · destination</th>
                <th className={th}>Status</th>
                <th className={th}>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {open.map((p) => (
                <tr key={p.id}>
                  <td className={cn(td, "font-mono")}>{day(p.createdAt)}</td>
                  <td className={td}>@{p.creatorUsername}</td>
                  <td className={cn(td, "font-mono font-bold text-fg")}>{money(p.amountCents)}</td>
                  <td className={cn(td, "font-mono break-all")}>{p.payoutMethod} · {p.payoutDestination}</td>
                  <td className={td}>{p.status.replace(/_/g, " ").toLowerCase()}</td>
                  <td className={td}>
                    <div className="flex flex-wrap gap-1.5">
                      {p.status === "REQUESTED" && (
                        <ConfirmDialog direct action={updatePayout} fields={{ id: p.id, status: "UNDER_REVIEW" }} trigger={{ label: "Review" }} />
                      )}
                      <ConfirmDialog
                        action={updatePayout}
                        fields={{ id: p.id, status: "SETTLED" }}
                        trigger={{ label: "Mark settled", tone: "primary" }}
                        tone="primary"
                        title={`Settle ${money(p.amountCents)} to @${p.creatorUsername}`}
                        description={<>Confirm that the transfer was sent to {p.payoutMethod} · <span className="font-mono">{p.payoutDestination}</span>. This closes the payout for good.</>}
                        reason={{ label: "Transfer reference", placeholder: "Bank reference, transaction hash…" }}
                        confirmLabel="Mark settled"
                      />
                      <ConfirmDialog
                        action={updatePayout}
                        fields={{ id: p.id, status: "FAILED" }}
                        trigger={{ label: "Fail (refund)", tone: "danger" }}
                        title={`Fail the payout of @${p.creatorUsername}`}
                        description={<>{money(p.amountCents)} goes back to the creator&apos;s available balance; they can request it again. The reason is shown to them.</>}
                        reason={{ label: "Reason", placeholder: "Account details rejected by the bank…" }}
                        confirmLabel="Fail the payout"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}

      {closed.length > 0 && (
        <>
          <h2 className="mt-10 mb-3 text-sm font-bold text-fg">History</h2>
          <Panel>
            <table className="w-full">
              <tbody className="divide-y divide-border-subtle">
                {closed.map((p) => (
                  <tr key={p.id}>
                    <td className={cn(td, "font-mono")}>{day(p.createdAt)}</td>
                    <td className={td}>@{p.creatorUsername}</td>
                    <td className={cn(td, "font-mono")}>{money(p.amountCents)}</td>
                    <td className={td}>{p.status.toLowerCase()}</td>
                    <td className={cn(td, "font-mono break-all")}>{p.txHashOrReference ?? p.failureReason ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </>
      )}
    </div>
  );
}
