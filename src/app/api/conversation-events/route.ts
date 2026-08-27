import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { conversationEventSchema } from "@/lib/validation";

export async function POST(request: Request) { try { const input = conversationEventSchema.parse(await request.json()); const data = await prisma.conversationEvent.create({ data: input }); return NextResponse.json({ data }, { status: 201 }); } catch (error) { return apiError(error); } }
