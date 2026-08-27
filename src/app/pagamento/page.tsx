"use client";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui";
export default function Page() {
  const router = useRouter();
  return (
    <main className="bg-[#f8f8f8]">
      <Container className="py-10">
        <section className="mx-auto w-full max-w-[620px] rounded-md bg-white p-6 shadow-[0_2px_4px_#0003] sm:p-8">
          <h1 className="text-center text-[18px] font-bold leading-6 text-[#222]">
            Finalizar Cadastro
          </h1>
          <p className="mt-1 text-center text-sm text-[#555]">
            Novo Desenrola Brasil
          </p>
          <div className="mt-6 rounded-md border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-2 font-bold text-green-900">
              <CheckCircle2 className="size-5" />
              Proposta aprovada
            </div>
            <p className="mt-2 text-sm text-green-800">
              Revise o resumo antes de continuar.
            </p>
          </div>
          <div className="mt-6 divide-y rounded-md border">
            <div className="flex justify-between p-4">
              <span>Valor da negociação</span>
              <strong>R$ 178,57</strong>
            </div>
            <div className="flex justify-between p-4">
              <span>Taxas ilustrativas</span>
              <strong>R$ 0,00</strong>
            </div>
            <div className="flex justify-between p-4 text-lg">
              <strong>Total</strong>
              <strong>R$ 178,57</strong>
            </div>
          </div>
          <div className="mt-5 rounded-md border border-amber-300 bg-amber-50 p-3 text-xs font-semibold text-amber-950">
            SIMULAÇÃO LOCAL — nenhum valor pode ser pago ou cobrado.
          </div>
          <button
            onClick={() => router.push("/pix-payment")}
            className="mt-6 w-full rounded-full bg-[#1351b4] py-3 font-bold text-white"
          >
            Finalizar Cadastro
          </button>
          <button
            onClick={() => router.push("/chat")}
            className="mt-3 w-full py-2 font-semibold text-[#1351b4]"
          >
            Voltar
          </button>
        </section>
      </Container>
    </main>
  );
}
