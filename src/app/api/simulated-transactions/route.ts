import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { transactionCreateSchema } from "@/lib/validation";

export async function POST(request: Request) { try { const input = transactionCreateSchema.parse(await request.json()); const data = await prisma.simulatedTransaction.upsert({ where: { idempotencyKey: input.idempotencyKey }, update: {}, create: { ...input, simulationCode: `DEMO-NOT-A-REAL-PIX-${randomUUID()}`, expiresAt: new Date(Date.now() + 600_000) } }); return NextResponse.json({ data }, { status: 201 }); } catch (error) { return apiError(error); } }
