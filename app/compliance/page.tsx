import { orochia, day } from "@/lib/orochia";
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
}

/**
 * The 18 U.S.C. § 2257 verification queue. Approving records that the creator's identity and age
 * documents were checked; until then the creator cannot open an upload session.
 */
export default async function CompliancePage() {
  const { creators } = await orochia<{ creators: Creator[] }>("/api/admin/creators?verified=false");
  return (
    <div>
      <PageTitle
        title="2257 Creator Verification"
        subtitle="Approve a creator only after their identity and age records have been checked and filed"
      />
      {creators.length === 0 ? (
        <Empty>No creator is waiting for verification.</Empty>
      ) : (
        <Panel>
          <table className="w-full">
            <thead>
              <tr>
                <th className={th}>Registered</th>
                <th className={th}>Creator</th>
                <th className={th}>E-mail</th>
                <th className={th}>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {creators.map((c) => (
                <tr key={c.id}>
                  <td className={`${td} font-mono`}>{day(c.createdAt)}</td>
                  <td className={td}>
                    <span className="font-semibold text-white">{c.displayName}</span> <span className="text-zinc-500">@{c.username}</span>
                  </td>
                  <td className={`${td} font-mono`}>{c.email}</td>
                  <td className={td}>
                    <form action={setCreatorVerified}>
                      <input type="hidden" name="id" value={c.id} />
                      <button name="isVerified" value="true" className={`${button} border-emerald-500/40 text-emerald-300`}>
                        Records verified — approve
                      </button>
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
