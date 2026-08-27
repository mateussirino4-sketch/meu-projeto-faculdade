"use client";

import type { Route } from "next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  Facebook,
  Linkedin,
  MessageCircle,
  Share2,
} from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { cn } from "@/components/ui";

const slides = [
  {
    src: "/media/desenrola-celular.webp",
    alt: "Celular exibindo uma tela ilustrativa sobre renegociação",
  },
  {
    src: "/media/desenrola-mao.webp",
    alt: "Mão segurando celular em uma demonstração de jornada digital",
  },
  {
    src: "/media/desenrola-mulher.webp",
    alt: "Mulher usando celular em uma composição colorida",
  },
] as const;

function ShareBar() {
  const [copied, setCopied] = useState(false);
  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }
  const networks = [Facebook, Linkedin, MessageCircle, Share2];
  return (
    <div className="article-share-row">
      <span className="mr-2">Compartilhe:</span>
      {networks.map((Icon, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Compartilhar opção ${index + 1}`}
        >
          <Icon />
        </button>
      ))}
      <button type="button" onClick={copyLink} aria-label="Copiar link">
        <Copy />
      </button>
      <span aria-live="polite" className="text-xs">
        {copied ? "Link copiado" : ""}
      </span>
    </div>
  );
}

function PromoBanner() {
  return (
    <section
      className="promo-banner"
      aria-label="Banner acadêmico sobre renegociação de dívidas"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- arte horizontal estática fornecida para o banner */}
      <img
        src="/media/banner-principal-v2.png"
        alt="Banner sobre o Novo Desenrola Brasil e renegociação de dívidas"
      />
    </section>
  );
}

function StoryCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(
      () => setActive((value) => (value + 1) % slides.length),
      4000,
    );
    return () => window.clearInterval(timer);
  }, [paused]);
  const move = (direction: number) =>
    setActive((value) => (value + direction + slides.length) % slides.length);
  return (
    <section
      aria-label="Destaques da demonstração"
      className="story-carousel relative my-7 overflow-hidden bg-[#eaf3ff]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Image
        key={slides[active].src}
        src={slides[active].src}
        alt={slides[active].alt}
        unoptimized
        fill
        priority={active === 0}
        className="animate-[fade-in_420ms_ease-out] object-cover"
      />
      <button
        type="button"
        onClick={() => move(-1)}
        aria-label="Imagem anterior"
        className="carousel-arrow left-3"
      >
        <ArrowLeft className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => move(1)}
        aria-label="Próxima imagem"
        className="carousel-arrow right-3"
      >
        <ArrowRight className="size-4" />
      </button>
      <div className="absolute right-4 bottom-3 flex gap-1.5">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Exibir destaque ${index + 1}`}
            onClick={() => setActive(index)}
            className={cn(
              "h-2 rounded-full bg-white/70",
              index === active ? "w-6 bg-white" : "w-2",
            )}
          />
        ))}
      </div>
    </section>
  );
}

type PrimaryCtaProps = {
  id?: string;
  scrollToId?: string;
};

function PrimaryCta({ id, scrollToId }: PrimaryCtaProps) {
  const router = useRouter();

  function begin() {
    if (scrollToId) {
      document.getElementById(scrollToId)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    router.push("/login" as Route);
  }

  return (
    <div id={id} className="my-9 scroll-mt-24 text-center">
      <button
        type="button"
        onClick={begin}
        className="min-h-[52px] w-full max-w-[350px] rounded-full bg-[#1455a3] px-6 font-sans text-base font-bold text-white transition hover:bg-[#0c326f]"
      >
        Verificar Minha Elegibilidade Agora
      </button>
      <p className="!mt-2 !text-sm !leading-5 !text-[#9a9a9a]">
        Vagas limitadas — encerra em breve
      </p>
    </div>
  );
}

export function HomePage() {
  return (
    <main className="bg-white">
      <div className="breadcrumb-band w-full border-b border-[#d7d7d7] px-4 py-[13px] sm:px-6">
        <Breadcrumbs
          items={[
            "Início",
            "Assuntos",
            "Notícias",
            "2026",
            "Novo Desenrola Brasil: Governo permite limpar o nome com descontos de até 96%",
          ]}
        />
      </div>
      <div className="article-main-container">
        <article className="reference-article min-w-0">
          <p className="article-category">FINANÇAS</p>
          <h1 className="home-title mt-5 w-full">
            Novo Desenrola Brasil: Governo permite limpar o nome com
            <span className="hidden sm:inline">
              <br />
            </span>{" "}
            descontos de até 96% e parcelamento em até 60 meses
          </h1>
          <div className="article-meta">
            <ShareBar />
            <div className="article-dates">
              <p>Publicado em 14/08/2026 às 10h00</p>
              <p>Atualizado em 14/08/2026 às 11h00</p>
            </div>
          </div>
          <PromoBanner />
          <section
            className="debt-promo-card"
            aria-label="Card acadêmico sobre renegociação de dívidas"
          >
            <video
              autoPlay
              muted
              playsInline
              controls
              width="100%"
              src="/media/apresentacao-v2.mp4"
            >
              Seu navegador não suporta a reprodução deste vídeo.
            </video>
          </section>
          <div className="article-copy">
            <p className="intro-paragraph">
              <span className="drop-cap">M</span>ais de{" "}
              <strong>72 milhões de brasileiros</strong> têm o nome negativado,
              e o Governo Federal está abrindo uma nova janela para a
              renegociação de dívidas com condições jamais vistas. O Novo
              Desenrola Brasil, programa do Ministério da Fazenda, permite que
              cidadãos com dívidas em bancos, financeiras, cartões de crédito e
              outros credores possam renegociar com{" "}
              <strong>descontos de até 96% </strong>e parcelamento em até 60
              meses. Segundo o Ministério, as vagas para a rodada atual são
              limitadas e estão se esgotando rapidamente.
              <span className="mobile-copy-extension">
                {" "}
                O percurso também explica como revisar alternativas com calma e
                reconhecer cada estado da simulação antes de continuar.
              </span>
            </p>
            <StoryCarousel />
            <p>
              O processo para limpar o nome e renegociar dívidas ficou mais
              simples com o Novo Desenrola Brasil, portal oficial do Ministério
              da Fazenda. Pelo celular ou computador, o cidadão pode verificar
              suas dívidas, negociar condições especiais e acompanhar todo o
              processo online. Confira, ponto a ponto, como funciona.
            </p>
            <PrimaryCta scrollToId="eligibility-flow-cta" />
            <h2>1. O que mudou com o Novo Desenrola Brasil?</h2>
            <ul>
              <li>
                <strong>Descontos de até 96%:</strong> Negociação direta com os
                credores com condições especiais garantidas pelo Governo Federal
              </li>
              <li>
                <strong>Parcelamento em até 60 meses:</strong> Parcelas que
                cabem no seu bolso, com juros zero para dívidas de até R$ 5.000
              </li>
              <li>
                <strong>Limpeza do nome imediata:</strong> Retirada automática
                do SPC, Serasa e SCPC em até 5 dias úteis
              </li>
              <li>
                <strong>Processo 100% online:</strong> Sem burocracia, sem
                precisar ir ao banco ou ao cartório.
              </li>
              <li>
                <strong>Ampliação do programa:</strong> Agora inclui dívidas
                bancárias, cartões, financiamentos e contas de serviços.
              </li>
            </ul>
            <aside className="info-box" aria-label="Cenários disponíveis">
              <strong>Vagas Limitadas para esta Rodada</strong>
              <p>
                Devido à alta demanda, restam poucas vagas para renegociar
                dívidas com as condições especiais do Novo Desenrola Brasil.
                Estas são as últimas vagas disponíveis para{" "}
                <strong>esta rodada de negociações</strong>. Caso não realize a
                inscrição com urgência, a próxima oportunidade poderá ter
                condições menos favoráveis.
              </p>
            </aside>
            <div className="community-strip relative my-7 overflow-hidden">
              <Image
                src="/media/banner-comunidade-v2.png"
                unoptimized
                fill
                priority
                alt="Banner horizontal sobre canais de informação da demonstração"
                className="object-cover"
              />
            </div>
            <h2>2. Como participar do programa?</h2>
            <p>
              O processo de inscrição é simples e pode ser feito totalmente
              online:
            </p>
            <ol>
              <li>Clique no botão abaixo para verificar sua elegibilidade</li>
              <li>Informe seu CPF para consultar suas dívidas</li>
              <li>Confirme seus dados pessoais</li>
              <li>Escolha o credor e finalize a renegociação com desconto</li>
            </ol>
            <PrimaryCta id="eligibility-flow-cta" />
            <h2>3. Base Legal</h2>
            <ul>
              <li>Lei nº 14.690/2023 (Programa Desenrola Brasil)</li>
              <li>Resolução CMN nº 5.106/2023</li>
              <li>Decreto nº 11.686/2023 (Regulamentação do Desenrola)</li>
            </ul>
          </div>
        </article>
      </div>
    </main>
  );
}
