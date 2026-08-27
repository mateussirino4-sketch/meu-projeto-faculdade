import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function apiError(error: unknown) {
  if (error instanceof ZodError) return NextResponse.json({ error: "Payload de demonstração inválido", issues: error.issues }, { status: 400 });
  console.error("API local error:", error);
  return NextResponse.json({ error: "Erro interno na API local de demonstração" }, { status: 500 });
}
