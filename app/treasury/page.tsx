"use client";

import React, { useState } from "react";
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Sparkles,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  AlertCircle
} from "lucide-react";

export default function TreasuryPage() {
  const [platformRake, setPlatformRake] = useState(10);
  const [payoutStatus, setPayoutStatus] = useState<string | null>(null);

  const [payouts, setPayouts] = useState([
    {
      id: "pay-101",
      creator: "Elena Vox",
      wallet: "0x71C...49A2 (USDC - Arbitrum)",
      amount: "$3,420.00",
      grossEarned: "$3,800.00",
      platformRake: "$380.00 (10%)",
      fastLaneFee: "$57.00 (1.5%)",
      status: "PENDING_APPROVAL",
      requestedAt: "Today, 11:20",
    },
    {
      id: "pay-102",
      creator: "Mia Sterling",
      wallet: "SEPA IBAN DE89...4401 (EUR)",
      amount: "$1,890.00",
      grossEarned: "$2,100.00",
      platformRake: "$210.00 (10%)",
      fastLaneFee: "$0.00",
      status: "PENDING_APPROVAL",
      requestedAt: "Today, 09:45",
    },
    {
      id: "pay-103",
      creator: "Kaelen Drake",
      wallet: "0x99B...12EF (USDT - Polygon)",
      amount: "$810.00",
      grossEarned: "$900.00",
      platformRake: "$90.00 (10%)",
      fastLaneFee: "$13.50 (1.5%)",
      status: "SETTLED",
      requestedAt: "Oct 5, 2026",
    },
  ]);

  const handleApproveBatch = () => {
    setPayouts((prev) =>
      prev.map((p) => ({ ...p, status: "SETTLED" }))
    );
    setPayoutStatus("Batch payout executed successfully via smart contract multisig & SEPA rails.");
    setTimeout(() => setPayoutStatus(null), 6000);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300 mb-2">
            <Wallet className="h-3 w-3" />
            <span>Platform Revenue Architecture & Treasury Ledger</span>
          </div>
          <h1 className="text-2xl font-black text-white font-display">Treasury & Administrator Monetization</h1>
          <p className="text-xs text-zinc-400 mt-1">
            4-layer platform fee extraction, protocol treasury balances, and automated creator payout settlement
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert("Exporting audited accounting ledger CSV (GAAP/IFRS compliant)")}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Financial Ledger</span>
          </button>
          <button
            onClick={handleApproveBatch}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition-all"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Approve All Payouts</span>
          </button>
        </div>
      </div>

      {payoutStatus && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs text-emerald-300 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{payoutStatus}</span>
        </div>
      )}

      {/* 4 Monetization Revenue Streams for the Platform Admin */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-950/40 to-zinc-900/40 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-400">1. Protocol Rake (10%)</span>
            <div className="h-8 w-8 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white font-display">$4,328.00</div>
            <p className="text-[11px] text-zinc-400 mt-1">10% cut on all tips, unlocks & subscriptions</p>
          </div>
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
            <span className="text-zinc-500">Gross GMV</span>
            <span className="font-mono text-white">$43,280.00</span>
          </div>
        </div>

        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 to-zinc-900/40 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-400">2. 2257 Vault Audit Fee</span>
            <div className="h-8 w-8 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white font-display">$1,176.00</div>
            <p className="text-[11px] text-zinc-400 mt-1">$49 one-time federal custodian onboarding fee</p>
          </div>
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
            <span className="text-zinc-500">Performers Audited</span>
            <span className="font-mono text-white">24 Creators</span>
          </div>
        </div>

        <div className="rounded-3xl border border-pink-500/30 bg-gradient-to-br from-pink-950/40 to-zinc-900/40 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-400">3. Sanctuary Spotlight</span>
            <div className="h-8 w-8 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white font-display">$1,500.00</div>
            <p className="text-[11px] text-zinc-400 mt-1">$25/day hero featured placement auctions</p>
          </div>
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
            <span className="text-zinc-500">Active Slots</span>
            <span className="font-mono text-white">2 Slots booked</span>
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 to-zinc-900/40 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-400">4. Instant Payout Fast-Lane</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white font-display">$583.50</div>
            <p className="text-[11px] text-zinc-400 mt-1">1.5% express fee for instant sub-minute payouts</p>
          </div>
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
            <span className="text-zinc-500">Fast-Lane Volume</span>
            <span className="font-mono text-white">$38,900.00</span>
          </div>
        </div>
      </div>

      {/* Protocol Configuration Box */}
      <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-6 space-y-4">
        <h2 className="text-sm font-bold text-white font-display">Protocol Fee Governance</h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="max-w-xl">
            <label className="text-xs font-semibold text-zinc-300">
              Platform Take Rate (Current: {platformRake}%)
            </label>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Adjust the baseline rake deducted from every viewer tip, pay-per-view unlock, and monthly fan subscription.
            </p>
            <input
              type="range"
              min="5"
              max="20"
              value={platformRake}
              onChange={(e) => setPlatformRake(Number(e.target.value))}
              className="w-full mt-3 accent-violet-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
              <span>5% (Hyper-competitive)</span>
              <span>10% (Default Sanctuary)</span>
              <span>20% (Traditional Web2)</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 space-y-1.5 shrink-0 min-w-[240px]">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Total Admin Net Revenue</span>
            <div className="text-2xl font-black text-emerald-400 font-display">
              ${(4328 + 1176 + 1500 + 583.5).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[10px] text-zinc-400">Directly deposited to Platform Cold Treasury</p>
          </div>
        </div>
      </div>

      {/* Creator Payout Settlement Queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white font-display">Creator Payout Settlement Queue</h2>
          <span className="text-xs text-zinc-400 font-mono">
            {payouts.filter((p) => p.status === "PENDING_APPROVAL").length} Pending Batches
          </span>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/5 bg-zinc-900/80 font-mono uppercase text-zinc-400">
              <tr>
                <th className="px-5 py-3.5">Creator</th>
                <th className="px-5 py-3.5">Settlement Destination</th>
                <th className="px-5 py-3.5">Gross Earned</th>
                <th className="px-5 py-3.5">Platform Rake (10%)</th>
                <th className="px-5 py-3.5">Fast-Lane Fee</th>
                <th className="px-5 py-3.5">Net Payout</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {payouts.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-900/60 transition-colors">
                  <td className="px-5 py-4 font-bold text-white">{p.creator}</td>
                  <td className="px-5 py-4 font-mono text-[11px] text-violet-300">{p.wallet}</td>
                  <td className="px-5 py-4 font-mono text-zinc-400">{p.grossEarned}</td>
                  <td className="px-5 py-4 font-mono text-amber-400">{p.platformRake}</td>
                  <td className="px-5 py-4 font-mono text-zinc-500">{p.fastLaneFee}</td>
                  <td className="px-5 py-4 font-mono font-bold text-emerald-400">{p.amount}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        p.status === "SETTLED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
