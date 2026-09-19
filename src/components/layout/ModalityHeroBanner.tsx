import React from 'react';
import type { ModalityId } from '../../types/martial';
import { MODALITIES_DATA } from '../../mock/martialData';
import { MartialIcon } from '../martial/MartialIcon';
import { X, Clock, Award } from 'lucide-react';

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

  const displayImage = modality.heroImage || modality.bannerImage;

  return (
    <div
      className="relative mb-6 rounded-2xl md:rounded-3xl overflow-hidden bg-white/95 dark:bg-zinc-900/95 border shadow-sm transition-all duration-300 min-h-[160px] flex items-center"
      style={{
        borderColor: `${modality.accentColor}35`,
        boxShadow: `0 4px 25px -4px ${modality.accentColor}15`
      }}
    >
      {/* Imagem Panorâmica 4:1 Integrada à Direita com Ação dos Lutadores */}
      {displayImage && (
        <div className="absolute inset-y-0 right-0 w-full sm:w-2/3 md:w-3/5 lg:w-1/2 pointer-events-none select-none overflow-hidden">
          <img
            src={displayImage}
            alt={modality.name}
            className="w-full h-full object-cover object-right"
          />
          {/* Degradê horizontal suave que funde a foto com o fundo do card à esquerda */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-zinc-900 dark:via-zinc-900/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-white/10 dark:from-zinc-900/30 dark:via-transparent dark:to-zinc-900/10" />
        </div>
      )}

      {/* Luz difusa atmosférica de fundo baseada na cor da arte */}
      <div
        className="absolute -top-16 -left-16 w-72 h-72 rounded-full blur-3xl opacity-15 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: modality.accentColor }}
      />

      {/* Conteúdo à Esquerda: Informações Técnicas e Metadados */}
      <div className="relative z-10 p-5 sm:p-6 lg:p-7 pr-14 flex flex-col justify-center w-full">
        <div className="max-w-xl lg:max-w-2xl space-y-3.5">
          {/* Identidade e Título */}
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-xs"
              style={{
                backgroundColor: `${modality.accentColor}18`,
                borderColor: `${modality.accentColor}40`,
                color: modality.accentColor
              }}
            >
              <MartialIcon modalityId={modality.id} size={24} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full text-white shadow-xs"
                  style={{ backgroundColor: modality.accentColor }}
                >
                  Modalidade Ativa
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  {modality.graduationType}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight mt-0.5">
                {modality.name}
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {modality.tagline}. Visualização filtrada de atletas matriculados, turmas alocadas e regras técnicas.
          </p>

          {/* Badges de Regras */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono pt-0.5">
            <span
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xs shadow-2xs"
              style={{ borderColor: `${modality.accentColor}30` }}
            >
              <Clock className="w-3.5 h-3.5" style={{ color: modality.accentColor }} />
              <span className="text-zinc-600 dark:text-zinc-400">
                Carência Mínima: <strong className="text-zinc-900 dark:text-white">{modality.defaultTimeRequirementMonths} meses</strong>
              </span>
            </span>

            <span
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xs shadow-2xs"
              style={{ borderColor: `${modality.accentColor}30` }}
            >
              <Award className="w-3.5 h-3.5" style={{ color: modality.accentColor }} />
              <span className="text-zinc-600 dark:text-zinc-400">
                Aulas para Exame: <strong className="text-zinc-900 dark:text-white">{modality.minClassesForPromotion} presenças</strong>
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Botão de Fechar Filtro no Canto Superior Direito */}
      <button
        type="button"
        onClick={onClearFilter}
        className="absolute top-3.5 right-3.5 z-20 p-2 rounded-xl bg-white/80 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white border border-zinc-200 dark:border-zinc-700 backdrop-blur-xs transition cursor-pointer shadow-xs"
        title="Limpar filtro e voltar para visão unificada (Preto e Branco)"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
