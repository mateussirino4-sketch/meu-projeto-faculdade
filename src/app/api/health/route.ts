import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();

  try {
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Database health check timed out")), 8_000),
      ),
    ]);

    return NextResponse.json({
      status: "ok",
      database: "connected",
      responseTimeMs: Date.now() - startedAt,
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "degraded",
        database: "unavailable",
        responseTimeMs: Date.now() - startedAt,
      },
      { status: 503 },
    );
  }
}
