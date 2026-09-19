import React from 'react';

interface MartialCoreLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  accentColor?: string; // Se fornecido e diferente de monocromático, colore o núcleo
  isMonochrome?: boolean; // Se true, força visual 100% preto e branco
  className?: string;
}

export const MartialCoreLogo: React.FC<MartialCoreLogoProps> = ({
  size = 'md',
  showText = true,
  accentColor,
  isMonochrome = false,
  className = ''
}) => {
  // Configurações de dimensão por tamanho
  const dimensions = {
    sm: { iconSize: 32, textClass: 'text-base', subClass: 'text-[8px]' },
    md: { iconSize: 40, textClass: 'text-lg', subClass: 'text-[9px]' },
    lg: { iconSize: 52, textClass: 'text-2xl', subClass: 'text-[11px]' }
  }[size];

  // Determinar cor do núcleo:
  // Se for monocromático ou sem accentColor específico, usa branco/preto nativo
  const hasDynamicColor = !isMonochrome && Boolean(accentColor);
  const coreStrokeColor = hasDynamicColor ? accentColor : 'currentColor';
  const coreFillGlow = hasDynamicColor ? `${accentColor}30` : 'transparent';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Símbolo Octogonal do Núcleo Marcial (Martial Tatami Core) */}
      <div
        className="relative shrink-0 flex items-center justify-center transition-all duration-300 rounded-xl overflow-hidden"
        style={{
          width: dimensions.iconSize,
          height: dimensions.iconSize
        }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-xs transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Fundo do emblema: preto profundo */}
          <rect width="100" height="100" rx="22" className="fill-zinc-950 dark:fill-zinc-900 stroke-zinc-800" strokeWidth="2" />

          {/* Octógono Externo (Representando o Tatame / Octógono de Combate) */}
          <polygon
            points="30,8 70,8 92,30 92,70 70,92 30,92 8,70 8,30"
            className="stroke-zinc-400 dark:stroke-zinc-300"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Octógono Interno Reforçado */}
          <polygon
            points="34,16 66,16 84,34 84,66 66,84 34,84 16,66 16,34"
            className="stroke-zinc-600 dark:stroke-zinc-500"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Núcleo Marcial: Dois Círculos Concêntricos Geométricos e Ponto Central */}
          <g style={{ color: coreStrokeColor }}>
            {/* Círculo Externo */}
            <circle
              cx="50"
              cy="50"
              r="22"
              stroke="currentColor"
              strokeWidth="4"
              fill={coreFillGlow}
              className="transition-colors duration-300"
            />
            {/* Círculo Interno */}
            <circle
              cx="50"
              cy="50"
              r="12"
              stroke="currentColor"
              strokeWidth="3.5"
              fill="none"
              className="transition-colors duration-300"
            />
            {/* Ponto Central do Núcleo */}
            <circle
              cx="50"
              cy="50"
              r="4"
              fill="currentColor"
              className="transition-colors duration-300"
            />
          </g>
        </svg>

        {/* Brilho de halo suave quando há cor da modalidade ativa */}
        {hasDynamicColor && (
          <div
            className="absolute inset-0 rounded-xl blur-md opacity-40 pointer-events-none transition-all duration-500"
            style={{ backgroundColor: accentColor }}
          />
        )}
      </div>

      {/* Tipografia da Marca */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center tracking-wider leading-none">
            <span className={`font-black text-zinc-900 dark:text-white ${dimensions.textClass} tracking-tight`}>
              MARTIAL
            </span>
            <span
              className={`font-black ${dimensions.textClass} tracking-tight transition-colors duration-300 ml-0.5`}
              style={{
                color: hasDynamicColor ? accentColor : undefined
              }}
            >
              <span className={!hasDynamicColor ? 'text-zinc-500 dark:text-zinc-400' : ''}>
                CORE
              </span>
            </span>
          </div>
          <span className={`block font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-semibold ${dimensions.subClass} mt-0.5`}>
            Centro de Treinamento
          </span>
        </div>
      )}
    </div>
  );
};

