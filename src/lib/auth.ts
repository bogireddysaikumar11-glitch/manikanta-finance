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

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: { equals: trimmed, mode: "insensitive" } },
        { phone: trimmed },
        ...(cleanPhone ? [{ phone: cleanPhone }] : []),
        { name: { equals: trimmed, mode: "insensitive" } },
        ...(trimmed.toLowerCase() === "admin"
          ? [{ email: "admin@manikantafinance.com" }]
          : []),
      ],
    },
  });

  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return null;

  return user;
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
