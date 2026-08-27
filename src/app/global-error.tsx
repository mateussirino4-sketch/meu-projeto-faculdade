"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="pt-BR"><body><main style={{ maxWidth: 720, margin: "64px auto", padding: 24 }}><h1>Erro inesperado na demonstração</h1><p>Nenhum dado real foi processado. Tente carregar novamente.</p><button onClick={reset}>Tentar novamente</button></main></body></html>;
}
