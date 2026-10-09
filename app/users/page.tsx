import { manageUser } from "@/app/actions";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { button, cn, Empty, filter, PageTitle, Panel, td, th } from "@/components/ui";
import { day,orochia } from "@/lib/orochia";

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

export default async function UsersPage(props: { searchParams: Promise<{ role?: string; suspended?: string; q?: string }> }) {
  const searchParams = await props.searchParams;
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
          <a key={label} href={`/users${qs ? `?${qs}` : ""}`} aria-current={current === qs ? "page" : undefined} className={filter(current === qs)}>
            {label}
          </a>
        ))}
        {searchParams.role && <input type="hidden" name="role" value={searchParams.role} />}
        {searchParams.suspended && <input type="hidden" name="suspended" value={searchParams.suspended} />}
        <input name="q" defaultValue={searchParams.q ?? ""} placeholder="Username or e-mail" className="ml-auto rounded-lg border border-border-default bg-surface-2 px-3 py-1 text-xs text-fg" />
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
            <tbody className="divide-y divide-border-subtle">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className={td}>
                    <p className="font-semibold text-fg">{u.displayName}</p>
                    <p className="font-mono text-[10px] text-fg-muted">@{u.username} · {u.email}</p>
                  </td>
                  <td className={td}>
                    <span className="mr-2 font-semibold text-fg">{u.role.toLowerCase()}</span>
                    <ConfirmDialog
                      action={manageUser}
                      fields={{ id: u.id, action: "set-role" }}
                      trigger={{ label: "Change" }}
                      tone="primary"
                      title={`Change the role of @${u.username}`}
                      description={<>An administrator reaches this console and every operator action; a creator can publish once 2257-verified. The change applies on their next request.</>}
                      choice={{ name: "role", label: "New role", defaultValue: u.role, options: [{ value: "MEMBER", label: "Member" }, { value: "CREATOR", label: "Creator" }, { value: "ADMIN", label: "Administrator" }] }}
                      confirmLabel="Change the role"
                    />
                  </td>
                  <td className={cn(td, "text-[11px]")}>
                    <span className={u.isAgeVerified ? "text-success" : "text-fg-muted"}>18+</span>
                    {u.role === "CREATOR" && <span className={cn("ml-2", u.isVerified ? "text-success" : "text-warning")}>2257 {u.isVerified ? "✓" : "pending"}</span>}
                  </td>
                  <td className={cn(td, "font-mono whitespace-nowrap")}>{day(u.createdAt)}</td>
                  <td className={td}>
                    {u.suspendedAt ? <span className="text-danger">suspended — {u.suspensionReason}</span> : <span className="text-success">active</span>}
                  </td>
                  <td className={td}>
                    {u.suspendedAt ? (
                      <ConfirmDialog
                        action={manageUser}
                        fields={{ id: u.id, action: "reinstate" }}
                        trigger={{ label: "Reinstate", tone: "primary" }}
                        tone="primary"
                        title={`Reinstate @${u.username}`}
                        description={<>The account can sign in again and its listed videos come back. Auctions cancelled by the suspension stay cancelled.</>}
                        confirmLabel="Reinstate"
                      />
                    ) : (
                      <ConfirmDialog
                        action={manageUser}
                        fields={{ id: u.id, action: "suspend" }}
                        trigger={{ label: "Suspend", tone: "danger" }}
                        title={`Suspend @${u.username}`}
                        description={<>They are signed out on their next request and can no longer sign in; their videos are no longer listed and their open auctions are cancelled, with every leading bid released.</>}
                        reason={{ label: "Reason (recorded and shown to the account)", placeholder: "Terms violation: …" }}
                        confirmLabel="Suspend the account"
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
