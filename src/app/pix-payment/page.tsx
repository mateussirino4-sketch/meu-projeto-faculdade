"use client";

import { useEffect, useState } from "react";
import { Copy, LoaderCircle } from "lucide-react";
import { Container } from "@/components/ui";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [pix, setPix] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [erro, setErro] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function gerarPix() {
      try {
        const response = await fetch("/api/pagamento", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            valor: 178.57,

            // TEMPORÁRIO:
            // substitua pelos dados reais antes de usar em produção
            cliente: {
              nome: "Cliente Teste",
              email: "cliente@exemplo.com",
              telefone: "11999999999",
              cpf: "00000000000",
            },
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Não foi possível gerar o PIX");
        }

        console.log("Resposta Blackcat:", data);

        const payment = data?.paymentData ?? data;

        const copiaCola =
          payment?.copyPaste ||
          payment?.pixCopyPaste ||
          payment?.qrCode ||
          "";

        const imagem =
          payment?.qrCodeBase64 ||
          payment?.qrCodeImage ||
          "";

        if (!copiaCola) {
          throw new Error("A Blackcat não retornou o código PIX.");
        }

        setPix(copiaCola);
        setQrCode(imagem);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao gerar o PIX."
        );
      } finally {
        setLoading(false);
      }
    }

    void gerarPix();
  }, []);

  if (loading) {
    return (
      <main className="grid min-h-[60vh] place-items-center">
        <div className="text-center">
          <LoaderCircle className="mx-auto size-9 animate-spin text-[#1351b4]" />
          <p className="mt-3 font-semibold">Gerando PIX...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#f8f8f8]">
      <Container className="py-10">
        <section className="mx-auto w-full max-w-[620px] rounded-md bg-white p-6 shadow sm:p-8">
          <h1 className="text-center text-lg font-bold">
            Pagamento via PIX
          </h1>

          {erro ? (
            <div className="mt-6 rounded-md border border-red-300 bg-red-50 p-4 text-red-800">
              {erro}
            </div>
          ) : (
            <>
              {qrCode && (
                <img
                  src={
                    qrCode.startsWith("data:")
                      ? qrCode
                      : `data:image/png;base64,${qrCode}`
                  }
                  alt="QR Code PIX"
                  className="mx-auto mt-6 size-56"
                />
              )}

              <p className="mt-6 text-sm font-semibold">
                PIX copia e cola
              </p>

              <div className="mt-2 flex">
                <input
                  readOnly
                  value={pix}
                  className="h-11 min-w-0 flex-1 rounded-l border px-3 text-xs"
                />

                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(pix);
                    setCopied(true);
                  }}
                  className="rounded-r bg-[#1351b4] px-4 text-white"
                >
                  <Copy className="size-4" />
                </button>
              </div>

              {copied && (
                <p className="mt-2 text-sm text-green-700">
                  Código PIX copiado
                </p>
              )}
            </>
          )}
        </section>
      </Container>
    </main>
  );
}