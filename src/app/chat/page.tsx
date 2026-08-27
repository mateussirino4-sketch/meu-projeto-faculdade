"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Container } from "@/components/ui";
import { useDemoFlow } from "@/lib/use-demo-flow";
type Message = { from: "system" | "user"; text: string };
const categories = [
  { label: "Dívidas Bancárias", icon: "🏢" },
  { label: "Cartão de Crédito", icon: "💳" },
  { label: "Financiamento (veículo / imóvel)", icon: "🏠" },
  { label: "Outros tipos de dívida", icon: "📄" },
];
const categoryLabels: Record<string, string> = {
  BANKING: "Dívidas Bancárias",
  CARD: "Cartão de Crédito",
  FINANCING: "Financiamento (veículo / imóvel)",
  SERVICES: "Outros tipos de dívida",
  OTHER: "Outros tipos de dívida",
};
const demoProtocol = "89032262589";

function maskIdentifier(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}

function LoadingReply() {
  return (
    <div
      role="status"
      aria-label="Carregando resposta"
      className="flex h-9 min-w-[68px] items-center justify-center gap-1.5 rounded-2xl rounded-tl-sm bg-[#2670cc] px-4 text-white shadow-sm"
    >
      <span className="size-2 animate-bounce rounded-full bg-white" />
      <span className="size-2 animate-bounce rounded-full bg-white [animation-delay:150ms]" />
      <span className="size-2 animate-bounce rounded-full bg-white [animation-delay:300ms]" />
    </div>
  );
}

function InitialLoading({ creditorName }: { creditorName: string }) {
  return (
    <div
      role="status"
      className="flex min-h-[58px] w-full max-w-[540px] items-center gap-3 rounded-md border border-[#ddd] bg-white px-4 text-[#333] shadow-sm"
    >
      <LoaderCircle className="size-5 shrink-0 animate-spin text-[#1351b4]" />
      <span className="text-sm">
        Consultando cenário ilustrativo em{" "}
        {creditorName || "instituição fictícia"}...
      </span>
    </div>
  );
}
export default function ChatPage() {
  const router = useRouter();
  const flow = useDemoFlow();
  const [stage, setStage] = useState(0);
  const [typing, setTyping] = useState(false);
  const [creditorName, setCreditorName] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "system",
      text: "Para dar continuidade ao seu cadastro no Novo Desenrola Brasil, informamos que é necessário selecionar o tipo de dívida que deseja renegociar junto à instituição selecionada.",
    },
  ]);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);
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

        if (selected) {
          setCreditorName(selected.name);
          setMessages((current) =>
            current.length === 1
              ? [
                  {
                    from: "system",
                    text: `Para dar continuidade ao seu cadastro no Novo Desenrola Brasil, informamos que é necessário selecionar o tipo de dívida que deseja renegociar junto à ${selected.name}.`,
                  },
                ]
              : current,
          );
        }
      });

    return () => {
      active = false;
    };
  }, [flow?.selectedCreditorId]);
  async function reply(user: string, system: string, next: number) {
    setMessages((m) => [...m, { from: "user", text: user }]);
    setTyping(true);
    await new Promise((r) => setTimeout(r, 3500));
    setMessages((m) => [...m, { from: "system", text: system }]);
    setTyping(false);
    setStage(next);
  }
  if (!flow?.selectedCreditorId)
    return (
      <main className="grid min-h-[55vh] place-items-center text-center">
        <div>
          <h1 className="text-xl font-bold">
            Selecione uma opção de negociação
          </h1>
          <button
            onClick={() => router.push("/verify-availability")}
            className="mt-5 rounded-full bg-[#1351b4] px-6 py-3 font-bold text-white"
          >
            Voltar
          </button>
        </div>
      </main>
    );
  return (
    <main className="bg-[#f4f4f4]">
      <div className="bg-white">
        <Container className="mx-0 flex h-[52px] max-w-[760px] items-center gap-2.5">
          <span
            aria-hidden="true"
            className="relative block size-7 shrink-0 overflow-hidden rounded-full bg-[#13a05a] before:absolute before:-left-1 before:top-1 before:size-5 before:rotate-45 before:bg-[#f4cf16] after:absolute after:bottom-0 after:right-0 after:size-4 after:rounded-full after:bg-[#1768c5]"
          />
          <h1 className="text-sm font-semibold text-[#333]">
            Atendimento Gov.br
          </h1>
        </Container>
      </div>
      {stage <= 2 ? (
        <Container className="mx-0 max-w-[760px] py-3">
          <section className="space-y-3" aria-live="polite">
            {messages.map((message, index) => (
              <div
                key={`${message.from}-${index}`}
                className={`flex max-w-[720px] ${message.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`whitespace-pre-line px-4 py-3 text-[14px] shadow-sm ${message.from === "user" ? "rounded-2xl bg-[#e7e7e7] text-[#333]" : "w-full rounded-md bg-[#2670cc] leading-5 text-white"}`}
                >
                  {message.text}
                </p>
              </div>
            ))}

            {typing && (
              <div className="flex max-w-[720px] justify-start">
                {stage === 0 ? (
                  <InitialLoading creditorName={creditorName} />
                ) : (
                  <LoadingReply />
                )}
              </div>
            )}

            {stage === 0 && !typing && (
              <div className="grid max-w-[720px] gap-2">
                {categories.map(({ label, icon }) => (
                  <button
                    key={label}
                    disabled={typing}
                    onClick={() =>
                      void reply(
                        label,
                        `Prezado(a) ${flow.answers.fullName || flow.profile.displayName}, informamos que o processo de renegociação pelo Novo Desenrola Brasil é realizado de forma totalmente remota, por meio do portal oficial do Ministério da Fazenda, conforme sua disponibilidade.\n\nApós a finalização do cadastro, o sistema liberará o acesso ao painel de renegociação com o passo a passo completo e os acordos disponíveis para o seu CPF.`,
                        1,
                      )
                    }
                    className="flex min-h-[52px] w-full items-center gap-3 rounded-xl border border-[#e2e2e2] bg-white px-4 text-left text-[14px] font-medium text-[#333] shadow-[0_2px_5px_#00000014] transition hover:border-[#b8c9e0] hover:bg-[#fafcff]"
                  >
                    <span
                      aria-hidden="true"
                      className="w-5 shrink-0 text-center text-[19px] leading-none"
                    >
                      {icon}
                    </span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            )}

            {stage === 1 && (
              <button
                onClick={() =>
                  void reply(
                    "Prosseguir",
                    `O Novo Desenrola Brasil segue as seguintes etapas: o cidadão acessa o portal de renegociação, visualiza as dívidas elegíveis e escolhe a melhor proposta de acordo oferecida pela instituição ${creditorName}. Os descontos podem chegar a 96% do valor total da dívida, incluindo juros e multas. `,
                    2,
                  )
                }
                disabled={typing}
                className="flex min-h-11 w-full max-w-[720px] items-center justify-center gap-3 rounded-full bg-[#1351b4] font-bold text-white"
              >
                Prosseguir <span aria-hidden="true">›</span>
              </button>
            )}

            {stage === 2 && (
              <button
                onClick={() =>
                  void reply(
                    "Prosseguir",
                    "Os acordos de quitação de dívida estão disponíveis para o seu CPF. Após o pagamento, a limpeza do nome ocorre em até 5 dias úteis",
                    3,
                  )
                }
                disabled={typing}
                className="flex min-h-11 w-full max-w-[720px] items-center justify-center gap-3 rounded-full bg-[#1351b4] font-bold text-white"
              >
                Prosseguir <span aria-hidden="true">›</span>
              </button>
            )}
            <div ref={end} />
          </section>
        </Container>
      ) : (
        <Container className="mx-0 max-w-4xl py-5">
          <section className="overflow-hidden rounded-md bg-white shadow-[0_2px_4px_#0003]">
            <div
              className="min-h-[430px] space-y-4 p-5 sm:p-7"
              aria-live="polite"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <p
                    className={`max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-3 leading-6 ${m.from === "user" ? "bg-[#e7e7e7] text-[#333]" : "rounded-tl-sm bg-[#2670cc] text-white"}`}
                  >
                    {m.text}
                  </p>
                </div>
              ))}
              {typing && (
                <div className="flex">
                  <LoadingReply />
                </div>
              )}
              {stage === 5 && (
                <div className="w-full max-w-[385px] rounded-md border border-[#ddd] bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-[#666]">Valor ilustrativo</p>
                      <p className="mt-1 text-xl font-bold text-[#1351b4]">
                        R$ 178,57
                      </p>
                    </div>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                      Simulação
                    </span>
                  </div>
                  <div className="my-4 border-t border-[#e5e5e5]" />
                  <dl className="space-y-1.5 text-sm text-[#555]">
                    <div className="flex justify-between gap-4">
                      <dt>Valor de referência</dt>
                      <dd>R$ 200,00</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Desconto ilustrativo</dt>
                      <dd>R$ 21,43</dd>
                    </div>
                    <div className="flex justify-between gap-4 font-semibold">
                      <dt>Total simulado</dt>
                      <dd>R$ 178,57</dd>
                    </div>
                  </dl>
                </div>
              )}
              {stage >= 6 && (
                <div className="space-y-4">
                  <article className="w-full max-w-[720px] overflow-hidden rounded-md border border-[#ccd3dd] bg-white shadow-sm">
                    <header className="flex h-12 items-center justify-between bg-[#08234d] px-3 text-white">
                      <span className="grid size-8 place-items-center bg-white text-[10px] font-bold text-[#1351b4]">
                        DEMO
                      </span>
                      <span className="text-xs">
                        Protocolo fictício: {demoProtocol}
                      </span>
                    </header>
                    <div className="p-4">
                      <div className="text-center">
                        <h2 className="text-sm font-bold text-[#15213a]">
                          COMPROVANTE DE SIMULAÇÃO ACADÊMICA
                        </h2>
                        <p className="mt-1 text-[11px] text-[#7b8494]">
                          Ambiente local — dados exclusivamente ilustrativos
                        </p>
                      </div>
                      <dl className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3 text-xs">
                        <div>
                          <dt className="text-[10px] uppercase text-[#8792a5]">
                            Nome
                          </dt>
                          <dd className="mt-1 font-bold text-[#16213a]">
                            {flow.answers.fullName || flow.profile.displayName}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[10px] uppercase text-[#8792a5]">
                            Identificador
                          </dt>
                          <dd className="mt-1 font-bold text-[#16213a]">
                            {maskIdentifier(flow.profile.demoIdentifier) ||
                              "000.000.000-00"}
                          </dd>
                        </div>
                        <div className="col-span-2 grid grid-cols-2 gap-8 rounded bg-[#eaf2ff] p-3">
                          <div>
                            <dt className="text-[10px] uppercase text-[#8792a5]">
                              Nº do protocolo
                            </dt>
                            <dd className="mt-1 font-bold text-[#1351b4]">
                              {demoProtocol}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-[10px] uppercase text-[#8792a5]">
                              Categoria
                            </dt>
                            <dd className="mt-1 font-bold text-[#16213a]">
                              {categoryLabels[flow.answers.debtType] ||
                                "Categoria fictícia"}
                            </dd>
                          </div>
                        </div>
                        <div>
                          <dt className="text-[10px] uppercase text-[#8792a5]">
                            Instituição ilustrativa
                          </dt>
                          <dd className="mt-1 font-bold text-[#16213a]">
                            {creditorName || "Instituição fictícia"} — simulação
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[10px] uppercase text-[#8792a5]">
                            Status
                          </dt>
                          <dd className="mt-1 font-bold text-amber-600">
                            SIMULAÇÃO
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[10px] uppercase text-[#8792a5]">
                            Condição
                          </dt>
                          <dd className="mt-1 font-bold text-[#16213a]">
                            Cenário demonstrativo
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[10px] uppercase text-[#8792a5]">
                            Desconto ilustrativo
                          </dt>
                          <dd className="mt-1 font-bold text-green-600">
                            Valor fictício
                          </dd>
                        </div>
                      </dl>
                      <p className="mt-4 border-t pt-3 text-[10px] text-[#8792a5]">
                        Emitido em ambiente acadêmico local
                      </p>
                    </div>
                  </article>

                  <article className="w-full max-w-[720px] rounded-md border-2 border-green-500 bg-green-50 p-4 text-green-900 shadow-sm">
                    <h2 className="flex items-center gap-2 font-bold">
                      <span className="grid size-6 place-items-center border border-green-700 bg-green-500 text-white">
                        ✓
                      </span>
                      Simulação encontrada
                    </h2>
                    <p className="mt-2 text-sm">
                      Cenário acadêmico disponível em{" "}
                      <strong>
                        {creditorName || "Instituição fictícia"} — simulação
                      </strong>
                      .
                    </p>
                    <div className="mt-4 grid grid-cols-2 rounded-md border border-green-200 bg-white p-3">
                      <div>
                        <p className="text-xs text-[#6f7784]">
                          Valor ilustrativo
                        </p>
                        <p className="mt-1 text-xl font-bold text-green-700">
                          R$ 178,57
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#6f7784]">
                          Condição ilustrativa
                        </p>
                        <p className="mt-1 font-bold text-[#1351b4]">
                          Demonstração
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-center text-xs">
                      Nenhuma cobrança ou negociação real será realizada
                    </p>
                  </article>
                </div>
              )}
              <div ref={end} />
            </div>
            <footer className="border-t p-5">
              {stage === 3 && (
                <button
                  onClick={() =>
                    void reply(
                      "Prosseguir",
                      "Acordo de quitação disponível para o seu CPF. Clique em Confirmar Acordo para prosseguir com a regularização do seu nome.",
                      4,
                    )
                  }
                  disabled={typing}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1351b4] py-3 font-bold text-white"
                >
                  {typing && <LoaderCircle className="size-5 animate-spin" />}
                  Prosseguir
                </button>
              )}
              {stage === 4 && (
                <button
                  onClick={() =>
                    void reply(
                      "Prosseguir",
                      "Acordo de quitação disponível para o seu CPF. Clique em Confirmar Acordo para prosseguir com a regularização do seu nome.",
                      5,
                    )
                  }
                  disabled={typing}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1351b4] py-3 font-bold text-white"
                >
                  {typing && <LoaderCircle className="size-5 animate-spin" />}
                  Prosseguir
                </button>
              )}
              {stage === 5 && (
                <button
                  onClick={() =>
                    void reply(
                      "Confirmar simulação",
                      `Prezado(a) ${flow.answers.fullName || flow.profile.displayName}, seu protocolo de simulação acadêmica foi gerado com sucesso junto a ${creditorName}.\n\nNúmero do Protocolo: 89032262589\n\nEste protocolo é o número de identificação desta simulação acadêmica.`,
                      6,
                    )
                  }
                  disabled={typing}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1351b4] py-3 font-bold text-white"
                >
                  {typing && <LoaderCircle className="size-5 animate-spin" />}✓
                  Confirmar Acordo de Quitação
                </button>
              )}
              {stage === 6 && (
                <button
                  onClick={() => setStage(7)}
                  disabled={typing}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1351b4] py-3 font-bold text-white"
                >
                  Prosseguir
                </button>
              )}
              {stage === 7 && (
                <button
                  onClick={() => router.push("/pagamento")}
                  className="w-full rounded-full bg-[#1351b4] py-3 font-bold text-white"
                >
                  Finalizar Cadastro
                </button>
              )}
            </footer>
          </section>
        </Container>
      )}
    </main>
  );
}
