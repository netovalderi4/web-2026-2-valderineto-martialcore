import React from 'react';
import { useMartialTheme } from '../../context/MartialThemeContext';

export const AmbientAura: React.FC = () => {
  const { accentColor, isMonochrome } = useMartialTheme();

  if (isMonochrome) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 transition-opacity duration-700 ease-out -z-0 overflow-hidden opacity-25 dark:opacity-15"
      >
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-zinc-400 dark:bg-zinc-700 blur-[140px] rounded-full" />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 transition-all duration-700 ease-out -z-0 overflow-hidden"
    >
      {/* Luz difusa atmosférica dominante no topo do tatame */}
      <div
        className="absolute top-0 left-0 right-0 h-[550px] transition-all duration-700 blur-[110px] opacity-25 dark:opacity-35"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% -10%, ${accentColor}, transparent 80%)`
        }}
      />

      {/* Spotlights laterais suaves que envolvem a página na cor da arte marcial */}
      <div
        className="absolute top-1/4 -left-20 w-[420px] h-[420px] rounded-full blur-[100px] opacity-15 dark:opacity-20 transition-all duration-700"
        style={{ backgroundColor: accentColor }}
      />
      <div
        className="absolute top-1/3 -right-20 w-[420px] h-[420px] rounded-full blur-[100px] opacity-15 dark:opacity-20 transition-all duration-700"
        style={{ backgroundColor: accentColor }}
      />
    </div>
  );
};

