# Script para sincronizar com o repositório remoto e fazer push

Write-Host "=== Sincronizando com repositório remoto ===" -ForegroundColor Cyan

# Navegar para o diretório do projeto
Set-Location $PSScriptRoot

# Verificar se Git está instalado
try {
    $gitVersion = git --version 2>$null
    Write-Host "✅ Git encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Git não encontrado!" -ForegroundColor Red
    Write-Host "Execute este script no Git Bash ou instale o Git" -ForegroundColor Yellow
    exit 1
}

# Verificar se é um repositório Git
if (-not (Test-Path .git)) {
    Write-Host "❌ Este diretório não é um repositório Git" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Verificando status ===" -ForegroundColor Cyan
git status --short

Write-Host "`n=== Adicionando arquivos alterados ===" -ForegroundColor Cyan
git add .

Write-Host "`n=== Fazendo commit ===" -ForegroundColor Cyan
$commitMessage = "Atualizações: logos, fontes, layout responsivo e melhorias visuais"
git commit -m $commitMessage

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Nenhuma alteração para commitar" -ForegroundColor Yellow
}

Write-Host "`n=== Fazendo pull com rebase ===" -ForegroundColor Cyan
Write-Host "Isso vai integrar as mudanças remotas com as locais..." -ForegroundColor Yellow
git pull --rebase origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Erro ao fazer pull. Pode haver conflitos." -ForegroundColor Red
    Write-Host "Resolva os conflitos manualmente e execute:" -ForegroundColor Yellow
    Write-Host "  git rebase --continue" -ForegroundColor Yellow
    Write-Host "  git push" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n=== Fazendo push para GitHub ===" -ForegroundColor Cyan
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Push realizado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Erro ao fazer push" -ForegroundColor Red
    Write-Host "Verifique suas credenciais do GitHub" -ForegroundColor Yellow
}

