"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, Info } from "lucide-react";
import { Container } from "@/components/ui";

export default function Page() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#f6f7f9]">
      <Container className="py-8 sm:py-12">
        <section className="mx-auto w-full max-w-[620px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
          
          {/* Cabeçalho */}
          <div className="px-6 pb-2 pt-8 text-center sm:px-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Resumo da proposta
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Confira os dados antes de continuar
            </p>
          </div>

          <div className="p-6 sm:p-8">
            
            {/* Status da proposta */}
            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="size-5 text-green-700" />
                </div>

                <div>
                  <p className="font-semibold text-green-900">
                    Proposta disponível
                  </p>

                  <p className="mt-0.5 text-sm text-green-700">
                    Confira abaixo os detalhes da negociação.
                  </p>
                </div>
              </div>
            </div>

            {/* Valores */}
            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <span className="text-sm text-slate-600">
                  Valor da negociação
                </span>

                <strong className="text-base font-semibold text-slate-900">
                  R$ 178,57
                </strong>
              </div>

              <div className="border-t border-slate-200" />

              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <span className="text-sm text-slate-600">
                  Taxas
                </span>

                <strong className="text-base font-semibold text-slate-900">
                  R$ 0,00
                </strong>
              </div>

              <div className="border-t border-slate-200" />

              <div className="flex items-center justify-between gap-4 bg-slate-50 px-5 py-5">
                <strong className="text-base text-slate-900">
                  Total
                </strong>

                <strong className="text-xl font-bold text-[#1351b4]">
                  R$ 178,57
                </strong>
              </div>
            </div>

            {/* Observação */}
            <div className="mt-5 flex items-start gap-3 rounded-lg bg-slate-50 px-4 py-3">
              <Info className="mt-0.5 size-4 shrink-0 text-slate-500" />

              <p className="text-xs leading-5 text-slate-600">
                Confira os valores e as condições da proposta antes de continuar.
              </p>
            </div>

            {/* Continuar */}
            <button
              onClick={() => router.push("/pix-payment")}
              className="mt-7 w-full rounded-full bg-[#1351b4] px-6 py-3.5 text-base font-semibold text-white transition hover:bg-[#0c438f]"
            >
              Continuar
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