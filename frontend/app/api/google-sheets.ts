import { google } from 'googleapis'
import fs from 'fs'
import path from 'path'

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID || '1DifGbdZdT2Nc3gWHzN77B2G2KFP4_ee1Ldg40EBX6XU'

// Função para autenticar usando Service Account
export async function getGoogleSheetsClient() {
  try {
    // Tentar usar Service Account Key de variável de ambiente (Vercel)
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
    
    let credentials
    if (serviceAccountKey) {
      // Se estiver em variável de ambiente (JSON string)
      try {
        credentials = JSON.parse(serviceAccountKey)
        
        // Corrigir quebras de linha na chave privada se necessário
        if (credentials.private_key) {
          // Se a chave privada tem quebras de linha reais, substituir por \n
          // Isso acontece quando o JSON é copiado com quebras de linha
          credentials.private_key = credentials.private_key.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
          
          // Garantir que tenha o formato correto com \n escapado
          // Se já está correto, não fazer nada
          if (!credentials.private_key.includes('\\n')) {
            // Se não tem \n escapado, verificar se tem quebras reais
            // Se sim, está ok (Node.js aceita quebras reais também)
            // Mas vamos garantir o formato padrão
            if (credentials.private_key.includes('\n')) {
              // Já tem quebras reais, está ok
            }
          }
        }
        
        console.log('✅ Service Account carregada da variável de ambiente')
      } catch (parseError: any) {
        console.error('❌ Erro ao fazer parse do GOOGLE_SERVICE_ACCOUNT_KEY:', parseError.message)
        throw new Error(`GOOGLE_SERVICE_ACCOUNT_KEY está em formato inválido. Deve ser um JSON válido.`)
      }
    } else {
      // Tentar usar arquivo local (desenvolvimento)
      console.log('Tentando carregar Service Account do arquivo local...')
      const keyPath = path.join(process.cwd(), '..', 'backend', 'service-account-key.json')
      console.log(`Caminho do arquivo: ${keyPath}`)
      
      if (!fs.existsSync(keyPath)) {
        throw new Error(`Arquivo de Service Account não encontrado: ${keyPath}. Configure GOOGLE_SERVICE_ACCOUNT_KEY como variável de ambiente no Vercel.`)
      }
      
      const keyFile = fs.readFileSync(keyPath, 'utf8')
      credentials = JSON.parse(keyFile)
      console.log('✅ Service Account carregada do arquivo local')
    }
    
    // Validar se credentials tem os campos necessários
    if (!credentials.client_email || !credentials.private_key) {
      throw new Error('Service Account inválida: faltam campos client_email ou private_key')
    }
    
    // Corrigir formatação da chave privada
    // O problema comum é que quando colado no Vercel, as quebras de linha podem estar incorretas
    if (credentials.private_key) {
      // Remover espaços extras no início/fim
      credentials.private_key = credentials.private_key.trim()
      
      // Se a chave tem \\n (escapado duplo), converter para \n simples
      if (credentials.private_key.includes('\\\\n')) {
        credentials.private_key = credentials.private_key.replace(/\\\\n/g, '\n')
      }
      
      // Se tem \n escapado (string literal), converter para quebra real
      if (credentials.private_key.includes('\\n') && !credentials.private_key.includes('\n')) {
        credentials.private_key = credentials.private_key.replace(/\\n/g, '\n')
      }
      
      // Garantir que começa e termina corretamente
      if (!credentials.private_key.startsWith('-----BEGIN PRIVATE KEY-----')) {
        throw new Error('Chave privada inválida: deve começar com "-----BEGIN PRIVATE KEY-----"')
      }
      if (!credentials.private_key.endsWith('-----END PRIVATE KEY-----')) {
        throw new Error('Chave privada inválida: deve terminar com "-----END PRIVATE KEY-----"')
      }
    }
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })
    
    console.log('✅ Service Account autenticada com sucesso')
    return google.sheets({ version: 'v4', auth })
  } catch (error: any) {
    console.error('❌ Erro ao autenticar com Service Account:', error.message)
    console.error('Stack:', error.stack)
    throw new Error(`Falha na autenticação com Google Sheets: ${error.message}`)
  }
}

export { SPREADSHEET_ID }

