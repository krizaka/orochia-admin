"use client";

import React, { useState } from "react";
import {
  Activity,
  Globe,
  HardDrive,
  Film,
  Zap,
  RefreshCw,
  FolderOpen,
  ShieldCheck,
  CheckCircle,
  Layers,
  Sparkles
} from "lucide-react";

export default function BunnyCdnPage() {
  const [purgeUrl, setPurgeUrl] = useState("");
  const [purgeStatus, setPurgeStatus] = useState<string | null>(null);

  const edgePops = [
    { city: "Frankfurt (FRA)", latency: "14ms", status: "Optimal", cacheHit: "99.1%" },
    { city: "Ashburn, VA (IAD)", latency: "18ms", status: "Optimal", cacheHit: "98.8%" },
    { city: "London (LHR)", latency: "16ms", status: "Optimal", cacheHit: "98.9%" },
    { city: "Singapore (SIN)", latency: "38ms", status: "Optimal", cacheHit: "97.4%" },
    { city: "Tokyo (NRT)", latency: "42ms", status: "Optimal", cacheHit: "97.9%" },
    { city: "São Paulo (GRU)", latency: "58ms", status: "Optimal", cacheHit: "96.5%" },
  ];

  const videoLibraries = [
    {
      id: "lib-98441",
      name: "Orochia Main Sanctuary Stream",
      zone: "Storage Zone: de-edge-01",
      totalVideos: 142,
      storageUsed: "680.4 GB",
      resolutions: "2160p (4K), 1440p, 1080p, 720p, 480p",
      codecs: "H.264 / VP9 / AV1 Adaptive HLS",
      drm: "MediaCage Widevine L3 + Token Authentication",
    },
    {
      id: "lib-98442",
      name: "Orochia Raw Creator Ingest & Transcoding",
      zone: "Storage Zone: us-east-ingest-02",
      totalVideos: 38,
      storageUsed: "145.2 GB",
      resolutions: "Original Master Ingest",
      codecs: "ProRes 422 / Lossless H.265",
      drm: "Internal Signed S3 Access Only",
    },
  ];

  const collections = [
    {
      id: "col-101",
      name: "Midnight Atelier Sessions",
      creator: "Elena Vox",
      videos: 8,
      totalViews: "48,200",
      tier: "Members Only ($15/mo)",
      thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
    },
    {
      id: "col-102",
      name: "4K Masterclasses & Behind The Scenes",
      creator: "Elena Vox",
      videos: 12,
      totalViews: "34,900",
      tier: "Pay-Per-Series ($35)",
      thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
    },
    {
      id: "col-103",
      name: "Acoustic Noir Lounge",
      creator: "Mia Sterling",
      videos: 6,
      totalViews: "22,100",
      tier: "Public Community (Free)",
      thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    },
    {
      id: "col-104",
      name: "Underground Berlin Rhythms",
      creator: "Kaelen Drake",
      videos: 15,
      totalViews: "61,400",
      tier: "Pay-Per-View ($9/episode)",
      thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    },
  ];

  const handleExecutePurge = () => {
    if (!purgeUrl) return;
    setPurgeStatus(`Bunny Edge cache successfully purged for: ${purgeUrl} across all 114 PoPs globally.`);
    setPurgeUrl("");
    setTimeout(() => setPurgeStatus(null), 5000);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-300 mb-2">
            <Activity className="h-3 w-3" />
            <span>Bunny.net Stream & Global CDN Infrastructure</span>
          </div>
          <h1 className="text-2xl font-black text-white font-display">Bunny CDN & Video Stream Architecture</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Global edge POP distribution, video libraries, curated series collections, and live cache invalidation
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Edge Network: 114 PoPs Live</span>
        </div>
      </div>

      {purgeStatus && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs text-emerald-300 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{purgeStatus}</span>
        </div>
      )}

      {/* Edge Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-5 space-y-1">
          <span className="text-[10px] uppercase tracking-wider font-mono text-zinc-400">Total Bandwidth (30D)</span>
          <div className="text-2xl font-black text-white font-display">2.42 TB</div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1">
            <Zap className="h-3 w-3" /> 98.6% Edge Cache Hit Ratio
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-5 space-y-1">
          <span className="text-[10px] uppercase tracking-wider font-mono text-zinc-400">Storage Replicated</span>
          <div className="text-2xl font-black text-white font-display">825.6 GB</div>
          <p className="text-[11px] text-zinc-400">Multi-AZ Edge Replicas (Falkenstein, Ashburn)</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-5 space-y-1">
          <span className="text-[10px] uppercase tracking-wider font-mono text-zinc-400">Transcoding Queue</span>
          <div className="text-2xl font-black text-emerald-400 font-display">0 Pending</div>
          <p className="text-[11px] text-zinc-400">Average GPU encoding time: 1.2x real-time</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-5 space-y-1">
          <span className="text-[10px] uppercase tracking-wider font-mono text-zinc-400">Global TTFB Average</span>
          <div className="text-2xl font-black text-violet-400 font-display">24.2 ms</div>
          <p className="text-[11px] text-zinc-400">Direct Anycast Tier-1 Routing</p>
        </div>
      </div>

      {/* Video Libraries */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white font-display flex items-center gap-2">
          <HardDrive className="h-4 w-4 text-violet-400" />
          <span>Bunny.net Video Libraries</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videoLibraries.map((lib) => (
            <div key={lib.id} className="rounded-3xl border border-white/10 bg-zinc-900/40 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <div>
                  <span className="font-bold text-white text-sm block">{lib.name}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">{lib.id} • {lib.zone}</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">{lib.storageUsed}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold">Active Videos</span>
                  <p className="text-white font-bold">{lib.totalVideos} videos</p>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold">Quality Ladders</span>
                  <p className="text-zinc-300 font-mono text-[11px]">{lib.resolutions}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 text-[11px] text-zinc-400 flex items-center justify-between">
                <span>DRM: {lib.drm}</span>
                <span className="text-violet-300 font-mono">Tus Protocol: Enabled</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Collections & Series Showcase */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white font-display flex items-center gap-2">
            <Film className="h-4 w-4 text-pink-400" />
            <span>Platform Collections & Paid Series Architecture</span>
          </h2>
          <span className="text-xs text-zinc-400 font-mono">{collections.length} Curated Collections</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {collections.map((col) => (
            <div key={col.id} className="rounded-3xl border border-white/10 bg-zinc-900/40 overflow-hidden group hover:border-violet-500/40 transition-all">
              <div className="aspect-video relative overflow-hidden bg-zinc-950">
                <img
                  src={col.thumbnail}
                  alt={col.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                <div className="absolute top-2 right-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 px-2 py-0.5 text-[9px] font-bold text-white">
                  {col.videos} Videos
                </div>
              </div>

              <div className="p-4 space-y-2">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{col.creator}</span>
                <h3 className="font-bold text-white text-xs line-clamp-1 group-hover:text-violet-300 transition-colors">
                  {col.name}
                </h3>
                <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
                  <span className="text-violet-400 font-semibold">{col.tier}</span>
                  <span className="text-zinc-500 font-mono">{col.totalViews} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Edge PoP Latency Grid & Emergency Purge */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Edge POPs */}
        <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-5 space-y-3">
          <h2 className="text-sm font-bold text-white font-display flex items-center gap-2">
            <Globe className="h-4 w-4 text-emerald-400" />
            <span>Real-time Global POP Health</span>
          </h2>
          <div className="divide-y divide-white/5 text-xs">
            {edgePops.map((pop) => (
              <div key={pop.city} className="py-2.5 flex items-center justify-between">
                <span className="font-medium text-white">{pop.city}</span>
                <div className="flex items-center gap-4 font-mono text-[11px]">
                  <span className="text-zinc-400">Cache: {pop.cacheHit}</span>
                  <span className="text-emerald-400 font-bold">{pop.latency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Edge Purge Tool */}
        <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-5 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-rose-400" />
              <span>Instant Edge Cache Purge</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Invalidate cached video manifests, HLS playlists (.m3u8), or thumbnail assets globally in &lt; 250ms.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-zinc-300">Target Asset URL or Video Tag</label>
            <input
              type="text"
              placeholder="e.g. /play/4f9b0e13/playlist.m3u8 or tag:creator-elena"
              value={purgeUrl}
              onChange={(e) => setPurgeUrl(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none font-mono"
            />
          </div>

          <button
            onClick={handleExecutePurge}
            disabled={!purgeUrl}
            className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2.5 text-xs font-bold text-white shadow-lg transition-all"
          >
            Purge Global Bunny Edge Cache
          </button>
        </div>
      </div>
    </div>
  );
}
