export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordAuditLog } from "@/lib/audit";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");

    const where: any = {};
    if (customerId) {
      where.customerId = Number(customerId);
    }

    const sales = await prisma.sale.findMany({
      where,
      orderBy: { id: "desc" },
      include: {
        bike: true,
        customer: true,
        payments: {
          orderBy: { paymentDate: "asc" },
        },
      },
    });

    return NextResponse.json({ sales });
  } catch (error: any) {
    console.error("Error fetching sales:", error);
    return NextResponse.json(
      { error: "Failed to fetch sales" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      bikeId,
      customerId,
      agreedPrice,
      downPayment,
      paymentMode = "CASH",
      paymentReference = "",
      paymentType = "FULL_CASH",
      emiMonths = 0,
      emiMonthlyAmount = 0,
      notes = "",
    } = body;

    if (!bikeId || !customerId || !agreedPrice) {
      return NextResponse.json(
        { error: "Bike, Customer, and Agreed Price are required" },
        { status: 400 }
      );
    }

    const numAgreed = Number(agreedPrice);
    const numDown = Number(downPayment) || 0;
    const pendingAmount = Math.max(0, numAgreed - numDown);

    // Verify bike is available
    const bike = await prisma.bike.findUnique({
      where: { id: Number(bikeId) },
    });
    if (!bike || bike.status === "SOLD") {
      return NextResponse.json(
        { error: "Selected bike is not available for sale" },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.findUnique({
      where: { id: Number(customerId) },
    });
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // Generate Invoice No: INV-2026-XXXX
    const saleCount = await prisma.sale.count();
    const currentYear = new Date().getFullYear();
    const invoiceNo = `INV-${currentYear}-${String(saleCount + 1).padStart(4, "0")}`;

    // Next Due Date for EMI
    const nextDueDate =
      pendingAmount > 0
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        : null;

    // Use transaction for atomic consistency
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Sale
      const sale = await tx.sale.create({
        data: {
          invoiceNo,
          bikeId: Number(bikeId),
          customerId: Number(customerId),
          agreedPrice: numAgreed,
          downPayment: numDown,
          pendingAmount,
          paymentType,
          emiMonths: Number(emiMonths) || 0,
          emiMonthlyAmount: Number(emiMonthlyAmount) || 0,
          nextDueDate,
          status: pendingAmount === 0 ? "COMPLETED" : "ACTIVE",
          notes,
        },
      });

      // 2. Mark bike as SOLD
      await tx.bike.update({
        where: { id: Number(bikeId) },
        data: {
          status: "SOLD",
          actualSellingPrice: numAgreed,
        },
      });

      // 3. If downPayment > 0, generate receipt and record payment
      let paymentRecord = null;
      if (numDown > 0) {
        const paymentCount = await tx.payment.count();
        const receiptNo = `REC-${currentYear}-${String(paymentCount + 1).padStart(4, "0")}`;

        paymentRecord = await tx.payment.create({
          data: {
            receiptNo,
            saleId: sale.id,
            customerId: Number(customerId),
            amount: numDown,
            paymentMode,
            referenceNo: paymentReference,
            notes: "Down payment upon sale booking",
            recordedBy: "Admin",
          },
        });
      }

      return { sale, paymentRecord };
    });

    await recordAuditLog({
      entityType: "SALE",
      entityId: String(result.sale.id),
      action: "CREATE",
      description: `Sale finalized: ${invoiceNo} for ${bike.brand} ${bike.model} (${bike.regNo}) to ${customer.name}. Amount: ?${numAgreed}, Down: ?${numDown}`,
      newValue: result,
    });

    return NextResponse.json({
      success: true,
      sale: result.sale,
      payment: result.paymentRecord,
    });
  } catch (error: any) {
    console.error("Error creating sale:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create sale" },
      { status: 500 }
    );
  }
}
