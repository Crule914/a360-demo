// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';

export type CardStatusLocation = 'header' | 'footer';

const STORAGE_KEY = 'card-status-location';

const readInitial = (): CardStatusLocation => {
  if (typeof window === 'undefined') return 'header';
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === 'footer' ? 'footer' : 'header';
};

export const useCardStatusLocation = () => {
  const [statusLocation, setStatusLocationState] = useState<CardStatusLocation>(readInitial);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setStatusLocationState(readInitial());
    };
    const local = () => setStatusLocationState(readInitial());
    window.addEventListener('storage', handler);
    window.addEventListener('card-status-location-changed', local);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('card-status-location-changed', local);
    };
  }, []);

  const setStatusLocation = useCallback((loc: CardStatusLocation) => {
    window.localStorage.setItem(STORAGE_KEY, loc);
    setStatusLocationState(loc);
    window.dispatchEvent(new Event('card-status-location-changed'));
  }, []);

  return {
    statusLocation,
    setStatusLocation,
    isFooter: statusLocation === 'footer',
  };
};
