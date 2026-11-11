// @ts-nocheck
/**
 * UNIFIED DATA ACCESS FUNCTIONS
 * Thin accessor layer over the database defined in unifiedClientDatabase.ts
 * 
 * All existing imports from '@miq/data/unifiedClientData' continue to work unchanged.
 */

import { ClientData } from '@miq/types/advisor';
import { EnhancedMeetingData } from '@miq/components/canvas/MeetingCard';
import { ClientSpecificContent } from './clientSpecificData';
import { generateCRMData } from '@miq/utils/crmDataGenerator';
import { ensurePortfolioData } from './mockPortfolioData';
import { unifiedClientDatabase } from './unifiedClientDatabase';

// Re-export so existing `import { unifiedClientDatabase } from '...'` still works
export { unifiedClientDatabase };

// ===== HELPER: Generate Future Meeting Dates =====
const generateFutureMeetingDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
};

// Compliance items generator (needed by portfolio enhancement)
const generateComplianceItems = (count: number) => {
  const items: any[] = [];
  const types = ['rmd', 'beneficiary', 'review', 'regulatory'] as const;
  const descriptions: Record<string, string> = {
    rmd: 'Required Minimum Distribution calculation needed',
    beneficiary: 'Beneficiary designation requires updating',
    review: 'Annual account review documentation',
    regulatory: 'Form ADV disclosure requirements',
  };
  for (let i = 0; i < count; i++) {
    const type = types[i % types.length];
    items.push({
      id: `compliance-${i + 1}`,
      type,
      description: descriptions[type],
      status: i === 0 ? 'overdue' : 'pending',
      dueDate: new Date(Date.now() + (i + 1) * 30 * 24 * 60 * 60 * 1000).toISOString(),
      priority: i === 0 ? 'high' : i === 1 ? 'medium' : 'low',
    });
  }
  return items;
};

// ===== PORTFOLIO DATA ENHANCEMENT =====
export const getAllUnifiedClientsWithPortfolio = (): ClientData[] => {
  const meetingOffsets = [1, 2, 3, 5, 7, 10, 14, 21, 28, 35, 42, 60, 90];

  const clientsWithPortfolio = unifiedClientDatabase.map((client, index) => {
    const enhancedClient = ensurePortfolioData(client);

    if (!enhancedClient.keyMetrics) {
      enhancedClient.keyMetrics = {
        portfolioReturn: Math.random() * 20 - 5,
        yearToDateReturn: Math.random() * 20 - 5,
        benchmarkComparison: Math.random() * 6 - 3,
        feeReview: Math.random() > 0.8,
        complianceItems: generateComplianceItems(Math.floor(Math.random() * 3))
      };
    }

    if (index < meetingOffsets.length) {
      enhancedClient.nextMeeting = generateFutureMeetingDate(meetingOffsets[index]);
    }

    const calendarClientIds = [
      'client-steven-julia-parker', 'client-lisa-anderson',
      'client-david-carol-williams', 'client-past-1', 'client-past-2',
      'client-james-crawford', 'client-rachel-kim',
      'client-foster', 'client-johnson', 'client-sweets-family'
    ];
    if (!enhancedClient.nextMeeting && calendarClientIds.includes(enhancedClient.id)) {
      enhancedClient.nextMeeting = generateFutureMeetingDate(
        Math.floor(Math.random() * 5) + 1
      );
    }

    const { financialDetails, upcomingMeetings, ...clientData } = enhancedClient;

    let finalClientData: ClientData;
    if (!clientData.extendedHousehold && !clientData.professionalNetwork && !clientData.preferredCommunication) {
      const crmData = generateCRMData(clientData);
      finalClientData = { ...clientData, ...crmData };
    } else {
      finalClientData = clientData;
    }

    // DATA DEGRADATION FOR READINESS DASHBOARD DEMO
    if (index >= 3 && index <= 4) {
      finalClientData.householdAssets = 45000;
      finalClientData.relationshipHistory = (finalClientData.relationshipHistory ?? []).slice(0, 1);
      if (!finalClientData.keyMetrics) {
        finalClientData.keyMetrics = {
          portfolioReturn: 8.5, yearToDateReturn: 8.5,
          benchmarkComparison: 1.2, feeReview: false,
          complianceItems: generateComplianceItems(1)
        };
      } else if (!finalClientData.keyMetrics.complianceItems || finalClientData.keyMetrics.complianceItems.length === 0) {
        finalClientData.keyMetrics.complianceItems = generateComplianceItems(1);
      }
    }

    if (index >= 5 && index <= 8) {
      if (finalClientData.portfolioData) {
        finalClientData.portfolioData = { ...finalClientData.portfolioData, topHoldings: [] };
      } else {
        finalClientData.portfolioData = { topHoldings: [] } as any;
      }
    }

    if (index === 20) {
      finalClientData.householdAssets = 75000;
      finalClientData.relationshipHistory = (finalClientData.relationshipHistory ?? []).slice(0, 1);
    }

    if (!finalClientData.serviceTier) {
      const assets = finalClientData.householdAssets || 0;
      if (assets >= 3000000) finalClientData.serviceTier = 'Platinum';
      else if (assets >= 1500000) finalClientData.serviceTier = 'Gold';
      else if (assets >= 500000) finalClientData.serviceTier = 'Silver';
      else finalClientData.serviceTier = 'Bronze';
    }

    return finalClientData;
  });

  return clientsWithPortfolio;
};

// Cached result to avoid reprocessing on every call
let _cachedClients: ClientData[] | null = null;

export const getAllUnifiedClients = (): ClientData[] => {
  if (_cachedClients) return _cachedClients;
  _cachedClients = getAllUnifiedClientsWithPortfolio();
  return _cachedClients;
};

export const getUnifiedClientById = (clientId: string): ClientData | null => {
  const client = unifiedClientDatabase.find(c => c.id === clientId);
  if (!client) return null;
  const { financialDetails, upcomingMeetings, ...clientData } = client;
  return clientData;
};

export const getClientFinancialDetails = (clientId: string): ClientSpecificContent | null => {
  const client = unifiedClientDatabase.find(c => c.id === clientId);
  return client ? client.financialDetails : null;
};

export const getClientMeetings = (clientId: string): EnhancedMeetingData[] => {
  const client = unifiedClientDatabase.find(c => c.id === clientId);
  return client ? client.upcomingMeetings : [];
};

export const getAllUnifiedMeetings = (): EnhancedMeetingData[] => {
  return unifiedClientDatabase.flatMap(client => client.upcomingMeetings);
};

export const searchUnifiedClientsByName = (searchTerm: string): ClientData[] => {
  const term = searchTerm.toLowerCase();
  return getAllUnifiedClients().filter(client =>
    client.name.toLowerCase().includes(term)
  );
};

export const validateUnifiedDataIntegrity = () => {
  const clients = getAllUnifiedClients();
  const meetings = getAllUnifiedMeetings();

  const validation = {
    totalClients: clients.length,
    totalMeetings: meetings.length,
    clientsWithMeetings: unifiedClientDatabase.filter(c => c.upcomingMeetings.length > 0).length,
    uniqueClientIds: new Set(clients.map(c => c.id)).size,
    uniqueMeetingIds: new Set(meetings.map(m => m.id)).size,
    meetingClientIdMatches: meetings.every(meeting =>
      clients.some(client => client.id === meeting.clientId)
    )
  };

  console.log('🔍 Unified Data Integrity Check:', validation);
  return validation;
};
