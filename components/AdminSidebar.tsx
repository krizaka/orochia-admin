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
  UserCog,
  ExternalLink,
  CheckCircle2
} from "lucide-react";
import { OrochiaLogo } from "@/components/OrochiaLogo";

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems: { label: string; href: string; icon: typeof LayoutDashboard; badge?: string; badgeColor?: string }[] = [
    { label: "Overview", href: "/", icon: LayoutDashboard },
    { label: "2257 Creator Verification", href: "/compliance", icon: ShieldCheck },
    { label: "Content Reports", href: "/moderation", icon: AlertTriangle },
    { label: "Treasury & Payouts", href: "/treasury", icon: Wallet },
    { label: "Catalogue", href: "/catalogue", icon: Activity },
    { label: "Creator Registry", href: "/creators", icon: Users },
    { label: "Accounts", href: "/users", icon: UserCog },
  ];

  return (
    <aside className="w-64 border-r border-white/10 bg-zinc-950 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-white/10 gap-2.5">
          <OrochiaLogo size={40} />
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

      {/* Footer */}
      <div className="p-4 border-t border-white/5 space-y-3">
        <a
          href={process.env.NEXT_PUBLIC_OROCHIA_APP_URL || "http://localhost:3000"}
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
