export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordAuditLog } from "@/lib/audit";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const saleId = searchParams.get("saleId");
    const customerId = searchParams.get("customerId");

    const where: any = {};
    if (saleId) where.saleId = Number(saleId);
    if (customerId) where.customerId = Number(customerId);

    const payments = await prisma.payment.findMany({
      where,
      orderBy: { paymentDate: "desc" },
      include: {
        customer: true,
        sale: {
          include: {
            bike: true,
          },
        },
      },
    });

    const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);

    return NextResponse.json({ payments, totalCollected });
  } catch (error: any) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { saleId, amount, paymentMode = "CASH", referenceNo = "", notes = "" } = body;

    if (!saleId || !amount || Number(amount) <= 0) {
      return NextResponse.json(
        { error: "Valid sale and payment amount are required" },
        { status: 400 }
      );
    }

    const sale = await prisma.sale.findUnique({
      where: { id: Number(saleId) },
      include: { customer: true, bike: true },
    });

    if (!sale) {
      return NextResponse.json({ error: "Sale record not found" }, { status: 404 });
    }

    const paymentAmount = Number(amount);
    const newPending = Math.max(0, sale.pendingAmount - paymentAmount);
    const currentYear = new Date().getFullYear();
    const count = await prisma.payment.count();
    const receiptNo = `REC-${currentYear}-${String(count + 1).padStart(4, "0")}`;

    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          receiptNo,
          saleId: sale.id,
          customerId: sale.customerId,
          amount: paymentAmount,
          paymentMode,
          referenceNo,
          notes,
          recordedBy: "Admin",
        },
      });

      const updatedSale = await tx.sale.update({
        where: { id: sale.id },
        data: {
          pendingAmount: newPending,
          status: newPending === 0 ? "COMPLETED" : sale.status,
        },
      });

      return { payment, updatedSale };
    });

    await recordAuditLog({
      entityType: "PAYMENT",
      entityId: String(result.payment.id),
      action: "PAYMENT_RECEIVED",
      description: `Collected ${receiptNo} of ?${paymentAmount} from ${sale.customer.name} for ${sale.bike.brand} ${sale.bike.model}. Remaining dues: ?${newPending}`,
      newValue: result.payment,
    });

    return NextResponse.json({
      success: true,
      payment: result.payment,
      remainingPending: newPending,
    });
  } catch (error: any) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { error: "Failed to record payment" },
      { status: 500 }
    );
  }
}
