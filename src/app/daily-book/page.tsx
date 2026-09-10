"use client";

import { useState, useEffect } from "react";
import {
  Bike,
  Wallet,
  Hourglass,
  FileText,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit2,
  Printer,
  ChevronLeft,
  ChevronRight,
  Calendar,
  CreditCard,
  Phone,
  CheckCircle2,
  X,
  TrendingUp,
  LayoutGrid,
  List,
  AlertCircle,
  DollarSign,
  ArrowUpRight,
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import {
  format,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  addYears,
  subYears,
  startOfWeek,
  endOfWeek,
} from "date-fns";

export type PeriodType = "daily" | "weekly" | "monthly" | "yearly";

interface RecordItem {
  id: number;
  date: string;
  type: "Sale" | "Purchase";
  bike: {
    model: string;
    regNo: string;
    photo: string;
  };
  customer?: {
    name: string;
    phone: string;
    avatar: string;
  };
  purchaseCost: number;
  salePrice: number;
  profit: number;
  profitMargin: string;
  paidAmount: number;
  pendingAmount: number;
  paymentMode: "UPI" | "Cash" | "Bank Transfer";
  status: "Pending" | "Paid" | "EMI" | "Stock";
}

const MASTER_RECORDS: RecordItem[] = [
  {
    id: 1,
    date: "09 Sep 2026",
    type: "Sale",
    bike: {
      model: "Royal Enfield Classic 350",
      regNo: "KA 05 HJ 7788",
      photo: "https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=300&q=80",
    },
    customer: {
      name: "Ramesh Kumar",
      phone: "+91 98456 12345",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
    },
    purchaseCost: 68000,
    salePrice: 85000,
    profit: 17000,
    profitMargin: "25.0%",
    paidAmount: 50000,
    pendingAmount: 35000,
    paymentMode: "UPI",
    status: "Pending",
  },
  {
    id: 2,
    date: "09 Sep 2026",
    type: "Sale",
    bike: {
      model: "Bajaj Pulsar 150",
      regNo: "AP 39 RT 3321",
      photo: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=300&q=80",
    },
    customer: {
      name: "Suresh",
      phone: "+91 91234 56789",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80",
    },
    purchaseCost: 52000,
    salePrice: 65000,
    profit: 13000,
    profitMargin: "25.0%",
    paidAmount: 65000,
    pendingAmount: 0,
    paymentMode: "Cash",
    status: "Paid",
  },
  {
    id: 3,
    date: "09 Sep 2026",
    type: "Sale",
    bike: {
      model: "Honda Activa 6G",
      regNo: "TS 07 KL 8844",
      photo: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=300&q=80",
    },
    customer: {
      name: "Lakshmi",
      phone: "+91 99876 54321",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80",
    },
    purchaseCost: 46000,
    salePrice: 58000,
    profit: 12000,
    profitMargin: "26.1%",
    paidAmount: 20000,
    pendingAmount: 38000,
    paymentMode: "UPI",
    status: "EMI",
  },
  {
    id: 4,
    date: "08 Sep 2026",
    type: "Purchase",
    bike: {
      model: "TVS Apache RTR 160",
      regNo: "AP 28 AB 9911",
      photo: "https://images.unsplash.com/photo-1571188654248-7a89213915f7?auto=format&fit=crop&w=300&q=80",
    },
    purchaseCost: 42000,
    salePrice: 0,
    profit: 0,
    profitMargin: "-",
    paidAmount: 42000,
    pendingAmount: 0,
    paymentMode: "Bank Transfer",
    status: "Stock",
  },
  {
    id: 5,
    date: "08 Sep 2026",
    type: "Sale",
    bike: {
      model: "Yamaha FZ-S",
      regNo: "KA 03 MN 5566",
      photo: "https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?auto=format&fit=crop&w=300&q=80",
    },
    customer: {
      name: "Venkatesh",
      phone: "+91 90123 67890",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&h=120&q=80",
    },
    purchaseCost: 54000,
    salePrice: 72000,
    profit: 18000,
    profitMargin: "33.3%",
    paidAmount: 30000,
    pendingAmount: 42000,
    paymentMode: "UPI",
    status: "Pending",
  },
  {
    id: 6,
    date: "07 Sep 2026",
    type: "Sale",
    bike: {
      model: "Honda Shine",
      regNo: "TS 09 PQ 2211",
      photo: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=300&q=80",
    },
    customer: {
      name: "Arjun",
      phone: "+91 78901 23456",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&h=120&q=80",
    },
    purchaseCost: 43000,
    salePrice: 55000,
    profit: 12000,
    profitMargin: "27.9%",
    paidAmount: 55000,
    pendingAmount: 0,
    paymentMode: "Cash",
    status: "Paid",
  },
  {
    id: 7,
    date: "07 Sep 2026",
    type: "Purchase",
    bike: {
      model: "Hero Splendor Plus",
      regNo: "AP 16 ZZ 6677",
      photo: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=300&q=80",
    },
    purchaseCost: 28000,
    salePrice: 0,
    profit: 0,
    profitMargin: "-",
    paidAmount: 28000,
    pendingAmount: 0,
    paymentMode: "Cash",
    status: "Stock",
  },
  {
    id: 8,
    date: "06 Sep 2026",
    type: "Sale",
    bike: {
      model: "Suzuki Access 125",
      regNo: "TS 11 XY 4455",
      photo: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=300&q=80",
    },
    customer: {
      name: "Priya",
      phone: "+91 95021 33445",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
    },
    purchaseCost: 48000,
    salePrice: 62000,
    profit: 14000,
    profitMargin: "29.2%",
    paidAmount: 25000,
    pendingAmount: 37000,
    paymentMode: "UPI",
    status: "EMI",
  },
];

export default function RecordBookPage() {
  const [period, setPeriod] = useState<PeriodType>("daily");
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 8, 9)); // Sep 09, 2026
  const [activeTab, setActiveTab] = useState<"All" | "Sales" | "Purchases" | "Payments" | "EMI">("All");
  const [records, setRecords] = useState<RecordItem[]>(MASTER_RECORDS);
  const [search, setSearch] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<RecordItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Form State for Adding New Record
  const [newType, setNewType] = useState<"Sale" | "Purchase">("Sale");
  const [newBikeModel, setNewBikeModel] = useState("");
  const [newRegNo, setNewRegNo] = useState("");
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newPurchaseCost, setNewPurchaseCost] = useState("");
  const [newSalePrice, setNewSalePrice] = useState("");
  const [newPaidAmount, setNewPaidAmount] = useState("");
  const [newPaymentMode, setNewPaymentMode] = useState<"UPI" | "Cash" | "Bank Transfer">("UPI");
  const [newStatus, setNewStatus] = useState<"Pending" | "Paid" | "EMI" | "Stock">("Pending");

  // Date Navigation Handlers
  const handlePrev = () => {
    if (period === "daily") setCurrentDate((prev) => subDays(prev, 1));
    else if (period === "weekly") setCurrentDate((prev) => subWeeks(prev, 1));
    else if (period === "monthly") setCurrentDate((prev) => subMonths(prev, 1));
    else if (period === "yearly") setCurrentDate((prev) => subYears(prev, 1));
  };

  const handleNext = () => {
    if (period === "daily") setCurrentDate((prev) => addDays(prev, 1));
    else if (period === "weekly") setCurrentDate((prev) => addWeeks(prev, 1));
    else if (period === "monthly") setCurrentDate((prev) => addMonths(prev, 1));
    else if (period === "yearly") setCurrentDate((prev) => addYears(prev, 1));
  };

  const handleResetCurrent = () => {
    setCurrentDate(new Date(2026, 8, 9));
  };

  // Formatted Label for the active period
  const getPeriodLabel = () => {
    if (period === "daily") {
      return format(currentDate, "dd MMMM yyyy");
    } else if (period === "weekly") {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return `${format(start, "dd MMM")} - ${format(end, "dd MMM yyyy")} (Week ${format(currentDate, "w")})`;
    } else if (period === "monthly") {
      return format(currentDate, "MMMM yyyy");
    } else {
      return `Year ${format(currentDate, "yyyy")} (FY ${format(currentDate, "yyyy")}-${Number(format(currentDate, "yy")) + 1})`;
    }
  };

  // Dynamic Metrics based on period selection
  const getMetrics = () => {
    if (period === "daily") {
      return {
        sales: 208000,
        profit: 42000,
        profitSubtext: "Average 25.3% Margin",
        collected: 135000,
        collectedSubtext: "Cash: ₹45,000 | UPI: ₹90,000",
        pending: 73000,
        pendingSubtext: "From 6 Customers",
        transactions: 28,
        transSubtext: "Today's Ledger Entries",
      };
    } else if (period === "weekly") {
      return {
        sales: 840000,
        profit: 172000,
        profitSubtext: "From 16 Sold Two-Wheelers",
        collected: 590000,
        collectedSubtext: "Cash: ₹1,80,000 | UPI: ₹4,10,000",
        pending: 250000,
        pendingSubtext: "From 14 Active Accounts",
        transactions: 114,
        transSubtext: "Weekly Ledger Entries",
      };
    } else if (period === "monthly") {
      return {
        sales: 3450000,
        profit: 710000,
        profitSubtext: "From 64 Bikes Sold This Month",
        collected: 2480000,
        collectedSubtext: "Cash: ₹7,50,000 | UPI: ₹17,30,000",
        pending: 970000,
        pendingSubtext: "Total Booked Receivables",
        transactions: 486,
        transSubtext: "Monthly Ledger Entries",
      };
    } else {
      return {
        sales: 41200000,
        profit: 8420000,
        profitSubtext: "From 780 Annual Bike Sales",
        collected: 31400000,
        collectedSubtext: "Annual Banking & Cash Inflows",
        pending: 9800000,
        pendingSubtext: "Total Outstanding Loan Book",
        transactions: 5820,
        transSubtext: "Annual Financial Ledger Entries",
      };
    }
  };

  const metrics = getMetrics();

  // Filtered List
  const filteredRecords = records.filter((r) => {
    if (activeTab === "Sales" && r.type !== "Sale") return false;
    if (activeTab === "Purchases" && r.type !== "Purchase") return false;
    if (activeTab === "Payments" && r.type !== "Sale") return false;
    if (activeTab === "EMI" && r.status !== "EMI") return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchBike =
        r.bike.model.toLowerCase().includes(q) || r.bike.regNo.toLowerCase().includes(q);
      const matchCustomer =
        r.customer?.name.toLowerCase().includes(q) || r.customer?.phone.includes(q);
      return matchBike || matchCustomer;
    }
    return true;
  });

  // Calculate Table Column Totals
  const totalPurchaseCost = filteredRecords.reduce((sum, r) => sum + r.purchaseCost, 0);
  const totalSalesPrice = filteredRecords.reduce((sum, r) => sum + r.salePrice, 0);
  const totalProfit = filteredRecords.reduce((sum, r) => sum + r.profit, 0);
  const totalPaid = filteredRecords.reduce((sum, r) => sum + r.paidAmount, 0);
  const totalPending = filteredRecords.reduce((sum, r) => sum + r.pendingAmount, 0);

  const handleAddRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const purchaseNum = Number(newPurchaseCost) || 0;
    const saleNum = newType === "Sale" ? Number(newSalePrice) || 0 : 0;
    const paidNum = Number(newPaidAmount) || 0;
    const pendingNum = newType === "Sale" ? Math.max(0, saleNum - paidNum) : 0;
    const profitNum = newType === "Sale" ? Math.max(0, saleNum - purchaseNum) : 0;
    const marginStr =
      newType === "Sale" && purchaseNum > 0
        ? `${(((saleNum - purchaseNum) / purchaseNum) * 100).toFixed(1)}%`
        : "-";

    const newRecord: RecordItem = {
      id: records.length + 1,
      date: format(currentDate, "dd MMM yyyy"),
      type: newType,
      bike: {
        model: newBikeModel,
        regNo: newRegNo.toUpperCase().trim(),
        photo:
          "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=300&q=80",
      },
      customer:
        newType === "Sale"
          ? {
              name: newCustomerName.trim(),
              phone: newCustomerPhone.trim(),
              avatar:
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80",
            }
          : undefined,
      purchaseCost: purchaseNum,
      salePrice: saleNum,
      profit: profitNum,
      profitMargin: marginStr,
      paidAmount: paidNum,
      pendingAmount: pendingNum,
      paymentMode: newPaymentMode,
      status: newStatus,
    };

    setRecords([newRecord, ...records]);
    setShowAddModal(false);

    // Reset fields
    setNewBikeModel("");
    setNewRegNo("");
    setNewCustomerName("");
    setNewCustomerPhone("");
    setNewPurchaseCost("");
    setNewSalePrice("");
    setNewPaidAmount("");
  };

  return (
    <div className="space-y-6">
      {/* 1. Header: Title + Period Switcher (Daily, Weekly, Monthly, Yearly) */}
      <div className="bg-white rounded-xl border border-slate-300 p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Record Book
            </h1>
            <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-md border border-blue-200">
              Shop Daybook Ledger
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Complete records of vehicle sales, stock purchases, investment cost, profit margins, and dues.
          </p>
        </div>

        {/* Period Switcher (Daily, Weekly, Monthly, Yearly) */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Segmented Period Tabs */}
          <div className="inline-flex bg-slate-100 p-1 rounded-lg border border-slate-300 text-xs font-semibold">
            {[
              { id: "daily", label: "Daily" },
              { id: "weekly", label: "Weekly" },
              { id: "monthly", label: "Monthly" },
              { id: "yearly", label: "Yearly" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setPeriod(tab.id as PeriodType)}
                className={`px-3.5 py-1.5 rounded-md transition-all ${
                  period === tab.id
                    ? "bg-white text-blue-700 font-bold shadow-xs border border-slate-300"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Date / Period Navigator */}
          <div className="flex items-center bg-white border border-slate-300 rounded-lg p-1 shadow-2xs">
            <button
              onClick={handlePrev}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              title="Previous period"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 text-xs sm:text-sm font-semibold text-slate-800 whitespace-nowrap">
              {getPeriodLabel()}
            </span>

            <button
              onClick={handleNext}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              title="Next period"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleResetCurrent}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors"
          >
            Today
          </button>
        </div>
      </div>

      {/* 2. Five Financial Metric Cards (Including Profit Card!) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Metric 1: Sales Volume */}
        <div className="bg-white rounded-xl p-4 border border-slate-300 shadow-xs flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Sales Volume
            </span>
            <div className="text-xl font-bold text-slate-900 tracking-tight mt-1">
              {formatINR(metrics.sales)}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">{period} sales</div>
          </div>
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Bike className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2: ⭐ Realized Profit ⭐ */}
        <div className="bg-white rounded-xl p-4 border border-emerald-300 shadow-xs flex items-start justify-between bg-gradient-to-br from-white to-emerald-50/40">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
              ⭐ Realized Profit
            </span>
            <div className="text-xl font-bold text-emerald-700 tracking-tight mt-1">
              +{formatINR(metrics.profit)}
            </div>
            <div className="text-xs text-emerald-700 font-medium mt-0.5">
              {metrics.profitSubtext}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3: Collected Amount */}
        <div className="bg-white rounded-xl p-4 border border-slate-300 shadow-xs flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Collected Amount
            </span>
            <div className="text-xl font-bold text-emerald-600 tracking-tight mt-1">
              {formatINR(metrics.collected)}
            </div>
            <div className="text-xs text-slate-500 mt-0.5 truncate max-w-[120px]">
              {metrics.collectedSubtext}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4: Pending Receivables */}
        <div className="bg-white rounded-xl p-4 border border-slate-300 shadow-xs flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pending Amount
            </span>
            <div className="text-xl font-bold text-amber-600 tracking-tight mt-1">
              {formatINR(metrics.pending)}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">{metrics.pendingSubtext}</div>
          </div>
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
            <Hourglass className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 5: Total Transactions */}
        <div className="bg-white rounded-xl p-4 border border-slate-300 shadow-xs flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Transactions
            </span>
            <div className="text-xl font-bold text-slate-900 tracking-tight mt-1">
              {metrics.transactions}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">{metrics.transSubtext}</div>
          </div>
          <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Toolbar: Category Pills, Search, Export, Add Record */}
      <div className="bg-white rounded-xl border border-slate-300 p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: "All", label: "All Records" },
            { id: "Sales", label: "Sales" },
            { id: "Purchases", label: "Purchases" },
            { id: "Payments", label: "Collections" },
            { id: "EMI", label: "EMI Dues" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white font-bold"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search, Export by Option, Add Record */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search bike, customer, reg plate..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          {/* Export Dropdown with Period-Specific Options */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export Excel</span>
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-300 rounded-xl shadow-lg py-1.5 z-30 animate-in fade-in">
                <a
                  href={`/api/export?type=today&period=${period}`}
                  className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                >
                  Export Current View ({period})
                </a>
                <a
                  href="/api/export?type=today&period=weekly"
                  className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                >
                  Export Weekly Report (.xlsx)
                </a>
                <a
                  href="/api/export?type=today&period=monthly"
                  className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                >
                  Export Monthly Register (.xlsx)
                </a>
                <a
                  href="/api/export?type=full&period=yearly"
                  className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                >
                  Export Annual Audit File (.xlsx)
                </a>
              </div>
            )}
          </div>

          {/* + Add Record Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Record</span>
          </button>
        </div>
      </div>

      {/* 4. ⭐ STRUCTURED GRID TABLE WITH SEPARATE COLUMNS & PROFIT COLUMN ⭐ */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse border border-slate-300 text-sm">
            {/* Table Header: Distinct, Separate Columns with Visible Borders */}
            <thead className="bg-slate-100 text-slate-800 font-bold border-b-2 border-slate-300 text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3.5 border-r border-slate-300 w-12 text-center text-slate-500">
                  #
                </th>
                <th className="py-3 px-3.5 border-r border-slate-300 whitespace-nowrap">
                  Date
                </th>
                <th className="py-3 px-3.5 border-r border-slate-300 text-center whitespace-nowrap">
                  Type
                </th>
                <th className="py-3 px-3.5 border-r border-slate-300 whitespace-nowrap min-w-[200px]">
                  Bike Details
                </th>
                <th className="py-3 px-3.5 border-r border-slate-300 whitespace-nowrap min-w-[170px]">
                  Customer / Buyer
                </th>
                <th className="py-3 px-3.5 border-r border-slate-300 text-right whitespace-nowrap bg-slate-50/70">
                  Purchase Cost (₹)
                </th>
                <th className="py-3 px-3.5 border-r border-slate-300 text-right whitespace-nowrap bg-slate-50/70">
                  Selling Price (₹)
                </th>
                {/* ⭐ PROFIT COLUMN ⭐ */}
                <th className="py-3 px-3.5 border-r border-slate-300 text-right whitespace-nowrap bg-emerald-100/70 text-emerald-950 font-black">
                  ⭐ Profit (₹)
                </th>
                <th className="py-3 px-3.5 border-r border-slate-300 text-right whitespace-nowrap">
                  Paid Amount (₹)
                </th>
                <th className="py-3 px-3.5 border-r border-slate-300 text-right whitespace-nowrap">
                  Pending Due (₹)
                </th>
                <th className="py-3 px-3.5 border-r border-slate-300 text-center whitespace-nowrap">
                  Payment Mode
                </th>
                <th className="py-3 px-3.5 border-r border-slate-300 text-center whitespace-nowrap">
                  Status
                </th>
                <th className="py-3 px-3.5 text-center whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body: Separate Bordered Grid Cells */}
            <tbody className="divide-y divide-slate-200">
              {filteredRecords.map((r, idx) => (
                <tr
                  key={r.id}
                  className="hover:bg-blue-50/40 transition-colors even:bg-slate-50/40"
                >
                  {/* Column 1: Row # */}
                  <td className="py-3 px-3.5 border-r border-slate-200 text-center font-mono text-xs text-slate-500">
                    {idx + 1}
                  </td>

                  {/* Column 2: Date */}
                  <td className="py-3 px-3.5 border-r border-slate-200 whitespace-nowrap text-xs font-medium text-slate-700">
                    {r.date}
                  </td>

                  {/* Column 3: Type Badge */}
                  <td className="py-3 px-3.5 border-r border-slate-200 text-center whitespace-nowrap">
                    {r.type === "Sale" ? (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                        Sale
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-300">
                        Purchase
                      </span>
                    )}
                  </td>

                  {/* Column 4: Bike Details (Image, Model, Reg plate) */}
                  <td className="py-3 px-3.5 border-r border-slate-200">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={r.bike.photo}
                        alt={r.bike.model}
                        className="w-11 h-9 rounded-md object-cover bg-slate-100 shrink-0 border border-slate-300 shadow-2xs"
                      />
                      <div>
                        <div className="font-bold text-slate-900 text-sm leading-snug">
                          {r.bike.model}
                        </div>
                        <div className="text-xs text-slate-600 font-mono tracking-wider font-semibold">
                          {r.bike.regNo}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Column 5: Customer (Avatar, Name, Phone) */}
                  <td className="py-3 px-3.5 border-r border-slate-200">
                    {r.customer ? (
                      <div className="flex items-center gap-2.5">
                        <img
                          src={r.customer.avatar}
                          alt={r.customer.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-300"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-sm leading-snug">
                            {r.customer.name}
                          </div>
                          <div className="text-xs text-slate-500 font-mono">
                            {r.customer.phone}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 font-mono pl-4 italic">
                        — (Shop Stock)
                      </span>
                    )}
                  </td>

                  {/* Column 6: Purchase Cost (₹) */}
                  <td className="py-3 px-3.5 border-r border-slate-200 text-right font-mono text-sm font-semibold text-slate-700 whitespace-nowrap bg-slate-50/50">
                    {formatINR(r.purchaseCost)}
                  </td>

                  {/* Column 7: Selling Price (₹) */}
                  <td className="py-3 px-3.5 border-r border-slate-200 text-right font-mono text-sm font-bold text-slate-900 whitespace-nowrap bg-slate-50/50">
                    {r.salePrice > 0 ? formatINR(r.salePrice) : <span className="text-slate-400">—</span>}
                  </td>

                  {/* Column 8: ⭐ PROFIT COLUMN (Highlighted with green tint) ⭐ */}
                  <td className="py-3 px-3.5 border-r border-slate-200 text-right font-mono whitespace-nowrap bg-emerald-50/60">
                    {r.type === "Sale" ? (
                      <div>
                        <span className="font-bold text-emerald-700 text-sm">
                          +{formatINR(r.profit)}
                        </span>
                        <span className="block text-[11px] text-emerald-800 font-semibold">
                          ({r.profitMargin})
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        In Stock
                      </span>
                    )}
                  </td>

                  {/* Column 9: Paid Amount (₹) */}
                  <td className="py-3 px-3.5 border-r border-slate-200 text-right font-mono text-sm font-bold text-emerald-600 whitespace-nowrap">
                    {formatINR(r.paidAmount)}
                  </td>

                  {/* Column 10: Pending Due (₹) */}
                  <td
                    className={`py-3 px-3.5 border-r border-slate-200 text-right font-mono text-sm font-bold whitespace-nowrap ${
                      r.pendingAmount > 0 ? "text-rose-600 bg-rose-50/30" : "text-emerald-700"
                    }`}
                  >
                    {formatINR(r.pendingAmount)}
                  </td>

                  {/* Column 11: Payment Mode */}
                  <td className="py-3 px-3.5 border-r border-slate-200 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                      {r.paymentMode}
                    </span>
                  </td>

                  {/* Column 12: Status */}
                  <td className="py-3 px-3.5 border-r border-slate-200 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        r.status === "Pending"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : r.status === "Paid"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : r.status === "EMI"
                          ? "bg-blue-100 text-blue-800 border border-blue-300"
                          : "bg-purple-100 text-purple-800 border border-purple-300"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>

                  {/* Column 13: Actions */}
                  <td className="py-3 px-3.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setSelectedRecord(r)}
                        className="p-1.5 rounded-md text-slate-500 hover:text-blue-700 hover:bg-slate-100 border border-transparent hover:border-slate-300 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedRecord(r)}
                        className="p-1.5 rounded-md text-slate-500 hover:text-blue-700 hover:bg-slate-100 border border-transparent hover:border-slate-300 transition-colors"
                        title="Edit Record"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="p-1.5 rounded-md text-slate-500 hover:text-blue-700 hover:bg-slate-100 border border-transparent hover:border-slate-300 transition-colors"
                        title="Print Receipt"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

            {/* Table Footer: Column-by-Column Totals */}
            <tfoot className="bg-slate-900 text-white font-bold border-t-2 border-slate-950">
              <tr>
                <td colSpan={5} className="py-3.5 px-4 text-right border-r border-slate-700 text-slate-300 text-xs uppercase tracking-wider">
                  Total Summary ({filteredRecords.length} Records):
                </td>
                {/* Total Cost */}
                <td className="py-3.5 px-3.5 text-right border-r border-slate-700 font-mono text-sm text-slate-200">
                  {formatINR(totalPurchaseCost)}
                </td>
                {/* Total Sales */}
                <td className="py-3.5 px-3.5 text-right border-r border-slate-700 font-mono text-sm text-slate-200">
                  {formatINR(totalSalesPrice)}
                </td>
                {/* ⭐ Total Profit ⭐ */}
                <td className="py-3.5 px-3.5 text-right border-r border-slate-700 font-mono text-sm text-emerald-400 bg-emerald-950/60">
                  +{formatINR(totalProfit)}
                </td>
                {/* Total Paid */}
                <td className="py-3.5 px-3.5 text-right border-r border-slate-700 font-mono text-sm text-emerald-400">
                  {formatINR(totalPaid)}
                </td>
                {/* Total Pending */}
                <td className="py-3.5 px-3.5 text-right border-r border-slate-700 font-mono text-sm text-amber-400">
                  {formatINR(totalPending)}
                </td>
                <td colSpan={3} className="py-3.5 px-4 text-slate-400 text-xs">
                  Net Ledger Balance
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Table Pagination */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 font-medium">
          <div>Showing 1 to {filteredRecords.length} of 128 records</div>
          <div className="flex items-center gap-1.5 self-center">
            <button className="w-8 h-8 rounded-md border border-slate-300 flex items-center justify-center hover:bg-white text-slate-600">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-md bg-blue-600 text-white font-bold flex items-center justify-center">
              1
            </button>
            <button className="w-8 h-8 rounded-md border border-slate-300 flex items-center justify-center hover:bg-white text-slate-700">
              2
            </button>
            <button className="w-8 h-8 rounded-md border border-slate-300 flex items-center justify-center hover:bg-white text-slate-700">
              3
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button className="w-8 h-8 rounded-md border border-slate-300 flex items-center justify-center hover:bg-white text-slate-700">
              16
            </button>
            <button className="w-8 h-8 rounded-md border border-slate-300 flex items-center justify-center hover:bg-white text-slate-600">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. View Record Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Transaction #{selectedRecord.id} Details
                </h3>
                <span className="text-xs text-slate-500">
                  Date: {selectedRecord.date} • Type: {selectedRecord.type}
                </span>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <img
                src={selectedRecord.bike.photo}
                alt={selectedRecord.bike.model}
                className="w-16 h-12 rounded-lg object-cover"
              />
              <div>
                <div className="font-semibold text-slate-900 text-sm">
                  {selectedRecord.bike.model}
                </div>
                <div className="text-xs font-mono text-slate-600">
                  Registration: {selectedRecord.bike.regNo}
                </div>
              </div>
            </div>

            {selectedRecord.customer && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="font-semibold text-slate-500">Customer Details:</div>
                <div className="font-bold text-slate-900 text-sm">
                  {selectedRecord.customer.name}
                </div>
                <div className="font-mono text-slate-600">
                  Phone: {selectedRecord.customer.phone}
                </div>
              </div>
            )}

            {/* Financial Grid */}
            <div className="grid grid-cols-3 gap-2 text-center p-3.5 bg-slate-100 rounded-xl text-xs">
              <div>
                <div className="text-slate-500">Purchase Cost</div>
                <div className="font-bold text-sm text-slate-900 mt-0.5">
                  {formatINR(selectedRecord.purchaseCost)}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Selling Price</div>
                <div className="font-bold text-sm text-slate-900 mt-0.5">
                  {selectedRecord.salePrice > 0 ? formatINR(selectedRecord.salePrice) : "—"}
                </div>
              </div>
              <div className="bg-emerald-50 p-1.5 rounded-lg border border-emerald-200">
                <div className="text-emerald-800 font-bold">Net Profit</div>
                <div className="font-bold text-sm text-emerald-700 mt-0.5">
                  +{formatINR(selectedRecord.profit)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center p-3 bg-slate-50 rounded-xl text-xs">
              <div>
                <span className="text-slate-500">Paid Amount:</span>
                <span className="font-bold text-emerald-600 ml-1">
                  {formatINR(selectedRecord.paidAmount)}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Pending Due:</span>
                <span className="font-bold text-rose-600 ml-1">
                  {formatINR(selectedRecord.pendingAmount)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-600 font-medium">
                Payment Channel:{" "}
                <span className="font-bold text-slate-900">
                  {selectedRecord.paymentMode}
                </span>
              </span>
              <span className="text-slate-600 font-medium">
                Status:{" "}
                <span className="font-bold text-slate-900">
                  {selectedRecord.status}
                </span>
              </span>
            </div>

            <div className="flex gap-2.5 pt-4 border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Customer Bill
              </button>
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Add Record Modal with Purchase Cost, Selling Price, and Live Profit Calculation */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl my-8">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Add Entry to Record Book
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter vehicle, purchase investment, and sale details to record profit automatically.
            </p>

            <form onSubmit={handleAddRecordSubmit} className="space-y-3.5">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNewType("Sale")}
                  className={`py-2 text-xs font-bold rounded-xl border ${
                    newType === "Sale"
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  Vehicle Sale
                </button>
                <button
                  type="button"
                  onClick={() => setNewType("Purchase")}
                  className={`py-2 text-xs font-bold rounded-xl border ${
                    newType === "Purchase"
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  Stock Purchase
                </button>
              </div>

              {/* Bike Details */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Bike Model *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pulsar 150"
                    value={newBikeModel}
                    onChange={(e) => setNewBikeModel(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Reg Plate No *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AP 39 RT 3321"
                    value={newRegNo}
                    onChange={(e) => setNewRegNo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono uppercase"
                  />
                </div>
              </div>

              {/* Customer details if sale */}
              {newType === "Sale" && (
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={newCustomerName}
                      onChange={(e) => setNewCustomerName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Customer Phone *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98456 12345"
                      value={newCustomerPhone}
                      onChange={(e) => setNewCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Purchase Cost & Sale Price */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Purchase Cost (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="52000"
                    value={newPurchaseCost}
                    onChange={(e) => setNewPurchaseCost(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                  />
                </div>
                {newType === "Sale" ? (
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="65000"
                      value={newSalePrice}
                      onChange={(e) => setNewSalePrice(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Amount Paid (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="52000"
                      value={newPaidAmount}
                      onChange={(e) => setNewPaidAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-emerald-700"
                    />
                  </div>
                )}
              </div>

              {/* Live Profit Preview for Sale */}
              {newType === "Sale" && Number(newSalePrice) > 0 && Number(newPurchaseCost) > 0 && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs font-semibold">
                  <span className="text-emerald-800">Projected Profit Margin:</span>
                  <span className="font-bold text-emerald-700 text-sm">
                    +{formatINR(Number(newSalePrice) - Number(newPurchaseCost))} (
                    {(((Number(newSalePrice) - Number(newPurchaseCost)) / Number(newPurchaseCost)) * 100).toFixed(1)}%)
                  </span>
                </div>
              )}

              {newType === "Sale" && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Initial Paid / Down Payment (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="35000"
                    value={newPaidAmount}
                    onChange={(e) => setNewPaidAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-emerald-700"
                  />
                </div>
              )}

              {/* Mode & Status */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={newPaymentMode}
                    onChange={(e) => setNewPaymentMode(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="EMI">EMI</option>
                    <option value="Stock">Stock</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2.5 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  Save to Record Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
