// @ts-nocheck
import { ClientData } from '@miq/types/advisor';
import { getAllUnifiedClients, getClientFinancialDetails } from './unifiedClientData';

// Keep the same interface name used across the app
export interface ClientSpecificContent {
  retirementPlanning: {
    currentSavings: number;
    targetAmount: number;
    monthlyContribution: number;
    projectedRetirementAge: number;
    yearsToRetirement: number;
  };
  collegeSavings: {
    currentAmount: number;
    targetAmount: number;
    monthlyContribution: number;
    yearsRemaining: number;
    beneficiaryName: string;
  };
  emergencyFund: {
    currentAmount: number;
    targetAmount: number;
    monthlyExpenses: number;
    currentMonthsCovered: number;
    targetMonths: number;
  };
  taxHarvesting: {
    potentialSavings: number;
    harvestableOpportunities: number;
    estimatedTaxBracket: number;
    yearToDateLosses: number;
  };
  lastMeeting: {
    portfolioPerformance: {
      quarterlyReturn: number;
      benchmarkReturn: number;
      outperformance: number;
    };
    retirementTimeline: {
      currentAge: number;
      targetRetirementAge: number;
      confidenceLevel: number;
    };
    rothContribution: {
      currentYear: number;
      maxContribution: number;
      taxSavings: number;
    };
    collegeFunding: {
      beneficiaryAge: number;
      monthsToCollege: number;
      fundingProgress: number;
    };
  };
  portfolioPerformance: {
    ytdReturn: number;
    benchmarkReturn: number;
    outperformance: number;
    rebalancingImpact: number;
    bondDuration: number;
    internationalAllocation: number;
  };
  nextActions: {
    beneficiaryReview: {
      lastReviewDate: string;
      urgency: 'low' | 'medium' | 'high';
      pendingUpdates: number;
    };
    retirement401k: {
      currentContribution: number;
      maxContribution: number;
      employerMatch: number;
      potentialTaxSavings: number;
    };
    insuranceReview: {
      lifeInsurance: number;
      disabilityInsurance: number;
      lastReviewDate: string;
      adequacyRating: 'low' | 'adequate' | 'high';
    };
    rothConversion: {
      opportunityAmount: number;
      taxImpact: number;
      recommendedTiming: string;
    };
  };
}

// Backward-compatible service used throughout the app
export class ClientContentService {
  static getClientContent(clientId: string): ClientSpecificContent | null {
    return getClientFinancialDetails(clientId);
  }
  static getRetirementData(clientId: string) {
    return this.getClientContent(clientId)?.retirementPlanning ?? null;
  }
  static getCollegeSavingsData(clientId: string) {
    return this.getClientContent(clientId)?.collegeSavings ?? null;
  }
  static getEmergencyFundData(clientId: string) {
    return this.getClientContent(clientId)?.emergencyFund ?? null;
  }
  static getTaxHarvestingData(clientId: string) {
    return this.getClientContent(clientId)?.taxHarvesting ?? null;
  }
  static getLastMeetingData(clientId: string) {
    return this.getClientContent(clientId)?.lastMeeting ?? null;
  }
  static getPortfolioPerformanceData(clientId: string) {
    return this.getClientContent(clientId)?.portfolioPerformance ?? null;
  }
  static getNextActionsData(clientId: string) {
    return this.getClientContent(clientId)?.nextActions ?? null;
  }
}

// Lazy-loaded compatibility export
let _cachedContent: Record<string, ClientSpecificContent> | null = null;

export const clientSpecificContent: Record<string, ClientSpecificContent> = new Proxy({} as Record<string, ClientSpecificContent>, {
  get(target, prop) {
    if (!_cachedContent) {
      _cachedContent = {};
      const clients: ClientData[] = getAllUnifiedClients();
      clients.forEach((c) => {
        const details = getClientFinancialDetails(c.id);
        if (details) _cachedContent![c.id] = details;
      });
    }
    return Reflect.get(_cachedContent, prop);
  }
});
