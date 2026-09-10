"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bike as BikeIcon,
  Search,
  PlusCircle,
  Wrench,
  DollarSign,
  Tag,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Edit2,
  ExternalLink,
  ShieldAlert,
  Phone,
} from "lucide-react";
import { formatINR, formatDate } from "@/lib/utils";

export default function BikesPage() {
  const [bikes, setBikes] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBike, setSelectedBike] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    brand: "Honda",
    model: "",
    year: 2022,
    regNo: "",
    engineNo: "",
    chassisNo: "",
    purchasePrice: "",
    repairCost: "0",
    expectedSellingPrice: "",
    sellerName: "",
    sellerPhone: "",
    primaryPhoto: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80",
    status: "AVAILABLE",
    notes: "",
  });

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchBikes = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (statusFilter !== "ALL") query.set("status", statusFilter);
      if (search.trim()) query.set("search", search.trim());

      const res = await fetch(`/api/bikes?${query.toString()}`);
      const data = await res.json();
      setBikes(data.bikes || []);
      setSummary(data.summary || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBikes();
  };

  const handleAddBike = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSaving(true);

    try {
      const res = await fetch("/api/bikes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add bike");
      }

      setShowAddModal(false);
      setFormData({
        brand: "Honda",
        model: "",
        year: 2022,
        regNo: "",
        engineNo: "",
        chassisNo: "",
        purchasePrice: "",
        repairCost: "0",
        expectedSellingPrice: "",
        sellerName: "",
        sellerPhone: "",
        primaryPhoto: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80",
        status: "AVAILABLE",
        notes: "",
      });
      fetchBikes();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateBike = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBike) return;
    setFormError(null);
    setSaving(true);

    try {
      const res = await fetch("/api/bikes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedBike.id,
          expectedSellingPrice: selectedBike.expectedSellingPrice,
          repairCost: selectedBike.repairCost,
          status: selectedBike.status,
          notes: selectedBike.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update bike");
      }

      setShowEditModal(false);
      setSelectedBike(null);
      fetchBikes();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Metric Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <BikeIcon className="w-6 h-6 text-amber-500" />
              Bike Inventory Management
            </h1>
            <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-0.5 rounded border">
              MF-2026 Serialized
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track acquisition cost, repair investments, total capital, and sales margins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/export?type=bikes"
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Export Inventory
          </a>

          <Link
            href="/bikes/new"
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Buy Bike (Stock Entry)</span>
          </Link>

          <button
            onClick={() => setShowAddModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
            title="Quick modal entry"
          >
            + Quick Add
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold">Total Stock Units</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {summary?.total || 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">All tracked two-wheelers</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs">
          <div className="text-xs text-emerald-700 font-semibold">Ready for Sale</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {summary?.available || 0}
          </div>
          <div className="text-[11px] text-emerald-800 mt-0.5">In showroom condition</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-xs">
          <div className="text-xs text-amber-700 font-semibold">Under Repair / Service</div>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {summary?.inRepair || 0}
          </div>
          <div className="text-[11px] text-amber-800 mt-0.5">Mechanic overhaul</div>
        </div>

        <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 shadow-xs">
          <div className="text-xs text-slate-400 font-semibold">Active Capital In Stock</div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {formatINR(summary?.totalInvestedInStock)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Purchase + Repair invested</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        {/* Status Chips */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: "All Statuses" },
            { id: "AVAILABLE", label: "Available" },
            { id: "IN_REPAIR", label: "In Repair" },
            { id: "SOLD", label: "Sold" },
            { id: "RESERVED", label: "Reserved" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === tab.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Reg #, Model, MF ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Bike Cards / Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-500 text-xs font-medium">
          Loading inventory records...
        </div>
      ) : bikes.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-slate-200">
          <BikeIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No bikes found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search filters or add a new bike to your inventory.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {bikes.map((bike) => {
            const margin = (bike.actualSellingPrice || bike.expectedSellingPrice) - bike.totalInvestment;

            return (
              <div
                key={bike.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Photo & Status Badge */}
                  <div className="relative h-44 bg-slate-900 overflow-hidden group">
                    <img
                      src={bike.primaryPhoto || "/bikes/default-bike.jpg"}
                      alt={`${bike.brand} ${bike.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Badge top left: Bike Code */}
                    <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur text-amber-400 font-mono font-black text-xs px-2 py-1 rounded-md border border-amber-400/30">
                      {bike.bikeCode}
                    </span>

                    {/* Badge top right: Status */}
                    <span
                      className={`absolute top-3 right-3 text-[10px] font-black uppercase px-2 py-1 rounded-md shadow-sm ${
                        bike.status === "AVAILABLE"
                          ? "bg-emerald-500 text-slate-950"
                          : bike.status === "IN_REPAIR"
                          ? "bg-amber-500 text-slate-950"
                          : bike.status === "SOLD"
                          ? "bg-slate-700 text-white"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {bike.status.replace("_", " ")}
                    </span>

                    {/* Bottom overlay: Brand, Model, Year */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-base font-extrabold leading-tight">
                        {bike.brand} {bike.model}
                      </div>
                      <div className="text-[11px] text-slate-300 flex items-center gap-2 mt-0.5 font-mono">
                        <span className="font-bold text-amber-300">{bike.regNo}</span>
                        <span>•</span>
                        <span>Mfg: {bike.year}</span>
                      </div>
                    </div>
                  </div>

                  {/* Financial & Spec Details */}
                  <div className="p-4 space-y-3">
                    {/* Machine Details */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono text-slate-600">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase">Engine #</span>
                        <span className="truncate block font-semibold">{bike.engineNo}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase">Chassis #</span>
                        <span className="truncate block font-semibold">{bike.chassisNo}</span>
                      </div>
                    </div>

                    {/* Financial Investment Breakdown */}
                    <div className="bg-slate-900 text-white p-3 rounded-xl space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Purchase Price:</span>
                        <span className="font-mono font-semibold">{formatINR(bike.purchasePrice)}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Repairs Added:</span>
                        <span className="font-mono text-amber-400 font-semibold">
                          +{formatINR(bike.repairCost)}
                        </span>
                      </div>
                      <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between font-bold">
                        <span className="text-slate-200">Total Investment:</span>
                        <span className="font-mono text-white text-sm">
                          {formatINR(bike.totalInvestment)}
                        </span>
                      </div>
                    </div>

                    {/* Expected / Sold Price & Margin */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase block">
                          {bike.status === "SOLD" ? "Actual Sold Price" : "Target Sale Price"}
                        </span>
                        <span className="font-black text-slate-900 text-base">
                          {formatINR(bike.actualSellingPrice || bike.expectedSellingPrice)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 font-bold uppercase block">
                          Projected Margin
                        </span>
                        <span
                          className={`font-black text-sm ${
                            margin >= 0 ? "text-emerald-700" : "text-rose-700"
                          }`}
                        >
                          {margin >= 0 ? `+${formatINR(margin)}` : formatINR(margin)}
                        </span>
                      </div>
                    </div>

                    {/* Notes & Seller */}
                    {bike.sellerName && (
                      <div className="text-[11px] text-slate-500 flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                        <div className="truncate">
                          Purchased from: <span className="font-semibold text-slate-700">{bike.sellerName}</span>
                          {bike.sellerPhone && <span className="text-slate-400"> ({bike.sellerPhone})</span>}
                        </div>
                        {bike.sellerPhone && (
                          <a
                            href={`tel:${bike.sellerPhone.replace(/[^0-9]/g, "")}`}
                            title="Call Seller"
                            className="p-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors shrink-0"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 pt-0 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedBike(bike);
                      setShowEditModal(true);
                    }}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit / Add Repair
                  </button>

                  {bike.status === "AVAILABLE" && (
                    <a
                      href={`/sales/new?bikeId=${bike.id}`}
                      className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Tag className="w-3.5 h-3.5" />
                      Sell Bike
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Bike Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl my-8">
            <h3 className="text-lg font-black text-slate-900 mb-1 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-amber-500" />
              Add Second-Hand Bike into Stock
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Unique ID (e.g. MF-2026-XXXX) will be generated automatically.
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddBike} className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Brand *
                  </label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                  >
                    <option value="Honda">Honda</option>
                    <option value="Hero">Hero</option>
                    <option value="Bajaj">Bajaj</option>
                    <option value="TVS">TVS</option>
                    <option value="Yamaha">Yamaha</option>
                    <option value="Royal Enfield">Royal Enfield</option>
                    <option value="Suzuki">Suzuki</option>
                    <option value="KTM">KTM</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Model Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Activa 6G / Pulsar 150"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mfg Year *
                  </label>
                  <input
                    type="number"
                    required
                    min={2005}
                    max={2026}
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Registration No (Plate) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AP29BZ4821"
                    value={formData.regNo}
                    onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Engine Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. JF91E88392"
                    value={formData.engineNo}
                    onChange={(e) => setFormData({ ...formData, engineNo: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chassis Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ME4JF9139N82"
                    value={formData.chassisNo}
                    onChange={(e) => setFormData({ ...formData, chassisNo: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Purchase Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="45000"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Initial Repair Cost (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="3000"
                    value={formData.repairCost}
                    onChange={(e) => setFormData({ ...formData, repairCost: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-bold text-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Expected Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="58000"
                    value={formData.expectedSellingPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, expectedSellingPrice: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg text-xs font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Previous Owner / Seller Name
                  </label>
                  <input
                    type="text"
                    placeholder="Seller name"
                    value={formData.sellerName}
                    onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Seller Contact Number
                  </label>
                  <input
                    type="text"
                    placeholder="98480xxxxx"
                    value={formData.sellerPhone}
                    onChange={(e) => setFormData({ ...formData, sellerPhone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Initial Stock Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                  >
                    <option value="AVAILABLE">AVAILABLE (Showroom Ready)</option>
                    <option value="IN_REPAIR">IN REPAIR (Under Servicing)</option>
                    <option value="RESERVED">RESERVED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Photo URL (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formData.primaryPhoto}
                    onChange={(e) => setFormData({ ...formData, primaryPhoto: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Condition / RC Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Original RC available, insurance valid up to 2027"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-1/2 py-2.5 text-xs font-black text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-md transition-all"
                >
                  {saving ? "Saving to Stock..." : "Save Bike in Stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit / Add Repair Modal */}
      {showEditModal && selectedBike && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-amber-500" />
              Update Bike: {selectedBike.bikeCode}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {selectedBike.brand} {selectedBike.model} ({selectedBike.regNo})
            </p>

            <form onSubmit={handleUpdateBike} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Accumulated Repair Cost (₹)
                </label>
                <input
                  type="number"
                  required
                  value={selectedBike.repairCost}
                  onChange={(e) =>
                    setSelectedBike({
                      ...selectedBike,
                      repairCost: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg text-xs font-bold text-amber-700"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  New Total Investment will be:{" "}
                  {formatINR(selectedBike.purchasePrice + Number(selectedBike.repairCost || 0))}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Selling Price (₹)
                </label>
                <input
                  type="number"
                  required
                  value={selectedBike.expectedSellingPrice}
                  onChange={(e) =>
                    setSelectedBike({
                      ...selectedBike,
                      expectedSellingPrice: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg text-xs font-bold text-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Stock Status
                </label>
                <select
                  value={selectedBike.status}
                  onChange={(e) =>
                    setSelectedBike({ ...selectedBike, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                >
                  <option value="AVAILABLE">AVAILABLE (Ready for Sale)</option>
                  <option value="IN_REPAIR">IN REPAIR (Under Mechanic Work)</option>
                  <option value="RESERVED">RESERVED (Advance token given)</option>
                  <option value="SOLD">SOLD</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={selectedBike.notes || ""}
                  onChange={(e) =>
                    setSelectedBike({ ...selectedBike, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="w-1/2 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-1/2 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                >
                  {saving ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
