import { FormData, LeadData } from './types';
import { leadScoreConfig } from './leadScoreConfig';

// Funções de validação
export const validarTelefone = (telefone: string): boolean => {
  // Remove formatação e verifica se tem 10 ou 11 dígitos
  const numeros = telefone.replace(/\D/g, '');
  return numeros.length >= 10 && numeros.length <= 11;
};

export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validarNome = (nome: string): boolean => {
  // Nome deve ter pelo menos 3 caracteres
  return nome.trim().length >= 3;
};

export const validarCNPJ = (cnpj: string): boolean => {
  // Remove formatação
  const numeros = cnpj.replace(/\D/g, '');
  return numeros.length === 14;
};

// Função de lead scoring
export const calculateLeadScore = (formData: FormData): number => {
  let score = 0;
  
  // Calcular pontos baseado nas perguntas configuradas
  for (const question of leadScoreConfig.questions) {
    if (!question.enabled) continue;
    
    let answerValue = '';
    switch (question.id) {
      case 'storeType':
        answerValue = formData.tipoLoja;
        break;
      case 'cnpjTime':
        answerValue = formData.tempoCnpj;
        break;
      case 'hasPhysicalStore':
        answerValue = formData.possuiLojaFisica === 'sim' ? 'yes' : 'no';
        break;
      case 'hasStateRegistration':
        answerValue = formData.possuiInscricaoEstadual === 'sim' ? 'yes' : 'no';
        break;
    }
    
    // Encontrar a opção correspondente
    const option = question.options.find(opt => {
      if (question.type === 'single-choice') {
        return opt.label === answerValue;
      } else {
        return opt.value === answerValue;
      }
    });
    
    if (option) {
      score += option.points;
      if (option.disqualifies) {
        return 0; // Desqualificar se a opção desqualificar
      }
    }
  }
  
  return Math.min(score, 100); // Máximo 100 pontos
};

// Preparar dados para Meta Tracking
export const prepareLeadDataForMeta = (formData: FormData, leadScore: number): LeadData => {
  return {
    // Dados do usuário (use EXATAMENTE estes nomes)
    name: formData.nome,
    email: formData.email,
    phone: formData.telefone,
    city: formData.cidade,
    state: formData.estado,
    zip: formData.cep,
    country: formData.pais,
    
    // Metadados do evento
    value: leadScore >= 70 ? 100 : 25,  // Valor baseado na qualidade
    currency: 'BRL',
    content_name: 'Formulário de Contato',
    content_category: 'Lead Generation',
    lead_score: leadScore,
    
    // Dados específicos do negócio
    store_name: formData.nomeLoja,
    cnpj: formData.cnpj,
    store_type: formData.tipoLoja,
    cnpj_time: formData.tempoCnpj,
    has_physical_store: formData.possuiLojaFisica,
    has_state_registration: formData.possuiInscricaoEstadual,
    instagram_store: formData.instagramLoja
  };
};

// Obter nível de prioridade baseado no score
export const getPriorityLevel = (score: number): string => {
  if (score >= 80) return "ALTA PRIORIDADE - Lead qualificado para contato imediato";
  if (score >= 60) return "MÉDIA-ALTA PRIORIDADE - Lead com bom potencial";
  if (score >= 40) return "MÉDIA PRIORIDADE - Lead para nurturing";
  if (score >= 20) return "BAIXA PRIORIDADE - Lead com potencial limitado";
  if (score >= 0) return "MUITO BAIXA PRIORIDADE - Lead pouco qualificado";
  return "NÃO QUALIFICADO - Score limitado a 10 pts";
};

