export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { verifyUserCredentials } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Identifier and password are required" },
        { status: 400 }
      );
    }

    const user = await verifyUserCredentials(identifier.trim(), password);

    if (!user) {
      await recordAuditLog({
        entityType: "AUTH",
        entityId: identifier,
        action: "FAILED_LOGIN",
        description: `Failed login attempt for identifier: ${identifier}`,
      });
      return NextResponse.json(
        { error: "Invalid username/phone or password" },
        { status: 401 }
      );
    }

    // Requires 2FA
    return NextResponse.json({
      success: true,
      requires2FA: user.twoFactorEnabled,
      userId: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
