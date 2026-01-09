# Configuração do Git e Push para GitHub

## ⚠️ Git não está instalado

Para fazer o commit e push para o GitHub, você precisa instalar o Git primeiro.

## Instalar Git

### Opção 1: Via winget (recomendado)
```powershell
winget install --id Git.Git -e --source winget
```

### Opção 2: Download direto
Baixe em: https://git-scm.com/download/win

## Após instalar o Git

1. **Reinicie o terminal** ou abra um novo PowerShell

2. **Configure o Git** (se ainda não configurou):
```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"
```

3. **Execute os comandos para fazer push:**

```bash
cd C:\Users\gabri\Documents\retainednumberv0

# Inicializar repositório (se ainda não foi feito)
git init

# Adicionar todos os arquivos (exceto os ignorados no .gitignore)
git add .

# Fazer commit inicial
git commit -m "Initial commit - Sistema de Números Fora Do Horário"

# Renomear branch para main
git branch -M main

# Adicionar remote do GitHub
git remote add origin https://github.com/VeloProcess/retainedNumber.git

# Fazer push
git push -u origin main
```

## Arquivos que NÃO serão commitados (protegidos pelo .gitignore)

- ✅ `node_modules/` - Dependências npm
- ✅ `.env*` - Arquivos de ambiente com credenciais
- ✅ `service-account-key.json` - Chave da Service Account
- ✅ `.next/`, `dist/`, `build/` - Arquivos de build
- ✅ `*.log` - Arquivos de log

## Arquivos que SERÃO commitados

- ✅ Código fonte (frontend e backend)
- ✅ `package.json` e `package-lock.json`
- ✅ Arquivos de configuração
- ✅ README.md e documentação
- ✅ `.gitignore`

## Verificar antes de fazer push

```bash
# Ver quais arquivos serão commitados
git status

# Ver o conteúdo do commit
git diff --cached
```

## Se já existe um repositório no GitHub

Se o repositório já existe e tem conteúdo, você pode precisar fazer pull primeiro:

```bash
git pull origin main --allow-unrelated-histories
```

Ou forçar o push (cuidado - isso sobrescreve o conteúdo remoto):

```bash
git push -u origin main --force
```

