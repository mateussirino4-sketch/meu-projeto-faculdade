"use client";

import { Button } from "./ui";
import { useRouter } from "next/navigation";

export function ResetDemoButton() {
  const router = useRouter();

  return <Button aria-label="Limpar simulação" className="min-h-9 border border-blue-200 bg-blue-50 px-2.5 text-xs text-[var(--color-primary)] shadow-none hover:bg-blue-100 sm:px-3 sm:text-sm" onClick={() => { localStorage.clear(); sessionStorage.clear(); router.push("/"); router.refresh(); }}><span className="sm:hidden">Limpar</span><span className="hidden sm:inline">Limpar simulação</span></Button>;
}
