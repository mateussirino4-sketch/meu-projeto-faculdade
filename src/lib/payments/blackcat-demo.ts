export async function criarPixReal(valorEmReais: number, dadosCliente: any) {
  // 1. Transforma o valor em centavos (Ex: R$ 50,00 vira 5000)
  const valorEmCentavos = Math.round(valorEmReais * 100);

  // 2. Monta os dados no padrão da API BlackCat Oficial
  const payload = {
    amount: valorEmCentavos,
    currency: "BRL",
    paymentMethod: "pix",
    customer: {
      name: dadosCliente.nome,
      email: dadosCliente.email,
      phone: dadosCliente.telefone,
      document: {
        number: dadosCliente.cpf.replace(/\D/g, ""), // Limpa o CPF
        type: "cpf"
      }
    },
    pix: {
      expiresInDays: 1
    }
  };

  // 3. Endpoint Oficial de Produção da BlackCat Oficial
  const URL_REAL = "https://blackcatoficial.com"; 
  const API_KEY_REAL = process.env.BLACKCAT_PRIVATE_KEY || "";

  // 4. Faz a conexão real de internet
  const response = await fetch(URL_REAL, {
    method: "POST",
    headers: {
      "X-API-Key": API_KEY_REAL, 
      "Content-Type": "application/json",
      "Idempotency-Key": `PIX-${Date.now()}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const textoErro = await response.text();
    throw new Error(`Erro BlackCat: ${response.status} - ${textoErro}`);
  }

  return await response.json(); 
}
