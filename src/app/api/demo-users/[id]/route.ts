import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) { try { const { id } = await params; const normalized = id.replace(/\D/g, "").slice(0, 11); const user = await prisma.demoUser.findFirst({ where: { OR: [{ id }, { demoIdentifier: normalized }] }, select: { id: true, demoIdentifier: true, displayName: true, birthDate: true, motherName: true, isManualEntry: true } }); return user ? NextResponse.json({ data: user }) : NextResponse.json({ error: "Identificador não encontrado" }, { status: 404 }); } catch (error) { return apiError(error); } }
