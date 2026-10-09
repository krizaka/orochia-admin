import { moderateVideo, updateReport } from "@/app/actions";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { cn, Empty, filter, PageTitle, Panel, td, th } from "@/components/ui";
import { day,orochia } from "@/lib/orochia";

interface Report {
  id: string;
  videoId: string | null;
  videoTitle: string;
  reason: string;
  details: string;
  reporterEmail: string;
  status: "OPEN" | "IN_REVIEW" | "RESOLVED";
  createdAt: string;
}

const REASON: Record<string, string> = {
  UNDERAGE: "Suspected minor",
  NON_CONSENSUAL: "Non-consensual",
  DMCA_COPYRIGHT: "Copyright (DMCA)",
  TERMS_VIOLATION: "Terms violation",
  FRAUD_SCAM: "Fraud / scam",
};

export default async function ModerationPage(props: { searchParams: Promise<{ status?: string }> }) {
  const searchParams = await props.searchParams;
  const status = searchParams.status === "all" ? "" : searchParams.status ?? "OPEN";
  const { reports } = await orochia<{ reports: Report[] }>(`/api/admin/reports${status ? `?status=${status}` : ""}`);
  return (
    <div>
      <PageTitle title="Content Reports" subtitle="Suspected minors and non-consensual content are listed first" />
      <div className="mb-4 flex gap-2 text-xs">
        {["OPEN", "IN_REVIEW", "RESOLVED", "all"].map((s) => (
          <a key={s} href={`/moderation?status=${s}`} aria-current={(status || "all") === s ? "page" : undefined} className={filter((status || "all") === s)}>
            {s.replace("_", " ").toLowerCase()}
          </a>
        ))}
      </div>
      {reports.length === 0 ? (
        <Empty>No report in this state.</Empty>
      ) : (
        <Panel>
          <table className="w-full">
            <thead>
              <tr>
                <th className={th}>Received</th>
                <th className={th}>Reason</th>
                <th className={th}>Video</th>
                <th className={th}>Details</th>
                <th className={th}>Reporter</th>
                <th className={th}>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {reports.map((r) => (
                <tr key={r.id}>
                  <td className={cn(td, "font-mono whitespace-nowrap")}>{day(r.createdAt)}</td>
                  <td className={td}>
                    <span className={r.reason === "UNDERAGE" || r.reason === "NON_CONSENSUAL" ? "font-bold text-danger" : ""}>
                      {REASON[r.reason] ?? r.reason}
                    </span>
                  </td>
                  <td className={td}>
                    {r.videoId ? (
                      <a
                        className="text-accent hover:underline"
                        href={`${process.env.NEXT_PUBLIC_OROCHIA_APP_URL || "http://localhost:3000"}/watch/${r.videoId}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {r.videoTitle}
                      </a>
                    ) : (
                      r.videoTitle
                    )}
                  </td>
                  <td className={cn(td, "max-w-sm whitespace-pre-line")}>{r.details}</td>
                  <td className={cn(td, "font-mono")}>{r.reporterEmail}</td>
                  <td className={td}>
                    <div className="flex flex-wrap gap-1.5">
                      {r.status !== "IN_REVIEW" && r.status !== "RESOLVED" && (
                        <ConfirmDialog direct action={updateReport} fields={{ id: r.id, status: "IN_REVIEW" }} trigger={{ label: "Start review" }} />
                      )}
                      {r.status !== "RESOLVED" && (
                        <ConfirmDialog
                          action={updateReport}
                          fields={{ id: r.id, status: "RESOLVED" }}
                          trigger={{ label: "Resolve", tone: "primary" }}
                          tone="primary"
                          title="Resolve the report"
                          description={<>The report leaves the queue. Take the video down first if the report is founded — resolving does not touch the video.</>}
                          confirmLabel="Resolve"
                        />
                      )}
                      {r.status === "RESOLVED" && (
                        <ConfirmDialog direct action={updateReport} fields={{ id: r.id, status: "OPEN" }} trigger={{ label: "Reopen" }} />
                      )}
                    </div>
                    {r.videoId && r.status !== "RESOLVED" && (
                      <div className="mt-1.5">
                        <ConfirmDialog
                          action={moderateVideo}
                          fields={{ id: r.videoId, action: "remove" }}
                          trigger={{ label: "Take the video down", tone: "danger" }}
                          title="Take the video down"
                          description={<>“{r.videoTitle}” disappears everywhere — feed, search, profile, collections — and its playback is refused, for its author too. Its open auction is cancelled and the bid released. It can be restored from the catalogue.</>}
                          reason={{ label: "Reason (recorded)", placeholder: `Report: ${REASON[r.reason] ?? r.reason}` }}
                          confirmLabel="Take down"
                        />
                      </div>
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
