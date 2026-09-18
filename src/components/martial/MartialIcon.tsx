import React from 'react';
import type { ModalityId } from '../../types/martial';

interface MartialIconProps {
  modality?: ModalityId | 'all';
  modalityId?: ModalityId | 'all';
  className?: string;
  size?: number;
}

export const MartialIcon: React.FC<MartialIconProps> = ({
  modality,
  modalityId,
  className = 'w-5 h-5',
  size = 20
}) => {
  const targetModality = modality || modalityId || 'all';
  const commonProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className
  };

  switch (targetModality) {
    // Brazilian Jiu-Jitsu: Kimono com lapelas cruzadas e nó de faixa central
    case 'bjj':
      return (
        <svg {...commonProps} aria-label="Ícone Jiu-Jitsu (Quimono)">
          {/* Gola / Lapelas cruzadas */}
          <path d="M6 3 L12 13 L18 3" />
          {/* Ombreiras e mangas */}
          <path d="M6 3 L3 7 L6 14 L8 14" />
          <path d="M18 3 L21 7 L18 14 L16 14" />
          {/* Corpo do quimono */}
          <path d="M7 14 L7 20 L17 20 L17 14" />
          {/* Nó da faixa */}
          <rect x="10" y="12" width="4" height="2.5" rx="0.5" fill="currentColor" fillOpacity="0.2" />
          <path d="M10.5 14.5 L9 18" />
          <path d="M13.5 14.5 L15 18" />
        </svg>
      );

    // Muay Thai: Prajied (Braçadeira sagrada com trançado e pontas soltas)
    case 'muay_thai':
      return (
        <svg {...commonProps} aria-label="Ícone Muay Thai (Prajied)">
          {/* Braço contorno */}
          <path d="M4 12 C4 8 8 5 12 5 C16 5 20 8 20 12" strokeDasharray="2 3" opacity="0.4" />
          {/* Anel de trança do Prajied */}
          <ellipse cx="12" cy="10" rx="7" ry="3.5" />
          <ellipse cx="12" cy="11.5" rx="6.5" ry="3" />
          {/* Fitas/Pontas pendentes com contas */}
          <path d="M10 14 C9.5 17 8 19 7 21" />
          <path d="M12 14 C12 17 12 19.5 12 21.5" />
          <path d="M14 14 C14.5 17 16 19 17 21" />
          <circle cx="7" cy="21" r="0.75" fill="currentColor" />
          <circle cx="12" cy="21.5" r="0.75" fill="currentColor" />
          <circle cx="17" cy="21" r="0.75" fill="currentColor" />
        </svg>
      );

    // Karatê: Soco direto potente com foco central e faixa
    case 'karate':
      return (
        <svg {...commonProps} aria-label="Ícone Karatê (Punho e Faixa)">
          {/* Punho cerrado visto de frente (Seiken) */}
          <rect x="6" y="5" width="12" height="9" rx="2" />
          <path d="M9 5 L9 10" />
          <path d="M12 5 L12 10" />
          <path d="M15 5 L15 10" />
          <path d="M6 10 C6 12 8 13.5 12 13.5 C16 13.5 18 12 18 10" />
          {/* Polegar fechado */}
          <path d="M7 11.5 L12 11.5" />
          {/* Linhas de impacto de Kiai */}
          <path d="M3 9.5 L1 9.5" />
          <path d="M21 9.5 L23 9.5" />
          {/* Faixa inferior */}
          <path d="M5 19 L12 17 L19 19" />
          <circle cx="12" cy="17" r="1.5" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );

    // Judô: Círculo Kodokan com Flor de Cerejeira / Tatame redondo
    case 'judo':
      return (
        <svg {...commonProps} aria-label="Ícone Judô (Kodokan)">
          {/* Octógono / Círculo externo do Kodokan */}
          <circle cx="12" cy="12" r="9" />
          {/* Círculo interior vermelho/central */}
          <circle cx="12" cy="12" r="4.5" fill="currentColor" fillOpacity="0.2" />
          {/* Linhas radiais dos 8 ângulos de desequilíbrio (Kuzushi) */}
          <path d="M12 3 L12 7.5" />
          <path d="M12 16.5 L12 21" />
          <path d="M3 12 L7.5 12" />
          <path d="M16.5 12 L21 12" />
        </svg>
      );

    // Capoeira: Berimbau clássico (Verga de arco, corda de arame, cabaça e caxixi)
    case 'capoeira':
      return (
        <svg {...commonProps} aria-label="Ícone Capoeira (Berimbau)">
          {/* Arco (Verga curvada de madeira) */}
          <path d="M6 2 C13 6 13 18 6 22" />
          {/* Arame tencionado reto */}
          <line x1="6" y1="2" x2="6" y2="22" strokeDasharray="3 1" />
          {/* Cabaça ressonadora na base */}
          <ellipse cx="12" cy="16" rx="3.5" ry="3.5" fill="currentColor" fillOpacity="0.2" />
          <path d="M8.5 16 L6 16" />
          {/* Baqueta / Vareta */}
          <line x1="16" y1="7" x2="22" y2="13" />
          {/* Caxixi */}
          <path d="M18 12 L20 14" strokeWidth="2.5" />
        </svg>
      );

    // Boxe: Luva de boxe clássica em perfil com cadarço e polegar
    case 'boxing':
      return (
        <svg {...commonProps} aria-label="Ícone Boxe (Luva)">
          {/* Contorno do punho principal da luva */}
          <path d="M7 16 C5 15 4 12 4 9 C4 5.5 7 3 12 3 C16.5 3 19 5.5 19 9 C19 12 18 15 16 16" />
          {/* Polegar acolchoado protegido */}
          <path d="M7 9 C7 7.5 8.5 7 10 8 C10.5 9 10 11 9 12 C7.5 12 7 10.5 7 9 Z" />
          {/* Pulso e amarração / munhequeira */}
          <path d="M7 16 L7 21 L16 21 L16 16" />
          <line x1="8" y1="18.5" x2="15" y2="18.5" />
        </svg>
      );

    // Todas as Artes / Geral: Ícone unificado com tatame e cinturão
    case 'all':
    default:
      return (
        <svg {...commonProps} aria-label="Todas as Modalidades">
          <rect x="3" y="3" width="8" height="8" rx="2" />
          <rect x="13" y="3" width="8" height="8" rx="2" />
          <rect x="3" y="13" width="8" height="8" rx="2" />
          <rect x="13" y="13" width="8" height="8" rx="2" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      );
  }
};
