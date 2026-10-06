import Link from "next/link";
import { orochia, money } from "@/lib/orochia";
import { PageTitle, Stat } from "@/components/ui";

interface Overview {
  treasury: {
    grossCents: number;
    platformFeeCents: number;
    creatorNetCents: number;
    creditsCount: number;
    payoutsRequestedCents: number;
    payoutsSettledCents: number;
    protocolRakePercent: number;
  };
  catalogue: { videosByStatus: Record<string, number>; totalViews: number };
  queues: { openReports: number; creatorsAwaitingVerification: number; payoutsInProgress: number };
}

export default async function OverviewPage() {
  const { data } = await orochia<{ data: Overview }>("/api/admin/overview");
  const { treasury: t, catalogue: c, queues: q } = data;
  const queues = [
    { href: "/moderation", label: "Open content reports", value: q.openReports, urgent: q.openReports > 0 },
    { href: "/compliance", label: "Creators awaiting 2257 verification", value: q.creatorsAwaitingVerification, urgent: false },
    { href: "/treasury", label: "Payouts in progress", value: q.payoutsInProgress, urgent: false },
  ];
  return (
    <div>
      <PageTitle title="Overview" subtitle="Live figures from the Orochia ledger and catalogue" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {queues.map((queue) => (
          <Link
            key={queue.href}
            href={queue.href}
            className={`rounded-2xl border p-5 transition-colors hover:bg-zinc-900 ${
              queue.urgent ? "border-rose-500/40 bg-rose-950/20" : "border-white/10 bg-zinc-900/60"
            }`}
          >
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">{queue.label}</span>
            <p className={`mt-2 text-3xl font-black font-mono ${queue.urgent ? "text-rose-300" : "text-white"}`}>{queue.value}</p>
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Gross volume" value={money(t.grossCents)} hint={`${t.creditsCount} payments`} />
        <Stat label="Platform fees" value={money(t.platformFeeCents)} hint={`${t.protocolRakePercent}% of gross`} tone="text-emerald-400" />
        <Stat label="Ready videos" value={c.videosByStatus.READY ?? 0} hint={`${(c.videosByStatus.PROCESSING ?? 0) + (c.videosByStatus.PENDING_UPLOAD ?? 0)} in the pipeline`} />
        <Stat label="Total views" value={c.totalViews.toLocaleString("en-US")} />
      </div>
    </div>
  );
}
