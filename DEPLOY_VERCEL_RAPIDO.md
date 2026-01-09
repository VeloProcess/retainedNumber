# 🚀 Deploy Rápido no Vercel

## ✅ Tudo Pronto!

O projeto já está configurado para deploy no Vercel. As rotas do backend foram convertidas para API Routes do Next.js.

## Passo a Passo Simples

### 1. Conectar Repositório no Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"Add New Project"**
3. Importe o repositório: `VeloProcess/retainedNumber`
4. Configure:
   - **Root Directory**: `frontend` ⚠️ **IMPORTANTE!**
   - **Framework Preset**: Next.js (deve detectar automaticamente)
   - Deixe os outros campos como padrão

### 2. Configurar Variáveis de Ambiente

No painel do Vercel, vá em **Settings > Environment Variables** e adicione:

```
GOOGLE_CLIENT_ID=seu_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
NEXTAUTH_SECRET=sua_chave_secreta_aqui
NEXTAUTH_URL=https://seu-app.vercel.app
GOOGLE_SHEETS_ID=1DifGbdZdT2Nc3gWHzN77B2G2KFP4_ee1Ldg40EBX6XU
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

⚠️ **IMPORTANTE**: 
- Para `GOOGLE_SERVICE_ACCOUNT_KEY`: Abra o arquivo `backend/service-account-key.json`, copie TODO o conteúdo e cole como valor da variável (em uma linha só, sem quebras)
- Para `NEXTAUTH_URL`: Use a URL que o Vercel gerar após o primeiro deploy (ex: `https://retained-number.vercel.app`)
- Você pode atualizar depois se necessário

### 3. Configurar Google OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Vá em **APIs & Services > Credentials**
3. Edite suas credenciais OAuth 2.0
4. Adicione a URL de redirecionamento:
   ```
   https://seu-app.vercel.app/api/auth/callback/google
   ```
   (Substitua pela URL real do seu app)

### 4. Fazer Deploy

1. Clique em **Deploy** no Vercel
2. Aguarde o build completar (deve funcionar sem erros)
3. Copie a URL gerada (ex: `https://retained-number.vercel.app`)
4. Atualize a variável `NEXTAUTH_URL` com essa URL
5. Atualize o Google OAuth com a URL de callback correta
6. Faça um novo deploy (ou aguarde o redeploy automático)

## ✅ Pronto!

Após seguir esses passos, seu app estará no ar! 🎉

## Estrutura do Projeto

- ✅ Frontend Next.js em `frontend/`
- ✅ API Routes do Next.js em `frontend/app/api/`:
  - `/api/auth/[...nextauth]` - Autenticação Google
  - `/api/numbers` - Buscar números da planilha
  - `/api/feedback` - Registrar feedback

## Problemas Comuns

### Build falha
- ✅ Verifique se o **Root Directory** está como `frontend`
- ✅ Verifique se todas as variáveis de ambiente estão configuradas
- ✅ Verifique se `GOOGLE_SERVICE_ACCOUNT_KEY` está em formato JSON válido (uma linha)

### Erro de autenticação
- ✅ Verifique se `NEXTAUTH_URL` está correto (com https://)
- ✅ Verifique se a URL de callback no Google OAuth está correta

### Erro ao acessar Google Sheets
- ✅ Verifique se `GOOGLE_SHEETS_ID` está correto
- ✅ Verifique se a Service Account tem permissão na planilha
- ✅ Verifique se `GOOGLE_SERVICE_ACCOUNT_KEY` está completo e correto

### Erro "Service Account não encontrado"
- ✅ Certifique-se de que `GOOGLE_SERVICE_ACCOUNT_KEY` está configurada no Vercel
- ✅ O valor deve ser o JSON completo do arquivo `service-account-key.json` em uma linha
