"use client";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Container } from "./ui";
export function SuccessPlaceholder({
  route,
}: {
  route: "/success" | "/sucess";
}) {
  void route;
  const router = useRouter();
  return (
    <main className="bg-[#f8f8f8]">
      <Container className="py-10">
        <section className="mx-auto w-full max-w-[620px] rounded-md bg-white p-6 shadow-[0_2px_4px_#0003] sm:p-8">
          <CheckCircle2 className="mx-auto size-12 text-green-600" />
          <h1 className="mt-3 text-center text-[18px] font-bold leading-6 text-[#222]">
            Etapa Confirmada!
          </h1>
          <div className="mt-6 rounded-md border border-amber-300 bg-amber-50 p-4">
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle className="size-5" />
              Regularização de Cadastro
            </div>
            <p className="mt-2 text-sm">
              A referência apresenta uma segunda cobrança nesta etapa. Neste
              projeto, ela é apenas um estado visual, sem pagamento.
            </p>
          </div>
          <div className="mt-6 rounded-md border p-5 text-center">
            <p className="text-sm text-[#555]">Valor ilustrativo</p>
            <p className="mt-1 text-3xl font-bold text-[#0c326f]">R$ 48,90</p>
            <p className="mt-2 text-xs font-bold text-red-700">
              NÃO PAGÁVEL — SIMULAÇÃO LOCAL
            </p>
          </div>
          <button
            onClick={() => router.push("/cadastro-concluido")}
            className="mt-6 w-full rounded-full bg-[#1351b4] py-3 font-bold text-white"
          >
            Concluir simulação
          </button>
          <button
            onClick={() => router.push("/pix-payment")}
            className="mt-3 w-full py-2 font-semibold text-[#1351b4]"
          >
            Voltar
          </button>
        </section>
      </Container>
    </main>
  );
}
