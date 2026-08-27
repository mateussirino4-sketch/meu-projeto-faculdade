import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { eligibilitySchema } from "@/lib/validation";

export async function POST(request: Request) { try { const input = eligibilitySchema.parse(await request.json()); const data = await prisma.eligibilityCheck.create({ data: { userId: input.userId, status: input.scenario, reason: `Cenário local ${input.scenario}` } }); return NextResponse.json({ data }, { status: 201 }); } catch (error) { return apiError(error); } }
