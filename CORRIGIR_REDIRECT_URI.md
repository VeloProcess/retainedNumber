# Como Corrigir o Erro: redirect_uri_mismatch

## ⚠️ Problema

O erro `redirect_uri_mismatch` ocorre quando a URL de redirecionamento configurada no Google Cloud Console não corresponde à URL que o NextAuth está usando.

## ✅ Solução

### 1. Verificar a URL que o NextAuth está usando

O NextAuth usa automaticamente:
```
{NEXTAUTH_URL}/api/auth/callback/google
```

Com `NEXTAUTH_URL=http://localhost:8090`, a URL completa é:
```
http://localhost:8090/api/auth/callback/google
```

### 2. Configurar no Google Cloud Console

1. **Acesse:** https://console.cloud.google.com/apis/credentials

2. **Selecione o projeto:** retained-numbers

3. **Clique no OAuth Client ID** que você criou:
   - Client ID: `279146056660-ik6nu0k5t2f7otokkipsuk64qtoauru0.apps.googleusercontent.com`

4. **Na seção "Authorized redirect URIs", adicione EXATAMENTE:**
   ```
   http://localhost:8090/api/auth/callback/google
   ```

5. **IMPORTANTE:** 
   - ✅ Use `http://` (não `https://`)
   - ✅ Use `localhost:8090` (não `127.0.0.1:8090`)
   - ✅ Inclua o caminho completo: `/api/auth/callback/google`
   - ✅ Não adicione barra no final

6. **Clique em "SAVE"**

### 3. Verificar outras URLs necessárias

Também adicione na seção "Authorized JavaScript origins":
```
http://localhost:8090
```

### 4. Aguardar propagação

Após salvar, pode levar alguns segundos para as mudanças serem aplicadas. Aguarde 10-30 segundos.

### 5. Testar novamente

1. Feche completamente o navegador (ou use modo anônimo)
2. Acesse: http://localhost:8090
3. Tente fazer login novamente

## 📋 Checklist de URLs no Google Cloud Console

Certifique-se de que estas URLs estão configuradas:

**Authorized JavaScript origins:**
- ✅ `http://localhost:8090`

**Authorized redirect URIs:**
- ✅ `http://localhost:8090/api/auth/callback/google`

## 🔍 Verificar se está correto

A URL de callback do NextAuth será exibida no console quando você tentar fazer login. Ela deve ser EXATAMENTE:
```
http://localhost:8090/api/auth/callback/google
```

## ⚠️ Erros Comuns

1. **Usar `https://` ao invés de `http://`**
   - ❌ `https://localhost:8090/api/auth/callback/google`
   - ✅ `http://localhost:8090/api/auth/callback/google`

2. **Usar `127.0.0.1` ao invés de `localhost`**
   - ❌ `http://127.0.0.1:8090/api/auth/callback/google`
   - ✅ `http://localhost:8090/api/auth/callback/google`

3. **Adicionar barra no final**
   - ❌ `http://localhost:8090/api/auth/callback/google/`
   - ✅ `http://localhost:8090/api/auth/callback/google`

4. **Porta errada**
   - ❌ `http://localhost:3000/api/auth/callback/google`
   - ✅ `http://localhost:8090/api/auth/callback/google`

## 🚀 Após corrigir

Reinicie o servidor Next.js e tente fazer login novamente!

