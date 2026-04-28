-- CreateTable
CREATE TABLE "certificados_digitais" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "pfx_dados" BYTEA NOT NULL,
    "senha_criptografada" TEXT NOT NULL,
    "validade" TIMESTAMP(3) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certificados_digitais_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "certificados_digitais_empresa_id_key" ON "certificados_digitais"("empresa_id");

-- AddForeignKey
ALTER TABLE "certificados_digitais" ADD CONSTRAINT "certificados_digitais_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
