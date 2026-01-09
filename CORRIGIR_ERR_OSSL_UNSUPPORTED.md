# 🔧 Corrigir Erro ERR_OSSL_UNSUPPORTED

## ❌ Erro
```
Error: error:1E08010C:DECODER routines::unsupported
ERR_OSSL_UNSUPPORTED
```

Este erro acontece quando a chave privada da Service Account está em formato incorreto.

## ✅ Solução

### Opção 1: Corrigir a Variável no Vercel (Recomendado)

1. **Abra o arquivo `backend/service-account-key.json`** no seu computador
2. **Copie TODO o conteúdo** do arquivo
3. **Cole em um validador JSON** (ex: https://jsonlint.com) para garantir que está válido
4. **No Vercel**, vá em **Settings > Environment Variables**
5. **Edite ou adicione** a variável `GOOGLE_SERVICE_ACCOUNT_KEY`
6. **Cole o JSON completo** - mas **IMPORTANTE**:
   - Se você colar com quebras de linha, o Vercel pode não processar corretamente
   - **Melhor opção**: Cole tudo em uma linha só
   - **OU**: Use um formato onde `\n` está escapado corretamente

### Opção 2: Converter para Uma Linha

Se o JSON tem múltiplas linhas, você precisa convertê-lo para uma linha:

**No PowerShell (Windows):**
```powershell
$json = Get-Content -Path "backend\service-account-key.json" -Raw
$jsonOneLine = $json -replace "`r`n", " " -replace "`n", " " -replace "  ", " "
# Agora copie $jsonOneLine e cole no Vercel
```

**No Terminal (Mac/Linux):**
```bash
cat backend/service-account-key.json | tr '\n' ' ' | tr -s ' ' > service-account-one-line.json
```

**Ou use um conversor online:**
1. Cole o JSON em: https://www.freeformatter.com/json-formatter.html
2. Clique em "Minify" ou "Compact"
3. Copie o resultado (uma linha só)
4. Cole no Vercel

### Opção 3: Formato Correto da Chave Privada

A chave privada dentro do JSON deve ter este formato:

```json
"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

⚠️ **IMPORTANTE**: 
- As quebras de linha devem ser `\n` (barra invertida + n)
- **NÃO** devem ser quebras de linha reais dentro da string JSON
- O JSON completo pode ter quebras de linha, mas a string `private_key` dentro dele deve ter `\n` escapado

### Verificação Rápida

Após configurar no Vercel, verifique:

1. ✅ O JSON é válido (teste em jsonlint.com)
2. ✅ A chave privada começa com `-----BEGIN PRIVATE KEY-----`
3. ✅ A chave privada termina com `-----END PRIVATE KEY-----`
4. ✅ Dentro da string `private_key`, as quebras são `\n` (não quebras reais)

### Exemplo de JSON Correto

```json
{"type":"service_account","project_id":"seu-projeto","private_key_id":"abc123","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n","client_email":"seu-app@projeto.iam.gserviceaccount.com","client_id":"123456","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/seu-app%40projeto.iam.gserviceaccount.com"}
```

### Após Corrigir

1. Salve a variável no Vercel
2. Faça um novo deploy (ou aguarde alguns minutos)
3. Teste novamente o app

O código agora tenta corrigir automaticamente problemas comuns de formatação, mas é melhor garantir que está correto desde o início.

