export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  parseISO,
  format,
} from "date-fns";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");
    const period = (searchParams.get("period") || "daily").toLowerCase(); // daily, weekly, monthly, yearly

    const targetDate = dateParam ? parseISO(dateParam) : new Date();

    let startDate: Date;
    let endDate: Date;
    let periodLabel: string;

    if (period === "weekly") {
      startDate = startOfWeek(targetDate, { weekStartsOn: 1 });
      endDate = endOfWeek(targetDate, { weekStartsOn: 1 });
      periodLabel = `${format(startDate, "dd MMM yyyy")} - ${format(endDate, "dd MMM yyyy")}`;
    } else if (period === "monthly") {
      startDate = startOfMonth(targetDate);
      endDate = endOfMonth(targetDate);
      periodLabel = format(targetDate, "MMMM yyyy");
    } else if (period === "yearly") {
      startDate = startOfYear(targetDate);
      endDate = endOfYear(targetDate);
      periodLabel = `Year ${format(targetDate, "yyyy")}`;
    } else {
      // daily
      startDate = startOfDay(targetDate);
      endDate = endOfDay(targetDate);
      periodLabel = format(targetDate, "dd MMM yyyy");
    }

    // 1. Sales in period
    const sales = await prisma.sale.findMany({
      where: {
        saleDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        customer: true,
        bike: true,
        payments: true,
      },
      orderBy: { saleDate: "desc" },
    });

    // 2. Payments in period
    const payments = await prisma.payment.findMany({
      where: {
        paymentDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        customer: true,
        sale: {
          include: {
            bike: true,
          },
        },
      },
      orderBy: { paymentDate: "desc" },
    });

    // 3. Expenses in period
    const expenses = await prisma.expense.findMany({
      where: {
        expenseDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        bike: true,
      },
      orderBy: { expenseDate: "desc" },
    });

    // 4. Bikes purchased in period
    const bikesPurchased = await prisma.bike.findMany({
      where: {
        purchaseDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { purchaseDate: "desc" },
    });

    // Summaries
    const totalSales = sales.reduce((sum, s) => sum + s.agreedPrice, 0);
    const totalPaymentsReceived = payments.reduce((sum, p) => sum + p.amount, 0);
    const cashPayments = payments
      .filter((p) => p.paymentMode === "CASH")
      .reduce((sum, p) => sum + p.amount, 0);
    const upiPayments = payments
      .filter((p) => p.paymentMode !== "CASH")
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingCreatedInPeriod = sales.reduce((sum, s) => sum + s.pendingAmount, 0);

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const cashExpenses = expenses
      .filter((e) => e.paymentMode === "CASH")
      .reduce((sum, e) => sum + e.amount, 0);
    const upiExpenses = expenses
      .filter((e) => e.paymentMode !== "CASH")
      .reduce((sum, e) => sum + e.amount, 0);

    const netCashFlow = totalPaymentsReceived - totalExpenses;
    const netCashDelta = cashPayments - cashExpenses;

    // Build unified chronological ledger items
    const ledgerItems: Array<{
      id: string;
      date: string;
      time: Date;
      type: "PAYMENT_IN" | "EXPENSE_OUT" | "SALE_BOOKED" | "BIKE_BOUGHT";
      refNo: string;
      description: string;
      party: string;
      phone?: string;
      amountIn: number;
      amountOut: number;
      paymentMode: string;
      status?: string;
      bikeDetails?: string;
      bikePhoto?: string;
    }> = [];

    // Add Sales
    for (const s of sales) {
      ledgerItems.push({
        id: `SALE-${s.id}`,
        date: format(s.saleDate, "dd MMM yyyy"),
        time: s.saleDate,
        type: "SALE_BOOKED",
        refNo: s.invoiceNo,
        description: `Sale: ${s.bike.brand} ${s.bike.model} (${s.bike.regNo})`,
        party: s.customer.name,
        phone: s.customer.phone,
        amountIn: s.downPayment,
        amountOut: 0,
        paymentMode: s.downPayment > 0 ? "Cash / UPI" : "Pending",
        status: s.status,
        bikeDetails: `${s.bike.brand} ${s.bike.model} • ${s.bike.regNo}`,
        bikePhoto: s.bike.primaryPhoto || "/bikes/default-bike.jpg",
      });
    }

    // Add Payments
    for (const p of payments) {
      ledgerItems.push({
        id: `PAY-${p.id}`,
        date: format(p.paymentDate, "dd MMM yyyy"),
        time: p.paymentDate,
        type: "PAYMENT_IN",
        refNo: p.receiptNo,
        description: `Receipt for ${p.sale?.bike ? `${p.sale.bike.brand} ${p.sale.bike.model}` : "Bike installment"}`,
        party: p.customer.name,
        phone: p.customer.phone,
        amountIn: p.amount,
        amountOut: 0,
        paymentMode: p.paymentMode,
        status: "Paid",
        bikeDetails: p.sale?.bike ? `${p.sale.bike.brand} ${p.sale.bike.model} • ${p.sale.bike.regNo}` : undefined,
      });
    }

    // Add Expenses
    for (const e of expenses) {
      ledgerItems.push({
        id: `EXP-${e.id}`,
        date: format(e.expenseDate, "dd MMM yyyy"),
        time: e.expenseDate,
        type: "EXPENSE_OUT",
        refNo: `EXP-${e.id}`,
        description: `${e.title} [${e.category.replace(/_/g, " ")}]`,
        party: e.bike ? `Bike: ${e.bike.regNo}` : "Shop Expense",
        amountIn: 0,
        amountOut: e.amount,
        paymentMode: e.paymentMode,
        status: "Cleared",
      });
    }

    // Add Purchases
    for (const b of bikesPurchased) {
      ledgerItems.push({
        id: `BIKE-${b.id}`,
        date: format(b.purchaseDate, "dd MMM yyyy"),
        time: b.purchaseDate,
        type: "BIKE_BOUGHT",
        refNo: b.bikeCode,
        description: `Purchased ${b.brand} ${b.model} into inventory`,
        party: b.sellerName || "Direct Seller",
        phone: b.sellerPhone || undefined,
        amountIn: 0,
        amountOut: b.purchasePrice,
        paymentMode: "Cash / Bank",
        status: "Stock",
        bikeDetails: `${b.brand} ${b.model} • ${b.regNo}`,
        bikePhoto: b.primaryPhoto || "/bikes/default-bike.jpg",
      });
    }

    // Sort by timestamp desc
    ledgerItems.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return NextResponse.json({
      period,
      periodLabel,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      summary: {
        sales: totalSales,
        paymentsReceived: totalPaymentsReceived,
        cashPayments,
        upiPayments,
        pending: pendingCreatedInPeriod,
        expenses: totalExpenses,
        cashExpenses,
        upiExpenses,
        netCashFlow,
        netCashDelta,
        totalTransactions: sales.length + payments.length + expenses.length + bikesPurchased.length,
        bikesSoldCount: sales.length,
        bikesBoughtCount: bikesPurchased.length,
      },
      ledgerItems,
      sales,
      payments,
      expenses,
      bikesPurchased,
    });
  } catch (error: any) {
    console.error("Error fetching record data:", error);
    return NextResponse.json(
      { error: "Failed to fetch record data" },
      { status: 500 }
    );
  }
}
