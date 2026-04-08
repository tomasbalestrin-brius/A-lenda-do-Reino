import { useState, useCallback, useRef, useEffect } from 'react';
import { useCharacterStore } from '../store/useCharacterStore';
import { canGoNext, shouldSkipStep } from '../utils/rules/navigation';
import { computeStats } from '../utils/rules/characterStats';

export const STEP_LABELS = [
  "Raça", "Herança", "Classe", "Identidade", "Esp. de Classe", 
  "Origem", "Benefícios", "Divindade", "Nível", "Magias", 
  "Atributos", "Perícias (Classe)", "Perícias (Int)", "Equipamento", 
  "Poderes", "Progressão", "Aliados", "Revisão"
];

export const MAX_STEPS = STEP_LABELS.length;

export function useCreationNavigation(initialView = 'library') {
  const [view, setView] = useState(initialView);
  const [step, setStep] = useState(0);
  const [confirmBack, setConfirmBack] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const contentRef = useRef(null);

  const resetScroll = useCallback(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    resetScroll();
  }, [step, resetScroll]);

  const handleNext = useCallback(() => {
    const { char } = useCharacterStore.getState();
    const stats = computeStats(char);
    
    if (step < MAX_STEPS - 1 && canGoNext(step, char, stats).ok) {
      let nextStep = step + 1;
      while (nextStep < MAX_STEPS - 1 && shouldSkipStep(nextStep, char, stats)) {
        nextStep++;
      }
      setStep(nextStep);
    }
  }, [step]);

  const goToPrev = useCallback((targetStep) => {
    if (targetStep < 0) { setView('library'); return; }
    setStep(targetStep);
  }, []);

  const handlePrev = useCallback(() => {
    const { char } = useCharacterStore.getState();
    const stats = computeStats(char);
    
    let prevStep = step - 1;
    while (prevStep > 0 && shouldSkipStep(prevStep, char, stats)) prevStep--;

    const RESET_WARNINGS = {
      6: char.origemBeneficios?.length > 0 ? 'Voltar para Origem pode redefinir seus Benefícios.' : null,
      4: (char.choices?.escolasMagia?.length > 0 || char.choices?.caminhoArcanista) ? 'Voltar para Classe pode redefinir sua Especialização.' : null,
      1: (char.choices?.pericias?.length > 0 || char.choices?.herancaPower || char.racaEscolha?.length > 0) ? 'Voltar para Raça pode redefinir sua Herança.' : null,
      10: (char.atributos && Object.values(char.atributos).some(v => v !== 0)) ? 'Mudanças anteriores podem alterar seus atributos já distribuídos.' : null,
    };

    const warning = RESET_WARNINGS[step];
    if (warning) {
      setConfirmBack({ targetStep: prevStep < 0 ? -1 : prevStep, message: warning });
    } else {
      goToPrev(prevStep < 0 ? -1 : prevStep);
    }
  }, [step, goToPrev]);

  return {
    view, setView,
    step, setStep,
    confirmBack, setConfirmBack,
    sidebarOpen, setSidebarOpen,
    contentRef,
    handleNext,
    handlePrev,
    goToPrev
  };
}
