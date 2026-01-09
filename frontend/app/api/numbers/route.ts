import { NextResponse } from 'next/server'
import { getGoogleSheetsClient, SPREADSHEET_ID } from '../google-sheets'

// Desabilitar cache para sempre buscar dados atualizados
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    console.log('Buscando números da planilha...')
    const sheets = await getGoogleSheetsClient()
    console.log('Cliente Google Sheets autenticado com sucesso')
    
    // Descobrir o nome real da aba primeiro
    console.log(`Descobrindo nome da aba...`)
    const spreadsheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    })
    const sheetName = spreadsheetInfo.data.sheets![0].properties!.title!
    console.log(`Nome da aba encontrado: "${sheetName}"`)
    
    // Ler dados da aba
    console.log(`Lendo dados da aba "${sheetName}"...`)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetName,
    })

    const rows = response.data.values || []
    console.log(`Total de linhas encontradas: ${rows.length}`)
    
    if (rows.length === 0) {
      return NextResponse.json([])
    }

    // Cabeçalhos (primeira linha)
    const headers = rows[0]
    
    // Encontrar índices das colunas
    const chamadaIndex = headers.indexOf('Chamada')
    const dataIndex = headers.indexOf('Data')
    const horaIndex = headers.indexOf('Hora')
    const paisIndex = headers.indexOf('País')
    const dddIndex = headers.indexOf('DDD')
    const numeroIndex = headers.indexOf('Numero')
    const cpfCnpjIndex = headers.indexOf('Cpf/Cnpj')
    const idLigacaoIndex = headers.indexOf('Id Ligação')
    const statusIndex = headers.indexOf('Status')
    const quemRegistrouIndex = headers.indexOf('Quem registrou')
    const timestampIndex = headers.indexOf('Timestamp')

    // Processar linhas (pular cabeçalho)
    const numbers = []
    const numerosVistos = new Map<string, boolean>()
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      
      // Verificar se a linha está completa (pelo menos número deve existir)
      if (!row[numeroIndex] || row[numeroIndex].trim() === '') {
        continue // Linha incompleta - descartar
      }

      const status = row[statusIndex]?.trim() || ''
      
      // Filtrar apenas números sem status (não processados)
      if (status === '') {
        const numero = row[numeroIndex].trim()
        
        // Normalizar número (remover espaços, caracteres especiais para comparação)
        const numeroNormalizado = numero.replace(/\D/g, '') // Remove tudo que não é dígito
        
        // Verificar se já vimos este número
        if (!numerosVistos.has(numeroNormalizado)) {
          // Adicionar número ao map e à lista
          numerosVistos.set(numeroNormalizado, true)
          
          numbers.push({
            rowIndex: i + 1, // +1 porque a planilha começa em 1 e pulamos o cabeçalho
            chamada: row[chamadaIndex] || '',
            data: row[dataIndex] || '',
            hora: row[horaIndex] || '',
            pais: row[paisIndex] || '',
            ddd: row[dddIndex] || '',
            numero: numero,
            cpfCnpj: row[cpfCnpjIndex] || '',
            idLigacao: row[idLigacaoIndex] || '',
            status: status,
            quemRegistrou: row[quemRegistrouIndex] || '',
            timestamp: row[timestampIndex] || '',
          })
        } else {
          // Número duplicado - pular (já foi adicionado anteriormente)
          console.log(`Número duplicado ignorado: ${numero}`)
        }
      }
    }

    // Ordenar por data/hora (mais recente primeiro)
    numbers.sort((a, b) => {
      const dateA = new Date(`${a.data} ${a.hora}`).getTime()
      const dateB = new Date(`${b.data} ${b.hora}`).getTime()
      return dateB - dateA
    })

    console.log(`Números únicos processados: ${numbers.length} (duplicados removidos)`)
    
    // Retornar com headers que desabilitam cache
    return NextResponse.json(numbers, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      }
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar números:', error)
    console.error('Stack completo:', error.stack)
    console.error('Tipo do erro:', error.constructor.name)
    
    // Diagnóstico detalhado do erro
    const errorMessage = error.message || 'Erro desconhecido'
    let diagnosticInfo: any = {
      error: 'Erro ao buscar números da planilha',
      message: errorMessage,
      type: error.constructor.name,
    }
    
    // Verificar se é erro de autenticação
    if (errorMessage.includes('autenticação') || errorMessage.includes('authentication') || errorMessage.includes('credentials')) {
      diagnosticInfo.diagnostic = 'Erro de autenticação com Google Sheets'
      diagnosticInfo.possibleCauses = [
        'GOOGLE_SERVICE_ACCOUNT_KEY não está configurada no Vercel',
        'GOOGLE_SERVICE_ACCOUNT_KEY está em formato inválido',
        'Chave privada da Service Account está mal formatada'
      ]
      diagnosticInfo.checkSteps = [
        'Verifique se GOOGLE_SERVICE_ACCOUNT_KEY está configurada no Vercel',
        'Verifique se o JSON está válido (teste em jsonlint.com)',
        'Verifique se a chave privada tem \\n escapado (não quebras reais)'
      ]
    }
    
    // Verificar se é erro de permissão
    if (errorMessage.includes('permission') || errorMessage.includes('Permission') || errorMessage.includes('403')) {
      diagnosticInfo.diagnostic = 'Erro de permissão ao acessar planilha'
      diagnosticInfo.possibleCauses = [
        'Service Account não tem acesso à planilha',
        'Planilha não foi compartilhada com o email da Service Account'
      ]
      diagnosticInfo.checkSteps = [
        'Abra o arquivo service-account-key.json e copie o client_email',
        'Compartilhe a planilha com esse email dando permissão de Editor',
        'Verifique se GOOGLE_SHEETS_ID está correto'
      ]
    }
    
    // Verificar se é erro de planilha não encontrada
    if (errorMessage.includes('not found') || errorMessage.includes('404') || errorMessage.includes('Unable to parse range')) {
      diagnosticInfo.diagnostic = 'Planilha ou aba não encontrada'
      diagnosticInfo.possibleCauses = [
        'GOOGLE_SHEETS_ID está incorreto',
        'Planilha foi deletada ou movida',
        'Aba não existe na planilha'
      ]
      diagnosticInfo.checkSteps = [
        'Verifique se GOOGLE_SHEETS_ID está correto no Vercel',
        'Verifique se a planilha existe e está acessível',
        'Verifique se a planilha tem pelo menos uma aba'
      ]
    }
    
    // Verificar se é erro de variável de ambiente
    if (errorMessage.includes('GOOGLE_SERVICE_ACCOUNT_KEY') || errorMessage.includes('não encontrado')) {
      diagnosticInfo.diagnostic = 'Variável de ambiente não configurada'
      diagnosticInfo.possibleCauses = [
        'GOOGLE_SERVICE_ACCOUNT_KEY não está definida no Vercel'
      ]
      diagnosticInfo.checkSteps = [
        'Vá em Settings > Environment Variables no Vercel',
        'Adicione GOOGLE_SERVICE_ACCOUNT_KEY com o conteúdo do service-account-key.json',
        'Faça um novo deploy após adicionar a variável'
      ]
    }
    
    // Adicionar informações de debug em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      diagnosticInfo.stack = error.stack
      diagnosticInfo.envCheck = {
        hasServiceAccountKey: !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
        hasSpreadsheetId: !!process.env.GOOGLE_SHEETS_ID,
        spreadsheetId: process.env.GOOGLE_SHEETS_ID || 'não configurado'
      }
    }
    
    return NextResponse.json(diagnosticInfo, { status: 500 })
  }
}

