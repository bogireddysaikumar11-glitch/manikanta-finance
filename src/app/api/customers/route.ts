export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordAuditLog } from "@/lib/audit";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { aadharNo: { contains: search } },
        { city: { contains: search } },
      ];
    }

    const customers = await prisma.customer.findMany({
      where,
      orderBy: { id: "desc" },
      include: {
        sales: {
          include: {
            bike: true,
          },
        },
        payments: true,
      },
    });

    const enriched = customers.map((c) => {
      const totalPurchases = c.sales.reduce((sum, s) => sum + s.agreedPrice, 0);
      const totalPaid = c.payments.reduce((sum, p) => sum + p.amount, 0);
      const totalPending = Math.max(0, totalPurchases - totalPaid);

      return {
        ...c,
        totalPurchases,
        totalPaid,
        totalPending,
      };
    });

    return NextResponse.json({ customers: enriched });
  } catch (error: any) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, name, phone, alternatePhone, aadharNo, address, city, notes } = body;

    if (!name || !phone || !address) {
      return NextResponse.json(
        { error: "Name, phone and address are required" },
        { status: 400 }
      );
    }

    if (id) {
      // Update
      const customer = await prisma.customer.update({
        where: { id: Number(id) },
        data: {
          name: name.trim(),
          phone: phone.trim(),
          alternatePhone: alternatePhone?.trim(),
          aadharNo: aadharNo?.trim(),
          address: address.trim(),
          city: city?.trim() || "Miryalaguda",
          notes: notes?.trim(),
        },
      });

      await recordAuditLog({
        entityType: "CUSTOMER",
        entityId: String(customer.id),
        action: "UPDATE",
        description: `Updated customer details for ${customer.name} (${customer.phone})`,
        newValue: customer,
      });

      return NextResponse.json({ success: true, customer });
    } else {
      // Create
      const customer = await prisma.customer.create({
        data: {
          name: name.trim(),
          phone: phone.trim(),
          alternatePhone: alternatePhone?.trim(),
          aadharNo: aadharNo?.trim(),
          address: address.trim(),
          city: city?.trim() || "Miryalaguda",
          notes: notes?.trim(),
        },
      });

      await recordAuditLog({
        entityType: "CUSTOMER",
        entityId: String(customer.id),
        action: "CREATE",
        description: `Registered new customer ${customer.name} (${customer.phone})`,
        newValue: customer,
      });

      return NextResponse.json({ success: true, customer });
    }
  } catch (error: any) {
    console.error("Error saving customer:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Customer with this phone number already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to save customer" },
      { status: 500 }
    );
  }
}
