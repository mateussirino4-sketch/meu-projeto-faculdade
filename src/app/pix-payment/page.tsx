"use client";

import { useEffect, useState } from "react";
import { Copy, LoaderCircle, Check, Clock3 } from "lucide-react";
import { Container } from "@/components/ui";
import QRCode from "qrcode";

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

        const payment = data?.data?.paymentData;

        const copiaCola =
          payment?.copyPaste ||
          payment?.pixCopyPaste ||
          payment?.qrCode ||
          "";

        if (!copiaCola) {
          throw new Error("Não foi possível gerar o código PIX.");
        }

        setPix(copiaCola);

        const qrImage = await QRCode.toDataURL(copiaCola, {
          width: 240,
          margin: 2,
        });

        setQrCode(qrImage);
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
      <main className="grid min-h-[60vh] place-items-center bg-[#f5f6f8]">
        <div className="text-center">
          <LoaderCircle className="mx-auto size-9 animate-spin text-[#1351b4]" />

          <p className="mt-3 font-semibold text-gray-800">
            Gerando PIX...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f6f8]">
      <Container className="py-8 sm:py-10">
        <section className="mx-auto w-full max-w-[620px] rounded-2xl border border-gray-200 bg-white px-6 py-8 shadow-sm sm:px-8">

          {/* Cabeçalho */}
          <div className="text-center">
            <div className="mx-auto mb-3 w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
              Pagamento da negociação
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Pagamento via PIX
            </h1>

            <p className="mx-auto mt-2 max-w-[430px] text-sm leading-6 text-gray-600">
              Escaneie o QR Code abaixo com o aplicativo do seu banco
            </p>
          </div>

          {erro ? (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {erro}
            </div>
          ) : (
            <>
              {/* Status */}
              <div className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">
                <Clock3 className="size-4" />
                Aguardando pagamento
              </div>

              {/* QR Code */}
              {qrCode && (
                <div className="mt-6 flex justify-center">
                  <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
                    <img
                      src={qrCode}
                      alt="QR Code PIX"
                      width={240}
                      height={240}
                      className="block"
                    />
                  </div>
                </div>
              )}

              {/* Valor */}
              <div className="mx-auto mt-6 max-w-[360px] rounded-xl bg-gray-50 px-5 py-4 text-center">
                <p className="text-sm font-medium text-gray-500">
                  Valor a pagar
                </p>

                <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
                  R$ 178,57
                </p>
              </div>

              {/* PIX copia e cola */}
              <div className="mt-7">
                <p className="text-sm font-bold text-gray-900">
                  PIX copia e cola
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Copie o código abaixo e cole na área PIX do aplicativo
                  do seu banco.
                </p>

                <div className="mt-3 flex overflow-hidden rounded-xl border border-gray-300 bg-white">
                  <input
                    readOnly
                    value={pix}
                    className="h-12 min-w-0 flex-1 bg-transparent px-4 text-sm text-gray-700 outline-none"
                  />

                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(pix);
                      setCopied(true);
                    }}
                    className="flex h-12 shrink-0 items-center justify-center gap-2 bg-[#1351b4] px-5 font-semibold text-white transition hover:bg-[#0c3d8f]"
                    aria-label="Copiar código PIX"
                  >
                    {copied ? (
                      <Check className="size-5" />
                    ) : (
                      <Copy className="size-5" />
                    )}

                    <span className="hidden sm:inline">
                      {copied ? "Copiado" : "Copiar"}
                    </span>
                  </button>
                </div>

                {copied && (
                  <p className="mt-2 flex items-center gap-1 text-sm font-medium text-green-700">
                    <Check className="size-4" />
                    Código PIX copiado
                  </p>
                )}
              </div>

              {/* Informação final */}
              <div className="mt-7 border-t border-gray-200 pt-5">
                <p className="text-center text-xs leading-5 text-gray-500">
                  Após a confirmação do pagamento, será iniciado o processo
                  de regularização. A baixa da negativação poderá ocorrer
                  em até 5 dias úteis.
                </p>
              </div>
            </>
          )}
        </section>
      </Container>
    </main>
  );
}