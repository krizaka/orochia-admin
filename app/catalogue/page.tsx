import { moderateVideo } from "@/app/actions";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { button, cn, Empty, filter, PageTitle, Panel, Stat, td, th } from "@/components/ui";
import { day,orochia } from "@/lib/orochia";

interface Catalogue {
  videosByStatus: Record<string, number>;
  totalViews: number;
}

interface CatalogueVideo {
  id: string;
  title: string;
  status: string;
  visibility: string;
  creatorUsername: string;
  viewsCount: number;
  tipsCount: number;
  createdAt: string;
  removedAt: string | null;
  removalReason: string | null;
  openReports: number;
}

const STATES = ["all", "listed", "removed"] as const;

export default async function CataloguePage(props: { searchParams: Promise<{ state?: string; q?: string }> }) {
  const searchParams = await props.searchParams;
  const state = STATES.includes(searchParams.state as (typeof STATES)[number]) ? searchParams.state! : "all";
  const q = (searchParams.q ?? "").slice(0, 100);
  const params = new URLSearchParams({ state, ...(q ? { q } : {}) });
  const [{ data }, { videos }] = await Promise.all([
    orochia<{ data: Catalogue }>("/api/bunny/analytics"),
    orochia<{ videos: CatalogueVideo[] }>(`/api/admin/videos?${params}`),
  ]);
  const s = data.videosByStatus;
  const appUrl = process.env.NEXT_PUBLIC_OROCHIA_APP_URL || "http://localhost:3000";

  return (
    <div>
      <PageTitle
        title="Catalogue"
        subtitle="Every video, its encoding state and open reports. A takedown hides the video everywhere and refuses its playback; it is recorded with its reason and can be reversed."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Stat label="Ready" value={s.READY ?? 0} tone="success" />
        <Stat label="Processing" value={s.PROCESSING ?? 0} />
        <Stat label="Awaiting upload" value={s.PENDING_UPLOAD ?? 0} />
        <Stat label="Failed" value={s.FAILED ?? 0} tone="danger" />
        <Stat label="Total views" value={data.totalViews.toLocaleString("en-US")} />
      </div>

      <form className="mb-4 flex flex-wrap gap-2 text-xs" action="/catalogue">
        {STATES.map((st) => (
          <a key={st} href={`/catalogue?state=${st}${q ? `&q=${encodeURIComponent(q)}` : ""}`} aria-current={state === st ? "page" : undefined} className={filter(state === st)}>
            {st}
          </a>
        ))}
        <input type="hidden" name="state" value={state} />
        <input name="q" defaultValue={q} placeholder="Title or creator" className="ml-auto rounded-lg border border-border-default bg-surface-2 px-3 py-1 text-xs text-fg" />
        <button className={button}>Search</button>
      </form>

      {videos.length === 0 ? (
        <Empty>No video matches.</Empty>
      ) : (
        <Panel>
          <table className="w-full">
            <thead>
              <tr>
                <th className={th}>Video</th>
                <th className={th}>Creator</th>
                <th className={th}>State</th>
                <th className={th}>Reports</th>
                <th className={th}>Views</th>
                <th className={th}>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {videos.map((v) => (
                <tr key={v.id}>
                  <td className={td}>
                    <a className="text-accent hover:underline" href={`${appUrl}/watch/${v.id}`} target="_blank" rel="noreferrer">{v.title}</a>
                    <p className="text-[10px] font-mono text-fg-muted">{day(v.createdAt)} · {v.visibility.replace(/_/g, " ").toLowerCase()}</p>
                  </td>
                  <td className={cn(td, "font-mono")}>@{v.creatorUsername}</td>
                  <td className={td}>
                    {v.removedAt ? (
                      <span className="text-danger">taken down — {v.removalReason}</span>
                    ) : (
                      <span className={v.status === "READY" ? "text-success" : "text-fg-secondary"}>{v.status.replace(/_/g, " ").toLowerCase()}</span>
                    )}
                  </td>
                  <td className={cn(td, "font-mono", v.openReports > 0 ? "font-bold text-danger" : "")}>{v.openReports}</td>
                  <td className={cn(td, "font-mono")}>{v.viewsCount.toLocaleString("en-US")}</td>
                  <td className={td}>
                    {v.removedAt ? (
                      <ConfirmDialog
                        action={moderateVideo}
                        fields={{ id: v.id, action: "restore" }}
                        trigger={{ label: "Restore", tone: "primary" }}
                        tone="primary"
                        title="Restore the video"
                        description={<>“{v.title}” is listed and playable again under its own audience rules. The takedown reason is cleared.</>}
                        confirmLabel="Restore"
                      />
                    ) : (
                      <ConfirmDialog
                        action={moderateVideo}
                        fields={{ id: v.id, action: "remove" }}
                        trigger={{ label: "Take down", tone: "danger" }}
                        title="Take the video down"
                        description={<>“{v.title}” by @{v.creatorUsername} disappears everywhere and its playback is refused, for its author too. An open auction on it is cancelled and its bid released. Reversible from this screen.</>}
                        reason={{ label: "Reason (recorded)", placeholder: "DMCA notice #…, terms violation, confirmed report…" }}
                        confirmLabel="Take down"
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
