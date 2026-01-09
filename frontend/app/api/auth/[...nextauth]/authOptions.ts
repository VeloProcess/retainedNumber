import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

// Validar variáveis de ambiente
const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
const nextAuthSecret = process.env.NEXTAUTH_SECRET
const nextAuthUrl = process.env.NEXTAUTH_URL || 'http://localhost:8090'

// Validações com mensagens claras
if (!googleClientId || googleClientId === 'seu_client_id_aqui' || (googleClientId && googleClientId.trim() === '')) {
  console.error('❌ ERRO: GOOGLE_CLIENT_ID não configurado!')
  console.error('   Edite o arquivo frontend/.env.local e configure:')
  console.error('   GOOGLE_CLIENT_ID=seu_client_id_do_google_cloud')
  console.error('   Veja o arquivo CONFIGURAR_GOOGLE_OAUTH.md para instruções detalhadas')
}

if (!googleClientSecret || googleClientSecret === 'seu_client_secret_aqui' || (googleClientSecret && googleClientSecret.trim() === '')) {
  console.error('❌ ERRO: GOOGLE_CLIENT_SECRET não configurado!')
  console.error('   Edite o arquivo frontend/.env.local e configure:')
  console.error('   GOOGLE_CLIENT_SECRET=seu_client_secret_do_google_cloud')
  console.error('   Veja o arquivo CONFIGURAR_GOOGLE_OAUTH.md para instruções detalhadas')
}

if (!nextAuthSecret || nextAuthSecret.includes('substitua') || (nextAuthSecret && nextAuthSecret.trim() === '')) {
  console.error('❌ ERRO: NEXTAUTH_SECRET não configurado!')
  console.error('   Edite o arquivo frontend/.env.local e configure:')
  console.error('   NEXTAUTH_SECRET=qualquer_string_aleatoria_segura')
  console.error('   Gere uma chave com: openssl rand -base64 32')
  console.error('   Ou use o valor gerado anteriormente: bcLoxOqrD4CSVJ2yIB9jGmYZnHRQTi7K')
}

if (!googleClientId || !googleClientSecret) {
  throw new Error('Variáveis de ambiente do Google OAuth não configuradas. Veja os erros acima.')
}

export const authOptions: NextAuthOptions = {
  secret: nextAuthSecret,
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // Persistir access_token quando o usuário faz login
      if (account?.access_token) {
        token.accessToken = account.access_token
      }
      // Manter o access_token no token
      return token
    },
    async session({ session, token }) {
      // Passar access_token para a sessão
      if (token.accessToken) {
        session.accessToken = token.accessToken as string
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/',
  },
}

