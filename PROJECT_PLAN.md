# Plano de reconstrução acadêmica independente

## Princípios obrigatórios

- Produto claramente rotulado como demonstração acadêmica, com marca e textos próprios.
- Somente dados fictícios e transações locais simuladas; nenhum CPF, PIX, credencial ou integração governamental real.
- Alta fidelidade de estrutura, responsividade e estados de interação, não de identidade enganosa, alegações oficiais ou mecanismos de cobrança.
- Critérios de aceite por rota, viewport e estado; testes incluem caminhos feliz, erro, vazio, expiração e recarga.

## Fase 0 — decisões, segurança e baseline

- [x] Definir nome/marca acadêmica, aviso persistente de simulação e substitutos para logos/brasões.
- [x] Escolher stack e convenções: Next.js, React, TypeScript, Tailwind CSS, Prisma e PostgreSQL local.
- [x] Criar matriz de viewports (375, 768, 1024 e 1440 px), navegadores e acessibilidade nos tokens/breakpoints da fundação.
- [ ] Congelar contratos dos dados fictícios e desenhar a máquina de estados completa da jornada. Os contratos iniciais e enums existem; o diagrama e a máquina final permanecem para as fases funcionais.
- [x] Criar fixtures com: usuário encontrado, entrada manual, dados incompletos, elegível, inelegível, pagamento pendente/aprovado/falho/expirado.

Entrega: especificação técnica, fluxograma de estados, tokens iniciais e dataset fictício aprovado.

## Fase 1 — fundação visual e navegação

- [x] Configurar projeto, lint, format, testes e CI.
- [x] Implementar tokens: cores, tipografia, escala 4 px, sombras, raios, breakpoints e motion.
- [x] Criar componentes estruturais: `AppHeader`, `SecondaryNav`, `Breadcrumbs`, `Footer`, `PageContainer`, `Card`, `Button`, `Input`, `Alert`, `Spinner`, `EmptyState` e `ErrorState`.
- [ ] Declarar todas as rotas, rota 404 real e guardas de sessão. As 12 rotas e o 404 estão prontos; os guardas serão conectados quando os fluxos funcionais forem implementados.
- [ ] Implementar persistência local segura da demo com botão “Limpar simulação”. O botão e a estrutura de sessão local existem; a persistência da jornada será concluída com os formulários.

Aceite: shell responsivo, foco visível, navegação por teclado, contraste AA e nenhum ativo governamental real.

## Fase 2 — landing e login

1. Construir `/`: cabeçalhos, breadcrumb, artigo, compartilhamento simulado, vídeo, carrossel, CTAs, rodapé e formulário fixo.
2. Reproduzir autoplay de 3 s, controles manuais, pausa no hover/foco e preferência `prefers-reduced-motion`.
3. Construir `/login` com layout desktop 50/50 e variante mobile sem imagem lateral. Modal e rota funcional responsiva concluídos; composição 50/50 permanece para refinamento visual futuro.
4. [x] Implementar validação de identificador fictício, loading, erro, sucesso e consulta exclusiva aos perfis locais do seed.
5. Preservar parâmetros de campanha apenas em memória/local demo, sem pixels externos.

Aceite: CTAs convergem para a mesma jornada; nenhum dado é transmitido fora do backend local.

## Fase 3 — verificação progressiva

1. [x] Implementar `/verificacao` como máquina de passos configurável, com confirmação, nome fictício, renda fictícia, nascimento, categoria, e-mail e telefone.
2. Suportar caminhos “perfil encontrado” (6/7 passos) e `manualEntry` (5 passos).
3. Criar opções sintéticas determinísticas via seed para snapshots estáveis.
4. Implementar sugestões de e-mail, máscaras, mensagens inline, loading, sucesso e áudio opcional acessível.
5. [x] Criar estado sem sessão/dados e ação de retorno.

Aceite: recarga restaura passo e dados fictícios; validações e bifurcações têm testes unitários.

## Fase 4 — conteúdo sequencial e elegibilidade

1. [x] Implementar `/saiba-mais` com cinco conteúdos sequenciais, avanço/retorno e progresso persistido. Transições avançadas permanecem para a fase de fidelidade.
2. Implementar `/verify-availability` com campos somente leitura, quatro etapas temporizadas e estados aprovado, inelegível, erro e vazio.
3. [x] Criar catálogo fictício de credores e contagens previsíveis de ofertas usando a API local existente.
4. [x] Persistir seleção do credor e encaminhar ao atendimento.

Aceite: animações não bloqueiam leitores de tela; testes com relógio falso validam toda a cronologia.

## Fase 5 — atendimento conversacional

1. Modelar roteiro do `/chat` em dados, não em condicionais espalhadas.
2. Criar balões, typing indicator, escolhas de dívida, cards de consulta, proposta e protocolo.
3. Implementar delays configuráveis e modo de teste instantâneo.
4. Criar documento/guia com marca acadêmica, valores fictícios e aviso “SEM VALOR FINANCEIRO”.
5. Implementar scroll automático sem sequestrar o usuário que estiver lendo mensagens anteriores.
6. Adicionar copiar código de teste e upload local opcional, sem enviar arquivo a terceiros.

Aceite: fluxo completo funciona em mobile/desktop, com retomada após recarga e estados de erro recuperáveis.

## Fase 6 — pagamentos simulados e conclusão

1. Consolidar `/pagamento`, `/pix-payment` e o pagamento do chat sobre um único serviço de transação simulada.
2. Manter as rotas de compatibilidade para reproduzir a topologia observada, mas sinalizar claramente que são simulações.
3. Implementar QR de teste não pagável, copia-e-cola inválido para redes reais, contador, polling local, retry e expiração.
4. Implementar `/success` e `/sucess` como alias; decidir se a segunda taxa será reproduzida apenas como cenário acadêmico ou removida. Se mantida, rotular “simulação sem cobrança”.
5. Implementar `/cadastro-concluido` com protocolo fictício, dados mascarados, próximos passos e retorno ao início.
6. Não implementar a jornada CNH em `/:cpf` dentro do produto principal; documentá-la em fixture separada ou página de laboratório explicitamente isolada, caso seja requisito docente.

Aceite: nenhuma string/QR consegue iniciar pagamento real; status podem ser controlados por painel de desenvolvimento.

## Fase 7 — backend e banco

- [x] Implementar API local:
   - `GET /api/demo-users/:id`
   - `POST /api/eligibility-checks`
   - `GET /api/creditors`
   - `POST /api/simulated-transactions`
   - `GET/PATCH /api/simulated-transactions/:id`
   - `POST /api/conversation-events`
- [x] Criar migrations para usuários demo, análises, credores, ofertas, transações, sessões e eventos.
- [x] Adicionar idempotência, validação de payload, expiração, seed e reset de banco.
- [ ] Aplicar logs mínimos, CSP, rate limiting local e proteção contra injeção/XSS. CSP, validação Zod e acesso parametrizado via Prisma estão prontos; rate limiting e política final de auditoria permanecem pendentes.

Aceite: contrato OpenAPI ou equivalente, testes de integração e reset completo da demo em um comando.

## Fase 8 — fidelidade visual e responsiva

1. Capturar snapshots de cada rota nos quatro viewports.
2. Comparar hierarquia, largura, alinhamento, tipografia, cores, espaçamentos, sombras e estados.
3. Revisar cabeçalhos compactos, cards, formulário fixo, chat e documentos longos em telas pequenas.
4. Testar zoom 200%, texto ampliado, orientação landscape e redução de movimento.
5. Corrigir overflow, layout shift de fontes/assets e áreas de toque menores que 44 px.

Aceite: checklist visual por rota/estado, sem regressões acima do limite definido para snapshots.

## Fase 9 — testes ponta a ponta

1. Caminho encontrado completo.
2. Caminho de entrada manual.
3. Consulta falha, dado incorreto, e-mail/telefone inválidos.
4. Elegibilidade aprovada, inelegível, vazia e erro.
5. Transação pendente, aprovada, falha, expirada e retry.
6. Recarga em cada etapa e limpeza da sessão.
7. Rotas diretas, alias `/sucess`, query strings e 404.
8. Testes de acessibilidade automatizados e manuais.

Aceite: suíte E2E estável, sem rede externa e sem segredos.

## Fase 10 — documentação e entrega

- [x] README com objetivo acadêmico, instalação, seed, execução e reset.
2. Diagrama de arquitetura e modelo de dados.
3. Catálogo de componentes/estados e matriz de rotas.
4. Registro de diferenças intencionais: marca própria, dados fictícios, ausência de pixels, ausência de cobrança real e isolamento da rota CNH.
5. Checklist final de segurança, privacidade, licenças de assets e acessibilidade.

Entrega final: aplicação funcional independente, backend/banco locais, testes, documentação e demo reproduzível.

## Ordem de dependências

`Fundação` → `Landing/Login` → `Verificação` → `Saiba mais` → `Elegibilidade` → `Chat` → `Pagamento simulado` → `Conclusão` → `Fidelidade/E2E`.

Backend e banco começam com contratos/fixtures na Fase 0, ganham implementação mínima junto de cada tela e são consolidados na Fase 7. Isso evita construir telas contra APIs ainda indefinidas sem atrasar a validação visual.

## Auditoria do fluxo funcional — 17/08/2026

- [x] Remover a etapa intermediária visível anterior à confirmação do nome.
- [x] Alinhar a verificação progressiva: nome, nascimento, nome da mãe quando disponível, faixa salarial, tipo de dívida, e-mail e telefone.
- [x] Alinhar os cinco conteúdos sequenciais e preservar avanço, retorno e recarga.
- [x] Alinhar análise em quatro estados, resultado e seleção de credor.
- [x] Completar atendimento, proposta, confirmação e encaminhamento às etapas finais.
- [x] Implementar as telas locais finais com códigos deliberadamente não pagáveis e conclusão da jornada.
- [x] Validar caminho completo, retorno, persistência, erros, desktop e mobile por testes automatizados.

### Revisão do identificador e formulários

- [x] Substituir o CPF por identificador numérico local de exatamente 11 dígitos, sem algoritmo, máscara ou consulta externa.
- [x] Remover gerador, allowlist e campo `demoCpf` do código ativo e do banco.
- [x] Substituir alternativas de nome por campo único com botão `Confirmar`.
- [x] Padronizar as seis etapas de dados com indicador circular, um controle por tela e navegação persistente.
- [x] Revalidar a jornada completa em desktop e mobile.
