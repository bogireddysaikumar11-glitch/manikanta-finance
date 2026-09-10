"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Bike,
  Users,
  Download,
  Calendar,
  Sparkles,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
} from "lucide-react";
import { formatINR, formatDate } from "@/lib/utils";

export default function ReportsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"bikes" | "customers" | "channels">("bikes");

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        const res = await fetch("/api/reports");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  const summary = data?.summary || {
    totalSalesVolume: 0,
    totalCollections: 0,
    totalOutstandingDues: 0,
    totalExpenses: 0,
    totalRealizedProfit: 0,
    netShopIncome: 0,
    stockAssetValue: 0,
    bikesInStock: 0,
    bikesSold: 0,
  };

  const paymentSplit = data?.paymentSplit || { cash: 0, upi: 0 };
  const totalCollections = paymentSplit.cash + paymentSplit.upi;
  const cashPct = totalCollections > 0 ? ((paymentSplit.cash / totalCollections) * 100).toFixed(0) : "0";
  const upiPct = totalCollections > 0 ? ((paymentSplit.upi / totalCollections) * 100).toFixed(0) : "0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            Financial Reports & Profit Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Vehicle-by-vehicle profit analysis, customer dues aging, and shop cash flow health.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/export?type=full"
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
          >
            <Download className="w-4 h-4 text-amber-400" />
            Export Full Financial Pack (.xlsx)
          </a>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Realized Bike Profit */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-purple-100 shadow-xs">
          <div className="flex items-center justify-between text-xs text-purple-800 font-semibold mb-1">
            <span>Realized Bike Profit</span>
            <span className="p-1 bg-purple-50 text-purple-600 rounded">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-purple-700">
            {formatINR(summary.totalRealizedProfit)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across {summary.bikesSold || 0} sold bikes
          </div>
        </div>

        {/* Net Shop Income */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-100 shadow-xs">
          <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-1">
            <span>Net Shop Income</span>
            <span className="p-1 bg-emerald-50 text-emerald-600 rounded">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {formatINR(summary.netShopIncome)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Realized Profit - Shop Expenses
          </div>
        </div>

        {/* Total Outstanding Receivables */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-100 shadow-xs">
          <div className="flex items-center justify-between text-xs text-amber-800 font-semibold mb-1">
            <span>Pending Customer Dues</span>
            <span className="p-1 bg-amber-50 text-amber-600 rounded">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-amber-600">
            {formatINR(summary.totalOutstandingDues)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Future collection receivables
          </div>
        </div>

        {/* Stock Asset Valuation */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
            <span>Current Stock Value</span>
            <span className="p-1 bg-amber-400/20 text-amber-400 rounded">
              <Bike className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-amber-400">
            {formatINR(summary.stockAssetValue)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {summary.bikesInStock} two-wheelers in stock
          </div>
        </div>
      </div>

      {/* Payment Modes Split Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Payment Channel Breakdown (Cash vs Digital UPI)</span>
          <span>Total Collected: {formatINR(totalCollections)}</span>
        </div>

        <div className="h-4 rounded-full bg-slate-100 flex overflow-hidden">
          <div
            style={{ width: `${cashPct}%` }}
            className="bg-amber-500 hover:opacity-90 transition-all"
            title={`Cash: ${cashPct}%`}
          />
          <div
            style={{ width: `${upiPct}%` }}
            className="bg-purple-600 hover:opacity-90 transition-all"
            title={`UPI: ${upiPct}%`}
          />
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-amber-500" />
            <span className="text-slate-700 font-semibold">
              Cash: {formatINR(paymentSplit.cash)} ({cashPct}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-purple-600" />
            <span className="text-slate-700 font-semibold">
              UPI / Bank: {formatINR(paymentSplit.upi)} ({upiPct}%)
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("bikes")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "bikes"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          🏍️ Bike-wise Profit Margins ({data?.bikeProfits?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("customers")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "customers"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          🤝 Customer Pending Dues Aging ({data?.pendingCustomers?.length || 0})
        </button>
      </div>

      {/* Tab 1: Bike-wise Profit Breakdown */}
      {activeTab === "bikes" ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Individual Bike Profit Realization
              </h2>
              <p className="text-xs text-slate-500">
                Formula: Realized Margin = Sold Price - (Purchase Price + Accumulated Repair Cost)
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded">
              Total Realized: {formatINR(summary.totalRealizedProfit)}
            </span>
          </div>

          {loading ? (
            <div className="p-16 text-center text-slate-500 text-xs">Loading margins...</div>
          ) : data?.bikeProfits?.length === 0 ? (
            <div className="p-16 text-center text-slate-500 text-xs">
              No sold bikes recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Bike Code</th>
                    <th className="py-3 px-4">Model & Reg No</th>
                    <th className="py-3 px-4 text-right">Purchase (₹)</th>
                    <th className="py-3 px-4 text-right">Repairs (₹)</th>
                    <th className="py-3 px-4 text-right">Total Invested (₹)</th>
                    <th className="py-3 px-4 text-right">Sold Price (₹)</th>
                    <th className="py-3 px-4 text-right font-bold text-purple-800">
                      Realized Profit (₹)
                    </th>
                    <th className="py-3 px-4 text-right">ROI (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {data.bikeProfits.map((b: any) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {b.bikeCode}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{b.model}</div>
                        <div className="text-[11px] font-mono text-slate-500">
                          {b.regNo}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono">
                        {formatINR(b.purchasePrice)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-amber-700">
                        +{formatINR(b.repairCost)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        {formatINR(b.totalInvestment)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                        {formatINR(b.soldPrice)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-black text-purple-700 text-sm">
                        +{formatINR(b.profit)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold text-[11px]">
                          {b.marginPct}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Tab 2: Customer Pending Aging */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Customer Outstanding Balances & Aging
              </h2>
              <p className="text-xs text-slate-500">
                Borrowers sorted by highest pending amount for priority recovery
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded">
              Total Dues: {formatINR(summary.totalOutstandingDues)}
            </span>
          </div>

          {loading ? (
            <div className="p-16 text-center text-slate-500 text-xs">Loading dues...</div>
          ) : data?.pendingCustomers?.length === 0 ? (
            <div className="p-16 text-center text-slate-500 text-xs">
              All customer balances are fully paid!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Contact Phone</th>
                    <th className="py-3 px-4">Town / City</th>
                    <th className="py-3 px-4">Active Vehicle Accounts</th>
                    <th className="py-3 px-4 text-right">Outstanding Due (₹)</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {data.pendingCustomers.map((c: any) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{c.name}</td>
                      <td className="py-3 px-4 font-mono text-slate-700">{c.phone}</td>
                      <td className="py-3 px-4 text-slate-600">{c.city}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-semibold">
                          {c.activeSalesCount} active loan(s)
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-black text-amber-700 text-sm">
                        {formatINR(c.pending)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <a
                          href="/payments"
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold shadow-xs"
                        >
                          Collect
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
