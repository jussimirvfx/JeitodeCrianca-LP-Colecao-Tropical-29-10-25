# 🔧 Configuração do Vercel para GitHub Packages

Este projeto usa o pacote privado `@jussimirvfx/meta-pixel-tracking` do GitHub Packages.

## ⚙️ Configuração Necessária no Vercel

Para que o build funcione no Vercel, você precisa configurar a variável de ambiente:

### 1. Acesse as configurações do projeto no Vercel

1. Vá para o dashboard do Vercel
2. Selecione o projeto
3. Vá em **Settings** → **Environment Variables**

### 2. Adicione as variáveis de ambiente

#### Variável obrigatória para GitHub Packages:

**Nome:** `GITHUB_TOKEN`  
**Valor:** `seu_github_token_aqui` (exemplo: `ghp_xxxxxxxxxxxxxxxxxxxx`)  
**Environment:** Todos (Production, Preview, Development)

#### Variáveis obrigatórias para Meta Pixel:

**Nome:** `VITE_META_PIXEL_ID`  
**Valor:** `seu_pixel_id_aqui` (exemplo: `123456789012345`)  
**Environment:** Todos (Production, Preview, Development)

**Nome:** `VITE_META_API_ACCESS_TOKEN`  
**Valor:** `seu_access_token_aqui` (exemplo: `EAAP5yQs70lw...`)  
**Environment:** Todos (Production, Preview, Development)

**Nome:** `VITE_META_TEST_EVENT_CODE` (opcional)  
**Valor:** `seu_test_code_aqui` (exemplo: `TEST12345`)  
**Environment:** Todos (Production, Preview, Development)

⚠️ **IMPORTANTE:** Mantenha estas variáveis privadas e não compartilhe publicamente.

### 3. Como funciona

O arquivo `vercel.json` foi configurado para executar o script `setup-npmrc.js` antes do `npm install`, criando o arquivo `.npmrc` com a autenticação necessária para acessar o GitHub Packages.

**Importante:** Certifique-se de que a variável `GITHUB_TOKEN` está configurada para **TODOS** os ambientes (Production, Preview e Development).

## ✅ Verificação

Após adicionar a variável de ambiente:
1. Faça um novo deploy (ou force um redeploy)
2. O build deve funcionar sem erros de autenticação
3. O pacote `@jussimirvfx/meta-pixel-tracking` será instalado corretamente

## 🔄 Atualização do Token

Se o token expirar ou for revogado, você precisará:
1. Gerar um novo token no GitHub (com permissões `read:packages`)
2. Atualizar a variável `GITHUB_TOKEN` no Vercel
3. Fazer um novo deploy

