-- CreateEnum
CREATE TYPE "CategoriaAlerta" AS ENUM ('NF_E', 'ICMS', 'SIMPLES_NACIONAL', 'MEI', 'LEGISLACAO', 'GERAL');

-- CreateTable
CREATE TABLE "alertas_fiscais" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "resumo" TEXT,
    "urlOriginal" TEXT NOT NULL,
    "urlImagem" TEXT,
    "fonte" TEXT,
    "autor" TEXT,
    "categoria" "CategoriaAlerta" NOT NULL DEFAULT 'GERAL',
    "publicadoEm" TIMESTAMP(3),
    "coletadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "relevancia" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "alertas_fiscais_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "alertas_fiscais_urlOriginal_key" ON "alertas_fiscais"("urlOriginal");

-- CreateIndex
CREATE INDEX "alertas_fiscais_coletadoEm_idx" ON "alertas_fiscais"("coletadoEm" DESC);

-- CreateIndex
CREATE INDEX "alertas_fiscais_categoria_idx" ON "alertas_fiscais"("categoria");
