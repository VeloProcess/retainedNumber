import { NextResponse } from 'next/server'
import { getGoogleSheetsClient, SPREADSHEET_ID } from '../google-sheets'

export async function POST(request: Request) {
  try {
    console.log('📝 Recebendo requisição de feedback...')
    const body = await request.json()
    const { rowIndex, status, comentario, userEmail } = body

    console.log('Dados recebidos:', {
      rowIndex,
      status,
      comentario: comentario ? `${comentario.substring(0, 50)}...` : '(vazio)',
      userEmail
    })

    if (!rowIndex || !status || !comentario || !userEmail) {
      console.error('❌ Dados incompletos:', { rowIndex, status, comentario: !!comentario, userEmail: !!userEmail })
      return NextResponse.json(
        { error: 'Dados incompletos', received: { rowIndex, status, hasComentario: !!comentario, hasUserEmail: !!userEmail } },
        { status: 400 }
      )
    }

    const sheets = await getGoogleSheetsClient()
    
    // Descobrir o nome da aba primeiro
    const spreadsheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    })
    const sheetName = spreadsheetInfo.data.sheets![0].properties!.title!
    
    // Encontrar índices das colunas (ler apenas primeira linha)
    const headersResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!1:1`, // Primeira linha da aba
    })

    const headers = headersResponse.data.values![0]
    const statusIndex = headers.indexOf('Status')
    const quemRegistrouIndex = headers.indexOf('Quem registrou')
    const timestampIndex = headers.indexOf('Timestamp')
    const comentarioIndex = headers.indexOf('Comentário') // Tentar encontrar coluna de comentário
    
    console.log('Índices das colunas encontrados:', {
      status: statusIndex,
      quemRegistrou: quemRegistrouIndex,
      timestamp: timestampIndex,
      comentario: comentarioIndex
    })
    
    // Validar que as colunas obrigatórias existem
    if (statusIndex === -1 || quemRegistrouIndex === -1 || timestampIndex === -1) {
      throw new Error('Colunas obrigatórias não encontradas na planilha. Verifique se existem as colunas: Status, Quem registrou, Timestamp')
    }

    // Função para converter índice numérico para notação de coluna (A, B, ..., Z, AA, AB, etc.)
    const getColumnLetter = (index: number): string => {
      let result = ''
      let num = index
      while (num >= 0) {
        result = String.fromCharCode(65 + (num % 26)) + result
        num = Math.floor(num / 26) - 1
      }
      return result
    }

    const statusCol = getColumnLetter(statusIndex)
    const quemRegistrouCol = getColumnLetter(quemRegistrouIndex)
    const timestampCol = getColumnLetter(timestampIndex)
    
    console.log('Colunas calculadas:', {
      status: `${statusCol}${rowIndex}`,
      quemRegistrou: `${quemRegistrouCol}${rowIndex}`,
      timestamp: `${timestampCol}${rowIndex}`
    })
    
    // Criar timestamp atual
    const now = new Date()
    const timestamp = now.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })

    // Preparar dados para atualização
    const updateData: any[] = [
      {
        range: `${sheetName}!${statusCol}${rowIndex}`,
        values: [[status]],
      },
      {
        range: `${sheetName}!${quemRegistrouCol}${rowIndex}`,
        values: [[userEmail]],
      },
      {
        range: `${sheetName}!${timestampCol}${rowIndex}`,
        values: [[timestamp]],
      },
    ]
    
    // Adicionar comentário se a coluna existir
    if (comentarioIndex !== -1) {
      const comentarioCol = getColumnLetter(comentarioIndex)
      updateData.push({
        range: `${sheetName}!${comentarioCol}${rowIndex}`,
        values: [[comentario]],
      })
      console.log(`Comentário será salvo na coluna ${comentarioCol}${rowIndex}`)
    } else {
      console.log('Coluna "Comentário" não encontrada. Comentário não será salvo na planilha.')
    }

    console.log(`Atualizando linha ${rowIndex} com:`, {
      status,
      userEmail,
      timestamp,
      comentario: comentarioIndex !== -1 ? comentario : '(não salvo)'
    })

    console.log('📤 Enviando atualização para Google Sheets:', {
      spreadsheetId: SPREADSHEET_ID,
      sheetName,
      updateData: updateData.map(d => ({ range: d.range, value: d.values[0][0] }))
    })

    // Atualizar células
    const updateResponse = await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        valueInputOption: 'RAW',
        data: updateData,
      },
    })
    
    console.log('✅ Feedback atualizado com sucesso na planilha')
    console.log('Resposta do Google Sheets:', {
      updatedCells: updateResponse.data.totalUpdatedCells,
      updatedRows: updateResponse.data.totalUpdatedRows,
      updatedColumns: updateResponse.data.totalUpdatedColumns
    })

    return NextResponse.json({ success: true, message: 'Feedback registrado com sucesso' })
  } catch (error: any) {
    console.error('❌ Erro ao atualizar feedback:', error)
    console.error('Stack:', error.stack)
    console.error('Detalhes do erro:', {
      message: error.message,
      code: error.code,
      response: error.response?.data
    })
    
    // Retornar mensagem de erro mais detalhada
    const errorMessage = error.message || 'Erro desconhecido'
    const errorDetails: any = {
      error: 'Erro ao atualizar feedback na planilha',
      message: errorMessage,
      type: error.constructor.name,
    }
    
    // Adicionar informações específicas de erro do Google Sheets
    if (error.response?.data) {
      errorDetails.googleError = error.response.data
    }
    
    // Adicionar stack em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      errorDetails.stack = error.stack
    }
    
    return NextResponse.json(errorDetails, { status: 500 })
  }
}

