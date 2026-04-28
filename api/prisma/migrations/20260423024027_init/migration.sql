-- CreateEnum
CREATE TYPE "RegimeTributario" AS ENUM ('SimplesNacional', 'LucroPresumido', 'LucroReal', 'MEI');

-- CreateEnum
CREATE TYPE "PlanoAssinatura" AS ENUM ('starter', 'pro', 'business');

-- CreateEnum
CREATE TYPE "TipoCliente" AS ENUM ('PF', 'PJ');

-- CreateEnum
CREATE TYPE "TipoNota" AS ENUM ('NFe', 'NFSe');

-- CreateEnum
CREATE TYPE "StatusNota" AS ENUM ('rascunho', 'validando', 'transmitindo', 'autorizada', 'rejeitada', 'cancelada', 'denegada', 'emProcessamento');

-- CreateEnum
CREATE TYPE "OrigemMercadoria" AS ENUM ('CODIGO_0', 'CODIGO_1', 'CODIGO_2', 'CODIGO_3', 'CODIGO_4', 'CODIGO_5', 'CODIGO_6', 'CODIGO_7', 'CODIGO_8');

-- CreateEnum
CREATE TYPE "TipoBeneficio" AS ENUM ('reducaoBase', 'isencao', 'diferimento', 'credito');

-- CreateEnum
CREATE TYPE "NivelConfiancaIA" AS ENUM ('confirmado', 'provavel', 'requerRevisao');

-- CreateEnum
CREATE TYPE "TipoAudit" AS ENUM ('create', 'update', 'delete', 'emitir', 'cancelar');

-- CreateEnum
CREATE TYPE "RoleUsuario" AS ENUM ('admin', 'operador', 'visualizador', 'OWNER');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "RoleUsuario" NOT NULL DEFAULT 'visualizador',
    "empresa_id" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ultimo_acesso" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresas" (
    "id" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "razao_social" TEXT NOT NULL,
    "nome_fantasia" TEXT,
    "regime_tributario" "RegimeTributario" NOT NULL,
    "uf" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "codigo_municipio" TEXT,
    "inscricao_estadual" TEXT,
    "inscricao_municipal" TEXT,
    "endereco_completo" JSONB,
    "plano" "PlanoAssinatura" NOT NULL DEFAULT 'starter',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "tipo" "TipoCliente" NOT NULL,
    "documento" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "municipio_id" TEXT,
    "uf" TEXT,
    "endereco_completo" JSONB NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produtos" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "ncm" TEXT,
    "ncm_confirmado" BOOLEAN NOT NULL DEFAULT false,
    "cest" TEXT,
    "unidade" TEXT NOT NULL,
    "valor_unitario" DECIMAL(65,30) NOT NULL,
    "origem_mercadoria" "OrigemMercadoria" NOT NULL DEFAULT 'CODIGO_0',
    "aliquota_ipi" DECIMAL(65,30),
    "fonte_legal" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicos" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "codigo_lc116" TEXT,
    "lc116_confirmado" BOOLEAN NOT NULL DEFAULT false,
    "aliquota_issqn" DECIMAL(65,30),
    "valor_padrao" DECIMAL(65,30),
    "unidade" TEXT NOT NULL DEFAULT 'UN',
    "municipio_id" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),

    CONSTRAINT "servicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notas_fiscais" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "tipo" "TipoNota" NOT NULL,
    "numero" TEXT,
    "serie" TEXT,
    "chave_acesso" TEXT,
    "status" "StatusNota" NOT NULL DEFAULT 'rascunho',
    "natureza_operacao" TEXT NOT NULL,
    "valor_total" DECIMAL(65,30) NOT NULL,
    "valor_desconto" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "xml_autorizado" TEXT,
    "danfe_url" TEXT,
    "simulada" BOOLEAN NOT NULL DEFAULT true,
    "motivo_cancelamento" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),

    CONSTRAINT "notas_fiscais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itens_nota_fiscal" (
    "id" TEXT NOT NULL,
    "nota_fiscal_id" TEXT NOT NULL,
    "produto_id" TEXT,
    "servico_id" TEXT,
    "descricao" TEXT NOT NULL,
    "quantidade" DECIMAL(65,30) NOT NULL,
    "valor_unitario" DECIMAL(65,30) NOT NULL,
    "valor_total" DECIMAL(65,30) NOT NULL,
    "ncm" TEXT,
    "cfop" TEXT,
    "impostos" JSONB NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),

    CONSTRAINT "itens_nota_fiscal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ncms" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "aliquota_ipi" DECIMAL(65,30) NOT NULL,
    "unidade_tributavel" TEXT NOT NULL,
    "fonte_legal" TEXT NOT NULL,
    "valido_desde" TIMESTAMP(3) NOT NULL,
    "valido_ate" TIMESTAMP(3),
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ncms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "icms_regras" (
    "id" TEXT NOT NULL,
    "ncm_id" TEXT NOT NULL,
    "uf_origem" TEXT NOT NULL,
    "uf_destino" TEXT NOT NULL,
    "aliquota" DECIMAL(65,30) NOT NULL,
    "tem_beneficio" BOOLEAN NOT NULL DEFAULT false,
    "tipo_operacao" TEXT NOT NULL,
    "fonte_legal" TEXT NOT NULL,
    "valido_desde" TIMESTAMP(3) NOT NULL,
    "valido_ate" TIMESTAMP(3),
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "icms_regras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beneficios_fiscais" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "TipoBeneficio" NOT NULL,
    "ncm_ids" TEXT[],
    "uf_aplicavel" TEXT NOT NULL,
    "condicoes" JSONB NOT NULL,
    "fonte_legal" TEXT NOT NULL,
    "url_fonte_oficial" TEXT,
    "valido_desde" TIMESTAMP(3) NOT NULL,
    "valido_ate" TIMESTAMP(3),
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "beneficios_fiscais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "municipios_fiscais" (
    "id" TEXT NOT NULL,
    "codigo_ibge" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "aliquota_iss" DECIMAL(65,30) NOT NULL,
    "tem_retencao_iss" BOOLEAN NOT NULL DEFAULT false,
    "codigo_servico_prefeitura" TEXT,
    "webservice_url" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "municipios_fiscais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultas_fiscais_ia" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "pergunta" TEXT NOT NULL,
    "resposta" TEXT NOT NULL,
    "fontes_utilizadas" JSONB NOT NULL,
    "confianca" "NivelConfiancaIA" NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consultas_fiscais_ia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "usuario_id" TEXT,
    "entidade" TEXT NOT NULL,
    "entidade_id" TEXT NOT NULL,
    "acao" "TipoAudit" NOT NULL,
    "dados_antes" JSONB,
    "dados_depois" JSONB,
    "ip" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_empresa_id_idx" ON "usuarios"("empresa_id");

-- CreateIndex
CREATE INDEX "usuarios_email_idx" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_cnpj_key" ON "empresas"("cnpj");

-- CreateIndex
CREATE INDEX "empresas_cnpj_idx" ON "empresas"("cnpj");

-- CreateIndex
CREATE INDEX "clientes_empresa_id_idx" ON "clientes"("empresa_id");

-- CreateIndex
CREATE INDEX "clientes_documento_idx" ON "clientes"("documento");

-- CreateIndex
CREATE INDEX "produtos_empresa_id_idx" ON "produtos"("empresa_id");

-- CreateIndex
CREATE INDEX "produtos_ncm_idx" ON "produtos"("ncm");

-- CreateIndex
CREATE INDEX "servicos_empresa_id_idx" ON "servicos"("empresa_id");

-- CreateIndex
CREATE INDEX "servicos_codigo_lc116_idx" ON "servicos"("codigo_lc116");

-- CreateIndex
CREATE INDEX "notas_fiscais_empresa_id_idx" ON "notas_fiscais"("empresa_id");

-- CreateIndex
CREATE INDEX "notas_fiscais_cliente_id_idx" ON "notas_fiscais"("cliente_id");

-- CreateIndex
CREATE INDEX "notas_fiscais_status_idx" ON "notas_fiscais"("status");

-- CreateIndex
CREATE INDEX "notas_fiscais_tipo_idx" ON "notas_fiscais"("tipo");

-- CreateIndex
CREATE INDEX "notas_fiscais_chave_acesso_idx" ON "notas_fiscais"("chave_acesso");

-- CreateIndex
CREATE INDEX "itens_nota_fiscal_nota_fiscal_id_idx" ON "itens_nota_fiscal"("nota_fiscal_id");

-- CreateIndex
CREATE INDEX "itens_nota_fiscal_produto_id_idx" ON "itens_nota_fiscal"("produto_id");

-- CreateIndex
CREATE INDEX "itens_nota_fiscal_servico_id_idx" ON "itens_nota_fiscal"("servico_id");

-- CreateIndex
CREATE UNIQUE INDEX "ncms_codigo_key" ON "ncms"("codigo");

-- CreateIndex
CREATE INDEX "ncms_codigo_idx" ON "ncms"("codigo");

-- CreateIndex
CREATE INDEX "icms_regras_ncm_id_idx" ON "icms_regras"("ncm_id");

-- CreateIndex
CREATE INDEX "icms_regras_uf_origem_uf_destino_idx" ON "icms_regras"("uf_origem", "uf_destino");

-- CreateIndex
CREATE INDEX "beneficios_fiscais_uf_aplicavel_idx" ON "beneficios_fiscais"("uf_aplicavel");

-- CreateIndex
CREATE UNIQUE INDEX "municipios_fiscais_codigo_ibge_key" ON "municipios_fiscais"("codigo_ibge");

-- CreateIndex
CREATE INDEX "municipios_fiscais_codigo_ibge_idx" ON "municipios_fiscais"("codigo_ibge");

-- CreateIndex
CREATE INDEX "consultas_fiscais_ia_empresa_id_idx" ON "consultas_fiscais_ia"("empresa_id");

-- CreateIndex
CREATE INDEX "audit_logs_empresa_id_idx" ON "audit_logs"("empresa_id");

-- CreateIndex
CREATE INDEX "audit_logs_usuario_id_idx" ON "audit_logs"("usuario_id");

-- CreateIndex
CREATE INDEX "audit_logs_entidade_entidade_id_idx" ON "audit_logs"("entidade", "entidade_id");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicos" ADD CONSTRAINT "servicos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notas_fiscais" ADD CONSTRAINT "notas_fiscais_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notas_fiscais" ADD CONSTRAINT "notas_fiscais_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_nota_fiscal" ADD CONSTRAINT "itens_nota_fiscal_nota_fiscal_id_fkey" FOREIGN KEY ("nota_fiscal_id") REFERENCES "notas_fiscais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_nota_fiscal" ADD CONSTRAINT "itens_nota_fiscal_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produtos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_nota_fiscal" ADD CONSTRAINT "itens_nota_fiscal_servico_id_fkey" FOREIGN KEY ("servico_id") REFERENCES "servicos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "icms_regras" ADD CONSTRAINT "icms_regras_ncm_id_fkey" FOREIGN KEY ("ncm_id") REFERENCES "ncms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas_fiscais_ia" ADD CONSTRAINT "consultas_fiscais_ia_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
