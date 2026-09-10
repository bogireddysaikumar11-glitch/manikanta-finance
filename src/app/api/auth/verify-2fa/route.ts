export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionCookie } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const { userId, code } = await req.json();

    if (!userId || !code) {
      return NextResponse.json(
        { error: "User ID and 2FA Code are required" },
        { status: 400 }
      );
    }

    let user: any = null;
    try {
      user = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });
    } catch (dbErr) {
      console.warn("Database lookup in 2FA note:", dbErr);
    }

    // Master admin fallback if user not in DB
    if (!user && Number(userId) === 1) {
      user = {
        id: 1,
        email: "admin@manikantafinance.com",
        name: "Manikanta Reddy",
        role: "SUPER_ADMIN",
        twoFactorSecret: "202600",
      };
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check 2FA code (default PIN is 202600 or user.twoFactorSecret)
    const validCode = user.twoFactorSecret || "202600";
    if (code.trim() !== validCode) {
      try {
        await recordAuditLog({
          entityType: "AUTH",
          entityId: String(user.id),
          action: "FAILED_2FA",
          description: `Failed 2FA code attempt for ${user.email}`,
          userId: user.id,
        });
      } catch (logErr) {
        console.warn("Audit log warning:", logErr);
      }
      return NextResponse.json(
        { error: "Invalid 2FA Verification Code" },
        { status: 401 }
      );
    }

    // Update last login if database available
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });
    } catch (updateErr) {
      console.warn("Could not update lastLogin:", updateErr);
    }

    createSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      is2FAVerified: true,
    });

    try {
      await recordAuditLog({
        entityType: "AUTH",
        entityId: String(user.id),
        action: "LOGIN_SUCCESS",
        description: `User ${user.email} successfully logged in with 2FA`,
        userId: user.id,
      });
    } catch (logErr) {
      console.warn("Audit log warning:", logErr);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("2FA error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
