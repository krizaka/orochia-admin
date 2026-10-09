"use client";

import { OrochiaLogo } from "@krizaka/orochia-design-system";
import { Badge } from "@krizaka/ui/badge";
import { cn } from "@krizaka/ui/cn";
import {
  Activity,
  AlertTriangle,
  Database,
  ExternalLink,
  Gavel,
  LayoutDashboard,
  ShieldCheck,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems: { label: string; href: string; icon: typeof LayoutDashboard; badge?: string }[] = [
    { label: "Overview", href: "/", icon: LayoutDashboard },
    { label: "2257 Creator Verification", href: "/compliance", icon: ShieldCheck },
    { label: "Content Reports", href: "/moderation", icon: AlertTriangle },
    { label: "Treasury & Payouts", href: "/treasury", icon: Wallet },
    { label: "Catalogue", href: "/catalogue", icon: Activity },
    { label: "Auctions", href: "/auctions", icon: Gavel },
    { label: "Creator Registry", href: "/creators", icon: Users },
    { label: "Accounts", href: "/users", icon: UserCog },
    { label: "Platform & Database", href: "/platform", icon: Database },
  ];

  return (
    <aside className="w-64 border-r border-border-default bg-surface-1 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-border-default gap-2.5">
          <OrochiaLogo size={40} />
          <div>
            <span className="text-sm font-black tracking-wider text-fg font-display">
              OROCHIA<span className="text-accent">.</span>
            </span>
            <span className="block text-[10px] font-mono text-fg-secondary uppercase tracking-widest leading-none">
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
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all",
                  isActive ? "bg-accent text-on-accent shadow-glow-primary" : "text-fg-secondary hover:bg-surface-2 hover:text-fg",
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <Badge tone="accent">{item.badge}</Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border-subtle space-y-3">
        <a
          href={process.env.NEXT_PUBLIC_OROCHIA_APP_URL || "http://localhost:3000"}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-fg-secondary hover:text-fg hover:bg-surface-2 transition-colors"
        >
          <span>Open Consumer App</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </aside>
  );
}
