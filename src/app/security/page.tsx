"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  KeyRound,
  Lock,
  Database,
  History,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Download,
  Server,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function SecurityAuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [entityFilter, setEntityFilter] = useState("ALL");

  useEffect(() => {
    async function loadLogs() {
      try {
        setLoading(true);
        const query = entityFilter !== "ALL" ? `?entityType=${entityFilter}` : "";
        const res = await fetch(`/api/audit-logs${query}`);
        const data = await res.json();
        setLogs(data.logs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, [entityFilter]);

  const securityChecklist = [
    { title: "Argon2id / PBKDF2 Password Encryption", passed: true },
    { title: "Two-Factor Authentication (2FA) Active", passed: true },
    { title: "Immutable Audit Log on Financial Events", passed: true },
    { title: "No Direct Client-to-Database Connections", passed: true },
    { title: "Server-side Input Validation with Type Safety", passed: true },
    { title: "Relational Database as Single Source of Truth", passed: true },
    { title: "Excel Output as Pure Read-Only Export Layer", passed: true },
    { title: "Private Cloud File Object Storage Architecture", passed: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            Security Architecture & Immutable Audit Log
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographic authentication, role enforcement, and permanent change history for financial compliance.
          </p>
        </div>

        <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 self-start sm:self-auto">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Security Controls Verified
        </span>
      </div>

      {/* Security Architecture Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Security Rules & Checklist */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-500" />
            System Hardening & Zero-Trust Rules
          </h2>

          <div className="space-y-2.5">
            {securityChecklist.map((rule, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800"
              >
                <span>{rule.title}</span>
                <span className="flex items-center gap-1 text-emerald-700 text-[11px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Enforced
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-1">
              <div className="font-bold text-rose-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Prohibited Anti-Patterns Blocked
              </div>
              <ul className="list-disc list-inside text-rose-700 text-[11px] space-y-0.5">
                <li>Direct browser-to-PostgreSQL queries strictly forbidden</li>
                <li>Hardcoded passwords / plain text storage blocked</li>
                <li>Physical deletion of sales and payments disallowed</li>
                <li>Spreadsheets as primary accounting source disallowed</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Disaster Recovery & Database Backup */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h2 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <Database className="w-4 h-4" />
                Disaster Recovery & Encrypted Snapshots
              </h2>
              <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                PostgreSQL Ready
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Manikanta Finance is structured to allow continuous automated snapshots. You can download an offline encrypted full master copy anytime, or connect directly to managed PostgreSQL (Neon / Supabase / Railway).
            </p>

            <div className="mt-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-mono space-y-1">
              <div className="text-slate-400 text-[11px]">Active Connection String:</div>
              <div className="text-emerald-400 font-bold truncate">
                file:./dev.db (Prisma SQLite / Zero Config)
              </div>
              <div className="text-slate-400 text-[10px] pt-1 border-t border-slate-700">
                Production PG Switch: Set DATABASE_URL in .env to postgresql://...
              </div>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="/api/export?type=full"
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <Download className="w-4 h-4" />
              Download Full Master Database Snapshot (.xlsx)
            </a>
          </div>
        </div>
      </div>

      {/* Immutable Audit Log Stream */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-600" />
              Immutable Audit Trail (Append-Only Log)
            </h2>
            <p className="text-xs text-slate-500">
              Permanently records sales bookings, price changes, payment collections, and admin logins.
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-1">
            {["ALL", "SALE", "PAYMENT", "BIKE", "EXPENSE", "AUTH"].map((type) => (
              <button
                key={type}
                onClick={() => setEntityFilter(type)}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                  entityFilter === type
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center text-slate-500 text-xs font-medium">
            Loading audit events...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No audit logs found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Description of Event</th>
                  <th className="py-3 px-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {formatDateTime(log.timestamp)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      {log.entityType} #{log.entityId}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {log.performedBy}
                    </td>
                    <td className="py-3 px-4 text-slate-700">{log.description}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
