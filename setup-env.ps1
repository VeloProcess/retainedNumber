# Script para configurar variáveis de ambiente
Write-Host "Configurando variáveis de ambiente..." -ForegroundColor Green

# Gerar NEXTAUTH_SECRET aleatório
$nextAuthSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
$nextAuthSecretBase64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($nextAuthSecret))

# Criar arquivo .env.local no frontend
$frontendEnvContent = @"
# Google OAuth - Configure com suas credenciais do Google Cloud Console
# Obtenha em: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=seu_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_client_secret_aqui

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:8090
NEXTAUTH_SECRET=$nextAuthSecretBase64
"@

$frontendEnvPath = "frontend\.env.local"
if (Test-Path $frontendEnvPath) {
    Write-Host "Arquivo $frontendEnvPath já existe. Deseja sobrescrever? (S/N)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -ne "S" -and $response -ne "s") {
        Write-Host "Operação cancelada." -ForegroundColor Yellow
        exit
    }
}

Set-Content -Path $frontendEnvPath -Value $frontendEnvContent -Encoding UTF8
Write-Host "✅ Arquivo $frontendEnvPath criado com sucesso!" -ForegroundColor Green
Write-Host "   NEXTAUTH_SECRET gerado automaticamente: $nextAuthSecretBase64" -ForegroundColor Cyan

# Criar arquivo .env no backend
$backendEnvContent = @"
GOOGLE_SHEETS_ID=1DifGbdZdT2Nc3gWHzN77B2G2KFP4_ee1Ldg40EBX6XU
"@

$backendEnvPath = "backend\.env"
if (Test-Path $backendEnvPath) {
    Write-Host "Arquivo $backendEnvPath já existe. Deseja sobrescrever? (S/N)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -ne "S" -and $response -ne "s") {
        Write-Host "Operação cancelada." -ForegroundColor Yellow
        exit
    }
}

Set-Content -Path $backendEnvPath -Value $backendEnvContent -Encoding UTF8
Write-Host "✅ Arquivo $backendEnvPath criado com sucesso!" -ForegroundColor Green

Write-Host "`n📝 PRÓXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host "1. Edite frontend\.env.local e configure:" -ForegroundColor White
Write-Host "   - GOOGLE_CLIENT_ID (obtenha em https://console.cloud.google.com/apis/credentials)" -ForegroundColor Gray
Write-Host "   - GOOGLE_CLIENT_SECRET (obtenha em https://console.cloud.google.com/apis/credentials)" -ForegroundColor Gray
Write-Host "2. Configure o Google Cloud Console:" -ForegroundColor White
Write-Host "   - Habilite Google Sheets API" -ForegroundColor Gray
Write-Host "   - Crie credenciais OAuth 2.0" -ForegroundColor Gray
Write-Host "   - Adicione URL de redirecionamento: http://localhost:8090/api/auth/callback/google" -ForegroundColor Gray
Write-Host "3. Execute: npm run dev" -ForegroundColor White

