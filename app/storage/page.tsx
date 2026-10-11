import { HardDrive, RefreshCw, ShieldCheck, Users } from "lucide-react";

import { reconcileStorage, setStoragePlan } from "@/app/actions";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { cn, Empty, PageTitle, Panel, Stat, strong, td, th, type Tone } from "@/components/ui";
import { orochia } from "@/lib/orochia";

type Level = "ok" | "warning" | "critical" | "full" | "unlimited";

interface Allowance {
  bytes: number | null;
  seconds: number | null;
}

interface Snapshot {
  takenAt: string;
  libraryBytes: number;
  libraryVideos: number;
  zoneBytes: number | null;
  zoneFiles: number | null;
  appBytes: number;
  orphanBytes: number;
  orphanVideos: number;
  missingVideos: number;
  updatedRows: number;
}

interface StorageOverview {
  enabled: boolean;
  platform: {
    used: { bytes: number; seconds: number };
    orphanBytes: number;
    limit: Allowance;
    percent: number | null;
    percentSeconds: number | null;
    level: Level;
    alertThresholds: number[];
  };
  plans: Record<string, Allowance>;
  adminPlan: string;
  perFile: Record<"video" | "story" | "draft", { maxBytes: number; maxSeconds: number }>;
  uploadsPerDay: number | null;
  concurrentUploads: number | null;
  imageUploadsPerDay: number | null;
  topCreators: {
    id: string;
    username: string;
    displayName: string | null;
    role: string;
    plan: string;
    usedBytes: number;
    usedSeconds: number;
    limitBytes: number | null;
    percent: number | null;
    held: number;
  }[];
  lastReconciliation: Snapshot | null;
}

interface Defences {
  rateLimitStore: string;
  challenge: { mode: string; active: boolean } | { error: string };
}

const size = (bytes: number | null) =>
  bytes === null
    ? "unlimited"
    : bytes >= 1024 ** 4
      ? `${(bytes / 1024 ** 4).toFixed(2)} TB`
      : bytes >= 1024 ** 3
        ? `${(bytes / 1024 ** 3).toFixed(1)} GB`
        : `${Math.round(bytes / 1024 ** 2)} MB`;
const minutes = (seconds: number | null) => (seconds === null ? "unlimited" : `${Math.round(seconds / 60).toLocaleString("en-US")} min`);
const when = (iso: string) => new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

const LEVEL: Record<Level, { label: string; tone: Tone }> = {
  ok: { label: "Room to grow", tone: "success" },
  warning: { label: "Above 80 %", tone: "warning" },
  critical: { label: "Above 95 %", tone: "danger" },
  full: { label: "Full — uploads refused", tone: "danger" },
  unlimited: { label: "No cap", tone: "warning" },
};

/** Storage and abuse defences: what Orochia keeps at Bunny against its cap, the largest accounts and their plans, the last reconciliation. */
export default async function StoragePage() {
  const { storage: s, defences } = await orochia<{ storage: StorageOverview; defences: Defences }>("/api/admin/storage?top=25");
  const p = s.platform;
  const level = LEVEL[s.enabled ? p.level : "unlimited"];
  const planChoices = Object.keys(s.plans).map((name) => ({ value: name, label: `${name} — ${size(s.plans[name].bytes)}${s.plans[name].seconds !== null ? `, ${minutes(s.plans[name].seconds)}` : ""}` }));
  const challenge = "error" in defences.challenge ? `misconfigured: ${defences.challenge.error}` : defences.challenge.active ? `on (${defences.challenge.mode})` : `off (${defences.challenge.mode})`;
  const last = s.lastReconciliation;

  return (
    <div>
      <PageTitle
        title="Storage & abuse"
        subtitle="What Orochia keeps at Bunny against the platform's cap, the accounts that hold the most and their plans, the last reconciliation with Bunny — and the state of the abuse defences."
        actions={
          <ConfirmDialog
            action={reconcileStorage}
            trigger={{ label: "Reconcile with Bunny", tone: "primary", icon: <RefreshCw className="h-3.5 w-3.5" aria-hidden /> }}
            tone="primary"
            title="Reconcile with Bunny"
            description="Lists the Stream library at Bunny, corrects the size of every video, story and draft, zeroes the ones Bunny no longer has and counts the videos no row knows (orphans). Nothing is deleted. Runs by itself every few hours."
            confirmLabel="Reconcile"
          />
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Platform storage" value={size(p.used.bytes)} hint={s.enabled ? `of ${size(p.limit.bytes)}${p.percent !== null ? ` · ${p.percent} %` : ""}` : "limits are off on this deployment"} tone={level.tone} />
        <Stat label="Video time" value={minutes(p.used.seconds)} hint={`of ${minutes(p.limit.seconds)}`} />
        <Stat label="State" value={level.label} hint={`alerts at ${p.alertThresholds.join(" % and ")} %`} tone={level.tone} />
        <Stat label="Orphans at Bunny" value={size(p.orphanBytes)} hint={last ? `${last.orphanVideos} video(s) no row knows` : "no reconciliation yet"} tone={p.orphanBytes > 0 ? "warning" : "default"} />
      </div>

      {s.enabled && p.limit.bytes !== null && (
        <Panel className="mb-8">
          {/* The console's @krizaka/ui (2.0.0-beta.1) has no Progress yet: a bar from the role tokens, with its ARIA. */}
          <div
            role="progressbar"
            aria-label="Platform storage used"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.min(100, Math.round(p.percent ?? 0))}
            aria-valuetext={`${size(p.used.bytes)} of ${size(p.limit.bytes)}`}
            className="h-2 w-full overflow-hidden rounded-full bg-surface-3"
          >
            <div className={cn("h-full rounded-full", level.tone === "danger" ? "bg-danger" : level.tone === "warning" ? "bg-warning" : "bg-accent")} style={{ width: `${Math.min(100, Math.max(1, p.percent ?? 0))}%` }} />
          </div>
          <p className="mt-3 text-xs text-fg-secondary">
            Past 100 %, new uploads are refused for everyone (<span className="font-mono">PLATFORM_STORAGE_FULL</span>); raise{" "}
            <span className="font-mono">QUOTA_PLATFORM_GB</span> on the deployment or free space. Withdrawn videos and expired stories still count here: their files stay at Bunny.
          </p>
        </Panel>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section aria-labelledby="accounts-title">
          <h2 id="accounts-title" className="mb-3 flex items-center gap-2 text-sm font-bold text-fg">
            <Users className="h-4 w-4 text-accent" aria-hidden /> Largest accounts
          </h2>
          {s.topCreators.length === 0 ? (
            <Empty>Nobody keeps anything at Bunny yet.</Empty>
          ) : (
            <Panel>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className={th}>Account</th>
                    <th className={th}>Plan</th>
                    <th className={th}>Used</th>
                    <th className={th}>Video time</th>
                    <th className={th}>Held</th>
                    <th className={th}>Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {s.topCreators.map((c) => (
                    <tr key={c.id}>
                      <td className={td}>
                        <span className={strong}>{c.displayName ?? c.username}</span>
                        <span className="block font-mono text-[11px] text-fg-muted">@{c.username} · {c.role.toLowerCase()}</span>
                      </td>
                      <td className={cn(td, "font-mono")}>{c.plan}</td>
                      <td className={cn(td, "whitespace-nowrap font-mono")}>
                        {size(c.usedBytes)}
                        <span className={cn("block text-[11px]", c.percent !== null && c.percent >= 95 ? "text-danger" : c.percent !== null && c.percent >= 80 ? "text-warning" : "text-fg-muted")}>
                          {c.limitBytes === null ? "no limit" : `of ${size(c.limitBytes)} · ${c.percent} %`}
                        </span>
                      </td>
                      <td className={cn(td, "whitespace-nowrap font-mono")}>{minutes(c.usedSeconds)}</td>
                      <td className={cn(td, c.held ? "font-semibold text-warning" : "text-fg-muted")}>{c.held || "—"}</td>
                      <td className={td}>
                        <ConfirmDialog
                          action={setStoragePlan}
                          fields={{ id: c.id }}
                          trigger={{ label: "Change", tone: "secondary" }}
                          tone="primary"
                          title={`Storage plan of @${c.username}`}
                          description={<>Sets how much this account may keep at Bunny. <span className="font-mono">default</span> is the role&apos;s plan; <span className="font-mono">unlimited</span> lifts the account&apos;s limit, never the platform&apos;s cap. Uploads held for want of space go online if they fit.</>}
                          choice={{ name: "plan", label: "Plan", options: [{ value: "default", label: "default — the role's plan" }, ...planChoices.filter((o) => o.value !== "default")], defaultValue: c.plan }}
                          confirmLabel="Set the plan"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          )}
        </section>

        <div className="space-y-6">
          <section aria-labelledby="reconcile-title">
            <h2 id="reconcile-title" className="mb-3 flex items-center gap-2 text-sm font-bold text-fg">
              <HardDrive className="h-4 w-4 text-accent" aria-hidden /> Last reconciliation
            </h2>
            {!last ? (
              <Empty>Never reconciled with Bunny yet.</Empty>
            ) : (
              <Panel>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                  <dt className="text-fg-muted">When</dt>
                  <dd className="font-mono text-fg">{when(last.takenAt)}</dd>
                  <dt className="text-fg-muted">Bunny library</dt>
                  <dd className="font-mono text-fg">{size(last.libraryBytes)} · {last.libraryVideos} videos</dd>
                  <dt className="text-fg-muted">Counted by Orochia</dt>
                  <dd className="font-mono text-fg">{size(last.appBytes)}</dd>
                  <dt className="text-fg-muted">Rows corrected</dt>
                  <dd className="font-mono text-fg">{last.updatedRows}</dd>
                  <dt className="text-fg-muted">Missing at Bunny</dt>
                  <dd className="font-mono text-fg">{last.missingVideos}</dd>
                  <dt className="text-fg-muted">Orphans</dt>
                  <dd className="font-mono text-fg">{last.orphanVideos} · {size(last.orphanBytes)}</dd>
                  {last.zoneBytes !== null && (
                    <>
                      <dt className="text-fg-muted">Storage zone</dt>
                      <dd className="font-mono text-fg">{size(last.zoneBytes)} · {last.zoneFiles ?? "?"} files</dd>
                    </>
                  )}
                </dl>
              </Panel>
            )}
          </section>

          <section aria-labelledby="limits-title">
            <h2 id="limits-title" className="mb-3 flex items-center gap-2 text-sm font-bold text-fg">
              <ShieldCheck className="h-4 w-4 text-accent" aria-hidden /> Limits & defences
            </h2>
            <Panel>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                <dt className="text-fg-muted">Plans</dt>
                <dd className="font-mono text-fg">{planChoices.map((o) => o.label).join(" · ")}</dd>
                <dt className="text-fg-muted">Owner (ADMIN)</dt>
                <dd className="font-mono text-fg">{s.adminPlan}</dd>
                <dt className="text-fg-muted">Per file</dt>
                <dd className="font-mono text-fg">video {size(s.perFile.video.maxBytes)} · story {size(s.perFile.story.maxBytes)} · draft {size(s.perFile.draft.maxBytes)}</dd>
                <dt className="text-fg-muted">Uploads</dt>
                <dd className="font-mono text-fg">{s.uploadsPerDay ?? "∞"} / day · {s.concurrentUploads ?? "∞"} at once · {s.imageUploadsPerDay ?? "∞"} pictures / day</dd>
                <dt className="text-fg-muted">Rate limits</dt>
                <dd className={cn("font-mono", defences.rateLimitStore === "postgres" ? "text-success" : "text-warning")}>
                  {defences.rateLimitStore}{defences.rateLimitStore === "memory" ? " — one instance only" : " — shared"}
                </dd>
                <dt className="text-fg-muted">Bot challenge</dt>
                <dd className={cn("font-mono", challenge.startsWith("on") ? "text-success" : "text-warning")}>{challenge}</dd>
              </dl>
            </Panel>
          </section>
        </div>
      </div>
    </div>
  );
}
