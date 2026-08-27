import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.creditor.findMany({
      where: {
        isActive: true,
      },
      include: {
        offers: {
          where: {
            isActive: true,
          },
        },
      },
      orderBy: {
        code: "asc",
      },
    });

    return NextResponse.json({ data });
  } catch (error) {
    return apiError(error);
  }
}
