import React, { createContext, useContext, useEffect } from 'react';
import type { ModalityId, ModalityMetadata } from '../types/martial';
import { MODALITIES_DATA } from '../mock/martialData';

interface MartialThemeContextType {
  selectedModality: ModalityId | 'all';
  setSelectedModality: (modality: ModalityId | 'all') => void;
  currentModality?: ModalityMetadata;
  accentColor: string;
  isMonochrome: boolean;
}

const MartialThemeContext = createContext<MartialThemeContextType | undefined>(undefined);

export const MartialThemeProvider: React.FC<{
  selectedModality: ModalityId | 'all';
  setSelectedModality: (modality: ModalityId | 'all') => void;
  children: React.ReactNode;
}> = ({ selectedModality, setSelectedModality, children }) => {
  const currentModality = selectedModality !== 'all'
    ? MODALITIES_DATA.find(m => m.id === selectedModality)
    : undefined;

  const isMonochrome = selectedModality === 'all';

  // Padrão Preto e Branco quando em 'all' (Artes Mistas), ou a cor exata da modalidade selecionada
  const accentColor = currentModality ? currentModality.accentColor : '#18181b';

  // Injeção de variáveis CSS globais no :root
  useEffect(() => {
    const root = document.documentElement;
    if (currentModality) {
      root.style.setProperty('--martial-accent', currentModality.accentColor);
      root.style.setProperty('--martial-accent-glow', `${currentModality.accentColor}33`);
      root.style.setProperty('--martial-accent-subtle', `${currentModality.accentColor}15`);
    } else {
      root.style.removeProperty('--martial-accent');
      root.style.removeProperty('--martial-accent-glow');
      root.style.removeProperty('--martial-accent-subtle');
    }
  }, [currentModality]);

  return (
    <MartialThemeContext.Provider
      value={{
        selectedModality,
        setSelectedModality,
        currentModality,
        accentColor,
        isMonochrome
      }}
    >
      {children}
    </MartialThemeContext.Provider>
  );
};

export const useMartialTheme = (): MartialThemeContextType => {
  const context = useContext(MartialThemeContext);
  if (!context) {
    throw new Error('useMartialTheme must be used within a MartialThemeProvider');
  }
  return context;
};

