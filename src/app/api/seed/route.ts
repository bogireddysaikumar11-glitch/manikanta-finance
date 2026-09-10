import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Helper route to seed database in production (e.g. Vercel)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    // Optional simple security check
    if (process.env.NODE_ENV === "production" && key !== "manikanta2026") {
      // Check if user already exists
      const userCount = await prisma.user.count();
      if (userCount > 0) {
        return NextResponse.json({
          message: "Database is already seeded with admin user.",
          userCount,
        });
      }
    }

    // Check if admin user exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@manikantafinance.com" },
    });

    const hashedPassword = await bcrypt.hash("manikanta04", 10);
    if (!existingAdmin) {
      await prisma.user.create({
        data: {
          email: "admin@manikantafinance.com",
          phone: "9876543210",
          name: "Manikanta Reddy",
          passwordHash: hashedPassword,
          role: "SUPER_ADMIN",
          twoFactorSecret: "202600",
          twoFactorEnabled: true,
        },
      });
    } else {
      await prisma.user.update({
        where: { email: "admin@manikantafinance.com" },
        data: {
          name: "Manikanta Reddy",
          passwordHash: hashedPassword,
        },
      });
    }

    // Seed sample bikes if inventory is empty
    const bikeCount = await prisma.bike.count();
    if (bikeCount === 0) {
      await prisma.bike.createMany({
        data: [
          {
            bikeCode: "MF-2026-0001",
            brand: "Honda",
            model: "Activa 6G Deluxe",
            year: 2022,
            regNo: "AP29BZ4821",
            engineNo: "JF91E8839210",
            chassisNo: "ME4JF9139N829104",
            purchasePrice: 42000,
            repairCost: 3500,
            totalInvestment: 45500,
            expectedSellingPrice: 56000,
            status: "AVAILABLE",
            primaryPhoto: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80",
            sellerName: "Chandraiah G.",
            sellerPhone: "9848123456",
            notes: "Single owner, neat condition, new battery fitted",
          },
          {
            bikeCode: "MF-2026-0002",
            brand: "Bajaj",
            model: "Pulsar 150 Twin Disc",
            year: 2021,
            regNo: "TS08EA1945",
            engineNo: "DHGBTC928172",
            chassisNo: "MD2DS150NZ892182",
            purchasePrice: 48000,
            repairCost: 4200,
            totalInvestment: 52200,
            expectedSellingPrice: 64000,
            status: "AVAILABLE",
            primaryPhoto: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80",
            sellerName: "K. Narsimha",
            sellerPhone: "9440987654",
            notes: "Rear tyre replaced, full engine service done",
          },
          {
            bikeCode: "MF-2026-0003",
            brand: "Hero",
            model: "Splendor Plus i3S",
            year: 2023,
            regNo: "AP29CD8812",
            engineNo: "HA10EJ882912",
            chassisNo: "MBLHA10EJN829102",
            purchasePrice: 52000,
            repairCost: 1800,
            totalInvestment: 53800,
            expectedSellingPrice: 65000,
            actualSellingPrice: 65000,
            status: "SOLD",
            primaryPhoto: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=600&q=80",
            sellerName: "B. Ramulu",
            sellerPhone: "9123891234",
            notes: "Very high mileage, excellent paint condition",
          },
          {
            bikeCode: "MF-2026-0004",
            brand: "Royal Enfield",
            model: "Classic 350 Stealth Black",
            year: 2021,
            regNo: "AP28DF3390",
            engineNo: "UCE350N829102",
            chassisNo: "ME3UCE350MN829102",
            purchasePrice: 115000,
            repairCost: 7500,
            totalInvestment: 122500,
            expectedSellingPrice: 148000,
            status: "AVAILABLE",
            primaryPhoto: "https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=600&q=80",
            sellerName: "M. Rajesh Kumar",
            sellerPhone: "9701234567",
            notes: "Original exhaust, alloys, single owner",
          },
        ],
      });
    }

    return NextResponse.json({
      success: true,
      message: "Database initialized and seeded successfully!",
      admin: "admin@manikantafinance.com",
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
