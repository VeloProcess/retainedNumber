import { NextResponse } from 'next/server'
import { getGoogleSheetsClient, SPREADSHEET_ID } from '../google-sheets'

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
    return NextResponse.json(numbers)
  } catch (error: any) {
    console.error('❌ Erro ao buscar números:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao buscar números da planilha', 
        details: error.message,
      },
      { status: 500 }
    )
  }
}

