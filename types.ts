
import React from 'react';

export interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  location: string;
  image: string;
}

export interface Step {
  step: number;
  title: string;
  description: string;
}

// Tipos para o sistema de lead scoring
export interface FormData {
  // Campos obrigatórios para Advanced Matching
  nome: string;
  email: string;
  telefone: string;
  
  // Campos opcionais (melhoram match rate)
  cidade: string;
  estado: string;
  cep: string;
  pais: string;
  
  // Campos específicos do negócio
  nomeLoja: string;
  cnpj: string;
  tipoLoja: string;
  tempoCnpj: string;
  possuiLojaFisica: string;
  possuiInscricaoEstadual: string;
  instagramLoja: string;
}

export interface LeadData {
  // Dados do usuário para Meta Tracking
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  
  // Metadados do evento
  value: number;
  currency: string;
  content_name: string;
  content_category: string;
  lead_score: number;
  
  // Dados específicos do negócio
  store_name: string;
  cnpj: string;
  store_type: string;
  cnpj_time: string;
  has_physical_store: string;
  has_state_registration: string;
  instagram_store: string;
}

export interface LeadScoreConfig {
  lastUpdated: string;
  stateConfig: {
    question: string;
    priorityStates: string[];
    disqualifyNonPriority: boolean;
    pointsForPriorityState: number;
  };
  questions: QuestionConfig[];
}

export interface QuestionConfig {
  id: string;
  question: string;
  type: "single-choice" | "yes-no";
  enabled: boolean;
  isDefault: boolean;
  disqualifyOnNo: boolean;
  options: QuestionOption[];
}

export interface QuestionOption {
  value: string;
  label: string;
  points: number;
  disqualifies: boolean;
}

