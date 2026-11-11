// @ts-nocheck
// Types for the dual-view agenda system (Factual Data vs Client Narrative)

export type AgendaViewMode = 'factual' | 'narrative';

export interface PortfolioFactualData {
  householdValue: number;
  valueAsOfDate: string;
  cashEquivalents: number;
  accountCount: number;
  insurancePolicyCount: number;
  insurancePolicyValue?: number;
  
  assetAllocation: Array<{
    category: string;
    value: number;
    percentage: number;
  }>;
  
  topHoldings: Array<{
    symbol: string;
    name?: string;
    account?: string;
    marketValue: number;
    unrealizedGain: number;
    yield?: number;
  }>;
  
  cashPositions?: Array<{
    account: string;
    value: number;
    yield?: number;
  }>;
  
  realizedGains?: {
    description: string;
    amount?: number;
    period?: string;
  };
  
  unrealizedGains?: {
    description: string;
    concentrations?: string[];
  };
  
  incomeGeneration?: Array<{
    symbol: string;
    income: number;
    notes?: string;
  }>;
  
  underperformers?: Array<{
    symbol: string;
    account?: string;
    loss: number;
    yield?: number;
    notes?: string;
  }>;
  
  recentAllocations?: string;
}

export interface PlanningFactualData {
  retirementReadiness: number;
  
  goalProgress: Array<{
    goal: string;
    target: number;
    current: number;
    onTrack: boolean;
    percentage?: number;
  }>;
  
  insuranceCoverage: {
    life: { covered: boolean; details?: string };
    disability: { covered: boolean; details?: string };
    longTermCare: { covered: boolean; details?: string };
  };
  
  emergencyFund?: {
    target: number;
    current: number;
    monthsCovered: number;
  };
  
  estatePlanning?: {
    willUpdated?: string;
    trustEstablished?: boolean;
    powerOfAttorney?: boolean;
    healthcareDirective?: boolean;
  };
}

export interface ComplianceFactualData {
  rmdRequired: boolean;
  rmdAmount?: number;
  rmdDeadline?: string;
  rmdStatus?: 'completed' | 'pending' | 'not_applicable';
  
  beneficiaryUpdates: Array<{
    account: string;
    lastUpdated: string;
    needsReview: boolean;
  }>;
  
  pendingItems: Array<{
    item: string;
    dueDate?: string;
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'in_progress' | 'overdue' | 'completed';
  }>;
  
  lastReviewDate?: string;
  nextReviewDue?: string;
}

export interface PersonalFactualData {
  upcomingEvents?: Array<{
    event: string;
    date: string;
    notes?: string;
  }>;
  
  familyUpdates?: Array<{
    member: string;
    update: string;
  }>;
  
  lifeEvents?: Array<{
    event: string;
    date?: string;
    financialImplications?: string;
  }>;
  
  communicationPreferences?: {
    method: string;
    frequency: string;
    bestTimeToContact?: string;
  };
}

export interface MarketFactualData {
  relevantIndices?: Array<{
    name: string;
    value: number;
    change: number;
    changePercent: number;
  }>;
  
  sectorExposure?: Array<{
    sector: string;
    allocation: number;
    performance: number;
  }>;
  
  impactedHoldings?: Array<{
    symbol: string;
    impact: string;
    recommendation?: string;
  }>;
}

export interface ActionsFactualData {
  pendingActions: Array<{
    action: string;
    priority: 'high' | 'medium' | 'low';
    dueDate?: string;
    status: 'pending' | 'in_progress' | 'completed';
    notes?: string;
  }>;
  
  beneficiaryReview?: {
    status: 'current' | 'needs_review' | 'overdue';
    lastUpdated?: string;
    accountsAffected?: string[];
  };
  
  contributionOpportunities?: Array<{
    type: string;
    recommendation: string;
    potentialBenefit?: string;
  }>;
  
  insuranceReview?: {
    status: string;
    scheduledDate?: string;
    notes?: string;
  };
  
  rothConversion?: {
    recommended: boolean;
    reason?: string;
    estimatedAmount?: number;
  };
}

export type TopicFactualData = 
  | PortfolioFactualData 
  | PlanningFactualData 
  | ComplianceFactualData 
  | PersonalFactualData
  | MarketFactualData
  | ActionsFactualData;

export interface AgendaViewModeState {
  globalMode: AgendaViewMode;
  topicOverrides: Record<string, AgendaViewMode>;
}

// Helper to get effective view mode for a topic
export const getEffectiveViewMode = (
  globalMode: AgendaViewMode,
  topicId: string,
  topicOverrides: Record<string, AgendaViewMode>
): AgendaViewMode => {
  return topicOverrides[topicId] ?? globalMode;
};

// Check if a topic is overriding the global mode
export const isTopicOverriding = (
  globalMode: AgendaViewMode,
  topicId: string,
  topicOverrides: Record<string, AgendaViewMode>
): boolean => {
  return topicId in topicOverrides && topicOverrides[topicId] !== globalMode;
};
