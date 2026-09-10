"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bike as BikeIcon,
  PlusCircle,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Printer,
  Sparkles,
  Wrench,
  KeyRound,
  Tag,
  RefreshCw,
  Eye,
  Camera,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

// 1-Click Popular 2-Wheeler Presets for Telangana / AP Market
const BIKE_PRESETS = [
  {
    name: "Royal Enfield Classic 350",
    brand: "Royal Enfield",
    model: "Classic 350",
    year: 2022,
    typicalPurchase: 130000,
    typicalSelling: 160000,
    photo: "https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=600&q=80",
    badge: "Cruiser",
  },
  {
    name: "Honda Activa 6G",
    brand: "Honda",
    model: "Activa 6G",
    year: 2023,
    typicalPurchase: 48000,
    typicalSelling: 62000,
    photo: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80",
    badge: "Scooter",
  },
  {
    name: "Hero Splendor Plus",
    brand: "Hero",
    model: "Splendor Plus i3S",
    year: 2022,
    typicalPurchase: 42000,
    typicalSelling: 55000,
    photo: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80",
    badge: "Mileage",
  },
  {
    name: "Bajaj Pulsar 150",
    brand: "Bajaj",
    model: "Pulsar 150 Twin Disc",
    year: 2021,
    typicalPurchase: 55000,
    typicalSelling: 72000,
    photo: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80",
    badge: "Commuter",
  },
  {
    name: "TVS Jupiter 110",
    brand: "TVS",
    model: "Jupiter ZX Disc",
    year: 2022,
    typicalPurchase: 46000,
    typicalSelling: 59000,
    photo: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80",
    badge: "Family",
  },
  {
    name: "Yamaha FZ-S V3",
    brand: "Yamaha",
    model: "FZ-S V3 FI",
    year: 2022,
    typicalPurchase: 65000,
    typicalSelling: 84000,
    photo: "https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?auto=format&fit=crop&w=600&q=80",
    badge: "Sports",
  },
  {
    name: "Suzuki Access 125",
    brand: "Suzuki",
    model: "Access 125 Special Edition",
    year: 2023,
    typicalPurchase: 52000,
    typicalSelling: 68000,
    photo: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80",
    badge: "Scooter",
  },
];

export default function ShopOwnerBikeBuyingPage() {
  const router = useRouter();

  // Form State - Vehicle Specifications
  const [brand, setBrand] = useState("Honda");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(2022);
  const [regNo, setRegNo] = useState("");
  const [engineNo, setEngineNo] = useState("");
  const [chassisNo, setChassisNo] = useState("");
  const [odometer, setOdometer] = useState("");
  const [color, setColor] = useState("Black");
  const [status, setStatus] = useState("AVAILABLE");
  const [primaryPhoto, setPrimaryPhoto] = useState(
    "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80"
  );

  // Form State - Financials
  const [purchasePrice, setPurchasePrice] = useState("");
  const [repairCost, setRepairCost] = useState("0");
  const [expectedSellingPrice, setExpectedSellingPrice] = useState("");
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [purchaseDate, setPurchaseDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [recordExpense, setRecordExpense] = useState(true);

  // Form State - Seller Information
  const [sellerName, setSellerName] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");
  const [sellerCity, setSellerCity] = useState("Miryalaguda");
  const [sellerAadhar, setSellerAadhar] = useState("");

  // Form State - Legal RC & Document Checklist
  const [docsChecked, setDocsChecked] = useState({
    originalRc: true,
    insuranceValid: true,
    form29Signed: true,
    form30Signed: true,
    twoKeys: true,
    pucValid: true,
    policeClear: true,
  });

  // Inspection Checklist & Notes
  const [inspectionCondition, setInspectionCondition] = useState({
    tyreCondition: "Good (75%+)",
    batteryStatus: "Healthy (Self Start OK)",
    engineSound: "Smooth (No smoke)",
    bodyCondition: "Original Paint (Minor Scratches)",
  });
  const [notes, setNotes] = useState("");

  // Submission & Voucher State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdBike, setCreatedBike] = useState<any | null>(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  // Calculations
  const numPurchase = Number(purchasePrice) || 0;
  const numRepair = Number(repairCost) || 0;
  const totalInvestment = numPurchase + numRepair;
  const numExpectedSale = Number(expectedSellingPrice) || 0;
  const projectedProfit = numExpectedSale > 0 ? numExpectedSale - totalInvestment : 0;
  const marginPercentage =
    totalInvestment > 0 && numExpectedSale > 0
      ? ((projectedProfit / totalInvestment) * 100).toFixed(1)
      : "0";

  // Handle Preset Quick Click
  const handleApplyPreset = (preset: (typeof BIKE_PRESETS)[0]) => {
    setBrand(preset.brand);
    setModel(preset.model);
    setYear(preset.year);
    setPurchasePrice(String(preset.typicalPurchase));
    setExpectedSellingPrice(String(preset.typicalSelling));
    setPrimaryPhoto(preset.photo);
    if (!regNo) {
      setRegNo("TS ");
    }
  };

  const handleDocToggle = (key: keyof typeof docsChecked) => {
    setDocsChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!brand || !model.trim() || !regNo.trim()) {
      setError("Please fill in Brand, Model, and Vehicle Registration Number.");
      return;
    }

    if (!numPurchase || numPurchase <= 0) {
      setError("Please specify a valid Purchase Price paid to seller.");
      return;
    }

    if (!numExpectedSale || numExpectedSale <= 0) {
      setError("Please specify an Expected Selling Price.");
      return;
    }

    if (!sellerName.trim() || !sellerPhone.trim()) {
      setError("Please provide the Seller Name and Phone Number.");
      return;
    }

    setLoading(true);

    try {
      // Assemble full inspection & document notes
      const verifiedDocsList = Object.entries(docsChecked)
        .filter(([_, v]) => v)
        .map(([k]) => k);

      const inspectionSummary = `[INSPECTION] Tyres: ${inspectionCondition.tyreCondition} | Battery: ${inspectionCondition.batteryStatus} | Engine: ${inspectionCondition.engineSound} | Body: ${inspectionCondition.bodyCondition}. ${notes ? `Notes: ${notes}` : ""}`;

      const payload = {
        brand,
        model: model.trim(),
        year: Number(year),
        regNo: regNo.toUpperCase().trim(),
        engineNo: engineNo.trim() || "N/A",
        chassisNo: chassisNo.trim() || "N/A",
        purchasePrice: numPurchase,
        repairCost: numRepair,
        expectedSellingPrice: numExpectedSale,
        sellerName: sellerName.trim(),
        sellerPhone: `${sellerPhone.trim()}${sellerCity ? ` (${sellerCity})` : ""}`,
        notes: `${inspectionSummary}${sellerAadhar ? ` [Aadhaar: ${sellerAadhar}]` : ""}`,
        primaryPhoto,
        status,
        purchaseDate,
        paymentMode,
        recordExpense,
        documents: verifiedDocsList,
      };

      const res = await fetch("/api/bikes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to record bike purchase entry.");
      }

      setCreatedBike(data.bike);
      setShowVoucherModal(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header & Breadcrumbs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <Link href="/bikes" className="hover:text-blue-600 transition-colors">
              Bike Inventory
            </Link>
            <span>/</span>
            <span className="text-blue-700">Stock Buying Entry</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
              <BikeIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Shop Owner Bike Buying Entry
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Record vehicle purchases into showroom inventory, compute margins, verify RTO documents, and generate purchase vouchers.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/bikes"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Inventory</span>
          </Link>
          <Link
            href="/daily-book"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Daily Ledger</span>
          </Link>
        </div>
      </div>

      {/* 2. 1-Click Fast Popular Bike Presets Bar */}
      <div className="bg-gradient-to-r from-blue-50/70 via-slate-50 to-indigo-50/70 rounded-2xl border border-blue-100 p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              1-Click Popular Vehicle Presets
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              (Auto-fills brand, model, image, and estimated benchmark prices)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory touch-pan-x -mx-1 px-1">
          {BIKE_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="group shrink-0 snap-start flex items-center gap-2 px-3.5 py-2 sm:py-1.5 rounded-xl bg-white hover:bg-blue-600 hover:text-white border border-slate-200 text-slate-700 text-xs font-medium shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <img
                src={preset.photo}
                alt={preset.name}
                className="w-7 h-7 sm:w-6 sm:h-6 rounded-md object-cover shrink-0"
              />
              <span className="font-semibold">{preset.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 group-hover:bg-blue-700 group-hover:text-white shrink-0">
                {preset.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-xs font-medium">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <strong className="block font-bold">Entry Validation Error</strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* 4. Main Purchase Entry Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Specifications, Seller & Document Verification (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Vehicle Specifications */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                  <BikeIcon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  1. Vehicle Specifications
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                Required for Showroom RC
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Manufacturer / Brand <span className="text-rose-500">*</span>
                </label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Honda">Honda</option>
                  <option value="Hero">Hero MotoCorp</option>
                  <option value="Bajaj">Bajaj Auto</option>
                  <option value="TVS">TVS Motor</option>
                  <option value="Yamaha">Yamaha</option>
                  <option value="Royal Enfield">Royal Enfield</option>
                  <option value="Suzuki">Suzuki</option>
                  <option value="KTM">KTM</option>
                  <option value="Other">Other Two-Wheeler</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Model Name & Variant <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. Classic 350 / Activa 6G"
                  className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Registration No. (Number Plate) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value.toUpperCase())}
                  placeholder="e.g. TS 08 AB 1234 or AP 29 BZ 7788"
                  className="w-full px-3 py-2 font-mono uppercase bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Year of Manufacture <span className="text-rose-500">*</span>
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                >
                  {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map(
                    (yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chassis Number (Last 6 or Full)
                </label>
                <input
                  type="text"
                  value={chassisNo}
                  onChange={(e) => setChassisNo(e.target.value.toUpperCase())}
                  placeholder="e.g. ME4JC5078..."
                  className="w-full px-3 py-2 font-mono uppercase bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Engine Number
                </label>
                <input
                  type="text"
                  value={engineNo}
                  onChange={(e) => setEngineNo(e.target.value.toUpperCase())}
                  placeholder="e.g. JC50E789..."
                  className="w-full px-3 py-2 font-mono uppercase bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Odometer Reading (KM)
                </label>
                <input
                  type="number"
                  value={odometer}
                  onChange={(e) => setOdometer(e.target.value)}
                  placeholder="e.g. 18450"
                  className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Body Color & Showroom Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="Color: Black, Red..."
                    className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-blue-600"
                  />
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                  >
                    <option value="AVAILABLE">Ready for Sale</option>
                    <option value="IN_REPAIR">In Servicing / Repair</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Seller & Previous Owner Information */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
                  <User className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  2. Seller / Previous Owner Details
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600">
                Purchase Deed Legal Party
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Seller Full Name (As per RC) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    placeholder="e.g. Venkata Rao"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Seller Mobile Phone <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    placeholder="e.g. 98480 12345"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Town / Village / City
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={sellerCity}
                    onChange={(e) => setSellerCity(e.target.value)}
                    placeholder="e.g. Miryalaguda / Suryapet"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Aadhaar / ID Card Number (Optional)
                </label>
                <input
                  type="text"
                  value={sellerAadhar}
                  onChange={(e) => setSellerAadhar(e.target.value)}
                  placeholder="e.g. 4589 1234 5678"
                  className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Legal RTO & Document Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  3. Legal Document & RTO Handover Checklist
                </h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                100% Verified Stock
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={docsChecked.originalRc}
                  onChange={() => handleDocToggle("originalRc")}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Original RC Book / Smart Card
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={docsChecked.form29Signed}
                  onChange={() => handleDocToggle("form29Signed")}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Signed Form 29 (Notice of Transfer)
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={docsChecked.form30Signed}
                  onChange={() => handleDocToggle("form30Signed")}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Signed Form 30 (RTO Application)
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={docsChecked.insuranceValid}
                  onChange={() => handleDocToggle("insuranceValid")}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Valid Insurance Copy
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={docsChecked.twoKeys}
                  onChange={() => handleDocToggle("twoKeys")}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Original Keys Received (2/2)
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={docsChecked.policeClear}
                  onChange={() => handleDocToggle("policeClear")}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Police & E-Challan Theft Verified
                </span>
              </label>
            </div>
          </div>

          {/* Card 4: Vehicle Inspection & Condition */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                  <Wrench className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  4. Vehicle Inspection & Condition Notes
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                Mechanic Inspection
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Tyres Condition
                </label>
                <select
                  value={inspectionCondition.tyreCondition}
                  onChange={(e) =>
                    setInspectionCondition({
                      ...inspectionCondition,
                      tyreCondition: e.target.value,
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                >
                  <option>Brand New (95%+)</option>
                  <option>Good (75%+)</option>
                  <option>Medium (50%)</option>
                  <option>Needs Front Tyre</option>
                  <option>Needs Rear Tyre</option>
                  <option>Both Tyres Replacement Required</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Battery Status
                </label>
                <select
                  value={inspectionCondition.batteryStatus}
                  onChange={(e) =>
                    setInspectionCondition({
                      ...inspectionCondition,
                      batteryStatus: e.target.value,
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                >
                  <option>Healthy (Self Start OK)</option>
                  <option>Under Warranty</option>
                  <option>Weak Battery (Kick Start only)</option>
                  <option>New Battery Replacement Required</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Engine Sound & Exhaust
                </label>
                <select
                  value={inspectionCondition.engineSound}
                  onChange={(e) =>
                    setInspectionCondition({
                      ...inspectionCondition,
                      engineSound: e.target.value,
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                >
                  <option>Smooth (No smoke, clean sound)</option>
                  <option>Oil Service Required</option>
                  <option>Minor Tappet Noise</option>
                  <option>Engine Clutch Work Needed</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Body & Paint Condition
                </label>
                <select
                  value={inspectionCondition.bodyCondition}
                  onChange={(e) =>
                    setInspectionCondition({
                      ...inspectionCondition,
                      bodyCondition: e.target.value,
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                >
                  <option>Original Paint (Minor Scratches)</option>
                  <option>Mint Condition (Zero Scratches)</option>
                  <option>Visor / Mirror Replacement Needed</option>
                  <option>Dents on Fuel Tank</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Additional Shop Owner Remarks
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Single owner vehicle, bought directly from teacher, service history verified at authorized service station."
                className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Financial Investment & Live Margins (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 5: Shop Owner Financials */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <DollarSign className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  5. Financials & Margins
                </h3>
              </div>
              <span className="text-[11px] font-bold text-slate-500 uppercase">
                Capital Ledger
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Purchase Price Paid to Seller (₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2 text-sm font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    placeholder="e.g. 48000"
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Initial Refurbishment / Servicing Cost Estimate (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2 text-sm font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={repairCost}
                    onChange={(e) => setRepairCost(e.target.value)}
                    placeholder="0"
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Total Investment Highlight Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    Total Investment
                  </span>
                  <div className="text-xs text-slate-500">
                    Purchase Price + Initial Repair
                  </div>
                </div>
                <div className="text-lg font-black text-slate-900 font-mono">
                  {formatINR(totalInvestment)}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Expected / Listing Selling Price (₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2 text-sm font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    value={expectedSellingPrice}
                    onChange={(e) => setExpectedSellingPrice(e.target.value)}
                    placeholder="e.g. 62000"
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Real-time Gross Profit Margin Box */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  projectedProfit > 0
                    ? "bg-emerald-50/70 border-emerald-200"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>Projected Gross Margin</span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      Number(marginPercentage) >= 20
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    +{marginPercentage}% ROI
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-xs text-emerald-700 font-medium">
                    Estimated Profit:
                  </span>
                  <span className="text-xl font-extrabold text-emerald-700 font-mono">
                    +{formatINR(projectedProfit)}
                  </span>
                </div>
              </div>

              {/* Payment Mode Paid to Seller */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Paid via Mode
                  </label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  >
                    <option value="CASH">Counter Cash</option>
                    <option value="UPI">UPI (PhonePe / GPay)</option>
                    <option value="BANK_TRANSFER">Bank Transfer (IMPS)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>
              </div>

              {/* Auto Record Expense in Cash Book */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/50 border border-blue-100 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={recordExpense}
                  onChange={(e) => setRecordExpense(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 mt-0.5"
                />
                <div className="text-slate-700">
                  <strong className="block text-slate-900">
                    Record in Daily Cash/Expense Book
                  </strong>
                  Automatically debit {paymentMode} balance in the daily ledger for this bike purchase.
                </div>
              </label>
            </div>
          </div>

          {/* Card 6: Bike Photo Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase">
                Showroom Vehicle Photo
              </span>
              <span className="text-[11px] text-slate-500">Catalog Preview</span>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <img
                src={primaryPhoto}
                alt="Selected bike preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono">
                {brand} {model || "Model"} ({year})
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Custom Photo URL (or select preset above)
              </label>
              <input
                type="url"
                value={primaryPhoto}
                onChange={(e) => setPrimaryPhoto(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="space-y-2.5">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 group cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Recording Purchase into Inventory...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Save Bike to Showroom Inventory</span>
                </>
              )}
            </button>

            <p className="text-center text-[11px] text-slate-500">
              Vehicle code will be generated automatically (e.g. MF-2026-XXXX) with immutable audit logging.
            </p>
          </div>
        </div>

        {/* Sticky Mobile Live Margin & Save Bar (Fixed right above MobileBottomNav on small screens) */}
        <div className="lg:hidden fixed bottom-16 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-md text-white px-4 py-2.5 border-t border-slate-800 shadow-2xl flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">
              {projectedProfit > 0 ? "Projected Margin" : "Investment"}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-sm text-emerald-400">
                {projectedProfit > 0 ? `+${formatINR(projectedProfit)}` : formatINR(totalInvestment)}
              </span>
              {projectedProfit > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                  +{marginPercentage}%
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 active:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all shrink-0 flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <PlusCircle className="w-3.5 h-3.5" />
            )}
            <span>Save Bike</span>
          </button>
        </div>
      </form>

      {/* 5. Purchase Voucher Success Modal & Printable Deed */}
      {showVoucherModal && createdBike && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Bike Purchase Recorded Successfully!
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Assigned Stock Code:{" "}
                    <strong className="text-blue-700 font-mono text-sm">
                      {createdBike.bikeCode}
                    </strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowVoucherModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg text-lg"
              >
                ✕
              </button>
            </div>

            {/* Printable Purchase Deed / Voucher Component */}
            <div
              id="purchase-voucher-content"
              className="border-2 border-slate-800 rounded-xl p-6 bg-slate-50/50 space-y-4 print:border-black print:bg-white"
            >
              {/* Showroom Crest & Header */}
              <div className="text-center border-b border-slate-300 pb-3">
                <h2 className="text-xl font-black text-slate-900 tracking-wider">
                  MANIKANTA FINANCE & TWO WHEELERS
                </h2>
                <div className="text-[11px] font-bold text-slate-600 tracking-widest uppercase">
                  Authorized Second Hand Bike Showroom & Finance Ledger
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Miryalaguda, Telangana • Cell: +91 98456 12345, 99876 54321 • Since 26 Years
                </div>
                <div className="mt-2 inline-block px-3 py-0.5 bg-slate-900 text-white rounded text-xs font-bold uppercase tracking-wider">
                  Vehicle Purchase Voucher / Undertaking Deed
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 text-xs gap-2 py-1">
                <div>
                  <span className="text-slate-500">Voucher / Stock No:</span>{" "}
                  <strong className="font-mono text-slate-900">{createdBike.bikeCode}</strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-500">Purchase Date:</span>{" "}
                  <strong className="text-slate-900">
                    {new Date(createdBike.purchaseDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </strong>
                </div>
              </div>

              {/* Vehicle Specs Table */}
              <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <tbody>
                    <tr className="border-b border-slate-200 bg-slate-100">
                      <td className="p-2 font-bold text-slate-600">Vehicle Model:</td>
                      <td className="p-2 font-bold text-slate-900">
                        {createdBike.brand} {createdBike.model}
                      </td>
                      <td className="p-2 font-bold text-slate-600">Mfg. Year:</td>
                      <td className="p-2 font-bold text-slate-900">{createdBike.year}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-bold text-slate-600">Registration No:</td>
                      <td className="p-2 font-mono font-black text-slate-900">
                        {createdBike.regNo}
                      </td>
                      <td className="p-2 font-bold text-slate-600">Odometer:</td>
                      <td className="p-2 text-slate-900">{odometer ? `${odometer} KM` : "Verified"}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-bold text-slate-600">Chassis No:</td>
                      <td className="p-2 font-mono text-slate-800">{createdBike.chassisNo}</td>
                      <td className="p-2 font-bold text-slate-600">Engine No:</td>
                      <td className="p-2 font-mono text-slate-800">{createdBike.engineNo}</td>
                    </tr>
                    <tr className="bg-emerald-50/50">
                      <td className="p-2 font-bold text-emerald-800">Purchase Amount Paid:</td>
                      <td className="p-2 font-mono font-black text-emerald-900 text-sm">
                        {formatINR(createdBike.purchasePrice)}
                      </td>
                      <td className="p-2 font-bold text-emerald-800">Payment Mode:</td>
                      <td className="p-2 font-bold text-emerald-900">{paymentMode}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Seller Information */}
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-900">Seller / Previous Owner:</div>
                <div className="text-slate-700">
                  Name: <strong>{createdBike.sellerName || "N/A"}</strong> | Mobile:{" "}
                  <strong>{createdBike.sellerPhone || "N/A"}</strong>
                </div>
              </div>

              {/* Legal Declaration */}
              <div className="text-[10px] text-slate-500 leading-relaxed italic border-t border-slate-200 pt-2">
                "I, the undersigned seller, hereby confirm that I have sold the vehicle described above to Manikanta Finance for the agreed consideration. I declare that the vehicle has a clear title, is free of any hypothecation, theft reports, or police cases. I have handed over the Original RC and signed Form 29 & 30."
              </div>

              {/* Signatures */}
              <div className="pt-6 grid grid-cols-2 text-center text-xs gap-8">
                <div className="border-t border-slate-400 pt-1">
                  <span className="text-slate-600 font-semibold">Seller Signature / Thumb</span>
                </div>
                <div className="border-t border-slate-400 pt-1">
                  <span className="text-slate-900 font-bold">
                    For Manikanta Finance (Authorized Signatory)
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Print Purchase Voucher</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowVoucherModal(false);
                    // Reset form for next entry
                    setModel("");
                    setRegNo("");
                    setEngineNo("");
                    setChassisNo("");
                    setPurchasePrice("");
                    setRepairCost("0");
                    setExpectedSellingPrice("");
                    setSellerName("");
                    setSellerPhone("");
                    setNotes("");
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  Enter Another Bike
                </button>
                <Link
                  href="/bikes"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                >
                  <span>Go to Inventory</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
