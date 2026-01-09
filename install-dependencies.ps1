# Script de instalação de dependências
# Execute como administrador: .\install-dependencies.ps1

Write-Host "Instalando dependências do projeto..." -ForegroundColor Green

# Verificar se Git está instalado
Write-Host "`nVerificando Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "Git encontrado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "Git não encontrado. Instalando via winget..." -ForegroundColor Yellow
    winget install --id Git.Git -e --source winget
    Write-Host "Por favor, reinicie o terminal após a instalação do Git." -ForegroundColor Yellow
}

# Verificar se Node.js está instalado
Write-Host "`nVerificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js não encontrado. Instale em: https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Instalar dependências do projeto
Write-Host "`nInstalando dependências da raiz..." -ForegroundColor Yellow
npm install

Write-Host "`nInstalando dependências do frontend..." -ForegroundColor Yellow
cd frontend
npm install
cd ..

Write-Host "`nInstalando dependências do backend..." -ForegroundColor Yellow
cd backend
npm install
cd ..

# Instalar Vercel CLI globalmente
Write-Host "`nInstalando Vercel CLI..." -ForegroundColor Yellow
npm install -g vercel

Write-Host "`n✅ Todas as dependências foram instaladas com sucesso!" -ForegroundColor Green
Write-Host "`nPróximos passos:" -ForegroundColor Cyan
Write-Host "1. Configure as variáveis de ambiente (.env e .env.local)" -ForegroundColor White
Write-Host "2. Execute 'npm run dev' para iniciar o sistema" -ForegroundColor White

