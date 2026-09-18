import React from 'react';
import type { ModalityId } from '../../types/martial';
import { MartialIcon } from './MartialIcon';

interface BeltRendererProps {
  modalityId: ModalityId;
  rankName: string;
  degrees?: number;
  compact?: boolean;
}

export const BeltRenderer: React.FC<BeltRendererProps> = ({
  modalityId,
  rankName,
  degrees = 0,
  compact = false
}) => {
  // Brazilian Jiu-Jitsu (Faixas com tarja e até 4 graus bordados)
  if (modalityId === 'bjj') {
    let mainColor = 'bg-white text-zinc-900 border-zinc-300 dark:bg-white dark:text-zinc-900';
    let barColor = 'bg-black';

    const lower = rankName.toLowerCase();
    if (lower.includes('azul')) {
      mainColor = 'bg-blue-600 text-white border-blue-500';
    } else if (lower.includes('roxa')) {
      mainColor = 'bg-purple-600 text-white border-purple-500';
    } else if (lower.includes('marrom')) {
      mainColor = 'bg-amber-900 text-white border-amber-800';
    } else if (lower.includes('preta')) {
      mainColor = 'bg-zinc-950 text-white border-zinc-800';
      barColor = 'bg-red-600';
    } else if (lower.includes('coral')) {
      mainColor = 'bg-gradient-to-r from-red-600 via-zinc-900 to-red-600 text-white border-red-700';
      barColor = 'bg-white';
    }

    return (
      <div className="flex flex-col gap-1 max-w-full">
        <div
          className={`flex items-center justify-between rounded-lg shadow-xs border overflow-hidden font-mono transition-all ${mainColor} ${
            compact
              ? 'h-6 px-2.5 text-xs min-w-[140px] max-w-xs'
              : 'h-8 px-3.5 text-xs sm:text-sm min-w-[180px] max-w-sm'
          }`}
        >
          <span className="font-bold tracking-wide whitespace-nowrap">{rankName}</span>

          {/* Ponta da faixa com graus bordados */}
          <div className={`flex items-center justify-center gap-1 px-2 h-full ${barColor} ml-2.5 shrink-0`}>
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className={`w-1 rounded-xs transition-all ${
                  idx < degrees ? 'h-3.5 bg-white shadow-xs' : 'h-3.5 bg-zinc-800/80 border border-zinc-700/60'
                }`}
                title={idx < degrees ? `Grau ${idx + 1}` : 'Grau pendente'}
              />
            ))}
          </div>
        </div>

        {!compact && (
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
            {degrees > 0 ? `${degrees}º Grau conquistado` : 'Sem graus acumulados'}
          </span>
        )}
      </div>
    );
  }

  // Muay Thai (Cordéis Prajied / Kruang)
  if (modalityId === 'muay_thai') {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 font-mono text-xs font-semibold shadow-xs">
        <MartialIcon modalityId="muay_thai" size={14} />
        <span className="whitespace-nowrap">{rankName}</span>
      </div>
    );
  }

  // Karatê (Kyu / Dan)
  if (modalityId === 'karate') {
    let beltBg = 'bg-amber-500 text-black border-amber-600';
    if (rankName.toLowerCase().includes('dan') || rankName.toLowerCase().includes('preta')) {
      beltBg = 'bg-zinc-950 text-amber-400 border-amber-500/50';
    } else if (rankName.toLowerCase().includes('vermelha')) {
      beltBg = 'bg-red-600 text-white border-red-700';
    } else if (rankName.toLowerCase().includes('verde')) {
      beltBg = 'bg-emerald-600 text-white border-emerald-700';
    }

    return (
      <div className="inline-flex items-center gap-1.5">
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono text-xs font-bold shadow-xs ${beltBg}`}
        >
          <MartialIcon modalityId="karate" size={14} />
          <span className="whitespace-nowrap">{rankName}</span>
        </div>
      </div>
    );
  }

  // Judô (Gokyo)
  if (modalityId === 'judo') {
    let judoBg = 'bg-emerald-600 text-white border-emerald-700';
    if (rankName.toLowerCase().includes('preta')) judoBg = 'bg-zinc-950 text-white border-zinc-700';
    if (rankName.toLowerCase().includes('marrom')) judoBg = 'bg-amber-900 text-white border-amber-800';
    if (rankName.toLowerCase().includes('roxa')) judoBg = 'bg-purple-700 text-white border-purple-800';
    if (rankName.toLowerCase().includes('amarela')) judoBg = 'bg-yellow-400 text-black border-yellow-500';

    return (
      <div className="inline-flex items-center gap-1.5">
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono text-xs font-bold shadow-xs ${judoBg}`}
        >
          <MartialIcon modalityId="judo" size={14} />
          <span className="whitespace-nowrap">{rankName}</span>
        </div>
      </div>
    );
  }

  // Capoeira (Cordéis & Estilo)
  if (modalityId === 'capoeira') {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-mono text-xs font-semibold shadow-xs">
        <MartialIcon modalityId="capoeira" size={14} />
        <span className="whitespace-nowrap">{rankName}</span>
      </div>
    );
  }

  // Boxe (Sem faixas; tempo e categoria)
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-400 font-mono text-xs font-semibold shadow-xs">
      <MartialIcon modalityId="boxing" size={14} />
      <span className="whitespace-nowrap">{rankName}</span>
    </div>
  );
};

