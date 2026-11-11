// @ts-nocheck
export interface MeetingContext {
  id: string;
  clientTier: 'standard' | 'enhanced' | 'premium';
  meetingType: 'annual_review' | 'quarterly_checkin' | 'planning_session' | 'onboarding' | 'compliance_review';
  meetingDate: Date | string;
  lastMeetingDate?: Date | string;
  lastMeetingType?: string;
  advisor: {
    name: string;
    role: string;
  };
  clientServiceAssociate?: {
    name: string;
  };
}

export interface HistoricalMeetingData {
  id: string;
  meetingDate: Date | string;
  keyDiscussionPoints: string[];
  actionItemsCompleted: Array<{
    item: string;
    completionDate: Date | string;
  }>;
  outstandingActionItems: Array<{
    item: string;
    status: 'pending' | 'in_progress' | 'delayed';
    originalDueDate: Date | string;
  }>;
  clientSatisfactionScore: number; // 1-10
  meetingNotes?: string;
}

export interface AccountActivity {
  id: string;
  periodStart: Date | string;
  periodEnd: Date | string;
  newAccountsOpened: Array<{
    accountType: string;
    openDate: Date | string;
    initialDeposit: number;
    purpose: string;
  }>;
  closedAccounts: Array<{
    accountType: string;
    closeDate: Date | string;
    finalBalance: number;
    reason: string;
  }>;
  majorTransactions: Array<{
    date: Date | string;
    type: 'deposit' | 'withdrawal' | 'transfer';
    amount: number;
    account: string;
    description: string;
  }>;
  beneficiaryChanges: Array<{
    date: Date | string;
    account: string;
    previousBeneficiary: string;
    newBeneficiary: string;
    reason: string;
  }>;
  contactUpdates: Array<{
    date: Date | string;
    field: 'address' | 'phone' | 'email' | 'emergency_contact';
    previousValue: string;
    newValue: string;
  }>;
}

export interface DetailedFinancialData {
  totalAssets: number;
  performanceMetrics: {
    ytdReturn: number;
    ytdBenchmark: number;
    oneYearReturn: number;
    oneYearBenchmark: number;
    threeYearReturn: number;
    threeYearBenchmark: number;
  };
  assetAllocation: {
    current: {
      stocks: number;
      bonds: number;
      alternatives: number;
      cash: number;
    };
    target: {
      stocks: number;
      bonds: number;
      alternatives: number;
      cash: number;
    };
  };
  accountDetails: Array<{
    accountId: string;
    accountType: '401k' | 'ira' | 'roth_ira' | 'taxable' | 'trust' | 'other';
    currentBalance: number;
    performancePercent: number;
    contributionsYTD: number;
    requiredActions: string[];
  }>;
}

export interface ComplianceRequirements {
  rmdData?: {
    currentYear: number;
    rmdAmount: number;
    status: 'completed' | 'pending' | 'not_required';
    nextYearProjected: number;
  };
  documentationStatus: {
    beneficiaryInfo: {
      status: 'current' | 'needs_update';
      lastUpdated: Date | string;
    };
    riskToleranceAssessment: {
      lastUpdated: Date | string;
      nextDue: Date | string;
    };
    investmentPolicyStatement: {
      status: 'current' | 'needs_review';
      lastReviewed: Date | string;
    };
    estatePlanningDocs: {
      willStatus: 'current' | 'needs_update' | 'unknown';
      powerOfAttorney: 'current' | 'needs_update' | 'unknown';
      lastReviewed?: Date | string;
    };
  };
  regulatoryItems: Array<{
    requirement: string;
    status: 'compliant' | 'needs_attention' | 'pending';
    dueDate?: Date | string;
    description: string;
  }>;
  feeDisclosureStatus: {
    lastProvided: Date | string;
    nextDue: Date | string;
    status: 'current' | 'due_soon' | 'overdue';
  };
}

export interface PersonalContext {
  lifeChangesSinceLastMeeting: Array<{
    type: 'employment' | 'family' | 'health' | 'address' | 'other';
    description: string;
    date: Date | string;
    planningImpact: 'high' | 'medium' | 'low';
  }>;
  currentGoals: {
    shortTerm: Array<{
      goal: string;
      timeframe: string;
      targetAmount: number;
      priority: 'high' | 'medium' | 'low';
    }>;
    mediumTerm: Array<{
      goal: string;
      timeframe: string;
      targetAmount: number;
      priority: 'high' | 'medium' | 'low';
    }>;
    longTerm: Array<{
      goal: string;
      timeframe: string;
      targetAmount: number;
      priority: 'high' | 'medium' | 'low';
    }>;
    newGoals: Array<{
      goal: string;
      timeframe: string;
      targetAmount: number;
      discussionNotes: string;
    }>;
  };
  riskToleranceAndPreferences: {
    currentRiskTolerance: 'conservative' | 'moderate' | 'aggressive';
    investmentPreferences: {
      esgPreference: boolean;
      sectorPreferences: string[];
      avoidances: string[];
    };
    liquidityNeeds: Array<{
      expense: string;
      amount: number;
      timing: Date | string;
      priority: 'critical' | 'important' | 'nice_to_have';
    }>;
  };
}

export interface MarketContext {
  performanceBenchmarks: {
    sp500YTD: number;
    bondIndexYTD: number;
    internationalYTD: number;
    sectorPerformance: Array<{
      sector: string;
      ytdReturn: number;
      relevantToClient: boolean;
    }>;
  };
  marketCommentary: {
    currentEnvironment: string;
    interestRateEnvironment: {
      currentFedFundsRate: number;
      direction: 'rising' | 'falling' | 'stable';
      nextMeetingDate: Date | string;
    };
    economicIndicators: {
      inflation: number;
      unemployment: number;
      gdpGrowth: number;
    };
    marketOutlook: string;
  };
  clientSpecificImpact: {
    portfolioImpact: string;
    opportunitiesIdentified: Array<{
      opportunity: string;
      description: string;
      timeframe: string;
      estimatedBenefit: number;
    }>;
    risksToMonitor: Array<{
      risk: string;
      description: string;
      mitigationStrategy: string;
      priority: 'high' | 'medium' | 'low';
    }>;
  };
}

export interface ActionItemsTracking {
  previousCommitments: Array<{
    item: string;
    originalDueDate: Date | string;
    status: 'completed' | 'in_progress' | 'delayed' | 'cancelled';
    completionDate?: Date | string;
    notes?: string;
  }>;
  newRecommendations: {
    investmentChanges: Array<{
      recommendation: string;
      rationale: string;
      timeframe: string;
      estimatedImpact: number;
      priority: 'high' | 'medium' | 'low';
    }>;
    taxPlanning: Array<{
      strategy: string;
      description: string;
      deadline: Date | string;
      estimatedSavings: number;
    }>;
    estatePlanning: Array<{
      update: string;
      reason: string;
      urgency: 'immediate' | 'within_3_months' | 'within_year';
    }>;
    insuranceReview: Array<{
      coverage: string;
      recommendation: string;
      reason: string;
    }>;
    cashFlowPlanning: Array<{
      adjustment: string;
      impact: string;
      implementationDate: Date | string;
    }>;
  };
  followUpRequired: {
    clientHomework: Array<{
      task: string;
      description: string;
      dueDate: Date | string;
      priority: 'high' | 'medium' | 'low';
    }>;
    advisorFollowUp: Array<{
      task: string;
      description: string;
      dueDate: Date | string;
      estimatedTime: number;
    }>;
  };
}

export interface ComprehensiveMeetingPrep {
  id: string;
  clientId: string;
  createdDate: Date | string;
  lastModified: Date | string;
  preparedBy: string;
  meetingContext: MeetingContext;
  historicalData: HistoricalMeetingData[];
  accountActivity: AccountActivity;
  financialData: DetailedFinancialData;
  complianceRequirements: ComplianceRequirements;
  personalContext: PersonalContext;
  marketContext: MarketContext;
  actionItems: ActionItemsTracking;
  preparationStatus: {
    overallCompletion: number;
    sectionCompletion: {
      meetingContext: number;
      historicalData: number;
      accountActivity: number;
      financialData: number;
      compliance: number;
      personalContext: number;
      marketContext: number;
      actionItems: number;
    };
  };
}

export type PreparationSection = 
  | 'meeting_context'
  | 'historical_data'
  | 'account_activity'
  | 'financial_data'
  | 'compliance'
  | 'personal_context'
  | 'market_context'
  | 'action_items';