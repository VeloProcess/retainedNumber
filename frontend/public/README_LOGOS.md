# Logos da Velotax

## Arquivos de Logo

### 1. `logo-icon.png` (Favicon e Logo Vertical)
- **Localização**: Canto superior esquerdo da página (fixa)
- **Uso**: Favicon do navegador e logo fixa no canto superior esquerdo
- **Formato**: PNG
- **Fonte**: [GitHub Repository](https://github.com/VeloProcess/retainedNumber/blob/main/unnamed.png)

### 2. `logo-header.webp` (Logo Horizontal do Header)
- **Localização**: Header da página, ao lado do título
- **Uso**: Logo da empresa no header principal
- **Formato**: WebP
- **Fonte**: [GitHub Repository](https://github.com/VeloProcess/retainedNumber/blob/main/unnamed.webp)

## Estrutura Atual

```
frontend/
  public/
    logo-icon.png      ← Logo vertical (favicon + canto superior esquerdo)
    logo-header.webp   ← Logo horizontal (header)
```

## Características

- **Logo Vertical**: Usada como favicon e logo fixa no canto superior esquerdo com fundo branco e sombra
- **Logo Horizontal**: Usada no header ao lado do título, com separador visual
- Ambas as logos são carregadas automaticamente e otimizadas pelo Next.js

## Notas

- As logos são baixadas automaticamente do repositório GitHub
- O favicon é configurado automaticamente no `layout.tsx`
- As logos têm tamanhos responsivos e se adaptam ao layout

