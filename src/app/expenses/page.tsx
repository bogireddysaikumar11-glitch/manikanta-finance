"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  PlusCircle,
  Download,
  Filter,
  ArrowUpRight,
  Bike,
  Tag,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { formatINR, formatDate, formatDateTime } from "@/lib/utils";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<Record<string, number>>({});
  const [totalExpense, setTotalExpense] = useState(0);
  const [bikes, setBikes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("REPAIR_PARTS");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [bikeId, setBikeId] = useState("");
  const [expenseDate, setExpenseDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const query = categoryFilter !== "ALL" ? `?category=${categoryFilter}` : "";
      const [expRes, bikesRes] = await Promise.all([
        fetch(`/api/expenses${query}`),
        fetch("/api/bikes"),
      ]);
      const expData = await expRes.json();
      const bikesData = await bikesRes.json();

      setExpenses(expData.expenses || []);
      setTotalExpense(expData.totalExpense || 0);
      setCategoryBreakdown(expData.categoryBreakdown || {});
      setBikes(bikesData.bikes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [categoryFilter]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      if (!title || !amount || Number(amount) <= 0) {
        throw new Error("Please enter an expense title and valid amount");
      }

      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          amount,
          paymentMode,
          bikeId: bikeId ? Number(bikeId) : null,
          expenseDate,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add expense");
      }

      setShowAddModal(false);
      setTitle("");
      setAmount("");
      setBikeId("");
      setNotes("");
      fetchExpenses();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-rose-600" />
            Shop & Bike Repair Expenses
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Record shop overhead, mechanic charges, spare parts, and RTO expenses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/export?type=expenses"
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            Export Expenses
          </a>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            + Record Expense
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-xs">
          <div className="text-xs text-rose-800 font-semibold">Total Expenses</div>
          <div className="text-2xl font-black text-rose-600 mt-1">
            {formatINR(totalExpense)}
          </div>
          <div className="text-[11px] text-rose-900 mt-0.5">{expenses.length} entries</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold">Spare Parts & Repairs</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {formatINR(categoryBreakdown["REPAIR_PARTS"] || 0)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Added to bike investment</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold">Mechanic Wages</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {formatINR(categoryBreakdown["MECHANIC_WAGES"] || 0)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Direct labor</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold">Shop Rent & Bills</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {formatINR(
              (categoryBreakdown["SHOP_RENT"] || 0) + (categoryBreakdown["ELECTRICITY"] || 0)
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Fixed overheads</div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 bg-white p-3 rounded-2xl border border-slate-200">
        {[
          { id: "ALL", label: "All Categories" },
          { id: "REPAIR_PARTS", label: "Spare Parts" },
          { id: "MECHANIC_WAGES", label: "Mechanic Wages" },
          { id: "TEA_SNACKS", label: "Tea & Refreshments" },
          { id: "SHOP_RENT", label: "Shop Rent" },
          { id: "ELECTRICITY", label: "Electricity" },
          { id: "RTO_POLICE", label: "RTO / Documents" },
          { id: "OTHER", label: "Other" },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              categoryFilter === cat.id
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-500 text-xs font-medium">
            Loading expense ledger...
          </div>
        ) : expenses.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-xs">
            No expenses found in this category.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Expense Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Mode</th>
                  <th className="py-3 px-4">Linked Bike</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {formatDate(e.expenseDate)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{e.title}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {e.category.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      {e.paymentMode}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {e.bike ? (
                        <span className="font-bold text-amber-700">
                          {e.bike.brand} {e.bike.model} ({e.bike.regNo})
                        </span>
                      ) : (
                        <span className="text-slate-400">General Shop</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{e.notes || "-"}</td>
                    <td className="py-3 px-4 text-right font-black text-rose-600 text-sm">
                      -{formatINR(e.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-rose-600" />
              Record New Expense
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Directly debited from shop cash/bank and added to the Daily Record Book.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAddExpense} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Expense Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hero Splendor Headlight bulb & battery"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                  >
                    <option value="REPAIR_PARTS">Spare Parts</option>
                    <option value="MECHANIC_WAGES">Mechanic Wages</option>
                    <option value="TEA_SNACKS">Tea & Refreshments</option>
                    <option value="SHOP_RENT">Shop Rent</option>
                    <option value="ELECTRICITY">Electricity & Bills</option>
                    <option value="RTO_POLICE">RTO / NOC Docs</option>
                    <option value="OTHER">Other Misc</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="1200"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-bold text-rose-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Mode
                </label>
                <div className="flex gap-2">
                  {["CASH", "UPI", "BANK_TRANSFER"].map((mode) => (
                    <button
                      type="button"
                      key={mode}
                      onClick={() => setPaymentMode(mode)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border ${
                        paymentMode === mode
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Link to Bike (Optional — adds to bike repair investment)
                </label>
                <select
                  value={bikeId}
                  onChange={(e) => setBikeId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                >
                  <option value="">-- General Shop (Not tied to bike) --</option>
                  {bikes.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.bikeCode} — {b.brand} {b.model} ({b.regNo})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Expense Date
                  </label>
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Notes
                  </label>
                  <input
                    type="text"
                    placeholder="Bill / vendor details"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-1/2 py-2 text-xs font-black text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm"
                >
                  {saving ? "Recording..." : "Save Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
