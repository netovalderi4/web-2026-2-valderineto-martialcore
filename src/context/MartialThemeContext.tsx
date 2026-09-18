import React, { createContext, useContext } from 'react';
import type { ModalityId, ModalityMetadata } from '../types/martial';
import { MODALITIES_DATA } from '../mock/martialData';

interface MartialThemeContextType {
  selectedModality: ModalityId | 'all';
  setSelectedModality: (modality: ModalityId | 'all') => void;
  currentModality?: ModalityMetadata;
  accentColor: string;
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

  // Default elegant gold/amber for 'all', or the exact color of the selected modality
  const accentColor = currentModality ? currentModality.accentColor : '#f59e0b';

  return (
    <MartialThemeContext.Provider
      value={{
        selectedModality,
        setSelectedModality,
        currentModality,
        accentColor
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

