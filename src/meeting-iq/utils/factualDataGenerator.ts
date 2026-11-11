// @ts-nocheck
import { ClientData } from '@miq/types/advisor';
import { 
  PortfolioFactualData, 
  PlanningFactualData, 
  ComplianceFactualData, 
  PersonalFactualData,
  ActionsFactualData
} from '@miq/types/agenda-view-mode';

/**
 * Generate factual data for portfolio topics from client data
 */
export const generatePortfolioFactualData = (client: ClientData): PortfolioFactualData => {
  const portfolioData = client.portfolioData;
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate cash from allocation if available
  const cashValue = portfolioData 
    ? (portfolioData.totalValue * (portfolioData.allocation?.cash || 0)) / 100 
    : client.householdAssets * 0.07;

  // Build asset allocation from portfolio data
  const assetAllocation: PortfolioFactualData['assetAllocation'] = [];
  if (portfolioData?.allocation) {
    const alloc = portfolioData.allocation;
    const total = portfolioData.totalValue;
    
    if (alloc.stocks > 0) {
      assetAllocation.push({ category: 'Domestic Equity', value: total * alloc.stocks / 100, percentage: alloc.stocks });
    }
    if (alloc.bonds > 0) {
      assetAllocation.push({ category: 'Fixed Income', value: total * alloc.bonds / 100, percentage: alloc.bonds });
    }
    if (alloc.alternatives > 0) {
      assetAllocation.push({ category: 'Alternatives', value: total * alloc.alternatives / 100, percentage: alloc.alternatives });
    }
    if (alloc.cash > 0) {
      assetAllocation.push({ category: 'Cash Equivalents', value: total * alloc.cash / 100, percentage: alloc.cash });
    }
  }

  // Build top holdings
  const topHoldings: PortfolioFactualData['topHoldings'] = [];
  if (portfolioData?.topHoldings) {
    portfolioData.topHoldings.forEach(holding => {
      topHoldings.push({
        symbol: holding.symbol,
        name: holding.name,
        marketValue: holding.value,
        unrealizedGain: holding.value * 0.6, // Placeholder - would come from real data
        yield: Math.random() * 3 // Placeholder
      });
    });
  }

  return {
    householdValue: portfolioData?.totalValue || client.householdAssets,
    valueAsOfDate: today,
    cashEquivalents: cashValue,
    accountCount: 5, // Would come from real account data
    insurancePolicyCount: 1,
    insurancePolicyValue: 91625,
    assetAllocation,
    topHoldings,
    realizedGains: {
      description: 'Gains harvested for risk reduction per client permission',
      amount: 200000,
      period: 'Q4 2025'
    },
    unrealizedGains: {
      description: 'Substantial embedded gains remain in legacy positions',
      concentrations: ['Technology', 'Growth equities']
    },
    incomeGeneration: [
      { symbol: 'Portfolio', income: portfolioData?.totalValue ? portfolioData.totalValue * 0.02 : 0, notes: 'Low overall yield; improving cash yields' }
    ],
    recentAllocations: 'No new major equity purchases; DAF funded with appreciated stock'
  };
};

/**
 * Generate factual data for planning topics from client data
 */
export const generatePlanningFactualData = (client: ClientData): PlanningFactualData => {
  const planningData = client.planningData;
  
  return {
    retirementReadiness: planningData?.retirementReadiness || 85,
    goalProgress: planningData?.goalProgress?.map(goal => ({
      goal: goal.goal,
      target: goal.target,
      current: goal.current,
      onTrack: goal.onTrack,
      percentage: (goal.current / goal.target) * 100
    })) || [
      { goal: 'Retirement Savings', target: 10000000, current: 8150000, onTrack: true, percentage: 81.5 },
      { goal: 'Education Fund', target: 500000, current: 350000, onTrack: true, percentage: 70 }
    ],
    insuranceCoverage: {
      life: { 
        covered: planningData?.insuranceNeeds?.life ?? true, 
        details: planningData?.insuranceNeeds?.life ? 'Term policy in place' : undefined 
      },
      disability: { 
        covered: planningData?.insuranceNeeds?.disability ?? true 
      },
      longTermCare: { 
        covered: planningData?.insuranceNeeds?.longTermCare ?? false,
        details: planningData?.insuranceNeeds?.longTermCare ? 'Policy in force' : 'Should review options'
      }
    },
    emergencyFund: {
      target: 150000,
      current: 120000,
      monthsCovered: 8
    },
    estatePlanning: {
      willUpdated: '2024-03-15',
      trustEstablished: true,
      powerOfAttorney: true,
      healthcareDirective: true
    }
  };
};

/**
 * Generate factual data for compliance topics from client data
 */
export const generateComplianceFactualData = (client: ClientData): ComplianceFactualData => {
  const complianceStatus = client.complianceStatus;
  const keyMetrics = client.keyMetrics;
  
  return {
    rmdRequired: complianceStatus?.rmdRequired ?? false,
    rmdAmount: complianceStatus?.rmdRequired ? 125000 : undefined,
    rmdDeadline: complianceStatus?.rmdRequired ? '2025-12-31' : undefined,
    rmdStatus: complianceStatus?.rmdRequired ? 'pending' : 'not_applicable',
    beneficiaryUpdates: [
      { 
        account: 'IRA', 
        lastUpdated: complianceStatus?.beneficiaryUpdated?.toString() || '2024-01-15', 
        needsReview: false 
      },
      { 
        account: '401(k) Rollover', 
        lastUpdated: '2023-06-20', 
        needsReview: true 
      }
    ],
    pendingItems: keyMetrics?.complianceItems?.map(item => ({
      item: item.description,
      dueDate: item.dueDate?.toString(),
      priority: item.priority,
      status: item.status
    })) || [],
    lastReviewDate: complianceStatus?.lastReview?.toString() || '2024-09-15',
    nextReviewDue: '2025-03-15'
  };
};

/**
 * Generate factual data for personal topics from client data
 */
export const generatePersonalFactualData = (client: ClientData): PersonalFactualData => {
  const upcomingEvents: PersonalFactualData['upcomingEvents'] = [];
  
  // Add birthdays from extended household
  if (client.extendedHousehold) {
    client.extendedHousehold.forEach(member => {
      if (member.birthDate) {
        upcomingEvents.push({
          event: `${member.name}'s Birthday`,
          date: member.birthDate,
          notes: member.relationship
        });
      }
    });
  }

  // Add children birthdays
  if (client.children) {
    client.children.forEach(child => {
      upcomingEvents.push({
        event: `${child.name}'s Birthday`,
        date: new Date().toISOString(), // Would need actual birth date
        notes: `Age ${child.age}`
      });
    });
  }

  return {
    upcomingEvents: upcomingEvents.slice(0, 5),
    familyUpdates: client.extendedHousehold?.slice(0, 3).map(member => ({
      member: member.name,
      update: member.responsibilities || `${member.relationship}`
    })),
    communicationPreferences: client.preferredCommunication ? {
      method: client.preferredCommunication.method,
      frequency: client.preferredCommunication.frequency,
      bestTimeToContact: client.preferredCommunication.bestTimeToContact
    } : undefined
  };
};

/**
 * Generate factual data for actions topics from client data
 */
export const generateActionsFactualData = (client: ClientData): ActionsFactualData => {
  return {
    pendingActions: [
      {
        action: 'Review and sign updated beneficiary forms',
        priority: 'high',
        status: 'pending',
        notes: 'Regulatory requirement'
      },
      {
        action: 'Consider increasing 401(k) contribution by 2%',
        priority: 'medium',
        dueDate: '2026-12-31',
        status: 'pending',
        notes: 'Before year-end for tax efficiency'
      },
      {
        action: 'Schedule annual insurance review',
        priority: 'medium',
        status: 'pending',
        notes: 'Q4 recommended'
      }
    ],
    beneficiaryReview: {
      status: 'needs_review',
      lastUpdated: '2024-01-15',
      accountsAffected: ['IRA', '401(k) Rollover']
    },
    contributionOpportunities: [
      {
        type: '401(k)',
        recommendation: 'Increase contribution by 2% before year-end',
        potentialBenefit: 'Additional $3,200 tax deduction'
      }
    ],
    insuranceReview: {
      status: 'Due for review',
      scheduledDate: undefined,
      notes: 'Annual review recommended for Q4'
    },
    rothConversion: {
      recommended: true,
      reason: 'Current tax bracket positioning favorable',
      estimatedAmount: 50000
    }
  };
};

/**
 * Martinez-specific portfolio data
 */
const getMartinezPortfolioData = (): PortfolioFactualData => {
  return {
    householdValue: 8150036,
    valueAsOfDate: '2026-01-26',
    cashEquivalents: 574297,
    accountCount: 5,
    insurancePolicyCount: 1,
    insurancePolicyValue: 91625,
    assetAllocation: [
      { category: 'Domestic Equity', value: 5193778, percentage: 63.8 },
      { category: 'International Equity', value: 557863, percentage: 6.8 },
      { category: 'Domestic Bond', value: 1628751, percentage: 20 },
      { category: 'International Bond', value: 58499, percentage: 0.7 },
      { category: 'Cash Equivalents', value: 574297, percentage: 7 },
      { category: 'Alternatives', value: 45224, percentage: 0.6 }
    ],
    topHoldings: [
      { symbol: 'AAPL', account: 'James', marketValue: 682517, unrealizedGain: 637129, yield: 0.4 },
      { symbol: 'TSLA', marketValue: 470016, unrealizedGain: 396345 },
      { symbol: 'GOOGL/GOOG', marketValue: 764367, unrealizedGain: 722149 },
      { symbol: 'ISRG', marketValue: 271808, unrealizedGain: 249627 },
      { symbol: 'AVGO', marketValue: 267064, unrealizedGain: 231437 },
      { symbol: 'JNJ', marketValue: 201995, unrealizedGain: 172739 },
      { symbol: 'DHR', marketValue: 165990, unrealizedGain: 108581 }
    ],
    cashPositions: [
      { account: 'HV7057592', value: 473972 },
      { account: 'FZDXX', value: 338709, yield: 3.5 }
    ],
    realizedGains: {
      description: 'Gains harvested for risk reduction per client permission',
      amount: 200000,
      period: 'Q4 2025'
    },
    unrealizedGains: {
      description: 'Substantial embedded gains remain in legacy positions',
      concentrations: ['AAPL', 'TSLA', 'GOOGL', 'ISRG']
    },
    incomeGeneration: [
      { symbol: 'JNJ', income: 4742 },
      { symbol: 'JPM', income: 2686 },
      { symbol: 'CAT', income: 1349 },
      { symbol: 'Cash', income: 0, notes: 'Cash yields improving (FZDXX 3.5%+)' }
    ],
    underperformers: [
      { symbol: 'PAYX', account: 'James', loss: -796, yield: 4, notes: 'Hold for income' },
      { symbol: 'CVX', account: 'Carole', loss: -212 },
      { symbol: 'T', account: 'Carole', loss: -283 },
      { symbol: 'Muni Bonds', loss: 0, notes: 'Some trading below cost' }
    ],
    recentAllocations: 'No new major equity purchases; DAF funded with appreciated stock (FFBC, JNJ)'
  };
};

/**
 * Get factual data for a specific topic category
 */
export const getFactualDataForCategory = (
  category: 'overview' | 'portfolio' | 'planning' | 'compliance' | 'personal' | 'market' | 'goals' | 'actions' | undefined,
  client: ClientData
) => {
  switch (category) {
    case 'overview':
      return undefined; // Overview section doesn't have factual data - it's meeting logistics
    case 'portfolio':
      // Use Martinez-specific data if client ID contains 'martinez'
      if (client.id?.toLowerCase().includes('martinez') || client.name?.toLowerCase().includes('martinez')) {
        return getMartinezPortfolioData();
      }
      return generatePortfolioFactualData(client);
    case 'planning':
    case 'goals':
      return generatePlanningFactualData(client);
    case 'compliance':
      return generateComplianceFactualData(client);
    case 'personal':
      return generatePersonalFactualData(client);
    case 'actions':
      return generateActionsFactualData(client);
    case 'market':
      return undefined; // Market data would come from external source
    default:
      return undefined;
  }
};
