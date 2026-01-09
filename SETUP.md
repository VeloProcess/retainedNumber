# Configuração Completa do Projeto

## ✅ Dependências Instaladas

### Frontend
- Next.js ^14.2.0
- React ^18.2.0
- NextAuth ^4.24.5
- Axios ^1.6.2
- Tailwind CSS ^3.3.0
- TypeScript ^5

### Backend
- Express ^4.18.2
- Google APIs ^128.0.0
- CORS ^2.8.5
- dotenv ^16.3.1

### Ferramentas Globais
- ✅ Vercel CLI 50.1.6 (instalado)
- ⚠️ Git (verificar instalação)

## Configuração do Git

Se o Git não estiver instalado, execute:

```powershell
winget install --id Git.Git -e --source winget
```

Ou baixe em: https://git-scm.com/download/win

## Configuração do Projeto

### 1. Variáveis de Ambiente

#### Backend (.env)
Crie `backend/.env`:
```env
GOOGLE_SHEETS_ID=1DifGbdZdT2Nc3gWHzN77B2G2KFP4_ee1Ldg40EBX6XU
```

#### Frontend (.env.local)
Crie `frontend/.env.local`:
```env
GOOGLE_CLIENT_ID=seu_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
NEXTAUTH_URL=http://localhost:8090
NEXTAUTH_SECRET=sua_chave_secreta_aqui
```

### 2. Inicializar Git (se necessário)

```bash
git init
git add .
git commit -m "Initial commit"
```

### 3. Deploy na Vercel (opcional)

```bash
vercel login
vercel
```

## Executar o Sistema

```bash
npm run dev
```

Isso iniciará:
- Backend: http://localhost:9080
- Frontend: http://localhost:8090

## Estrutura de Arquivos Ignorados (.gitignore)

- `node_modules/` - Dependências npm
- `.env*` - Arquivos de ambiente
- `.next/` - Build do Next.js
- `*.md` - Arquivos Markdown (conforme solicitado)
- `*.log` - Arquivos de log
- `dist/`, `build/` - Pastas de build

