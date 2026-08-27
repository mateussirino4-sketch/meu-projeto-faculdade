"use client";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui";
import { clearDemoFlow } from "@/lib/demo-flow";
import { useDemoFlow } from "@/lib/use-demo-flow";
export default function Page() {
  const router = useRouter();
  const flow = useDemoFlow();
  return (
    <main className="bg-[#f8f8f8]">
      <Container className="py-10">
        <section className="mx-auto w-full max-w-[680px] rounded-md bg-white p-6 text-center shadow-[0_2px_4px_#0003] sm:p-8">
          <CheckCircle2 className="mx-auto size-16 text-green-600" />
          <h1 className="mt-4 text-[18px] font-bold leading-6 text-[#222]">
            Cadastro Concluído!
          </h1>
          <p className="mt-2 text-[#555]">
            Sua jornada de demonstração foi finalizada.
          </p>
          <dl className="mt-7 grid gap-3 rounded-md bg-[#f1f1f1] p-5 text-left text-sm">
            <div>
              <dt className="font-semibold text-[#555]">Protocolo</dt>
              <dd className="font-bold">DEMO-2026-000001</dd>
            </div>
            <div>
              <dt className="font-semibold text-[#555]">Nome</dt>
              <dd className="font-bold">{flow?.answers.fullName || "-"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-[#555]">Identificador</dt>
              <dd className="font-bold">
                {flow?.profile.demoIdentifier ?? "-"}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-[#555]">Status</dt>
              <dd className="font-bold text-green-700">Concluído</dd>
            </div>
          </dl>
          <div className="mt-6 text-left">
            <h2 className="font-bold text-[#0c326f]">Próximos Passos</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-[#444]">
              <li>Guarde o protocolo fictício para a apresentação.</li>
              <li>Revise os dados exibidos nesta demonstração.</li>
              <li>Retorne ao início para executar outro cenário.</li>
            </ol>
          </div>
          <button
            onClick={() => {
              clearDemoFlow();
              router.push("/");
            }}
            className="mt-7 w-full rounded-full bg-[#1351b4] py-3 font-bold text-white"
          >
            Voltar ao Início
          </button>
        </section>
      </Container>
    </main>
  );
}
