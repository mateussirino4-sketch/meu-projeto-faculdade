import Link from "next/link";
import { EmptyState } from "@/components/feedback";

export default function NotFound() { return <main className="mx-auto max-w-4xl px-4 py-12"><EmptyState title="Página não encontrada" description="Este caminho não faz parte da demonstração acadêmica." action={<Link className="font-semibold text-[var(--color-primary)] underline" href="/">Voltar ao início</Link>} /></main>; }
