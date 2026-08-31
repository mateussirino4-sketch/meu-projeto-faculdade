import { NextResponse } from "next/server";
import { criarPixReal } from "@/lib/payments/blackcat-demo";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { valor, cliente } = body;

    // Dispara o motor de conexão real com a API da BlackCat Oficial
    const respostaBlackcat = await criarPixReal(valor, cliente);

    // Envia os dados do QR Code real gerado de volta para a sua tela
    return NextResponse.json(respostaBlackcat);
  } catch (error: any) {
    console.error("Erro ao processar Pix:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
