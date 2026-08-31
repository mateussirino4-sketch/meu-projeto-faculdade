type Cliente = {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
};

export async function criarPixReal(
  valorEmReais: number,
  dadosCliente: Cliente
) {
  const apiKey = process.env.BLACKCAT_PRIVATE_KEY;

  if (!apiKey) {
    throw new Error("BLACKCAT_PRIVATE_KEY não configurada");
  }

  const valorEmCentavos = Math.round(valorEmReais * 100);

  const payload = {
    amount: valorEmCentavos,
    currency: "BRL",
    paymentMethod: "pix",

    items: [
      {
        title: "Acordo de quitação",
        unitPrice: valorEmCentavos,
        quantity: 1,
        tangible: false
      }
    ],

    customer: {
      name: dadosCliente.nome,
      email: dadosCliente.email,
      phone: dadosCliente.telefone,
      document: {
        number: dadosCliente.cpf.replace(/\D/g, ""),
        type: "cpf"
      }
    },

    pix: {
      expiresInDays: 1
    }
  };

  const response = await fetch(
    "https://api.blackcatoficial.com/api/sales/create-sale",
    {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      cache: "no-store"
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Erro Blackcat:", data);

    throw new Error(
      data?.message || `Erro Blackcat (${response.status})`
    );
  }

  return data;
}