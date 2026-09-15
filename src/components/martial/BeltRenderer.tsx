import React from 'react';
import type { ModalityId } from '../../types/martial';
import { Flame, Swords, Zap, Music, Dumbbell } from 'lucide-react';

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
  // Brazilian Jiu-Jitsu (Faixas e Graus)
  if (modalityId === 'bjj') {
    let mainColor = 'bg-white text-zinc-900 border-zinc-300';
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
      <div className="flex flex-col gap-1">
        <div
          className={`flex items-center justify-between rounded shadow border overflow-hidden font-mono ${mainColor} ${
            compact ? 'h-6 px-2 text-xs w-44' : 'h-8 px-3 text-sm w-56'
          }`}
        >
          <span className="font-bold tracking-wide truncate">{rankName}</span>
          
          {/* Ponta da faixa com graus */}
          <div className={`flex items-center justify-center gap-0.5 px-1.5 h-full ${barColor} ml-2 min-w-[34px]`}>
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className={`w-1 rounded-sm transition-all ${
                  idx < degrees ? 'h-3.5 bg-white shadow-sm' : 'h-3.5 bg-zinc-800/80 border border-zinc-700/50'
                }`}
                title={idx < degrees ? `Grau ${idx + 1}` : 'Grau não conquistado'}
              />
            ))}
          </div>
        </div>
        {!compact && (
          <span className="text-[11px] text-zinc-400 font-medium">
            {degrees > 0 ? `${degrees}º Grau confirmado` : 'Sem graus acumulados'}
          </span>
        )}
      </div>
    );
  }

  // Muay Thai (Cordéis Prajied / Kruang)
  if (modalityId === 'muay_thai') {
    return (
      <div className="flex items-center gap-2">
        <div
          className={`relative flex items-center gap-1.5 px-3 py-1 rounded-full border border-red-500/30 bg-red-950/40 text-red-300 font-mono text-xs shadow ${
            compact ? 'text-[11px] py-0.5' : ''
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          <span className="font-semibold">{rankName}</span>
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block ml-1"></span>
        </div>
      </div>
    );
  }

  // Karatê (Kyu / Dan)
  if (modalityId === 'karate') {
    let beltBg = 'bg-amber-500 text-black';
    if (rankName.toLowerCase().includes('dan') || rankName.toLowerCase().includes('preta')) {
      beltBg = 'bg-zinc-950 text-amber-400 border border-amber-500/40';
    } else if (rankName.toLowerCase().includes('vermelha')) {
      beltBg = 'bg-red-600 text-white';
    } else if (rankName.toLowerCase().includes('verde')) {
      beltBg = 'bg-emerald-600 text-white';
    }

    return (
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded border border-zinc-700 font-mono text-xs font-bold ${beltBg} ${
            compact ? 'text-[11px] py-0.5' : ''
          }`}
        >
          <Swords className="w-3.5 h-3.5" />
          <span>{rankName}</span>
        </div>
      </div>
    );
  }

  // Judô (Gokyo)
  if (modalityId === 'judo') {
    let judoBg = 'bg-emerald-600 text-white';
    if (rankName.toLowerCase().includes('preta')) judoBg = 'bg-zinc-950 text-white border border-zinc-700';
    if (rankName.toLowerCase().includes('marrom')) judoBg = 'bg-amber-900 text-white';
    if (rankName.toLowerCase().includes('roxa')) judoBg = 'bg-purple-700 text-white';
    if (rankName.toLowerCase().includes('amarela')) judoBg = 'bg-yellow-400 text-black';

    return (
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded border border-zinc-700 font-mono text-xs font-bold ${judoBg} ${
            compact ? 'text-[11px] py-0.5' : ''
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{rankName}</span>
        </div>
      </div>
    );
  }

  // Capoeira (Cordéis & Estilo)
  if (modalityId === 'capoeira') {
    return (
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-semibold ${
            compact ? 'text-[11px] py-0.5' : ''
          }`}
        >
          <Music className="w-3.5 h-3.5 text-amber-400" />
          <span>{rankName}</span>
        </div>
      </div>
    );
  }

  // Boxe (Sem faixas; tempo e categoria)
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex items-center gap-1.5 px-3 py-1 rounded bg-zinc-900 border border-purple-500/40 text-purple-300 font-mono text-xs font-semibold ${
          compact ? 'text-[11px] py-0.5' : ''
        }`}
      >
        <Dumbbell className="w-3.5 h-3.5 text-purple-400" />
        <span>{rankName}</span>
      </div>
    </div>
  );
};

