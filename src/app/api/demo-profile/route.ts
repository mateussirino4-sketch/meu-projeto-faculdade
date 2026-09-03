import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";

type RequestBody = {
  cpf?: unknown;
  identifier?: unknown;
};

type ExternalApiError = {
  message?: string;
  error?: string;
  statusCode?: number;
};

type ExternalApiPayload = {
  statusCode?: number;
  body?: Record<string, unknown>;
};

function normalizeIdentifier(value: unknown): string {
  return String(value ?? "")
    .replace(/\D/g, "")
    .slice(0, 11);
}

function getAxiosErrorMessage(error: AxiosError<ExternalApiError>): string {
  const data = error.response?.data;

  if (data && typeof data === "object") {
    if (typeof data.message === "string") {
      return data.message;
    }

    if (typeof data.error === "string") {
      return data.error;
    }
  }

  if (typeof data === "string") {
    return data;
  }

  return error.message || "Erro ao consultar o serviço externo.";
}

function getSnoopApiToken(): string | null {
  const singleToken = process.env.SNOOP_API_TOKEN?.trim();
  if (singleToken) return singleToken;

  const tokenList = process.env.SNOOP_API_TOKENS
    ?.split(",")
    .map((token) => token.trim())
    .filter(Boolean);

  return tokenList?.[0] ?? null;
}

function getSnoopApiBaseUrl(): string {
  const baseUrl = process.env.SNOOP_API_BASE_URL?.trim();
  return baseUrl || "https://snoopintelligence.cloud/api/v2";
}

export async function POST(request: Request) {
  try {
    // -------------------------------------------------------
    // 1. Ler JSON recebido pelo frontend
    // -------------------------------------------------------
    let body: RequestBody;

    try {
      body = (await request.json()) as RequestBody;
    } catch {
      return NextResponse.json(
        { error: "Corpo da requisição inválido." },
        { status: 400 }
      );
    }

    const rawIdentifier = body.cpf ?? body.identifier ?? "";
    const identifier = normalizeIdentifier(rawIdentifier);

    console.log("[demo-profile] Requisição recebida:", {
      identifierLength: identifier.length,
    });

    // -------------------------------------------------------
    // 2. Validação
    // -------------------------------------------------------
    if (identifier.length !== 11) {
      return NextResponse.json(
        { error: "Informe um identificador com 11 dígitos." },
        { status: 400 }
      );
    }

    // -------------------------------------------------------
    // 3. CHAMADA REAL HTTP COM AXIOS (CORRIGIDO)
    // -------------------------------------------------------
    const token = getSnoopApiToken();

    if (!token) {
      return NextResponse.json(
        {
          error:
            "Token da API não configurado. Defina SNOOP_API_TOKEN no ambiente.",
        },
        { status: 500 }
      );
    }

    const response = await axios.get<ExternalApiPayload>(
      `${getSnoopApiBaseUrl()}/generic/cpf`,
      {
        params: { cpf: identifier },
      headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        timeout: 15000,
      }
    );

    const payload = response.data?.body ?? response.data;

    return NextResponse.json({ data: payload }, { status: 200 });

  } catch (err: unknown) {
    // -------------------------------------------------------
    // 4. Erros provenientes do Axios
    // -------------------------------------------------------
    if (axios.isAxiosError<ExternalApiError>(err)) {
      const status = err.response?.status ?? 502;
      const message = getAxiosErrorMessage(err);

      console.error("[demo-profile] Erro do serviço externo:", {
        status,
        message,
      });

      return NextResponse.json(
        { error: message },
        { status }
      );
    }

    // -------------------------------------------------------
    // 5. Outros erros internos
    // -------------------------------------------------------
    if (err instanceof Error) {
      console.error("[demo-profile] Erro interno:", err.message);

      return NextResponse.json(
        { error: "Erro interno do servidor." },
        { status: 500 }
      );
    }

    console.error("[demo-profile] Erro desconhecido.");

    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}

