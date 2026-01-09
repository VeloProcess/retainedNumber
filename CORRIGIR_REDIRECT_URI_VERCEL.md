# 🔧 Corrigir Erro redirect_uri_mismatch no Vercel

## ❌ Erro Atual
```
Erro 400: redirect_uri_mismatch
```

## ✅ Solução Rápida

### Passo 1: Adicionar URI Correta no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Vá em **APIs & Services > Credentials**
3. Clique na credencial OAuth 2.0 que você está usando
4. Na seção **"URIs de redirecionamento autorizados"**, adicione:

```
https://retained-number.vercel.app/api/auth/callback/google
```

⚠️ **IMPORTANTE**: 
- A URI deve ser **EXATAMENTE** como acima (com `/api/auth/callback/google` no final)
- Não use apenas `https://retained-number.vercel.app/` (sem o caminho completo)
- Certifique-se de que não há espaços ou caracteres extras

### Passo 2: Verificar Variável de Ambiente no Vercel

1. No painel do Vercel, vá em **Settings > Environment Variables**
2. Verifique se `NEXTAUTH_URL` está configurado como:
   ```
   https://retained-number.vercel.app
   ```
   (Sem a barra `/` no final e sem o caminho `/api/auth/callback/google`)

### Passo 3: Aguardar e Testar

1. Após adicionar a URI no Google Cloud Console, aguarde alguns segundos
2. Tente fazer login novamente no app
3. Se ainda não funcionar, faça um novo deploy no Vercel (ou aguarde alguns minutos)

## 📋 Checklist

- [ ] URI `https://retained-number.vercel.app/api/auth/callback/google` adicionada no Google Cloud Console
- [ ] `NEXTAUTH_URL` configurado como `https://retained-number.vercel.app` no Vercel
- [ ] Aguardou alguns segundos após adicionar a URI
- [ ] Tentou fazer login novamente

## 🔍 Verificação

A URI de callback do NextAuth é sempre:
```
{NEXTAUTH_URL}/api/auth/callback/google
```

Então se `NEXTAUTH_URL = https://retained-number.vercel.app`, a URI completa será:
```
https://retained-number.vercel.app/api/auth/callback/google
```

Esta URI **DEVE** estar na lista de "URIs de redirecionamento autorizados" no Google Cloud Console.

## 💡 Dica

Se você tiver múltiplos ambientes (desenvolvimento e produção), adicione ambas as URIs:
- `http://localhost:8090/api/auth/callback/google` (para desenvolvimento)
- `https://retained-number.vercel.app/api/auth/callback/google` (para produção)

