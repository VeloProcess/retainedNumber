# 🔍 Diagnosticar Erro 500 em /api/numbers no Vercel

## 📋 Passos para Diagnosticar

### 1. Verificar Logs no Vercel

1. Acesse o painel do Vercel: https://vercel.com
2. Vá em **Deployments** > Selecione o deployment mais recente
3. Clique na aba **Functions**
4. Clique em `/api/numbers`
5. Veja os logs para identificar o erro específico

### 2. Verificar Variáveis de Ambiente

No painel do Vercel, vá em **Settings > Environment Variables** e verifique:

#### ✅ Variáveis Obrigatórias:

- **`GOOGLE_SERVICE_ACCOUNT_KEY`** (mais importante!)
  - Deve conter o JSON completo da Service Account
  - Formato: tudo em uma linha, com `\n` escapado na chave privada
  - Exemplo válido: `{"type":"service_account","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n",...}`

- **`GOOGLE_SHEETS_ID`**
  - ID da planilha (ex: `1DifGbdZdT2Nc3gWHzN77B2G2KFP4_ee1Ldg40EBX6XU`)
  - Encontre na URL: `https://docs.google.com/spreadsheets/d/{ID}/edit`

### 3. Verificar Permissões da Planilha

1. Abra o arquivo `backend/service-account-key.json` localmente
2. Copie o valor do campo `client_email` (ex: `retained-number@projeto.iam.gserviceaccount.com`)
3. Abra a planilha do Google Sheets
4. Clique em **Compartilhar** (canto superior direito)
5. Cole o email da Service Account
6. Dê permissão de **Editor**
7. Clique em **Enviar** (sem notificar)

### 4. Testar JSON da Service Account

1. Copie o conteúdo de `backend/service-account-key.json`
2. Cole em um validador JSON online: https://jsonlint.com
3. Se houver erros, corrija antes de colar no Vercel

### 5. Formato Correto da Variável GOOGLE_SERVICE_ACCOUNT_KEY

⚠️ **IMPORTANTE**: A variável deve estar em **uma linha só**:

```json
{"type":"service_account","project_id":"seu-projeto","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\\n-----END PRIVATE KEY-----\\n","client_email":"...@....iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
```

**Pontos importantes:**
- Tudo em uma linha só
- `private_key` deve ter `\\n` (barra invertida + n) para quebras de linha
- Não use quebras de linha reais
- Não adicione espaços extras

### 6. Erros Comuns e Soluções

#### ❌ Erro: "GOOGLE_SERVICE_ACCOUNT_KEY está em formato inválido"
**Causa**: JSON mal formatado ou quebras de linha incorretas
**Solução**: 
- Valide o JSON em jsonlint.com
- Certifique-se de que está tudo em uma linha
- Verifique se `\\n` está escapado corretamente

#### ❌ Erro: "Service Account não tem acesso à planilha"
**Causa**: Planilha não compartilhada com o email da Service Account
**Solução**: 
- Compartilhe a planilha com o `client_email` da Service Account
- Dê permissão de Editor

#### ❌ Erro: "Planilha não encontrada"
**Causa**: `GOOGLE_SHEETS_ID` incorreto ou planilha deletada
**Solução**: 
- Verifique se `GOOGLE_SHEETS_ID` está correto no Vercel
- Verifique se a planilha existe e está acessível

#### ❌ Erro: "Chave privada inválida"
**Causa**: Formatação incorreta da chave privada
**Solução**: 
- Certifique-se de que começa com `-----BEGIN PRIVATE KEY-----`
- Certifique-se de que termina com `-----END PRIVATE KEY-----`
- Use `\\n` para quebras de linha (não quebras reais)

### 7. Após Corrigir

1. **Salve as alterações** no Vercel
2. **Faça um novo deploy** (ou aguarde o redeploy automático)
3. **Teste novamente** a rota `/api/numbers`
4. **Verifique os logs** novamente para confirmar que o erro foi resolvido

### 8. Verificar Resposta da API

Agora a API retorna informações detalhadas sobre o erro. Quando ocorrer um erro 500, a resposta JSON incluirá:

```json
{
  "error": "Erro ao buscar números da planilha",
  "message": "Mensagem do erro específico",
  "type": "Tipo do erro",
  "diagnostic": "Diagnóstico do problema",
  "possibleCauses": ["Causa 1", "Causa 2"],
  "checkSteps": ["Passo 1", "Passo 2"]
}
```

Use essas informações para identificar e corrigir o problema rapidamente.

## 🚀 Checklist Rápido

- [ ] `GOOGLE_SERVICE_ACCOUNT_KEY` configurada no Vercel
- [ ] JSON da Service Account válido (testado em jsonlint.com)
- [ ] Chave privada com `\\n` escapado (não quebras reais)
- [ ] Planilha compartilhada com o `client_email` da Service Account
- [ ] `GOOGLE_SHEETS_ID` correto no Vercel
- [ ] Novo deploy feito após configurar variáveis
- [ ] Logs verificados no Vercel para identificar erro específico

