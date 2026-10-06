"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Download,
  Eye,
  FileText,
  AlertCircle,
  Search,
  Filter
} from "lucide-react";

interface ComplianceRecord {
  id: string;
  creatorName: string;
  legalName: string;
  dateOfBirth: string;
  country: string;
  documentType: string;
  documentNumber: string;
  status: string;
  verifiedAt?: string;
  submittedAt?: string;
  custodianAddress: string;
}

export default function ComplianceVaultPage() {
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "VERIFIED">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKyc, setSelectedKyc] = useState<ComplianceRecord | null>(null);

  const [records, setRecords] = useState<ComplianceRecord[]>([
    {
      id: "kyc-901",
      creatorName: "Elena Vox",
      legalName: "Elena V. Richter",
      dateOfBirth: "1994-08-14 (Age 32)",
      country: "Germany / EU",
      documentType: "Passport (National)",
      documentNumber: "C01X...88P",
      status: "VERIFIED",
      verifiedAt: "2026-10-06 14:10",
      custodianAddress: "Krizaka Compliance Vault, Spichernstraße 12, 10777 Berlin, Germany",
    },
    {
      id: "kyc-902",
      creatorName: "Mia Sterling",
      legalName: "Mia A. Sterling",
      dateOfBirth: "1998-03-22 (Age 28)",
      country: "United States (CA)",
      documentType: "State Driver License",
      documentNumber: "D994...12C",
      status: "PENDING",
      submittedAt: "2026-10-05 18:30",
      custodianAddress: "9450 Wilshire Blvd, Beverly Hills, CA 90212, USA",
    },
    {
      id: "kyc-903",
      creatorName: "Kaelen Drake",
      legalName: "Kaelen R. Drake",
      dateOfBirth: "1995-11-09 (Age 30)",
      country: "United Kingdom",
      documentType: "National Citizen ID",
      documentNumber: "GB77...04Q",
      status: "PENDING",
      submittedAt: "2026-10-04 11:15",
      custodianAddress: "22 Chancery Lane, London WC2A 1LS, UK",
    },
  ]);

  const handleApprove = (id: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "VERIFIED", verifiedAt: new Date().toISOString() } : r
      )
    );
    setSelectedKyc(null);
  };

  const filtered = records.filter((r) => {
    if (filter === "PENDING" && r.status !== "PENDING") return false;
    if (filter === "VERIFIED" && r.status !== "VERIFIED") return false;
    if (searchTerm && !r.creatorName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300 mb-2">
            <ShieldCheck className="h-3 w-3" />
            <span>18 U.S.C. § 2257 Federal Custodian Records</span>
          </div>
          <h1 className="text-2xl font-black text-white font-display">Performer Compliance Vault</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Mandatory primary producer records, government age identification, and federal audit archives
          </p>
        </div>

        <button
          onClick={() => alert("Exporting 18 U.S.C. § 2257 Certified Federal Audit Log CSV/JSON")}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export 2257 Audit Dossier</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search performer or legal name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-zinc-900/80 pl-10 pr-4 py-2 text-xs text-white placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("ALL")}
            className={`rounded-xl px-3 py-2 text-xs font-semibold ${
              filter === "ALL" ? "bg-violet-600 text-white" : "bg-zinc-900 text-zinc-400"
            }`}
          >
            All ({records.length})
          </button>
          <button
            onClick={() => setFilter("PENDING")}
            className={`rounded-xl px-3 py-2 text-xs font-semibold ${
              filter === "PENDING" ? "bg-amber-600 text-white" : "bg-zinc-900 text-zinc-400"
            }`}
          >
            Pending ({records.filter((r) => r.status === "PENDING").length})
          </button>
          <button
            onClick={() => setFilter("VERIFIED")}
            className={`rounded-xl px-3 py-2 text-xs font-semibold ${
              filter === "VERIFIED" ? "bg-emerald-600 text-white" : "bg-zinc-900 text-zinc-400"
            }`}
          >
            Verified ({records.filter((r) => r.status === "VERIFIED").length})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-white/5 bg-zinc-900/80 font-mono uppercase text-zinc-400">
            <tr>
              <th className="px-5 py-3.5">Performer Handle</th>
              <th className="px-5 py-3.5">Legal Name & Age</th>
              <th className="px-5 py-3.5">ID Document</th>
              <th className="px-5 py-3.5">Custodian Location</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-zinc-300">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-zinc-900/60 transition-colors">
                <td className="px-5 py-4">
                  <span className="font-bold text-white block">{item.creatorName}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">{item.id}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-white block">{item.legalName}</span>
                  <span className="text-[11px] text-zinc-400">{item.dateOfBirth}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-violet-300 block">{item.documentType}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">{item.documentNumber} ({item.country})</span>
                </td>
                <td className="px-5 py-4 text-[11px] text-zinc-400 max-w-xs truncate">
                  {item.custodianAddress}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      item.status === "VERIFIED"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right space-x-2">
                  <button
                    onClick={() => setSelectedKyc(item)}
                    className="rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200"
                  >
                    Review Dossier
                  </button>
                  {item.status === "PENDING" && (
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white"
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Dossier View */}
      {selectedKyc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-zinc-950 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  2257 Performer Audit Dossier: {selectedKyc.creatorName}
                </h3>
                <p className="text-xs text-zinc-400 font-mono">Dossier ID: {selectedKyc.id}</p>
              </div>
              <button
                onClick={() => setSelectedKyc(null)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-zinc-900 p-3">
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold">Legal Full Name</span>
                  <p className="font-bold text-white mt-0.5">{selectedKyc.legalName}</p>
                </div>
                <div className="rounded-xl bg-zinc-900 p-3">
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold">Birthdate & Age</span>
                  <p className="font-bold text-emerald-400 mt-0.5">{selectedKyc.dateOfBirth}</p>
                </div>
              </div>

              <div className="rounded-xl bg-zinc-900 p-3">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">Identification Document</span>
                <p className="text-white mt-0.5">{selectedKyc.documentType} ({selectedKyc.documentNumber})</p>
                <p className="text-zinc-500 text-[11px]">Jurisdiction: {selectedKyc.country}</p>
              </div>

              <div className="rounded-xl bg-zinc-900 p-3">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">Records Custodian Physical Location</span>
                <p className="text-zinc-300 mt-0.5 font-mono text-[11px]">{selectedKyc.custodianAddress}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setSelectedKyc(null)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-zinc-300"
              >
                Close
              </button>
              {selectedKyc.status === "PENDING" && (
                <button
                  onClick={() => handleApprove(selectedKyc.id)}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2 text-xs font-bold text-white shadow-lg"
                >
                  Confirm 2257 Certification
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
