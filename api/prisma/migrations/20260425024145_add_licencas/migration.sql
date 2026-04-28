-- CreateEnum
CREATE TYPE "StatusLicenca" AS ENUM ('TRIAL', 'ATIVA', 'SUSPENSA', 'CANCELADA', 'EXPIRADA');

-- CreateEnum
CREATE TYPE "PlanoLicenca" AS ENUM ('MENSAL', 'ANUAL');

-- AlterTable
ALTER TABLE "empresas" ADD COLUMN     "cnae" TEXT;

-- CreateTable
CREATE TABLE "licencas" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "status" "StatusLicenca" NOT NULL DEFAULT 'TRIAL',
    "plano" "PlanoLicenca",
    "license_key" TEXT,
    "trial_expira_em" TIMESTAMP(3) NOT NULL,
    "assinatura_expira_em" TIMESTAMP(3),
    "asaas_customer_id" TEXT,
    "asaas_subscription_id" TEXT,
    "asaas_event_id_processado" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "licencas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "licencas_empresa_id_key" ON "licencas"("empresa_id");

-- CreateIndex
CREATE UNIQUE INDEX "licencas_license_key_key" ON "licencas"("license_key");

-- AddForeignKey
ALTER TABLE "licencas" ADD CONSTRAINT "licencas_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
