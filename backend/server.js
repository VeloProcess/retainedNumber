const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = 9080;

app.use(cors());
app.use(express.json());

// Configuração do Google Sheets
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID || '1DifGbdZdT2Nc3gWHzN77B2G2KFP4_ee1Ldg40EBX6XU';
const RANGE = 'Sheet1'; // Nome da aba (será detectado automaticamente se diferente)

// Função para autenticar usando Service Account
async function getGoogleSheetsClient() {
  try {
    // Tentar usar Service Account Key do arquivo
    const keyPath = path.join(__dirname, 'service-account-key.json');
    console.log(`Tentando autenticar com Service Account: ${keyPath}`);
    
    if (!fs.existsSync(keyPath)) {
      throw new Error(`Arquivo de Service Account não encontrado: ${keyPath}`);
    }
    
    const auth = new google.auth.GoogleAuth({
      keyFile: keyPath,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const authClient = await auth.getClient();
    console.log('✅ Service Account autenticada com sucesso');
    return google.sheets({ version: 'v4', auth: authClient });
  } catch (error) {
    console.error('❌ Erro ao autenticar com Service Account:', error.message);
    console.error('Stack:', error.stack);
    throw new Error(`Falha na autenticação com Google Sheets: ${error.message}`);
  }
}

// Endpoint para obter números da planilha
app.get('/api/numbers', async (req, res) => {
  try {
    console.log('Buscando números da planilha...');
    const sheets = await getGoogleSheetsClient();
    console.log('Cliente Google Sheets autenticado com sucesso');
    
    // Descobrir o nome real da aba primeiro
    console.log(`Descobrindo nome da aba...`);
    const spreadsheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    const sheetName = spreadsheetInfo.data.sheets[0].properties.title;
    console.log(`Nome da aba encontrado: "${sheetName}"`);
    
    // Ler dados da aba (sem especificar range para ler tudo)
    console.log(`Lendo dados da aba "${sheetName}"...`);
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetName, // Usar apenas o nome da aba
    });

    const rows = response.data.values || [];
    console.log(`Total de linhas encontradas: ${rows.length}`);
    
    if (rows.length === 0) {
      return res.json([]);
    }

    // Cabeçalhos (primeira linha)
    const headers = rows[0];
    
    // Encontrar índices das colunas
    const chamadaIndex = headers.indexOf('Chamada');
    const dataIndex = headers.indexOf('Data');
    const horaIndex = headers.indexOf('Hora');
    const paisIndex = headers.indexOf('País');
    const dddIndex = headers.indexOf('DDD');
    const numeroIndex = headers.indexOf('Numero');
    const cpfCnpjIndex = headers.indexOf('Cpf/Cnpj');
    const idLigacaoIndex = headers.indexOf('Id Ligação');
    const statusIndex = headers.indexOf('Status');
    const quemRegistrouIndex = headers.indexOf('Quem registrou');
    const timestampIndex = headers.indexOf('Timestamp');

    // Processar linhas (pular cabeçalho)
    const numbers = [];
    const numerosVistos = new Map(); // Map para rastrear números já processados
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      
      // Verificar se a linha está completa (pelo menos número deve existir)
      if (!row[numeroIndex] || row[numeroIndex].trim() === '') {
        continue; // Linha incompleta - descartar
      }

      const status = row[statusIndex]?.trim() || '';
      
      // Filtrar apenas números sem status (não processados)
      if (status === '') {
        const numero = row[numeroIndex].trim();
        
        // Normalizar número (remover espaços, caracteres especiais para comparação)
        const numeroNormalizado = numero.replace(/\D/g, ''); // Remove tudo que não é dígito
        
        // Verificar se já vimos este número
        if (!numerosVistos.has(numeroNormalizado)) {
          // Adicionar número ao map e à lista
          numerosVistos.set(numeroNormalizado, true);
          
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
          });
        } else {
          // Número duplicado - pular (já foi adicionado anteriormente)
          console.log(`Número duplicado ignorado: ${numero}`);
        }
      }
    }

    // Ordenar por data/hora (mais recente primeiro)
    numbers.sort((a, b) => {
      const dateA = new Date(`${a.data} ${a.hora}`);
      const dateB = new Date(`${b.data} ${b.hora}`);
      return dateB - dateA;
    });

    console.log(`Números únicos processados: ${numbers.length} (duplicados removidos)`);
    res.json(numbers);
  } catch (error) {
    console.error('❌ Erro ao buscar números:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: 'Erro ao buscar números da planilha', 
      details: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText
    });
  }
});

// Endpoint para atualizar feedback
app.post('/api/feedback', async (req, res) => {
  try {
    const { rowIndex, status, comentario, userEmail } = req.body;

    if (!rowIndex || !status || !comentario || !userEmail) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    const sheets = await getGoogleSheetsClient();
    
    // Descobrir o nome da aba primeiro
    const spreadsheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    const sheetName = spreadsheetInfo.data.sheets[0].properties.title;
    
    // Encontrar índices das colunas (ler apenas primeira linha)
    const headersResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!1:1`, // Primeira linha da aba
    });

    const headers = headersResponse.data.values[0];
    const statusIndex = headers.indexOf('Status');
    const quemRegistrouIndex = headers.indexOf('Quem registrou');
    const timestampIndex = headers.indexOf('Timestamp');

    // Função para converter índice numérico para notação de coluna (A, B, ..., Z, AA, AB, etc.)
    function getColumnLetter(index) {
      let result = '';
      while (index >= 0) {
        result = String.fromCharCode(65 + (index % 26)) + result;
        index = Math.floor(index / 26) - 1;
      }
      return result;
    }

    const statusCol = getColumnLetter(statusIndex);
    const quemRegistrouCol = getColumnLetter(quemRegistrouIndex);
    const timestampCol = getColumnLetter(timestampIndex);

    // Criar timestamp atual
    const now = new Date();
    const timestamp = now.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

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
    });

    res.json({ success: true, message: 'Feedback registrado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar feedback:', error);
    res.status(500).json({ error: 'Erro ao atualizar feedback', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});

