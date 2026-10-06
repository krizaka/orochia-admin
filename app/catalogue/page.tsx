import { orochia } from "@/lib/orochia";
import { PageTitle, Stat } from "@/components/ui";

interface Catalogue {
  videosByStatus: Record<string, number>;
  totalViews: number;
}

export default async function CataloguePage() {
  const { data } = await orochia<{ data: Catalogue }>("/api/bunny/analytics");
  const s = data.videosByStatus;
  return (
    <div>
      <PageTitle
        title="Catalogue"
        subtitle="Videos by encoding state (updated by signed Bunny Stream webhooks). Bandwidth and edge metrics live in the Bunny dashboard."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Stat label="Ready" value={s.READY ?? 0} tone="text-emerald-400" />
        <Stat label="Processing" value={s.PROCESSING ?? 0} />
        <Stat label="Awaiting upload" value={s.PENDING_UPLOAD ?? 0} />
        <Stat label="Failed" value={s.FAILED ?? 0} tone="text-rose-300" />
        <Stat label="Total views" value={data.totalViews.toLocaleString("en-US")} />
      </div>
    </div>
  );
}
