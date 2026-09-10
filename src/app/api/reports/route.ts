export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [sales, bikes, payments, expenses, customers] = await Promise.all([
      prisma.sale.findMany({
        include: { bike: true, customer: true, payments: true },
        orderBy: { saleDate: "desc" },
      }),
      prisma.bike.findMany({
        orderBy: { id: "desc" },
      }),
      prisma.payment.findMany({
        include: { customer: true },
        orderBy: { paymentDate: "desc" },
      }),
      prisma.expense.findMany({
        orderBy: { expenseDate: "desc" },
      }),
      prisma.customer.findMany({
        include: { sales: true, payments: true },
      }),
    ]);

    // Financial calculations
    const totalSalesVolume = sales.reduce((sum, s) => sum + s.agreedPrice, 0);
    const totalCollections = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalOutstandingDues = sales.reduce((sum, s) => sum + s.pendingAmount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Bike profit calculation on sold bikes
    const soldBikes = bikes.filter((b) => b.status === "SOLD" && b.actualSellingPrice);
    const bikeProfits = soldBikes.map((b) => {
      const profit = (b.actualSellingPrice || 0) - b.totalInvestment;
      const marginPct = b.totalInvestment > 0 ? ((profit / b.totalInvestment) * 100).toFixed(1) : "0";
      return {
        id: b.id,
        bikeCode: b.bikeCode,
        model: `${b.brand} ${b.model}`,
        regNo: b.regNo,
        purchasePrice: b.purchasePrice,
        repairCost: b.repairCost,
        totalInvestment: b.totalInvestment,
        soldPrice: b.actualSellingPrice,
        profit,
        marginPct,
      };
    });

    const totalRealizedProfit = bikeProfits.reduce((sum, b) => sum + b.profit, 0);

    // Payment Modes split
    const cashCollections = payments
      .filter((p) => p.paymentMode === "CASH")
      .reduce((sum, p) => sum + p.amount, 0);
    const upiCollections = payments
      .filter((p) => p.paymentMode !== "CASH")
      .reduce((sum, p) => sum + p.amount, 0);

    // Customer Pending aging
    const pendingCustomers = customers
      .map((c) => {
        const totalBought = c.sales.reduce((sum, s) => sum + s.agreedPrice, 0);
        const totalPaid = c.payments.reduce((sum, p) => sum + p.amount, 0);
        const pending = totalBought - totalPaid;
        return {
          id: c.id,
          name: c.name,
          phone: c.phone,
          city: c.city,
          pending,
          activeSalesCount: c.sales.filter((s) => s.status === "ACTIVE").length,
        };
      })
      .filter((c) => c.pending > 0)
      .sort((a, b) => b.pending - a.pending);

    // Inventory Asset Value
    const stockAssetValue = bikes
      .filter((b) => b.status !== "SOLD")
      .reduce((sum, b) => sum + b.totalInvestment, 0);

    return NextResponse.json({
      summary: {
        totalSalesVolume,
        totalCollections,
        totalOutstandingDues,
        totalExpenses,
        totalRealizedProfit,
        netShopIncome: totalRealizedProfit - totalExpenses,
        stockAssetValue,
        bikesInStock: bikes.filter((b) => b.status !== "SOLD").length,
        bikesSold: soldBikes.length,
      },
      paymentSplit: {
        cash: cashCollections,
        upi: upiCollections,
      },
      bikeProfits,
      pendingCustomers,
    });
  } catch (error: any) {
    console.error("Reports error:", error);
    return NextResponse.json(
      { error: "Failed to load reports" },
      { status: 500 }
    );
  }
}
