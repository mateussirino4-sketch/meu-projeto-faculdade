"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
  RotateCcw,
} from "lucide-react";
import { Container } from "@/components/ui";
import { saveDemoFlow, type DemoFlowState } from "@/lib/demo-flow";
import { useDemoFlow } from "@/lib/use-demo-flow";

type Creditor = {
  id: string;
  name: string;
  code: string;
  offers: Array<{ id: string; title: string; availableSlots: number }>;
};
const checks = [
  "Verificando dívidas em aberto no seu CPF",
  "Consultando elegibilidade no sistema Desenrola Brasil",
  "Verificando acordos disponíveis no programa",
  "Analisando documentação junto ao Ministério da fazenda",
];
const checkDurations = [6000, 5000, 4000, 3000];

export default function AvailabilityPage() {
  const router = useRouter();
  const flow = useDemoFlow();
  const [currentCheck, setCurrentCheck] = useState(0);
  const [state, setState] = useState<
    "analyzing" | "eligible" | "ineligible" | "error"
  >("analyzing");
  const [creditors, setCreditors] = useState<Creditor[]>([]);
  const [message, setMessage] = useState("");
  const analyze = useCallback(async (activeFlow: DemoFlowState) => {
    setState("analyzing");
    setCurrentCheck(0);
    setMessage("");
    for (let index = 0; index < checks.length; index++) {
      setCurrentCheck(index);
      await new Promise((resolve) =>
        window.setTimeout(resolve, checkDurations[index]),
      );
    }
    const scenario =
      activeFlow.profile.demoIdentifier === "90000000009"
        ? "ERROR"
        : activeFlow.profile.demoIdentifier === "20000000002"
          ? "INELIGIBLE"
          : "ELIGIBLE";
    try {
      const [eligibilityResponse, creditorResponse] = await Promise.all([
        activeFlow.profile.id.startsWith("local-")
          ? Promise.resolve(new Response(null, { status: 204 }))
          : fetch("/api/eligibility-checks", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: activeFlow.profile.id, scenario }),
            }),
        fetch("/api/creditors", { cache: "no-store" }),
      ]);
      if (!eligibilityResponse.ok)
        throw new Error("A análise local não pôde ser concluída.");
      if (scenario === "ERROR")
        throw new Error("Este perfil foi criado para testar o estado de erro.");
      if (scenario === "INELIGIBLE") {
        setState("ineligible");
        return;
      }
      if (!creditorResponse.ok)
        throw new Error("O catálogo fictício está indisponível.");
      const body = (await creditorResponse.json()) as { data: Creditor[] };
      setCreditors(body.data);
      setState("eligible");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Erro inesperado na análise local.",
      );
      setState("error");
    }
  }, []);
  useEffect(() => {
    if (!flow) return;
    const timer = window.setTimeout(() => void analyze(flow), 0);
    return () => window.clearTimeout(timer);
  }, [analyze, flow]);
  function selectCreditor(id: string) {
    if (!flow) return;
    saveDemoFlow({ ...flow, selectedCreditorId: id });
    router.push("/chat");
  }
  if (!flow)
    return (
      <main className="grid min-h-[55vh] place-items-center p-4 text-center">
        <div>
          <h1 className="text-xl font-bold">Sessão não encontrada</h1>
          <button
            onClick={() => router.push("/")}
            className="mt-5 rounded-full bg-[#1455a3] px-6 py-3 font-bold text-white"
          >
            Voltar ao início
          </button>
        </div>
      </main>
    );
  return (
    <main className="bg-[#f8f8f8]">
      <Container className="py-8 sm:py-12">
        <section className="mx-auto w-full max-w-[800px] rounded-md bg-white p-5 shadow-[0_2px_4px_#0003] sm:p-8">
          <h1 className="text-center text-[18px] font-bold leading-6 text-[#222]">
            Verificando disponibilidade
          </h1>
          <p className="mt-2 text-center text-sm text-[#555]">
            Aguarde enquanto analisamos as condições disponíveis.
          </p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="mb-1 block text-sm font-semibold">
                Nome Completo
              </span>
              <input
                disabled
                value={flow.answers.fullName}
                className="h-11 w-full rounded border border-[#aaa] bg-[#eee] px-4"
              />
            </label>
            <label>
              <span className="mb-1 block text-sm font-semibold">CPF</span>
              <input
                disabled
                value={flow.profile.demoIdentifier}
                className="h-11 w-full rounded border border-[#aaa] bg-[#eee] px-4"
              />
            </label>
            <label>
              <span className="mb-1 block text-sm font-semibold">
                Nascimento
              </span>
              <input
                disabled
                value={flow.answers.birthDate.split("-").reverse().join("/")}
                className="h-11 w-full rounded border border-[#aaa] bg-[#eee] px-4"
              />
            </label>
          </div>
          {state === "analyzing" && (
            <div className="mt-7 grid gap-4" role="status">
              {checks.map((check, index) => (
                <div
                  key={check}
                  className={index > currentCheck ? "opacity-40" : ""}
                >
                  <div className="flex items-center gap-3">
                    {index < currentCheck ? (
                      <CheckCircle2 className="size-5 text-green-600" />
                    ) : index === currentCheck ? (
                      <LoaderCircle className="size-5 animate-spin text-green-600" />
                    ) : (
                      <span className="size-5 rounded-full border border-slate-400" />
                    )}
                    <span>{check}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {state === "error" && (
            <div className="mt-7 rounded-md border border-red-200 bg-red-50 p-5">
              <div className="flex items-center gap-2 font-bold text-red-800">
                <AlertCircle className="size-5" />
                Não foi possível concluir a análise
              </div>
              <p className="mt-2 text-sm text-red-900">{message}</p>
              <button
                onClick={() => void analyze(flow)}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#1351b4] px-5 py-2.5 font-bold text-white"
              >
                <RotateCcw className="size-4" />
                Tentar novamente
              </button>
            </div>
          )}
          {state === "ineligible" && (
            <div className="mt-7 rounded-md border border-amber-200 bg-amber-50 p-5">
              <h2 className="font-bold text-amber-950">
                Nenhuma proposta disponível
              </h2>
              <p className="mt-2 text-sm text-amber-900">
                Não encontramos condições disponíveis para este perfil no
                momento.
              </p>
              <button
                onClick={() => router.push("/")}
                className="mt-4 rounded-full bg-[#1351b4] px-5 py-2.5 font-bold text-white"
              >
                Voltar ao início
              </button>
            </div>
          )}
          {state === "eligible" && (
            <div className="mt-7">
              <div className="rounded-md border border-green-200 bg-green-50 px-6 py-5 text-center text-green-800">
                <h2 className="text-lg font-semibold">
                  Parabéns! Cadastro Aprovado com Sucesso
                </h2>

                <p className="mt-4 text-sm leading-6">
                  Prezado(a) <strong>{flow.answers.fullName}</strong>, CPF{" "}
                  <strong>
                    {flow.profile.demoIdentifier.replace(
                      /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
                      "$1.$2.$3-$4",
                    )}
                  </strong>
                  , informamos que sua solicitação foi analisada e{" "}
                  <strong>APROVADA</strong> pelo Sistema do Novo Desenrola
                  Brasil.
                  <br />
                  O(A) senhor(a) está apto(a) a renegociar suas dívidas com{" "}
                  <strong>descontos de até 96%</strong>, conforme as diretrizes
                  do Programa Novo Desenrola Brasil — Ministério da Fazenda.
                  <br />
                  Para dar continuidade ao processo, selecione abaixo o banco ou
                  instituição credora que deseja renegociar.
                </p>
              </div>
              <div className="mt-5 grid gap-3">
                {creditors.map((creditor) => (
                  <article
                    key={creditor.id}
                    className="flex flex-col gap-3 rounded-md border border-[#ddd] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-[#0c326f]">
                        {creditor.name}
                      </h3>
                      <p className="mt-1 text-sm text-[#555]">
                        {creditor.offers[0]?.availableSlots ?? 50} acordos
                        disponíveis
                      </p>
                    </div>
                    <button
                      onClick={() => selectCreditor(creditor.id)}
                      className="rounded-full bg-[#1351b4] px-6 py-2.5 font-bold text-white"
                    >
                      Renegociar
                    </button>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      </Container>
    </main>
  );
}
