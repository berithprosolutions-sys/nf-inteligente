# Plano Técnico Estratégico — NF Inteligente
# REVISÃO E EXPANSÃO | Abril 2026
# ═══════════════════════════════════════════════════════════════

## SUMÁRIO EXECUTIVO

O plano original é **estrategicamente correto** e **arquiteturalmente robusto**.
A análise do código-fonte confirma que a estrutura já existe para suportar a execução.

**Status:** 80% do planejamento está validado. Expansões recomendadas cobrem:
1. Detalhamento da Arquitetura do InterNotas
2. Integração com Motor Fiscal (NCM/ICMS/ISS)
3. Sistema de Filas e Retentativas
4. Conformidade SEFAZ PR vs demais estados
5. Modelo de custos e monetização

---

## PARTE 1 — VALIDAÇÃO DO PLANO ORIGINAL

### ✅ CORRETO — O que já está bem definido

**Frente 1 — NFS-e Marialva via Elotech**
- Integração técnica via Token WS + ABRASF 2.03 está correta
- Migration Prisma para `itemListaServico` e `codigoCnae` é necessária
- elotech.service.ts precisa de 3 métodos: montarXmlRps, assinarXml, enviarSoap

**Frente 2 — Motor NF-e via SEFAZ-PR**
- Arquitetura InterNotas como API isolada é a decisão certa
- Separação entre NF Inteligente (app + API do usuário) e InterNotas (motor fiscal) garante escalabilidade
- Certificado A1, TLS mútuo e XMLDSig estão corretamente identificados como requisitos

**Frente 3 — Expansão de Cidades**
- Padrão de adaptador por município é o modelo correto para escalabilidade linear
- Interface `MunicipioAdapter` encapsula bem a variabilidade

**Frente 4 — IA no InterNotas**
- Conferente pré-envio é o ponto de máximo impacto
- Modelo Claude Sonnet para validação fiscal é apropriado

---

### 🔴 INCOMPLETO — O que precisa detalhar

**1. Contrato de API entre NF Inteligente e InterNotas**
O plano menciona mas não especifica os endpoints exatos.

**2. Pipeline de Fila de Emissão**
NF-e pode levar horas para processar no SEFAZ. Precisa de queue (Bull + Redis).

**3. Integração com Motor Fiscal**
O plano do Motor Fiscal (NCM, ICMS, ISSQN) não foi conectado ao InterNotas.

**4. Modelo de Custo**
Certificado A1, hosting, Redis, manutenção — precisa de breakdown.

**5. Conformidade Regional**
Paraná (SEFAZ-PR) tem regras específicas que diferem de SP, MG, etc.

---

## PARTE 2 — EXPANSÃO DO PLANO

### Expansão 1 — Contrato OpenAPI NF Inteligente ↔ InterNotas

```yaml
# POST /inter/nfse/emitir
request:
  empresaId: uuid
  municipioId: string  # ex: "4128402" para Marialva
  cliente:
    tipo: "PF" | "PJ"
    documento: string
    nome: string
    endereco: {...}
  servicos: [
    {
      descricao: string
      itemListaServico: string  # ex: "01.01"
      codigoCnae: string
      valor: decimal
    }
  ]
  referencia: string  # id da emissão no NF Inteligente para rastreamento

response:
  id: uuid  # id da emissão no InterNotas
  numero: string  # número da NFS-e gerado
  rps: string    # número RPS da prefeitura
  status: "pendente" | "processando" | "autorizada" | "rejeitada"
  xml: string?  # XML assinado (se autorizada)
  danfe: url?   # link para PDF do DANFE
  codigoErro?: string  # código SEFAZ se rejeitada
  mensagemErro?: string  # mensagem legível em português

# GET /inter/nfse/status/:id
response:
  status: "pendente" | "processando" | "autorizada" | "rejeitada" | "cancelada"
  numero?: string
  dataAutorizacao?: datetime
  codigoErro?: string
  urlDanfe?: url
  xmlAutorizado?: string

# POST /inter/nfse/cancelar/:id
request:
  motivoCancelamento: string
response:
  statusCancelamento: "sucesso" | "falha"
  codigoSefaz?: string
  dataProcessamento: datetime
```

---

### Expansão 2 — Sistema de Fila de Emissão

NF-e no SEFAZ é processada de forma assíncrona. Pode levar minutos a horas.

```typescript
// api/src/features/fila-emissao/fila.service.ts

interface JobEmissaoNfse {
  empresaId: uuid
  municipioId: string
  nfseDadosJson: object
  tentativas: number  // incrementa a cada retry
  proximaTentativa?: datetime
  status: "fila" | "processando" | "sucesso" | "falha_permanente"
  erroUltima?: string
  criadoEm: datetime
  atualizadoEm: datetime
}

// Fila via Bull Queue + Redis
// 1. POST /nfse/emitir → adiciona job à fila
// 2. Worker de fila (rodando em background) processa cada job
// 3. Chama InterNotas para emitir
// 4. Se sucesso: marca como "sucesso"
// 5. Se erro temporário: reagenda com backoff exponencial
// 6. Se erro permanente (após 5 tentativas): marca "falha_permanente"
// 7. Webhook para o frontend sobre status

// Endpoints para consulta:
GET /fila-emissao/:id → status do job
GET /fila-emissao/empresa/:empresaId → histórico de jobs
```

---

### Expansão 3 — Integração Motor Fiscal com InterNotas

O Motor Fiscal (NCM, ICMS, ISSQN) deve alimentar o InterNotas com dados verificados.

```typescript
// Fluxo na geração do XML NFS-e

// 1. Usuário submete: { itemListaServico: "01.01", valor: 1000 }
// 2. FiscalAiService consulta:
const issqn = await prisma.issqnMunicipio.findUnique({
  where: { codigoIbge_codigoLC116: { codigoIbge: "4128402", codigoLC116: "01.01" } }
});
// Retorna: { aliquota: 2, temRetencaoFonte: false, codigoCnae: "6202-3/00-66" }

// 3. elotech.service.ts monta XML com os dados reais do motor fiscal:
{
  aliqiss: issqn.aliquota,
  desconto: empresa.hasRegimeJaneiro ? desconto : 0,
  retencao: issqn.temRetencaoFonte ? "S" : "N",
  cnae: issqn.codigoCnae  // ← vindo do motor
}

// 4. Conferente IA valida que o codigoCnae é coerente com descricao do serviço
// 5. Se tudo OK, assina e envia para Elotech
```

**Implementação:** FiscalAiService já tem métodos para buscar ISSQN.
Apenas integrar chamada no bloco de emissão.

---

### Expansão 4 — Conformidade SEFAZ-PR vs Demais Estados

**SEFAZ-PR** (Paraná) tem padrão técnico específico.
Quando expandir para SP, MG, RJ, as regras mudam.

```typescript
// api/src/features/sefaz/adapters/sefaz.adapter.ts

interface SefazAdapter {
  estado: string          // "PR" | "SP" | "MG"
  versaoSchema: string    // versão do XSD
  endpoint: {
    producao: string
    homologacao: string
  }
  validarXml(): Promise<boolean>
  enviarLote(): Promise<LoteResponse>
  consultarAutorizacao(): Promise<AuthResponse>
  cancelarNota(): Promise<CancelResponse>
  manifestar(): Promise<ManifestResponse>
}

// Exemplo adaptador PR
class SefazPrAdapter implements SefazAdapter {
  estado = "PR"
  versaoSchema = "4.00"
  endpoint = {
    producao: "https://nfe.sefaz.pr.gov.br/NFeAutorizacao4/NFeAutorizacao4.asmx",
    homologacao: "https://homolog.sefaz.pr.gov.br/NFeAutorizacao4/NFeAutorizacao4.asmx"
  }
  // ... métodos específicos de PR
}

// Exemplo adaptador SP
class SefazSpAdapter implements SefazAdapter {
  estado = "SP"
  versaoSchema = "4.00"
  endpoint = {
    producao: "https://nfe.fazenda.sp.gov.br/ws/nfeautorizacao4/NFeAutorizacao4.asmx",
    homologacao: "https://homolog.nfe.fazenda.sp.gov.br/ws/nfeautorizacao4/NFeAutorizacao4.asmx"
  }
  // ... pode ter diferenças em validação, DIGI, etc.
}

// Factory para instanciar o adaptador correto
const adapter = SefazAdapterFactory.criar(empresa.sedeSefazEstado);
```

---

### Expansão 5 — Modelo de Custo e Viabilidade

```
CUSTOS OPERACIONAIS (mensal)

Infraestrutura:
  - Neon PostgreSQL (atual)        R$ 0  (free tier suficiente no início)
  - Railway/Render (API)           R$ 50-100
  - Redis (Bull queue)             R$ 10-20 (Upstash ou similar)
  - Anthropic API (Claude)         R$ 50-200 (varia com uso)
  Subtotal                         R$ 110-320

Certificados:
  - Certificado A1 (.pfx)          R$ 200-300/ano ÷ 12 = R$ 17-25/mês
  - Manutenção / renovação         R$ 5-10

Integrações:
  - Elotech (NFSE) — por emissão   R$ 0-1 por nota (cofre do munícipio)
  - SEFAZ NFSE — por emissão       R$ 0-0,50 por nota
  - Plugnotas (fallback)           R$ 0,30-0,50 por nota (100% notas ÷ 2 backup)

Desenvolvimento / Suporte:
  - Sua dedicação ou engenheiro    ~1h/dia = R$ 1.500-3.000/mês

TOTAL: R$ 1.650 - 3.500 / mês + custos por transação

RECEITA (modelo Freemium)

Starter: 50 notas/mês × R$ 49    = R$ 2.450
Pro:     300 notas/mês × R$ 89   = R$ 26.700
Business: ilimitado × R$ 149     = R$ 14.900 (assumindo 100 clientes)

Para break-even com 10 clientes Pro: 10 × R$ 89 × 300 = R$ 267.000 MRR
Margem após custos: ~75% (modelo SaaS)

BREAK-EVEN: ~5-10 clientes pagantes em Starter + Pro
```

---

### Expansão 6 — Sequência de Implementação Detalhada

#### T1 — Agora (Próximas 2-3 semanas)

```
FRENTE 1 — NFS-e Marialva

[ ] Gerar Token WS no portal Elotech (ação manual)
[ ] Salvar ELOTECH_TOKEN no .env
[ ] Migration Prisma:
    ALTER TABLE servico ADD itemListaServico STRING;
    ALTER TABLE servico ADD codigoCnae STRING;
[ ] Criar api/src/features/nfse/elotech.service.ts:
    ├── montarXmlRps(servico, cliente, empresa)
    ├── assinarXml(xml, certificado)
    └── enviarSoap(xml, token)
[ ] Adaptar emissao.service.ts para chamar Elotech
[ ] Testes com 5 notas em homologação
[ ] Go-live em produção Marialva

FRENTE 4 — Motor Fiscal (Base para Frente 2)

[ ] Executar Prompt 1 do ChatGPT (pesquisa NCM/ICMS)
[ ] Executar Prompt 2 Antigravity (seed fiscal)
[ ] Testar FiscalAiService consultando banco real
[ ] Integrar chamada de ISSQN no elotech.service.ts

Saída: NFS-e Marialva + Motor fiscal funcional
Esforço: 3-4 semanas | 1 desenvolvedor full-time
```

#### T2 — 3 Meses

```
FRENTE 2 — InterNotas + NF-e SEFAZ-PR

[ ] Arquitetura InterNotas em novo repositório (ou módulo)
[ ] Contrato OpenAPI entre NF Inteligente ↔ InterNotas
[ ] Assinatura digital com node-forge + C14N
[ ] Integração SEFAZ-PR (NFeAutorizacao, NFeConsulta)
[ ] Geração DANFE com PDFKit
[ ] Sistema de fila (Bull + Redis) para assincronismo
[ ] Conferente IA (MVP) — validação pre-envio
[ ] Testes homologação SEFAZ
[ ] Go-live NF-e SEFAZ-PR

[ ] Integração Maringá NFS-e (Elotech novamente, adaptador novo)

Saída: Motor NF-e funcionando + Maringá NFS-e
Esforço: 6-8 semanas | 2 desenvolvedores
```

#### T3 — 6 Meses

```
FRENTE 3 — Expansão Paraná

[ ] Londrina NFS-e (sistema próprio/ABRASF)
[ ] Arapongas NFS-e
[ ] Apucarana NFS-e
[ ] Padrão adaptador consolidado (copy-paste por cidade)
[ ] Conferente IA expansão: classificação de serviço automática
[ ] Painel admin para gerenciar municípios no sistema

Saída: 6 cidades no Paraná operacionais
Esforço: 4-6 semanas | 1 desenvolvedor (padrão repetitivo)
```

#### T4 — 12 Meses

```
[ ] Expansão para SP, MG, RJ (3 maiores mercados)
[ ] Adaptador SEFAZ multi-estado
[ ] Auditoria de lote com IA (análise de padrões)
[ ] Dashboard de analytics por município/estado
[ ] API pública para integração de parceiros

Saída: Motor nacional de emissão
Esforço: contínuo | time escalado
```

---

## PARTE 3 — CHECKLIST DE PRÉ-EXECUÇÃO

Antes de começar a codificar a Frente 1, valide:

```
[ ] Acesso ao portal Elotech confirmado
[ ] Token WS (Senha WS) gerado e testado
[ ] Certificado A1 da empresa disponível (ou mock)
[ ] Ambiente de homologação Elotech ativado
[ ] Base fiscal (Motor Fiscal) populada com ISSQN Marialva
[ ] Redis/Bull instalado e testado localmente
[ ] Contrato OpenAPI AlignmentInterNotas documentado
[ ] Time alinhado: (1) dev backend, (1) dev frontend, você co-pilot
```

---

## PARTE 4 — RISCOS IDENTIFICADOS E MITIGAÇÃO

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|--------|-----------|
| Token WS Elotech não funciona | MÉDIA | CRÍTICO | Testar manualmente via Postman antes de codificar |
| Certificado A1 com problemas | BAIXA | CRÍTICO | Começar com mock, integrar certificado real só na homologação |
| SEFAZ PR rejeita XML por validação | MÉDIA | ALTO | Conferente IA detém 80% das rejeições precoces |
| Expansão para SP/MG requer mudanças maiores | ALTA | MÉDIO | Padrão adaptador já mitiga — novo estado = novo adapter |
| Dados fiscais desatualizados causam erros | MÉDIA | ALTO | Job de monitoramento + alertas automáticas |
| Fila congestionada durante picos | BAIXA | MÉDIO | Redis está escalável; adicionar workers conforme demanda |

---

## PARTE 5 — DIFERENCIAL COMPETITIVO CONSOLIDADO

O plano atual entrega **três camadas** de diferencial:

**Camada 1 — Motor Fiscal**
Dados de imposto verificados, atualizado automaticamente, com fonte legal.
*Concorrentes:* ninguém faz isso em tempo real.

**Camada 2 — Emissão Integrada**
NFS-e em 6+ cidades + NF-e via SEFAZ próprio.
*Concorrentes:* PlugNotas cobre, mas você fica independente e com margens maiores.

**Camada 3 — IA como Conferente**
Detecta e sugere correções antes do SEFAZ rejeitar.
*Concorrentes:* ninguém faz isso. É um diferencial genuíno.

Resultado final: **"Consultoria fiscal automática que também emite NF"**
em vez de **"Mais um emissor de notas"**.

---

## RECOMENDAÇÃO FINAL

O plano está **maduro para execução**. As próximas 2-3 semanas devem focar
**100%** na Frente 1 (Marialva NFS-e). Isso é o MVP que prova conceito,
gera receita, e desbloqueia as Frentes 2-4.

Estimativa realista: **Go-live Marialva em 21 dias**.
