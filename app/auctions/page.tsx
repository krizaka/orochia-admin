import { orochia, day, money } from "@/lib/orochia";
import { cancelAuction } from "@/app/actions";
import { Empty, PageTitle, Panel, Stat, td, th } from "@/components/ui";
import { ConfirmDialog } from "@/components/ConfirmDialog";

interface AdminAuction {
  id: string;
  status: "OPEN" | "AWAITING_DECISION" | "SOLD" | "DECLINED" | "UNSOLD" | "CANCELLED";
  rights: "WATCH" | "DOWNLOAD";
  settlement: "CREATOR_DECIDES" | "HIGHEST_BID";
  startingPriceCents: number;
  highestBidCents: number;
  bidsCount: number;
  startsAt: string;
  endsAt: string;
  decisionDeadline: string | null;
  cancelReason: string | null;
  videoId: string;
  videoTitle: string;
  creatorUsername: string;
  leaderUsername: string | null;
}

const STATUSES = ["all", "OPEN", "AWAITING_DECISION", "SOLD", "DECLINED", "UNSOLD", "CANCELLED"] as const;
const LABEL: Record<string, string> = { all: "All", OPEN: "Open", AWAITING_DECISION: "Awaiting decision", SOLD: "Sold", DECLINED: "Declined", UNSOLD: "No bids", CANCELLED: "Cancelled" };
const TONE: Record<string, string> = {
  OPEN: "text-rose-300",
  AWAITING_DECISION: "text-amber-300",
  SOLD: "text-emerald-400",
  DECLINED: "text-zinc-400",
  UNSOLD: "text-zinc-400",
  CANCELLED: "text-zinc-500",
};

const when = (iso: string) => new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

export default async function AuctionsPage(props: { searchParams: Promise<{ status?: string }> }) {
  const { status: asked } = await props.searchParams;
  const status = (STATUSES as readonly string[]).includes(asked ?? "") ? asked! : "all";
  const [{ auctions: all }, { auctions }] = await Promise.all([
    orochia<{ auctions: AdminAuction[] }>("/api/admin/auctions"),
    status === "all" ? Promise.resolve({ auctions: null }) : orochia<{ auctions: AdminAuction[] }>(`/api/admin/auctions?status=${status}`),
  ]);
  const list = auctions ?? all;
  const count = (s: string) => all.filter((a) => a.status === s).length;
  const soldVolume = all.filter((a) => a.status === "SOLD").reduce((sum, a) => sum + a.highestBidCents, 0);
  const held = all.filter((a) => a.status === "OPEN" || a.status === "AWAITING_DECISION").reduce((sum, a) => sum + a.highestBidCents, 0);
  const appUrl = process.env.NEXT_PUBLIC_OROCHIA_APP_URL || "http://localhost:3000";

  return (
    <div>
      <PageTitle
        title="Auctions"
        subtitle="Every auction, its money and its outcome. Bids are credits held while they lead; cancelling an auction releases the leading bid and gives the video its previous audience back."
      />
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Stat label="Open" value={count("OPEN")} tone="text-rose-300" />
        <Stat label="Awaiting decision" value={count("AWAITING_DECISION")} tone="text-amber-300" />
        <Stat label="Sold" value={count("SOLD")} tone="text-emerald-400" />
        <Stat label="Sales volume" value={money(soldVolume)} hint="winning bids, gross" />
        <Stat label="Credits held" value={money(held)} hint="behind leading bids" />
      </div>

      <nav aria-label="Filter by status" className="mb-4 flex flex-wrap gap-1.5">
        {STATUSES.map((s) => (
          <a
            key={s}
            href={s === "all" ? "/auctions" : `/auctions?status=${s}`}
            aria-current={status === s ? "page" : undefined}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${status === s ? "border-violet-500 bg-violet-600 text-white" : "border-white/10 text-zinc-400 hover:border-white/25 hover:text-white"}`}
          >
            {LABEL[s]}
            {s !== "all" && <span className="ml-1.5 font-mono text-[10px] opacity-70">{count(s)}</span>}
          </a>
        ))}
      </nav>

      {list.length === 0 ? (
        <Empty>No auction {status === "all" ? "yet" : `in “${LABEL[status]}”`}.</Empty>
      ) : (
        <Panel>
          <table className="w-full">
            <thead>
              <tr>
                <th className={th}>Video</th>
                <th className={th}>Creator</th>
                <th className={th}>Status</th>
                <th className={th}>Price</th>
                <th className={th}>Bids · leader</th>
                <th className={th}>Window</th>
                <th className={th}>Terms</th>
                <th className={th}>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {list.map((a) => (
                <tr key={a.id}>
                  <td className={td}>
                    <a className="text-violet-400 hover:underline" href={`${appUrl}/watch/${a.videoId}#auction`} target="_blank" rel="noreferrer">
                      {a.videoTitle}
                    </a>
                    {a.cancelReason && <p className="mt-0.5 text-[10px] text-zinc-500">cancelled — {a.cancelReason}</p>}
                  </td>
                  <td className={`${td} font-mono`}>@{a.creatorUsername}</td>
                  <td className={`${td} font-semibold ${TONE[a.status]}`}>
                    {LABEL[a.status]}
                    {a.decisionDeadline && <p className="font-mono text-[10px] font-normal text-zinc-500">by {when(a.decisionDeadline)}</p>}
                  </td>
                  <td className={`${td} font-mono`}>
                    <span className="font-bold text-white">{money(a.bidsCount > 0 ? a.highestBidCents : a.startingPriceCents)}</span>
                    <p className="text-[10px] text-zinc-500">from {money(a.startingPriceCents)}</p>
                  </td>
                  <td className={`${td} font-mono`}>
                    {a.bidsCount}
                    {a.leaderUsername && <span className="text-zinc-400"> · @{a.leaderUsername}</span>}
                  </td>
                  <td className={`${td} whitespace-nowrap font-mono text-[11px]`}>
                    {when(a.startsAt)}
                    <p className="text-zinc-500">→ {when(a.endsAt)}</p>
                  </td>
                  <td className={`${td} text-[11px]`}>
                    {a.rights === "DOWNLOAD" ? "watch + download" : "watch"}
                    <p className="text-zinc-500">{a.settlement === "HIGHEST_BID" ? "sells automatically" : "creator decides"}</p>
                  </td>
                  <td className={td}>
                    {(a.status === "OPEN" || a.status === "AWAITING_DECISION") && (
                      <ConfirmDialog
                        action={cancelAuction}
                        fields={{ id: a.id }}
                        trigger={{ label: "Cancel", tone: "danger" }}
                        title="Cancel the auction"
                        description={
                          <>
                            “{a.videoTitle}” by @{a.creatorUsername} stops now.{" "}
                            {a.bidsCount > 0 ? <>The leading bid ({money(a.highestBidCents)}{a.leaderUsername ? ` by @${a.leaderUsername}` : ""}) is released to its bidder, who is notified.</> : <>Nobody has bid yet.</>}{" "}
                            The video gets its previous audience back. This cannot be undone.
                          </>
                        }
                        reason={{ label: "Reason (recorded)", placeholder: "Reported content under review…" }}
                        confirmLabel="Cancel the auction"
                      />
                    )}
                    {a.status !== "OPEN" && a.status !== "AWAITING_DECISION" && <span className="text-[11px] text-zinc-600">{day(a.endsAt)}</span>}
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
