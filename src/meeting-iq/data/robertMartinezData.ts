// @ts-nocheck
import { ClientData } from '@miq/types/advisor';

/**
 * Enhanced Robert Martinez client data with comprehensive information
 * to support all the client question categories from the user's requirements
 */
export const robertMartinezData: ClientData & {
  // Enhanced demographic fields
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  seasonalResidency?: {
    winterAddress?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    summerAddress?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    taxDomicile: string;
  };
  spouse?: {
    name: string;
    email?: string;
    phone?: string;
    birthDate?: string;
  };
  dependents?: Array<{
    name: string;
    relationship: string;
    birthDate: string;
  }>;
  
  // Legal entities
  legalEntities?: {
    llc?: {
      name: string;
      state: string;
      taxId: string;
    };
    trust?: {
      name: string;
      type: 'revocable' | 'irrevocable';
      coTrustees: string[];
      establishedDate: string;
    };
  };
  
  // Enhanced financial details
  portfolioAttribution?: {
    domesticEquities: {
      allocation: number;
      performance: number;
      topHoldings: Array<{
        symbol: string;
        name: string;
        weight: number;
      }>;
    };
    internationalEquities: {
      allocation: number;
      performance: number;
      overweights: Array<{
        region: string;
        allocation: number;
        benchmark: number;
      }>;
    };
    performanceDrivers: string[];
  };
  
  // Planning assumptions
  planningAssumptions?: {
    collegeSavings?: {
      assumedReturn: number;
      minimumReturn: number;
      beneficiaries: Array<{
        name: string;
        targetAmount: number;
        yearsToCollege: number;
      }>;
    };
    retirementPlanning?: {
      maximumSustainableSpend: number;
      earliestRetirementAge: number;
      currentSavingsRate: number;
      requiredReturn: number;
    };
  };
  
  // Enhanced referral data
  referralData: {
    totalReferralsSent: number;
    successfulReferrals: number;
    conversionRate: number;
    referralHistory: Array<{
      referredName: string;
      referredDate: string;
      status: 'prospect' | 'client' | 'declined';
      becameClientDate?: string;
      estimatedValue?: number;
      notes?: string;
    }>;
    referralValue: {
      totalPotentialAUM: number;
      actualAUM: number;
    };
    isActiveReferrer: boolean;
    professionalConnections?: Array<{
      name: string;
      relationship: string;
      referralPotential: 'high' | 'medium' | 'low';
    }>;
  };
} = {
  id: 'client-robert-martinez',
  name: 'Robert Martinez',
  birthDate: '1979-03-15',
  email: 'robert.martinez@email.com',
  phone: '(555) 678-9012',
  category: 'enhanced',
  householdAssets: 2150000,
  lastMeeting: new Date('2024-08-15').toISOString(),
  riskTolerance: 'moderate',
  investmentObjectives: ['Growth', 'Tax Efficiency', 'Estate Planning'],
  
  // Enhanced demographics
  address: {
    street: '1547 Ocean Drive',
    city: 'Miami',
    state: 'Florida',
    zipCode: '33139'
  },
  
  primaryResidence: {
    street: '1547 Ocean Drive',
    city: 'Miami',
    state: 'Florida',
    zipCode: '33139'
  },
  
  seasonalResidence: {
    street: '45 Beacon Hill Drive',
    city: 'Boston',
    state: 'Massachusetts',
    zipCode: '02108',
    season: 'Summer'
  },
  
  spouse: {
    name: 'Maria Martinez',
    email: 'maria.martinez@email.com',
    phone: '(555) 678-9013',
    birthDate: '1982-07-20'
  },
  
  dependents: [
    {
      name: 'Sofia Martinez',
      relationship: 'daughter',
      birthDate: '2010-05-12'
    },
    {
      name: 'Diego Martinez',
      relationship: 'son',
      birthDate: '2012-11-08'
    }
  ],
  
  // Legal entities
  legalEntities: {
    llc: {
      name: 'Martinez Family Holdings LLC',
      state: 'Florida',
      taxId: '65-1234567'
    },
    trust: {
      name: 'The Martinez Family Revocable Trust',
      type: 'revocable',
      coTrustees: ['Maria Martinez', 'John Peterson (Successor Trustee)'],
      establishedDate: '2018-04-15'
    }
  },
  
  // Enhanced portfolio data
  portfolioAttribution: {
    domesticEquities: {
      allocation: 45,
      performance: 12.8,
      topHoldings: [
        { symbol: 'AAPL', name: 'Apple Inc.', weight: 4.2 },
        { symbol: 'MSFT', name: 'Microsoft Corporation', weight: 3.8 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', weight: 3.1 }
      ]
    },
    internationalEquities: {
      allocation: 25,
      performance: 8.4,
      overweights: [
        { region: 'India', allocation: 8.5, benchmark: 5.2 },
        { region: 'Japan', allocation: 6.2, benchmark: 4.8 }
      ]
    },
    performanceDrivers: [
      'Technology sector overweight (+180 bps)',
      'India regional overweight (+95 bps)',
      'Active stock selection in large-cap growth (+65 bps)'
    ]
  },
  
  // Planning assumptions
  planningAssumptions: {
    collegeSavings: {
      assumedReturn: 6.5,
      minimumReturn: 4.2,
      beneficiaries: [
        {
          name: 'Sofia Martinez',
          targetAmount: 350000,
          yearsToCollege: 4
        },
        {
          name: 'Diego Martinez', 
          targetAmount: 350000,
          yearsToCollege: 6
        }
      ]
    },
    retirementPlanning: {
      maximumSustainableSpend: 145000,
      earliestRetirementAge: 58,
      currentSavingsRate: 22,
      requiredReturn: 5.8
    }
  },
  
  keyMetrics: {
    portfolioReturn: 11.2,
    yearToDateReturn: 11.2,
    benchmarkComparison: 1.8,
    feeReview: false,
    complianceItems: [
      {
        id: 'rmd-martinez-1',
        type: 'regulatory',
        description: 'Trust documentation annual review required',
        status: 'pending',
        dueDate: new Date('2024-12-31').toISOString(),
        priority: 'medium'
      }
    ]
  },
  
  referralData: {
    totalReferralsSent: 6,
    successfulReferrals: 4,
    conversionRate: 67,
    referralHistory: [
      {
        referredName: 'Carlos Rodriguez',
        referredDate: '2023-09-12',
        status: 'client',
        becameClientDate: '2023-10-08',
        estimatedValue: 850000,
        notes: 'Business partner from real estate development firm'
      },
      {
        referredName: 'Jennifer Liu',
        referredDate: '2024-01-15',
        status: 'client',
        becameClientDate: '2024-02-12',
        estimatedValue: 620000,
        notes: 'Colleague from tech company, impressed with tax planning strategies'
      },
      {
        referredName: 'Michael Thompson',
        referredDate: '2024-03-20',
        status: 'client',
        becameClientDate: '2024-04-15',
        estimatedValue: 750000,
        notes: 'Neighbor who appreciated estate planning guidance'
      },
      {
        referredName: 'Sarah Williams',
        referredDate: '2024-05-10',
        status: 'prospect',
        estimatedValue: 480000,
        notes: 'Currently evaluating options, interested in international diversification'
      },
      {
        referredName: 'David Chen',
        referredDate: '2024-06-22',
        status: 'client',
        becameClientDate: '2024-07-18',
        estimatedValue: 920000,
        notes: 'Former colleague who relocated to Florida for tax benefits'
      },
      {
        referredName: 'Lisa Garcia',
        referredDate: '2024-07-30',
        status: 'declined',
        estimatedValue: 380000,
        notes: 'Decided to work with family friend advisor instead'
      }
    ],
    referralValue: {
      totalPotentialAUM: 4000000,
      actualAUM: 3140000
    },
    isActiveReferrer: true,
    professionalConnections: [
      {
        name: 'Martinez & Associates Real Estate',
        relationship: 'Business partners and clients',
        referralPotential: 'high'
      },
      {
        name: 'Tech Innovation Circle',
        relationship: 'Professional network group',
        referralPotential: 'medium'
      },
      {
        name: 'Miami Beach Country Club',
        relationship: 'Social and golf network',
        referralPotential: 'medium'
      }
    ]
  }
};