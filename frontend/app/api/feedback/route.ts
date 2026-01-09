import { NextResponse } from 'next/server'
import { getGoogleSheetsClient, SPREADSHEET_ID } from '../google-sheets'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { rowIndex, status, comentario, userEmail } = body

    if (!rowIndex || !status || !comentario || !userEmail) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
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

    // Atualizar células
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        valueInputOption: 'RAW',
        data: [
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
        ],
      },
    })

    return NextResponse.json({ success: true, message: 'Feedback registrado com sucesso' })
  } catch (error: any) {
    console.error('Erro ao atualizar feedback:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar feedback', details: error.message },
      { status: 500 }
    )
  }
}

