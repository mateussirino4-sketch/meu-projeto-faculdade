"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, LoaderCircle } from "lucide-react";
import { Container } from "@/components/ui";
export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);
  if (loading)
    return (
      <main className="grid min-h-[60vh] place-items-center">
        <div className="text-center">
          <LoaderCircle className="mx-auto size-9 animate-spin text-[#1351b4]" />
          <p className="mt-3 font-semibold">Gerando código de teste...</p>
        </div>
      </main>
    );
  return (
    <main className="bg-[#f8f8f8]">
      <Container className="py-10">
        <section className="mx-auto w-full max-w-[620px] rounded-md bg-white p-6 shadow-[0_2px_4px_#0003] sm:p-8">
          <h1 className="text-center text-[18px] font-bold leading-6 text-[#222]">
            Aguardando confirmação
          </h1>
          <div className="mx-auto mt-6 grid size-48 place-items-center rounded-md border-4 border-[#0c326f] bg-slate-100 p-5 text-center text-xs font-black text-[#0c326f]">
            CÓDIGO LOCAL
            <br />
            NÃO É QR PIX
            <br />
            NÃO PAGÁVEL
          </div>
          <div className="mt-6 rounded-md border border-amber-300 bg-amber-50 p-4 text-center text-sm font-bold">
            SIMULAÇÃO — não use aplicativos bancários.
          </div>
          <label className="mt-5 block text-sm font-semibold">
            Código copia e cola de teste
          </label>
          <div className="mt-1 flex">
            <input
              readOnly
              value="DEMO-NOT-A-REAL-PIX-ACADEMICO"
              className="h-11 min-w-0 flex-1 rounded-l border px-3 text-xs"
            />
            <button
              onClick={() => {
                void navigator.clipboard?.writeText(
                  "DEMO-NOT-A-REAL-PIX-ACADEMICO",
                );
                setCopied(true);
              }}
              className="rounded-r bg-[#1351b4] px-4 text-white"
            >
              <Copy className="size-4" />
            </button>
          </div>
          {copied && (
            <p className="mt-2 text-sm text-green-700">Código copiado</p>
          )}
          <button
            onClick={() => router.push("/success")}
            className="mt-6 w-full rounded-full bg-[#1351b4] py-3 font-bold text-white"
          >
            Confirmar simulação
          </button>
          <button
            onClick={() => router.push("/pagamento")}
            className="mt-3 w-full py-2 font-semibold text-[#1351b4]"
          >
            Voltar
          </button>
        </section>
      </Container>
    </main>
  );
}
