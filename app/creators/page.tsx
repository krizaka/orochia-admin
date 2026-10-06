import { orochia, day, money } from "@/lib/orochia";
import { setCreatorVerified } from "@/app/actions";
import { Empty, PageTitle, Panel, button, td, th } from "@/components/ui";

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
            <tbody className="divide-y divide-white/5">
              {creators.map((c) => (
                <tr key={c.id}>
                  <td className={td}>
                    <span className="font-semibold text-white">{c.displayName}</span>
                    <span className="block text-zinc-500 font-mono">@{c.username} · {c.email}</span>
                  </td>
                  <td className={`${td} font-mono`}>{day(c.createdAt)}</td>
                  <td className={`${td} font-mono`}>{c.videosCount}</td>
                  <td className={`${td} font-mono`}>{money(c.totalTipsEarnedCents)}</td>
                  <td className={td}>{c.isVerified ? <span className="text-emerald-400">verified</span> : <span className="text-amber-300">pending</span>}</td>
                  <td className={td}>
                    <form action={setCreatorVerified}>
                      <input type="hidden" name="id" value={c.id} />
                      {c.isVerified ? (
                        <button name="isVerified" value="false" className={`${button} text-rose-300`}>Suspend uploads</button>
                      ) : (
                        <button name="isVerified" value="true" className={`${button} text-emerald-300`}>Approve</button>
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
