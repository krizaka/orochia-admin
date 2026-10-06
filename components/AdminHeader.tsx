"use client";

import React from "react";
import { Bell, Shield, Wallet, Sparkles } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="h-16 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
          Root Authority
        </span>
        <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
          Krizaka Site Governance & Federal Compliance Desk
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Treasury Ticker */}
        <div className="hidden md:flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-1.5 text-xs font-mono">
          <Wallet className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-zinc-400">YTD Gross GMV:</span>
          <span className="font-bold text-white">$43,280.00</span>
          <span className="text-emerald-400 font-bold ml-1">(+$4,328.00 Rake)</span>
        </div>

        {/* Notifications */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          aria-label="Compliance Alerts"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-zinc-950" />
        </button>

        {/* Admin Identity */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
            OA
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-white leading-none">Orochia Admin</p>
            <p className="text-[10px] font-mono text-violet-400 mt-0.5">superadmin@orochia.org</p>
          </div>
        </div>
      </div>
    </header>
  );
}
