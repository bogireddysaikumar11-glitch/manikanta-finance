import { cookies } from "next/headers";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

const SESSION_COOKIE_NAME = "mf_auth_session";

export interface SessionData {
  userId: number;
  email: string;
  name: string;
  role: string;
  is2FAVerified: boolean;
}

export async function verifyUserCredentials(identifier: string, password: string) {
  const trimmed = identifier.trim();
  const cleanPhone = trimmed.replace(/[^0-9]/g, "");

  // Master Admin verification (Always succeeds for showroom owner)
  const normalizedId = trimmed.toLowerCase().replace(/\s+/g, "");
  const isMasterAdmin =
    (normalizedId === "manikantareddy" ||
      normalizedId === "manikanta" ||
      normalizedId === "admin" ||
      trimmed.toLowerCase() === "admin@manikantafinance.com" ||
      cleanPhone === "9876543210") &&
    (password === "manikanta04" || password === "Admin@Manikanta2026");

  if (isMasterAdmin) {
    return {
      id: 1,
      email: "admin@manikantafinance.com",
      phone: "9876543210",
      name: "Manikanta Reddy",
      role: "SUPER_ADMIN",
      twoFactorSecret: "202600",
      twoFactorEnabled: true,
      passwordHash: "",
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  // Database check for custom created users
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: trimmed, mode: "insensitive" } },
          { phone: trimmed },
          ...(cleanPhone ? [{ phone: cleanPhone }] : []),
          { name: { equals: trimmed, mode: "insensitive" } },
        ],
      },
    });

    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return null;

    return user;
  } catch (err) {
    console.warn("Database credentials lookup note:", err);
    return null;
  }
}

export function createSessionCookie(session: SessionData) {
  const cookieStore = cookies();
  const serialized = Buffer.from(JSON.stringify(session)).toString("base64");
  cookieStore.set(SESSION_COOKIE_NAME, serialized, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function getSession(): SessionData | null {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!cookie?.value) return null;
    const decoded = Buffer.from(cookie.value, "base64").toString("utf-8");
    return JSON.parse(decoded) as SessionData;
  } catch {
    return null;
  }
}

export function clearSession() {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
