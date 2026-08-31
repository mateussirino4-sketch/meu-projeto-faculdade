"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type PixPaymentDataDemo = {
  qrCodeBase64: string;
  copyPaste: string;
};

const NON_SCANNABLE_PLACEHOLDER =
  "data:image/svg+xml;base64," +
  btoa(
    '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><rect width="240" height="240" fill="white"/><rect x="8" y="8" width="224" height="224" rx="8" fill="#f1f5f9" stroke="#94a3b8" stroke-width="4"/><text x="120" y="105" text-anchor="middle" font-family="Arial" font-size="18" font-weight="700" fill="#0f172a">SIMULAÇÃO</text><text x="120" y="135" text-anchor="middle" font-family="Arial" font-size="14" fill="#475569">QR NÃO PAGÁVEL</text></svg>',
  );

export const STATIC_PIX_DEMO_DATA: PixPaymentDataDemo = {
  qrCodeBase64: NON_SCANNABLE_PLACEHOLDER,
  copyPaste: "PIX_COPIA_E_COLA_FICTICIO_NAO_PAGAVEL",
};

type PixFinalizationDemoProps = {
  paymentData?: PixPaymentDataDemo;
  initialSeconds?: number;
};

function formatRemainingTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function PixFinalizationDemo({
  paymentData = STATIC_PIX_DEMO_DATA,
  initialSeconds = 15 * 60,
}: PixFinalizationDemoProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  useEffect(() => {
    if (secondsRemaining <= 0) return;

    const timer = window.setInterval(() => {
      setSecondsRemaining((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [secondsRemaining]);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(paymentData.copyPaste);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  const expired = secondsRemaining === 0;

  return (
    <section className="mx-auto w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <header className="text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
          Demonstração acadêmica
        </p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">
          Finalização Pix fictícia
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Este código não realiza nem recebe pagamentos.
        </p>
      </header>

      <Image
        src={paymentData.qrCodeBase64}
        alt="Placeholder acadêmico não escaneável"
        width={240}
        height={240}
        unoptimized
        className="mx-auto mt-5 size-60 rounded-lg border border-slate-200"
      />

      <div className="mt-5 rounded-md bg-slate-50 p-3 text-center">
        <span className="text-sm text-slate-600">Tempo restante</span>
        <strong
          className={`ml-2 tabular-nums ${expired ? "text-red-700" : "text-slate-900"}`}
        >
          {formatRemainingTime(secondsRemaining)}
        </strong>
      </div>

      <label
        htmlFor="pix-copy-paste-demo"
        className="mt-5 block text-sm font-semibold text-slate-800"
      >
        Pix Copia e Cola fictício
      </label>
      <textarea
        id="pix-copy-paste-demo"
        readOnly
        value={paymentData.copyPaste}
        rows={3}
        className="mt-2 w-full resize-none rounded-md border border-slate-300 p-3 text-sm text-slate-700"
      />

      <button
        type="button"
        onClick={() => void copyCode()}
        disabled={expired}
        className="mt-3 w-full rounded-full bg-blue-700 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {expired ? "Código expirado" : "Copiar Código"}
      </button>

      <p aria-live="polite" className="mt-2 min-h-5 text-center text-sm">
        {copyStatus === "copied" && (
          <span className="text-green-700">Código fictício copiado.</span>
        )}
        {copyStatus === "error" && (
          <span className="text-red-700">
            Não foi possível copiar o código.
          </span>
        )}
      </p>
    </section>
  );
}
