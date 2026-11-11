import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPrismaClient } from "@/lib/prisma";

export const ADMIN_SESSION_COOKIE = "rrbiztech_admin";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function startAdminSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await getPrismaClient().userSession.create({
    data: { tokenHash: hashSessionToken(token), userId, expiresAt },
  });
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: expiresAt,
  });
}

export async function requireStaff() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) redirect("/admin/login");

  const session = await getPrismaClient().userSession.findUnique({
    where: { tokenHash: hashSessionToken(token) },
    include: { user: true },
  });
  if (
    !session ||
    session.expiresAt <= new Date() ||
    session.user.status !== "ACTIVE" ||
    (session.user.role !== "ADMIN" && session.user.role !== "MANAGER" && session.user.role !== "EDITOR")
  ) {
    redirect("/admin/login");
  }
  return session.user;
}

export async function requireAdministrator() {
  const user = await requireStaff();
  if (user.role !== "ADMIN") redirect("/manager");
  return user;
}

export async function requireManager() {
  const user = await requireStaff();
  if (user.role !== "ADMIN" && user.role !== "MANAGER" && user.role !== "EDITOR") redirect("/admin/login");
  return user;
}

export async function endAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (token) {
    await getPrismaClient().userSession.deleteMany({
      where: { tokenHash: hashSessionToken(token) },
    });
  }
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
