# Script para fazer commit e push das alterações

Write-Host "=== Fazendo commit e push das alterações ===" -ForegroundColor Cyan

# Navegar para o diretório do projeto
Set-Location $PSScriptRoot

# Verificar se Git está instalado
try {
    $gitVersion = git --version 2>$null
    Write-Host "✅ Git encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Git não encontrado!" -ForegroundColor Red
    Write-Host "Instale o Git primeiro ou use o Git Bash" -ForegroundColor Yellow
    exit 1
}

# Verificar se é um repositório Git
if (-not (Test-Path .git)) {
    Write-Host "❌ Este diretório não é um repositório Git" -ForegroundColor Red
    Write-Host "Execute primeiro: .\push-to-github.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n=== Adicionando arquivos alterados ===" -ForegroundColor Cyan
git add .

Write-Host "`n=== Status das alterações ===" -ForegroundColor Cyan
git status --short

Write-Host "`n=== Fazendo commit ===" -ForegroundColor Cyan
$commitMessage = "Melhorias: botão de atualizar dados, tratamento de erros e logs detalhados"
git commit -m $commitMessage

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Nenhuma alteração para commitar ou commit cancelado" -ForegroundColor Yellow
    exit 0
}

Write-Host "`n=== Fazendo push para GitHub ===" -ForegroundColor Cyan
git push

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Push realizado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Erro ao fazer push" -ForegroundColor Red
    Write-Host "Verifique suas credenciais do GitHub ou execute manualmente:" -ForegroundColor Yellow
    Write-Host "  git push" -ForegroundColor Yellow
}

