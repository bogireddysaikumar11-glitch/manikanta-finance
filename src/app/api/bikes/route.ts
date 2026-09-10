export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordAuditLog } from "@/lib/audit";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { bikeCode: { contains: search } },
        { brand: { contains: search } },
        { model: { contains: search } },
        { regNo: { contains: search } },
        { chassisNo: { contains: search } },
      ];
    }

    const bikes = await prisma.bike.findMany({
      where,
      orderBy: { id: "desc" },
      include: {
        sales: {
          include: {
            customer: true,
          },
        },
        expenses: true,
      },
    });

    const summary = {
      total: bikes.length,
      available: bikes.filter((b) => b.status === "AVAILABLE").length,
      inRepair: bikes.filter((b) => b.status === "IN_REPAIR").length,
      sold: bikes.filter((b) => b.status === "SOLD").length,
      totalInvestedInStock: bikes
        .filter((b) => b.status !== "SOLD")
        .reduce((sum, b) => sum + b.totalInvestment, 0),
    };

    return NextResponse.json({ bikes, summary });
  } catch (error: any) {
    console.error("Error fetching bikes:", error);
    return NextResponse.json(
      { error: "Failed to fetch bikes" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      brand,
      model,
      year,
      regNo,
      engineNo,
      chassisNo,
      purchasePrice,
      repairCost = 0,
      expectedSellingPrice,
      sellerName,
      sellerPhone,
      notes,
      primaryPhoto,
      status = "AVAILABLE",
      documents,
      photos,
      purchaseDate,
      paymentMode = "CASH",
      recordExpense = false,
    } = body;

    if (!brand || !model || !regNo || !purchasePrice || !expectedSellingPrice) {
      return NextResponse.json(
        { error: "Brand, model, regNo, purchase price and expected price are required" },
        { status: 400 }
      );
    }

    // Generate unique Bike Code MF-2026-XXXX
    const count = await prisma.bike.count();
    const currentYear = new Date().getFullYear();
    const bikeCode = `MF-${currentYear}-${String(count + 1).padStart(4, "0")}`;

    const numPurchase = Number(purchasePrice);
    const numRepair = Number(repairCost) || 0;
    const totalInvestment = numPurchase + numRepair;

    const parsedPurchaseDate = purchaseDate ? new Date(purchaseDate) : new Date();

    const bike = await prisma.bike.create({
      data: {
        bikeCode,
        brand,
        model,
        year: Number(year) || currentYear,
        regNo: regNo.toUpperCase().trim(),
        engineNo: engineNo?.trim() || "N/A",
        chassisNo: chassisNo?.trim() || "N/A",
        purchasePrice: numPurchase,
        repairCost: numRepair,
        totalInvestment,
        expectedSellingPrice: Number(expectedSellingPrice),
        sellerName: sellerName?.trim() || null,
        sellerPhone: sellerPhone?.trim() || null,
        notes: notes?.trim() || null,
        primaryPhoto: primaryPhoto || "/bikes/default-bike.jpg",
        photos: typeof photos === "string" ? photos : JSON.stringify(photos || []),
        documents: typeof documents === "string" ? documents : JSON.stringify(documents || []),
        purchaseDate: parsedPurchaseDate,
        status,
      },
    });

    // Optionally auto-record the purchase payment into the expense ledger
    if (recordExpense) {
      try {
        await prisma.expense.create({
          data: {
            title: `Bike Purchase: ${bike.brand} ${bike.model} (${bike.regNo})`,
            category: "VEHICLE_PURCHASE",
            amount: numPurchase,
            paymentMode: paymentMode || "CASH",
            bikeId: bike.id,
            expenseDate: parsedPurchaseDate,
            notes: `Purchased from seller ${sellerName || "N/A"} (${sellerPhone || "N/A"}) - Code: ${bike.bikeCode}`,
            recordedBy: "Shop Owner",
          },
        });
      } catch (expErr) {
        console.error("Warning: Failed to create linked expense for bike purchase:", expErr);
      }
    }

    await recordAuditLog({
      entityType: "BIKE",
      entityId: String(bike.id),
      action: "CREATE",
      description: `Shop Owner purchased and added bike ${bike.bikeCode} (${bike.brand} ${bike.model} - ${bike.regNo}) for ₹${numPurchase.toLocaleString("en-IN")}`,
      newValue: bike,
    });

    return NextResponse.json({ success: true, bike });
  } catch (error: any) {
    console.error("Error creating bike:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Registration number or bike code already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create bike" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Bike ID required" }, { status: 400 });
    }

    const existing = await prisma.bike.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return NextResponse.json({ error: "Bike not found" }, { status: 404 });
    }

    const purchasePrice =
      updateData.purchasePrice !== undefined
        ? Number(updateData.purchasePrice)
        : existing.purchasePrice;
    const repairCost =
      updateData.repairCost !== undefined
        ? Number(updateData.repairCost)
        : existing.repairCost;
    const totalInvestment = purchasePrice + repairCost;

    const updated = await prisma.bike.update({
      where: { id: Number(id) },
      data: {
        ...updateData,
        purchasePrice,
        repairCost,
        totalInvestment,
      },
    });

    await recordAuditLog({
      entityType: "BIKE",
      entityId: String(updated.id),
      action: "UPDATE",
      description: `Updated bike ${updated.bikeCode} (${updated.brand} ${updated.model})`,
      oldValue: existing,
      newValue: updated,
    });

    return NextResponse.json({ success: true, bike: updated });
  } catch (error: any) {
    console.error("Error updating bike:", error);
    return NextResponse.json(
      { error: "Failed to update bike" },
      { status: 500 }
    );
  }
}
