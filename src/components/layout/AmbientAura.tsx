import React from 'react';
import { useMartialTheme } from '../../context/MartialThemeContext';

export const AmbientAura: React.FC = () => {
  const { accentColor, selectedModality } = useMartialTheme();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 h-[380px] sm:h-[450px] transition-all duration-700 ease-out -z-0 overflow-hidden"
    >
      {/* Luz difusa atmosférica suave no topo */}
      <div
        className="w-full h-full transition-all duration-700 opacity-25 dark:opacity-30 blur-[100px]"
        style={{
          background: `radial-gradient(ellipse 65% 55% at 50% -15%, ${accentColor}, transparent 75%)`
        }}
      />

      {/* Marca d'água sutil quando uma arte específica está selecionada */}
      {selectedModality !== 'all' && (
        <div
          className="absolute -top-12 -right-12 w-96 h-96 rounded-full transition-all duration-700 opacity-10 dark:opacity-15 blur-[80px]"
          style={{ backgroundColor: accentColor }}
        />
      )}
    </div>
  );
};

