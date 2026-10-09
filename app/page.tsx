import Link from "next/link";

import { cn, PageTitle, Stat } from "@/components/ui";
import { money,orochia } from "@/lib/orochia";

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
            className={cn("rounded-xl border p-5 shadow-md transition-colors hover:border-border-strong", queue.urgent ? "border-danger/40 bg-danger/10" : "border-border-default bg-surface-2")}
          >
            <span className="text-[11px] font-mono uppercase tracking-wider text-fg-secondary">{queue.label}</span>
            <p className={cn("mt-2 font-display text-3xl font-black tabular-nums", queue.urgent ? "text-danger" : "text-fg")}>{queue.value}</p>
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Gross volume" value={money(t.grossCents)} hint={`${t.creditsCount} payments`} />
        <Stat label="Platform fees" value={money(t.platformFeeCents)} hint={`${t.protocolRakePercent}% of gross`} tone="success" />
        <Stat label="Ready videos" value={c.videosByStatus.READY ?? 0} hint={`${(c.videosByStatus.PROCESSING ?? 0) + (c.videosByStatus.PENDING_UPLOAD ?? 0)} in the pipeline`} />
        <Stat label="Total views" value={c.totalViews.toLocaleString("en-US")} />
      </div>
    </div>
  );
}
