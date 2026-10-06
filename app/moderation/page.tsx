"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Trash2,
  ShieldAlert,
  CheckCircle,
  Eye,
  RefreshCw,
  ExternalLink,
  Ban
} from "lucide-react";

export default function ModerationPage() {
  const [reports, setReports] = useState([
    {
      id: "rep-4412",
      videoId: "4f9b0e13-2245-5f52-d4cc-e039c7f477ee",
      videoTitle: "Behind the Lens: Underground Berlin Rave Culture",
      creatorName: "Kaelen Drake",
      reason: "DMCA Copyright Claim",
      reportedBy: "legal@soundmaster-records.de",
      reportedAt: "Today, 14:40",
      description: "Audio track in minute 12:40 infringes copyrighted electronic release.",
      status: "OPEN",
    },
    {
      id: "rep-4390",
      videoId: "3e8a9d02-1134-4e41-c3bb-d928b6e366dd",
      videoTitle: "Midnight Noir: Acoustic Lounge Session",
      creatorName: "Mia Sterling",
      reason: "Non-consensual performer flag",
      reportedBy: "viewer_991",
      reportedAt: "Oct 4, 2026",
      description: "Requesting verification of background performer releases.",
      status: "RESOLVED",
    },
  ]);

  const [purgeSuccess, setPurgeSuccess] = useState<string | null>(null);

  const handlePurge = (repId: string, videoTitle: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === repId ? { ...r, status: "PURGED_OFFLINE" } : r))
    );
    setPurgeSuccess(`Emergency Bunny CDN Purge executed for: "${videoTitle}". Video is now 403 Forbidden worldwide.`);
    setTimeout(() => setPurgeSuccess(null), 5000);
  };

  const handleDismiss = (repId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === repId ? { ...r, status: "DISMISSED" } : r))
    );
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-rose-300 mb-2">
            <AlertTriangle className="h-3 w-3" />
            <span>Digital Millennium Copyright Act & Safety Triage</span>
          </div>
          <h1 className="text-2xl font-black text-white font-display">Content Moderation & DMCA Desk</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Emergency CDN takedowns, non-consensual content purge, and legal counter-notices
          </p>
        </div>
      </div>

      {purgeSuccess && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs text-emerald-300 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{purgeSuccess}</span>
        </div>
      )}

      <div className="space-y-4">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className={`rounded-3xl border p-6 space-y-4 transition-all ${
              rep.status === "PURGED_OFFLINE"
                ? "border-rose-500/40 bg-rose-950/20"
                : "border-white/10 bg-zinc-900/40"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-base">{rep.videoTitle}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">({rep.id})</span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Creator: <strong className="text-zinc-200">{rep.creatorName}</strong> • Reported by: {rep.reportedBy} ({rep.reportedAt})
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                  rep.status === "OPEN"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    : rep.status === "PURGED_OFFLINE"
                    ? "bg-zinc-800 text-zinc-400 border border-zinc-700"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                }`}
              >
                {rep.status}
              </span>
            </div>

            <div className="rounded-2xl bg-zinc-900/80 p-4 border border-white/5 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
                Reason: {rep.reason}
              </span>
              <p className="text-zinc-300 leading-relaxed">{rep.description}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <a
                href={`http://localhost:3000/watch/${rep.videoId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Inspect Video on Consumer Platform</span>
              </a>

              {rep.status === "OPEN" && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDismiss(rep.id)}
                    className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/5"
                  >
                    Dismiss Claim
                  </button>
                  <button
                    onClick={() => handlePurge(rep.id, rep.videoTitle)}
                    className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-rose-600/30 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Emergency Bunny CDN Purge (Take Offline)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
