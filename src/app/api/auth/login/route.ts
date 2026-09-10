export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { verifyUserCredentials, createSessionCookie } from "@/lib/auth";
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
      try {
        await recordAuditLog({
          entityType: "AUTH",
          entityId: identifier,
          action: "FAILED_LOGIN",
          description: `Failed login attempt for identifier: ${identifier}`,
        });
      } catch (logErr) {
        console.warn("Audit log warning on failed login:", logErr);
      }
      return NextResponse.json(
        { error: "Invalid username/phone or password" },
        { status: 401 }
      );
    }

    // Create authenticated session cookie immediately
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
        description: `User ${user.email} successfully logged in`,
        userId: user.id,
      });
    } catch (logErr) {
      console.warn("Audit log warning on success login:", logErr);
    }

    return NextResponse.json({
      success: true,
      requires2FA: false,
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
