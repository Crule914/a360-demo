// @ts-nocheck
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClientLoader } from '@miq/hooks/useClientLoader';
import { PotentialMeetingsCardView } from '@miq/components/landing/PotentialMeetingsCardView';
import { PotentialMeetingsDashboard } from '@miq/components/landing/PotentialMeetingsDashboard';
import { getClientsWithoutMeetings } from '@miq/services/HouseholdAgendaReadinessService';
import { StableErrorBoundary } from './StableErrorBoundary';

interface LandingPotentialMeetingsCanvasProps {
  onCanvasAction?: (action: string, data?: any) => void;
  onClientSelect?: (clientId: string, clientName: string) => void;
  onMeetingScheduled?: (clientName: string) => void;
  maxItems?: number;
  variant?: 'card' | 'table';
}

export const LandingPotentialMeetingsCanvas: React.FC<LandingPotentialMeetingsCanvasProps> = ({
  onCanvasAction,
  onClientSelect,
  onMeetingScheduled,
  maxItems,
  variant = 'table',
}) => {
  const navigate = useNavigate();
  const { allClients, isLoading } = useClientLoader();

  const clientsWithoutMeetings = useMemo(() => {
    if (!allClients || allClients.length === 0) return [];
    return getClientsWithoutMeetings(allClients);
  }, [allClients]);

  const handleClientClick = (clientId: string, clientName: string) => {
    if (onClientSelect) {
      onClientSelect(clientId, clientName);
    } else if (onCanvasAction) {
      onCanvasAction('open_household', { clientId, clientName });
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-muted rounded w-1/3" />
          <div className="h-8 bg-muted rounded" />
          <div className="h-8 bg-muted rounded" />
          <div className="h-8 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <StableErrorBoundary>
        <PotentialMeetingsCardView
          clients={clientsWithoutMeetings}
          onClientClick={handleClientClick}
        />
      </StableErrorBoundary>
    );
  }

  return (
    <StableErrorBoundary>
      <PotentialMeetingsDashboard
        clients={clientsWithoutMeetings}
        onClientClick={handleClientClick}
        onMeetingScheduled={onMeetingScheduled}
        maxItems={maxItems}
      />
    </StableErrorBoundary>
  );
};

export default LandingPotentialMeetingsCanvas;
