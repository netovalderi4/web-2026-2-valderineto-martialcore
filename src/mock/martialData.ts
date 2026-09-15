import type {
  ModalityMetadata,
  Student,
  Instructor,
  ClassSchedule,
  Plan,
  Invoice,
  TechnicalEvaluation,
  TrialBooking
} from '../types/martial';

export const MODALITIES_DATA: ModalityMetadata[] = [
  {
    id: 'bjj',
    name: 'Brazilian Jiu-Jitsu',
    tagline: 'Faixas, Graus e Carência (Gi & No-Gi)',
    graduationType: 'faixas_graus',
    accentColor: '#3b82f6',
    iconName: 'Shield',
    defaultTimeRequirementMonths: 12,
    minClassesForPromotion: 80,
    specificRules: [
      'Carência mínima por faixa (Branca, Azul, Roxa, Marrom, Preta, Coral)',
      'Até 4 graus intermediários antes da mudança de faixa',
      'Controle separado de presenças com quimono (Gi) e sem quimono (No-Gi)'
    ]
  },
  {
    id: 'muay_thai',
    name: 'Muay Thai',
    tagline: 'Cordéis (Prajied / Kruang) & Sparring',
    graduationType: 'cordeis',
    accentColor: '#ef4444',
    iconName: 'Flame',
    defaultTimeRequirementMonths: 6,
    minClassesForPromotion: 50,
    specificRules: [
      'Graduação por Prajied / Kruang (Branco a Preto)',
      'Acompanhamento de rounds de sparring e minutagem',
      'Controle de corte de peso e pesagens pré-exame'
    ]
  },
  {
    id: 'karate',
    name: 'Karatê',
    tagline: 'Kyu, Dan & Avaliação Kata / Kumite',
    graduationType: 'kyu_dan',
    accentColor: '#f59e0b',
    iconName: 'Swords',
    defaultTimeRequirementMonths: 6,
    minClassesForPromotion: 60,
    specificRules: [
      'Sistema de Kyu (cores) até faixas pretas (Dan)',
      'Registro do estilo marcial (Shotokan, Goju-Ryu, Shito-Ryu, Wado-Ryu)',
      'Avaliação segmentada com notas de Kata (formas) e Kumite (combate)'
    ]
  },
  {
    id: 'judo',
    name: 'Judô',
    tagline: 'Sistema Gokyo & Técnicas CBJ',
    graduationType: 'gokyo',
    accentColor: '#10b981',
    iconName: 'Zap',
    defaultTimeRequirementMonths: 8,
    minClassesForPromotion: 70,
    specificRules: [
      'Sequência tradicional de faixas pelo sistema Gokyo no Waza',
      'Mapeamento de técnicas dominadas: Nage-waza (projeção) e Katame-waza (solo)',
      'Registro e validação de filiação junto à CBJ (Confederação Brasileira de Judô)'
    ]
  },
  {
    id: 'capoeira',
    name: 'Capoeira',
    tagline: 'Cordéis por Estilo & Batizados',
    graduationType: 'cordoes_estilo',
    accentColor: '#eab308',
    iconName: 'Music',
    defaultTimeRequirementMonths: 12,
    minClassesForPromotion: 60,
    specificRules: [
      'Cordéis e cordões específicos por linhagem (Regional, Angola, Contemporânea)',
      'Histórico de batizados e trocas de cordel',
      'Domínio obrigatório de fundamentos e instrumentos (Berimbau, Pandeiro, Atabaque)'
    ]
  },
  {
    id: 'boxing',
    name: 'Boxe',
    tagline: 'Categorias de Peso, Sparring & Minutagem',
    graduationType: 'tempo_pesagem',
    accentColor: '#8b5cf6',
    iconName: 'Dumbbell',
    defaultTimeRequirementMonths: 4,
    minClassesForPromotion: 40,
    specificRules: [
      'Evolução contínua sem faixas tradicionais',
      'Classificação por categorias de peso oficiais',
      'Histórico periódico de pesagens e minutagem acumulada em ringue'
    ]
  }
];

export const INSTRUCTORS_DATA: Instructor[] = [
  {
    id: 'inst-1',
    name: 'Mestre Rodrigo "Cavalo" Silva',
    email: 'rodrigo.bjj@martialcore.com',
    phone: '(84) 99876-1122',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Faixa Preta 4º Grau de BJJ pela CBJJ, com mais de 20 anos de tatame e experiência internacional.',
    authorizedModalities: ['bjj'],
    highestRanks: { bjj: 'Faixa Preta 4º Grau' }
  },
  {
    id: 'inst-2',
    name: 'Kru Marcos "Trovão" Lima',
    email: 'marcos.thai@martialcore.com',
    phone: '(84) 99123-4567',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Formado na Tailândia (Bangkok), especialista em corte de peso e preparação para lutas profissionais.',
    authorizedModalities: ['muay_thai', 'boxing'],
    highestRanks: { muay_thai: 'Prajied Preto / Ponta Vermelha', boxing: 'Treinador Elite' }
  },
  {
    id: 'inst-3',
    name: 'Sensei Kenji Takahashi',
    email: 'kenji.karate@martialcore.com',
    phone: '(84) 98765-4321',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Faixa Preta 5º Dan de Karatê Shotokan e 3º Dan de Judô com filiação ativa na CBK e CBJ.',
    authorizedModalities: ['karate', 'judo'],
    highestRanks: { karate: '5º Dan (Godan)', judo: '3º Dan (Sandan)' }
  },
  {
    id: 'inst-4',
    name: 'Mestre Besouro (Luiz Otávio)',
    email: 'besouro.capoeira@martialcore.com',
    phone: '(84) 99444-8899',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    bio: 'Mestre de Capoeira Regional e Contemporânea, tocador de Berimbau Gunga e organizador de batizados no RN.',
    authorizedModalities: ['capoeira'],
    highestRanks: { capoeira: 'Cordel Branco (Mestre)' }
  }
];

export const STUDENTS_DATA: Student[] = [
  {
    id: 'stud-1',
    name: 'Lucas Mendonça de Sá',
    email: 'lucas.mendonca@email.com',
    phone: '(84) 98111-2233',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    birthDate: '1998-05-14',
    emergencyContact: 'Mãe: (84) 98888-1122',
    enrollmentDate: '2023-02-10',
    currentWeightKg: 82.5,
    weightCategory: 'Peso Médio',
    modalities: [
      {
        modalityId: 'bjj',
        currentRank: 'Faixa Azul',
        degrees: 3,
        lastExamDate: '2025-08-15',
        classesAttendedInCurrentRank: 84,
        classesRequired: 80,
        monthsInCurrentRank: 13,
        monthsRequired: 12,
        isReadyForPromotion: true
      },
      {
        modalityId: 'muay_thai',
        currentRank: 'Prajied Branco e Vermelho',
        lastExamDate: '2025-11-20',
        classesAttendedInCurrentRank: 32,
        classesRequired: 50,
        monthsInCurrentRank: 4,
        monthsRequired: 6,
        isReadyForPromotion: false
      }
    ],
    activePlanId: 'plan-multi-1',
    paymentStatus: 'adimplente'
  },
  {
    id: 'stud-2',
    name: 'Beatriz Vasconcelos',
    email: 'beatriz.v@email.com',
    phone: '(84) 99455-6677',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    birthDate: '2001-09-22',
    emergencyContact: 'Pai: (84) 99777-3344',
    enrollmentDate: '2024-01-15',
    currentWeightKg: 58.0,
    weightCategory: 'Peso Mosca',
    cbjRegistration: 'CBJ-RN-2024-8891',
    modalities: [
      {
        modalityId: 'judo',
        currentRank: 'Faixa Verde (3º Kyu)',
        lastExamDate: '2025-06-10',
        classesAttendedInCurrentRank: 75,
        classesRequired: 70,
        monthsInCurrentRank: 9,
        monthsRequired: 8,
        isReadyForPromotion: true
      }
    ],
    activePlanId: 'plan-judo',
    paymentStatus: 'adimplente'
  },
  {
    id: 'stud-3',
    name: 'Carlos Eduardo "Dudu"',
    email: 'carlos.dudu@email.com',
    phone: '(84) 98712-3490',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    birthDate: '1995-11-03',
    emergencyContact: 'Esposa: (84) 98112-9988',
    enrollmentDate: '2023-09-01',
    currentWeightKg: 74.8,
    weightCategory: 'Meio-Médio',
    modalities: [
      {
        modalityId: 'boxing',
        currentRank: 'Avançado / Competidor',
        lastExamDate: '2025-10-01',
        classesAttendedInCurrentRank: 92,
        classesRequired: 40,
        monthsInCurrentRank: 6,
        monthsRequired: 4,
        isReadyForPromotion: true
      }
    ],
    activePlanId: 'plan-boxe',
    paymentStatus: 'pendente'
  },
  {
    id: 'stud-4',
    name: 'Juliana Paiva',
    email: 'juliana.paiva@email.com',
    phone: '(84) 99888-4455',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    birthDate: '2000-03-18',
    emergencyContact: 'Irmã: (84) 99666-5544',
    enrollmentDate: '2024-04-10',
    currentWeightKg: 62.0,
    modalities: [
      {
        modalityId: 'karate',
        currentRank: 'Faixa Vermelha (4º Kyu)',
        style: 'Shotokan',
        lastExamDate: '2025-09-05',
        classesAttendedInCurrentRank: 42,
        classesRequired: 60,
        monthsInCurrentRank: 5,
        monthsRequired: 6,
        isReadyForPromotion: false
      }
    ],
    activePlanId: 'plan-karate',
    paymentStatus: 'atrasado'
  },
  {
    id: 'stud-5',
    name: 'Gabriel "Ginga" Santos',
    email: 'gabriel.ginga@email.com',
    phone: '(84) 99222-7711',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    birthDate: '1997-07-28',
    emergencyContact: 'Tio: (84) 99333-1122',
    enrollmentDate: '2023-05-15',
    currentWeightKg: 70.0,
    modalities: [
      {
        modalityId: 'capoeira',
        currentRank: 'Cordel Amarelo e Laranja',
        style: 'Regional',
        lastExamDate: '2025-07-20',
        classesAttendedInCurrentRank: 64,
        classesRequired: 60,
        monthsInCurrentRank: 14,
        monthsRequired: 12,
        isReadyForPromotion: true
      }
    ],
    activePlanId: 'plan-capoeira',
    paymentStatus: 'adimplente'
  },
  {
    id: 'stud-6',
    name: 'Matheus Albuquerque',
    email: 'matheus.a@email.com',
    phone: '(84) 98877-6655',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80',
    birthDate: '2003-12-05',
    emergencyContact: 'Mãe: (84) 98111-4477',
    enrollmentDate: '2024-06-01',
    currentWeightKg: 78.0,
    modalities: [
      {
        modalityId: 'bjj',
        currentRank: 'Faixa Branca',
        degrees: 2,
        lastExamDate: '2025-10-15',
        classesAttendedInCurrentRank: 38,
        classesRequired: 80,
        monthsInCurrentRank: 5,
        monthsRequired: 12,
        isReadyForPromotion: false
      }
    ],
    activePlanId: 'plan-bjj',
    paymentStatus: 'adimplente'
  }
];

export const PLANS_DATA: Plan[] = [
  {
    id: 'plan-bjj',
    name: 'Plano BJJ Prime (Gi + No-Gi)',
    type: 'individual',
    modalitiesIncluded: ['bjj'],
    priceMonthly: 150.0,
    description: 'Acesso total às aulas de Jiu-Jitsu com e sem quimono, 5x por semana.'
  },
  {
    id: 'plan-thai',
    name: 'Plano Muay Thai Striking',
    type: 'individual',
    modalitiesIncluded: ['muay_thai'],
    priceMonthly: 130.0,
    description: 'Treinos diários de fundamentos, saco pesado, clinch e sparring guiado.'
  },
  {
    id: 'plan-karate',
    name: 'Plano Karatê Do',
    type: 'individual',
    modalitiesIncluded: ['karate'],
    priceMonthly: 120.0,
    description: 'Treino de Kata e Kumite tradicional com linhagem Shotokan reconhecida.'
  },
  {
    id: 'plan-judo',
    name: 'Plano Judô Tradicional',
    type: 'individual',
    modalitiesIncluded: ['judo'],
    priceMonthly: 130.0,
    description: 'Domínio do sistema Gokyo e filiação federativa oficial CBJ.'
  },
  {
    id: 'plan-capoeira',
    name: 'Plano Capoeira Mandinga',
    type: 'individual',
    modalitiesIncluded: ['capoeira'],
    priceMonthly: 110.0,
    description: 'Aulas de movimento, fundamentos de roda, batizados e musicalidade.'
  },
  {
    id: 'plan-boxe',
    name: 'Plano Boxe Nobre Arte',
    type: 'individual',
    modalitiesIncluded: ['boxing'],
    priceMonthly: 130.0,
    description: 'Aperfeiçoamento de footwork, técnicas de golpe e rounds de sparring.'
  },
  {
    id: 'plan-multi-1',
    name: 'Combo Guerreiro: BJJ + Muay Thai',
    type: 'multi_artes',
    modalitiesIncluded: ['bjj', 'muay_thai'],
    priceMonthly: 220.0,
    description: 'Treine luta agarrada e luta em pé com desconto especial de pacote.',
    badge: 'Mais Popular'
  },
  {
    id: 'plan-multi-all',
    name: 'Passaporte Total MartialCore (Multi-Artes)',
    type: 'multi_artes',
    modalitiesIncluded: ['bjj', 'muay_thai', 'karate', 'judo', 'capoeira', 'boxing'],
    priceMonthly: 290.0,
    description: 'Livre acesso a todos os tatames e ringues em todas as 6 artes marciais.',
    badge: 'Acesso VIP'
  }
];

export const SCHEDULES_DATA: ClassSchedule[] = [
  {
    id: 'sch-1',
    modalityId: 'bjj',
    title: 'BJJ Fundamentos (Gi)',
    instructorId: 'inst-1',
    instructorName: 'Mestre Rodrigo Silva',
    dayOfWeek: 'Segunda',
    startTime: '07:00',
    endTime: '08:30',
    space: 'Tatame 1',
    capacity: 25,
    enrolledCount: 18,
    isGiCompatible: true,
    openForTrial: true
  },
  {
    id: 'sch-2',
    modalityId: 'muay_thai',
    title: 'Muay Thai Sparring & Clinch',
    instructorId: 'inst-2',
    instructorName: 'Kru Marcos Lima',
    dayOfWeek: 'Segunda',
    startTime: '18:00',
    endTime: '19:30',
    space: 'Ringue de Luta',
    capacity: 20,
    enrolledCount: 16,
    openForTrial: true
  },
  {
    id: 'sch-3',
    modalityId: 'karate',
    title: 'Karatê Shotokan Kata & Kumite',
    instructorId: 'inst-3',
    instructorName: 'Sensei Kenji Takahashi',
    dayOfWeek: 'Terça',
    startTime: '19:00',
    endTime: '20:30',
    space: 'Tatame 2',
    capacity: 20,
    enrolledCount: 12,
    openForTrial: true
  },
  {
    id: 'sch-4',
    modalityId: 'judo',
    title: 'Judô Gokyo: Projeções (Nage-waza)',
    instructorId: 'inst-3',
    instructorName: 'Sensei Kenji Takahashi',
    dayOfWeek: 'Quarta',
    startTime: '18:30',
    endTime: '20:00',
    space: 'Tatame 1',
    capacity: 25,
    enrolledCount: 20,
    openForTrial: true
  },
  {
    id: 'sch-5',
    modalityId: 'bjj',
    title: 'BJJ No-Gi Avançado (Submission)',
    instructorId: 'inst-1',
    instructorName: 'Mestre Rodrigo Silva',
    dayOfWeek: 'Quarta',
    startTime: '20:00',
    endTime: '21:30',
    space: 'Tatame 1',
    capacity: 25,
    enrolledCount: 22,
    isGiCompatible: false,
    openForTrial: false
  },
  {
    id: 'sch-6',
    modalityId: 'capoeira',
    title: 'Capoeira Regional & Roda',
    instructorId: 'inst-4',
    instructorName: 'Mestre Besouro',
    dayOfWeek: 'Quinta',
    startTime: '19:30',
    endTime: '21:00',
    space: 'Tatame 2',
    capacity: 30,
    enrolledCount: 19,
    openForTrial: true
  },
  {
    id: 'sch-7',
    modalityId: 'boxing',
    title: 'Boxe Nobre Arte: Sparring & Alvos',
    instructorId: 'inst-2',
    instructorName: 'Kru Marcos Lima',
    dayOfWeek: 'Sexta',
    startTime: '18:00',
    endTime: '19:30',
    space: 'Ringue de Luta',
    capacity: 16,
    enrolledCount: 14,
    openForTrial: true
  }
];

export const INVOICES_DATA: Invoice[] = [
  {
    id: 'inv-101',
    studentId: 'stud-1',
    studentName: 'Lucas Mendonça de Sá',
    planName: 'Combo Guerreiro: BJJ + Muay Thai',
    amount: 220.0,
    dueDate: '2026-03-10',
    paymentDate: '2026-03-08',
    paymentMethod: 'PIX',
    status: 'pago'
  },
  {
    id: 'inv-102',
    studentId: 'stud-2',
    studentName: 'Beatriz Vasconcelos',
    planName: 'Plano Judô Tradicional',
    amount: 130.0,
    dueDate: '2026-03-12',
    paymentDate: '2026-03-11',
    paymentMethod: 'Cartão de Crédito',
    status: 'pago'
  },
  {
    id: 'inv-103',
    studentId: 'stud-3',
    studentName: 'Carlos Eduardo "Dudu"',
    planName: 'Plano Boxe Nobre Arte',
    amount: 130.0,
    dueDate: '2026-03-05',
    status: 'pendente'
  },
  {
    id: 'inv-104',
    studentId: 'stud-4',
    studentName: 'Juliana Paiva',
    planName: 'Plano Karatê Do',
    amount: 120.0,
    dueDate: '2026-02-25',
    status: 'atrasado'
  },
  {
    id: 'inv-105',
    studentId: 'stud-5',
    studentName: 'Gabriel "Ginga" Santos',
    planName: 'Plano Capoeira Mandinga',
    amount: 110.0,
    dueDate: '2026-03-15',
    paymentDate: '2026-03-14',
    paymentMethod: 'PIX',
    status: 'pago'
  },
  {
    id: 'inv-106',
    studentId: 'stud-6',
    studentName: 'Matheus Albuquerque',
    planName: 'Plano BJJ Prime (Gi + No-Gi)',
    amount: 150.0,
    dueDate: '2026-03-20',
    status: 'pendente'
  }
];

export const TECHNICAL_EVALUATIONS_DATA: TechnicalEvaluation[] = [
  {
    id: 'eval-1',
    studentId: 'stud-1',
    studentName: 'Lucas Mendonça de Sá',
    modalityId: 'bjj',
    instructorId: 'inst-1',
    instructorName: 'Mestre Rodrigo Silva',
    date: '2026-02-28',
    notes: 'Excelente controle de meia guarda profunda e transição para as costas. Recomendo 4º grau.',
    bjjEvaluation: {
      guardPassing: 9.0,
      submissions: 8.5,
      escapes: 8.0,
      recommendedDegree: 4
    }
  },
  {
    id: 'eval-2',
    studentId: 'stud-2',
    studentName: 'Beatriz Vasconcelos',
    modalityId: 'judo',
    instructorId: 'inst-3',
    instructorName: 'Sensei Kenji Takahashi',
    date: '2026-03-02',
    notes: 'Domínio claro das projeções do Gokyo e transições para imobilização em solo.',
    judoEvaluation: {
      nageWazaMastered: ['Ippon Seoi Nage', 'Osoto Gari', 'Harai Goshi', 'Uchi Mata'],
      katameWazaMastered: ['Kesa Gatame', 'Yoko Shiho Gatame', 'Juji Gatame'],
      cbjStatus: 'ativo'
    }
  },
  {
    id: 'eval-3',
    studentId: 'stud-4',
    studentName: 'Juliana Paiva',
    modalityId: 'karate',
    instructorId: 'inst-3',
    instructorName: 'Sensei Kenji Takahashi',
    date: '2026-02-15',
    notes: 'Execução do Kata Heian Yondan com boa estabilidade e base Kosa-dachi.',
    karateEvaluation: {
      style: 'Shotokan',
      kataName: 'Heian Yondan',
      kataScore: 8.4,
      kumiteScore: 7.8
    }
  },
  {
    id: 'eval-4',
    studentId: 'stud-3',
    studentName: 'Carlos Eduardo "Dudu"',
    modalityId: 'boxing',
    instructorId: 'inst-2',
    instructorName: 'Kru Marcos Lima',
    date: '2026-03-05',
    notes: 'Boa esquiva rotacional e contragolpes de jab-direto no ringue.',
    boxingEvaluation: {
      sparringMinutesRecorded: 180,
      weightRecordedKg: 74.8,
      weightCategory: 'Meio-Médio',
      footworkScore: 9.0,
      defenseScore: 8.5
    }
  }
];

export const TRIAL_BOOKINGS_DATA: TrialBooking[] = [
  {
    id: 'trial-1',
    fullName: 'Renato Silveira',
    whatsapp: '(84) 99111-8899',
    email: 'renato.silveira@email.com',
    modalityId: 'bjj',
    classId: 'sch-1',
    date: '2026-03-18',
    status: 'confirmado'
  },
  {
    id: 'trial-2',
    fullName: 'Mariana Duarte',
    whatsapp: '(84) 99888-7744',
    email: 'mariana.d@email.com',
    modalityId: 'muay_thai',
    classId: 'sch-2',
    date: '2026-03-19',
    status: 'confirmado'
  }
];

