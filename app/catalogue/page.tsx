import { orochia, day } from "@/lib/orochia";
import { moderateVideo } from "@/app/actions";
import { Empty, PageTitle, Panel, Stat, button, td, th } from "@/components/ui";

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
        <Stat label="Ready" value={s.READY ?? 0} tone="text-emerald-400" />
        <Stat label="Processing" value={s.PROCESSING ?? 0} />
        <Stat label="Awaiting upload" value={s.PENDING_UPLOAD ?? 0} />
        <Stat label="Failed" value={s.FAILED ?? 0} tone="text-rose-300" />
        <Stat label="Total views" value={data.totalViews.toLocaleString("en-US")} />
      </div>

      <form className="mb-4 flex flex-wrap gap-2 text-xs" action="/catalogue">
        {STATES.map((st) => (
          <a key={st} href={`/catalogue?state=${st}${q ? `&q=${encodeURIComponent(q)}` : ""}`} className={`${button} ${state === st ? "bg-violet-600 border-violet-500" : ""}`}>
            {st}
          </a>
        ))}
        <input type="hidden" name="state" value={state} />
        <input name="q" defaultValue={q} placeholder="Title or creator" className="ml-auto rounded-lg border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-white" />
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
            <tbody className="divide-y divide-white/5">
              {videos.map((v) => (
                <tr key={v.id}>
                  <td className={td}>
                    <a className="text-violet-400 hover:underline" href={`${appUrl}/watch/${v.id}`} target="_blank" rel="noreferrer">{v.title}</a>
                    <p className="text-[10px] font-mono text-zinc-500">{day(v.createdAt)} · {v.visibility.replace(/_/g, " ").toLowerCase()}</p>
                  </td>
                  <td className={`${td} font-mono`}>@{v.creatorUsername}</td>
                  <td className={td}>
                    {v.removedAt ? (
                      <span className="text-rose-300">taken down — {v.removalReason}</span>
                    ) : (
                      <span className={v.status === "READY" ? "text-emerald-400" : "text-zinc-400"}>{v.status.replace(/_/g, " ").toLowerCase()}</span>
                    )}
                  </td>
                  <td className={`${td} font-mono ${v.openReports > 0 ? "font-bold text-rose-300" : ""}`}>{v.openReports}</td>
                  <td className={`${td} font-mono`}>{v.viewsCount.toLocaleString("en-US")}</td>
                  <td className={td}>
                    <form action={moderateVideo} className="flex gap-1.5">
                      <input type="hidden" name="id" value={v.id} />
                      {v.removedAt ? (
                        <button name="action" value="restore" className={button}>Restore</button>
                      ) : (
                        <>
                          <input name="reason" required minLength={3} placeholder="Reason" className="w-36 rounded-lg border border-white/10 bg-zinc-900 px-2 py-1 text-[11px] text-white" />
                          <button name="action" value="remove" className={`${button} border-rose-500/40 hover:bg-rose-600`}>Take down</button>
                        </>
                      )}
                    </form>
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
