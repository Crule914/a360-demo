// @ts-nocheck
import { useEffect } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { getAllUnifiedClients } from '@miq/data/unifiedClientData';

/**
 * Centralized client loading hook that manages all client data for the application.
 * This is the single source of truth for client loading logic.
 */
export const useClientLoader = () => {
  const { allClients, setAllClients, setLoading } = useAppStore();

  useEffect(() => {
    if (allClients.length > 0) return;

    try {
      setLoading(true);
      const clients = getAllUnifiedClients();
      setAllClients(clients);
    } catch (error) {
      console.error('ClientLoader: Failed to load clients:', error);
    } finally {
      setLoading(false);
    }
  }, [allClients.length, setAllClients, setLoading]);

  return {
    allClients,
    isLoading: allClients.length === 0,
  };
};
