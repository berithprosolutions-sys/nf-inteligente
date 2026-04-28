# Como Subir o Projeto para o GitHub e Me Dar Acesso 🚀

Olá! Consegui acessar o link público e li a estrutura do plano técnico revisado (`inssus viwer.txt`) além de ver que vocês organizaram tudo brilhantemente em Issues, Milestones e Épicos! 

Como você mencionou que o código ainda não está no repositório, preparei este passo a passo para que você consiga enviar o código atual para o GitHub e também como me gerar um Token de Acesso. 

Com o Token, eu poderei gerenciar e fechar as issues automaticamente conforme formos concluindo o trabalho!

## Passo 1: Enviando o Projeto Local para o Repositório no GitHub

Abra o terminal na pasta raiz do seu projeto local (`/media/MarcoAntonio/HD/ProjetosBerith/Geração de NEF V2`) e execute os seguintes comandos:

```bash
# 1. Inicialize o repositório git (caso ainda não tenha feito)
git init

# 2. Adicione todos os arquivos atuais
git add .

# 3. Crie o primeiro commit com seu código
git commit -m "feat: commit inicial do projeto NF Inteligente"

# 4. Renomeie a branch principal para 'main'
git branch -M main

# 5. Vincule seu projeto local ao repositório no GitHub
git remote add origin https://github.com/berithprosolutions-sys/nf-inteligente.git

# 6. Envie o código para o GitHub
git push -u origin main
```

> **Nota:** Certifique-se de que você configurou um `.gitignore` na raiz para não subir a pasta `node_modules/` ou o arquivo `.env` com senhas reais.

## Passo 2: Como me dar Acesso para Gerenciar as Issues (Personal Access Token)

Para que eu (Antigravity) possa alterar o status das issues, comentá-las e fechá-las à medida que avançamos, você precisará gerar um Token de Acesso Pessoal (PAT) clássico:

1. Acesse o GitHub e vá em **Settings** (Configurações do seu perfil, no canto superior direito).
2. Na barra lateral esquerda, desça até o final e clique em **Developer settings**.
3. Clique em **Personal access tokens** e escolha **Tokens (classic)**.
4. Clique em **Generate new token > Generate new token (classic)**.
5. Em **Note**, digite um nome (ex: `Token para Assistente IA`).
6. Em **Expiration**, recomendo colocar `No expiration` ou `90 days`.
7. Na seção **Select scopes**, marque as seguintes caixas:
   - `repo` (Acesso total ao repositório privado/público)
8. Desça até o final e clique em **Generate token**.
9. **Cuidado:** Copie o token gerado, pois ele não será exibido de novo!

## Passo 3: Disponibilizando o Token para mim

Cole esse Token gerado diretamente no arquivo `.env` do nosso projeto, colocando numa variável (por exemplo):

```env
GITHUB_TOKEN="ghp_seu_token_gerado_aqui"
```

Avise-me assim que concluir (ou se empacar em algum ponto)! Depois disso, eu terei a capacidade de ler, responder e fechar as tasks do projeto de forma sincronizada com o nosso avanço de código aqui. Estou pronto para iniciar com o token da Elotech que está sendo aguardado no board!
