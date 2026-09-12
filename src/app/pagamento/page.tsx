"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import { Container } from "@/components/ui";
import { useDemoFlow } from "@/lib/use-demo-flow";

const originalAmount = 200;
const settlementAmount = 179.00;
const discountAmount = originalAmount - settlementAmount;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function Page() {
  const router = useRouter();
  const flow = useDemoFlow();
  const [creditorName, setCreditorName] = useState("");

  useEffect(() => {
    if (!flow?.selectedCreditorId) return;

    let active = true;

    void fetch("/api/creditors", { cache: "no-store" })
      .then((response) => response.json())
      .then((body: { data?: Array<{ id: string; name: string }> }) => {
        if (!active) return;

        const selected = body.data?.find(
          (creditor) => creditor.id === flow.selectedCreditorId,
        );

        if (selected) setCreditorName(selected.name);
      });

    return () => {
      active = false;
    };
  }, [flow?.selectedCreditorId]);

  return (
    <main className="min-h-screen bg-[#f6f7f9]">
      <Container className="py-8 sm:py-12">
        <section className="mx-auto w-full max-w-[620px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
          
          {/* Cabeçalho */}
          <div className="px-6 pb-2 pt-8 text-center sm:px-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Resumo do acordo
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Confira os dados antes de realizar o pagamento.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {/* Instituição */}
            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="text-sm text-green-700">Instituição credora:</p>
              <p className="mt-0.5 font-semibold text-green-900">
                {creditorName || "Instituição selecionada"}
              </p>
            </div>

            {/* Valores */}
            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <span className="text-sm text-slate-600">
                  Valor original
                </span>

                <strong className="text-base font-semibold text-slate-900">
                  {formatCurrency(originalAmount)}
                </strong>
              </div>

              <div className="border-t border-slate-200" />

              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <span className="text-sm text-slate-600">
                  Desconto aplicado
                </span>

                <strong className="text-base font-semibold text-slate-900">
                  {formatCurrency(discountAmount)}
                </strong>
              </div>

              <div className="border-t border-slate-200" />

              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <strong className="text-base text-slate-900">
                  Valor para quitação
                </strong>

                <strong className="text-base font-semibold text-slate-900">
                  {formatCurrency(settlementAmount)}
                </strong>
              </div>
            </div>

            {/* Explicação do pagamento */}
            <div className="mt-5 flex items-start gap-3 rounded-lg bg-slate-50 px-4 py-3">
              <Info className="mt-0.5 size-4 shrink-0 text-slate-500" />

              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  O que você está pagando
                </h2>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  O valor apresentado corresponde ao valor de quitação deste
                  acordo. Confira todas as informações antes de prosseguir.
                </p>
              </div>
            </div>

            {/* Total */}
            <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-5 py-5">
              <strong className="text-base text-slate-900">Total a pagar:</strong>
              <strong className="text-xl font-bold text-[#1351b4]">
                {formatCurrency(settlementAmount)}
              </strong>
            </div>

            {/* Continuar */}
            <button
              onClick={() => router.push("/pix-payment")}
              className="mt-7 w-full rounded-full bg-[#1351b4] px-6 py-3.5 text-base font-semibold text-white transition hover:bg-[#0c438f]"
            >
              Ir para pagamento via PIX
            </button>

            {/* Voltar */}
            <button
              onClick={() => router.push("/chat")}
              className="mt-3 w-full rounded-full py-3 text-sm font-semibold text-[#1351b4] transition hover:bg-blue-50"
            >
              Voltar
            </button>
          </div>
        </section>
      </Container>
    </main>
  );
}
