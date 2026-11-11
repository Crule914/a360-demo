// @ts-nocheck
import { useAppStore } from '@miq/stores/useAppStore';
import { advisors } from '@miq/lib/userContext';

export const useAssistantMode = () => {
  const assistantMode = useAppStore((s) => (s as any).assistantMode as boolean);
  const setAssistantMode = useAppStore((s) => (s as any).setAssistantMode as (on: boolean) => void);
  const selectedAdvisors = useAppStore((s) => (s as any).selectedAdvisors as string[]);
  const setSelectedAdvisors = useAppStore((s) => (s as any).setSelectedAdvisors as (ids: string[]) => void);
  const advisorFilterVariant = useAppStore((s) => (s as any).advisorFilterVariant as 'initials' | 'photos' | 'lozenges' | 'dropdown');
  const setAdvisorFilterVariant = useAppStore((s) => (s as any).setAdvisorFilterVariant as (v: 'initials' | 'photos' | 'lozenges' | 'dropdown') => void);

  return {
    isAssistantMode: assistantMode,
    setAssistantMode,
    selectedAdvisors,
    setSelectedAdvisors,
    advisors,
    advisorFilterVariant,
    setAdvisorFilterVariant,
  };
};
