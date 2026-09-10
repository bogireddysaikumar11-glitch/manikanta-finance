"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bike,
  Receipt,
  User,
  Plus,
  CheckCircle2,
  Printer,
  Sparkles,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";
import { formatINR, formatDate } from "@/lib/utils";

function SaleWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedBikeId = searchParams.get("bikeId");

  const [bikes, setBikes] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Sale Wizard State
  const [selectedBikeId, setSelectedBikeId] = useState(preselectedBikeId || "");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [agreedPrice, setAgreedPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentType, setPaymentType] = useState("FULL_CASH");
  const [emiMonths, setEmiMonths] = useState("6");
  const [emiMonthlyAmount, setEmiMonthlyAmount] = useState("");
  const [notes, setNotes] = useState("");

  // Quick Customer Creation toggle
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [newCustName, setNewCustName] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");
  const [newCustAltPhone, setNewCustAltPhone] = useState("");
  const [newCustAadhar, setNewCustAadhar] = useState("");
  const [newCustAddress, setNewCustAddress] = useState("");
  const [newCustCity, setNewCustCity] = useState("Miryalaguda");

  const [saving, setSaving] = useState(false);
  const [saleResult, setSaleResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [bikesRes, custsRes] = await Promise.all([
          fetch("/api/bikes?status=AVAILABLE"),
          fetch("/api/customers"),
        ]);
        const bikesData = await bikesRes.json();
        const custsData = await custsRes.json();
        setBikes(bikesData.bikes || []);
        setCustomers(custsData.customers || []);

        if (preselectedBikeId) {
          const matched = (bikesData.bikes || []).find(
            (b: any) => String(b.id) === String(preselectedBikeId)
          );
          if (matched) {
            setAgreedPrice(String(matched.expectedSellingPrice));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [preselectedBikeId]);

  // When bike changes, auto-set expected price
  const handleBikeChange = (id: string) => {
    setSelectedBikeId(id);
    const bike = bikes.find((b) => String(b.id) === String(id));
    if (bike) {
      setAgreedPrice(String(bike.expectedSellingPrice));
      setDownPayment(String(Math.round(bike.expectedSellingPrice * 0.5)));
    }
  };

  // Calculations
  const numAgreed = Number(agreedPrice) || 0;
  const numDown = Number(downPayment) || 0;
  const pendingBalance = Math.max(0, numAgreed - numDown);
  const selectedBike = bikes.find((b) => String(b.id) === String(selectedBikeId));
  const selectedCustomer = customers.find(
    (c) => String(c.id) === String(selectedCustomerId)
  );

  // Auto calculate monthly EMI
  useEffect(() => {
    if (paymentType === "EMI" && pendingBalance > 0) {
      const months = Number(emiMonths) || 1;
      setEmiMonthlyAmount(String(Math.ceil(pendingBalance / months)));
    } else {
      setEmiMonthlyAmount("0");
    }
  }, [paymentType, pendingBalance, emiMonths]);

  const handleFinalizeSale = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      let customerIdToUse = selectedCustomerId;

      // 1. If adding new customer on the fly
      if (isNewCustomer) {
        if (!newCustName || !newCustPhone || !newCustAddress) {
          throw new Error("Customer Name, Phone and Address are required");
        }
        const custRes = await fetch("/api/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newCustName,
            phone: newCustPhone,
            alternatePhone: newCustAltPhone,
            aadharNo: newCustAadhar,
            address: newCustAddress,
            city: newCustCity,
          }),
        });
        const custData = await custRes.json();
        if (!custRes.ok) {
          throw new Error(custData.error || "Failed to create customer");
        }
        customerIdToUse = String(custData.customer.id);
      }

      if (!selectedBikeId || !customerIdToUse || !agreedPrice) {
        throw new Error("Please select a bike, customer, and agree on sale price");
      }

      // 2. Submit sale
      const saleRes = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bikeId: selectedBikeId,
          customerId: customerIdToUse,
          agreedPrice: numAgreed,
          downPayment: numDown,
          paymentMode,
          paymentReference,
          paymentType,
          emiMonths: paymentType === "EMI" ? Number(emiMonths) : 0,
          emiMonthlyAmount: paymentType === "EMI" ? Number(emiMonthlyAmount) : 0,
          notes,
        }),
      });

      const data = await saleRes.json();
      if (!saleRes.ok) {
        throw new Error(data.error || "Failed to finalize sale");
      }

      setSaleResult({
        sale: data.sale,
        payment: data.payment,
        bike: selectedBike,
        customer: isNewCustomer
          ? {
              name: newCustName,
              phone: newCustPhone,
              address: newCustAddress,
              city: newCustCity,
            }
          : selectedCustomer,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm no-print">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-amber-500" />
            New Two-Wheeler Sale Wizard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Select bike → Select/Add Customer → Pricing & EMI → Generate Invoice & Receipt
          </p>
        </div>
        <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" /> Real-time Audit Recorded
        </span>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2 no-print">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* When Sale is Finished: Printable Invoice View */}
      {saleResult ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-slate-200 no-print">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Sale Successfully Booked & Saved in Database!
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
              >
                <Printer className="w-4 h-4" /> Print Customer Invoice & Receipt
              </button>
              <button
                onClick={() => {
                  setSaleResult(null);
                  router.push("/daily-book");
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
              >
                Go to Daily Record Book
              </button>
            </div>
          </div>

          {/* Printable Thermal/A4 Document Layout */}
          <div className="max-w-2xl mx-auto border border-slate-300 p-8 rounded-xl bg-white shadow-xs space-y-6">
            {/* Header */}
            <div className="text-center border-b pb-4">
              <div className="font-black text-2xl tracking-wider text-slate-900">
                MANIKANTA FINANCE
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Second Hand Two-Wheeler Sales, Purchases & Vehicle Finance
              </p>
              <p className="text-[11px] text-slate-500">
                Main Road, Miryalaguda, Nalgonda Dist. • Mobile: 9876543210
              </p>
              <div className="mt-2 inline-block bg-slate-900 text-amber-400 font-mono text-xs font-bold px-3 py-0.5 rounded">
                VEHICLE SALE INVOICE & CASH RECEIPT
              </div>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 text-xs">
              <div>
                <span className="text-slate-500">Invoice No:</span>{" "}
                <span className="font-mono font-bold text-slate-900">
                  {saleResult.sale.invoiceNo}
                </span>
                <br />
                <span className="text-slate-500">Date:</span>{" "}
                <span className="font-semibold text-slate-900">
                  {formatDate(saleResult.sale.saleDate)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-500">Payment Receipt #:</span>{" "}
                <span className="font-mono font-bold text-emerald-700">
                  {saleResult.payment?.receiptNo || "N/A"}
                </span>
                <br />
                <span className="text-slate-500">Status:</span>{" "}
                <span className="font-bold text-slate-900 uppercase">
                  {saleResult.sale.status}
                </span>
              </div>
            </div>

            {/* Parties */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg text-xs border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Customer / Buyer Details
                </span>
                <div className="font-bold text-slate-900 text-sm">
                  {saleResult.customer.name}
                </div>
                <div className="text-slate-600 font-mono">
                  📞 {saleResult.customer.phone}
                </div>
                <div className="text-slate-600 text-[11px]">
                  {saleResult.customer.address}, {saleResult.customer.city}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Vehicle Details
                </span>
                <div className="font-bold text-slate-900 text-sm">
                  {saleResult.bike?.brand} {saleResult.bike?.model}
                </div>
                <div className="text-slate-800 font-mono font-bold text-xs">
                  Reg Plate: {saleResult.bike?.regNo}
                </div>
                <div className="text-slate-500 font-mono text-[10px]">
                  Chassis: {saleResult.bike?.chassisNo}
                </div>
              </div>
            </div>

            {/* Financial Ledger */}
            <table className="w-full text-xs">
              <thead className="bg-slate-100 border-b">
                <tr>
                  <th className="py-2 px-3 text-left">Description</th>
                  <th className="py-2 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-2 px-3 font-medium">Agreed Vehicle Selling Price</td>
                  <td className="py-2 px-3 text-right font-bold text-slate-900">
                    {formatINR(saleResult.sale.agreedPrice)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-emerald-700">
                    Down Payment Received Today ({saleResult.payment?.paymentMode || "CASH"})
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-emerald-700">
                    -{formatINR(saleResult.sale.downPayment)}
                  </td>
                </tr>
                <tr className="bg-slate-50 font-black">
                  <td className="py-2.5 px-3 text-amber-900">
                    Net Outstanding Dues / Balance
                  </td>
                  <td className="py-2.5 px-3 text-right text-amber-900 text-sm">
                    {formatINR(saleResult.sale.pendingAmount)}
                  </td>
                </tr>
              </tbody>
            </table>

            {saleResult.sale.paymentType === "EMI" && saleResult.sale.pendingAmount > 0 && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs">
                <div className="font-bold text-amber-900 mb-1">
                  Agreed EMI Installment Terms:
                </div>
                <p className="text-slate-700">
                  Total of{" "}
                  <span className="font-bold">{saleResult.sale.emiMonths} monthly EMIs</span>{" "}
                  of{" "}
                  <span className="font-bold">
                    {formatINR(saleResult.sale.emiMonthlyAmount)}
                  </span>{" "}
                  each. Next installment due on {formatDate(saleResult.sale.nextDueDate)}.
                </p>
              </div>
            )}

            {/* Signatures */}
            <div className="grid grid-cols-2 pt-12 text-center text-xs">
              <div>
                <div className="border-t border-slate-400 w-40 mx-auto pt-1 font-semibold text-slate-700">
                  Customer Signature
                </div>
              </div>
              <div>
                <div className="border-t border-slate-400 w-48 mx-auto pt-1 font-semibold text-slate-700">
                  For Manikanta Finance (Authorized)
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Sale Wizard Form */
        <form onSubmit={handleFinalizeSale} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Form Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Bike Selection */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">
                    1
                  </span>
                  Select Bike from Available Showroom Stock
                </h2>
                <span className="text-xs text-slate-500">
                  {bikes.length} bikes in stock
                </span>
              </div>

              {bikes.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs bg-slate-50 rounded-xl">
                  No available bikes found in stock. Please add a bike first.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {bikes.map((bike) => {
                    const isSelected = String(bike.id) === String(selectedBikeId);
                    return (
                      <div
                        key={bike.id}
                        onClick={() => handleBikeChange(String(bike.id))}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                          isSelected
                            ? "bg-amber-50/70 border-amber-500 ring-2 ring-amber-500 shadow-sm"
                            : "bg-slate-50 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <img
                          src={bike.primaryPhoto || "/bikes/default-bike.jpg"}
                          alt={bike.model}
                          className="w-16 h-16 rounded-lg object-cover bg-slate-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="font-mono text-[10px] font-bold text-slate-500">
                            {bike.bikeCode}
                          </span>
                          <div className="font-bold text-xs text-slate-900 truncate">
                            {bike.brand} {bike.model} ({bike.year})
                          </div>
                          <div className="text-[11px] font-mono text-slate-600">
                            {bike.regNo}
                          </div>
                          <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-200/60 text-[11px]">
                            <span className="text-slate-500">
                              Cost: {formatINR(bike.totalInvestment)}
                            </span>
                            <span className="font-black text-emerald-700">
                              Target: {formatINR(bike.expectedSellingPrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Step 2: Customer Selection */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">
                    2
                  </span>
                  Select or Register Customer
                </h2>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setIsNewCustomer(false)}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      !isNewCustomer ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
                    }`}
                  >
                    Existing Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsNewCustomer(true)}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      isNewCustomer ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
                    }`}
                  >
                    + Add New Customer
                  </button>
                </div>
              </div>

              {!isNewCustomer ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Select From Existing Customer Directory
                  </label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">-- Choose Customer --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.phone}) — {c.city} (Dues: {formatINR(c.totalPending)})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Customer Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. K. Suresh"
                      value={newCustName}
                      onChange={(e) => setNewCustName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="98480xxxxx"
                      value={newCustPhone}
                      onChange={(e) => setNewCustPhone(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Alternate Mobile / Guardian Phone
                    </label>
                    <input
                      type="text"
                      placeholder="Optional"
                      value={newCustAltPhone}
                      onChange={(e) => setNewCustAltPhone(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Aadhar / ID Number
                    </label>
                    <input
                      type="text"
                      placeholder="xxxx-xxxx-xxxx"
                      value={newCustAadhar}
                      onChange={(e) => setNewCustAadhar(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Residential Address *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="House #, Street, Village / Town"
                      value={newCustAddress}
                      onChange={(e) => setNewCustAddress(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Financial Pricing & Payment Mode */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">
                  3
                </span>
                Agreed Pricing & Down Payment
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Agreed Final Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="65000"
                    value={agreedPrice}
                    onChange={(e) => setAgreedPrice(e.target.value)}
                    className="w-full px-3 py-2.5 border rounded-xl text-sm font-black text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500"
                  />
                  {selectedBike && (
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Shop Cost: {formatINR(selectedBike.totalInvestment)} • Target:{" "}
                      {formatINR(selectedBike.expectedSellingPrice)}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Initial Down Payment Received Today (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="35000"
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                    className="w-full px-3 py-2.5 border rounded-xl text-sm font-black text-emerald-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Remaining Balance:{" "}
                    <span className="font-bold text-amber-600">
                      {formatINR(pendingBalance)}
                    </span>
                  </span>
                </div>
              </div>

              {/* Payment Mode for Down payment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Down Payment Mode
                  </label>
                  <div className="flex gap-2">
                    {["CASH", "UPI", "BANK_TRANSFER"].map((mode) => (
                      <button
                        type="button"
                        key={mode}
                        onClick={() => setPaymentMode(mode)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg border ${
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
                    UPI UTR / Bank Reference No
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PhonePe UTR 123456"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              {/* Step 4: Pending / EMI Plan */}
              {pendingBalance > 0 && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900">
                      Balance Financing / EMI Setup (₹{pendingBalance} Pending)
                    </span>
                    <div className="flex gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setPaymentType("EMI")}
                        className={`px-3 py-1 rounded font-bold ${
                          paymentType === "EMI"
                            ? "bg-amber-600 text-white"
                            : "bg-white text-slate-700 border"
                        }`}
                      >
                        Monthly EMI Plan
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentType("HYBRID")}
                        className={`px-3 py-1 rounded font-bold ${
                          paymentType === "HYBRID"
                            ? "bg-amber-600 text-white"
                            : "bg-white text-slate-700 border"
                        }`}
                      >
                        Flexible Dues
                      </button>
                    </div>
                  </div>

                  {paymentType === "EMI" && (
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Tenure (Months)
                        </label>
                        <select
                          value={emiMonths}
                          onChange={(e) => setEmiMonths(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-xs bg-white font-bold"
                        >
                          <option value="2">2 Months</option>
                          <option value="3">3 Months</option>
                          <option value="4">4 Months</option>
                          <option value="5">5 Months</option>
                          <option value="6">6 Months</option>
                          <option value="10">10 Months</option>
                          <option value="12">12 Months</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Monthly Installment Amount (₹)
                        </label>
                        <input
                          type="number"
                          value={emiMonthlyAmount}
                          onChange={(e) => setEmiMonthlyAmount(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-xs font-bold text-emerald-800"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sale / Warranty Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1 free general service included, NOC in 15 days"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Live Summary Card & Save Button */}
          <div className="space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5 sticky top-24">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-black text-sm text-amber-400 uppercase tracking-wider">
                  Sale Summary & Margin
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  {formatDate(new Date())}
                </span>
              </div>

              {/* Bike selected summary */}
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Bike
                </span>
                {selectedBike ? (
                  <div className="font-bold text-white text-sm">
                    {selectedBike.brand} {selectedBike.model}
                    <div className="text-xs text-amber-400 font-mono">
                      {selectedBike.regNo} ({selectedBike.bikeCode})
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 italic">No bike selected</span>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
                <div className="flex justify-between text-slate-300">
                  <span>Agreed Sale Price:</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {formatINR(numAgreed)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Down Payment (Today):</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    -{formatINR(numDown)}
                  </span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-slate-800 text-amber-400">
                  <span>Pending Customer Balance:</span>
                  <span className="font-mono text-base">
                    {formatINR(pendingBalance)}
                  </span>
                </div>
              </div>

              {/* Shop Profit Realization */}
              {selectedBike && numAgreed > 0 && (
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs space-y-1">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Total Investment:</span>
                    <span className="font-mono">{formatINR(selectedBike.totalInvestment)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-1 border-t border-slate-700">
                    <span className="text-slate-200">Shop Net Margin:</span>
                    <span
                      className={`font-mono text-sm ${
                        numAgreed - selectedBike.totalInvestment >= 0
                          ? "text-emerald-400"
                          : "text-rose-400"
                      }`}
                    >
                      +{formatINR(numAgreed - selectedBike.totalInvestment)}
                    </span>
                  </div>
                </div>
              )}

              {/* Confirm Sale Button */}
              <button
                type="submit"
                disabled={saving || !selectedBikeId || (!selectedCustomerId && !newCustName)}
                className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-40"
              >
                {saving ? "Finalizing Sale..." : "Confirm Sale & Print Receipt"}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Automatically updates Daily Record Book & stock</span>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default function NewSalePage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-xs text-slate-500 font-bold">
          Loading sale wizard...
        </div>
      }
    >
      <SaleWizardContent />
    </Suspense>
  );
}
