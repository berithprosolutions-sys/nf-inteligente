# NF Inteligente

App mobile de emissão fiscal (NF-e / NF-Se) com React + Capacitor + API Node.js.

---

## Stack

| Camada      | Tecnologia                              |
|-------------|-----------------------------------------|
| Frontend    | React 18 + TypeScript + Vite + Wouter   |
| Mobile      | Capacitor (Android/iOS)                 |
| Backend     | Node.js + Fastify + Prisma              |
| Banco       | PostgreSQL 16 (Docker)                  |
| Auth        | JWT (API pura — sem Firebase Auth)      |
| Estado      | Zustand + persist                       |

---

## Setup Rápido

### 1. Backend (API + Banco)

```bash
# Subir PostgreSQL via Docker
docker compose up -d

# Instalar dependências da API
cd api && npm install

# Aplicar migrations e popular banco
npx prisma migrate deploy
pnpm db:seed

# Rodar a API
pnpm dev
# API disponível em http://localhost:3001
```

### 2. Frontend

```bash
cd app

# Copiar e preencher variáveis de ambiente
cp .env.example .env
# Edite o .env com VITE_API_URL apontando para a API

# Instalar dependências
npm install

# Rodar em modo web
npm run dev
```

---

## Desenvolvimento Mobile (Android)

Para testar no device Android físico ou emulador, a API não pode estar em `localhost`
porque `localhost` dentro do device aponta para o próprio device, não para sua máquina.

### Passo 1 — Descobrir o IP local da sua máquina

**Linux/macOS:**
```bash
ip addr show | grep "inet " | grep -v 127.0.0.1
# ou
hostname -I | awk '{print $1}'
```

**Windows:**
```cmd
ipconfig | findstr "IPv4"
```

O IP será algo como `192.168.1.100` ou `192.168.0.x`.

### Passo 2 — Configurar o .env do app

```env
# app/.env
VITE_API_URL="http://192.168.1.100:3001"   # ← seu IP local
```

### Passo 3 — Garantir que a API aceita conexões externas

No `api/.env` ou ao rodar:
```bash
# A API deve escutar em 0.0.0.0, não apenas 127.0.0.1
HOST=0.0.0.0 pnpm dev
```

### Passo 4 — Build e sync para Android

```bash
cd app
npm run build
npx cap sync android
npx cap run android
```

> **Nota:** O `capacitor.config.ts` já tem `cleartext: true` para permitir HTTP local.
> Remova essa flag antes de publicar na Play Store (use HTTPS em produção).

---

## Variáveis de Ambiente

### `api/.env`

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nfinteligente"
JWT_SECRET="sua-chave-secreta-forte"
JWT_REFRESH_SECRET="outra-chave-secreta-forte"
PORT=3001
```

### `app/.env`

```env
VITE_API_URL="http://localhost:3001"
VITE_USE_MOCK="false"

# Firebase (apenas se ainda em uso para algum módulo)
VITE_FIREBASE_API_KEY=""
VITE_FIREBASE_PROJECT_ID=""
# ... demais campos do .env.example
```

---

## Credenciais de Desenvolvimento (após seed)

| Campo | Valor              |
|-------|--------------------|
| Email | dev@berith.com.br  |
| Senha | senha123           |

---

## Fluxo de Teste End-to-End

```
[ ] docker compose up -d
[ ] cd api && pnpm dev           → API na porta 3001
[ ] pnpm db:seed                 → banco populado com NCMs, ICMS e municípios
[ ] cd app && VITE_API_URL=http://<SEU_IP>:3001 npm run build
[ ] npx cap sync && npx cap run android

Fluxo 1 — Cadastro + NF-e:
  Criar conta → Cadastrar produto → Cadastrar cliente → Emitir NF-e → DANFE

Fluxo 2 — Consultor IA:
  Fiscal → digitar NCM 84713019 → retorna IPI 0%, ICMS 18% SP→SP

Fluxo 3 — Certificado:
  Config → Certificado → Upload .pfx → status com vencimento
```
