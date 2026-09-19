export type ModalityId = 'bjj' | 'muay_thai' | 'karate' | 'judo' | 'capoeira' | 'boxing';

export type UserRole = 'admin' | 'instructor' | 'student' | 'visitor';

export interface ModalityMetadata {
  id: ModalityId;
  name: string;
  shortName: string; // Ex: 'BJJ', 'Muay Thai', 'Karatê', 'Judô', 'Capoeira', 'Boxe'
  tagline: string;
  graduationType: 'faixas_graus' | 'cordeis' | 'kyu_dan' | 'gokyo' | 'cordoes_estilo' | 'tempo_pesagem';
  accentColor: string;
  iconName: string;
  bannerImage?: string; // Caminho para o banner em /images/modalities/ da vitrine
  heroImage?: string; // Caminho para a imagem widescreen 16:9 preenchendo o banner interno do sistema
  defaultTimeRequirementMonths: number;
  minClassesForPromotion: number;
  specificRules: string[];
}

export interface StudentGraduation {
  modalityId: ModalityId;
  currentRank: string; // ex: 'Faixa Azul', 'Cordel Vermelho', '3º Kyu'
  degrees?: number; // 0 a 4 para BJJ
  style?: string; // ex: 'Shotokan', 'Regional'
  lastExamDate: string;
  classesAttendedInCurrentRank: number;
  classesRequired: number;
  monthsInCurrentRank: number;
  monthsRequired: number;
  isReadyForPromotion: boolean;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  birthDate: string;
  emergencyContact: string;
  enrollmentDate: string;
  currentWeightKg: number;
  weightCategory?: string; // Boxe / Muay Thai
  cbjRegistration?: string; // Judô
  modalities: StudentGraduation[];
  activePlanId: string;
  paymentStatus: 'adimplente' | 'pendente' | 'atrasado';
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  authorizedModalities: ModalityId[];
  highestRanks: { [key in ModalityId]?: string };
}

export interface ClassSchedule {
  id: string;
  modalityId: ModalityId;
  title: string;
  instructorId: string;
  instructorName: string;
  dayOfWeek: 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado';
  startTime: string;
  endTime: string;
  space: 'Tatame 1' | 'Tatame 2' | 'Ringue de Luta' | 'Octógono';
  capacity: number;
  enrolledCount: number;
  isGiCompatible?: boolean; // Para BJJ (Gi ou No-Gi)
  openForTrial: boolean; // Aberto a alunos experimentais
}

export interface CheckInRecord {
  id: string;
  classId: string;
  studentId: string;
  studentName: string;
  modalityId: ModalityId;
  date: string;
  isGi?: boolean; // BJJ: true = Gi, false = No-Gi
  attended: boolean;
}

export interface TechnicalEvaluation {
  id: string;
  studentId: string;
  studentName: string;
  modalityId: ModalityId;
  instructorId: string;
  instructorName: string;
  date: string;
  notes: string;
  bjjEvaluation?: {
    guardPassing: number;
    submissions: number;
    escapes: number;
    recommendedDegree?: number;
  };
  muayThaiEvaluation?: {
    roundsCompleted: number;
    clinchScore: number;
    strikingScore: number;
    weightRecordedKg: number;
  };
  karateEvaluation?: {
    style: string;
    kataName: string;
    kataScore: number;
    kumiteScore: number;
  };
  judoEvaluation?: {
    nageWazaMastered: string[];
    katameWazaMastered: string[];
    cbjStatus: 'ativo' | 'pendente';
  };
  capoeiraEvaluation?: {
    style: 'Regional' | 'Angola' | 'Contemporânea';
    instrumentDominance: string[];
    fundamentosScore: number;
    participatedInBatizado: boolean;
  };
  boxingEvaluation?: {
    sparringMinutesRecorded: number;
    weightRecordedKg: number;
    weightCategory: string;
    footworkScore: number;
    defenseScore: number;
  };
}

export interface Plan {
  id: string;
  name: string;
  type: 'individual' | 'multi_artes';
  modalitiesIncluded: ModalityId[];
  priceMonthly: number;
  description: string;
  badge?: string;
}

export interface Invoice {
  id: string;
  studentId: string;
  studentName: string;
  planName: string;
  amount: number;
  dueDate: string;
  paymentDate?: string;
  paymentMethod?: 'PIX' | 'Cartão de Crédito' | 'Boleto Bancário';
  status: 'pago' | 'pendente' | 'atrasado';
}

export interface TrialBooking {
  id: string;
  fullName: string;
  whatsapp: string;
  email: string;
  modalityId: ModalityId;
  classId: string;
  date: string;
  status: 'confirmado' | 'pendente' | 'realizado';
}

