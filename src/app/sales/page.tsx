"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Receipt,
  PlusCircle,
  Search,
  Bike,
  User,
  Phone,
  Calendar,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  Printer,
  Download,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import { formatINR, formatDate } from "@/lib/utils";

export default function SalesPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("ALL");

  useEffect(() => {
    async function loadSales() {
      try {
        setLoading(true);
        const res = await fetch("/api/sales");
        const data = await res.json();
        setSales(data.sales || []);
      } catch (err) {
        console.error("Failed to load sales:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSales();
  }, []);

  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      !searchQuery ||
      sale.bike?.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.bike?.regNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.customer?.phone?.includes(searchQuery);

    const matchesPayment =
      paymentFilter === "ALL" || sale.paymentType === paymentFilter;

    return matchesSearch && matchesPayment;
  });

  const totalRevenue = sales.reduce((acc, s) => acc + (s.agreedPrice || 0), 0);
  const totalProfit = sales.reduce((acc, s) => acc + (s.grossProfit || 0), 0);
  const totalDownPayment = sales.reduce((acc, s) => acc + (s.downPayment || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Action */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Sales Ledger & Invoices
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete log of showroom bike sales, payment collections, and generated invoices.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/sales/new"
            className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center gap-2 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Sell Bike (New Sale)</span>
          </Link>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">Total Bikes Sold</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{sales.length}</div>
          <div className="text-[11px] text-blue-600 font-medium mt-0.5">Showroom Deliveries</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">Total Sales Turnover</div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {formatINR(totalRevenue)}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Gross Invoiced</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">Total Gross Profit</div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">
            {formatINR(totalProfit)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">Margin Earned</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">Down Payment Collected</div>
          <div className="text-xl sm:text-2xl font-black text-amber-600 mt-1">
            {formatINR(totalDownPayment)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">Cash / UPI Upfront</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bike, customer, phone, reg no..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-blue-600 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-600 shrink-0">Filter:</span>
          {["ALL", "FULL_CASH", "FINANCE_EMI"].map((filter) => (
            <button
              key={filter}
              onClick={() => setPaymentFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                paymentFilter === filter
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {filter === "ALL" ? "All Sales" : filter === "FULL_CASH" ? "Full Cash" : "Showroom EMI"}
            </button>
          ))}
        </div>
      </div>

      {/* Sales List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm">Loading showroom sales records...</div>
        ) : filteredSales.length === 0 ? (
          <div className="p-12 text-center">
            <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800">No Sales Records Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery ? "No sales match your search filter." : "No bikes have been marked as sold yet."}
            </p>
            <div className="mt-4">
              <Link
                href="/sales/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create New Sale</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Date & Invoice</th>
                  <th className="py-3 px-4">Bike Details</th>
                  <th className="py-3 px-4">Buyer Customer</th>
                  <th className="py-3 px-4">Agreed Price</th>
                  <th className="py-3 px-4">Profit Margin</th>
                  <th className="py-3 px-4">Payment Plan</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">
                        {sale.saleDate ? formatDate(sale.saleDate) : "—"}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        INV-{String(sale.id).padStart(5, "0")}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                          {sale.bike?.primaryPhoto ? (
                            <img
                              src={sale.bike.primaryPhoto}
                              alt={sale.bike.model}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Bike className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">
                            {sale.bike?.brand} {sale.bike?.model}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {sale.bike?.regNo || "No Reg"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">
                        {sale.customer?.name || "Customer"}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{sale.customer?.phone || "—"}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-black text-slate-900">
                      {formatINR(sale.agreedPrice)}
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                        <TrendingUp className="w-3 h-3" />
                        +{formatINR(sale.grossProfit || 0)}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {sale.paymentType === "FULL_CASH" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Full Cash
                        </span>
                      ) : (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200">
                            <Clock className="w-3 h-3" />
                            {sale.emiMonths}M EMI
                          </span>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Down: {formatINR(sale.downPayment || 0)}
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/daily-book`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                        title="View in Ledger Book"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Ledger</span>
                      </Link>
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
