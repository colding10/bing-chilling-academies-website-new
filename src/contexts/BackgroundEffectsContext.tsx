"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';

type EffectsMode = 'full' | 'reduced' | 'minimal' | 'none';

interface BackgroundEffectsContextType {
  effectsMode: EffectsMode;
  toggleEffectsMode: () => void;
  matrixOpacity: number;
  particlesEnabled: boolean;
  scanLinesEnabled: boolean;
}

const BackgroundEffectsContext = createContext<BackgroundEffectsContextType | undefined>(undefined);

export function BackgroundEffectsProvider({ children }: { children: React.ReactNode }) {
  // Try to get saved preference from localStorage
  const [effectsMode, setEffectsMode] = useState<EffectsMode>('full');
  
  // Calculate derived states based on mode
  const [matrixOpacity, setMatrixOpacity] = useState(0.2);
  const [particlesEnabled, setParticlesEnabled] = useState(true);
  const [scanLinesEnabled, setScanLinesEnabled] = useState(true);
  
  // Initialize from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('background-effects-mode') as EffectsMode;
      if (savedMode) {
        setEffectsMode(savedMode);
      }
    }
  }, []);
  
  // Update derived states when mode changes
  useEffect(() => {
    switch (effectsMode) {
      case 'full':
        setMatrixOpacity(0.2);
        setParticlesEnabled(true);
        setScanLinesEnabled(true);
        break;
      case 'reduced':
        setMatrixOpacity(0.1);
        setParticlesEnabled(true);
        setScanLinesEnabled(false);
        break;
      case 'minimal':
        setMatrixOpacity(0);
        setParticlesEnabled(false);
        setScanLinesEnabled(false);
        break;
      case 'none':
        setMatrixOpacity(0);
        setParticlesEnabled(false);
        setScanLinesEnabled(false);
        break;
    }
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('background-effects-mode', effectsMode);
    }
  }, [effectsMode]);
  
  // Cycle through modes
  const toggleEffectsMode = () => {
    setEffectsMode(prevMode => {
      switch (prevMode) {
        case 'full': return 'reduced';
        case 'reduced': return 'minimal';
        case 'minimal': return 'none';
        case 'none': return 'full';
        default: return 'full';
      }
    });
  };
  
  return (
    <BackgroundEffectsContext.Provider value={{ 
      effectsMode,
      toggleEffectsMode,
      matrixOpacity,
      particlesEnabled,
      scanLinesEnabled
    }}>
      {children}
    </BackgroundEffectsContext.Provider>
  );
}

export function useBackgroundEffects() {
  const context = useContext(BackgroundEffectsContext);
  if (context === undefined) {
    throw new Error('useBackgroundEffects must be used within a BackgroundEffectsProvider');
  }
  return context;
}