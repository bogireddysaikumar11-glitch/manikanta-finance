export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateExcelBuffer } from "@/lib/excel";
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "full";
    const today = new Date();

    let sheets: { name: string; data: Record<string, any>[] }[] = [];
    let filename = `Manikanta_Finance_Export_${today.toISOString().slice(0, 10)}.xlsx`;

    if (type === "today" || type === "daybook") {
      filename = `Manikanta_Daybook_${today.toISOString().slice(0, 10)}.xlsx`;
      const dayStart = startOfDay(today);
      const dayEnd = endOfDay(today);

      const [sales, payments, expenses] = await Promise.all([
        prisma.sale.findMany({
          where: { saleDate: { gte: dayStart, lte: dayEnd } },
          include: { customer: true, bike: true },
        }),
        prisma.payment.findMany({
          where: { paymentDate: { gte: dayStart, lte: dayEnd } },
          include: { customer: true, sale: { include: { bike: true } } },
        }),
        prisma.expense.findMany({
          where: { expenseDate: { gte: dayStart, lte: dayEnd } },
          include: { bike: true },
        }),
      ]);

      const salesData = sales.map((s) => ({
        "Invoice No": s.invoiceNo,
        "Date": s.saleDate.toISOString().slice(0, 10),
        "Customer Name": s.customer.name,
        "Customer Phone": s.customer.phone,
        "Bike Code": s.bike.bikeCode,
        "Bike Model": `${s.bike.brand} ${s.bike.model}`,
        "Reg No": s.bike.regNo,
        "Agreed Price (INR)": s.agreedPrice,
        "Down Payment (INR)": s.downPayment,
        "Pending (INR)": s.pendingAmount,
        "Payment Type": s.paymentType,
        "Status": s.status,
      }));

      const paymentsData = payments.map((p) => ({
        "Receipt No": p.receiptNo,
        "Date": p.paymentDate.toISOString().slice(0, 10),
        "Customer": p.customer.name,
        "Phone": p.customer.phone,
        "Bike Reg": p.sale?.bike?.regNo || "N/A",
        "Amount (INR)": p.amount,
        "Mode": p.paymentMode,
        "Reference": p.referenceNo || "-",
        "Notes": p.notes || "-",
      }));

      const expensesData = expenses.map((e) => ({
        "ID": e.id,
        "Date": e.expenseDate.toISOString().slice(0, 10),
        "Title": e.title,
        "Category": e.category,
        "Amount (INR)": e.amount,
        "Mode": e.paymentMode,
        "Linked Bike": e.bike?.regNo || "General Shop",
        "Notes": e.notes || "-",
      }));

      const totalSales = sales.reduce((sum, s) => sum + s.agreedPrice, 0);
      const totalCollections = payments.reduce((sum, p) => sum + p.amount, 0);
      const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

      const summaryData = [
        { "Metric": "Date", "Value": today.toISOString().slice(0, 10) },
        { "Metric": "Total Sales (INR)", "Value": totalSales },
        { "Metric": "Payments Received (INR)", "Value": totalCollections },
        { "Metric": "Total Expenses (INR)", "Value": totalExpenses },
        { "Metric": "Net Cash Flow (INR)", "Value": totalCollections - totalExpenses },
      ];

      sheets = [
        { name: "Day Summary", data: summaryData },
        { name: "Collections", data: paymentsData },
        { name: "Sales", data: salesData },
        { name: "Expenses", data: expensesData },
      ];
    } else if (type === "bikes") {
      filename = `Manikanta_Bikes_Inventory_${today.toISOString().slice(0, 10)}.xlsx`;
      const bikes = await prisma.bike.findMany({ orderBy: { id: "desc" } });
      const bikesData = bikes.map((b) => ({
        "Bike Code": b.bikeCode,
        "Brand": b.brand,
        "Model": b.model,
        "Year": b.year,
        "Reg No": b.regNo,
        "Engine No": b.engineNo,
        "Chassis No": b.chassisNo,
        "Purchase Price (INR)": b.purchasePrice,
        "Repair Cost (INR)": b.repairCost,
        "Total Investment (INR)": b.totalInvestment,
        "Expected Price (INR)": b.expectedSellingPrice,
        "Actual Sold Price (INR)": b.actualSellingPrice || "-",
        "Profit / Margin (INR)": b.actualSellingPrice ? b.actualSellingPrice - b.totalInvestment : "-",
        "Status": b.status,
        "Seller Name": b.sellerName || "-",
        "Seller Phone": b.sellerPhone || "-",
      }));
      sheets = [{ name: "Bike Inventory", data: bikesData }];
    } else if (type === "customers") {
      filename = `Manikanta_Customer_Ledger_${today.toISOString().slice(0, 10)}.xlsx`;
      const customers = await prisma.customer.findMany({
        include: { sales: true, payments: true },
      });
      const data = customers.map((c) => {
        const totalPurchases = c.sales.reduce((sum, s) => sum + s.agreedPrice, 0);
        const totalPaid = c.payments.reduce((sum, p) => sum + p.amount, 0);
        return {
          "Customer ID": c.id,
          "Name": c.name,
          "Phone": c.phone,
          "Alt Phone": c.alternatePhone || "-",
          "Aadhar No": c.aadharNo || "-",
          "City": c.city,
          "Address": c.address,
          "Total Purchases (INR)": totalPurchases,
          "Total Paid (INR)": totalPaid,
          "Pending Balance (INR)": Math.max(0, totalPurchases - totalPaid),
        };
      });
      sheets = [{ name: "Customers", data }];
    } else if (type === "sales") {
      filename = `Manikanta_Sales_Register_${today.toISOString().slice(0, 10)}.xlsx`;
      const sales = await prisma.sale.findMany({
        include: { customer: true, bike: true },
        orderBy: { id: "desc" },
      });
      const data = sales.map((s) => ({
        "Invoice No": s.invoiceNo,
        "Date": s.saleDate.toISOString().slice(0, 10),
        "Customer": s.customer.name,
        "Phone": s.customer.phone,
        "Bike": `${s.bike.brand} ${s.bike.model} (${s.bike.regNo})`,
        "Sale Price (INR)": s.agreedPrice,
        "Down Payment (INR)": s.downPayment,
        "Pending Balance (INR)": s.pendingAmount,
        "EMI Months": s.emiMonths,
        "EMI Amount (INR)": s.emiMonthlyAmount,
        "Status": s.status,
      }));
      sheets = [{ name: "Sales", data }];
    } else if (type === "payments") {
      filename = `Manikanta_Payment_Receipts_${today.toISOString().slice(0, 10)}.xlsx`;
      const payments = await prisma.payment.findMany({
        include: { customer: true, sale: { include: { bike: true } } },
        orderBy: { paymentDate: "desc" },
      });
      const data = payments.map((p) => ({
        "Receipt No": p.receiptNo,
        "Date": p.paymentDate.toISOString().slice(0, 10),
        "Customer": p.customer.name,
        "Phone": p.customer.phone,
        "Bike": p.sale?.bike?.regNo || "-",
        "Amount (INR)": p.amount,
        "Mode": p.paymentMode,
        "Reference": p.referenceNo || "-",
        "Recorded By": p.recordedBy,
      }));
      sheets = [{ name: "Payments", data }];
    } else if (type === "expenses") {
      filename = `Manikanta_Expenses_${today.toISOString().slice(0, 10)}.xlsx`;
      const expenses = await prisma.expense.findMany({
        include: { bike: true },
        orderBy: { expenseDate: "desc" },
      });
      const data = expenses.map((e) => ({
        "Expense ID": e.id,
        "Date": e.expenseDate.toISOString().slice(0, 10),
        "Title": e.title,
        "Category": e.category,
        "Amount (INR)": e.amount,
        "Mode": e.paymentMode,
        "Bike": e.bike?.regNo || "General",
        "Notes": e.notes || "-",
      }));
      sheets = [{ name: "Expenses", data }];
    } else {
      // Full Master Backup Pack
      filename = `Manikanta_Master_Backup_${today.toISOString().slice(0, 10)}.xlsx`;
      const [bikes, customers, sales, payments, expenses, audit] = await Promise.all([
        prisma.bike.findMany(),
        prisma.customer.findMany(),
        prisma.sale.findMany(),
        prisma.payment.findMany(),
        prisma.expense.findMany(),
        prisma.auditLog.findMany({ take: 200, orderBy: { timestamp: "desc" } }),
      ]);

      sheets = [
        { name: "Bikes Inventory", data: bikes },
        { name: "Customers", data: customers },
        { name: "Sales", data: sales },
        { name: "Payments", data: payments },
        { name: "Expenses", data: expenses },
        { name: "Audit Logs", data: audit },
      ];
    }

    const buffer = generateExcelBuffer(sheets);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error: any) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to generate Excel file" },
      { status: 500 }
    );
  }
}
