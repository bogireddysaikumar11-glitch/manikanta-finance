"use client";

import { useState, useEffect } from "react";
import {
  CreditCard,
  PlusCircle,
  Search,
  Printer,
  Download,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  ArrowDownRight,
  Sparkles,
  Receipt,
  Eye,
} from "lucide-react";
import { formatINR, formatDate, formatDateTime } from "@/lib/utils";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [activeSales, setActiveSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

  // Form
  const [selectedSaleId, setSelectedSaleId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [referenceNo, setReferenceNo] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [payRes, salesRes] = await Promise.all([
        fetch("/api/payments"),
        fetch("/api/sales"),
      ]);
      const payData = await payRes.json();
      const salesData = await salesRes.json();

      setPayments(payData.payments || []);
      setActiveSales(salesData.sales?.filter((s: any) => s.pendingAmount > 0) || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSaving(true);

    try {
      if (!selectedSaleId || !amount || Number(amount) <= 0) {
        throw new Error("Please choose a sale and enter a valid payment amount");
      }

      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          saleId: selectedSaleId,
          amount,
          paymentMode,
          referenceNo,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to record payment");
      }

      setShowPayModal(false);
      setSelectedSaleId("");
      setAmount("");
      setReferenceNo("");
      setNotes("");
      fetchData();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredPayments = payments.filter((p) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      p.receiptNo.toLowerCase().includes(term) ||
      p.customer.name.toLowerCase().includes(term) ||
      p.customer.phone.includes(term) ||
      (p.sale?.bike?.regNo && p.sale.bike.regNo.toLowerCase().includes(term))
    );
  });

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalOutstanding = activeSales.reduce((sum, s) => sum + s.pendingAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm no-print">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-600" />
            Payments & Collection Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track customer payments, installment collections, outstanding balances, and official receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/export?type=payments"
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            Export Payments
          </a>

          <button
            onClick={() => setShowPayModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            + Collect New Payment
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 no-print">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold">Total Collections Logged</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {formatINR(totalCollected)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Across {payments.length} receipts
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-xs">
          <div className="text-xs text-amber-800 font-semibold">Outstanding Balance Due</div>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {formatINR(totalOutstanding)}
          </div>
          <div className="text-[11px] text-amber-900 mt-0.5">
            {activeSales.length} customers with pending EMIs
          </div>
        </div>

        <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-xs">
          <div className="text-xs text-slate-400 font-semibold">Flagship Rule</div>
          <div className="text-sm font-bold text-amber-400 mt-1">
            Single Source of Truth
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Every collection automatically credits the Daily Record Book.
          </div>
        </div>
      </div>

      {/* Outstanding Dues Quick Action Bar */}
      {activeSales.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 shadow-xs space-y-3 no-print">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Active Customer Dues (Pending Installments)
            </h2>
            <span className="text-[11px] font-bold text-amber-800">
              {activeSales.length} active loans
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeSales.map((sale) => (
              <div
                key={sale.id}
                className="p-3 bg-white rounded-xl border border-amber-200/60 shadow-xs flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">
                    {sale.customer.name}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {sale.bike.brand} {sale.bike.model} ({sale.bike.regNo})
                  </div>
                  <div className="text-amber-700 font-black mt-1">
                    Due: {formatINR(sale.pendingAmount)}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedSaleId(String(sale.id));
                    setAmount(
                      String(sale.emiMonthlyAmount > 0 ? sale.emiMonthlyAmount : sale.pendingAmount)
                    );
                    setShowPayModal(true);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                >
                  Collect
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Receipts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden no-print">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search receipt #, customer, reg plate..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <span className="text-xs font-mono text-slate-500">
            Total Receipts: {filteredPayments.length}
          </span>
        </div>

        {loading ? (
          <div className="p-16 text-center text-slate-500 text-xs font-medium">
            Loading payments records...
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No payment receipts found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Two-Wheeler</th>
                  <th className="py-3 px-4">Mode</th>
                  <th className="py-3 px-4">Reference No</th>
                  <th className="py-3 px-4 text-right">Amount (₹)</th>
                  <th className="py-3 px-4 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                      {p.receiptNo}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {formatDateTime(p.paymentDate)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {p.customer.name}
                      <span className="block text-[10px] text-slate-400 font-mono">
                        {p.customer.phone}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {p.sale?.bike ? (
                        <>
                          <div className="font-semibold text-slate-800">
                            {p.sale.bike.brand} {p.sale.bike.model}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {p.sale.bike.regNo}
                          </div>
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.paymentMode === "CASH"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {p.paymentMode}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {p.referenceNo || "-"}
                    </td>
                    <td className="py-3 px-4 text-right font-black text-emerald-600 text-sm">
                      {formatINR(p.amount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedReceipt(p)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        title="View & Print Receipt"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View & Print Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900">
                Official Payment Receipt
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Receipt Preview Card */}
            <div className="border border-slate-300 p-6 rounded-xl bg-white space-y-4">
              <div className="text-center border-b pb-3">
                <div className="font-black text-xl text-slate-900">
                  MANIKANTA FINANCE
                </div>
                <div className="text-[11px] text-slate-600">
                  Main Road, Miryalaguda • Phone: 9876543210
                </div>
                <div className="mt-1 text-xs font-mono font-bold bg-slate-100 inline-block px-2 py-0.5 rounded text-emerald-700">
                  PAYMENT ACKNOWLEDGEMENT RECEIPT
                </div>
              </div>

              <div className="grid grid-cols-2 text-xs">
                <div>
                  <span className="text-slate-500">Receipt No:</span>{" "}
                  <span className="font-mono font-bold">{selectedReceipt.receiptNo}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500">Date:</span>{" "}
                  <span className="font-semibold">
                    {formatDateTime(selectedReceipt.paymentDate)}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1">
                <div>
                  <span className="text-slate-500">Received From:</span>{" "}
                  <span className="font-bold text-slate-900">
                    {selectedReceipt.customer.name}
                  </span>{" "}
                  ({selectedReceipt.customer.phone})
                </div>
                {selectedReceipt.sale?.bike && (
                  <div>
                    <span className="text-slate-500">Vehicle:</span>{" "}
                    <span className="font-semibold">
                      {selectedReceipt.sale.bike.brand} {selectedReceipt.sale.bike.model}
                    </span>{" "}
                    (Reg: {selectedReceipt.sale.bike.regNo})
                  </div>
                )}
                <div>
                  <span className="text-slate-500">Payment Mode:</span>{" "}
                  <span className="font-semibold">{selectedReceipt.paymentMode}</span>
                  {selectedReceipt.referenceNo && (
                    <span className="font-mono ml-2 text-slate-500">
                      [Ref: {selectedReceipt.referenceNo}]
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <span className="text-xs text-emerald-800 uppercase font-bold block">
                  Amount Received
                </span>
                <span className="text-2xl font-black text-emerald-700">
                  {formatINR(selectedReceipt.amount)}
                </span>
              </div>

              <div className="pt-6 grid grid-cols-2 text-center text-[11px] text-slate-600">
                <div>Customer Signature</div>
                <div>Authorized Signatory (Manikanta Finance)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collect Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-black text-slate-900 mb-1 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-600" />
              Collect Customer Payment / Installment
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Receipt REC-2026-XXXX will be automatically generated and audited.
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleRecordPayment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Sale / Customer Account *
                </label>
                <select
                  required
                  value={selectedSaleId}
                  onChange={(e) => {
                    setSelectedSaleId(e.target.value);
                    const matched = activeSales.find(
                      (s) => String(s.id) === String(e.target.value)
                    );
                    if (matched) {
                      setAmount(
                        String(
                          matched.emiMonthlyAmount > 0
                            ? matched.emiMonthlyAmount
                            : matched.pendingAmount
                        )
                      );
                    }
                  }}
                  className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                >
                  <option value="">-- Choose Customer & Sale --</option>
                  {activeSales.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.customer.name} — {s.bike.brand} {s.bike.model} (Dues: ₹
                      {s.pendingAmount})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs font-black text-emerald-700"
                />
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
                  UPI UTR / Cheque Reference Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. UPI/1234567890/PhonePe"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Month 2 EMI payment"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="w-1/2 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-1/2 py-2 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all"
                >
                  {saving ? "Saving..." : "Save & Generate Receipt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
