import { FormData, LeadData } from './types';

// Interface para o payload do webhook
export interface WebhookPayload {
  // Dados do formulário
  formData: FormData;
  
  // Dados processados do lead
  leadData: LeadData;
  
  // Metadados do evento
  leadScore: number;
  priorityLevel: string;
  isQualified: boolean;
  
  // Informações da página
  pageUrl: string;
  pageTitle: string;
  userAgent: string;
  timestamp: string;
  
  // Informações do evento
  eventId: string;
  sessionId: string;
}

// Função para gerar ID único
export const generateEventId = (): string => {
  return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Função para gerar Session ID
export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('lead_session_id');
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('lead_session_id', sessionId);
  }
  return sessionId;
};

// Função auxiliar para enviar para um webhook específico
const sendToSingleWebhook = async (
  url: string, 
  payload: WebhookPayload, 
  webhookName: string
): Promise<boolean> => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Jeito-de-Crianca-Landing-Page/1.0',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log(`✅ Dados enviados para ${webhookName} com sucesso`);
      return true;
    } else {
      console.error(`❌ Erro ao enviar para ${webhookName}:`, response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error(`❌ Erro ao enviar para ${webhookName}:`, error);
    return false;
  }
};

// Função para enviar dados para TODOS os webhooks (Make e LeadConnector)
export const sendToWebhook = async (payload: WebhookPayload): Promise<boolean> => {
  const makeWebhookUrl = import.meta.env.VITE_FORM_WEBHOOK_URL;
  const leadConnectorWebhookUrl = import.meta.env.VITE_LEADCONNECTOR_WEBHOOK_URL;
  
  // Verificar se pelo menos um webhook está configurado
  if (!makeWebhookUrl && !leadConnectorWebhookUrl) {
    console.warn('⚠️ Nenhum webhook configurado (VITE_FORM_WEBHOOK_URL e VITE_LEADCONNECTOR_WEBHOOK_URL)');
    return false;
  }

  // Criar array de promises para envio paralelo
  const webhookPromises: Promise<boolean>[] = [];
  
  // Adicionar envio para Make (se configurado)
  if (makeWebhookUrl) {
    console.log('📤 Enviando para Make webhook...');
    webhookPromises.push(sendToSingleWebhook(makeWebhookUrl, payload, 'Make'));
  } else {
    console.warn('⚠️ VITE_FORM_WEBHOOK_URL não configurada');
  }
  
  // Adicionar envio para LeadConnector (OBRIGATÓRIO)
  if (leadConnectorWebhookUrl) {
    console.log('📤 Enviando para LeadConnector webhook...');
    webhookPromises.push(sendToSingleWebhook(leadConnectorWebhookUrl, payload, 'LeadConnector'));
  } else {
    console.error('❌ VITE_LEADCONNECTOR_WEBHOOK_URL não configurada (OBRIGATÓRIO)');
    return false;
  }

  try {
    // Enviar para todos os webhooks em paralelo
    const results = await Promise.allSettled(webhookPromises);
    
    // Analisar resultados
    const successCount = results.filter(
      result => result.status === 'fulfilled' && result.value === true
    ).length;
    
    const totalWebhooks = results.length;
    
    console.log(`📊 Webhooks: ${successCount}/${totalWebhooks} enviados com sucesso`);
    
    // Retornar true se PELO MENOS o LeadConnector foi enviado com sucesso
    // (já que é obrigatório)
    const leadConnectorIndex = makeWebhookUrl ? 1 : 0;
    const leadConnectorResult = results[leadConnectorIndex];
    
    if (leadConnectorResult.status === 'fulfilled' && leadConnectorResult.value === true) {
      console.log('✅ LeadConnector webhook enviado com sucesso (OBRIGATÓRIO)');
      return true;
    } else {
      console.error('❌ Falha ao enviar para LeadConnector (OBRIGATÓRIO)');
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao enviar webhooks:', error);
    return false;
  }
};

// Função para preparar payload do webhook
export const prepareWebhookPayload = (
  formData: FormData, 
  leadData: LeadData, 
  leadScore: number, 
  isQualified: boolean
): WebhookPayload => {
  return {
    formData,
    leadData,
    leadScore,
    priorityLevel: getPriorityLevel(leadScore),
    isQualified,
    pageUrl: window.location.href,
    pageTitle: document.title,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    eventId: generateEventId(),
    sessionId: getSessionId(),
  };
};

// Função para obter nível de prioridade (copiada do leadScoringUtils)
const getPriorityLevel = (score: number): string => {
  if (score >= 80) return "ALTA PRIORIDADE - Lead qualificado para contato imediato";
  if (score >= 60) return "MÉDIA-ALTA PRIORIDADE - Lead com bom potencial";
  if (score >= 40) return "MÉDIA PRIORIDADE - Lead para nurturing";
  if (score >= 20) return "BAIXA PRIORIDADE - Lead com potencial limitado";
  if (score >= 0) return "MUITO BAIXA PRIORIDADE - Lead pouco qualificado";
  return "NÃO QUALIFICADO - Score limitado a 10 pts";
};

