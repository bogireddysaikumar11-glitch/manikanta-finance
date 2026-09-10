export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordAuditLog } from "@/lib/audit";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const where: any = {};
    if (category && category !== "ALL") {
      where.category = category;
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { expenseDate: "desc" },
      include: {
        bike: true,
      },
    });

    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

    const categoryBreakdown = expenses.reduce((acc: Record<string, number>, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    return NextResponse.json({ expenses, totalExpense, categoryBreakdown });
  } catch (error: any) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, category, amount, paymentMode = "CASH", bikeId, notes, expenseDate } = body;

    if (!title || !category || !amount || Number(amount) <= 0) {
      return NextResponse.json(
        { error: "Title, category, and valid amount are required" },
        { status: 400 }
      );
    }

    const expenseAmount = Number(amount);
    const parsedDate = expenseDate ? new Date(expenseDate) : new Date();

    const result = await prisma.$transaction(async (tx) => {
      const expense = await tx.expense.create({
        data: {
          title: title.trim(),
          category,
          amount: expenseAmount,
          paymentMode,
          bikeId: bikeId ? Number(bikeId) : null,
          expenseDate: parsedDate,
          notes,
          recordedBy: "Admin",
        },
      });

      // If tied to a specific bike repair, update bike's repairCost and totalInvestment
      if (bikeId && category === "REPAIR_PARTS") {
        const bike = await tx.bike.findUnique({ where: { id: Number(bikeId) } });
        if (bike) {
          const newRepairCost = bike.repairCost + expenseAmount;
          await tx.bike.update({
            where: { id: bike.id },
            data: {
              repairCost: newRepairCost,
              totalInvestment: bike.purchasePrice + newRepairCost,
            },
          });
        }
      }

      return expense;
    });

    await recordAuditLog({
      entityType: "EXPENSE",
      entityId: String(result.id),
      action: "CREATE",
      description: `Expense recorded: ?${expenseAmount} for ${title} [${category}] via ${paymentMode}`,
      newValue: result,
    });

    return NextResponse.json({ success: true, expense: result });
  } catch (error: any) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}
