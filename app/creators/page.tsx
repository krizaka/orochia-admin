"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  ShieldCheck,
  CheckCircle2,
  Ban,
  DollarSign,
  Video,
  Award,
  MoreVertical,
  ExternalLink
} from "lucide-react";

export default function CreatorsRegistryPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const [users, setUsers] = useState([
    {
      id: "u-elena",
      handle: "elena",
      displayName: "Elena Vox",
      email: "elena@orochia.org",
      role: "CREATOR",
      kyc2257Status: "VERIFIED",
      subscribers: "1,420",
      totalEarned: "$24,500.00",
      videosCount: 14,
      accountStatus: "ACTIVE",
      joinedAt: "Oct 1, 2026",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    },
    {
      id: "u-mia",
      handle: "mia",
      displayName: "Mia Sterling",
      email: "mia@orochia.org",
      role: "CREATOR",
      kyc2257Status: "PENDING",
      subscribers: "890",
      totalEarned: "$12,400.00",
      videosCount: 8,
      accountStatus: "ACTIVE",
      joinedAt: "Oct 2, 2026",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80",
    },
    {
      id: "u-kaelen",
      handle: "kaelen",
      displayName: "Kaelen Drake",
      email: "kaelen@sanctuary.io",
      role: "CREATOR",
      kyc2257Status: "PENDING",
      subscribers: "430",
      totalEarned: "$5,800.00",
      videosCount: 6,
      accountStatus: "ACTIVE",
      joinedAt: "Oct 3, 2026",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    },
    {
      id: "u-alex",
      handle: "alex",
      displayName: "Alex Rivera",
      email: "alex@sanctuary.io",
      role: "USER",
      kyc2257Status: "NOT_APPLICABLE",
      subscribers: "—",
      totalEarned: "$0.00",
      videosCount: 0,
      accountStatus: "ACTIVE",
      joinedAt: "Oct 4, 2026",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    },
  ]);

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          return {
            ...u,
            accountStatus: u.accountStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE",
          };
        }
        return u;
      })
    );
  };

  const filtered = users.filter(
    (u) =>
      u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-300 mb-2">
            <Users className="h-3 w-3" />
            <span>Community Directory & RBAC Administration</span>
          </div>
          <h1 className="text-2xl font-black text-white font-display">Creator & User Registry</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Global account status, 18 U.S.C. § 2257 badge governance, earnings analytics, and suspension controls
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search by name, handle, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-zinc-900/80 pl-10 pr-4 py-2 text-xs text-white placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-white/5 bg-zinc-900/80 font-mono uppercase text-zinc-400">
            <tr>
              <th className="px-5 py-3.5">User / Creator</th>
              <th className="px-5 py-3.5">Role</th>
              <th className="px-5 py-3.5">2257 KYC Badge</th>
              <th className="px-5 py-3.5">Audience & Content</th>
              <th className="px-5 py-3.5">Total GMV</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-zinc-300">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-zinc-900/60 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar}
                      alt={u.displayName}
                      className="h-9 w-9 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{u.displayName}</span>
                        {u.kyc2257Status === "VERIFIED" && (
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">@{u.handle} • {u.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      u.role === "CREATOR"
                        ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                        : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      u.kyc2257Status === "VERIFIED"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : u.kyc2257Status === "PENDING"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {u.kyc2257Status}
                  </span>
                </td>
                <td className="px-5 py-4 font-mono text-[11px] text-zinc-300">
                  {u.subscribers} subs • {u.videosCount} videos
                </td>
                <td className="px-5 py-4 font-mono font-bold text-emerald-400">
                  {u.totalEarned}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      u.accountStatus === "ACTIVE"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-rose-500/20 text-rose-300"
                    }`}
                  >
                    {u.accountStatus}
                  </span>
                </td>
                <td className="px-5 py-4 text-right space-x-2">
                  <a
                    href={`http://localhost:3000/creator/${u.handle}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1.5 text-xs text-zinc-200"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>View Profile</span>
                  </a>
                  <button
                    onClick={() => toggleStatus(u.id)}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-bold ${
                      u.accountStatus === "ACTIVE"
                        ? "bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-500/30"
                        : "bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30"
                    }`}
                  >
                    {u.accountStatus === "ACTIVE" ? "Suspend" : "Reinstate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
