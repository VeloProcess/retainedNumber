# 🔧 Corrigir Erro 500 ao Buscar Números

## ❌ Erro
```
Failed to load resource: the server responded with a status of 500
Erro ao buscar números
```

## 🔍 Possíveis Causas

### 1. Variável `GOOGLE_SERVICE_ACCOUNT_KEY` não configurada no Vercel

**Solução:**
1. No painel do Vercel, vá em **Settings > Environment Variables**
2. Verifique se existe a variável `GOOGLE_SERVICE_ACCOUNT_KEY`
3. Se não existir, adicione:
   - **Nome**: `GOOGLE_SERVICE_ACCOUNT_KEY`
   - **Valor**: Cole o conteúdo completo do arquivo `backend/service-account-key.json`
   - ⚠️ **IMPORTANTE**: Cole em uma linha só, sem quebras de linha

### 2. JSON da Service Account mal formatado

**Como verificar:**
- O valor da variável deve ser um JSON válido
- Deve começar com `{` e terminar com `}`
- Não deve ter quebras de linha (ou se tiver, deve estar escapado como `\n`)

**Solução:**
1. Abra o arquivo `backend/service-account-key.json`
2. Copie TODO o conteúdo
3. Cole em um validador JSON online (ex: jsonlint.com) para verificar se está válido
4. Se estiver válido, cole no Vercel (em uma linha só)

### 3. Service Account sem permissão na planilha

**Solução:**
1. Abra o arquivo `backend/service-account-key.json`
2. Copie o valor do campo `client_email` (ex: `retained-number@projeto.iam.gserviceaccount.com`)
3. Abra a planilha do Google Sheets
4. Clique em **Compartilhar** (botão no canto superior direito)
5. Cole o email da Service Account
6. Dê permissão de **Editor** ou **Visualizador**
7. Clique em **Enviar**

### 4. `GOOGLE_SHEETS_ID` incorreto

**Solução:**
1. No Vercel, verifique se `GOOGLE_SHEETS_ID` está configurado
2. O valor deve ser o ID da planilha (ex: `1DifGbdZdT2Nc3gWHzN77B2G2KFP4_ee1Ldg40EBX6XU`)
3. Você encontra o ID na URL da planilha:
   ```
   https://docs.google.com/spreadsheets/d/{ID_AQUI}/edit
   ```

## ✅ Checklist de Verificação

- [ ] `GOOGLE_SERVICE_ACCOUNT_KEY` está configurada no Vercel
- [ ] O valor é um JSON válido (teste em jsonlint.com)
- [ ] O JSON está em uma linha só (ou com `\n` escapado)
- [ ] O `client_email` da Service Account tem acesso à planilha
- [ ] `GOOGLE_SHEETS_ID` está configurado corretamente
- [ ] Fez um novo deploy após configurar as variáveis

## 🔍 Como Verificar os Logs no Vercel

1. No painel do Vercel, vá em **Deployments**
2. Clique no deployment mais recente
3. Vá na aba **Functions**
4. Clique em `/api/numbers`
5. Veja os logs para identificar o erro específico

Os logs devem mostrar mensagens como:
- `✅ Service Account carregada da variável de ambiente` (sucesso)
- `❌ Erro ao autenticar com Service Account: ...` (erro)

## 💡 Formato Correto da Variável

A variável `GOOGLE_SERVICE_ACCOUNT_KEY` deve ter este formato (tudo em uma linha):

```json
{"type":"service_account","project_id":"seu-projeto","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...@....iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
```

⚠️ **IMPORTANTE**: 
- O `private_key` deve ter `\n` para quebras de linha (não quebras reais)
- Tudo deve estar em uma linha só
- Não adicione espaços extras

## 🚀 Após Corrigir

1. Salve as alterações no Vercel
2. Faça um novo deploy (ou aguarde o redeploy automático)
3. Teste novamente o app

