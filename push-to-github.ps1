# Script para fazer push do projeto para o GitHub
# Execute após instalar o Git

Write-Host "=== Configurando Git e fazendo push para GitHub ===" -ForegroundColor Cyan

# Verificar se Git está instalado
try {
    $gitVersion = git --version
    Write-Host "✅ Git encontrado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git não encontrado!" -ForegroundColor Red
    Write-Host "Instale o Git primeiro:" -ForegroundColor Yellow
    Write-Host "  winget install --id Git.Git -e --source winget" -ForegroundColor Yellow
    Write-Host "Ou baixe em: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Navegar para o diretório do projeto
Set-Location $PSScriptRoot

Write-Host "`n=== Inicializando repositório Git ===" -ForegroundColor Cyan

# Inicializar git (se ainda não foi feito)
if (-not (Test-Path .git)) {
    git init
    Write-Host "✅ Repositório Git inicializado" -ForegroundColor Green
} else {
    Write-Host "✅ Repositório Git já existe" -ForegroundColor Green
}

Write-Host "`n=== Adicionando arquivos ===" -ForegroundColor Cyan
git add .

Write-Host "`n=== Verificando status ===" -ForegroundColor Cyan
git status

Write-Host "`n=== Fazendo commit ===" -ForegroundColor Cyan
git commit -m "Initial commit - Sistema de Números Fora Do Horário (55pbx)"

Write-Host "`n=== Configurando branch main ===" -ForegroundColor Cyan
git branch -M main

Write-Host "`n=== Adicionando remote do GitHub ===" -ForegroundColor Cyan
# Verificar se remote já existe
$remoteExists = git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Remote 'origin' já existe: $remoteExists" -ForegroundColor Yellow
    Write-Host "Removendo remote existente..." -ForegroundColor Yellow
    git remote remove origin
}
git remote add origin https://github.com/VeloProcess/retainedNumber.git
Write-Host "✅ Remote adicionado" -ForegroundColor Green

Write-Host "`n=== Fazendo push para GitHub ===" -ForegroundColor Cyan
Write-Host "Isso pode pedir suas credenciais do GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Push realizado com sucesso!" -ForegroundColor Green
    Write-Host "Repositório disponível em: https://github.com/VeloProcess/retainedNumber" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ Erro ao fazer push" -ForegroundColor Red
    Write-Host "Verifique suas credenciais do GitHub" -ForegroundColor Yellow
}

