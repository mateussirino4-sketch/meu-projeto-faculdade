"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/feedback";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("Erro da demonstração:", error); }, [error]);
  return <main className="mx-auto max-w-4xl px-4 py-12"><ErrorState title="Não foi possível carregar esta etapa" description="Os dados são apenas locais. Tente novamente ou reinicie a demonstração." actionLabel="Tentar novamente" onAction={reset} /></main>;
}
