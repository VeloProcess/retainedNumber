# Troubleshooting - Erro 500 no Backend

## Erro: GET http://localhost:9080/api/numbers 500 (Internal Server Error)

Este erro indica que o backend está falhando ao tentar acessar o Google Sheets.

## Possíveis Causas e Soluções

### 1. Planilha não compartilhada com Service Account

**Sintoma:** Erro de permissão ao acessar a planilha

**Solução:**
1. Abra a planilha: https://docs.google.com/spreadsheets/d/1DifGbdZdT2Nc3gWHzN77B2G2KFP4_ee1Ldg40EBX6XU/edit
2. Clique em "Compartilhar"
3. Adicione o email: `client-ura@retained-numbers.iam.gserviceaccount.com`
4. Defina permissão como **"Editor"**
5. Clique em "Enviar" (sem notificar)

### 2. Service Account Key inválido ou corrompido

**Sintoma:** Erro de autenticação

**Solução:**
- Verifique se o arquivo `backend/service-account-key.json` existe
- Verifique se o arquivo está completo e válido
- Refaça o download da Service Account Key do Google Cloud Console

### 3. Google Sheets API não habilitada

**Sintoma:** Erro ao acessar API

**Solução:**
1. Acesse: https://console.cloud.google.com/apis/library
2. Procure por "Google Sheets API"
3. Certifique-se de que está **habilitada**

### 4. Backend não está rodando

**Sintoma:** Erro de conexão

**Solução:**
```bash
cd backend
npm run dev
```

Verifique se aparece: `Backend rodando em http://localhost:9080`

### 5. Verificar logs do backend

O backend agora mostra logs detalhados. Verifique o console onde o backend está rodando para ver:
- Se a autenticação foi bem-sucedida
- Qual erro específico está ocorrendo
- Em qual etapa está falhando

## Como Verificar

1. **Verifique se o backend está rodando:**
   ```bash
   curl http://localhost:9080/api/numbers
   ```

2. **Verifique os logs do backend** - você deve ver mensagens como:
   - `Buscando números da planilha...`
   - `Cliente Google Sheets autenticado com sucesso`
   - `Total de linhas encontradas: X`

3. **Verifique se a planilha está compartilhada:**
   - Abra a planilha no navegador
   - Verifique se o email da Service Account aparece na lista de compartilhamento

## Próximos Passos

Após verificar os logs do backend, você saberá exatamente onde está o problema:
- Se for autenticação: verifique o arquivo service-account-key.json
- Se for permissão: compartilhe a planilha com a Service Account
- Se for API: habilite a Google Sheets API

