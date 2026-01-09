# 🔄 Sincronizar e Fazer Push para GitHub

## Problema: Push Rejeitado

Quando você recebe o erro:
```
! [rejected]        main -> main (fetch first)
```

Isso significa que o repositório remoto tem mudanças que você não tem localmente.

## Solução Rápida

### Opção 1: Usar o Script PowerShell (Recomendado)

Execute no PowerShell:
```powershell
.\git-sync.ps1
```

O script vai:
1. Adicionar todos os arquivos alterados
2. Fazer commit das mudanças
3. Fazer pull com rebase (integrar mudanças remotas)
4. Fazer push para o GitHub

### Opção 2: Comandos Manuais

Se preferir fazer manualmente, execute no Git Bash ou terminal:

```bash
# 1. Adicionar arquivos
git add .

# 2. Fazer commit
git commit -m "Atualizações: logos, fontes e melhorias visuais"

# 3. Fazer pull com rebase (integra mudanças remotas)
git pull --rebase origin main

# 4. Se houver conflitos, resolva e continue:
# git rebase --continue

# 5. Fazer push
git push origin main
```

### Opção 3: Pull e Merge (Alternativa)

Se preferir fazer merge ao invés de rebase:

```bash
# 1. Adicionar arquivos
git add .

# 2. Fazer commit
git commit -m "Atualizações: logos, fontes e melhorias visuais"

# 3. Fazer pull com merge
git pull origin main

# 4. Resolver conflitos se houver

# 5. Fazer push
git push origin main
```

## Resolvendo Conflitos

Se houver conflitos durante o pull:

1. **Abra os arquivos com conflitos** (eles terão marcadores `<<<<<<<`, `=======`, `>>>>>>>`)
2. **Resolva os conflitos** manualmente
3. **Adicione os arquivos resolvidos**:
   ```bash
   git add .
   ```
4. **Continue o rebase**:
   ```bash
   git rebase --continue
   ```
5. **Faça push**:
   ```bash
   git push origin main
   ```

## Dica

Para evitar esse problema no futuro, sempre faça `git pull` antes de fazer `git push` quando trabalhar em equipe.

