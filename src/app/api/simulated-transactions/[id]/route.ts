import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { transactionUpdateSchema } from "@/lib/validation";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) { try { const { id } = await params; const data = await prisma.simulatedTransaction.findUnique({ where: { id } }); return data ? NextResponse.json({ data }) : NextResponse.json({ error: "Transação fictícia não encontrada" }, { status: 404 }); } catch (error) { return apiError(error); } }
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) { try { const { id } = await params; const input = transactionUpdateSchema.parse(await request.json()); const data = await prisma.simulatedTransaction.update({ where: { id }, data: { status: input.status, approvedAt: input.status === "APPROVED" ? new Date() : null } }); return NextResponse.json({ data }); } catch (error) { return apiError(error); } }
