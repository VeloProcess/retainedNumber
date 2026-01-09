# Configuração com Service Account

## ✅ O que foi configurado

O backend agora usa **Service Account** para acessar o Google Sheets, o que simplifica muito a autenticação. O frontend ainda usa OAuth para identificar o usuário que está registrando o feedback.

## Arquivos Criados

- ✅ `backend/service-account-key.json` - Credenciais da Service Account

## ⚠️ IMPORTANTE: Compartilhar Planilha com Service Account

Para que o backend possa acessar a planilha, você precisa compartilhar a planilha Google Sheets com o email da Service Account:

**Email da Service Account:**
```
client-ura@retained-numbers.iam.gserviceaccount.com
```

### Como compartilhar:

1. Abra a planilha: https://docs.google.com/spreadsheets/d/1DifGbdZdT2Nc3gWHzN77B2G2KFP4_ee1Ldg40EBX6XU/edit

2. Clique no botão **"Compartilhar"** (canto superior direito)

3. No campo de email, cole:
   ```
   client-ura@retained-numbers.iam.gserviceaccount.com
   ```

4. Defina a permissão como **"Editor"** (para poder atualizar as células)

5. Clique em **"Enviar"**

6. **IMPORTANTE**: Desmarque a opção "Notificar pessoas" (não é necessário notificar uma Service Account)

## Como Funciona Agora

### Backend (Service Account)
- ✅ Acessa Google Sheets usando Service Account
- ✅ Não precisa de token OAuth do usuário
- ✅ Funciona automaticamente após compartilhar a planilha

### Frontend (OAuth)
- ✅ Usuário faz login com Google (NextAuth)
- ✅ Email do usuário é usado para identificar quem registrou o feedback
- ✅ Não precisa mais passar access_token para o backend

## Testar o Sistema

1. **Certifique-se de que a planilha está compartilhada** com a Service Account

2. **Inicie o backend:**
   ```bash
   cd backend
   npm run dev
   ```

3. **Inicie o frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Acesse:** http://localhost:8090

5. **Faça login com Google** (ainda precisa configurar OAuth no frontend)

## Próximos Passos

Ainda é necessário configurar OAuth no frontend para login do usuário. Veja o arquivo `CONFIGURAR_GOOGLE_OAUTH.md` para instruções.

## Segurança

⚠️ **NUNCA** faça commit do arquivo `service-account-key.json` no Git!

O arquivo já está no `.gitignore`, mas verifique se não foi commitado acidentalmente:

```bash
git check-ignore backend/service-account-key.json
```

Se retornar vazio, o arquivo NÃO está sendo ignorado. Nesse caso, remova do histórico:

```bash
git rm --cached backend/service-account-key.json
git commit -m "Remove service account key from git"
```

