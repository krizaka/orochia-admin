import { orochia, day, money } from "@/lib/orochia";
import { updatePayout } from "@/app/actions";
import { Empty, PageTitle, Panel, Stat, button, td, th } from "@/components/ui";

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
        <Stat label="Platform fees" value={money(t.platformFeeCents)} hint={`${t.protocolRakePercent}% of gross`} tone="text-emerald-400" />
        <Stat label="Creator earnings" value={money(t.creatorNetCents)} hint="net of fees" />
        <Stat label="Payouts in progress" value={money(t.payoutsRequestedCents)} tone="text-amber-300" />
        <Stat label="Payouts settled" value={money(t.payoutsSettledCents)} />
      </div>

      <h2 className="mb-3 text-sm font-bold text-white">Payouts to process ({open.length})</h2>
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
            <tbody className="divide-y divide-white/5">
              {open.map((p) => (
                <tr key={p.id}>
                  <td className={`${td} font-mono`}>{day(p.createdAt)}</td>
                  <td className={td}>@{p.creatorUsername}</td>
                  <td className={`${td} font-mono font-bold text-white`}>{money(p.amountCents)}</td>
                  <td className={`${td} font-mono break-all`}>{p.payoutMethod} · {p.payoutDestination}</td>
                  <td className={td}>{p.status.replace(/_/g, " ").toLowerCase()}</td>
                  <td className={td}>
                    <form action={updatePayout} className="flex flex-wrap gap-1.5">
                      <input type="hidden" name="id" value={p.id} />
                      <input
                        name="note"
                        placeholder="Transfer ref. / failure reason"
                        className="w-44 rounded-lg border border-white/10 bg-zinc-950 px-2 py-1 text-[11px] text-white"
                      />
                      {p.status === "REQUESTED" && <button name="status" value="UNDER_REVIEW" className={button}>Review</button>}
                      <button name="status" value="SETTLED" className={`${button} text-emerald-300`}>Mark settled</button>
                      <button name="status" value="FAILED" className={`${button} text-rose-300`}>Fail (refund)</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}

      {closed.length > 0 && (
        <>
          <h2 className="mt-10 mb-3 text-sm font-bold text-white">History</h2>
          <Panel>
            <table className="w-full">
              <tbody className="divide-y divide-white/5">
                {closed.map((p) => (
                  <tr key={p.id}>
                    <td className={`${td} font-mono`}>{day(p.createdAt)}</td>
                    <td className={td}>@{p.creatorUsername}</td>
                    <td className={`${td} font-mono`}>{money(p.amountCents)}</td>
                    <td className={td}>{p.status.toLowerCase()}</td>
                    <td className={`${td} font-mono break-all`}>{p.txHashOrReference ?? p.failureReason ?? ""}</td>
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
