import { notFound } from "next/navigation";
import { PagePlaceholder } from "@/components/page-placeholder";

export default async function Page({ params }: { params: Promise<{ cpf: string }> }) { const { cpf } = await params; if (!/^DEMO-[A-Z0-9-]+$/i.test(cpf)) notFound(); return <PagePlaceholder isolated title="Laboratório isolado" route="/:cpf" description={`Fixture isolada ${cpf}. Esta rota não integra a jornada principal e nunca consulta CPF real.`} />; }
