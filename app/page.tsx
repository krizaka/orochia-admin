import React from "react";
import Link from "next/link";
import {
  Wallet,
  ShieldCheck,
  AlertTriangle,
  Activity,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Users,
  Film,
  Sparkles,
  ExternalLink
} from "lucide-react";

export default function AdminOverviewPage() {
  const stats = [
    {
      title: "Total Platform GMV",
      value: "$43,280.00",
      change: "+18.4% this month",
      subtext: "Gross tip & unlock volume",
      icon: Wallet,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "10% Protocol Net Rake",
      value: "$4,328.00",
      change: "+$640.00 this week",
      subtext: "Platform operator take-rate",
      icon: Sparkles,
      color: "text-violet-400",
      bg: "bg-violet-500/10 border-violet-500/20",
    },
    {
      title: "2257 Performer Audits",
      value: "30 / 33",
      change: "3 awaiting verification",
      subtext: "Federal custodian records",
      icon: ShieldCheck,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Bunny CDN Bandwidth",
      value: "1.84 TB",
      change: "98.4% Cache Hit Ratio",
      subtext: "Across 4 global edge POPs",
      icon: Activity,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
  ];

  const pendingCompliance = [
    {
      id: "kyc-901",
      creatorName: "Elena Vox",
      email: "elena@orochia.org",
      idType: "Government Passport (EU/DE)",
      submittedDate: "Today, 14:10",
      status: "APPROVED_CURRENT",
    },
    {
      id: "kyc-902",
      creatorName: "Mia Sterling",
      email: "mia@orochia.org",
      idType: "Driver License (US/CA)",
      submittedDate: "Yesterday, 18:30",
      status: "PENDING_AUDIT",
    },
    {
      id: "kyc-903",
      creatorName: "Kaelen Drake",
      email: "kaelen@sanctuary.io",
      idType: "National ID Card (UK)",
      submittedDate: "Oct 4, 2026",
      status: "PENDING_AUDIT",
    },
  ];

  const pendingReports = [
    {
      id: "rep-4412",
      videoTitle: "Underground Berlin Rave Culture",
      reportedBy: "anonymous_patron",
      reason: "DMCA Copyright Claim (Background Track)",
      status: "URGENT_REVIEW",
      timestamp: "1 hour ago",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Top Welcome & Rake Highlight */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-black text-white font-display">Executive Governance Console</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time platform ledger, 18 U.S.C. § 2257 compliance desk, and Bunny.net infrastructure
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/treasury"
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-600/30 transition-all"
          >
            <span>Manage Protocol Rake (10%)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="rounded-3xl border border-white/10 bg-zinc-900/60 p-5 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-zinc-400">{s.title}</span>
                <div className={`p-2 rounded-xl border ${s.bg}`}>
                  <Icon className={`h-4 w-4 ${s.color}`} />
                </div>
              </div>
              <p className="text-2xl font-black text-white font-mono">{s.value}</p>
              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className={s.color}>{s.change}</span>
                <span className="text-zinc-500 font-mono">{s.subtext}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Sections: 2257 & Moderation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Desk Queue */}
        <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-amber-400" />
              <h2 className="text-sm font-bold text-white">18 U.S.C. § 2257 Verification Queue</h2>
            </div>
            <Link href="/compliance" className="text-xs text-violet-400 hover:underline flex items-center gap-1 font-mono">
              View All <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {pendingCompliance.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900 border border-white/5 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{item.creatorName}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">({item.id})</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{item.idType} • {item.submittedDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      item.status === "APPROVED_CURRENT"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {item.status === "APPROVED_CURRENT" ? "Verified" : "Action Needed"}
                  </span>
                  <Link
                    href={`/compliance?id=${item.id}`}
                    className="rounded-lg bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 text-[11px] font-semibold text-zinc-200"
                  >
                    Audit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Moderation Queue */}
        <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-rose-400" />
              <h2 className="text-sm font-bold text-white">DMCA & Content Triage Desk</h2>
            </div>
            <Link href="/moderation" className="text-xs text-violet-400 hover:underline flex items-center gap-1 font-mono">
              View All <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {pendingReports.map((r) => (
              <div key={r.id} className="p-4 rounded-2xl bg-zinc-900 border border-rose-500/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{r.videoTitle}</span>
                  <span className="rounded-full bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 text-[9px] font-bold text-rose-300">
                    {r.status}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-300">{r.reason}</p>
                <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-zinc-500">
                  <span>Reported {r.timestamp}</span>
                  <Link
                    href="/moderation"
                    className="text-rose-400 hover:underline font-semibold"
                  >
                    Triage Incident & Emergency Purge →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
