# teste

Fundação técnica de uma demonstração acadêmica independente. Todos os perfis, credores, propostas e transações são fictícios. O projeto não consulta CPF real, não gera PIX pagável e não se conecta a órgãos públicos, bancos ou autenticação externa.

## Desenvolvimento

1. Copie `.env.example` para `.env` e use credenciais de um PostgreSQL exclusivamente local.
2. Execute `npm install`.
3. Execute `npm run db:migrate` e `npm run db:seed`.
4. Execute `npm run dev`.

Validações: `npm run typecheck`, `npm run lint`, `npm test` e `npm run build`.

Fixtures: `DEMO-FOUND-001`, `DEMO-MANUAL-002` e `DEMO-INCOMPLETE-003`.
