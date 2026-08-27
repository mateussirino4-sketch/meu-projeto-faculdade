"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronRight, LoaderCircle } from "lucide-react";
import { Container } from "@/components/ui";
import { saveDemoFlow } from "@/lib/demo-flow";
import { useDemoFlow } from "@/lib/use-demo-flow";

const lessons = [
  {
    title: "Novo Desenrola Brasil",
    text: "O Novo Desenrola Brasil é uma iniciativa do Governo Federal que pode garantir a renegociação das suas dívidas com descontos de até 96%! Se você for aprovado nos critérios do programa, poderá limpar seu nome e regularizar sua situação financeira com condições especiais. Continue seu cadastro aqui no site para verificar sua elegibilidade.",
    image: "/media/etapa-1.jpg",
    width: 1500,
    height: 250,
    wide: true,
  },
  {
    title: "Acesso ao Portal de Renegociação",
    text: "Após finalizar seu cadastro, você receberá acesso ao portal oficial do programa. Use seu CPF para acessar e acompanhar todo o processo de renegociação das suas dívidas de forma simples e prática.",
    image: "/media/etapa-2.webp",
    width: 1366,
    height: 768,
    wide: false,
  },
  {
    title: "Renegociação com Desconto",
    text: "Suas dívidas serão renegociadas diretamente com os credores através do portal oficial. Os descontos podem chegar a 96% do valor original! Para dívidas de até R$ 5.000, o desconto pode ser de até 100% dos juros e multas acumulados.",
    image: "/media/etapa-3.webp",
    width: 1600,
    height: 1133,
    wide: false,
  },
  {
    title: "Limpeza do Nome",
    text: "Após a renegociação, seu nome será automaticamente retirado dos cadastros de inadimplentes (SPC, Serasa, SCPC) em até 5 dias úteis. Você voltará a ter acesso ao crédito e poderá realizar seus sonhos financeiros.",
    image: "/media/etapa-4.webp",
    width: 888,
    height: 597,
    wide: false,
  },
  {
    title: "Taxa de Adesão ao Programa",
    text: "Para validar sua participação no programa, o Ministério da Fazenda cobra uma taxa administrativa de adesão. Esta taxa é obrigatória para verificar sua elegibilidade e garantir seu acesso ao Novo Desenrola Brasil.",
    image: "/media/etapa-5.jpeg",
    width: 768,
    height: 512,
    wide: false,
  },
] as const;

export default function LearnMorePage() {
  const router = useRouter();
  const flow = useDemoFlow();
  const [loading, setLoading] = useState(false);
  if (!flow)
    return (
      <main className="grid min-h-[55vh] place-items-center p-4 text-center">
        <div>
          <h1 className="text-xl font-bold">Inicie a demonstração pela home</h1>
          <button
            onClick={() => router.push("/")}
            className="mt-5 rounded-full bg-[#1455a3] px-6 py-3 font-bold text-white"
          >
            Voltar ao início
          </button>
        </div>
      </main>
    );
  const activeFlow = flow;
  const index = Math.min(activeFlow.contentStep, lessons.length - 1);
  const lesson = lessons[index];
  function move(nextIndex: number) {
    saveDemoFlow({
      ...activeFlow,
      contentStep: Math.max(0, Math.min(nextIndex, lessons.length - 1)),
    });
  }
  async function advance() {
    if (index < lessons.length - 1) {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 3500));
      move(index + 1);
      setLoading(false);
      return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 3500));
    router.push("/verify-availability");
  }
  return (
    <main className="bg-[#f8f8f8]">
      <Container className="py-5 sm:py-6">
        <section className="mx-auto w-full max-w-[800px] tracking-normal">
          <div className="flex items-center gap-2">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#1351b4] text-[15px] font-bold leading-none text-white">
              {index + 1}
            </span>
            <h1 className="text-[16px] font-semibold leading-6 tracking-normal text-[#0c326f]">
              {lesson.title}
            </h1>
          </div>
          <Image
            key={lesson.image}
            src={lesson.image}
            alt=""
            width={lesson.width}
            height={lesson.height}
            priority
            unoptimized
            className={`mt-4 h-auto object-contain ${lesson.wide ? "w-full" : "mx-auto w-full max-w-[400px]"}`}
          />
          <div className="mt-4 rounded-md bg-[#f1f1f1] px-5 py-3.5">
            <p className="text-[15px] leading-[1.5] tracking-normal text-[#333]">
              {lesson.text}
            </p>
          </div>
          <div className="mt-4 flex justify-center">
            <button
              onClick={advance}
              disabled={loading}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#1351b4] px-8 text-[15px] font-bold tracking-normal text-white disabled:opacity-65"
            >
              {loading ? (
                <>
                  <LoaderCircle className="size-5 animate-spin" />
                  Processando...
                </>
              ) : index === lessons.length - 1 ? (
                <>
                  <CheckCircle2 className="size-5" />
                  Finalizar
                </>
              ) : (
                <>
                  Avançar
                  <ChevronRight className="size-4" />
                </>
              )}
            </button>
          </div>
        </section>
      </Container>
    </main>
  );
}
