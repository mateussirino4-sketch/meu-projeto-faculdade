import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const COOKIE_NAME = "demo_session";
const hash = (value: string) => createHash("sha256").update(value).digest("hex");

export async function createDemoSession(userId: string) { const token = randomBytes(32).toString("base64url"); const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 2); await prisma.demoSession.create({ data: { userId, tokenHash: hash(token), expiresAt } }); const store = await cookies(); store.set(COOKIE_NAME, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", expires: expiresAt, path: "/" }); return expiresAt; }
export async function getDemoUser() { const token = (await cookies()).get(COOKIE_NAME)?.value; if (!token) return null; const session = await prisma.demoSession.findUnique({ where: { tokenHash: hash(token) }, include: { user: true } }); return session && session.expiresAt > new Date() ? session.user : null; }
