# Configuração para Deploy no Vercel

Este projeto tem duas partes: **Frontend Next.js** e **Backend Express**. Existem duas formas de fazer deploy no Vercel:

## Opção 1: Deploy do Frontend apenas (Recomendado para começar)

O backend pode ser convertido para API Routes do Next.js ou mantido separado.

### Passos:

1. **Conectar repositório no Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Importe o repositório `VeloProcess/retainedNumber`
   - Configure o **Root Directory** como `frontend`

2. **Configurar variáveis de ambiente no Vercel:**
   ```
   GOOGLE_CLIENT_ID=seu_client_id
   GOOGLE_CLIENT_SECRET=seu_client_secret
   NEXTAUTH_SECRET=sua_chave_secreta
   NEXTAUTH_URL=https://seu-dominio.vercel.app
   GOOGLE_SHEETS_ID=1DifGbdZdT2Nc3gWHzN77B2G2KFP4_ee1Ldg40EBX6XU
   ```

3. **Configurar Google OAuth:**
   - Adicione a URL de callback: `https://seu-dominio.vercel.app/api/auth/callback/google`

4. **Build Settings:**
   - Framework Preset: Next.js
   - Build Command: `npm run build` (ou deixar padrão)
   - Output Directory: `.next` (ou deixar padrão)
   - Install Command: `npm install`

## Opção 2: Monorepo com Backend como Serverless Functions

Para usar o backend Express no Vercel, você precisa convertê-lo para Serverless Functions.

### Estrutura necessária:

```
frontend/
  api/
    backend/
      numbers.js      # Serverless Function
      feedback.js     # Serverless Function
```

### Configuração vercel.json (na raiz):

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/numbers",
      "dest": "/api/backend/numbers"
    },
    {
      "src": "/api/feedback",
      "dest": "/api/backend/feedback"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

## Opção 3: Dois Projetos Separados (Mais Complexo)

1. **Projeto Frontend:**
   - Root Directory: `frontend`
   - Framework: Next.js

2. **Projeto Backend:**
   - Root Directory: `backend`
   - Framework: Other
   - Build Command: (vazio ou `npm install`)
   - Output Directory: (vazio)
   - Dev Command: `npm run dev`

## Variáveis de Ambiente Necessárias

Configure estas variáveis no painel do Vercel:

### Frontend:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (URL do seu deploy, ex: `https://seu-app.vercel.app`)
- `GOOGLE_SHEETS_ID`

### Backend (se separado):
- `GOOGLE_SHEETS_ID`
- `GOOGLE_APPLICATION_CREDENTIALS` (ou usar service-account-key.json)

## Service Account Key

⚠️ **IMPORTANTE**: O arquivo `service-account-key.json` não deve ser commitado no Git.

Para o Vercel, você tem duas opções:

1. **Usar variáveis de ambiente:**
   - Converter o JSON da service account em uma variável de ambiente
   - Criar o arquivo em runtime usando a variável

2. **Usar Google Cloud Secret Manager:**
   - Armazenar as credenciais no Secret Manager
   - Acessar via API no runtime

## Recomendação

Para começar rapidamente, use a **Opção 1** (deploy apenas do frontend) e converta as rotas do backend para API Routes do Next.js dentro do próprio frontend.

