# Análise da aplicação de referência

## 1. Escopo, método e limites

- Referência analisada em 14/08/2026: `https://programadesenrolabr.site/`, incluindo o URL de campanha fornecido.
- A análise combinou navegação pública, inspeção do HTML, CSS e bundle JavaScript entregues ao navegador, inventário de assets e uma segunda passagem por rotas, transições e estados condicionais.
- Nenhum CPF real, credencial, dado pessoal ou pagamento foi fornecido. Endpoints sensíveis foram apenas identificados; não foram acionados com dados de terceiros.
- A aplicação imita identidade e linguagem do `gov.br`/Ministério da Fazenda, consulta CPF e solicita PIX. Também carrega Meta Pixel e UTMify. Esses elementos são fortes sinais de risco de fraude/phishing e não constituem prova de vínculo oficial.
- A futura aplicação acadêmica deve usar marca própria, aviso explícito de simulação, pessoas/credores fictícios e PIX simulado. Não deve copiar brasões, identidade governamental, alegações de aprovação oficial ou mecanismos reais de cobrança.
- Algumas telas dependem de `localStorage`, query string e respostas privadas. Nesses casos, o comportamento abaixo foi reconstruído a partir do código público e marcado como condicional.

## 2. Resumo técnico observado

- SPA em React, com roteamento client-side semelhante ao Wouter.
- CSS híbrido: folha própria inspirada no Design System gov.br, utilitários Tailwind e muitos estilos inline.
- Fontes: `rawline` 400/500/600/700 declarada localmente; `Open Sans` 400/500/600/700 carregada pelo Google Fonts. Se Rawline não carregar, há fallback para `Rawline, serif`; partes utilitárias usam fonte sans.
- Ícones: Font Awesome 6.5.2, Lucide e ícones React/SVG inline.
- Estado persistido principalmente em `localStorage`: `userData`, `utmData`, `selectedDetran`, `currentTransactionId` e uma chave de evento/pixel.
- Integrações observadas: `/consulta.php`, `/checkout/pagamento.php`, `/checkout/verificar.php`, `/api/log-access.php` e `/api/transaction/:id`.
- Telemetria: Meta Pixel, UTMify, parâmetros UTM/`fbclid`, referrer, user agent, dimensões da tela, idioma e plataforma.

## 3. Mapa de rotas

| Rota | Tela/componente | Entrada/condição | Saída observada |
|---|---|---|---|
| `/` | Landing/notícia + formulário de CPF | Pública | `/login` pelo botão Entrar; `/verificacao?data=...` pelo formulário/CTAs |
| `/login` | Login visual gov.br por CPF | Pública | `/verificacao?data=...` |
| `/verificacao` | Confirmação progressiva de identidade e contato | Exige query `data`; sem ela mostra erro | `/saiba-mais?data=...` |
| `/saiba-mais` | Carrossel sequencial de cinco explicações | `data` propagado | `/verify-availability?data=...` |
| `/verify-availability` | Análise simulada e seleção de credor | Exige `userData` para renderizar conteúdo | `/chat` após selecionar credor |
| `/chat` | Atendimento conversacional, proposta, guia e PIX | Exige `userData` + `selectedDetran` | `/success` quando pagamento é aprovado |
| `/pagamento` | Resumo legado de taxas e finalização | Fluxo alternativo/legado | redirecionamento completo para `/pix-payment` |
| `/pix-payment` | PIX alternativo/legado | Cria/verifica transação | `/success`; erro pode voltar a `/pagamento` |
| `/success` | Segunda cobrança denominada taxa de regularização | Após pagamento anterior ou acesso direto condicionado | `/cadastro-concluido` após novo pagamento aprovado |
| `/sucess` | Alias com grafia incorreta | Mesmo componente de `/success` | Igual a `/success` |
| `/cadastro-concluido` | Confirmação final e protocolo | Usa `userData` | botão volta para `/` |
| `/:cpf` | Jornada distinta de CNH/DETRAN | Qualquer segmento; busca transação por id/CPF | `/success` após confirmação; estados loading/not found/pagamento |

Não há rota 404 explícita. Como `/:cpf` é a última rota, um caminho de um único segmento desconhecido pode ser tratado como CPF/id da jornada de CNH.

## 4. Sequência exata dos fluxos

### 4.1 Fluxo principal observado

1. `/`: artigo promocional e formulário fixo inferior “Verificar Elegibilidade”. O CPF é mascarado e enviado a `/consulta.php?cpf=...`.
2. Se a consulta retornar nome e nascimento, os dados são gravados em `userData`; se falhar ou não houver resultado completo, é criado um objeto `manualEntry: true`.
3. `/verificacao`: confirma/obtém dados em etapas. Cada resposta passa por loading de 3 s e sucesso de 1 s.
4. `/saiba-mais`: cinco slides obrigatórios, sem pular; cada avanço usa loading de 1 s, confirmação de 0,5 s e animação de entrada/saída.
5. `/verify-availability`: quatro verificações de 2,5 s cada; ao fim, mostra aprovação e lista aleatória de credores/acordos.
6. Seleção de “Renegociar” grava o credor em `selectedDetran` e abre `/chat`.
7. `/chat`: escolha do tipo de dívida → mensagens temporizadas → três botões “Prosseguir” → proposta de R$ 178,57 → “Confirmar acordo” → geração de protocolo/documentos → “Prosseguir” → “Finalizar Cadastro”.
8. O chat chama `/checkout/pagamento.php`, mostra guia e PIX, inicia contador de 10 min e consulta `/checkout/verificar.php` a cada 5 s. Também oferece cópia do código, verificação manual e upload de comprovante.
9. Pagamento aprovado leva a `/success`.
10. `/success` apresenta uma nova “Taxa de Regularização de Cadastro” de R$ 48,90, gera outro PIX e consulta o status.
11. Segundo pagamento aprovado leva a `/cadastro-concluido`, com protocolo, dados mascarados, status “Ativo” e próximos passos.

### 4.2 Entrada alternativa pelo login

`/` → botão “Entrar” → `/login` → CPF → mesma consulta → `/verificacao` → fluxo principal.

### 4.3 Fluxo legado/alternativo

`/pagamento` → resumo “Finalizar Cadastro” e total de R$ 94,73 → `/pix-payment` → criação/consulta de PIX → `/success` → cobrança de R$ 48,90 → `/cadastro-concluido`.

### 4.4 Rota paralela CNH/DETRAN

`/:cpf` não se encaixa no Desenrola: consulta `/api/transaction/:id`, exibe “PAGAMENTO OBRIGATÓRIO”, brasão/DETRAN, “TAXAS ADMINISTRATIVAS CNH”, TED R$ 37,40, TSA R$ 28,80 e TPE R$ 28,80, QR Code/PIX, vencimento e polling. Deve ser tratada como resíduo/reuso de outro produto, não como etapa do fluxo principal.

## 5. Tela por tela

### `/` — landing em formato de notícia

- Cabeçalho branco em duas barras: logo gov.br, menu de reticências, divisor, cookies, grade de sistemas, botão-pílula “Entrar”; abaixo, menu hambúrguer “Ministério da Fazenda” e busca.
- Breadcrumb: início → Assuntos → Notícias → 2026 → título.
- Categoria “FINANÇAS”; H1 azul-escuro sobre descontos de até 96% e 60 meses.
- Compartilhamento com Facebook, X/Twitter, LinkedIn, WhatsApp e copiar link; são elementos visuais/clicáveis, sem navegação implementada no bundle.
- Data “Publicado em 04/05/2026 10h00”, atualização, banner, vídeo local e texto editorial.
- Carrossel de três imagens, setas, indicadores e autoplay a cada 3 s.
- CTAs repetidos “Verificar Minha Elegibilidade Agora”, aviso “Vagas limitadas — encerra em breve”, bloco de urgência, lista de benefícios, instruções e base legal.
- Rodapé azul com “gov.br” e links textuais de assuntos.
- Barra/formulário fixo inferior: título “Verificar Elegibilidade”, campo `CPF` (`tel`, placeholder `000.000.000-00`) e botão de envio; botão alternativo “Entrar” abre `/login`.
- Ao rolar, a barra fixa desloca verticalmente ±20 px e retorna em 300 ms.

### `/login`

- Banner horizontal local no topo.
- Layout 50/50 em desktop: imagem GovBR à esquerda e card à direita. Em até 800 px, vira coluna invertida, esconde a imagem lateral e reduz fonte para 0,8 rem.
- Card com logo, “Identifique-se no gov.br com:”, opção “Número do CPF”, explicação, label/entrada CPF e botão “Continuar”.
- Campo: `tel`, máscara `000.000.000-00`, `autocomplete=new-password`, obrigatório; não há mensagem textual de obrigatório, apenas `aria-invalid`.
- Loading: spinner e “Acessando...”; botão desabilitado.
- Bloco “Outras opções de identificação” contém alternativas visuais herdadas do login gov.br (incluindo certificado/banco, conforme componentes do bundle), sem fluxo funcional relevante identificado.

### `/verificacao`

- Cabeçalho gov.br reutilizado; card central até 800 px e título “Confirme seus dados para o cadastro...”.
- Sem `data`: card “Dados não encontrados”, explicação e botão “Voltar”.
- Com dados encontrados: sequência de 6 ou 7 passos: nome, nascimento, nome da mãe (se disponível), faixa salarial, tipo de dívida, e-mail e telefone.
- Com `manualEntry`: 5 passos: nome digitado, faixa salarial, tipo de dívida, e-mail e telefone.
- Para nome/nascimento/mãe, mostra uma opção real e duas falsas geradas aleatoriamente; só a resposta igual ao dado retornado avança.
- Faixas: desempregado; até R$ 2.640; R$ 2.641–6.600; R$ 6.601–13.200; acima de R$ 13.200.
- Dívidas: bancárias; cartão; financiamento; contas de serviços; outros.
- E-mail oferece sugestões de domínio quando há `@` sem ponto; telefone recebe máscara `(11) 99999-9999`.
- Erros: nome curto, campo vazio, e-mail/telefone inválidos ou “Dados incorretos...”. Loading “Verificando”; sucesso “Verificado” com check e efeito sonoro.

### `/saiba-mais`

- Cinco páginas internas, numeradas: Novo Desenrola Brasil; Acesso ao Portal; Renegociação com Desconto; Limpeza do Nome; Taxa de Adesão.
- Cada uma tem imagem central (380 px, 480 px no breakpoint `md`, máximo 400 px), painel cinza-claro e texto.
- Botão muda entre “Avançar”, “Finalizar”, “Processando...” e “Concluído”.
- Animações Framer Motion: título entra com opacidade/y em 0,3 s; imagem entra x=50 e sai x=-50; texto entra/sai no eixo y, ambos em 0,5 s.

### `/verify-availability`

- Campos desabilitados de Nome, CPF e Nascimento; grid de duas colunas, nome ocupa as duas.
- Estado “analyzing”: quatro linhas; atual tem spinner verde, anteriores check verde, futuras ficam com 40% de opacidade.
- Após ~10 s: card verde de aprovação e lista de 27 bancos/credores. Cada item recebe aleatoriamente 43–102 “acordos disponíveis” e botão “Renegociar”.
- Sem `userData`, o corpo central fica vazio, mantendo apenas a estrutura geral.

### `/chat`

- Cabeçalho gov.br e segunda faixa “Atendimento Gov.br” com avatar circular e ponto online verde.
- Área rolável com altura `calc(100vh - 160px)`, largura máxima 4xl e scroll suave.
- Mensagens recebidas: balão azul `#2670CC`, texto branco, canto superior esquerdo reduzido; enviadas: cinza, alinhadas à direita. Largura máxima 80%.
- Indicador digitando: três pontos brancos com bounce e delays 0/150/300 ms.
- Categorias: Dívidas Bancárias, Cartão de Crédito, Financiamento (veículo/imóvel), Outros.
- Mensagens possuem esperas de 3–7 s; há cards intermediários de consulta, proposta aprovada e geração de protocolo.
- Proposta fixa: total R$ 178,57 (TAC R$ 5,75, TSA R$ 5,75, TPE R$ 167,97). Meses/vagas e protocolos são aleatórios.
- Documento “GUIA DE RECOLHIMENTO — NEGOCIAÇÃO — NOVO DESENROLA BRASIL”, dados do contribuinte, débitos, QR Code, copia-e-cola, vencimento, total e contador.
- Estados: gerando PIX; mensagens de espera aos 5 e 15 s; erro com “Tentar Novamente”; código copiado por 3 s; aguardando pagamento; verificando pagamento; upload de comprovante; sucesso/redirecionamento.

### `/pagamento`

- Card “Finalizar Cadastro / Novo Desenrola Brasil”, aviso verde de aprovação e resumo de taxas.
- Exibe valor anterior riscado de R$ 150,00 e total R$ 94,73, além de avisos de obrigatoriedade.
- Botão “Finalizar Cadastro” faz navegação completa para `/pix-payment`, preservando query string.

### `/pix-payment`

- Inicial: spinner e “Gerando PIX...”.
- Erro: “Erro no Pagamento”, detalhes, orientações, “Tentar Novamente” e “Voltar”.
- Aprovado: check, “Pagamento Confirmado!” e “Redirecionando...”.
- Pendente: dados de nome/CPF/valor/situação; alerta; contador; QR Code ou placeholder; PIX copia-e-cola; botão copiar; quatro passos de pagamento; status e id da transação.
- Polling em `/checkout/verificar.php`; status aceitos: `paid`, `approved`, `completed`; expirado/cancelado encerram verificação.

### `/success` e `/sucess`

- Apesar do nome, a tela é outra cobrança: “Taxa de Regularização de Cadastro”, R$ 48,90.
- Card com logo, avisos “Importante” e “Atenção”, justificativa de obrigatoriedade e valor destacado.
- Estados: gerando PIX, erro/tentar novamente, PIX com QR Code/copia-e-cola, aguardando pagamento e confirmado/redirecionando.
- Cria nova transação em `/checkout/pagamento.php`; ao aprovar, abre `/cadastro-concluido`.

### `/cadastro-concluido`

- Check verde e “Cadastro Concluído!”, mensagem de ativação.
- Card de programa, protocolo gerado, nome capitalizado, CPF mascarado, nascimento, data atual e badge “Ativo”.
- Lista “Próximos Passos”, ação de download/arquivo visual e botão “Voltar ao Início”.
- Dispara eventos de conversão (Meta/TikTok quando disponíveis).

### `/:cpf`

- Loading “Carregando dados do pagamento...”.
- Vazio/erro: “Transação não encontrada”.
- Sucesso de consulta: tela CNH/DETRAN separada, vencimento, contribuinte, exercício, três taxas, QR Code/copia-e-cola, botão copiar e status aguardando pagamento.

## 6. Design visual e tokens

- Cores-base declaradas: primária `#1351B4`; azul alternativo `#1451B4`; azul de chat `#2670CC`; azul-escuro de H1 `#0C326F`; fundo branco `#FFFFFF`; fundo geral secundário `#F8F8F8`/cinzas Tailwind; texto `#333333`; borda `#888888`; sucesso verde (`#16A34A`, `#22C55E` e fundos claros); erro vermelho; aviso amarelo `#FFFFBF`.
- Tipografia-base: 16 px, line-height 1,5; em mobile do login, 12,8 px. H1 landing 24 px, 30 px a partir de `md`; chat 16 px; labels e metadados 12–14 px.
- Espaçamento recorrente em múltiplos de 4 px: 8, 12, 16, 20, 24, 32. Cards usam 20 px no login, 32 px em formulários; margens verticais 20–30 px.
- Inputs globais: 100%, 40 px de altura, padding 0 20 0 30 px, borda 1 px `#888`, raio 4 px. Inputs modernos usam padding 12 px e focus ring azul.
- Botões globais: fonte 700, raio 24 px, sombra leve; CTAs específicos usam azul, branco, alturas/paddings utilitários e às vezes raio pequeno.
- Cards: branco, sombra `0 2px 4px #0003`, geralmente centralizados; blocos modernos usam raios 6–10 px e bordas cinza.
- Breakpoints principais: 800 px no login e Tailwind `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536. O site é mobile-first nas áreas Tailwind.
- No mobile, grids viram uma coluna, cards reduzem padding, imagens usam largura quase integral, cabeçalhos mantêm ícones compactos e o aside do login desaparece. O meta viewport bloqueia zoom (`maximum-scale=1, user-scalable=0`), o que é uma falha de acessibilidade.

## 7. Assets públicos inventariados

| Asset | Uso |
|---|---|
| `/assets/desenrola-banner.png` | banner/slide e OG image relativa |
| `/assets/desenrola-banner2.png` | imagem do artigo/participação |
| `/assets/desenrola-mao.webp` | carrossel/slide informativo |
| `/assets/desenrola-mulher.webp` | carrossel/slide informativo |
| `/assets/desenrola-celular.webp` | carrossel/slide informativo |
| `/assets/desenrola-assinatura.jpeg` | slide taxa de adesão |
| `/assets/desenrola-logo.png` | documentos e telas de pagamento |
| `/assets/desenrola-video.mp4` | vídeo incorporado na landing |
| `/assets/icon.png` | avatar do atendimento |
| `https://i.ibb.co/zPFChvR/logo645.png` | logo gov.br externa |
| `https://cdn.jsdelivr.net/gh/govbr-assets/images/conta_govbr_v2.jpg` | arte lateral do login |
| `https://sso.acesso.gov.br/.../id-card-solid.png` | ícone CPF do login |

Há ainda fontes `rawline-400/500/600/700.woff2`, Font Awesome remoto, Google Fonts, QR Codes retornados por backend e brasões estaduais dinâmicos na rota CNH. Inventário não implica autorização de reutilização; a reconstrução acadêmica deve substituir marcas e símbolos oficiais.

## 8. Estados globais e casos de borda

- Loading: spinners circulares, botões desabilitados, skeleton textual e indicador de digitação.
- Sucesso: check verde/azul, texto temporário, som curto, cards verdes e redirecionamentos atrasados.
- Erro: consulta CPF cai silenciosamente em entrada manual; verificação mostra mensagens inline; pagamento mostra cards de erro e retry; rota dinâmica mostra “Transação não encontrada”.
- Vazio: `/verificacao` sem query mostra erro próprio; `/verify-availability` sem `userData` fica visualmente vazio; `/chat` sem estados persistidos não consegue criar PIX; `/cadastro-concluido` usa `-` para campos ausentes.
- Expiração: contador de PIX em 10 min no chat; status `expired`/`cancelled` são reconhecidos no fluxo alternativo.
- Persistência: atualizar a página mantém dados pessoais, credor e transação no navegador; não foi observada limpeza automática desses dados.
- Aleatoriedade: opções falsas de identidade, contagem de acordos, meses/vagas, protocolo e número de guia variam a cada sessão/renderização relevante.
- Query tracking é propagada ao longo das rotas; a página registra acesso mesmo antes de interação.

## 9. Funcionalidades e necessidades de implementação futura

### Frontend

- SPA com todas as rotas e guardas explícitas de estado.
- Design system próprio inspirado apenas em padrões genéricos, sem imitação governamental.
- Máscaras/validação de CPF fictício, e-mail e telefone; stepper; carrosséis; chat roteirizado; documentos simulados; QR fictício; responsividade; foco/teclado; redução de movimento.
- Máquina de estados única para evitar a duplicação atual entre `/pagamento`, `/pix-payment`, `/chat` e `/success`.

### Backend simulado

- API local para perfis fictícios, elegibilidade, credores, propostas e transações simuladas.
- Status determinísticos de pagamento (`pending`, `approved`, `expired`, `failed`) acionados por painel/botão de teste, nunca por cobrança real.
- Logging acadêmico mínimo e consentido; não copiar pixels nem coleta invasiva da referência.

### Banco de dados

- Entidades sugeridas: `demo_users`, `eligibility_checks`, `creditors`, `offers`, `simulated_transactions`, `conversation_sessions`, `conversation_events` e `audit_events`.
- Não armazenar CPF real. Usar identificadores fictícios, hash de sessão e política curta de retenção.
- Separar dados de catálogo dos estados por usuário; registrar idempotência de transações e histórico de mudanças de status.

## 10. Segunda revisão e itens inicialmente fáceis de perder

- Alias `/sucess` além de `/success`.
- Rota coringa `/:cpf` e jornada CNH/DETRAN não relacionada.
- Dois fluxos de pagamento anteriores à cobrança de R$ 48,90.
- Segunda cobrança dentro de uma rota chamada “success”.
- Barra fixa inferior e movimento dependente do scroll na landing.
- Áudio de sucesso na verificação; autoplay do carrossel a cada 3 s; mensagens de chat com delays longos.
- Upload de comprovante e verificação manual no chat.
- Coleta de UTM/Meta antes do consentimento e persistência de dados pessoais no `localStorage`.
- Ausência de 404, ausência de limpeza de sessão e estado vazio silencioso em `/verify-availability`.
- Assets remotos e locais, fontes Rawline não listadas no HTML principal e QR/brasões dinâmicos.

Este documento descreve o comportamento observado, inclusive inconsistências e riscos; não valida alegações institucionais, bases legais apresentadas pela página nem autorização sobre marcas de terceiros.
