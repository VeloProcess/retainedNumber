# Guia de Instalação - Sistema de Números Fora Do Horário

## Pré-requisitos

- Node.js 18+ instalado
- Conta Google com acesso à planilha
- Credenciais OAuth 2.0 do Google Cloud Console

## Passo a Passo

### 1. Instalar Dependências

```bash
npm run install:all
```

### 2. Configurar Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a **Google Sheets API**:
   - Vá em "APIs & Services" > "Library"
   - Procure por "Google Sheets API"
   - Clique em "Enable"
4. Crie credenciais OAuth 2.0:
   - Vá em "APIs & Services" > "Credentials"
   - Clique em "Create Credentials" > "OAuth client ID"
   - Escolha "Web application"
   - Adicione URL de redirecionamento autorizado:
     ```
     http://localhost:8090/api/auth/callback/google
     ```
   - Copie o **Client ID** e **Client Secret**

### 3. Configurar Variáveis de Ambiente

#### Backend (.env na raiz do projeto)

Crie um arquivo `.env` na pasta `backend/`:

```env
GOOGLE_SHEETS_ID=1DifGbdZdT2Nc3gWHzN77B2G2KFP4_ee1Ldg40EBX6XU
```

#### Frontend (.env.local)

Crie um arquivo `.env.local` na pasta `frontend/`:

```env
GOOGLE_CLIENT_ID=seu_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
NEXTAUTH_URL=http://localhost:8090
NEXTAUTH_SECRET=sua_chave_secreta_aqui
```

**Para gerar NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Compartilhar Planilha

Certifique-se de que a planilha Google Sheets está compartilhada com:
- O e-mail da conta de serviço do Google Cloud (se usar service account)
- OU com os usuários que farão login (se usar OAuth)

### 5. Executar o Sistema

```bash
npm run dev
```

Isso iniciará:
- **Backend**: http://localhost:9080
- **Frontend**: http://localhost:8090

### 6. Acessar o Sistema

1. Abra o navegador em `http://localhost:8090`
2. Faça login com sua conta Google
3. O sistema carregará os números pendentes da planilha

## Estrutura da Planilha

A planilha deve ter as seguintes colunas (na primeira linha):

- Chamada
- Data
- Hora
- País
- DDD
- Numero (coluna F - obrigatória)
- Cpf/Cnpj
- Id Ligação
- Status (atualizada pelo sistema)
- Quem registrou (atualizada pelo sistema)
- Timestamp (atualizada pelo sistema)

## Troubleshooting

### Erro de autenticação
- Verifique se as credenciais OAuth estão corretas
- Confirme que a URL de redirecionamento está configurada corretamente
- Verifique se o Google Sheets API está habilitado

### Erro ao ler planilha
- Verifique se a planilha está compartilhada com o usuário logado
- Confirme que o ID da planilha está correto
- Verifique se as colunas estão nomeadas corretamente

### Erro ao atualizar planilha
- Verifique se o usuário tem permissão de edição na planilha
- Confirme que as colunas Status, Quem registrou e Timestamp existem

