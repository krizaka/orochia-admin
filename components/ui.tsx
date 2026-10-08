import React from "react";
import { buttonClass } from "@krizaka/orochia-design-system/classes";

export function PageTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <p className="text-xs text-zinc-400 mt-1">{subtitle}</p>
    </div>
  );
}

export function Stat({ label, value, hint, tone = "text-white" }: { label: string; value: React.ReactNode; hint?: string; tone?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
      <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">{label}</span>
      <p className={`mt-2 text-2xl font-black font-mono ${tone}`}>{value}</p>
      {hint && <span className="text-[11px] text-zinc-500">{hint}</span>}
    </div>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-2xl border border-white/10 bg-zinc-900/40 p-10 text-center text-xs text-zinc-400">{children}</p>
  );
}

export function Panel({ children }: { children: React.ReactNode }) {
  return <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-6 overflow-x-auto">{children}</div>;
}

export const th = "py-2 pr-4 text-left text-[10px] uppercase tracking-wider text-zinc-500 font-semibold";
export const td = "py-2.5 pr-4 text-xs text-zinc-300 align-top";
/** Table and form actions: the kit's secondary button, small. */
export const button = buttonClass({ variant: "secondary", size: "sm" });
