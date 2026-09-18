import React from 'react';
import type { ModalityId } from '../../types/martial';
import { MODALITIES_DATA } from '../../mock/martialData';
import { MartialIcon } from '../martial/MartialIcon';
import { X, Sparkles, Clock, Award } from 'lucide-react';

interface ModalityHeroBannerProps {
  selectedModality: ModalityId | 'all';
  onClearFilter: () => void;
}

export const ModalityHeroBanner: React.FC<ModalityHeroBannerProps> = ({
  selectedModality,
  onClearFilter
}) => {
  if (selectedModality === 'all') return null;

  const modality = MODALITIES_DATA.find(m => m.id === selectedModality);
  if (!modality) return null;

  return (
    <div className="relative mb-8 rounded-3xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/80 shadow-sm transition-all duration-300 p-5 sm:p-6">
      {/* Luz difusa de fundo baseada na cor da arte */}
      <div
        className="absolute -top-12 -left-12 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ backgroundColor: modality.accentColor }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Lado Esquerdo: Identidade, Regras e Metadados */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between md:justify-start gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-xs"
              style={{
                backgroundColor: `${modality.accentColor}18`,
                borderColor: `${modality.accentColor}35`,
                color: modality.accentColor
              }}
            >
              <MartialIcon modalityId={modality.id} size={24} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: modality.accentColor }}
                >
                  Modalidade Ativa
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  {modality.graduationType}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight mt-0.5">
                {modality.name}
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
            {modality.tagline}. Visualização filtrada de atletas matriculados, turmas alocadas e regras técnicas.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500 dark:text-zinc-400 pt-1">
            <span className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/60 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700/60">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Carência Mínima: <strong className="text-zinc-900 dark:text-white">{modality.defaultTimeRequirementMonths} meses</strong></span>
            </span>

            <span className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/60 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700/60">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Aulas para Exame: <strong className="text-zinc-900 dark:text-white">{modality.minClassesForPromotion} presenças</strong></span>
            </span>
          </div>
        </div>

        {/* Lado Direito: Foto em 16:9 em Alta Resolução e Botão Fechar */}
        <div className="flex items-center gap-4 shrink-0">
          {modality.bannerImage && (
            <div className="relative w-full sm:w-64 md:w-72 aspect-video rounded-2xl overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 shadow-md group">
              <img
                src={modality.bannerImage}
                alt={modality.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute bottom-2 left-2.5 text-[11px] font-bold text-white drop-shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {modality.shortName} em Foco
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={onClearFilter}
            className="p-2.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white border border-zinc-200 dark:border-zinc-700 transition cursor-pointer self-start"
            title="Limpar filtro e ver todas as artes"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
