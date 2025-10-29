import { configureMetaPixel } from '@jussimirvfx/meta-pixel-tracking';

// Prevenir inicialização dupla (causada por React StrictMode em dev)
// Usar window para garantir que seja global e persistente
declare global {
  interface Window {
    __META_PIXEL_CONFIGURED__?: boolean;
  }
}

if (!window.__META_PIXEL_CONFIGURED__) {
  // Configuração manual do Meta Pixel para Vite
  configureMetaPixel({
    PIXEL_ID: import.meta.env.VITE_META_PIXEL_ID || 'seu_pixel_id_aqui',
    ACCESS_TOKEN: import.meta.env.VITE_META_API_ACCESS_TOKEN || 'seu_access_token_aqui',
    TEST_EVENT_CODE: import.meta.env.VITE_META_TEST_EVENT_CODE || 'seu_test_code_aqui',
  });
  window.__META_PIXEL_CONFIGURED__ = true;
  console.log('✅ Meta Pixel inicializado');
} else {
  console.log('⚠️ Meta Pixel já estava configurado - pulando inicialização duplicada');
}

// Log da configuração (apenas em desenvolvimento)
if (import.meta.env.DEV) {
  console.log('🔧 Meta Pixel Config:', {
    pixelId: import.meta.env.VITE_META_PIXEL_ID ? '✅ Configurado' : '❌ Não configurado',
    accessToken: import.meta.env.VITE_META_API_ACCESS_TOKEN ? '✅ Configurado' : '❌ Não configurado',
    testEventCode: import.meta.env.VITE_META_TEST_EVENT_CODE ? '✅ Configurado' : '❌ Não configurado',
    webhookUrl: import.meta.env.VITE_FORM_WEBHOOK_URL ? '✅ Configurado' : '❌ Não configurado',
  });
}

