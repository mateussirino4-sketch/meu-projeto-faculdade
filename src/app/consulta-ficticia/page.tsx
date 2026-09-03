"use client";

import { FormEvent, useState } from "react";

type DemoProfile = {
  name: string;
  birthDate: string | null;
  motherName: string;
};

function digitsOnly(value: string) {
  return value.replace(/\D/g, "").slice(0, 11);
}

function maskIdentifier(value: string) {
  return digitsOnly(value)
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function formatDate(value: string | null) {
  if (!value) return "Não informada";
  const parts = value.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  return value;
}

export default function DemoProfilePage() {
  const [identifier, setIdentifier] = useState("");
  const [profile, setProfile] = useState<DemoProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");

  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = digitsOnly(identifier);

    if (normalized.length !== 11) {
      setError("Digite os 11 números do CPF.");
      return;
    }

    setLoading(true);
    setError("");
    setProfile(null);
    setConfirmed(false);

    try {
      const response = await fetch("/api/demo-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf: normalized }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        const errorText =
          typeof result.error === "string"
            ? result.error
            : "Não foi possível realizar a consulta.";
        setError(errorText);
        return;
      }

      // Mapeamento dos campos retornados pela API
      const apiData = result.data || result;
      const mappedProfile: DemoProfile = {
        name: apiData.nome || apiData.name || "Nome não retornado",
        birthDate:
          apiData.data_nascimento ||
          apiData.birth_date ||
          apiData.birthDate ||
          null,
        motherName:
          apiData.nome_mae ||
          apiData.mother_name ||
          apiData.motherName ||
          "Não informada",
      };

      setProfile(mappedProfile);
    } catch {
      setError("Não foi possível conectar com o servidor local.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[70vh] bg-slate-50 px-4 py-10">
      <section className="mx-auto w-full max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
          Consulta de Perfil — API Real
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          Consulta CPF
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Digite um CPF com 11 dígitos para realizar a consulta através da API.
        </p>

        <form className="mt-6" onSubmit={(event) => void search(event)}>
          <label
            htmlFor="demo-identifier"
            className="block text-sm font-semibold text-slate-800"
          >
            Número do CPF
          </label>
          <input
            id="demo-identifier"
            value={maskIdentifier(identifier)}
            onChange={(event) => {
              setIdentifier(digitsOnly(event.target.value));
              setProfile(null);
              setConfirmed(false);
              setError("");
            }}
            inputMode="numeric"
            autoComplete="off"
            maxLength={14}
            placeholder="000.000.000-00"
            className="mt-2 h-11 w-full rounded-md border border-slate-400 px-3 outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 text-slate-900"
          />

          {error && (
            <p role="alert" className="mt-3 text-sm font-medium text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={digitsOnly(identifier).length !== 11 || loading}
            className="mt-5 w-full rounded-full bg-blue-700 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Consultando API..." : "Buscar dados"}
          </button>
        </form>

        {profile && (
          <section className="mt-7 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900">
              Dados Encontrados
            </h2>
            <dl className="mt-4 grid gap-4 rounded-md bg-slate-50 p-4">
              <div>
                <dt className="text-xs uppercase text-slate-500">Nome</dt>
                <dd className="font-semibold text-slate-900">{profile.name}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-slate-500">
                  Data de nascimento
                </dt>
                <dd className="font-semibold text-slate-900">
                  {formatDate(profile.birthDate)}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-slate-500">
                  Nome da mãe
                </dt>
                <dd className="font-semibold text-slate-900">
                  {profile.motherName}
                </dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={() => setConfirmed(true)}
              disabled={confirmed}
              className="mt-5 w-full rounded-full bg-blue-700 px-5 py-3 font-semibold text-white disabled:bg-green-700"
            >
              {confirmed ? "Dados confirmados" : "Confirmar dados"}
            </button>
          </section>
        )}
      </section>
    </main>
  );
}