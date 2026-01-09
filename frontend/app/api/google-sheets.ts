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
      credentials = JSON.parse(serviceAccountKey)
    } else {
      // Tentar usar arquivo local (desenvolvimento)
      const keyPath = path.join(process.cwd(), '..', 'backend', 'service-account-key.json')
      
      if (!fs.existsSync(keyPath)) {
        throw new Error(`Arquivo de Service Account não encontrado: ${keyPath}. Configure GOOGLE_SERVICE_ACCOUNT_KEY como variável de ambiente.`)
      }
      
      const keyFile = fs.readFileSync(keyPath, 'utf8')
      credentials = JSON.parse(keyFile)
    }
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })
    
    console.log('✅ Service Account autenticada com sucesso')
    return google.sheets({ version: 'v4', auth })
  } catch (error: any) {
    console.error('❌ Erro ao autenticar com Service Account:', error.message)
    throw new Error(`Falha na autenticação com Google Sheets: ${error.message}`)
  }
}

export { SPREADSHEET_ID }

