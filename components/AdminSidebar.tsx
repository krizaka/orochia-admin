"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldCheck,
  AlertTriangle,
  Wallet,
  Activity,
  Users,
  ExternalLink,
  Flame,
  CheckCircle2
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Executive Overview",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      label: "2257 Compliance Vault",
      href: "/compliance",
      icon: ShieldCheck,
      badge: "3 Pending",
    },
    {
      label: "Content Moderation & DMCA",
      href: "/moderation",
      icon: AlertTriangle,
      badge: "1 Report",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    },
    {
      label: "Treasury & Monetization",
      href: "/treasury",
      icon: Wallet,
      badge: "10% Rake",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    },
    {
      label: "Bunny CDN Telemetry",
      href: "/cdn",
      icon: Activity,
    },
    {
      label: "Creator & User Registry",
      href: "/creators",
      icon: Users,
    },
  ];

  return (
    <aside className="w-64 border-r border-white/10 bg-zinc-950 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-white/10 gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-pink-500 text-white shadow-lg shadow-violet-500/25">
            <Flame className="h-5 w-5 fill-white" />
          </div>
          <div>
            <span className="text-sm font-black tracking-wider text-white font-display">
              OROCHIA<span className="text-violet-400">.</span>
            </span>
            <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest leading-none">
              Control Plane
            </span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${
                      item.badgeColor || "bg-violet-500/20 text-violet-300 border-violet-500/30"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status */}
      <div className="p-4 border-t border-white/5 space-y-3">
        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-3 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-400">PostgreSQL</span>
            <span className="flex items-center gap-1 text-emerald-400 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-400">Bunny.net Stream</span>
            <span className="flex items-center gap-1 text-emerald-400 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Operational
            </span>
          </div>
        </div>

        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <span>Open Consumer App</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </aside>
  );
}
