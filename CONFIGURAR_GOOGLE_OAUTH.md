# Como Configurar Google OAuth para NextAuth

## ⚠️ IMPORTANTE

Você precisa criar credenciais **OAuth 2.0** no Google Cloud Console, não uma Service Account.

## Passo a Passo

### 1. Acessar Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Selecione o projeto: **retained-numbers** (ou crie um novo)

### 2. Habilitar APIs Necessárias

1. Vá em **APIs & Services** > **Library**
2. Procure e habilite:
   - ✅ **Google Sheets API**
   - ✅ **Google+ API** (para OAuth)

### 3. Criar Credenciais OAuth 2.0

1. Vá em **APIs & Services** > **Credentials**
2. Clique em **+ CREATE CREDENTIALS** > **OAuth client ID**
3. Se for a primeira vez, configure a tela de consentimento OAuth:
   - **User Type**: External
   - **App name**: Sistema de Números Fora Do Horário
   - **Support email**: seu email
   - **Developer contact**: seu email
   - Clique em **Save and Continue**
   - Adicione seu email em **Test users** (se necessário)
   - Clique em **Save and Continue**

4. Configure o OAuth Client:
   - **Application type**: Web application
   - **Name**: Sistema Retained Numbers
   - **Authorized JavaScript origins**:
     ```
     http://localhost:8090
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:8090/api/auth/callback/google
     ```
   - Clique em **CREATE**

5. **Copie as credenciais**:
   - **Client ID** (algo como: `123456789-abc...apps.googleusercontent.com`)
   - **Client Secret** (algo como: `GOCSPX-abc...`)

### 4. Configurar arquivo .env.local

Edite o arquivo `frontend/.env.local` e substitua:

```env
GOOGLE_CLIENT_ID=cole_aqui_o_client_id_copiado
GOOGLE_CLIENT_SECRET=cole_aqui_o_client_secret_copiado
NEXTAUTH_URL=http://localhost:8090
NEXTAUTH_SECRET=cole_aqui_uma_chave_secreta_aleatoria
```

### 5. Gerar NEXTAUTH_SECRET

Execute no PowerShell:

```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

Ou use OpenSSL (se instalado):

```bash
openssl rand -base64 32
```

### 6. Reiniciar o servidor

Após configurar, reinicie o servidor Next.js:

```bash
npm run dev
```

## Diferença entre Service Account e OAuth

- **Service Account**: Usado para acesso servidor-servidor (backend acessando Google Sheets diretamente)
- **OAuth 2.0**: Usado para autenticação de usuários (usuário fazendo login com Google)

Para este sistema, você precisa de **ambos**:
- OAuth 2.0 para o NextAuth (frontend)
- Service Account pode ser usado no backend (opcional, já temos OAuth)

## Verificação

Após configurar, ao acessar `http://localhost:8090`, você deve conseguir:
1. Ver o botão "Entrar com Google"
2. Clicar e ser redirecionado para login do Google
3. Após login, ver a lista de números

Se ainda houver erros, verifique:
- ✅ Credenciais OAuth criadas (não Service Account)
- ✅ URLs de redirecionamento configuradas corretamente
- ✅ APIs habilitadas no Google Cloud Console
- ✅ Variáveis no `.env.local` sem espaços extras

