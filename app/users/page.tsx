import { orochia, day } from "@/lib/orochia";
import { manageUser } from "@/app/actions";
import { Empty, PageTitle, Panel, button, td, th } from "@/components/ui";

interface Account {
  id: string;
  username: string;
  email: string;
  role: "ADMIN" | "CREATOR" | "MEMBER";
  displayName: string;
  isVerified: boolean;
  isAgeVerified: boolean;
  suspendedAt: string | null;
  suspensionReason: string | null;
  createdAt: string;
}

const FILTERS = [
  ["All", ""],
  ["Members", "role=MEMBER"],
  ["Creators", "role=CREATOR"],
  ["Admins", "role=ADMIN"],
  ["Suspended", "suspended=true"],
] as const;

export default async function UsersPage({ searchParams }: { searchParams: { role?: string; suspended?: string; q?: string } }) {
  const params = new URLSearchParams();
  if (searchParams.role) params.set("role", searchParams.role);
  if (searchParams.suspended) params.set("suspended", searchParams.suspended);
  if (searchParams.q) params.set("q", searchParams.q.slice(0, 100));
  const { users } = await orochia<{ users: Account[] }>(`/api/admin/users?${params}`);
  const current = params.toString().replace(/&?q=[^&]*/, "");

  return (
    <div>
      <PageTitle
        title="Accounts"
        subtitle="Every account. A suspension blocks sign-in and refuses the account's open sessions on their next request; roles take effect immediately."
      />
      <form className="mb-4 flex flex-wrap gap-2 text-xs" action="/users">
        {FILTERS.map(([label, qs]) => (
          <a key={label} href={`/users${qs ? `?${qs}` : ""}`} className={`${button} ${current === qs ? "bg-violet-600 border-violet-500" : ""}`}>
            {label}
          </a>
        ))}
        {searchParams.role && <input type="hidden" name="role" value={searchParams.role} />}
        {searchParams.suspended && <input type="hidden" name="suspended" value={searchParams.suspended} />}
        <input name="q" defaultValue={searchParams.q ?? ""} placeholder="Username or e-mail" className="ml-auto rounded-lg border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-white" />
        <button className={button}>Search</button>
      </form>

      {users.length === 0 ? (
        <Empty>No account matches.</Empty>
      ) : (
        <Panel>
          <table className="w-full">
            <thead>
              <tr>
                <th className={th}>Account</th>
                <th className={th}>Role</th>
                <th className={th}>Checks</th>
                <th className={th}>Joined</th>
                <th className={th}>State</th>
                <th className={th}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className={td}>
                    <p className="font-semibold text-white">{u.displayName}</p>
                    <p className="font-mono text-[10px] text-zinc-500">@{u.username} · {u.email}</p>
                  </td>
                  <td className={td}>
                    <form action={manageUser} className="flex gap-1.5">
                      <input type="hidden" name="id" value={u.id} />
                      <input type="hidden" name="action" value="set-role" />
                      <select name="role" defaultValue={u.role} className="rounded-lg border border-white/10 bg-zinc-900 px-2 py-1 text-[11px] text-white">
                        <option value="MEMBER">Member</option>
                        <option value="CREATOR">Creator</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                      <button className={button}>Set</button>
                    </form>
                  </td>
                  <td className={`${td} text-[11px]`}>
                    <span className={u.isAgeVerified ? "text-emerald-400" : "text-zinc-500"}>18+</span>
                    {u.role === "CREATOR" && <span className={`ml-2 ${u.isVerified ? "text-emerald-400" : "text-amber-300"}`}>2257 {u.isVerified ? "✓" : "pending"}</span>}
                  </td>
                  <td className={`${td} font-mono whitespace-nowrap`}>{day(u.createdAt)}</td>
                  <td className={td}>
                    {u.suspendedAt ? <span className="text-rose-300">suspended — {u.suspensionReason}</span> : <span className="text-emerald-400">active</span>}
                  </td>
                  <td className={td}>
                    <form action={manageUser} className="flex gap-1.5">
                      <input type="hidden" name="id" value={u.id} />
                      {u.suspendedAt ? (
                        <button name="action" value="reinstate" className={button}>Reinstate</button>
                      ) : (
                        <>
                          <input name="reason" required minLength={3} placeholder="Reason" className="w-32 rounded-lg border border-white/10 bg-zinc-900 px-2 py-1 text-[11px] text-white" />
                          <button name="action" value="suspend" className={`${button} border-rose-500/40 hover:bg-rose-600`}>Suspend</button>
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
