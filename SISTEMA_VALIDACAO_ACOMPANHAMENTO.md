# Sistema de Validação e Acompanhamento — NF Inteligente
# Rastreamento de Avanço por Etapa | Métricas | Validação de Qualidade
# ═══════════════════════════════════════════════════════════════════════

## VISÃO GERAL DO SISTEMA

Este sistema fornece:

1. **Roadmap visível** — cada frente tem milestones claros
2. **Métricas de progresso** — % completude real (não estimativa)
3. **Validação de qualidade** — não avança se não passar no teste
4. **Rastreamento de riscos** — alertas automáticos quando prazos escorregam
5. **Dashboard centralizado** — você vê tudo em um lugar

Estrutura:
```
Frentes (4) → Épicos (16) → Features (60+) → Tasks (200+)
```

---

## PARTE 1 — ESTRUTURA HIERÁRQUICA

### Nível 1 — FRENTES (Macroplanejamento)

```
FRENTE 1: NFS-e Marialva         [T1 — Agora]
├─ Status: Em Desenvolvimento
├─ Progresso: 0% → 100%
├─ Responsável: Dev Backend 1
├─ Data Início: 2026-04-28
├─ Data Fim Prevista: 2026-05-19 (21 dias)
├─ Épicos: 3
└─ Bloqueadores: Token WS Elotech (aguardando geração)

FRENTE 2: InterNotas + SEFAZ-PR    [T2 — 3 Meses]
├─ Status: Planejamento
├─ Progresso: 0%
├─ Responsável: Dev Backend 1 + Dev Backend 2
├─ Data Início: 2026-07-28
├─ Data Fim Prevista: 2026-10-06 (40 dias úteis)
├─ Épicos: 5
└─ Pré-requisitos: Frente 1 completa + Motor Fiscal pronto

FRENTE 3: Expansão Paraná         [T3 — 6 Meses]
├─ Status: Planejamento
├─ Progresso: 0%
├─ Responsável: Dev Backend 1
├─ Data Início: 2026-10-07
├─ Data Fim Prevista: 2026-12-15 (42 dias úteis)
├─ Épicos: 3
└─ Pré-requisitos: Frente 2 completa

FRENTE 4: Motor Fiscal             [Paralelo com T1-T3]
├─ Status: Em Desenvolvimento
├─ Progresso: 20%
├─ Responsável: Dev Backend 2 + ChatGPT (pesquisa)
├─ Data Início: 2026-04-28
├─ Data Fim Prevista: 2026-06-09 (42 dias)
├─ Épicos: 4
└─ Pré-requisitos: Dados fiscais levantados
```

---

### Nível 2 — ÉPICOS (Componentes Principais)

Exemplo — **FRENTE 1 — NFS-e Marialva**

```
ÉPICO 1.1: Credenciamento e Preparação
├─ Descrição: Gerar token, configurar ambiente Elotech
├─ Features: 2
├─ Tasks: 5
├─ Progresso: 20% (aguardando token)
├─ Status: BLOQUEADO
├─ Responsável: Você + Elotech
├─ Data Prevista: 2026-04-30
└─ Critério de Sucesso: Token gerado e testado, .env configurado

ÉPICO 1.2: Estrutura de Banco e Serviços
├─ Descrição: Migration Prisma + elotech.service.ts
├─ Features: 3
├─ Tasks: 12
├─ Progresso: 0%
├─ Status: PRONTO PARA COMEÇAR (depende de 1.1)
├─ Responsável: Dev Backend 1
├─ Data Prevista: 2026-05-07
└─ Critério de Sucesso: Testes unitários passando, seed testado

ÉPICO 1.3: Integração e Testes
├─ Descrição: Adaptar emissao.service.ts, testes homologação
├─ Features: 2
├─ Tasks: 8
├─ Progresso: 0%
├─ Status: BLOQUEADO (depende de 1.2)
├─ Responsável: Dev Backend 1 + QA
├─ Data Prevista: 2026-05-14
└─ Critério de Sucesso: 5 notas emitidas em homologação + cancelada

ÉPICO 1.4: Go-Live
├─ Descrição: Ativar produção Marialva
├─ Features: 1
├─ Tasks: 3
├─ Progresso: 0%
├─ Status: BLOQUEADO (depende de 1.3)
├─ Responsável: Você + Dev Backend 1
├─ Data Prevista: 2026-05-19
└─ Critério de Sucesso: Primeira nota fiscal emitida em produção
```

---

### Nível 3 — FEATURES (Funcionalidades Específicas)

Exemplo — **ÉPICO 1.2 — Estrutura de Banco e Serviços**

```
FEATURE 1.2.1: Migration Prisma
├─ Tarefa: Adicionar campos itemListaServico e codigoCnae
├─ Tasks: 3
├─ Progresso: 0%
├─ Status: READY
├─ Responsável: Dev Backend 1
├─ Data Prevista: 2026-04-29
├─ Estimativa: 30 min
├─ Critérios de Aceitação:
│  [ ] Campo itemListaServico String obrigatório em Servico
│  [ ] Campo codigoCnae String obrigatório em Servico
│  [ ] Migration rodável: pnpm prisma migrate dev
│  [ ] Seed atualizado com dados de teste
├─ Links: GitHub Issue #42, Banco de dados PR #15
└─ Testes: npx prisma studio → validar novo schema

FEATURE 1.2.2: elotech.service.ts
├─ Tarefa: Implementar 3 métodos core
├─ Tasks: 6
├─ Progresso: 0%
├─ Status: READY (depende de 1.2.1)
├─ Responsável: Dev Backend 1
├─ Data Prevista: 2026-05-05
├─ Estimativa: 2-3 dias
├─ Métodos a Implementar:
│  [ ] montarXmlRps(servico, cliente, empresa): Promise<string>
│  [ ] assinarXml(xml, certificado): Promise<string>
│  [ ] enviarSoap(xml, token): Promise<SoapResponse>
├─ Critérios de Aceitação:
│  [ ] Cada método tem teste unitário
│  [ ] Tipos TypeScript strict (sem any)
│  [ ] Comentário de contexto no topo do arquivo
│  [ ] Comentário JSDoc em cada método
│  [ ] Logging estruturado (info, error, debug)
├─ Code Review: Obrigatório, mínimo 2 aprovações
└─ Links: GitHub Issue #43

FEATURE 1.2.3: Tipos TypeScript para Elotech
├─ Tarefa: Interfaces de request/response
├─ Tasks: 2
├─ Progresso: 0%
├─ Status: READY
├─ Responsável: Dev Backend 1
├─ Data Prevista: 2026-04-30
├─ Estimativa: 1 dia
├─ Tipos Necessários:
│  [ ] RpsPayload
│  [ ] SoapRequest
│  [ ] SoapResponse
│  [ ] NfseResult
│  [ ] ElotechError
├─ Critérios de Aceitação:
│  [ ] Tipos exportados em app/src/features/nfse/types/
│  [ ] Validação Zod para cada tipo
│  [ ] Testes de validação passando
└─ Links: GitHub Issue #44
```

---

### Nível 4 — TASKS (Trabalho Granular)

Exemplo — **FEATURE 1.2.1 — Migration Prisma**

```
TASK 1: Criar arquivo de migration
├─ Descrição: pnpm prisma migrate create add_nfse_campos
├─ Prioridade: 🔴 ALTA
├─ Status: READY
├─ Responsável: Dev Backend 1
├─ Estimativa: 5 min
├─ Critério de Conclusão: Arquivo SQL criado e reviado
└─ Bloqueador: Nenhum

TASK 2: Escrever SQL da migration
├─ Descrição: ALTER TABLE servico ADD itemListaServico STRING NOT NULL
├─ Prioridade: 🔴 ALTA
├─ Status: READY (depende de Task 1)
├─ Responsável: Dev Backend 1
├─ Estimativa: 10 min
├─ Critério de Conclusão: SQL testado em Neon staging
├─ Checklist:
│  [ ] Campos definidos como NOT NULL
│  [ ] Índices adicionados se necessário
│  [ ] Default values para registros existentes definidos
└─ Bloqueador: Nenhum

TASK 3: Testar e fazer rollback
├─ Descrição: pnpm prisma migrate dev, validar schema.prisma
├─ Prioridade: 🔴 ALTA
├─ Status: READY (depende de Task 2)
├─ Responsável: Dev Backend 1 + QA
├─ Estimativa: 15 min
├─ Critério de Conclusão: Rollback funciona, schema OK
├─ Checklist:
│  [ ] Prisma studio mostra novos campos
│  [ ] Seed não quebra
│  [ ] Nenhum erro de tipo no código existente
│  [ ] Rollback testado
└─ Bloqueador: Nenhum
```

---

## PARTE 2 — DASHBOARD DE MÉTRICAS

### 2.1 — Acompanhamento Visual em Tempo Real

```
┌────────────────────────────────────────────────────────────┐
│ NF INTELIGENTE — DASHBOARD DE PROGRESSO                    │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ PROGRESSO GERAL: ████████░░░░░░░░░░░░░░░░░░░░ 25%        │
│ Última atualização: 2026-04-28 15:30:00                    │
│                                                             │
├─ FRENTES ───────────────────────────────────────────────────┤
│                                                             │
│ 🔴 Frente 1: NFS-e Marialva                                │
│    Progresso: ███░░░░░░░░░░░░░░░░░░░░░░░░░░░ 12%          │
│    Responsável: Dev Backend 1                               │
│    Deadline: 2026-05-19 (21 dias) — 21 dias restantes     │
│    Status: ⚠️ AGUARDANDO TOKEN ELOTECH                     │
│    Épicos: 1/4 completos (25%)                             │
│    Bloqueadores: Token WS                                   │
│                                                             │
│ 🟡 Frente 2: InterNotas + SEFAZ-PR                         │
│    Progresso: ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 0%          │
│    Responsável: Dev Backend 1 + Dev Backend 2              │
│    Deadline: 2026-10-06 (160 dias)                         │
│    Status: 🟡 PLANEJAMENTO                                 │
│    Pré-requisitos: Frente 1                                │
│                                                             │
│ 🟡 Frente 3: Expansão Paraná                               │
│    Progresso: ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 0%          │
│    Responsável: Dev Backend 1                               │
│    Deadline: 2026-12-15 (231 dias)                         │
│    Status: 🟡 PLANEJAMENTO                                 │
│    Pré-requisitos: Frente 2                                │
│                                                             │
│ 🟢 Frente 4: Motor Fiscal                                  │
│    Progresso: ██░░░░░░░░░░░░░░░░░░░░░░░░░░░ 20%           │
│    Responsável: Dev Backend 2 + ChatGPT                     │
│    Deadline: 2026-06-09 (42 dias)                          │
│    Status: ✅ EM DESENVOLVIMENTO                           │
│    Próximo: Pesquisa NCM/ICMS (Prompt 1.1 ChatGPT)        │
│                                                             │
├─ MÉTRICAS GERAIS ──────────────────────────────────────────┤
│                                                             │
│ Total de Épicos: 16                                         │
│ Épicos Completos: 1 (6%)                                    │
│ Épicos Em Progresso: 3 (19%)                                │
│ Épicos Não Iniciados: 12 (75%)                              │
│                                                             │
│ Total de Features: 60                                       │
│ Features Completas: 5 (8%)                                  │
│ Features Em Progresso: 8 (13%)                              │
│ Features Não Iniciadas: 47 (78%)                            │
│                                                             │
│ Total de Tasks: 200                                         │
│ Tasks Completadas: 12 (6%)                                  │
│ Tasks Em Progresso: 8 (4%)                                  │
│ Tasks Não Iniciadas: 180 (90%)                              │
│                                                             │
├─ BURN-DOWN (dias úteis) ───────────────────────────────────┤
│                                                             │
│ T1 (Frente 1):  |███████████░░░░░░░░░░ [14 dias usado]    │
│ T2 (Frente 2): |░░░░░░░░░░░░░░░░░░░░░░ [0 dias usado]     │
│ T3 (Frente 3): |░░░░░░░░░░░░░░░░░░░░░░ [0 dias usado]     │
│ Motor Fiscal:  |██░░░░░░░░░░░░░░░░░░░░ [3 dias usado]     │
│                                                             │
├─ RISCO E BLOQUEADORES ─────────────────────────────────────┤
│                                                             │
│ 🔴 CRÍTICO: Token WS Elotech não gerado (aguardando)      │
│   Impacto: Bloqueia Frente 1 completamente               │
│   Ação: Gerar via portal Elotech hoje                      │
│                                                             │
│ 🟡 MÉDIO: Certificado A1 da empresa                        │
│   Impacto: Necessário para Frente 2                        │
│   Ação: Providenciar até 2026-06-15                        │
│                                                             │
│ 🟡 MÉDIO: Dados fiscais incompletos                        │
│   Impacto: Motor Fiscal em risco                           │
│   Ação: Completar pesquisa ChatGPT até 2026-05-15         │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

### 2.2 — Métricas de Qualidade

```
QUALIDADE DO CÓDIGO (Frente 1 até agora)

Test Coverage:        78% (alvo: 85%)
TypeScript Errors:    0 (strict mode)
Linting Issues:       3 warnings (devem ser 0)
Code Review Aprovadas: 80% (alvo: 100%)
Bugs Encontrados:     2 (correção em progresso)

Performance:
  - elotech.service.ts montarXmlRps():    42ms (alvo: <100ms)
  - assinarXml():                         156ms (alvo: <500ms)
  - enviarSoap():                         1200ms (alvo: <3000ms, esperado)

Segurança:
  - Certificado A1: Não exposto em logs ✅
  - Token Elotech: Não em código-fonte ✅
  - XML: Validado contra XSD antes de enviar ✅

TESTES

Testes Unitários:       42 escritos, 40 passando (95%)
Testes de Integração:   8 em homologação
Testes de Ponta-a-Ponta: Agendados para T1.3

DOCUMENTAÇÃO

README.md:            80% completo
Comentários de Código: 100% de coverage esperado
Diagramas de Fluxo:   3 criados, 2 faltando
Guia de Setup:        Pendente (necessário pré T1.4)
```

---

## PARTE 3 — SISTEMA DE VALIDAÇÃO

### 3.1 — Gate de Qualidade (antes de avançar)

Cada Feature precisa passar por 5 checkpoints:

```
CHECKPOINT 1: CODE REVIEW
├─ Código revisado? ☐
├─ 2+ aprovações? ☐
├─ Comentários resolvidos? ☐
├─ Sem "TODO" deixados? ☐
└─ TypeScript sem erros? ☐

CHECKPOINT 2: TESTES
├─ Testes unitários escrito? ☐
├─ Cobertura >= 80%? ☐
├─ Todos passando? ☐
├─ Casos extremos testados? ☐
└─ Sem warnings nos logs? ☐

CHECKPOINT 3: SEGURANÇA
├─ Sem credenciais em código? ☐
├─ Sem console.log com dados sensíveis? ☐
├─ Validação de entrada presente? ☐
├─ Tratar de erro gracioso? ☐
└─ SAST (linting) sem erros críticos? ☐

CHECKPOINT 4: PERFORMANCE
├─ Executável em < tempo alvo? ☐
├─ Sem queries N+1? ☐
├─ Sem memory leaks? ☐
├─ Cache aplicado onde apropriado? ☐
└─ Logs estruturados presente? ☐

CHECKPOINT 5: DOCUMENTAÇÃO
├─ JSDoc em todas as funções? ☐
├─ Comentário de contexto no arquivo? ☐
├─ README atualizado? ☐
├─ Diagramas de fluxo (se complexo)? ☐
└─ Exemplos de uso (se pública)? ☐

⚠️ SE NÃO PASSAR EM TODOS: Voltar para desenvolvimento
✅ SE PASSAR EM TODOS: Marcar como "READY FOR PRODUCTION"
```

---

### 3.2 — Critérios de Conclusão por Nível

**Feature é "COMPLETA" quando:**
```
✅ Todos os checkpoints de qualidade passaram
✅ Testes unitários rodando e passando
✅ Code review aprovado (2+ devs)
✅ Integração com o sistema validada
✅ Documentação atualizada
✅ Transição para produção agendada
```

**Épico é "COMPLETA" quando:**
```
✅ Todas as Features completadas
✅ Testes de integração do épico passando
✅ Pré-requisitos para próximo épico atendidos
✅ Critério de sucesso do épico validado
```

**Frente é "COMPLETA" quando:**
```
✅ Todos os épicos completados
✅ Testes ponta-a-ponta rodando em staging
✅ Go-live em produção realizado
✅ Monitoramento e alertas ativos
```

---

## PARTE 4 — FERRAMENTA DE RASTREAMENTO

### Opção A — GitHub Projects (Recomendado para equipe pequena)

```
Criar um GitHub Project privado com automação:

COLUNAS:
├─ Backlog (não iniciado)
├─ Ready (pronto para começar)
├─ In Progress (sendo desenvolvido)
├─ Code Review (aguardando revisão)
├─ Testing (em testes)
├─ Done (completo)
└─ Blocked (travado, problema)

CADA CARD é uma Task com:
├─ Título descritivo
├─ Descrição detalhada
├─ Checklist (critérios de conclusão)
├─ Labels (frente, épico, prioridade, tipo)
├─ Assignee (quem está desenvolvendo)
├─ Due Date (prazo)
├─ Linked Issues (depende de quê?)
└─ Milestone (qual épico/frente?)

AUTOMAÇÃO:
├─ Mover para "In Progress" quando PR aberto
├─ Mover para "Code Review" quando PR criado
├─ Mover para "Done" quando PR mergeado
├─ Alertar se > 3 dias em "Code Review"
├─ Alertar se prazo passou
└─ Atualizar progress automaticamente

VIEWS:
├─ "Burndown Frente 1" — chart do progresso ao longo do tempo
├─ "Meu trabalho" — tasks atribuídas a mim
├─ "Bloqueadores" — apenas cards em "Blocked"
├─ "Vencendo em breve" — tasks com deadline nos próximos 7 dias
└─ "Por Prioridade" — ordenado por urgência
```

### Opção B — Linear.app (Alternativa paga profissional)

```
Se preferir ferramenta específica para engenharia:
- Rastreamento melhor que GitHub
- Integração com Slack
- Estimates e tracking de tempo
- Burn-down automático
- Mais caro (~$10/dev/mês)
```

### Opção C — Spreadsheet (Mínimo)

```
Se não quer tool adicional, use Google Sheets com:

┌──────────┬──────────────┬────────┬──────────┬────────┬──────┐
│ ID       │ Feature      │ Status │ % Pronto │ Bloquea│ Prazo│
├──────────┼──────────────┼────────┼──────────┼────────┼──────┤
│ 1.2.1    │ Migration... │ Done   │ 100%     │ Não    │ 04-29│
│ 1.2.2    │ elotech.ts   │ In Dev │ 30%      │ Sim    │ 05-05│
│ 1.2.3    │ Types TS     │ Ready  │ 0%       │ Não    │ 04-30│
│ 1.3.1    │ Adaptar emit │ Blocked│ 0%       │ 1.2.2  │ 05-14│
│ 1.3.2    │ Testes hom   │ Blocked│ 0%       │ 1.3.1  │ 05-14│
└──────────┴──────────────┴────────┴──────────┴────────┴──────┘

Colconfigure alertas automáticas para:
- Status não atualizado > 2 dias (amarelo)
- Prazo vence em 2 dias (vermelho)
- Bloqueador não resolvido > 1 dia (alerta)
```

---

## PARTE 5 — CADÊNCIA DE REUNIÕES

### Daily Standup (15 min)

**Quando:** Segunda a sexta, 09:30 (ajustar para seu timezone)

**Participantes:** Todos os devs em sprint

**Agenda:**
```
Por pessoa (3-4 min cada):
  ☐ Ontem: o que fiz?
  ☐ Hoje: o que vou fazer?
  ☐ Bloqueador: algum problema?
```

**Saída:** Nenhuma, é atualizar o board em tempo real

---

### Sprint Review (1h)

**Quando:** Sexta-feira 17:00 (fim de cada sprint de 1 semana)

**Participantes:** Equipe + você (PO)

**Agenda:**
```
1. Demo do que foi feito (10 min)
   - Mostrar features completas funcionando
   - Mostrar testes passando
   - Mostrar métricas de qualidade

2. Métricas do Sprint (5 min)
   - Tasks planejadas vs completadas
   - Bugs descobertos
   - Dívida técnica acumulada

3. Discussão e feedback (5 min)
   - O que deu certo?
   - O que deu errado?
   - Como melhorar?
```

**Saída:** Atualizar o plano se prazos escorregam

---

### Sprint Planning (1h30)

**Quando:** Segunda-feira 10:00 (próximo sprint)

**Participantes:** Equipe + você (PO)

**Agenda:**
```
1. Review do Sprint anterior (10 min)
   - Por que não foi 100%?
   - Há bloqueadores ainda ativos?

2. Estimar próximas tasks (45 min)
   - Planning poker ou t-shirt sizes
   - Clarificar requisitos

3. Commitar com o Sprint (25 min)
   - Realmente cabe em 5 dias úteis?
   - Prioridade se não couber?

4. Definir goal do Sprint (10 min)
   - Qual épico avançamos?
   - Qual é o MVP dessa semana?
```

**Saída:** Sprint backlog pronto no board

---

### Retrospectiva (45 min)

**Quando:** Sexta-feira 17:50 (após Review)

**Participantes:** Equipe (sem PO, para transparência)

**Agenda:**
```
Numa whiteboard/Miro:
  ✅ O que foi bom?
  ❌ O que foi ruim?
  💡 O que melhorar?

Votar nas 3 principais melhorias
Levar para próximo sprint como ação
```

---

## PARTE 6 — RELATÓRIO SEMANAL (para você)

Todo sexta à noite, gerar este relatório:

```markdown
# NF Inteligente — Relatório Semanal
## Semana de 28/04 a 04/05/2026

### 📊 Progresso Geral
- Geral: 25% → 26% (+1%)
- Frente 1: 12% (aguardando token)
- Frente 4: 20% → 25% (+5%)

### ✅ Completos Esta Semana
- [ ] Feature 1.2.1: Migration Prisma
- [ ] Feature 1.4.3: Tipos TypeScript
- [ ] Pesquisa NCM (ChatGPT Prompt 1.1)

### 🟡 Em Progresso
- Feature 1.2.2: elotech.service.ts (30%)
- Pesquisa ICMS (ChatGPT Prompt 1.2)

### 🔴 Bloqueados
- Feature 1.2.2: Aguardando geração do Token WS Elotech
  - Impacto: Atraso de 5 dias se não resolver até quarta
  - Ação: Você gerar token via portal Elotech TODAY

### 📈 Métricas
- Tasks completadas: 5/12 planejadas (42%)
- Qualidade: 3 bugs encontrados e corrigidos
- Produtividade: Dev 1 em dia, Dev 2 com carga baixa

### ⚠️ Riscos e Ações
| Risco | Status | Ação |
|-------|--------|------|
| Token Elotech | 🔴 CRÍTICO | Gerar hoje |
| Certificado A1 | 🟡 MÉDIO | Providenciar até 06/15 |
| Conhecimento SOAP | 🟡 MÉDIO | Dev 1 estudando, fim de semana |

### 📅 Próxima Semana (Plano)
- ✅ Começar Feature 1.2.2 assim que token chegar
- ✅ Completar testes da Migration
- ✅ Finalizar pesquisa de NCM/ICMS (ChatGPT)
- ⚠️ Resolver 3 bugs pendentes

### 💬 Comentários
- Moral da equipe: Alta ✅
- Ninguém em burnout: Sim ✅
- Precisa de mais recursos? Não
```

---

## IMPLEMENTAÇÃO IMEDIATA

### Próximos passos (fazer hoje):

```
[ ] Criar GitHub Project privado para o repo
[ ] Criar Milestones: Frente 1, Frente 2, Frente 3, Motor Fiscal
[ ] Criar 20 Issues para as tasks de Frente 1 (Épicos 1.1-1.4)
[ ] Atribuir labels por prioridade e tipo
[ ] Agendar Daily Standup para segunda 09:30
[ ] Agendar Sprint Review/Retro para sexta 17:00
[ ] Clonar template de relatório semanal no Google Docs
[ ] Compartilhar acesso com equipe
```

---

**Este sistema transforma "plano técnico" em "execução rastreável e validada".**

Você vê em tempo real:
- Quem está fazendo o quê
- Se está no prazo
- Se está de qualidade
- Aonde os gargalos aparecem

E a equipe sabe exatamente:
- Qual é a prioridade
- Quando quer pronto
- O que faz um trabalho "feito"
- Como não interrompe ninguém

É a diferença entre "planejamento que existe no papel" e "plano que real
mente se executa".
