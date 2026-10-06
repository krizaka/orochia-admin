"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import type { AdminIdentity } from "@/lib/orochia";

export function AdminHeader({ admin }: { admin: AdminIdentity }) {
  const router = useRouter();
  const signOut = async () => {
    await fetch("/api/session", { method: "DELETE" });
    router.replace("/login");
    router.refresh();
  };
  const initials = admin.displayName.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <header className="h-16 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-30">
      <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
        Administrator
      </span>
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-white text-xs font-bold">
          {initials}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-xs font-bold text-white leading-none">{admin.displayName}</p>
          <p className="text-[10px] font-mono text-violet-400 mt-0.5">{admin.email}</p>
        </div>
        <button
          onClick={signOut}
          className="ml-2 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
