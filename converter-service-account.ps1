# Script para converter service-account-key.json para formato de uma linha (Vercel)

$jsonPath = "backend\service-account-key.json"

if (-not (Test-Path $jsonPath)) {
    Write-Host "❌ Arquivo não encontrado: $jsonPath" -ForegroundColor Red
    exit 1
}

Write-Host "📄 Lendo arquivo: $jsonPath" -ForegroundColor Cyan

# Ler o JSON
$jsonContent = Get-Content -Path $jsonPath -Raw

# Validar JSON
try {
    $jsonObject = $jsonContent | ConvertFrom-Json
    Write-Host "✅ JSON válido!" -ForegroundColor Green
} catch {
    Write-Host "❌ JSON inválido: $_" -ForegroundColor Red
    exit 1
}

# Converter para uma linha (minificar)
$jsonMinified = ($jsonContent | ConvertFrom-Json | ConvertTo-Json -Compress -Depth 10)

Write-Host ""
Write-Host "=" * 80 -ForegroundColor Yellow
Write-Host "📋 JSON MINIFICADO (pronto para colar no Vercel):" -ForegroundColor Green
Write-Host "=" * 80 -ForegroundColor Yellow
Write-Host ""
Write-Host $jsonMinified -ForegroundColor White
Write-Host ""
Write-Host "=" * 80 -ForegroundColor Yellow
Write-Host ""
Write-Host "✅ Copie o texto acima e cole na variável GOOGLE_SERVICE_ACCOUNT_KEY no Vercel" -ForegroundColor Green
Write-Host ""

# Salvar em arquivo também
$outputPath = "service-account-key-minified.json"
$jsonMinified | Out-File -FilePath $outputPath -Encoding utf8 -NoNewline
Write-Host "💾 Também salvo em: $outputPath" -ForegroundColor Cyan
Write-Host ""

