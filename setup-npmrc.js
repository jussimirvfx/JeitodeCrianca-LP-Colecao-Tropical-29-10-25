#!/usr/bin/env node

// Script para configurar .npmrc durante o build no Vercel
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const npmrcPath = path.join(__dirname, '.npmrc');
const token = process.env.GITHUB_TOKEN;

console.log('🔧 Configurando .npmrc para GitHub Packages...');
console.log('📍 Diretório:', __dirname);

if (!token) {
  console.error('❌ GITHUB_TOKEN não encontrado nas variáveis de ambiente');
  const relevantEnvVars = Object.keys(process.env).filter(k => 
    k.includes('TOKEN') || k.includes('GITHUB') || k.includes('NPM')
  );
  console.error('⚠️  Variáveis de ambiente relacionadas:', relevantEnvVars.length > 0 ? relevantEnvVars.join(', ') : 'nenhuma encontrada');
  console.error('📋 Todas as variáveis VERCEL:', Object.keys(process.env).filter(k => k.startsWith('VERCEL')).join(', ') || 'nenhuma');
  // No Vercel, falhar se não tiver token
  if (process.env.VERCEL || process.env.CI) {
    console.error('❌ Build em ambiente CI/Vercel requer GITHUB_TOKEN configurado');
    process.exit(1);
  } else {
    console.warn('⚠️  Executando em desenvolvimento local - .npmrc não será criado');
    process.exit(0);
  }
}

console.log('✅ Token encontrado (primeiros 4 caracteres):', token.substring(0, 4) + '...');

const npmrcContent = `@jussimirvfx:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${token}
always-auth=true
`;

try {
  fs.writeFileSync(npmrcPath, npmrcContent, 'utf8');
  console.log('✅ .npmrc configurado com sucesso em:', npmrcPath);
  
  // Verificar se foi criado corretamente
  const created = fs.readFileSync(npmrcPath, 'utf8');
  if (created.includes(token)) {
    console.log('✅ .npmrc verificado - token incluído corretamente');
  } else {
    console.error('❌ .npmrc criado mas token não encontrado no arquivo');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Erro ao criar .npmrc:', error.message);
  process.exit(1);
}
