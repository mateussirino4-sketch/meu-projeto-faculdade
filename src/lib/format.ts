export function maskDemoIdentifier(value: string) { if (value.length < 5) return "***"; return `${value.slice(0, 4)}••••${value.slice(-3)}`; }
export function formatCurrency(value: number | string) { return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value)); }
