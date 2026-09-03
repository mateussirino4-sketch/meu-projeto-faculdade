"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Landmark, LoaderCircle, UserRound } from "lucide-react";
import { useDemoFlow } from "@/lib/use-demo-flow";
import {
  createDemoFlow,
  formatNumericIdentifier,
  normalizeNumericIdentifier,
  saveDemoFlow,
  validateNumericIdentifier,
  type DemoProfile,
} from "@/lib/demo-flow";

type DemoProfileApiResponse = {
  data?: {
    name?: string;
    nome?: string;
    birth_date?: string;
    data_nascimento?: string;
    mother_name?: string;
    nome_mae?: string;
  };
  error?: string;
};

function toIsoBirthDate(value?: string) {
  if (!value) return "";
  const parts = value.split("/");
  if (parts.length !== 3) return "";
  const [day, month, year] = parts;
  if (!day || !month || !year) return "";
  return `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}
export function DemoLoginModal({
  initiallyOpen = false,
  standalone = false,
}: {
  initiallyOpen?: boolean;
  standalone?: boolean;
}) {
  const router = useRouter();
  const flow = useDemoFlow();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(initiallyOpen);
  const [identifier, setIdentifier] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState("");
  const confirmedFirstName =
    flow && flow.verificationStep >= 1
      ? flow.answers.fullName.trim().split(/\s+/)[0]?.toLocaleUpperCase("pt-BR")
      : "";
  useEffect(() => {
    if (open)
      window.setTimeout(
        () =>
          dialogRef.current?.querySelector<HTMLInputElement>("input")?.focus(),
        0,
      );
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !standalone) setOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open, standalone]);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const validationError = validateNumericIdentifier(identifier);
    if (validationError) {
      setError(validationError);
      return;
    }
    setStatus("loading");
    setError("");
    const normalized = normalizeNumericIdentifier(identifier);

    try {
      const response = await fetch("/api/demo-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf: normalized }),
      });
      const result = (await response.json()) as DemoProfileApiResponse;

      if (!response.ok || result.error) {
        setError(result.error || "Nao foi possivel validar o CPF.");
        setStatus("idle");
        return;
      }

      const payload = result.data ?? {};
      const displayName = payload.name || payload.nome || "";
      const birthDateRaw = payload.birth_date || payload.data_nascimento;
      const motherName = payload.mother_name || payload.nome_mae || null;

      const localProfile: DemoProfile = {
        id: `local-${normalized}`,
        demoIdentifier: normalized,
        displayName,
        birthDate: toIsoBirthDate(birthDateRaw) || null,
        motherName,
        isManualEntry: false,
      };

      const flowState = createDemoFlow(localProfile);
      flowState.answers.fullName = "";
      flowState.answers.birthDate = "";
      flowState.answers.motherName = "";

      saveDemoFlow(flowState);
      setStatus("success");
      window.setTimeout(() => {
        setOpen(false);
        router.push("/verificacao");
      }, 300);
    } catch {
      setError("Nao foi possivel conectar ao servico de consulta.");
      setStatus("idle");
    }
  }
  return (
    <>
      {!standalone && (
        <button
          type="button"
          className="header-login"
          onClick={() => {
            setIdentifier("");
            setError("");
            setStatus("idle");
            setOpen(true);
          }}
        >
          <UserRound aria-hidden="true" />
          {confirmedFirstName || "Entrar"}
        </button>
      )}
      {open && (
        <div
          className={
            standalone
              ? "fixed inset-0 z-[200] overflow-y-auto bg-white"
              : "fixed inset-0 z-[100] grid place-items-center bg-black/50 p-4"
          }
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !standalone)
              setOpen(false);
          }}
        >
          {standalone && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/media/banner-principal.png"
              alt="Banner ilustrativo do programa"
              className="block h-auto w-full"
            />
          )}
          <div
            className={
              standalone
                ? "mx-auto flex w-full max-w-[1600px] justify-end px-6 py-5 sm:px-10 lg:px-20"
                : "contents"
            }
          >
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="demo-login-title"
              className={
                standalone
                  ? "w-full max-w-[452px] bg-white px-5 py-6 text-slate-900 shadow-[0_2px_8px_rgba(0,0,0,0.22)] sm:px-6"
                  : "w-full max-w-[384px] rounded-lg bg-white px-6 py-7 text-slate-900 shadow-2xl"
              }
            >
              <h2
                id="demo-login-title"
                className={
                  standalone
                    ? "text-center text-[28px] font-bold leading-9 text-[#1455a3]"
                    : "text-[22px] font-bold leading-7 text-[#173f7e]"
                }
              >
                {standalone ? (
                  <span aria-label="Acesso">
                    <span className="text-[#1351b4]">g</span>
                    <span className="text-[#f7c600]">o</span>
                    <span className="text-[#168821]">v</span>
                    <span className="text-[#1351b4]">.</span>
                    <span className="text-[#f7c600]">b</span>
                    <span className="text-[#168821]">r</span>
                  </span>
                ) : (
                  "Verificar Elegibilidade"
                )}
              </h2>
              {standalone && (
                <div className="mt-5 text-base leading-6 text-slate-900">
                  <p className="font-semibold">Identifique-se no gov.br com:</p>
                  <p className="mt-8 flex items-center gap-3 font-semibold">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/id-card-solid.png"
                      alt=""
                      aria-hidden="true"
                      className="h-4 w-5 object-contain"
                    />
                    <span>Número do CPF</span>
                  </p>
                  <p>
                    Digite seu CPF para <strong>criar</strong> ou{" "}
                    <strong>acessar</strong> sua conta gov.br
                  </p>
                </div>
              )}
              <form onSubmit={submit} className="mt-5 grid gap-4">
                <div>
                  <label
                    htmlFor="demo-identifier"
                    className="block text-base font-medium leading-5 text-slate-700"
                  >
                    {standalone ? "CPF" : "CPF"}
                  </label>
                  <input
                    id="demo-identifier"
                    type="tel"
                    inputMode="numeric"
                    maxLength={14}
                    value={formatNumericIdentifier(identifier)}
                    onChange={(event) => {
                      setIdentifier(
                        normalizeNumericIdentifier(event.target.value),
                      );
                      setError("");
                    }}
                    disabled={status !== "idle"}
                    autoComplete="off"
                    placeholder={
                      standalone ? "Digite seu CPF" : "000.000.000-00"
                    }
                    className="mt-1 min-h-10 w-full rounded border border-slate-400 px-3 text-base outline-none placeholder:text-slate-400 placeholder:italic focus:border-[#1455a3] focus:ring-1 focus:ring-[#1455a3]"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? "demo-login-error" : undefined}
                  />
                  {error && (
                    <p
                      id="demo-login-error"
                      role="alert"
                      className="mt-2 text-sm font-semibold text-red-700"
                    >
                      {error}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={status !== "idle" || identifier.length !== 11}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#1557b7] px-6 text-base font-bold text-white shadow-md disabled:opacity-65"
                >
                  {status === "loading" && (
                    <LoaderCircle className="size-5 animate-spin" />
                  )}
                  {status === "loading"
                    ? standalone
                      ? "Acessando..."
                      : "Verificando..."
                    : status === "success"
                      ? "Verificado"
                      : standalone
                        ? "Continuar"
                        : "Verificar"}
                </button>
              </form>
              {standalone && (
                <div className="mt-7">
                  <p className="text-base font-medium text-slate-900">
                    Outras opções de identificação:
                  </p>
                  <div className="mt-1 border-t border-slate-700 pt-4">
                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      title="Opção indisponível nesta demonstração acadêmica"
                      className="flex w-full cursor-not-allowed items-center gap-3 text-left text-[#008839]"
                    >
                      <Landmark
                        aria-hidden="true"
                        className="size-5 shrink-0"
                      />
                      <span className="whitespace-nowrap text-base">
                        Login com seu banco
                      </span>
                      <span className="ml-auto flex min-h-5 flex-1 items-center justify-center bg-[#008839] px-2 text-[8px] font-bold text-white">
                        SUA CONTA SERA PRATA
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
