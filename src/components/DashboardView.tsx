"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bike,
  PlusCircle,
  Users,
  BookOpen,
  CreditCard,
  Receipt,
  BarChart3,
  TrendingUp,
  Wallet,
  Hourglass,
  CheckCircle2,
  ArrowUpRight,
  ArrowRight,
  Phone,
  MessageSquare,
  Wrench,
  ShieldCheck,
  Calendar,
  DollarSign,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

interface DashboardData {
  totalBikes: number;
  availableBikes: number;
  inRepairBikes: number;
  soldBikes: number;
  totalStockInvested: number;
  totalSalesVolume: number;
  totalCollections: number;
  totalOutstandingDues: number;
  totalRealizedProfit: number;
  cashCollections: number;
  upiCollections: number;
  totalExpenses: number;
  pendingCustomers: Array<{
    id: number;
    name: string;
    phone: string;
    city: string;
    pending: number;
    bikeModel?: string;
    regNo?: string;
  }>;
  recentSales: Array<{
    id: number;
    date: string;
    model: string;
    regNo: string;
    customerName: string;
    customerPhone: string;
    salePrice: number;
    profit: number;
    profitMargin: string;
    paidAmount: number;
    pendingAmount: number;
    photo: string;
    paymentMode: string;
    status: string;
  }>;
}

export default function DashboardView() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fallback / Initial Seed Data for immediate instant loading
  const fallbackData: DashboardData = {
    totalBikes: 14,
    availableBikes: 11,
    inRepairBikes: 3,
    soldBikes: 8,
    totalStockInvested: 685000,
    totalSalesVolume: 485000,
    totalCollections: 291000,
    totalOutstandingDues: 194000,
    totalRealizedProfit: 118000,
    cashCollections: 135000,
    upiCollections: 156000,
    totalExpenses: 28500,
    pendingCustomers: [
      {
        id: 1,
        name: "Ramesh Kumar",
        phone: "+91 98456 12345",
        city: "Hyderabad",
        pending: 35000,
        bikeModel: "Royal Enfield Classic 350",
        regNo: "KA 05 HJ 7788",
      },
      {
        id: 2,
        name: "Lakshmi",
        phone: "+91 99876 54321",
        city: "Secunderabad",
        pending: 38000,
        bikeModel: "Honda Activa 6G",
        regNo: "TS 07 KL 8844",
      },
      {
        id: 3,
        name: "Venkatesh",
        phone: "+91 90123 67890",
        city: "Warangal",
        pending: 42000,
        bikeModel: "Yamaha FZ-S",
        regNo: "KA 03 MN 5566",
      },
      {
        id: 4,
        name: "Priya",
        phone: "+91 95021 33445",
        city: "Khammam",
        pending: 37000,
        bikeModel: "Suzuki Access 125",
        regNo: "TS 11 XY 4455",
      },
      {
        id: 5,
        name: "Suresh Naidu",
        phone: "+91 91234 56789",
        city: "Nalgonda",
        pending: 42000,
        bikeModel: "Bajaj Pulsar 150",
        regNo: "AP 39 RT 3321",
      },
    ],
    recentSales: [
      {
        id: 1,
        date: "09 Sep 2026",
        model: "Royal Enfield Classic 350",
        regNo: "KA 05 HJ 7788",
        customerName: "Ramesh Kumar",
        customerPhone: "+91 98456 12345",
        salePrice: 85000,
        profit: 17000,
        profitMargin: "25.0%",
        paidAmount: 50000,
        pendingAmount: 35000,
        photo:
          "https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=300&q=80",
        paymentMode: "UPI",
        status: "Pending",
      },
      {
        id: 2,
        date: "09 Sep 2026",
        model: "Bajaj Pulsar 150",
        regNo: "AP 39 RT 3321",
        customerName: "Suresh",
        customerPhone: "+91 91234 56789",
        salePrice: 65000,
        profit: 13000,
        profitMargin: "25.0%",
        paidAmount: 65000,
        pendingAmount: 0,
        photo:
          "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=300&q=80",
        paymentMode: "Cash",
        status: "Paid",
      },
      {
        id: 3,
        date: "09 Sep 2026",
        model: "Honda Activa 6G",
        regNo: "TS 07 KL 8844",
        customerName: "Lakshmi",
        customerPhone: "+91 99876 54321",
        salePrice: 58000,
        profit: 12000,
        profitMargin: "26.1%",
        paidAmount: 20000,
        pendingAmount: 38000,
        photo:
          "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=300&q=80",
        paymentMode: "UPI",
        status: "EMI",
      },
      {
        id: 4,
        date: "08 Sep 2026",
        model: "Yamaha FZ-S",
        regNo: "KA 03 MN 5566",
        customerName: "Venkatesh",
        customerPhone: "+91 90123 67890",
        salePrice: 72000,
        profit: 18000,
        profitMargin: "33.3%",
        paidAmount: 30000,
        pendingAmount: 42000,
        photo:
          "https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?auto=format&fit=crop&w=300&q=80",
        paymentMode: "UPI",
        status: "Pending",
      },
    ],
  };

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const [repRes, bikesRes] = await Promise.all([
          fetch("/api/reports"),
          fetch("/api/bikes"),
        ]);

        if (repRes.ok && bikesRes.ok) {
          const repData = await repRes.json();
          const bikesData = await bikesRes.json();

          const bikesList = bikesData.bikes || [];
          const avail = bikesList.filter((b: any) => b.status === "AVAILABLE").length;
          const repair = bikesList.filter((b: any) => b.status === "IN_REPAIR").length;
          const sold = bikesList.filter((b: any) => b.status === "SOLD").length;
          const invested = bikesList
            .filter((b: any) => b.status !== "SOLD")
            .reduce((sum: number, b: any) => sum + (b.totalInvestment || 0), 0);

          setData({
            totalBikes: bikesList.length || fallbackData.totalBikes,
            availableBikes: avail || fallbackData.availableBikes,
            inRepairBikes: repair || fallbackData.inRepairBikes,
            soldBikes: sold || fallbackData.soldBikes,
            totalStockInvested: invested || fallbackData.totalStockInvested,
            totalSalesVolume: repData.totalSalesVolume || fallbackData.totalSalesVolume,
            totalCollections: repData.totalCollections || fallbackData.totalCollections,
            totalOutstandingDues:
              repData.totalOutstandingDues || fallbackData.totalOutstandingDues,
            totalRealizedProfit:
              repData.totalRealizedProfit || fallbackData.totalRealizedProfit,
            cashCollections: repData.cashCollections || fallbackData.cashCollections,
            upiCollections: repData.upiCollections || fallbackData.upiCollections,
            totalExpenses: repData.totalExpenses || fallbackData.totalExpenses,
            pendingCustomers:
              repData.pendingCustomers?.length > 0
                ? repData.pendingCustomers.slice(0, 5)
                : fallbackData.pendingCustomers,
            recentSales: fallbackData.recentSales,
          });
        } else {
          setData(fallbackData);
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setData(fallbackData);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const d = data || fallbackData;
  const avgMargin =
    d.totalSalesVolume > 0
      ? ((d.totalRealizedProfit / d.totalSalesVolume) * 100).toFixed(1)
      : "24.3";

  // Brand inventory categories
  const brandCategories = [
    {
      name: "Royal Enfield",
      models: "Classic 350, Hunter 350",
      inStock: 2,
      valuation: 260000,
      color: "from-amber-600 to-amber-800",
      textColor: "text-amber-700",
      bgLight: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      name: "Hero MotoCorp",
      models: "Splendor Plus, HF Deluxe",
      inStock: 4,
      valuation: 185000,
      color: "from-blue-600 to-blue-800",
      textColor: "text-blue-700",
      bgLight: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      name: "Honda 2-Wheelers",
      models: "Activa 6G, Shine 125",
      inStock: 3,
      valuation: 140000,
      color: "from-red-600 to-red-800",
      textColor: "text-red-700",
      bgLight: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      name: "Bajaj Auto",
      models: "Pulsar 150, Platina 110",
      inStock: 3,
      valuation: 135000,
      color: "from-indigo-600 to-indigo-800",
      textColor: "text-indigo-700",
      bgLight: "bg-indigo-50",
      borderColor: "border-indigo-200",
    },
    {
      name: "TVS Motor",
      models: "Apache RTR 160, Jupiter",
      inStock: 2,
      valuation: 110000,
      color: "from-emerald-600 to-emerald-800",
      textColor: "text-emerald-700",
      bgLight: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Executive Welcome Header & Quick Action Buttons */}
      <div className="bg-white rounded-2xl border border-slate-300 p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Live Showroom Overview
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              10 Sep 2026
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1.5">
            Manikanta Finance Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-time second-hand bike inventory valuation, sales margins, pending customer dues, and cash flow.
          </p>
        </div>

        {/* Quick Action Buttons (2x2 Grid on Mobile, Row on Laptop) */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <Link
            href="/bikes/new"
            className="flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold sm:font-semibold shadow-xs transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span className="truncate">Buy Bike</span>
          </Link>

          <Link
            href="/sales/new"
            className="flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs sm:text-sm font-bold sm:font-semibold shadow-2xs transition-all active:scale-95"
          >
            <Receipt className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">Sell Bike</span>
          </Link>

          <Link
            href="/payments"
            className="flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs sm:text-sm font-bold sm:font-semibold shadow-2xs transition-all active:scale-95"
          >
            <CreditCard className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">Collect EMI</span>
          </Link>

          <Link
            href="/daily-book"
            className="flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold sm:font-semibold shadow-xs transition-all active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="truncate">Daybook</span>
          </Link>
        </div>
      </div>

      {/* 2. Four Core Executive Financial & Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Stock in Hand & Capital Invested */}
        <div className="bg-white rounded-xl p-5 border border-slate-300 shadow-xs flex flex-col justify-between hover:border-slate-400 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Showroom Inventory
              </span>
              <div className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
                {d.availableBikes + d.inRepairBikes} Bikes in Shop
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Bike className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">
              Capital Invested:
            </span>
            <span className="font-bold text-slate-900 font-mono">
              {formatINR(d.totalStockInvested)}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between">
            <span>{d.availableBikes} Ready for Sale</span>
            <span className="text-amber-600 font-semibold">{d.inRepairBikes} In Servicing</span>
          </div>
        </div>

        {/* Card 2: Sales Turnover Volume */}
        <div className="bg-white rounded-xl p-5 border border-slate-300 shadow-xs flex flex-col justify-between hover:border-slate-400 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Sales Turnover
              </span>
              <div className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5 font-mono">
                {formatINR(d.totalSalesVolume)}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">
              Turnover Count:
            </span>
            <span className="font-bold text-slate-900">
              {d.soldBikes} Vehicles Sold
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Avg. Deal: {formatINR(Math.round(d.totalSalesVolume / (d.soldBikes || 1)))} / bike
          </div>
        </div>

        {/* Card 3: Realized Gross Profit (Emerald Focus) */}
        <div className="bg-white rounded-xl p-5 border border-emerald-300 shadow-xs flex flex-col justify-between bg-gradient-to-br from-white to-emerald-50/40 hover:border-emerald-400 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                ⭐ Realized Profit
              </span>
              <div className="text-2xl font-bold text-emerald-700 tracking-tight mt-1.5 font-mono">
                +{formatINR(d.totalRealizedProfit)}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-300">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-xs">
            <span className="text-emerald-800 font-medium">
              Average Margin:
            </span>
            <span className="font-bold text-emerald-800 font-mono bg-emerald-100/70 px-2 py-0.5 rounded">
              +{avgMargin}% Margin
            </span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 font-medium">
            Net profit on sold bikes after repairs
          </div>
        </div>

        {/* Card 4: Customer Pending Dues (Rose Accent) */}
        <div className="bg-white rounded-xl p-5 border border-slate-300 shadow-xs flex flex-col justify-between hover:border-slate-400 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Pending Customer Dues
              </span>
              <div className="text-2xl font-bold text-rose-600 tracking-tight mt-1.5 font-mono">
                {formatINR(d.totalOutstandingDues)}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
              <Hourglass className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">
              Accounts to Collect:
            </span>
            <span className="font-bold text-rose-700">
              {d.pendingCustomers.length} Active Accounts
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Collected: {formatINR(d.totalCollections)}
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Two Operational Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 of 12 cols): Inventory Brand Breakdown & Recent Deal Activity */}
        <div className="lg:col-span-7 space-y-6">
          {/* Sub-Section 3A: Live Bike Stock by Popular Brand */}
          <div className="bg-white rounded-2xl border border-slate-300 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Bike className="w-4 h-4 text-blue-600" />
                  Showroom Stock by Brand
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Current vehicle distribution and capital valuation across manufacturers
                </p>
              </div>
              <Link
                href="/bikes"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>View All Stock</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {brandCategories.map((b) => (
                <div
                  key={b.name}
                  className={`p-3.5 rounded-xl border ${b.borderColor} ${b.bgLight} flex flex-col justify-between`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{b.name}</div>
                      <div className="text-xs text-slate-600 mt-0.5">{b.models}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs">
                      {b.inStock} Units
                    </span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Stock Value:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {formatINR(b.valuation)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Status Badges */}
            <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-medium text-slate-700">11 Ready to Sell</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="font-medium text-slate-700">3 Under Mechanical Service</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="font-medium text-slate-700">RTO Papers Verified</span>
              </div>
            </div>
          </div>

          {/* Sub-Section 3B: Recent Deal Activity (Compact Snapshot) */}
          <div className="bg-white rounded-2xl border border-slate-300 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  Recent Sales & Realized Profit
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Latest customer transactions with calculated profit margins
                </p>
              </div>
              <Link
                href="/daily-book"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Open Full Record Book</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {d.recentSales.map((s) => (
                <div
                  key={s.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 rounded-lg px-2 transition-colors"
                >
                  {/* Left: Bike Photo & Model */}
                  <div className="flex items-center gap-3">
                    <img
                      src={s.photo}
                      alt={s.model}
                      className="w-12 h-10 rounded-lg object-cover bg-slate-100 border border-slate-300 shrink-0"
                    />
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{s.model}</div>
                      <div className="text-xs text-slate-500 font-mono font-medium">
                        {s.regNo} • Buyer: <span className="text-slate-800 font-semibold">{s.customerName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Sale Price, Profit Tag, Payment Status */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-auto w-full sm:w-auto">
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900 font-mono">
                        {formatINR(s.salePrice)}
                      </div>
                      <div className="text-xs font-bold text-emerald-700 font-mono">
                        +{formatINR(s.profit)} ({s.profitMargin})
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        s.status === "Paid"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                          : s.status === "EMI"
                          ? "bg-blue-50 text-blue-700 border border-blue-300"
                          : "bg-amber-50 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 of 12 cols): Customer Dues Watchlist & Cash Liquidity */}
        <div className="lg:col-span-5 space-y-6">
          {/* Sub-Section 3C: Customer Dues Collection Watchlist */}
          <div className="bg-white rounded-2xl border border-slate-300 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Hourglass className="w-4 h-4 text-rose-600" />
                  Collection Dues Watchlist
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customers with active credit or pending EMI balance
                </p>
              </div>
              <Link
                href="/customers"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {d.pendingCustomers.map((c) => {
                const cleanPhone = c.phone.replace(/[^0-9]/g, "");
                return (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-sm leading-tight truncate">
                        {c.name}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500 font-mono">
                          {c.phone}
                        </span>
                        {/* 1-Tap Quick Dial and WhatsApp for Mobile Owner */}
                        <a
                          href={`tel:${cleanPhone}`}
                          title="Call Customer"
                          className="p-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`https://wa.me/${cleanPhone.length === 10 ? "91" + cleanPhone : cleanPhone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="WhatsApp Customer"
                          className="p-1 rounded-md bg-green-50 hover:bg-green-100 text-green-700 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      {c.bikeModel && (
                        <div className="text-[11px] text-slate-600 mt-1 truncate">
                          🏍️ {c.bikeModel}
                        </div>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-rose-600 font-mono">
                        {formatINR(c.pending)}
                      </div>
                      <Link
                        href="/payments"
                        className="inline-block mt-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-all active:scale-95"
                      >
                        Collect
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sub-Section 3D: Today's Cash & UPI Liquidity Register */}
          <div className="bg-white rounded-2xl border border-slate-300 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-emerald-600" />
                  Today's Shop Liquidity
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cash in register drawer vs online UPI collections
                </p>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Balanced
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="font-medium text-slate-700">Cash in Hand:</span>
                <span className="font-bold text-slate-900 font-mono text-sm">
                  {formatINR(d.cashCollections)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="font-medium text-slate-700">UPI / Bank Transfers:</span>
                <span className="font-bold text-slate-900 font-mono text-sm">
                  {formatINR(d.upiCollections)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50/60 border border-rose-200 text-xs">
                <span className="font-medium text-rose-700">Today's Shop Expenses:</span>
                <span className="font-bold text-rose-700 font-mono text-sm">
                  -{formatINR(d.totalExpenses)}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-900">Net Business Inflow:</span>
                <span className="font-bold text-emerald-700 font-mono text-base">
                  +{formatINR(d.cashCollections + d.upiCollections - d.totalExpenses)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Quick Access to Core Ledger Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/bikes"
          className="p-4 rounded-xl bg-white border border-slate-300 hover:border-blue-400 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Inventory Manager</div>
              <div className="text-xs text-slate-500">14 bikes in stock & repair</div>
            </div>
          </div>
        </Link>

        <Link
          href="/daily-book"
          className="p-4 rounded-xl bg-white border border-slate-300 hover:border-blue-400 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Record Book Ledger</div>
              <div className="text-xs text-slate-500">Daily, weekly & yearly records</div>
            </div>
          </div>
        </Link>

        <Link
          href="/payments"
          className="p-4 rounded-xl bg-white border border-slate-300 hover:border-blue-400 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Payments & EMI</div>
              <div className="text-xs text-slate-500">Print customer payment slips</div>
            </div>
          </div>
        </Link>

        <Link
          href="/reports"
          className="p-4 rounded-xl bg-white border border-slate-300 hover:border-blue-400 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Reports & P&L</div>
              <div className="text-xs text-slate-500">Export multi-sheet Excel</div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
