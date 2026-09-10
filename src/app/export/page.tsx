"use client";

import { useState } from "react";
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Bike,
  Users,
  Receipt,
  CreditCard,
  DollarSign,
  Database,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ExcelExportPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const exportOptions = [
    {
      id: "today",
      title: "Export Today's Daybook",
      description: "Complete daily record with Sales, Payments Received, Pending, and Expenses.",
      icon: Calendar,
      color: "from-amber-500 to-yellow-500",
      type: "today",
      filename: "Manikanta_Daybook_Today.xlsx",
    },
    {
      id: "sales",
      title: "Export Sales Register",
      description: "All vehicle sales invoices, buyer details, selling prices, down payments, and EMI plans.",
      icon: Receipt,
      color: "from-blue-600 to-indigo-600",
      type: "sales",
      filename: "Manikanta_Sales_Register.xlsx",
    },
    {
      id: "payments",
      title: "Export Payments & Collections",
      description: "All money receipts issued (REC-2026-XXXX), payment modes (Cash/UPI), and reference numbers.",
      icon: CreditCard,
      color: "from-emerald-600 to-teal-600",
      type: "payments",
      filename: "Manikanta_Payment_Receipts.xlsx",
    },
    {
      id: "expenses",
      title: "Export Expenses Sheet",
      description: "Shop rent, mechanic wages, spare parts purchases, and overheads.",
      icon: DollarSign,
      color: "from-rose-600 to-pink-600",
      type: "expenses",
      filename: "Manikanta_Expenses.xlsx",
    },
    {
      id: "bikes",
      title: "Export Bike Inventory",
      description: "Full stock with MF IDs, registration numbers, purchase prices, repairs, total investments, and status.",
      icon: Bike,
      color: "from-amber-600 to-orange-600",
      type: "bikes",
      filename: "Manikanta_Bike_Inventory.xlsx",
    },
    {
      id: "customers",
      title: "Export Customer Ledger",
      description: "Borrower directory with contacts, Aadhar numbers, total purchases, payments, and balance dues.",
      icon: Users,
      color: "from-purple-600 to-violet-600",
      type: "customers",
      filename: "Manikanta_Customer_Ledger.xlsx",
    },
    {
      id: "full",
      title: "Export Full Master Backup Pack",
      description: "Multi-tab complete workbook containing Bikes, Customers, Sales, Receipts, Expenses, and Audit Logs.",
      icon: Database,
      color: "from-slate-900 to-slate-950",
      type: "full",
      filename: "Manikanta_Master_Backup.xlsx",
      highlight: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
              Excel Export Hub (.xlsx)
            </h1>
            <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-200">
              Direct Server Generation
            </span>
          </div>
          <p className="text-xs text-slate-500">
            One-click Excel downloads for accounting, client tax records, and external auditing.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-50 p-2 rounded-xl border border-slate-200 text-slate-600">
          <Database className="w-4 h-4 text-emerald-600" />
          <span>PostgreSQL is Single Source of Truth</span>
        </div>
      </div>

      {/* Architecture Alert */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-bold text-slate-200 text-sm">
              Architectural Standard Verified
            </div>
            <p className="text-slate-400">
              Unlike legacy spreadsheets where formulas break and records can be accidentally deleted, all business calculations in Manikanta Finance are permanently preserved in the relational database. Excel sheets are generated on-demand directly from the database tables.
            </p>
          </div>
        </div>
      </div>

      {/* Export Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {exportOptions.map((opt) => {
          const Icon = opt.icon;
          return (
            <div
              key={opt.id}
              className={`rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                opt.highlight
                  ? "md:col-span-2 lg:col-span-3 border-amber-400/80 bg-gradient-to-r from-amber-500/10 via-white to-amber-500/10"
                  : "border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${opt.color} text-white flex items-center justify-center shadow-md`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                    .XLSX Format
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 mb-1">
                  {opt.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {opt.description}
                </p>
              </div>

              <a
                href={`/api/export?type=${opt.type}`}
                download={opt.filename}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-all ${
                  opt.highlight
                    ? "bg-slate-900 hover:bg-slate-800 text-amber-300"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
              >
                <Download className="w-4 h-4" />
                Download {opt.title}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
