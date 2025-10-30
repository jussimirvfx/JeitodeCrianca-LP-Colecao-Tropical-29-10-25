import { LeadScoreConfig } from './types';

export const leadScoreConfig: LeadScoreConfig = {
  lastUpdated: "2025-10-30T00:00:00.000Z",
  stateConfig: {
    question: "Em qual estado está localizado?",
    priorityStates: [],
    disqualifyNonPriority: false,
    pointsForPriorityState: 0
  },
  questions: [
    {
      id: "storeType",
      question: "Tipo de loja",
      type: "single-choice",
      enabled: true,
      isDefault: false,
      disqualifyOnNo: false,
      options: [
        {
          value: "infantil_juvenil",
          label: "Loja Infantil/Juvenil",
          points: 30,
          disqualifies: false
        },
        {
          value: "multimarcas",
          label: "Loja Multimarcas",
          points: 20,
          disqualifies: false
        },
        {
          value: "atacado_magazine",
          label: "Atacado/Magazine",
          points: 15,
          disqualifies: false
        },
        {
          value: "ecommerce",
          label: "Loja online/E-commerce",
          points: 10,
          disqualifies: false
        },
        {
          value: "sacoleira",
          label: "Sacoleira",
          points: 2,
          disqualifies: false
        }
      ]
    },
    {
      id: "cnpjTime",
      question: "Tempo de CNPJ:",
      type: "single-choice",
      enabled: true,
      isDefault: false,
      disqualifyOnNo: false,
      options: [
        {
          value: "3+ years",
          label: "3 anos ou mais",
          points: 37,
          disqualifies: false
        },
        {
          value: "1-2 years",
          label: "1 a 2 anos",
          points: 10,
          disqualifies: false
        },
        {
          value: "<1 year",
          label: "Menos de um ano",
          points: 5,
          disqualifies: false
        }
      ]
    },
    {
      id: "hasPhysicalStore",
      question: "Possui loja física?",
      type: "yes-no",
      enabled: true,
      isDefault: false,
      disqualifyOnNo: false,
      options: [
        {
          value: "yes",
          label: "Sim",
          points: 22,
          disqualifies: false
        },
        {
          value: "no",
          label: "Não",
          points: 5,
          disqualifies: false
        }
      ]
    },
    {
      id: "hasStateRegistration",
      question: "Possui Inscrição Estadual?",
      type: "yes-no",
      enabled: true,
      isDefault: false,
      disqualifyOnNo: false,
      options: [
        {
          value: "yes",
          label: "Sim",
          points: 10,
          disqualifies: false
        },
        {
          value: "no",
          label: "Não",
          points: 1,
          disqualifies: false
        }
      ]
    }
  ]
};

