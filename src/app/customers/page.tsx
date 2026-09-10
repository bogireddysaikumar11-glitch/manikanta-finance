"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  PlusCircle,
  Phone,
  MapPin,
  Bike,
  Receipt,
  Download,
  AlertCircle,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { formatINR, formatDate, formatDateTime } from "@/lib/utils";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [aadharNo, setAadharNo] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Miryalaguda");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/customers?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          alternatePhone: altPhone,
          aadharNo,
          address,
          city,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add customer");
      }

      setShowAddModal(false);
      setName("");
      setPhone("");
      setAltPhone("");
      setAadharNo("");
      setAddress("");
      setNotes("");
      fetchCustomers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const totalOutstanding = customers.reduce((sum, c) => sum + (c.totalPending || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-500" />
            Customer Directory & Accounts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Client contact directory, purchased vehicles, payment logs, and KYC details.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/export?type=customers"
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            Export Customers
          </a>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            + New Customer
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold">Total Registered Customers</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {customers.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Two-wheeler buyers & borrowers</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-xs">
          <div className="text-xs text-amber-800 font-semibold">Total Pending from Customers</div>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {formatINR(totalOutstanding)}
          </div>
          <div className="text-[11px] text-amber-900 mt-0.5">
            Active credit balances
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs">
          <div className="text-xs text-emerald-800 font-semibold">Cleared Accounts</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {customers.filter((c) => c.totalPending === 0 && c.totalPurchases > 0).length}
          </div>
          <div className="text-[11px] text-emerald-900 mt-0.5">100% paid in full</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Customer Name, Phone, Aadhar, City..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:ring-2 focus:ring-amber-500"
          />
        </form>
        <button
          onClick={fetchCustomers}
          className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-500 text-xs font-medium">
            Loading customers...
          </div>
        ) : customers.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-xs">
            No customers found. Click "+ New Customer" to register one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Phone & Alt</th>
                  <th className="py-3 px-4">Address / Town</th>
                  <th className="py-3 px-4">Purchased Bikes</th>
                  <th className="py-3 px-4 text-right">Total Purchases</th>
                  <th className="py-3 px-4 text-right">Total Paid</th>
                  <th className="py-3 px-4 text-right">Pending Balance</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {c.name}
                      {c.aadharNo && (
                        <span className="block text-[10px] text-slate-400 font-mono">
                          ID: {c.aadharNo}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      <div>{c.phone}</div>
                      {c.alternatePhone && (
                        <div className="text-[10px] text-slate-400">
                          Alt: {c.alternatePhone}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="truncate max-w-xs">{c.address}</div>
                      <div className="text-[10px] text-slate-400">{c.city}</div>
                    </td>
                    <td className="py-3 px-4">
                      {c.sales?.length === 0 ? (
                        <span className="text-slate-400">No purchases yet</span>
                      ) : (
                        <div className="space-y-0.5">
                          {c.sales.map((s: any) => (
                            <div key={s.id} className="font-semibold text-slate-800">
                              {s.bike.brand} {s.bike.model} ({s.bike.regNo})
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      {formatINR(c.totalPurchases)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600">
                      {formatINR(c.totalPaid)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`font-black ${
                          c.totalPending > 0 ? "text-amber-700" : "text-slate-400"
                        }`}
                      >
                        {formatINR(c.totalPending)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-bold"
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <h3 className="font-black text-base text-slate-900">
                  {selectedCustomer.name}
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  📞 {selectedCustomer.phone} • {selectedCustomer.city}
                </span>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-xs font-bold px-2 py-1 bg-slate-100 rounded"
              >
                Close
              </button>
            </div>

            {/* Financial Balance Strip */}
            <div className="grid grid-cols-3 gap-2 text-center p-3 bg-slate-50 rounded-xl border">
              <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">
                  Total Purchases
                </div>
                <div className="font-bold text-sm text-slate-900">
                  {formatINR(selectedCustomer.totalPurchases)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">
                  Total Paid
                </div>
                <div className="font-bold text-sm text-emerald-600">
                  {formatINR(selectedCustomer.totalPaid)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">
                  Pending Dues
                </div>
                <div className="font-black text-sm text-amber-600">
                  {formatINR(selectedCustomer.totalPending)}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg">
              <span className="font-bold text-slate-900 block mb-0.5">Address:</span>
              {selectedCustomer.address}, {selectedCustomer.city}
              {selectedCustomer.aadharNo && (
                <div className="mt-1 font-mono text-[11px] text-slate-500">
                  Aadhar / KYC: {selectedCustomer.aadharNo}
                </div>
              )}
            </div>

            {/* Purchased Bikes */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Purchased Vehicles ({selectedCustomer.sales?.length || 0})
              </h4>
              {selectedCustomer.sales?.length === 0 ? (
                <p className="text-xs text-slate-400">No bikes purchased yet.</p>
              ) : (
                <div className="space-y-2">
                  {selectedCustomer.sales.map((s: any) => (
                    <div
                      key={s.id}
                      className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900">
                          {s.bike.brand} {s.bike.model}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Reg: {s.bike.regNo} • Inv: {s.invoiceNo}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatINR(s.agreedPrice)}</div>
                        <div className="text-[11px] text-amber-600 font-bold">
                          Dues: {formatINR(s.pendingAmount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Receipts History */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Payment Receipts Issued ({selectedCustomer.payments?.length || 0})
              </h4>
              {selectedCustomer.payments?.length === 0 ? (
                <p className="text-xs text-slate-400">No payments recorded yet.</p>
              ) : (
                <div className="space-y-1.5">
                  {selectedCustomer.payments.map((p: any) => (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs font-medium"
                    >
                      <div>
                        <span className="font-mono font-bold text-emerald-700">
                          {p.receiptNo}
                        </span>
                        <span className="text-slate-400 ml-2 font-mono text-[10px]">
                          {formatDate(p.paymentDate)}
                        </span>
                      </div>
                      <div className="font-black text-emerald-600">
                        +{formatINR(p.amount)} ({p.paymentMode})
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-amber-500" />
              Register New Customer
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Add borrower or buyer details to customer accounts.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAddCustomer} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. K. Suresh Reddy"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="98480xxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alternate Phone
                  </label>
                  <input
                    type="text"
                    placeholder="Optional"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Aadhar / Voter ID Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 4829-1029-3829"
                  value={aadharNo}
                  onChange={(e) => setAadharNo(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Residential Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="House #, Street name, Village / Area"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / Town
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Notes
                  </label>
                  <input
                    type="text"
                    placeholder="Optional details"
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
                  className="w-1/2 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-1/2 py-2 text-xs font-black text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm"
                >
                  {saving ? "Saving..." : "Save Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
