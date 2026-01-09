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
          // Normalizar quebras de linha: converter todas as variações para \n real
          // Isso trata casos onde o JSON foi colado com diferentes formatos
          credentials.private_key = credentials.private_key
            .replace(/\\r\\n/g, '\n')  // \r\n escapado
            .replace(/\\n/g, '\n')     // \n escapado (mais comum no Vercel)
            .replace(/\r\n/g, '\n')   // \r\n real
            .replace(/\r/g, '\n')      // \r sozinho
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
      
      // Normalizar quebras de linha: converter todas as variações para \n real
      // Isso trata casos onde o JSON foi colado com diferentes formatos
      credentials.private_key = credentials.private_key
        .replace(/\\\\n/g, '\n')      // \\n (duplo escape) -> \n real
        .replace(/\\r\\n/g, '\n')     // \r\n escapado -> \n real
        .replace(/\\n/g, '\n')        // \n escapado -> \n real (mais comum)
        .replace(/\r\n/g, '\n')       // \r\n real -> \n
        .replace(/\r/g, '\n')         // \r sozinho -> \n
      
      // Garantir que começa e termina corretamente
      if (!credentials.private_key.startsWith('-----BEGIN PRIVATE KEY-----')) {
        throw new Error('Chave privada inválida: deve começar com "-----BEGIN PRIVATE KEY-----"')
      }
      if (!credentials.private_key.endsWith('-----END PRIVATE KEY-----')) {
        throw new Error('Chave privada inválida: deve terminar com "-----END PRIVATE KEY-----"')
      }
      
      // Log para debug (sem mostrar a chave completa)
      console.log(`Chave privada formatada: ${credentials.private_key.substring(0, 50)}...`)
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
    
    // Diagnóstico mais detalhado
    let errorMessage = error.message || 'Erro desconhecido'
    
    // Verificar se é erro de parse JSON
    if (error.message?.includes('JSON') || error.message?.includes('parse')) {
      errorMessage = `Erro ao fazer parse do GOOGLE_SERVICE_ACCOUNT_KEY. Verifique se o JSON está válido. Erro: ${error.message}`
    }
    
    // Verificar se é erro de arquivo não encontrado
    if (error.message?.includes('não encontrado') || error.message?.includes('not found')) {
      errorMessage = `Arquivo de Service Account não encontrado. Configure GOOGLE_SERVICE_ACCOUNT_KEY como variável de ambiente no Vercel. Erro: ${error.message}`
    }
    
    // Verificar se é erro de chave privada inválida
    if (error.message?.includes('private_key') || error.message?.includes('PRIVATE KEY')) {
      errorMessage = `Chave privada da Service Account inválida. Verifique se as quebras de linha estão escapadas como \\n. Erro: ${error.message}`
    }
    
    // Verificar se é erro de campos faltando
    if (error.message?.includes('client_email') || error.message?.includes('private_key')) {
      errorMessage = `Service Account inválida: faltam campos obrigatórios. Verifique se o JSON está completo. Erro: ${error.message}`
    }
    
    throw new Error(`Falha na autenticação com Google Sheets: ${errorMessage}`)
  }
}

export { SPREADSHEET_ID }

