// @ts-nocheck
import { ClientData } from '@miq/types/advisor';
import { EnhancedMeetingData } from '@miq/components/canvas/MeetingCard';
import { ClientSpecificContent } from './clientSpecificData';
import { robertMartinezData } from './robertMartinezData';
import { generateCRMData } from '@miq/utils/crmDataGenerator';
import { generatePortfolioData, ensurePortfolioData } from './mockPortfolioData';

/**
 * UNIFIED CLIENT DATA STRUCTURE
 * Single source of truth for all client information
 * 
 * This file consolidates all client data from:
 * - mockClients.ts
 * - mockClientDataExtended.ts 
 * - clientSpecificData.ts
 * - mockDailyHighlights.ts (meeting data)
 * - mockMeetingData.ts
 */

export interface UnifiedClientData extends ClientData {
  financialDetails: ClientSpecificContent;
  upcomingMeetings: EnhancedMeetingData[];
}

// Compliance items generator
const generateComplianceItems = (count: number) => {
  const items = [];
  const types = ['rmd', 'beneficiary', 'review', 'regulatory'] as const;
  const descriptions = {
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

/**
 * UNIFIED CLIENT DATABASE
 * All clients with consistent IDs, complete data, and linked meetings
 */
export const unifiedClientDatabase: UnifiedClientData[] = [
  // ===== THE SWEETS HOUSEHOLD (Rick & Karen) =====
  {
    id: 'client-sweets-family',
    name: 'Rick & Karen Sweets',
    birthDate: '1975-07-14',
    email: 'rick.sweets@email.com',
    phone: '(555) 222-3344',
    category: 'high-touch',
    householdAssets: 1950000,
    lastMeeting: new Date('2024-11-20').toISOString(),
    nextMeeting: '2026-03-11T10:30:00',
    nextMeetingDetails: {
      time: '10:30 AM',
      duration: 60,
      type: 'Annual Review',
      location: { type: 'office', details: 'Conference Room A' },
      preparationStatus: 'ready'
    },
    riskTolerance: 'moderate',
    investmentObjectives: ['Retirement Planning', 'Estate Planning', 'Tax Optimization'],
    extendedHousehold: [
      {
        name: 'Rick Sweets',
        relationship: 'self',
        email: 'rick.sweets@email.com',
        phone: '(555) 222-3344',
        birthDate: '1975-07-14',
        role: 'primary' as const,
        responsibilities: 'Primary account holder, lead decision maker'
      },
      {
        name: 'Karen Sweets',
        relationship: 'spouse',
        email: 'karen.sweets@email.com',
        phone: '(555) 222-3345',
        birthDate: '1977-11-02',
        role: 'spouse' as const,
        responsibilities: 'Joint account holder, co-decision maker'
      }
    ],
    professionalNetwork: {
      accountant: {
        name: 'Greg Hartley',
        firm: 'Hartley & Associates',
        email: 'greg@hartleyassoc.com',
        phone: '(555) 444-5566',
        specialties: ['Tax Planning', 'College Savings'],
        yearsWorking: 5,
        lastContact: '2024-10-15'
      },
      estateAttorney: {
        name: 'Laura Jensen',
        firm: 'Jensen Law Group',
        email: 'laura@jensenlaw.com',
        phone: '(555) 444-7788',
        specialties: ['Estate Planning', 'Trust Administration'],
        yearsWorking: 3,
        lastContact: '2024-09-20'
      }
    },
    preferredCommunication: {
      method: 'email' as const,
      frequency: 'quarterly' as const,
      bestTimeToContact: 'Afternoons (1-4 PM)'
    },
    relationshipHistory: [
      {
        date: new Date('2024-11-20').toISOString(),
        milestone: 'Annual Review',
        type: 'regular_review' as const,
        description: 'Annual review — discussed retirement income strategy and estate plan updates',
        outcome: 'Updated 529 allocations, reviewed estate documents'
      },
      {
        date: new Date('2024-08-10').toISOString(),
        milestone: '529 Plan Follow-up',
        type: 'regular_review' as const,
        description: 'Follow-up on 529 plan rebalancing',
        outcome: 'Rebalanced 529 plans for both children'
      },
      {
        date: new Date('2024-05-15').toISOString(),
        milestone: 'Mid-Year Portfolio Review',
        type: 'regular_review' as const,
        description: 'Mid-year portfolio review',
        outcome: 'Maintained current allocation strategy'
      }
    ],
    financialDetails: {
      retirementPlanning: { currentSavings: 980000, targetAmount: 3200000, monthlyContribution: 5500, projectedRetirementAge: 65, yearsToRetirement: 14 },
      collegeSavings: { currentAmount: 0, targetAmount: 0, monthlyContribution: 0, yearsRemaining: 0, beneficiaryName: 'N/A' },
      emergencyFund: { currentAmount: 85000, targetAmount: 90000, monthlyExpenses: 14000, currentMonthsCovered: 6.1, targetMonths: 6 },
      taxHarvesting: { potentialSavings: 9500, harvestableOpportunities: 11, estimatedTaxBracket: 32, yearToDateLosses: 3800 },
      lastMeeting: { portfolioPerformance: { quarterlyReturn: 4.2, benchmarkReturn: 3.8, outperformance: 0.4 }, retirementTimeline: { currentAge: 50, targetRetirementAge: 65, confidenceLevel: 84 }, rothContribution: { currentYear: 7000, maxContribution: 7500, taxSavings: 2240 } },
      portfolioPerformance: { ytdReturn: 10.8, benchmarkReturn: 9.5, outperformance: 1.3, rebalancingImpact: 0.3, bondDuration: 4.8, internationalAllocation: 20 },
      nextActions: { beneficiaryReview: { lastReviewDate: '2024-09-05', urgency: 'medium' as const, pendingUpdates: 1 }, retirement401k: { currentContribution: 22000, maxContribution: 23000, employerMatch: 11000, potentialTaxSavings: 240 }, insuranceReview: { lifeInsurance: 1200000, disabilityInsurance: 350000, lastReviewDate: '2024-06-10', adequacyRating: 'adequate' as const }, rothConversion: { opportunityAmount: 55000, taxImpact: 17600, recommendedTiming: 'Q2 2026' } }
    },
    upcomingMeetings: [],
    keyMetrics: { portfolioReturn: 10.8, yearToDateReturn: 10.8, benchmarkComparison: 1.3, feeReview: false, complianceItems: generateComplianceItems(1) }
  },
  // ===== ROBERT MARTINEZ (HIGH READINESS - All Layers Pass) =====
  // Layer status: All 5 layers pass
  // Expected dots: ●●●●● (all green)
  {
    ...robertMartinezData,
    // Add future meeting for L1 to pass
    nextMeeting: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    nextMeetingDetails: {
      time: '10:00 AM',
      duration: 60,
      type: 'Annual Review',
      location: { type: 'office', details: 'Conference Room A' },
      preparationStatus: 'ready'
    },
    // Add rich CRM data for Robert Martinez
    extendedHousehold: [
      {
        name: 'Carmen Martinez',
        relationship: 'spouse',
        email: 'carmen.martinez@email.com',
        phone: '(555) 234-5679',
        birthDate: '1980-08-22',
        role: 'spouse' as const,
        responsibilities: 'Joint account holder, financial co-decision maker'
      },
      {
        name: 'Sofia Martinez',
        relationship: 'daughter',
        birthDate: '2010-03-15',
        role: 'beneficiary' as const,
        responsibilities: '529 education plan beneficiary'
      },
      {
        name: 'Diego Martinez',
        relationship: 'son',
        birthDate: '2012-11-08',
        role: 'beneficiary' as const,
        responsibilities: '529 education plan beneficiary'
      },
      {
        name: 'Maria Rodriguez',
        relationship: 'sister',
        email: 'maria.rodriguez@email.com',
        phone: '(555) 234-5680',
        role: 'emergency_contact' as const,
        responsibilities: 'Primary emergency contact, guardian designee',
        emergencyContactPriority: 1
      }
    ],
    professionalNetwork: {
      accountant: {
        name: 'Margaret Foster CPA',
        firm: 'Foster & Associates CPAs',
        email: 'margaret.foster@fosteraccounting.com',
        phone: '(555) 789-1234',
        specialties: ['Tax Planning', 'Estate Tax', 'Business Tax', 'High Net Worth'],
        yearsWorking: 6,
        lastContact: '2024-08-15',
        collaborationFrequency: 'quarterly',
        referralSource: 'client referral',
        keyAchievements: 'Saved $18K in taxes through strategic planning'
      },
      estateAttorney: {
        name: 'James Wellington Esq.',
        firm: 'Wellington & Partners LLP',
        email: 'james.wellington@wellingtonlaw.com',
        phone: '(555) 789-5678',
        specialties: ['Estate Planning', 'Trust Administration', 'Tax Law', 'Business Succession'],
        yearsWorking: 4,
        lastContact: '2024-07-20',
        collaborationFrequency: 'annually',
        referralSource: 'professional referral',
        keyAchievements: 'Established comprehensive estate plan with tax optimization'
      },
      insuranceAgent: {
        name: 'Karen Shields',
        firm: 'Shields Insurance Group',
        email: 'karen.shields@shieldsinsurance.com',
        phone: '(555) 789-9012',
        coverageTypes: ['Life Insurance', 'Disability Insurance', 'Long Term Care', 'Umbrella Policy'],
        yearsWorking: 8,
        lastContact: '2024-09-05',
        collaborationFrequency: 'semi-annually',
        referralSource: 'advisor referral',
        keyAchievements: 'Optimized insurance portfolio saving $2,400 annually'
      }
    },
    preferredCommunication: {
      method: 'email' as const,
      frequency: 'monthly' as const,
      bestTimeToContact: 'Weekday evenings (6-8 PM)'
    },
    relationshipHistory: [
      {
        date: new Date('2024-09-10').toISOString(),
        milestone: 'Quarterly Portfolio Review',
        type: 'regular_review' as const,
        description: 'Comprehensive review of portfolio performance, discussed college funding strategy and retirement timeline adjustments',
        outcome: 'Portfolio rebalanced for optimal tax efficiency, increased 529 contributions'
      },
      {
        date: new Date('2024-06-15').toISOString(),
        milestone: 'Estate Plan Update',
        type: 'life_event' as const,
        description: 'Updated estate planning documents following promotion and salary increase',
        outcome: 'Revised trust documents and beneficiary designations'
      },
      {
        date: new Date('2023-12-20').toISOString(),
        milestone: 'Annual Financial Review',
        type: 'regular_review' as const,
        description: 'Year-end tax planning session and 2024 financial goal setting',
        outcome: 'Implemented tax-loss harvesting strategy, set aggressive savings targets'
      },
      {
        date: new Date('2020-03-15').toISOString(),
        milestone: 'Client Onboarding Completed',
        type: 'onboarding' as const,
        description: 'Successfully onboarded as enhanced service client, established comprehensive financial plan',
        outcome: 'Diversified investment portfolio created with focus on growth and tax efficiency'
      }
    ],
    financialDetails: {
      retirementPlanning: {
        currentSavings: 1280000,
        targetAmount: 3500000,
        monthlyContribution: 4200,
        projectedRetirementAge: 62,
        yearsToRetirement: 17
      },
      collegeSavings: {
        currentAmount: 285000,
        targetAmount: 700000,
        monthlyContribution: 2800,
        yearsRemaining: 4,
        beneficiaryName: 'Sofia & Diego Martinez'
      },
      emergencyFund: {
        currentAmount: 95000,
        targetAmount: 120000,
        monthlyExpenses: 20000,
        currentMonthsCovered: 4.8,
        targetMonths: 6
      },
      taxHarvesting: {
        potentialSavings: 12500,
        harvestableOpportunities: 18,
        estimatedTaxBracket: 35,
        yearToDateLosses: 5200
      },
      lastMeeting: {
        portfolioPerformance: {
          quarterlyReturn: 4.2,
          benchmarkReturn: 3.8,
          outperformance: 0.4
        },
        retirementTimeline: {
          currentAge: 45,
          targetRetirementAge: 62,
          confidenceLevel: 88
        },
        rothContribution: {
          currentYear: 7000,
          maxContribution: 7000,
          taxSavings: 2450
        },
        collegeFunding: {
          beneficiaryAge: 14,
          monthsToCollege: 48,
          fundingProgress: 40.7
        }
      },
      portfolioPerformance: {
        ytdReturn: 11.2,
        benchmarkReturn: 9.4,
        outperformance: 1.8,
        rebalancingImpact: 0.3,
        bondDuration: 4.8,
        internationalAllocation: 25
      },
      nextActions: {
        beneficiaryReview: {
          lastReviewDate: '2024-06-10',
          urgency: 'low' as const,
          pendingUpdates: 0
        },
        retirement401k: {
          currentContribution: 23000,
          maxContribution: 23000,
          employerMatch: 11500,
          potentialTaxSavings: 0
        },
        insuranceReview: {
          lifeInsurance: 2000000,
          disabilityInsurance: 450000,
          lastReviewDate: '2024-05-20',
          adequacyRating: 'high' as const
        },
        rothConversion: {
          opportunityAmount: 125000,
          taxImpact: 43750,
          recommendedTiming: 'Q1 2025'
        }
      }
    },
    // L4 PASS: Add portfolioData with topHoldings
    portfolioData: {
      totalValue: 2150000,
      ytdReturn: 11.2,
      benchmarkReturn: 9.4,
      allocation: {
        stocks: 55,
        bonds: 30,
        alternatives: 10,
        cash: 5,
      },
      topHoldings: [
        { symbol: 'AAPL', name: 'Apple Inc.', percentage: 4.2, value: 90300 },
        { symbol: 'MSFT', name: 'Microsoft Corp.', percentage: 3.8, value: 81700 },
        { symbol: 'SCHB', name: 'Schwab US Broad Market', percentage: 12.0, value: 258000 },
        { symbol: 'SCHZ', name: 'Schwab US Aggregate Bond', percentage: 15.0, value: 322500 },
      ],
    },
    upcomingMeetings: []
  },
  {
    // ===== SARAH JOHNSON =====
    id: 'client-sarah-johnson',
    name: 'Sarah Johnson',
    birthDate: '1985-07-22',
    email: 'sarah.johnson@email.com',
    phone: '(555) 234-5678',
    category: 'standard',
    householdAssets: 765000,
    lastMeeting: new Date('2024-09-10').toISOString(),
    riskTolerance: 'moderate',
    investmentObjectives: ['Growth', 'Retirement Planning'],
    
    // Add rich CRM data for Sarah Johnson
    extendedHousehold: [
      {
        name: 'Peter Johnson',
        relationship: 'spouse',
        email: 'peter.johnson@email.com',
        phone: '(555) 234-5679',
        birthDate: '1983-02-14',
        role: 'spouse' as const,
        responsibilities: 'Joint account holder, investment co-decision maker'
      },
      {
        name: 'Rebecca Wilson',
        relationship: 'sister',
        email: 'rebecca.wilson@email.com',
        phone: '(555) 234-5681',
        role: 'emergency_contact' as const,
        responsibilities: 'Primary emergency contact',
        emergencyContactPriority: 1
      }
    ],
    
    professionalNetwork: {
      accountant: {
        name: 'Samuel Mitchell CPA',
        firm: 'Mitchell Tax Partners',
        email: 'samuel.mitchell@mitchelltax.com',
        phone: '(555) 678-1234',
        specialties: ['Individual Tax', 'Retirement Planning', 'Investment Tax Strategy'],
        yearsWorking: 4,
        lastContact: '2024-08-20',
        collaborationFrequency: 'quarterly',
        referralSource: 'advisor referral'
      },
      insuranceAgent: {
        name: 'Rachel Murphy',
        firm: 'Murphy Insurance Services',
        email: 'rachel.murphy@murphyinsurance.com',
        phone: '(555) 678-5678',
        coverageTypes: ['Life Insurance', 'Disability Insurance', 'Auto', 'Home'],
        yearsWorking: 3,
        lastContact: '2024-09-01',
        collaborationFrequency: 'annually'
      }
    },
    
    preferredCommunication: {
      method: 'email' as const,
      frequency: 'quarterly' as const,
      bestTimeToContact: 'Weekday mornings (9-11 AM)'
    },
    
    relationshipHistory: [
      {
        date: new Date('2024-09-10').toISOString(),
        milestone: 'Quarterly Review - Growth Strategy',
        type: 'regular_review' as const,
        description: 'Reviewed portfolio performance and discussed increasing retirement contributions',
        outcome: 'Increased 401k contribution to maximize employer match'
      },
      {
        date: new Date('2024-03-15').toISOString(),
        milestone: 'Insurance Coverage Review',
        type: 'service_change' as const,
        description: 'Comprehensive insurance needs analysis and coverage optimization',
        outcome: 'Updated life insurance coverage and added disability insurance'
      },
      {
        date: new Date('2022-11-20').toISOString(),
        milestone: 'Client Onboarding',
        type: 'onboarding' as const,
        description: 'Onboarded through referral program, established investment accounts',
        outcome: 'Created diversified portfolio focused on long-term growth'
      }
    ],
    
    financialDetails: {
      retirementPlanning: {
        currentSavings: 382500,
        targetAmount: 1350000,
        monthlyContribution: 2250,
        projectedRetirementAge: 65,
        yearsToRetirement: 27
      },
      collegeSavings: {
        currentAmount: 0,
        targetAmount: 0,
        monthlyContribution: 0,
        yearsRemaining: 0,
        beneficiaryName: ''
      },
      emergencyFund: {
        currentAmount: 40500,
        targetAmount: 43200,
        monthlyExpenses: 7200,
        currentMonthsCovered: 5.6,
        targetMonths: 6
      },
      taxHarvesting: {
        potentialSavings: 2880,
        harvestableOpportunities: 5,
        estimatedTaxBracket: 24,
        yearToDateLosses: 0
      },
      lastMeeting: {
        portfolioPerformance: {
          quarterlyReturn: 5.2,
          benchmarkReturn: 4.8,
          outperformance: 0.4
        },
        retirementTimeline: {
          currentAge: 39,
          targetRetirementAge: 65,
          confidenceLevel: 85
        },
        rothContribution: {
          currentYear: 5850,
          maxContribution: 6300,
          taxSavings: 1404
        },
        collegeFunding: {
          beneficiaryAge: 0,
          monthsToCollege: 0,
          fundingProgress: 0
        }
      },
      portfolioPerformance: {
        ytdReturn: 12.4,
        benchmarkReturn: 10.8,
        outperformance: 1.6,
        rebalancingImpact: 0.3,
        bondDuration: 4.2,
        internationalAllocation: 25
      },
      nextActions: {
        beneficiaryReview: {
          lastReviewDate: '2023-12-15',
          urgency: 'medium' as const,
          pendingUpdates: 2
        },
        retirement401k: {
          currentContribution: 13500,
          maxContribution: 20700,
          employerMatch: 6750,
          potentialTaxSavings: 1728
        },
        insuranceReview: {
          lifeInsurance: 450000,
          disabilityInsurance: 225000,
          lastReviewDate: '2024-03-10',
          adequacyRating: 'adequate' as const
        },
        rothConversion: {
          opportunityAmount: 22500,
          taxImpact: 5400,
          recommendedTiming: 'Q1 2025'
        }
      }
    },
    upcomingMeetings: [],
    
    keyMetrics: {
      portfolioReturn: 12.4,
      yearToDateReturn: 12.4,
      benchmarkComparison: 1.6,
      feeReview: false,
      complianceItems: generateComplianceItems(2),
    },
    
    referralData: {
      totalReferralsSent: 2,
      successfulReferrals: 1,
      conversionRate: 50,
      referralHistory: [
        {
          referredName: 'Jessica Miller',
          referredDate: '2024-03-15',
          status: 'client',
          becameClientDate: '2024-04-02',
          estimatedValue: 405000,
          notes: 'Referred by Sarah after excellent service experience'
        },
        {
          referredName: 'Tom Wilson',
          referredDate: '2024-07-20',
          status: 'prospect',
          estimatedValue: 252000,
          notes: 'Co-worker interested in retirement planning'
        }
      ],
      referralValue: {
        totalPotentialAUM: 657000,
        actualAUM: 405000
      },
      isActiveReferrer: true
    }
  },
  {
    // ===== LINDA CHEN =====
    id: 'client-linda-chen',
    name: 'Linda Chen',
    birthDate: '1958-12-08',
    email: 'linda.chen@email.com',
    phone: '(555) 345-6789',
    category: 'enhanced',
    householdAssets: 1850000,
    lastMeeting: new Date('2024-08-25').toISOString(),
    riskTolerance: 'conservative',
    investmentObjectives: ['Retirement Planning', 'Income Generation'],
    
    // Add rich CRM data for Linda Chen
    extendedHousehold: [
      {
        name: 'Helen Chen',
        relationship: 'daughter',
        email: 'helen.chen@email.com',
        phone: '(555) 345-6790',
        birthDate: '1985-04-12',
        role: 'beneficiary' as const,
        responsibilities: 'Primary beneficiary and financial power of attorney'
      },
      {
        name: 'David Chen',
        relationship: 'son',
        email: 'david.chen@email.com',  
        phone: '(555) 345-6791',
        birthDate: '1987-09-30',
        role: 'beneficiary' as const,
        responsibilities: 'Secondary beneficiary'
      },
      {
        name: 'Margaret Wong',
        relationship: 'friend',
        email: 'margaret.wong@email.com',
        phone: '(555) 345-6792',
        role: 'emergency_contact' as const,
        responsibilities: 'Emergency contact and healthcare proxy',
        emergencyContactPriority: 1
      }
    ],
    
    professionalNetwork: {
      accountant: {
        name: 'Sandra Powell CPA',
        firm: 'Powell Financial Services',
        email: 'sandra.powell@powellfinancial.com',
        phone: '(555) 890-1234',
        specialties: ['Tax Planning', 'Retirement Tax Strategy', 'Estate Tax', 'RMD Planning'],
        yearsWorking: 12,
        lastContact: '2024-08-10',
        collaborationFrequency: 'quarterly',
        referralSource: 'long-term relationship'
      },
      estateAttorney: {
        name: 'Victoria Stonefield Esq.',
        firm: 'Stonefield Estate Law',
        email: 'victoria.stonefield@stonefieldlaw.com',
        phone: '(555) 890-5678',
        specialties: ['Estate Planning', 'Elder Law', 'Trust Administration', 'Medicaid Planning'],
        yearsWorking: 8,
        lastContact: '2024-06-30',
        collaborationFrequency: 'semi-annually',
        referralSource: 'professional referral'
      },
      insuranceAgent: {
        name: 'Paul Harrison',
        firm: 'Harrison Benefits',
        email: 'paul.harrison@harrisonbenefits.com',
        phone: '(555) 890-9012',
        coverageTypes: ['Long Term Care', 'Life Insurance', 'Medicare Supplement', 'Annuities'],
        yearsWorking: 15,
        lastContact: '2024-07-15',
        collaborationFrequency: 'annually'
      }
    },
    
    preferredCommunication: {
      method: 'phone' as const,
      frequency: 'monthly' as const,
      bestTimeToContact: 'Weekday afternoons (2-4 PM)'
    },
    
    relationshipHistory: [
      {
        date: new Date('2024-08-25').toISOString(),
        milestone: 'Pre-Retirement Planning Review',
        type: 'regular_review' as const,
        description: 'Comprehensive retirement income planning and RMD strategy discussion',
        outcome: 'Optimized withdrawal strategy and updated estate planning documents'
      },
      {
        date: new Date('2024-01-15').toISOString(),
        milestone: 'RMD Planning Session',
        type: 'compliance' as const,
        description: 'Required Minimum Distribution planning and tax optimization strategies',
        outcome: 'Implemented QCD strategy to minimize tax impact'
      },
      {
        date: new Date('2023-05-20').toISOString(),
        milestone: 'Portfolio Conservative Shift',
        type: 'major_transaction' as const,
        description: 'Rebalanced portfolio to more conservative allocation approaching retirement',
        outcome: 'Reduced equity exposure and increased fixed income allocation'
      },
      {
        date: new Date('2016-09-12').toISOString(),
        milestone: 'Enhanced Service Upgrade',
        type: 'service_upgrade' as const,
        description: 'Upgraded to enhanced service tier due to account growth',
        outcome: 'Access to dedicated advisor and comprehensive financial planning'
      }
    ],
    
    financialDetails: {
      retirementPlanning: {
        currentSavings: 1650000,
        targetAmount: 2200000,
        monthlyContribution: 1000,
        projectedRetirementAge: 67,
        yearsToRetirement: 1
      },
      collegeSavings: {
        currentAmount: 0,
        targetAmount: 0,
        monthlyContribution: 0,
        yearsRemaining: 0,
        beneficiaryName: ''
      },
      emergencyFund: {
        currentAmount: 72000,
        targetAmount: 84000,
        monthlyExpenses: 14000,
        currentMonthsCovered: 5.1,
        targetMonths: 6
      },
      taxHarvesting: {
        potentialSavings: 8500,
        harvestableOpportunities: 12,
        estimatedTaxBracket: 32,
        yearToDateLosses: 2400
      },
      lastMeeting: {
        portfolioPerformance: {
          quarterlyReturn: 3.8,
          benchmarkReturn: 3.6,
          outperformance: 0.2
        },
        retirementTimeline: {
          currentAge: 65,
          targetRetirementAge: 67,
          confidenceLevel: 92
        },
        rothContribution: {
          currentYear: 8000,
          maxContribution: 8000,
          taxSavings: 2560
        },
        collegeFunding: {
          beneficiaryAge: 0,
          monthsToCollege: 0,
          fundingProgress: 0
        }
      },
      portfolioPerformance: {
        ytdReturn: 8.2,
        benchmarkReturn: 7.9,
        outperformance: 0.3,
        rebalancingImpact: 0.1,
        bondDuration: 5.8,
        internationalAllocation: 15
      },
      nextActions: {
        beneficiaryReview: {
          lastReviewDate: '2024-01-20',
          urgency: 'low' as const,
          pendingUpdates: 0
        },
        retirement401k: {
          currentContribution: 8000,
          maxContribution: 30000,
          employerMatch: 0,
          potentialTaxSavings: 2560
        },
        insuranceReview: {
          lifeInsurance: 750000,
          disabilityInsurance: 0,
          lastReviewDate: '2024-06-15',
          adequacyRating: 'high' as const
        },
        rothConversion: {
          opportunityAmount: 75000,
          taxImpact: 24000,
          recommendedTiming: 'Q2 2025'
        }
      }
    },
    upcomingMeetings: [],
    
    keyMetrics: {
      portfolioReturn: 8.2,
      yearToDateReturn: 8.2,
      benchmarkComparison: 0.3,
      feeReview: true,
      complianceItems: generateComplianceItems(1),
    },
    
    referralData: {
      totalReferralsSent: 4,
      successfulReferrals: 3,
      conversionRate: 75,
      referralHistory: [
        {
          referredName: 'Robert Kim',
          referredDate: '2023-11-08',
          status: 'client',
          becameClientDate: '2023-12-01',
          estimatedValue: 890000,
          notes: 'Former colleague from accounting firm'
        },
        {
          referredName: 'Patricia Davis',
          referredDate: '2024-01-22',
          status: 'client',
          becameClientDate: '2024-02-15',
          estimatedValue: 650000,
          notes: 'Neighbor seeking pre-retirement planning'
        },
        {
          referredName: 'Steven Martinez',
          referredDate: '2024-05-10',
          status: 'client',
          becameClientDate: '2024-06-03',
          estimatedValue: 720000,
          notes: 'Bridge club member impressed with portfolio results'
        },
        {
          referredName: 'Helen Rodriguez',
          referredDate: '2024-08-15',
          status: 'declined',
          estimatedValue: 480000,
          notes: 'Decided to stay with current advisor'
        }
      ],
      referralValue: {
        totalPotentialAUM: 2740000,
        actualAUM: 2260000
      },
      isActiveReferrer: true
    }
  },
  {
    // ===== DAVID THOMPSON =====
    id: 'client-david-thompson',
    name: 'David Thompson',
    birthDate: '1975-04-18',
    email: 'david.thompson@email.com',
    phone: '(555) 456-7890',
    category: 'standard',
    householdAssets: 925000,
    lastMeeting: new Date('2024-07-12').toISOString(),
    riskTolerance: 'moderate',
    investmentObjectives: ['Growth', 'Tax Efficiency'],
    financialDetails: {
      retirementPlanning: {
        currentSavings: 385000,
        targetAmount: 1800000,
        monthlyContribution: 3200,
        projectedRetirementAge: 62,
        yearsToRetirement: 13
      },
      collegeSavings: {
        currentAmount: 125000,
        targetAmount: 200000,
        monthlyContribution: 1200,
        yearsRemaining: 8,
        beneficiaryName: 'Emma Thompson'
      },
      emergencyFund: {
        currentAmount: 36000,
        targetAmount: 42000,
        monthlyExpenses: 7000,
        currentMonthsCovered: 5.1,
        targetMonths: 6
      },
      taxHarvesting: {
        potentialSavings: 5400,
        harvestableOpportunities: 8,
        estimatedTaxBracket: 28,
        yearToDateLosses: 1200
      },
      lastMeeting: {
        portfolioPerformance: {
          quarterlyReturn: 6.1,
          benchmarkReturn: 5.5,
          outperformance: 0.6
        },
        retirementTimeline: {
          currentAge: 49,
          targetRetirementAge: 62,
          confidenceLevel: 78
        },
        rothContribution: {
          currentYear: 7000,
          maxContribution: 7000,
          taxSavings: 1960
        },
        collegeFunding: {
          beneficiaryAge: 10,
          monthsToCollege: 96,
          fundingProgress: 62.5
        }
      },
      portfolioPerformance: {
        ytdReturn: 15.2,
        benchmarkReturn: 13.8,
        outperformance: 1.4,
        rebalancingImpact: 0.4,
        bondDuration: 3.8,
        internationalAllocation: 30
      },
      nextActions: {
        beneficiaryReview: {
          lastReviewDate: '2024-04-05',
          urgency: 'low' as const,
          pendingUpdates: 1
        },
        retirement401k: {
          currentContribution: 20000,
          maxContribution: 23000,
          employerMatch: 10000,
          potentialTaxSavings: 840
        },
        insuranceReview: {
          lifeInsurance: 650000,
          disabilityInsurance: 300000,
          lastReviewDate: '2024-02-28',
          adequacyRating: 'adequate' as const
        },
        rothConversion: {
          opportunityAmount: 35000,
          taxImpact: 9800,
          recommendedTiming: 'Q4 2024'
        }
      }
    },
    upcomingMeetings: [],
    
    keyMetrics: {
      portfolioReturn: 15.2,
      yearToDateReturn: 15.2,
      benchmarkComparison: 1.4,
      feeReview: false,
      complianceItems: generateComplianceItems(1),
    },
    
    referralData: {
      totalReferralsSent: 3,
      successfulReferrals: 2,
      conversionRate: 67,
      referralHistory: [
        {
          referredName: 'Michael Chang',
          referredDate: '2024-02-14',
          status: 'client',
          becameClientDate: '2024-03-05',
          estimatedValue: 620000,
          notes: 'Fellow parent from school board meetings'
        },
        {
          referredName: 'Rebecca Foster',
          referredDate: '2024-04-18',
          status: 'prospect',
          estimatedValue: 390000,
          notes: 'Discussing during Q4, interested in college planning'
        },
        {
          referredName: 'James Sullivan',
          referredDate: '2024-06-25',
          status: 'client',
          becameClientDate: '2024-07-10',
          estimatedValue: 750000,
          notes: 'Work colleague impressed with portfolio performance'
        }
      ],
      referralValue: {
        totalPotentialAUM: 1760000,
        actualAUM: 1370000
      },
      isActiveReferrer: true
    }
  },
  {
    // ===== MARIA GONZALEZ =====
    id: 'client-maria-gonzalez',
    name: 'Maria Gonzalez',
    birthDate: '1992-09-14',
    email: 'maria.gonzalez@email.com',
    phone: '(555) 567-8901',
    category: 'standard',
    householdAssets: 245000,
    lastMeeting: new Date('2024-08-30').toISOString(),
    riskTolerance: 'moderate',
    investmentObjectives: ['Home Purchase', 'Emergency Fund'],
    financialDetails: {
      retirementPlanning: {
        currentSavings: 45000,
        targetAmount: 1200000,
        monthlyContribution: 800,
        projectedRetirementAge: 65,
        yearsToRetirement: 33
      },
      collegeSavings: {
        currentAmount: 0,
        targetAmount: 0,
        monthlyContribution: 0,
        yearsRemaining: 0,
        beneficiaryName: ''
      },
      emergencyFund: {
        currentAmount: 25000,
        targetAmount: 30000,
        monthlyExpenses: 5000,
        currentMonthsCovered: 5,
        targetMonths: 6
      },
      taxHarvesting: {
        potentialSavings: 1200,
        harvestableOpportunities: 3,
        estimatedTaxBracket: 22,
        yearToDateLosses: 0
      },
      lastMeeting: {
        portfolioPerformance: {
          quarterlyReturn: 4.5,
          benchmarkReturn: 4.2,
          outperformance: 0.3
        },
        retirementTimeline: {
          currentAge: 32,
          targetRetirementAge: 65,
          confidenceLevel: 72
        },
        rothContribution: {
          currentYear: 6500,
          maxContribution: 7000,
          taxSavings: 1430
        },
        collegeFunding: {
          beneficiaryAge: 0,
          monthsToCollege: 0,
          fundingProgress: 0
        }
      },
      portfolioPerformance: {
        ytdReturn: 11.8,
        benchmarkReturn: 10.5,
        outperformance: 1.3,
        rebalancingImpact: 0.2,
        bondDuration: 3.2,
        internationalAllocation: 20
      },
      nextActions: {
        beneficiaryReview: {
          lastReviewDate: '2024-08-01',
          urgency: 'low' as const,
          pendingUpdates: 0
        },
        retirement401k: {
          currentContribution: 9600,
          maxContribution: 23000,
          employerMatch: 4800,
          potentialTaxSavings: 2948
        },
        insuranceReview: {
          lifeInsurance: 150000,
          disabilityInsurance: 120000,
          lastReviewDate: '2024-05-20',
          adequacyRating: 'adequate' as const
        },
        rothConversion: {
          opportunityAmount: 8000,
          taxImpact: 1760,
          recommendedTiming: 'Q1 2025'
        }
      }
    },
    upcomingMeetings: [],
    
    keyMetrics: {
      portfolioReturn: 11.8,
      yearToDateReturn: 11.8,
      benchmarkComparison: 1.3,
      feeReview: false,
      complianceItems: generateComplianceItems(0),
    },
    
    referralData: {
      totalReferralsSent: 1,
      successfulReferrals: 1,
      conversionRate: 100,
      referralHistory: [
        {
          referredName: 'Carlos Herrera',
          referredDate: '2024-05-30',
          status: 'client',
          becameClientDate: '2024-06-20',
          estimatedValue: 180000,
          notes: 'Cousin starting career, needs investment guidance'
        }
      ],
      referralValue: {
        totalPotentialAUM: 180000,
        actualAUM: 180000
      },
      isActiveReferrer: false
    }
  },
  {
    // ===== AMANDA BROWN (L3 FAIL - Missing Context) =====
    // Layer failures: L3 fails (context), L4/L5 pass
    // Expected dots: ●●○●● (green, green, RED, green, green)
    id: 'client-amanda-brown',
    name: 'Amanda Brown',
    birthDate: '1981-03-25',
    email: 'amanda.brown@email.com',
    phone: '(555) 678-9012',
    category: 'high-touch',
    householdAssets: 1650000,
    lastMeeting: new Date('2024-09-05').toISOString(),
    // Future meeting for L1 to pass
    nextMeeting: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    nextMeetingDetails: {
      time: '2:00 PM',
      duration: 60,
      type: 'Annual Review',
      location: { type: 'virtual' },
      preparationStatus: 'needs_attention'
    },
    riskTolerance: 'aggressive',
    investmentObjectives: ['Tax Optimization', 'Growth', 'Estate Planning'],
    
    // L3 FAIL: Remove context sources (need <2 of 4)
    extendedHousehold: [], // Empty - no household members
    relationshipHistory: [], // Empty - no activities
    meetingHistory: [], // Empty - no meeting history
    // keyMetrics with empty complianceItems removed below
    
    financialDetails: {
      retirementPlanning: {
        currentSavings: 825000,
        targetAmount: 2500000,
        monthlyContribution: 4500,
        projectedRetirementAge: 60,
        yearsToRetirement: 17
      },
      collegeSavings: {
        currentAmount: 180000,
        targetAmount: 300000,
        monthlyContribution: 2000,
        yearsRemaining: 6,
        beneficiaryName: 'Tyler Brown'
      },
      emergencyFund: {
        currentAmount: 84000,
        targetAmount: 90000,
        monthlyExpenses: 15000,
        currentMonthsCovered: 5.6,
        targetMonths: 6
      },
      taxHarvesting: {
        potentialSavings: 12500,
        harvestableOpportunities: 15,
        estimatedTaxBracket: 35,
        yearToDateLosses: 4200
      },
      lastMeeting: {
        portfolioPerformance: {
          quarterlyReturn: 7.3,
          benchmarkReturn: 6.1,
          outperformance: 1.2
        },
        retirementTimeline: {
          currentAge: 43,
          targetRetirementAge: 60,
          confidenceLevel: 88
        },
        rothContribution: {
          currentYear: 7000,
          maxContribution: 7000,
          taxSavings: 2450
        },
        collegeFunding: {
          beneficiaryAge: 12,
          monthsToCollege: 72,
          fundingProgress: 60
        }
      },
      portfolioPerformance: {
        ytdReturn: 18.5,
        benchmarkReturn: 15.2,
        outperformance: 3.3,
        rebalancingImpact: 0.8,
        bondDuration: 2.8,
        internationalAllocation: 35
      },
      nextActions: {
        beneficiaryReview: {
          lastReviewDate: '2024-06-10',
          urgency: 'medium' as const,
          pendingUpdates: 3
        },
        retirement401k: {
          currentContribution: 23000,
          maxContribution: 23000,
          employerMatch: 11500,
          potentialTaxSavings: 0
        },
        insuranceReview: {
          lifeInsurance: 1200000,
          disabilityInsurance: 500000,
          lastReviewDate: '2024-01-15',
          adequacyRating: 'high' as const
        },
        rothConversion: {
          opportunityAmount: 125000,
          taxImpact: 43750,
          recommendedTiming: 'Q2 2025'
        }
      }
    },
    upcomingMeetings: [],
    
    // L4 PASS: Keep portfolio data with topHoldings
    portfolioData: {
      totalValue: 1650000,
      ytdReturn: 18.5,
      benchmarkReturn: 15.2,
      allocation: {
        stocks: 70,
        bonds: 20,
        alternatives: 5,
        cash: 5,
      },
      topHoldings: [
        { symbol: 'AAPL', name: 'Apple Inc.', percentage: 8.0, value: 132000 },
        { symbol: 'MSFT', name: 'Microsoft Corp.', percentage: 6.5, value: 107250 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', percentage: 5.2, value: 85800 },
      ],
    },
    
    // L3 FAIL: No compliance items
    keyMetrics: {
      portfolioReturn: 18.5,
      yearToDateReturn: 18.5,
      benchmarkComparison: 3.3,
      feeReview: false,
      complianceItems: [], // Empty to help fail L3
    },
    
    referralData: {
      totalReferralsSent: 6,
      successfulReferrals: 4,
      conversionRate: 67,
      referralHistory: [
        {
          referredName: 'Gregory Anderson',
          referredDate: '2023-09-12',
          status: 'client',
          becameClientDate: '2023-10-05',
          estimatedValue: 1200000,
          notes: 'Business partner seeking high-growth portfolio strategy'
        },
        {
          referredName: 'Diana Foster',
          referredDate: '2024-01-18',
          status: 'client',
          becameClientDate: '2024-02-10',
          estimatedValue: 950000,
          notes: 'Legal colleague interested in estate planning optimization'
        },
        {
          referredName: 'Kenneth Walsh',
          referredDate: '2024-03-25',
          status: 'declined',
          estimatedValue: 800000,
          notes: 'Decided to manage investments independently'
        },
        {
          referredName: 'Michelle Chen',
          referredDate: '2024-05-14',
          status: 'client',
          becameClientDate: '2024-06-01',
          estimatedValue: 1350000,
          notes: 'Executive from professional network, focus on tax optimization'
        },
        {
          referredName: 'Richard Murphy',
          referredDate: '2024-07-08',
          status: 'prospect',
          estimatedValue: 1100000,
          notes: 'Considering transition in Q4, impressed with performance'
        },
        {
          referredName: 'Sandra Torres',
          referredDate: '2024-08-22',
          status: 'client',
          becameClientDate: '2024-09-05',
          estimatedValue: 980000,
          notes: 'Friend from country club, needs comprehensive planning'
        }
      ],
      referralValue: {
        totalPotentialAUM: 6380000,
        actualAUM: 4480000
      },
      isActiveReferrer: true
    }
  },
  {
    // ===== JAMES WILSON =====
    id: 'client-james-wilson',
    name: 'James Wilson',
    birthDate: '1968-11-30',
    email: 'james.wilson@email.com',
    phone: '(555) 789-0123',
    category: 'high-touch',
    householdAssets: 3200000,
    lastMeeting: new Date('2024-08-18').toISOString(),
    riskTolerance: 'moderate',
    investmentObjectives: ['Business Succession', 'Estate Planning', 'Tax Efficiency'],
    financialDetails: {
      retirementPlanning: {
        currentSavings: 2100000,
        targetAmount: 4000000,
        monthlyContribution: 8000,
        projectedRetirementAge: 65,
        yearsToRetirement: 9
      },
      collegeSavings: {
        currentAmount: 0,
        targetAmount: 0,
        monthlyContribution: 0,
        yearsRemaining: 0,
        beneficiaryName: ''
      },
      emergencyFund: {
        currentAmount: 180000,
        targetAmount: 180000,
        monthlyExpenses: 30000,
        currentMonthsCovered: 6,
        targetMonths: 6
      },
      taxHarvesting: {
        potentialSavings: 28000,
        harvestableOpportunities: 22,
        estimatedTaxBracket: 37,
        yearToDateLosses: 12000
      },
      lastMeeting: {
        portfolioPerformance: {
          quarterlyReturn: 5.8,
          benchmarkReturn: 5.2,
          outperformance: 0.6
        },
        retirementTimeline: {
          currentAge: 55,
          targetRetirementAge: 65,
          confidenceLevel: 91
        },
        rothContribution: {
          currentYear: 8000,
          maxContribution: 8000,
          taxSavings: 2960
        },
        collegeFunding: {
          beneficiaryAge: 0,
          monthsToCollege: 0,
          fundingProgress: 0
        }
      },
      portfolioPerformance: {
        ytdReturn: 13.8,
        benchmarkReturn: 12.1,
        outperformance: 1.7,
        rebalancingImpact: 0.5,
        bondDuration: 4.5,
        internationalAllocation: 25
      },
      nextActions: {
        beneficiaryReview: {
          lastReviewDate: '2024-03-20',
          urgency: 'high' as const,
          pendingUpdates: 5
        },
        retirement401k: {
          currentContribution: 30000,
          maxContribution: 30000,
          employerMatch: 0,
          potentialTaxSavings: 0
        },
        insuranceReview: {
          lifeInsurance: 2500000,
          disabilityInsurance: 1000000,
          lastReviewDate: '2023-11-10',
          adequacyRating: 'high' as const
        },
        rothConversion: {
          opportunityAmount: 200000,
          taxImpact: 74000,
          recommendedTiming: 'Q3 2025'
        }
      }
    },
    upcomingMeetings: [],
    
    keyMetrics: {
      portfolioReturn: 13.8,
      yearToDateReturn: 13.8,
      benchmarkComparison: 1.7,
      feeReview: true,
      complianceItems: generateComplianceItems(5),
    }
  },
  {
    // ===== PATRICIA DAVIS =====
    id: 'client-patricia-davis',
    name: 'Patricia Davis',
    birthDate: '1970-06-12',
    email: 'patricia.davis@email.com',
    phone: '(555) 890-1234',
    category: 'standard',
    householdAssets: 780000,
    lastMeeting: new Date('2024-07-08').toISOString(),
    riskTolerance: 'moderate',
    investmentObjectives: ['Retirement Planning', 'Income Generation'],
    financialDetails: {
      retirementPlanning: {
        currentSavings: 465000,
        targetAmount: 1600000,
        monthlyContribution: 2800,
        projectedRetirementAge: 65,
        yearsToRetirement: 11
      },
      collegeSavings: {
        currentAmount: 85000,
        targetAmount: 120000,
        monthlyContribution: 600,
        yearsRemaining: 4,
        beneficiaryName: 'Sarah Davis'
      },
      emergencyFund: {
        currentAmount: 48000,
        targetAmount: 54000,
        monthlyExpenses: 9000,
        currentMonthsCovered: 5.3,
        targetMonths: 6
      },
      taxHarvesting: {
        potentialSavings: 4200,
        harvestableOpportunities: 7,
        estimatedTaxBracket: 24,
        yearToDateLosses: 800
      },
      lastMeeting: {
        portfolioPerformance: {
          quarterlyReturn: 4.8,
          benchmarkReturn: 4.5,
          outperformance: 0.3
        },
        retirementTimeline: {
          currentAge: 54,
          targetRetirementAge: 65,
          confidenceLevel: 82
        },
        rothContribution: {
          currentYear: 8000,
          maxContribution: 8000,
          taxSavings: 1920
        },
        collegeFunding: {
          beneficiaryAge: 14,
          monthsToCollege: 48,
          fundingProgress: 70.8
        }
      },
      portfolioPerformance: {
        ytdReturn: 10.5,
        benchmarkReturn: 9.8,
        outperformance: 0.7,
        rebalancingImpact: 0.2,
        bondDuration: 4.8,
        internationalAllocation: 22
      },
      nextActions: {
        beneficiaryReview: {
          lastReviewDate: '2024-05-15',
          urgency: 'low' as const,
          pendingUpdates: 1
        },
        retirement401k: {
          currentContribution: 18000,
          maxContribution: 30000,
          employerMatch: 9000,
          potentialTaxSavings: 2880
        },
        insuranceReview: {
          lifeInsurance: 400000,
          disabilityInsurance: 200000,
          lastReviewDate: '2024-04-22',
          adequacyRating: 'adequate' as const
        },
        rothConversion: {
          opportunityAmount: 45000,
          taxImpact: 10800,
          recommendedTiming: 'Q1 2025'
        }
      }
    },
    upcomingMeetings: [],
    
    keyMetrics: {
      portfolioReturn: 10.5,
      yearToDateReturn: 10.5,
      benchmarkComparison: 0.7,
      feeReview: false,
      complianceItems: generateComplianceItems(1),
    },
    
    referralData: {
      totalReferralsSent: 2,
      successfulReferrals: 1,
      conversionRate: 50,
      referralHistory: [
        {
          referredName: 'Barbara Johnson',
          referredDate: '2024-02-20',
          status: 'declined',
          estimatedValue: 280000,
          notes: 'Decided to wait until after job transition'
        },
        {
          referredName: 'Timothy Garcia',
          referredDate: '2024-07-05',
          status: 'client',
          becameClientDate: '2024-08-01',
          estimatedValue: 420000,
          notes: 'Gym buddy impressed with conservative approach'
        }
      ],
      referralValue: {
        totalPotentialAUM: 700000,
        actualAUM: 420000
      },
      isActiveReferrer: false
    }
  },
  {
    // ===== MARGARET THOMPSON =====
    id: 'client-margaret-thompson',
    name: 'Margaret Thompson',
    birthDate: '1955-01-20',
    email: 'margaret.thompson@email.com',
    phone: '(555) 901-2345',
    category: 'enhanced',
    householdAssets: 2450000,
    lastMeeting: new Date('2024-08-12').toISOString(),
    riskTolerance: 'conservative',
    investmentObjectives: ['Estate Planning', 'Income Generation', 'Legacy Planning'],
    financialDetails: {
      retirementPlanning: {
        currentSavings: 2200000,
        targetAmount: 2500000,
        monthlyContribution: 500,
        projectedRetirementAge: 70,
        yearsToRetirement: 1
      },
      collegeSavings: {
        currentAmount: 0,
        targetAmount: 0,
        monthlyContribution: 0,
        yearsRemaining: 0,
        beneficiaryName: ''
      },
      emergencyFund: {
        currentAmount: 120000,
        targetAmount: 120000,
        monthlyExpenses: 20000,
        currentMonthsCovered: 6,
        targetMonths: 6
      },
      taxHarvesting: {
        potentialSavings: 15000,
        harvestableOpportunities: 18,
        estimatedTaxBracket: 32,
        yearToDateLosses: 5500
      },
      lastMeeting: {
        portfolioPerformance: {
          quarterlyReturn: 3.2,
          benchmarkReturn: 3.0,
          outperformance: 0.2
        },
        retirementTimeline: {
          currentAge: 69,
          targetRetirementAge: 70,
          confidenceLevel: 95
        },
        rothContribution: {
          currentYear: 8000,
          maxContribution: 8000,
          taxSavings: 2560
        },
        collegeFunding: {
          beneficiaryAge: 0,
          monthsToCollege: 0,
          fundingProgress: 0
        }
      },
      portfolioPerformance: {
        ytdReturn: 6.8,
        benchmarkReturn: 6.5,
        outperformance: 0.3,
        rebalancingImpact: 0.1,
        bondDuration: 6.2,
        internationalAllocation: 12
      },
      nextActions: {
        beneficiaryReview: {
          lastReviewDate: '2024-07-01',
          urgency: 'high' as const,
          pendingUpdates: 4
        },
        retirement401k: {
          currentContribution: 6000,
          maxContribution: 30000,
          employerMatch: 0,
          potentialTaxSavings: 7680
        },
        insuranceReview: {
          lifeInsurance: 1500000,
          disabilityInsurance: 0,
          lastReviewDate: '2024-01-30',
          adequacyRating: 'high' as const
        },
        rothConversion: {
          opportunityAmount: 150000,
          taxImpact: 48000,
          recommendedTiming: 'Q4 2024'
        }
      }
    },
    upcomingMeetings: [],
    
    portfolioData: {
      totalValue: 2450000,
      ytdReturn: 6.8,
      benchmarkReturn: 6.5,
      allocation: {
        stocks: 45,
        bonds: 40,
        alternatives: 10,
        cash: 5
      },
      topHoldings: [
        { symbol: 'SWISX', name: 'Schwab International Index', percentage: 15.2, value: 372400 },
        { symbol: 'SWTSX', name: 'Schwab Total Stock Market Index', percentage: 12.8, value: 313600 },
        { symbol: 'SWAGX', name: 'Schwab US Aggregate Bond Index', percentage: 18.5, value: 453250 }
      ]
    },
    
    complianceStatus: {
      rmdRequired: false,
      beneficiaryUpdated: new Date('2024-07-01').toISOString(),
      lastReview: new Date('2024-07-30').toISOString(),
      pendingItems: generateComplianceItems(4),
    },
    
    planningData: {
      retirementReadiness: 85,
      goalProgress: [
        { goal: 'Retirement Savings', target: 3000000, current: 2450000, onTrack: true },
        { goal: 'Estate Planning', target: 100, current: 95, onTrack: true },
        { goal: 'Tax Efficiency', target: 100, current: 88, onTrack: false },
      ],
      insuranceNeeds: {
        life: true,
        disability: false,
        longTermCare: true,
      },
    },
    
    meetingHistory: [
      {
        id: 'meeting-mt-1',
        date: new Date('2024-07-30').toISOString(),
        type: 'review',
        summary: 'Annual review - discussed estate planning updates and tax strategies',
        followUpItems: ['Update beneficiaries', 'Tax loss harvesting', 'Insurance review'],
        nextMeetingDate: new Date('2024-10-30').toISOString(),
      }
    ],
    
    keyMetrics: {
      portfolioReturn: 6.8,
      yearToDateReturn: 6.8,
      benchmarkComparison: 0.3,
      feeReview: true,
      complianceItems: generateComplianceItems(4),
    }
  },
  {
    // ===== MICHAEL BROWN =====
    id: 'client-michael-brown',
    name: 'Michael Brown',
    birthDate: '1978-08-05',
    email: 'michael.brown@email.com',
    phone: '(555) 012-3456',
    category: 'standard',
    householdAssets: 1125000,
    lastMeeting: new Date('2024-09-02').toISOString(),
    riskTolerance: 'moderate',
    investmentObjectives: ['College Funding', 'Growth', 'Tax Efficiency'],
    financialDetails: {
      retirementPlanning: {
        currentSavings: 485000,
        targetAmount: 2000000,
        monthlyContribution: 3500,
        projectedRetirementAge: 65,
        yearsToRetirement: 19
      },
      collegeSavings: {
        currentAmount: 275000,
        targetAmount: 400000,
        monthlyContribution: 2500,
        yearsRemaining: 5,
        beneficiaryName: 'Jessica Brown'
      },
      emergencyFund: {
        currentAmount: 54000,
        targetAmount: 60000,
        monthlyExpenses: 10000,
        currentMonthsCovered: 5.4,
        targetMonths: 6
      },
      taxHarvesting: {
        potentialSavings: 6800,
        harvestableOpportunities: 11,
        estimatedTaxBracket: 28,
        yearToDateLosses: 1800
      },
      lastMeeting: {
        portfolioPerformance: {
          quarterlyReturn: 6.5,
          benchmarkReturn: 5.9,
          outperformance: 0.6
        },
        retirementTimeline: {
          currentAge: 46,
          targetRetirementAge: 65,
          confidenceLevel: 80
        },
        rothContribution: {
          currentYear: 7000,
          maxContribution: 7000,
          taxSavings: 1960
        },
        collegeFunding: {
          beneficiaryAge: 13,
          monthsToCollege: 60,
          fundingProgress: 68.8
        }
      },
      portfolioPerformance: {
        ytdReturn: 14.8,
        benchmarkReturn: 13.2,
        outperformance: 1.6,
        rebalancingImpact: 0.4,
        bondDuration: 3.5,
        internationalAllocation: 28
      },
      nextActions: {
        beneficiaryReview: {
          lastReviewDate: '2024-06-20',
          urgency: 'low' as const,
          pendingUpdates: 1
        },
        retirement401k: {
          currentContribution: 21000,
          maxContribution: 23000,
          employerMatch: 10500,
          potentialTaxSavings: 560
        },
        insuranceReview: {
          lifeInsurance: 750000,
          disabilityInsurance: 350000,
          lastReviewDate: '2024-03-15',
          adequacyRating: 'adequate' as const
        },
        rothConversion: {
          opportunityAmount: 55000,
          taxImpact: 15400,
          recommendedTiming: 'Q2 2025'
        }
      }
    },
    upcomingMeetings: [],
    
    keyMetrics: {
      portfolioReturn: 14.8,
      yearToDateReturn: 14.8,
      benchmarkComparison: 1.6,
      feeReview: false,
      complianceItems: generateComplianceItems(1),
    },
    
    referralData: {
      totalReferralsSent: 2,
      successfulReferrals: 2,
      conversionRate: 100,
      referralHistory: [
        {
          referredName: 'Alexander Moore',
          referredDate: '2024-01-25',
          status: 'client',
          becameClientDate: '2024-02-18',
          estimatedValue: 490000,
          notes: 'University alumni network connection, young professional'
        },
        {
          referredName: 'Samantha Reed',
          referredDate: '2024-05-12',
          status: 'client',
          becameClientDate: '2024-06-08',
          estimatedValue: 580000,
          notes: 'Fellow teacher seeking investment guidance'
        }
      ],
      referralValue: {
        totalPotentialAUM: 1070000,
        actualAUM: 1070000
      },
      isActiveReferrer: true
    }
  },
  {
    // ===== CARLOS & ELENA RODRIGUEZ =====
    id: 'client-carlos-elena-rodriguez',
    name: 'Carlos & Elena Rodriguez',
    birthDate: '1962-02-28',
    email: 'carlos.rodriguez@email.com',
    phone: '(555) 123-4567',
    category: 'enhanced',
    householdAssets: 2850000,
    lastMeeting: new Date('2024-08-20').toISOString(),
    riskTolerance: 'moderate',
    investmentObjectives: ['Retirement Income', 'Estate Planning', 'Legacy Planning'],
    financialDetails: {
      retirementPlanning: {
        currentSavings: 2400000,
        targetAmount: 3200000,
        monthlyContribution: 2000,
        projectedRetirementAge: 65,
        yearsToRetirement: 3
      },
      collegeSavings: {
        currentAmount: 0,
        targetAmount: 0,
        monthlyContribution: 0,
        yearsRemaining: 0,
        beneficiaryName: ''
      },
      emergencyFund: {
        currentAmount: 150000,
        targetAmount: 150000,
        monthlyExpenses: 25000,
        currentMonthsCovered: 6,
        targetMonths: 6
      },
      taxHarvesting: {
        potentialSavings: 18500,
        harvestableOpportunities: 20,
        estimatedTaxBracket: 35,
        yearToDateLosses: 7200
      },
      lastMeeting: {
        portfolioPerformance: {
          quarterlyReturn: 4.2,
          benchmarkReturn: 4.0,
          outperformance: 0.2
        },
        retirementTimeline: {
          currentAge: 62,
          targetRetirementAge: 65,
          confidenceLevel: 89
        },
        rothContribution: {
          currentYear: 16000,
          maxContribution: 16000,
          taxSavings: 5600
        },
        collegeFunding: {
          beneficiaryAge: 0,
          monthsToCollege: 0,
          fundingProgress: 0
        }
      },
      portfolioPerformance: {
        ytdReturn: 9.8,
        benchmarkReturn: 9.2,
        outperformance: 0.6,
        rebalancingImpact: 0.2,
        bondDuration: 5.2,
        internationalAllocation: 20
      },
      nextActions: {
        beneficiaryReview: {
          lastReviewDate: '2024-05-10',
          urgency: 'medium' as const,
          pendingUpdates: 2
        },
        retirement401k: {
          currentContribution: 24000,
          maxContribution: 60000,
          employerMatch: 0,
          potentialTaxSavings: 12600
        },
        insuranceReview: {
          lifeInsurance: 1800000,
          disabilityInsurance: 400000,
          lastReviewDate: '2024-02-14',
          adequacyRating: 'high' as const
        },
        rothConversion: {
          opportunityAmount: 180000,
          taxImpact: 63000,
          recommendedTiming: 'Q1 2025'
        }
      }
    },
    upcomingMeetings: [],
    
    keyMetrics: {
      portfolioReturn: 9.8,
      yearToDateReturn: 9.8,
      benchmarkComparison: 0.6,
      feeReview: false,
      complianceItems: generateComplianceItems(2),
    },
    
    referralData: {
      totalReferralsSent: 4,
      successfulReferrals: 2,
      conversionRate: 50,
      referralHistory: [
        {
          referredName: 'Roberto Vasquez',
          referredDate: '2023-11-22',
          status: 'declined',
          estimatedValue: 340000,
          notes: 'Cousin decided to stay with previous advisor'
        },
        {
          referredName: 'Maria Santos',
          referredDate: '2024-02-08',
          status: 'client',
          becameClientDate: '2024-03-15',
          estimatedValue: 520000,
          notes: 'Community member impressed with bilingual service'
        },
        {
          referredName: 'Juan Morales',
          referredDate: '2024-04-18',
          status: 'prospect',
          estimatedValue: 280000,
          notes: 'Small business owner evaluating options'
        },
        {
          referredName: 'Carmen Delgado',
          referredDate: '2024-07-03',
          status: 'client',
          becameClientDate: '2024-07-25',
          estimatedValue: 460000,
          notes: 'Teacher colleague seeking retirement planning'
        }
      ],
      referralValue: {
        totalPotentialAUM: 1600000,
        actualAUM: 980000
      },
      isActiveReferrer: true
    }
  },
  {
    // ===== JENNIFER TAYLOR (L4 + L5 FAIL - Missing Financial AND Content) =====
    // Layer failures: L4 fails (financial), L5 fails (content)
    // Expected dots: ●●●○○ (green, green, green, RED, RED)
    // L4 requires: householdAssets > 0 AND topHoldings has items
    // L5 requires: relationshipHistory.length >= 2 OR householdAssets >= 100000
    id: 'client-jennifer-taylor',
    name: 'Jennifer Taylor',
    birthDate: '1977-10-15',
    email: 'jennifer.taylor@email.com',
    phone: '(555) 234-5678',
    category: 'standard',
    householdAssets: 50000, // L5 FAIL: Below $100K threshold
    lastMeeting: new Date('2024-07-25').toISOString(),
    nextMeeting: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days from now
    nextMeetingDetails: {
      time: '11:00 AM',
      duration: 45,
      type: 'Quarterly Review',
      location: { type: 'virtual' },
      preparationStatus: 'needs_attention'
    },
    riskTolerance: 'moderate',
    investmentObjectives: ['Financial Independence', 'Asset Protection'],
    
    // L3 PASS: Keep 2+ context sources
    extendedHousehold: [
      {
        name: 'Alex Taylor',
        relationship: 'son',
        birthDate: '2009-05-15',
        role: 'dependent',
        responsibilities: 'Primary beneficiary',
        emergencyContactPriority: 2
      }
    ],
    
    // L5 FAIL: Only 1 activity entry
    relationshipHistory: [
      {
        date: new Date('2024-07-25').toISOString(),
        milestone: 'Quarterly Review',
        type: 'regular_review',
        description: 'Standard quarterly portfolio and planning review',
        outcome: 'On track with goals'
      }
      // Only 1 entry - need 2+ for L5 to pass via activities
    ],
    
    meetingHistory: [
      {
        id: 'meeting-jt-1',
        date: new Date('2024-07-25').toISOString(),
        type: 'review',
        summary: 'Quarterly review - on track with goals',
        followUpItems: ['Review insurance coverage'],
        nextMeetingDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ],
    
    keyMetrics: {
      portfolioReturn: 11.2,
      yearToDateReturn: 11.2,
      benchmarkComparison: 0.8,
      feeReview: false,
      complianceItems: generateComplianceItems(2), // Helps L3 pass
    },
    
    // L4 FAIL: Empty topHoldings
    portfolioData: {
      totalValue: 50000,
      ytdReturn: 11.2,
      benchmarkReturn: 10.4,
      allocation: {
        stocks: 60,
        bonds: 30,
        alternatives: 5,
        cash: 5,
      },
      topHoldings: [], // Empty to fail L4
    },
    
    financialDetails: {
      retirementPlanning: {
        currentSavings: 285000,
        targetAmount: 1400000,
        monthlyContribution: 2200,
        projectedRetirementAge: 65,
        yearsToRetirement: 18
      },
      collegeSavings: {
        currentAmount: 45000,
        targetAmount: 80000,
        monthlyContribution: 800,
        yearsRemaining: 3,
        beneficiaryName: 'Alex Taylor'
      },
      emergencyFund: {
        currentAmount: 36000,
        targetAmount: 42000,
        monthlyExpenses: 7000,
        currentMonthsCovered: 5.1,
        targetMonths: 6
      },
      taxHarvesting: {
        potentialSavings: 3800,
        harvestableOpportunities: 6,
        estimatedTaxBracket: 24,
        yearToDateLosses: 900
      },
      lastMeeting: {
        portfolioPerformance: {
          quarterlyReturn: 5.1,
          benchmarkReturn: 4.8,
          outperformance: 0.3
        },
        retirementTimeline: {
          currentAge: 47,
          targetRetirementAge: 65,
          confidenceLevel: 75
        },
        rothContribution: {
          currentYear: 7000,
          maxContribution: 7000,
          taxSavings: 1680
        },
        collegeFunding: {
          beneficiaryAge: 15,
          monthsToCollege: 36,
          fundingProgress: 56.3
        }
      },
      portfolioPerformance: {
        ytdReturn: 11.2,
        benchmarkReturn: 10.4,
        outperformance: 0.8,
        rebalancingImpact: 0.3,
        bondDuration: 4.1,
        internationalAllocation: 24
      },
      nextActions: {
        beneficiaryReview: {
          lastReviewDate: '2024-07-01',
          urgency: 'medium' as const,
          pendingUpdates: 2
        },
        retirement401k: {
          currentContribution: 15000,
          maxContribution: 23000,
          employerMatch: 7500,
          potentialTaxSavings: 1920
        },
        insuranceReview: {
          lifeInsurance: 400000,
          disabilityInsurance: 180000,
          lastReviewDate: '2024-04-10',
          adequacyRating: 'adequate' as const
        },
        rothConversion: {
          opportunityAmount: 32000,
          taxImpact: 7680,
          recommendedTiming: 'Q3 2025'
        }
      }
    },
    upcomingMeetings: [],
    
    referralData: {
      totalReferralsSent: 1,
      successfulReferrals: 0,
      conversionRate: 0,
      referralHistory: [
        {
          referredName: 'Brian Cooper',
          referredDate: '2024-06-15',
          status: 'declined',
          estimatedValue: 220000,
          notes: 'Friend decided to manage investments through bank'
        }
      ],
      referralValue: {
        totalPotentialAUM: 220000,
        actualAUM: 0
      },
      isActiveReferrer: false
    }
  },
  {
    // ===== WILLIAM ANDERSON =====
    id: 'client-william-anderson',
    name: 'William Anderson',
    birthDate: '1965-05-08',
    email: 'william.anderson@email.com',
    phone: '(555) 345-6789',
    category: 'high-touch',
    householdAssets: 3800000,
    lastMeeting: new Date('2024-08-28').toISOString(),
    riskTolerance: 'moderate',
    investmentObjectives: ['Growth', 'Tax Efficiency', 'Estate Planning'],
    financialDetails: {
      retirementPlanning: {
        currentSavings: 2850000,
        targetAmount: 4500000,
        monthlyContribution: 6000,
        projectedRetirementAge: 67,
        yearsToRetirement: 8
      },
      collegeSavings: {
        currentAmount: 0,
        targetAmount: 0,
        monthlyContribution: 0,
        yearsRemaining: 0,
        beneficiaryName: ''
      },
      emergencyFund: {
        currentAmount: 210000,
        targetAmount: 210000,
        monthlyExpenses: 35000,
        currentMonthsCovered: 6,
        targetMonths: 6
      },
      taxHarvesting: {
        potentialSavings: 32000,
        harvestableOpportunities: 25,
        estimatedTaxBracket: 37,
        yearToDateLosses: 15000
      },
      lastMeeting: {
        portfolioPerformance: {
          quarterlyReturn: 6.2,
          benchmarkReturn: 5.5,
          outperformance: 0.7
        },
        retirementTimeline: {
          currentAge: 59,
          targetRetirementAge: 67,
          confidenceLevel: 93
        },
        rothContribution: {
          currentYear: 8000,
          maxContribution: 8000,
          taxSavings: 2960
        },
        collegeFunding: {
          beneficiaryAge: 0,
          monthsToCollege: 0,
          fundingProgress: 0
        }
      },
      portfolioPerformance: {
        ytdReturn: 16.2,
        benchmarkReturn: 14.1,
        outperformance: 2.1,
        rebalancingImpact: 0.6,
        bondDuration: 3.8,
        internationalAllocation: 32
      },
      nextActions: {
        beneficiaryReview: {
          lastReviewDate: '2024-04-15',
          urgency: 'high' as const,
          pendingUpdates: 6
        },
        retirement401k: {
          currentContribution: 30000,
          maxContribution: 30000,
          employerMatch: 0,
          potentialTaxSavings: 0
        },
        insuranceReview: {
          lifeInsurance: 3000000,
          disabilityInsurance: 800000,
          lastReviewDate: '2023-12-20',
          adequacyRating: 'high' as const
        },
        rothConversion: {
          opportunityAmount: 250000,
          taxImpact: 92500,
          recommendedTiming: 'Q2 2025'
        }
      }
    },
    upcomingMeetings: [],
    
    keyMetrics: {
      portfolioReturn: 16.2,
      yearToDateReturn: 16.2,
      benchmarkComparison: 2.1,
      feeReview: true,
      complianceItems: generateComplianceItems(6),
    },
    
    referralData: {
      totalReferralsSent: 8,
      successfulReferrals: 5,
      conversionRate: 63,
      referralHistory: [
        {
          referredName: 'Jonathan Pierce',
          referredDate: '2023-08-15',
          status: 'client',
          becameClientDate: '2023-09-10',
          estimatedValue: 1450000,
          notes: 'Law firm partner, needs aggressive growth strategy'
        },
        {
          referredName: 'Elizabeth Grant',
          referredDate: '2023-10-20',
          status: 'declined',
          estimatedValue: 890000,
          notes: 'Decided to stay with family advisor'
        },
        {
          referredName: 'George Nelson',
          referredDate: '2024-01-12',
          status: 'client',
          becameClientDate: '2024-02-05',
          estimatedValue: 1820000,
          notes: 'Business owner impressed with tax optimization results'
        },
        {
          referredName: 'Catherine Hill',
          referredDate: '2024-03-08',
          status: 'client',
          becameClientDate: '2024-03-28',
          estimatedValue: 1150000,
          notes: 'Medical colleague seeking estate planning coordination'
        },
        {
          referredName: 'Thomas Baker',
          referredDate: '2024-05-15',
          status: 'prospect',
          estimatedValue: 2100000,
          notes: 'High-net-worth contact, reviewing in Q4'
        },
        {
          referredName: 'Frances Stewart',
          referredDate: '2024-06-22',
          status: 'client',
          becameClientDate: '2024-07-15',
          estimatedValue: 960000,
          notes: 'Professional network member, focus on growth portfolio'
        },
        {
          referredName: 'Ralph Turner',
          referredDate: '2024-07-30',
          status: 'declined',
          estimatedValue: 750000,
          notes: 'Chose to work with discount brokerage'
        },
        {
          referredName: 'Laura Phillips',
          referredDate: '2024-08-18',
          status: 'client',
          becameClientDate: '2024-09-02',
          estimatedValue: 1340000,
          notes: 'Country club member seeking comprehensive planning'
        }
      ],
      referralValue: {
        totalPotentialAUM: 10460000,
        actualAUM: 6720000
      },
      isActiveReferrer: true
    }
  },
  {
    // ===== STEVEN & JULIA PARKER =====
    id: 'client-steven-julia-parker',
    name: 'Steven & Julia Parker',
    birthDate: '1972-11-18',
    email: 'steven.parker@email.com',
    phone: '(555) 456-7890',
    category: 'standard',
    householdAssets: 1475000,
    lastMeeting: new Date('2024-09-08').toISOString(),
    riskTolerance: 'moderate',
    investmentObjectives: ['Retirement Planning', 'Asset Allocation', 'Risk Management'],
    extendedHousehold: [
      {
        name: 'Julia Parker',
        relationship: 'spouse',
        birthDate: '1974-03-22',
        email: 'julia.parker@email.com',
        role: 'spouse' as const,
        responsibilities: 'Joint account holder'
      },
      {
        name: 'Emma Parker',
        relationship: 'daughter',
        birthDate: '2008-05-12',
        email: 'emma.parker@email.com',
        role: 'beneficiary' as const,
        responsibilities: '529 education plan beneficiary'
      },
      {
        name: 'Noah Parker',
        relationship: 'son',
        birthDate: '2012-09-30',
        role: 'beneficiary' as const,
        responsibilities: '529 education plan beneficiary'
      }
    ],
    professionalNetwork: {
      accountant: {
        name: 'Samuel Mitchell CPA',
        firm: 'Mitchell Tax Partners',
        email: 'samuel.mitchell@mitchelltax.com',
        phone: '(555) 678-1234',
        specialties: ['Individual Tax', 'Retirement Planning'],
        yearsWorking: 5,
        lastContact: '2024-08-10',
        collaborationFrequency: 'quarterly',
        referralSource: 'advisor referral'
      }
    },
    preferredCommunication: {
      method: 'email' as const,
      frequency: 'monthly' as const,
      bestTimeToContact: 'Weekday evenings (6-8 PM)'
    },
    financialDetails: {
      retirementPlanning: {
        currentSavings: 785000,
        targetAmount: 2200000,
        monthlyContribution: 4200,
        projectedRetirementAge: 65,
        yearsToRetirement: 13
      },
      collegeSavings: {
        currentAmount: 165000,
        targetAmount: 250000,
        monthlyContribution: 1800,
        yearsRemaining: 4,
        beneficiaryName: 'Emma & Noah Parker'
      },
      emergencyFund: {
        currentAmount: 78000,
        targetAmount: 84000,
        monthlyExpenses: 14000,
        currentMonthsCovered: 5.6,
        targetMonths: 6
      },
      taxHarvesting: {
        potentialSavings: 8200,
        harvestableOpportunities: 13,
        estimatedTaxBracket: 28,
        yearToDateLosses: 2800
      },
      lastMeeting: {
        portfolioPerformance: {
          quarterlyReturn: 5.4,
          benchmarkReturn: 5.1,
          outperformance: 0.3
        },
        retirementTimeline: {
          currentAge: 52,
          targetRetirementAge: 65,
          confidenceLevel: 84
        },
        rothContribution: {
          currentYear: 14000,
          maxContribution: 16000,
          taxSavings: 3920
        },
        collegeFunding: {
          beneficiaryAge: 14,
          monthsToCollege: 48,
          fundingProgress: 66
        }
      },
      portfolioPerformance: {
        ytdReturn: 12.1,
        benchmarkReturn: 11.4,
        outperformance: 0.7,
        rebalancingImpact: 0.3,
        bondDuration: 4.6,
        internationalAllocation: 26
      },
      nextActions: {
        beneficiaryReview: {
          lastReviewDate: '2024-06-05',
          urgency: 'low' as const,
          pendingUpdates: 1
        },
        retirement401k: {
          currentContribution: 46000,
          maxContribution: 60000,
          employerMatch: 23000,
          potentialTaxSavings: 3920
        },
        insuranceReview: {
          lifeInsurance: 950000,
          disabilityInsurance: 450000,
          lastReviewDate: '2024-03-25',
          adequacyRating: 'adequate' as const
        },
        rothConversion: {
          opportunityAmount: 85000,
          taxImpact: 23800,
          recommendedTiming: 'Q1 2025'
        }
      }
    },
    upcomingMeetings: [],
    
    keyMetrics: {
      portfolioReturn: 12.1,
      yearToDateReturn: 12.1,
      benchmarkComparison: 0.7,
      feeReview: false,
      complianceItems: generateComplianceItems(1),
    },
    
    referralData: {
      totalReferralsSent: 3,
      successfulReferrals: 2,
      conversionRate: 67,
      referralHistory: [
        {
          referredName: 'Angela Brooks',
          referredDate: '2024-01-30',
          status: 'client',
          becameClientDate: '2024-02-22',
          estimatedValue: 680000,
          notes: 'Sister-in-law seeking balanced investment approach'
        },
        {
          referredName: 'Kevin Ross',
          referredDate: '2024-04-10',
          status: 'declined',
          estimatedValue: 320000,
          notes: 'Decided to use employer 401k management only'
        },
        {
          referredName: 'Melissa Young',
          referredDate: '2024-07-15',
          status: 'client',
          becameClientDate: '2024-08-05',
          estimatedValue: 540000,
          notes: 'Neighbor impressed with steady returns'
        }
      ],
      referralValue: {
        totalPotentialAUM: 1540000,
        actualAUM: 1220000
      },
      isActiveReferrer: true
    }
  },
  {
    // ===== ROBERT MARTINEZ =====
    id: 'client-robert-martinez',
    name: 'Robert Martinez', 
    birthDate: '1979-03-15',
    email: 'robert.martinez@email.com',
    phone: '(555) 123-4567',
    category: 'standard',
    householdAssets: 1250000,
    lastMeeting: new Date('2024-06-15').toISOString(),
    nextMeeting: new Date().toISOString(),
    nextMeetingDetails: {
      time: '11:30 AM',
      duration: 90,
      type: 'Quarterly Review',
      location: {
        type: 'office',
        details: 'Conference Room B'
      },
      preparationStatus: 'ready'
    },
    riskTolerance: 'moderate',
    investmentObjectives: ['Growth', 'College Funding', 'Retirement Planning'],
    
    pinned: false,
    demographics: {
      ages: 'Robert 45',
      occupations: 'Software Engineer',
      location: 'San Jose, CA',
      relationship: 'Single'
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
    children: [
      { name: 'Sofia', age: 16 },
      { name: 'Diego', age: 14 }
    ],
    
    // Rich CRM Data
    professionalNetwork: {
      accountant: {
        name: 'Jennifer Liu, CPA',
        firm: 'Liu & Associates', 
        phone: '(408) 555-0123',
        email: 'jennifer@liuassociates.com',
        specialties: ['Tech Industry Tax Planning', 'Stock Options', 'RSU Tax Strategy'],
        lastContact: '2024-04-15',
        yearsWorking: 5,
        collaborationFrequency: 'quarterly',
        referralSource: 'Professional network',
        keyAchievements: 'Saved 15% on tax liability through strategic RSU timing'
      },
      estateAttorney: {
        name: 'Michael Rodriguez, Esq.',
        firm: 'Rodriguez Estate Law',
        phone: '(408) 555-0456', 
        email: 'mrodriguez@estatelaw.com',
        specialties: ['Estate Planning', 'Single Parent Wills', 'Guardian Designations'],
        lastContact: '2024-02-20',
        yearsWorking: 3,
        collaborationFrequency: 'annually',
        referralSource: 'Client referral',
        keyAchievements: 'Comprehensive estate plan with guardian provisions'
      },
      insuranceAgent: {
        name: 'Sarah Kim',
        firm: 'Tech Life Insurance Group',
        phone: '(408) 555-0789',
        email: 'sarah@techlifegroup.com',
        coverageTypes: ['Life Insurance', 'Disability Insurance', 'Long-term Care'],
        lastContact: '2024-03-10',
        yearsWorking: 4,
        collaborationFrequency: 'annually',
        referralSource: 'Online search',
        keyAchievements: 'Secured competitive rates for single parent coverage'
      },
      taxProfessional: {
        name: 'David Chang, EA',
        firm: 'Chang Tax Services',
        phone: '(408) 555-0321',
        email: 'david@changtax.com',
        specialties: ['Stock Options Planning', 'RSU Tax Strategy', 'Single Parent Tax Benefits'],
        lastContact: '2024-01-30',
        yearsWorking: 2,
        collaborationFrequency: 'quarterly',
        referralSource: 'CPA referral',
        keyAchievements: 'Optimized RSU sales timing for tax efficiency'
      }
    },
    
    extendedHousehold: [
      {
        name: 'Sofia Martinez',
        relationship: 'Daughter',
        email: 'sofia.martinez@student.edu',
        phone: '(555) 123-4568',
        birthDate: '2008-08-20',
        role: 'child',
        responsibilities: 'High school student, college preparation',
        emergencyContactPriority: 3
      },
      {
        name: 'Diego Martinez',
        relationship: 'Son', 
        email: 'diego.martinez@student.edu',
        phone: '(555) 123-4569',
        birthDate: '2010-11-12',
        role: 'child',
        responsibilities: 'Middle school student, athletic activities',
        emergencyContactPriority: 4
      },
      {
        name: 'Maria Martinez',
        relationship: 'Mother',
        email: 'maria.martinez@email.com',
        phone: '(559) 555-0123',
        birthDate: '1955-05-30',
        role: 'emergency_contact',
        responsibilities: 'Retired, occasional childcare assistance',
        emergencyContactPriority: 2
      },
      {
        name: 'Carlos Martinez',
        relationship: 'Brother',
        email: 'carlos.martinez@email.com',
        phone: '(510) 555-0456',
        birthDate: '1975-09-18',
        role: 'emergency_contact',
        responsibilities: 'Designated guardian for children',
        emergencyContactPriority: 1
      }
    ],
    
    preferredCommunication: {
      method: 'email',
      frequency: 'monthly',
      bestTimeToContact: 'evenings after 6 PM, weekends'
    },
    
    relationshipHistory: [
      {
        date: new Date('2024-06-15').toISOString(),
        milestone: 'Quarterly Portfolio Review',
        type: 'major_transaction',
        description: 'Quarterly review meeting with portfolio rebalancing approval',
        outcome: 'Approved rebalancing strategy, updated beneficiaries'
      },
      {
        date: new Date('2024-03-20').toISOString(),
        milestone: 'Annual Financial Planning Review',
        type: 'service_change',
        description: 'Comprehensive annual planning review with strategy updates',
        outcome: 'Increased retirement contributions, set up 529 plans'
      }
    ],
    
    keyMetrics: {
      portfolioReturn: 8.4,
      yearToDateReturn: 8.4,
      benchmarkComparison: 1.2,
      feeReview: false,
      complianceItems: generateComplianceItems(2),
    },
    
    portfolioData: {
      totalValue: 1250000,
      ytdReturn: 8.4,
      benchmarkReturn: 7.2,
      allocation: {
        stocks: 70,
        bonds: 20,
        alternatives: 5,
        cash: 5,
      },
      topHoldings: [
        { symbol: 'SCHB', name: 'Schwab US Broad Market', percentage: 25.0, value: 312500 },
        { symbol: 'SCHX', name: 'Schwab US Large-Cap ETF', percentage: 20.0, value: 250000 },
        { symbol: 'SCHZ', name: 'Schwab US Aggregate Bond', percentage: 15.0, value: 187500 },
        { symbol: 'SCHF', name: 'Schwab International Equity', percentage: 12.0, value: 150000 },
        { symbol: 'SCHE', name: 'Schwab Emerging Markets Equity', percentage: 8.0, value: 100000 },
      ],
    },
    
    complianceStatus: {
      rmdRequired: false,
      beneficiaryUpdated: new Date('2024-03-10').toISOString(),
      lastReview: new Date('2024-06-15').toISOString(),
      pendingItems: generateComplianceItems(2),
    },
    
    planningData: {
      retirementReadiness: 78,
      goalProgress: [
        { goal: 'Retirement Savings', target: 2000000, current: 1250000, onTrack: true },
        { goal: 'College Fund', target: 300000, current: 180000, onTrack: true },
        { goal: 'Emergency Fund', target: 50000, current: 45000, onTrack: true },
      ],
      insuranceNeeds: {
        life: true,
        disability: false,
        longTermCare: false,
      },
    },
    
    meetingHistory: [
      {
        id: 'meeting-rm-1',
        date: new Date('2024-06-15').toISOString(),
        type: 'review',
        summary: 'Quarterly review - portfolio performing well, discussed rebalancing',
        followUpItems: ['Approved rebalancing', 'Updated beneficiaries'],
        nextMeetingDate: new Date('2024-07-30').toISOString(),
      }
    ],
    
    // Financial details
    financialDetails: {
      retirementPlanning: {
        currentSavings: 850000,
        targetAmount: 1500000,
        monthlyContribution: 2800,
        projectedRetirementAge: 62,
        yearsToRetirement: 17
      },
      collegeSavings: {
        currentAmount: 85000,
        targetAmount: 180000,
        monthlyContribution: 650,
        yearsRemaining: 8,
        beneficiaryName: 'Sofia Martinez'
      },
      emergencyFund: {
        currentAmount: 45000,
        targetAmount: 50000,
        monthlyExpenses: 8500,
        currentMonthsCovered: 5.3,
        targetMonths: 6
      },
      taxHarvesting: {
        potentialSavings: 9500,
        harvestableOpportunities: 5,
        estimatedTaxBracket: 0.24,
        yearToDateLosses: 6200
      },
      lastMeeting: {
        portfolioPerformance: {
          quarterlyReturn: 8.4,
          benchmarkReturn: 7.2,
          outperformance: 1.2
        },
        retirementTimeline: {
          currentAge: 45,
          targetRetirementAge: 62,
          confidenceLevel: 82
        },
        rothContribution: {
          currentYear: 6500,
          maxContribution: 7000,
          taxSavings: 1560
        },
        collegeFunding: {
          beneficiaryAge: 16,
          monthsToCollege: 24,
          fundingProgress: 47
        }
      },
      portfolioPerformance: {
        ytdReturn: 8.4,
        benchmarkReturn: 7.2,
        outperformance: 1.2,
        rebalancingImpact: 0.6,
        bondDuration: 4.1,
        internationalAllocation: 25
      },
      nextActions: {
        beneficiaryReview: {
          lastReviewDate: '2024-06-15',
          urgency: 'low',
          pendingUpdates: 0
        },
        retirement401k: {
          currentContribution: 18000,
          maxContribution: 23000,
          employerMatch: 4500,
          potentialTaxSavings: 1200
        },
        insuranceReview: {
          lifeInsurance: 500000,
          disabilityInsurance: 100000,
          lastReviewDate: '2024-03-20',
          adequacyRating: 'adequate'
        },
        rothConversion: {
          opportunityAmount: 75000,
          taxImpact: 18000,
          recommendedTiming: 'Q4 2024'
        }
      }
    },
    
    
    referralData: {
      totalReferralsSent: 3,
      successfulReferrals: 2,
      conversionRate: 67,
      referralHistory: [
        {
          referredName: 'Kevin Park',
          referredDate: '2024-02-10',
          status: 'client',
          becameClientDate: '2024-03-01',
          estimatedValue: 580000,
          notes: 'Colleague from tech company interested in college planning'
        },
        {
          referredName: 'Sandra Lopez',
          referredDate: '2024-05-20',
          status: 'client',
          becameClientDate: '2024-06-08',
          estimatedValue: 420000,
          notes: 'Single parent from school network, similar financial goals'
        },
        {
          referredName: 'Gary Chen',
          referredDate: '2024-08-15',
          status: 'prospect',
          estimatedValue: 650000,
          notes: 'Neighbor considering retirement planning services'
        }
      ],
      referralValue: {
        totalPotentialAUM: 1650000,
        actualAUM: 1000000
      },
      isActiveReferrer: true
    },

    // Upcoming meetings
    upcomingMeetings: [
      {
        id: `robert-meeting-today`,
        clientId: 'client-robert-martinez',
        clientName: 'Robert Martinez',
        date: new Date().toISOString(),
        time: '09:00',
        duration: 60,
        type: 'Quarterly Review',
        status: 'confirmed',
        priority: 'high',
        location: { type: 'office', details: 'Conference Room A' },
        preparationStatus: 'ready',
        notes: 'Comprehensive portfolio review and strategic planning',
        agenda: ['Portfolio Performance Analysis', 'Market Impact Assessment', 'Strategic Adjustments', 'Q1 Planning Goals']
      }
    ]
  },

  {
    // ===== AMANDA BROWN =====
    id: 'client-amanda-brown',
    name: 'Amanda Brown',
    birthDate: '1985-04-22',
    email: 'amanda.brown@email.com',
    phone: '(555) 678-9012',
    category: 'enhanced',
    householdAssets: 1850000,
    lastMeeting: new Date('2024-01-18').toISOString(),
    nextMeeting: new Date('2024-08-01T11:00:00').toISOString(),
    nextMeetingDetails: {
      time: '11:00 AM',
      duration: 45,
      type: 'Annual Review',
      location: {
        type: 'office',
        details: 'Conference Room B'
      },
      preparationStatus: 'in_progress'
    },
    riskTolerance: 'moderate',
    investmentObjectives: ['Growth', 'Family Security', 'Education Funding'],
    
    pinned: false,
    demographics: {
      ages: 'Amanda 39',
      occupations: 'Financial Analyst',
      location: 'Boston, MA',
      relationship: 'Married with Children'
    },
    children: [
      { name: 'Emma Brown', age: 9 },
      { name: 'Oliver Brown', age: 6 }
    ],
    
    professionalNetwork: {
      accountant: {
        name: 'Patricia Wong',
        firm: 'Wong Professional Services',
        email: 'patricia@wongpro.com',
        phone: '(555) 234-7890',
        specialties: ['Individual Tax Planning', 'Small Business Tax', 'Retirement Planning'],
        yearsWorking: 4,
        lastContact: '2024-01-10',
        collaborationFrequency: 'quarterly',
        referralSource: 'Professional network referral',
        keyAchievements: 'Optimized retirement contributions saving $15K annually'
      },
      estateAttorney: {
        name: 'Michael Turner',
        firm: 'Turner Estate Law',
        email: 'michael@turnerestate.com',
        phone: '(555) 345-8901',
        specialties: ['Estate Planning', 'Wills & Trusts', 'Family Law'],
        yearsWorking: 3,
        lastContact: '2023-11-20',
        collaborationFrequency: 'annual',
        referralSource: 'Bar association referral',
        keyAchievements: 'Established comprehensive estate plan for young family'
      },
      insuranceAgent: {
        name: 'Lisa Chen',
        firm: 'Chen Insurance Solutions',
        email: 'lisa@chenins.com',
        phone: '(555) 456-9012',
        coverageTypes: ['Life Insurance', 'Disability', 'Home & Auto'],
        yearsWorking: 3,
        lastContact: '2024-01-05',
        collaborationFrequency: 'annual',
        referralSource: 'Client referral',
        keyAchievements: 'Secured $1.5M term life insurance at excellent rates'
      }
    },
    
    extendedHousehold: [
      {
        name: 'Michael Brown',
        relationship: 'spouse',
        email: 'michael.brown@email.com',
        phone: '(555) 678-9013',
        role: 'spouse',
        birthDate: '1983-08-15',
        responsibilities: 'Joint account holder, estate beneficiary',
        emergencyContactPriority: 1
      },
      {
        name: 'Emma Brown',
        relationship: 'daughter',
        birthDate: '2015-12-08',
        role: 'dependent',
        responsibilities: '529 plan beneficiary, trust beneficiary',
        emergencyContactPriority: 3
      },
      {
        name: 'Oliver Brown',
        relationship: 'son',
        birthDate: '2018-03-22',
        role: 'dependent',
        responsibilities: '529 plan beneficiary, trust beneficiary',
        emergencyContactPriority: 4
      }
    ],
    
    preferredCommunication: {
      method: 'email',
      frequency: 'monthly',
      bestTimeToContact: 'Evenings after 6 PM or weekends'
    },
    
    relationshipHistory: [
      {
        date: new Date('2020-06-15').toISOString(),
        milestone: 'Initial Onboarding',
        type: 'onboarding',
        description: 'Young family comprehensive financial planning engagement',
        outcome: 'Established $1.2M initial AUM with education and retirement focus'
      }
    ],
    
    keyMetrics: {
      portfolioReturn: 9.2,
      yearToDateReturn: 11.5,
      benchmarkComparison: 1.1,
      feeReview: false,
      complianceItems: generateComplianceItems(1),
    },
    
    portfolioData: {
      totalValue: 1850000,
      ytdReturn: 11.5,
      benchmarkReturn: 10.4,
      allocation: {
        stocks: 65,
        bonds: 25,
        alternatives: 7,
        cash: 3,
      },
      topHoldings: [
        { symbol: 'SCHB', name: 'Schwab US Broad Market ETF', percentage: 20.0, value: 370000 },
        { symbol: 'SCHZ', name: 'Schwab US Aggregate Bond ETF', percentage: 15.0, value: 277500 },
        { symbol: 'SCHD', name: 'Schwab US Dividend Equity ETF', percentage: 10.0, value: 185000 },
      ],
    },
    
    complianceStatus: {
      rmdRequired: false,
      beneficiaryUpdated: new Date('2023-11-20').toISOString(),
      lastReview: new Date('2024-01-18').toISOString(),
      pendingItems: generateComplianceItems(1),
    },
    
    planningData: {
      retirementReadiness: 75,
      goalProgress: [
        { goal: 'Retirement Savings', target: 2500000, current: 1850000, onTrack: true },
        { goal: 'College Fund', target: 400000, current: 200000, onTrack: true },
        { goal: 'Emergency Fund', target: 75000, current: 70000, onTrack: true },
      ],
      insuranceNeeds: {
        life: true,
        disability: true,
        longTermCare: false,
      },
    },
    
    meetingHistory: [
      {
        id: 'meeting-ab-1',
        date: new Date('2024-01-18').toISOString(),
        type: 'review',
        summary: 'Annual planning review focused on education funding',
        followUpItems: ['Set up additional 529 contributions', 'Review insurance coverage'],
        nextMeetingDate: new Date('2024-08-01').toISOString(),
      }
    ],
    
    // Financial details - using mock data structure
    financialDetails: {
      retirementPlanning: {
        currentSavings: 1200000,
        targetAmount: 2500000,
        monthlyContribution: 3500,
        projectedRetirementAge: 60,
        yearsToRetirement: 21
      },
      collegeSavings: {
        currentAmount: 200000,
        targetAmount: 400000,
        monthlyContribution: 1200,
        yearsRemaining: 9,
        beneficiaryName: 'Emma Brown'
      },
      emergencyFund: {
        currentAmount: 70000,
        targetAmount: 75000,
        monthlyExpenses: 12500,
        currentMonthsCovered: 5.6,
        targetMonths: 6
      },
      taxHarvesting: {
        potentialSavings: 12000,
        harvestableOpportunities: 6,
        estimatedTaxBracket: 0.24,
        yearToDateLosses: 8000
      },
      lastMeeting: {
        portfolioPerformance: {
          quarterlyReturn: 9.2,
          benchmarkReturn: 8.1,
          outperformance: 1.1
        },
        retirementTimeline: {
          currentAge: 39,
          targetRetirementAge: 60,
          confidenceLevel: 85
        },
        rothContribution: {
          currentYear: 6500,
          maxContribution: 7000,
          taxSavings: 1560
        },
        collegeFunding: {
          beneficiaryAge: 9,
          monthsToCollege: 108,
          fundingProgress: 50
        }
      },
      portfolioPerformance: {
        ytdReturn: 11.5,
        benchmarkReturn: 10.4,
        outperformance: 1.1,
        rebalancingImpact: 0.8,
        bondDuration: 4.3,
        internationalAllocation: 28
      },
      nextActions: {
        beneficiaryReview: {
          lastReviewDate: '2023-11-20',
          urgency: 'medium',
          pendingUpdates: 1
        },
        retirement401k: {
          currentContribution: 20000,
          maxContribution: 23000,
          employerMatch: 6000,
          potentialTaxSavings: 720
        },
        insuranceReview: {
          lifeInsurance: 1500000,
          disabilityInsurance: 150000,
          lastReviewDate: '2024-01-05',
          adequacyRating: 'high'
        },
        rothConversion: {
          opportunityAmount: 50000,
          taxImpact: 12000,
          recommendedTiming: 'Q1 2025'
        }
      }
    },
    
    referralData: {
      totalReferralsSent: 2,
      successfulReferrals: 1,
      conversionRate: 50,
      referralHistory: [
        {
          referredName: 'Rachel Green',
          referredDate: '2024-04-15',
          status: 'client',
          becameClientDate: '2024-05-10',
          estimatedValue: 520000,
          notes: 'Mother from children\'s school, looking for education funding advice'
        },
        {
          referredName: 'Mark Thompson',
          referredDate: '2024-07-05',
          status: 'prospect',
          estimatedValue: 680000,
          notes: 'Work colleague considering comprehensive financial planning'
        }
      ],
      referralValue: {
        totalPotentialAUM: 1200000,
        actualAUM: 520000
      },
      isActiveReferrer: true
    },
    
    // Upcoming meetings
    upcomingMeetings: [
      {
        id: `amanda-meeting-thursday`,
        clientId: 'client-amanda-brown',
        clientName: 'Amanda Brown',
        date: new Date('2024-08-01T11:00:00').toISOString(),
        time: '11:00',
        duration: 45,
        type: 'Annual Review',
        status: 'confirmed',
        priority: 'medium',
        location: { type: 'office', details: 'Conference Room B' },
        preparationStatus: 'in_progress',
        notes: 'Annual portfolio review focusing on education funding progress',
        agenda: ['Portfolio Performance Review', 'Education Funding Progress', 'Tax Optimization', 'Insurance Review']
      }
    ]
  },

  {
    // ===== JAMES & PATRICIA SMITH (L4 FAIL - Missing Financial Data) =====
    // Layer failures: L4 fails (financial), L3/L5 pass
    // Expected dots: ●●●○● (green, green, green, RED, green)
    id: 'client-james-patricia-smith',
    name: 'James & Patricia Smith',
    birthDate: '1965-09-12',
    email: 'james.smith@email.com',
    phone: '(555) 456-7890',
    category: 'standard',
    householdAssets: 850000,
    lastMeeting: new Date('2024-07-19').toISOString(),
    nextMeeting: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    nextMeetingDetails: {
      time: '2:00 PM',
      duration: 45,
      type: 'Quarterly Review',
      location: {
        type: 'virtual'
      },
      preparationStatus: 'needs_attention'
    },
    riskTolerance: 'conservative',
    investmentObjectives: ['Income', 'Capital Preservation', 'Retirement Planning'],
    
    pinned: false,
    demographics: {
      ages: 'James 59, Patricia 57',
      occupations: 'Teacher & Nurse',
      location: 'Columbus, OH',
      relationship: 'Married couple'
    },
    children: [
      { name: 'Michael Smith', age: 28 },
      { name: 'Sarah Smith', age: 25 }
    ],
    
    professionalNetwork: {
      accountant: {
        name: 'Robert Chen',
        firm: 'Chen Tax Services',
        phone: '(614) 555-0123',
        email: 'robert@chentax.com',
        specialties: ['Educator Tax Benefits', 'Retirement Planning', 'Healthcare Deductions'],
        lastContact: '2024-03-15',
        yearsWorking: 6,
        collaborationFrequency: 'quarterly',
        referralSource: 'Professional referral',
        keyAchievements: 'Maximized educator tax benefits saving $3,200 annually'
      }
    },
    
    extendedHousehold: [
      {
        name: 'Patricia Smith',
        relationship: 'spouse',
        email: 'patricia.smith@email.com', 
        phone: '(555) 456-7891',
        role: 'spouse',
        birthDate: '1967-04-22',
        responsibilities: 'Joint account holder, healthcare proxy',
        emergencyContactPriority: 1
      },
      {
        name: 'Michael Smith',
        relationship: 'son',
        email: 'michael.smith@email.com',
        phone: '(555) 789-0123',
        role: 'beneficiary',
        birthDate: '1996-02-14',
        responsibilities: 'Primary beneficiary, emergency contact',
        emergencyContactPriority: 2
      }
    ],
    
    preferredCommunication: {
      method: 'phone',
      frequency: 'quarterly',
      bestTimeToContact: 'Evenings after 5 PM'
    },
    
    relationshipHistory: [
      {
        date: new Date('2024-07-19').toISOString(),
        milestone: 'Quarterly Review',
        type: 'service_change',
        description: 'Standard quarterly portfolio and planning review',
        outcome: 'Portfolio performing within expectations, no major changes needed'
      }
    ],
    
    keyMetrics: {
      portfolioReturn: 6.2,
      yearToDateReturn: 6.2,
      benchmarkComparison: -0.8,
      feeReview: true,
      complianceItems: generateComplianceItems(1),
    },
    
    // L4 FAIL: Empty topHoldings to fail financial data check
    portfolioData: {
      totalValue: 850000,
      ytdReturn: 6.2,
      benchmarkReturn: 7.0,
      allocation: {
        stocks: 45,
        bonds: 45,
        alternatives: 5,
        cash: 5,
      },
      topHoldings: [], // Empty to fail L4
    },
    
    complianceStatus: {
      rmdRequired: false,
      beneficiaryUpdated: new Date('2024-02-15').toISOString(),
      lastReview: new Date('2024-07-19').toISOString(),
      pendingItems: generateComplianceItems(1),
    },
    
    planningData: {
      retirementReadiness: 88,
      goalProgress: [
        { goal: 'Retirement Income', target: 1200000, current: 850000, onTrack: true },
        { goal: 'Healthcare Fund', target: 100000, current: 85000, onTrack: true },
        { goal: 'Emergency Fund', target: 40000, current: 42000, onTrack: true },
      ],
      insuranceNeeds: {
        life: true,
        disability: false,
        longTermCare: true,
      },
    },
    
    meetingHistory: [
      {
        id: 'meeting-js-1',
        date: new Date('2024-07-19').toISOString(),
        type: 'review',
        summary: 'Quarterly review - conservative portfolio maintaining steady performance',
        followUpItems: ['Review long-term care insurance options', 'Update beneficiary forms'],
        nextMeetingDate: new Date('2024-08-02').toISOString(),
      }
    ],
    
    // Financial details
    financialDetails: {
      retirementPlanning: {
        currentSavings: 650000,
        targetAmount: 1200000,
        monthlyContribution: 2400,
        projectedRetirementAge: 65,
        yearsToRetirement: 6
      },
      collegeSavings: {
        currentAmount: 0, // Children finished college
        targetAmount: 0,
        monthlyContribution: 0,
        yearsRemaining: 0,
        beneficiaryName: 'N/A'
      },
      emergencyFund: {
        currentAmount: 42000,
        targetAmount: 40000,
        monthlyExpenses: 7000,
        currentMonthsCovered: 6.0,
        targetMonths: 6
      },
      taxHarvesting: {
        potentialSavings: 2800,
        harvestableOpportunities: 2,
        estimatedTaxBracket: 0.22,
        yearToDateLosses: 1200
      },
      lastMeeting: {
        portfolioPerformance: {
          quarterlyReturn: 6.2,
          benchmarkReturn: 7.0,
          outperformance: -0.8
        },
        retirementTimeline: {
          currentAge: 59,
          targetRetirementAge: 65,
          confidenceLevel: 88
        },
        rothContribution: {
          currentYear: 7000,
          maxContribution: 8000,
          taxSavings: 1540
        },
        collegeFunding: {
          beneficiaryAge: 0,
          monthsToCollege: 0,
          fundingProgress: 100
        }
      },
      portfolioPerformance: {
        ytdReturn: 6.2,
        benchmarkReturn: 7.0,
        outperformance: -0.8,
        rebalancingImpact: 0.3,
        bondDuration: 5.2,
        internationalAllocation: 18
      },
      nextActions: {
        beneficiaryReview: {
          lastReviewDate: '2024-02-15',
          urgency: 'low',
          pendingUpdates: 0
        },
        retirement401k: {
          currentContribution: 22000,
          maxContribution: 30000,
          employerMatch: 4000,
          potentialTaxSavings: 1760
        },
        insuranceReview: {
          lifeInsurance: 400000,
          disabilityInsurance: 80000,
          lastReviewDate: '2024-01-20',
          adequacyRating: 'adequate'
        },
        rothConversion: {
          opportunityAmount: 35000,
          taxImpact: 7700,
          recommendedTiming: 'Q4 2024'
        }
      }
    },
    
    referralData: {
      totalReferralsSent: 5,
      successfulReferrals: 3,
      conversionRate: 60,
      referralHistory: [
        {
          referredName: 'Thomas Mitchell',
          referredDate: '2023-10-20',
          status: 'client',
          becameClientDate: '2023-11-15',
          estimatedValue: 380000,
          notes: 'Neighbor planning for early retirement'
        },
        {
          referredName: 'Karen Daniels',
          referredDate: '2024-01-12',
          status: 'client',
          becameClientDate: '2024-02-08',
          estimatedValue: 460000,
          notes: 'Friend from church needing estate planning guidance'
        },
        {
          referredName: 'Brian Collins',
          referredDate: '2024-03-25',
          status: 'declined',
          estimatedValue: 320000,
          notes: 'Decided to work with their current bank advisor'
        },
        {
          referredName: 'Susan Walsh',
          referredDate: '2024-06-10',
          status: 'client',
          becameClientDate: '2024-07-01',
          estimatedValue: 550000,
          notes: 'Former colleague seeking comprehensive retirement planning'
        },
        {
          referredName: 'David Lee',
          referredDate: '2024-08-15',
          status: 'prospect',
          estimatedValue: 290000,
          notes: 'Community member interested in financial planning services'
        }
      ],
      referralValue: {
        totalPotentialAUM: 2000000,
        actualAUM: 1390000
      },
      isActiveReferrer: true
    },
    
    // Upcoming meetings
    upcomingMeetings: [
      {
        id: `james-patricia-meeting-friday`,
        clientId: 'client-james-patricia-smith', 
        clientName: 'James & Patricia Smith',
        date: new Date('2024-08-02T14:00:00').toISOString(),
        time: '14:00',
        duration: 45,
        type: 'Quarterly Review',
        status: 'confirmed',
        priority: 'medium',
        location: { type: 'virtual' },
        preparationStatus: 'in_progress',
        notes: 'Quarterly portfolio review and pre-retirement planning discussion',
        agenda: ['Portfolio Performance Review', 'Pre-retirement Planning', 'Healthcare Strategies', 'Long-term Care Discussion']
      }
    ]
  },

  {
    // ===== LISA ANDERSON (L5 FAIL - Missing Content Richness) =====
    // Layer failures: L5 fails (content), L3/L4 pass
    // Expected dots: ●●●●○ (green, green, green, green, RED)
    // L5 requires: relationshipHistory.length >= 2 OR householdAssets >= 100000
    // To fail: householdAssets < 100000 AND relationshipHistory.length < 2
    id: 'client-lisa-anderson',
    name: 'Lisa Anderson',
    birthDate: '1979-06-15',
    email: 'lisa.anderson@email.com',
    phone: '(555) 345-6789',
    category: 'high-touch',
    householdAssets: 50000, // L5 FAIL: Below $100K threshold
    lastMeeting: new Date('2024-07-15').toISOString(),
    nextMeeting: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days from now
    nextMeetingDetails: {
      time: '9:30 AM',
      duration: 75,
      type: 'Annual Review',
      location: {
        type: 'office',
        details: 'Conference Room B'
      },
      preparationStatus: 'in_progress'
    },
    riskTolerance: 'aggressive',
    investmentObjectives: ['Growth', 'Wealth Building', 'Tax Efficiency'],
    
    pinned: true,
    demographics: {
      ages: 'Lisa 45',
      occupations: 'Marketing Director',
      location: 'Manhattan, NY',
      relationship: 'Single'
    },
    children: [
      { name: 'Sophie', age: 16 },
      { name: 'Ryan', age: 14 }
    ],
    
    professionalNetwork: {
      accountant: {
        name: 'David Kim, CPA',
        firm: 'Kim Financial Services',
        phone: '(212) 555-0123',
        email: 'david@kimfinancial.com',
        specialties: ['Executive Compensation', 'Stock Options', 'High-Income Tax Strategy'],
        lastContact: '2024-07-10',
        yearsWorking: 4,
        collaborationFrequency: 'quarterly',
        referralSource: 'Professional network',
        keyAchievements: 'Optimized executive compensation package tax efficiency'
      },
      estateAttorney: {
        name: 'Sarah Martinez, Esq.',
        firm: 'Martinez Estate Law',
        phone: '(212) 555-0456',
        email: 'sarah@martinezlaw.com',
        specialties: ['High Net Worth Estate Planning', 'Trust Structures', 'Single Parent Planning'],
        lastContact: '2024-06-20',
        yearsWorking: 3,
        collaborationFrequency: 'annually',
        referralSource: 'Legal network',
        keyAchievements: 'Structured comprehensive estate plan with tax benefits'
      }
    },
    
    // L3 PASS: Keep 2+ context sources
    extendedHousehold: [
      {
        name: 'Sophie Anderson',
        relationship: 'daughter',
        birthDate: '2008-03-10',
        role: 'dependent',
        responsibilities: 'College preparation, trust beneficiary',
        emergencyContactPriority: 3
      },
      {
        name: 'Ryan Anderson',
        relationship: 'son',
        birthDate: '2010-07-22',
        role: 'dependent', 
        responsibilities: 'High school student, trust beneficiary',
        emergencyContactPriority: 4
      }
    ],
    
    preferredCommunication: {
      method: 'email',
      frequency: 'weekly',
      bestTimeToContact: 'Weekday mornings or weekends'
    },
    
    // L5 FAIL: Only 1 activity entry (need 2+ for L5 to pass via activities)
    relationshipHistory: [
      {
        date: new Date('2024-07-15').toISOString(),
        milestone: 'Strategic Planning Review',
        type: 'service_upgrade',
        description: 'Comprehensive strategic planning for high-growth portfolio',
        outcome: 'Implemented aggressive growth strategy with tax optimization'
      }
      // Only 1 entry - L5 needs 2+ OR $100K+ assets
    ],
    
    keyMetrics: {
      portfolioReturn: 11.8,
      yearToDateReturn: 11.8,
      benchmarkComparison: 3.2,
      feeReview: false,
      complianceItems: generateComplianceItems(2),
    },
    
    portfolioData: {
      totalValue: 2800000,
      ytdReturn: 11.8,
      benchmarkReturn: 8.6,
      allocation: {
        stocks: 65,
        bonds: 25,
        alternatives: 7,
        cash: 3,
      },
      topHoldings: [
        { symbol: 'TSLA', name: 'Tesla Inc.', percentage: 5.2, value: 145600 },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', percentage: 4.8, value: 134400 },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', percentage: 4.1, value: 114800 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', percentage: 3.9, value: 109200 },
        { symbol: 'QQQ', name: 'Invesco QQQ Trust', percentage: 3.5, value: 98000 },
      ],
    },
    
    complianceStatus: {
      rmdRequired: false,
      beneficiaryUpdated: new Date('2024-01-20').toISOString(),
      lastReview: new Date('2024-06-30').toISOString(),
      pendingItems: generateComplianceItems(2),
    },
    
    planningData: {
      retirementReadiness: 85,
      goalProgress: [
        { goal: 'Retirement Savings', target: 4000000, current: 2800000, onTrack: true },
        { goal: 'College Fund', target: 400000, current: 320000, onTrack: true },
        { goal: 'Emergency Fund', target: 150000, current: 140000, onTrack: true },
      ],
      insuranceNeeds: {
        life: true,
        disability: true,
        longTermCare: false,
      },
    },
    
    meetingHistory: [
      {
        id: 'meeting-la-1',
        date: new Date('2024-06-30').toISOString(),
        type: 'Bi-Annual Review',
        summary: 'Investment strategy consultation and portfolio rebalancing',
        followUpItems: ['Research ESG investment options', 'Review college savings plan'],
        nextMeetingDate: new Date('2024-08-01').toISOString(),
      },
    ],
    
    // Financial details
    financialDetails: {
      retirementPlanning: {
        currentSavings: 1850000,
        targetAmount: 4000000,
        monthlyContribution: 5000,
        projectedRetirementAge: 55,
        yearsToRetirement: 10
      },
      collegeSavings: {
        currentAmount: 320000,
        targetAmount: 400000,
        monthlyContribution: 2000,
        yearsRemaining: 2,
        beneficiaryName: 'Sophie Anderson'
      },
      emergencyFund: {
        currentAmount: 140000,
        targetAmount: 150000,
        monthlyExpenses: 25000,
        currentMonthsCovered: 5.6,
        targetMonths: 6
      },
      taxHarvesting: {
        potentialSavings: 25000,
        harvestableOpportunities: 12,
        estimatedTaxBracket: 0.37,
        yearToDateLosses: 18000
      },
      lastMeeting: {
        portfolioPerformance: {
          quarterlyReturn: 11.8,
          benchmarkReturn: 8.6,
          outperformance: 3.2
        },
        retirementTimeline: {
          currentAge: 45,
          targetRetirementAge: 55,
          confidenceLevel: 85
        },
        rothContribution: {
          currentYear: 0,
          maxContribution: 0,
          taxSavings: 0
        },
        collegeFunding: {
          beneficiaryAge: 16,
          monthsToCollege: 24,
          fundingProgress: 80
        }
      },
      portfolioPerformance: {
        ytdReturn: 11.8,
        benchmarkReturn: 8.6,
        outperformance: 3.2,
        rebalancingImpact: 1.2,
        bondDuration: 3.8,
        internationalAllocation: 32
      },
      nextActions: {
        beneficiaryReview: {
          lastReviewDate: '2024-01-20',
          urgency: 'low',
          pendingUpdates: 1
        },
        retirement401k: {
          currentContribution: 23000,
          maxContribution: 30000,
          employerMatch: 8000,
          potentialTaxSavings: 2590
        },
        insuranceReview: {
          lifeInsurance: 2000000,
          disabilityInsurance: 300000,
          lastReviewDate: '2024-06-20',
          adequacyRating: 'high'
        },
        rothConversion: {
          opportunityAmount: 0,
          taxImpact: 0,
          recommendedTiming: 'Not applicable - high income'
        }
      }
    },
    
    referralData: {
      totalReferralsSent: 7,
      successfulReferrals: 4,
      conversionRate: 57,
      referralHistory: [
        {
          referredName: 'Michelle Roberts',
          referredDate: '2023-09-10',
          status: 'client',
          becameClientDate: '2023-10-05',
          estimatedValue: 920000,
          notes: 'Fellow entrepreneur seeking sophisticated investment strategies'
        },
        {
          referredName: 'Jason Kumar',
          referredDate: '2024-01-18',
          status: 'client',
          becameClientDate: '2024-02-12',
          estimatedValue: 760000,
          notes: 'Tech executive interested in ESG investing and tax optimization'
        },
        {
          referredName: 'Emily Foster',
          referredDate: '2024-03-22',
          status: 'declined',
          estimatedValue: 540000,
          notes: 'Decided to continue with family advisor'
        },
        {
          referredName: 'Andrew Clarke',
          referredDate: '2024-05-15',
          status: 'prospect',
          estimatedValue: 650000,
          notes: 'Business partner considering comprehensive financial planning'
        },
        {
          referredName: 'Natalie Cooper',
          referredDate: '2024-06-28',
          status: 'client',
          becameClientDate: '2024-07-20',
          estimatedValue: 830000,
          notes: 'Professional network contact seeking college funding strategies'
        },
        {
          referredName: 'Greg Martinez',
          referredDate: '2024-07-10',
          status: 'client',
          becameClientDate: '2024-08-05',
          estimatedValue: 710000,
          notes: 'Family friend impressed with personalized service approach'
        },
        {
          referredName: 'Diana Scott',
          referredDate: '2024-08-20',
          status: 'prospect',
          estimatedValue: 480000,
          notes: 'Referred by Michelle Roberts, interested in sustainable investing'
        }
      ],
      referralValue: {
        totalPotentialAUM: 4890000,
        actualAUM: 3220000
      },
      isActiveReferrer: true
    },
    
    // Upcoming meetings
    upcomingMeetings: [
      {
        id: `lisa-meeting-thursday`,
        clientId: 'client-lisa-anderson',
        clientName: 'Lisa Anderson',
        date: new Date('2024-08-01T09:30:00').toISOString(),
        time: '09:30',
        duration: 75,
        type: 'Client Planning',
        status: 'confirmed',
        priority: 'high',
        location: { type: 'office', details: 'Conference Room B' },
        preparationStatus: 'in_progress',
        notes: 'Strategic investment planning and tax optimization review',
        agenda: ['Portfolio Performance Analysis', 'Tax Optimization Strategies', 'ESG Investment Options', 'College Funding Review']
      }
    ]
  },

  {
    // ===== DAVID & CAROL WILLIAMS (L3 + L5 FAIL - Missing Context AND Content) =====
    // Layer failures: L3 fails (context), L5 fails (content), L4 passes
    // Expected dots: ●●○●○ (green, green, RED, green, RED)
    // L3 requires 2+ context sources, L5 requires activities >= 2 OR assets >= $100K
    id: 'client-david-carol-williams',
    name: 'David & Carol Williams',
    birthDate: '1962-11-08',
    email: 'david.williams@email.com',
    phone: '(555) 789-0123',
    category: 'enhanced',
    householdAssets: 50000, // L5 FAIL: Below $100K threshold
    lastMeeting: new Date('2024-07-22').toISOString(),
    nextMeeting: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    nextMeetingDetails: {
      time: '10:30 AM',
      duration: 90,
      type: 'Annual Review',
      location: {
        type: 'office',
        details: 'Conference Room A'
      },
      preparationStatus: 'in_progress'
    },
    riskTolerance: 'moderate',
    investmentObjectives: ['Income', 'Growth', 'Legacy Planning'],
    
    pinned: true,
    demographics: {
      ages: 'David 62, Carol 60',
      occupations: 'Retired Educators',
      location: 'Greenwich, CT',
      relationship: 'Married couple'
    },
    children: [
      { name: 'Alexandra', age: 35 },
      { name: 'Jonathan', age: 32 }
    ],
    
    professionalNetwork: {
      accountant: {
        name: 'Jennifer Martinez',
        firm: 'Martinez Tax Services',
        email: 'jennifer@martineztax.com',
        phone: '(555) 890-1234',
        specialties: ['Pre-retirement Tax Planning', 'IRA Strategies', 'Social Security Optimization'],
        yearsWorking: 6,
        lastContact: '2024-01-08',
        collaborationFrequency: 'quarterly',
        referralSource: 'Long-term client relationship',
        keyAchievements: 'Optimized pre-retirement tax strategies saving $25K annually'
      },
      estateAttorney: {
        name: 'Robert Anderson',
        firm: 'Anderson Estate Planning',
        email: 'robert@andersonestate.com',
        phone: '(555) 901-2345',
        specialties: ['Retirement Estate Planning', 'Trust Administration', 'Elder Law'],
        yearsWorking: 5,
        lastContact: '2023-10-15',
        collaborationFrequency: 'annual',
        referralSource: 'Professional network',
        keyAchievements: 'Created flexible retirement estate plan with tax benefits'
      }
    },
    
    // L3 FAIL: Remove context sources (need <2 of 4)
    extendedHousehold: [], // Empty - removed household members
    relationshipHistory: [], // Empty - removed activities (also helps L5 fail)
    meetingHistory: [], // Empty - removed meeting history
    
    preferredCommunication: {
      method: 'phone',
      frequency: 'monthly',
      bestTimeToContact: 'Mornings 9 AM - 12 PM'
    },
    
    // L3 FAIL: No compliance items
    keyMetrics: {
      portfolioReturn: 9.2,
      yearToDateReturn: 9.2,
      benchmarkComparison: 2.1,
      feeReview: true,
      complianceItems: [], // Empty to help fail L3
    },
    
    // L4 PASS: Keep topHoldings populated
    portfolioData: {
      totalValue: 50000,
      ytdReturn: 9.2,
      benchmarkReturn: 7.1,
      allocation: {
        stocks: 60,
        bonds: 30,
        alternatives: 8,
        cash: 2,
      },
      topHoldings: [
        { symbol: 'SCHB', name: 'Schwab US Broad Market', percentage: 30.0, value: 15000 },
        { symbol: 'SCHZ', name: 'Schwab US Aggregate Bond', percentage: 25.0, value: 12500 },
      ],
    },
    
    complianceStatus: {
      rmdRequired: false,
      beneficiaryUpdated: new Date('2024-02-15').toISOString(),
      lastReview: new Date('2024-07-15').toISOString(),
      pendingItems: generateComplianceItems(1),
    },
    
    planningData: {
      retirementReadiness: 95,
      goalProgress: [
        { goal: 'Retirement Income', target: 6000000, current: 4800000, onTrack: true },
        { goal: 'Estate Planning', target: 1000000, current: 800000, onTrack: true },
        { goal: 'Travel Fund', target: 100000, current: 95000, onTrack: true },
      ],
      insuranceNeeds: {
        life: true,
        disability: false,
        longTermCare: true,
      },
    },
    
    // meetingHistory removed to help fail L3
    
    // Financial details
    financialDetails: {
      retirementPlanning: {
        currentSavings: 3800000,
        targetAmount: 6000000,
        monthlyContribution: 1500, // Reduced in retirement
        projectedRetirementAge: 62,
        yearsToRetirement: 0 // Already retired
      },
      collegeSavings: {
        currentAmount: 0, // Children grown
        targetAmount: 0,
        monthlyContribution: 0,
        yearsRemaining: 0,
        beneficiaryName: 'N/A'
      },
      emergencyFund: {
        currentAmount: 120000,
        targetAmount: 120000,
        monthlyExpenses: 20000,
        currentMonthsCovered: 6.0,
        targetMonths: 6
      },
      taxHarvesting: {
        potentialSavings: 15000,
        harvestableOpportunities: 8,
        estimatedTaxBracket: 0.24,
        yearToDateLosses: 10000
      },
      lastMeeting: {
        portfolioPerformance: {
          quarterlyReturn: 9.2,
          benchmarkReturn: 7.1,
          outperformance: 2.1
        },
        retirementTimeline: {
          currentAge: 62,
          targetRetirementAge: 62,
          confidenceLevel: 95
        },
        rothContribution: {
          currentYear: 8000,
          maxContribution: 8000,
          taxSavings: 1920
        },
        collegeFunding: {
          beneficiaryAge: 0,
          monthsToCollege: 0,
          fundingProgress: 100
        }
      },
      portfolioPerformance: {
        ytdReturn: 9.2,
        benchmarkReturn: 7.1,
        outperformance: 2.1,
        rebalancingImpact: 1.1,
        bondDuration: 4.8,
        internationalAllocation: 25
      },
      nextActions: {
        beneficiaryReview: {
          lastReviewDate: '2024-02-15',
          urgency: 'low',
          pendingUpdates: 0
        },
        retirement401k: {
          currentContribution: 0, // Retired
          maxContribution: 0,
          employerMatch: 0,
          potentialTaxSavings: 0
        },
        insuranceReview: {
          lifeInsurance: 1000000,
          disabilityInsurance: 0, // Retired
          lastReviewDate: '2024-07-15',
          adequacyRating: 'high'
        },
        rothConversion: {
          opportunityAmount: 200000,
          taxImpact: 48000,
          recommendedTiming: 'Q4 2024'
        }
      }
    },
    
    referralData: {
      totalReferralsSent: 4,
      successfulReferrals: 2,
      conversionRate: 50,
      referralHistory: [
        {
          referredName: 'Nancy Wilson',
          referredDate: '2023-12-05',
          status: 'client',
          becameClientDate: '2024-01-10',
          estimatedValue: 1200000,
          notes: 'Fellow retiree from country club seeking income planning'
        },
        {
          referredName: 'Harold Peterson',
          referredDate: '2024-02-20',
          status: 'declined',
          estimatedValue: 850000,
          notes: 'Decided to stay with existing advisor'
        },
        {
          referredName: 'Barbara Jenkins',
          referredDate: '2024-04-12',
          status: 'client',
          becameClientDate: '2024-05-08',
          estimatedValue: 950000,
          notes: 'Widow needing comprehensive estate and income planning'
        },
        {
          referredName: 'Robert Hayes',
          referredDate: '2024-07-25',
          status: 'prospect',
          estimatedValue: 780000,
          notes: 'Considering retirement income optimization strategies'
        }
      ],
      referralValue: {
        totalPotentialAUM: 3780000,
        actualAUM: 2150000
      },
      isActiveReferrer: true
    },
    
    // Upcoming meetings  
    upcomingMeetings: [
      {
        id: `williams-meeting-tuesday`,
        clientId: 'client-david-carol-williams',
        clientName: 'David & Carol Williams',
        date: new Date('2024-07-29T10:30:00').toISOString(),
        time: '10:30',
        duration: 90,
        type: 'Client Planning',
        status: 'confirmed',
        priority: 'medium',
        location: { type: 'office', details: 'Conference Room A' },
        preparationStatus: 'in_progress',
        notes: 'Pre-retirement income planning and estate strategy finalization',
        agenda: ['Retirement Income Strategy', 'Estate Planning Updates', 'Tax Optimization', 'Legacy Planning Discussion']
      }
    ]
  },
  {
    // ===== DAVID & PRIYA KAPOOR =====
    id: 'client-david-priya-kapoor',
    name: 'David & Priya Kapoor',
    birthDate: '1983-09-15', // David's DOB
    email: 'david.kapoor@email.com',
    phone: '(555) 892-4567',
    category: 'enhanced',
    householdAssets: 4200000,
    lastMeeting: new Date('2025-02-15').toISOString(),
    riskTolerance: 'moderate',
    investmentObjectives: ['Growth', 'College Funding', 'Tech Diversification', 'Family Security'],
    
    pinned: false,
    demographics: {
      ages: 'David 42, Priya 40',
      occupations: 'VP Sales & Pediatrician',
      location: 'Westchester, NY',
      relationship: 'Married with Children'
    },
    children: [
      { name: 'Anika Kapoor', age: 12 },
      { name: 'Raj Kapoor', age: 9 }
    ],
    
    // Rich CRM Data
    professionalNetwork: {
      accountant: {
        name: 'Michael Patel, CPA',
        firm: 'Patel & Associates',
        phone: '(914) 555-3421',
        email: 'mpatel@patelcpa.com',
        specialties: ['High-Income Tax Planning', 'Tech Stock Strategies', 'Estate Planning'],
        lastContact: '2024-12-10',
        yearsWorking: 7,
        collaborationFrequency: 'quarterly',
        referralSource: 'Professional network referral'
      },
      estateAttorney: {
        name: 'Sarah Chen, Esq.',
        firm: 'Chen Estate Planning',
        phone: '(914) 555-7892',
        email: 'schen@chenestate.com',
        specialties: ['Family Trusts', 'Estate Tax Planning', 'Succession Planning'],
        lastContact: '2024-11-20',
        yearsWorking: 3,
        collaborationFrequency: 'bi-annually',
        referralSource: 'Client referral'
      },
      insuranceAgent: {
        name: 'Robert Martinez',
        firm: 'Martinez Insurance Group',
        phone: '(914) 555-5634',
        email: 'rmartinez@miginsurance.com',
        coverageTypes: ['Life Insurance', 'Disability Coverage', 'Executive Benefits'],
        lastContact: '2024-10-15',
        yearsWorking: 4,
        collaborationFrequency: 'annually',
        referralSource: 'Professional referral'
      }
    },
    
    extendedHousehold: [
      {
        name: 'Priya Kapoor',
        relationship: 'spouse',
        role: 'spouse',
        birthDate: '1985-01-20'
      },
      {
        name: 'Anika Kapoor', 
        relationship: 'daughter',
        role: 'child',
        birthDate: '2012-03-08'
      },
      {
        name: 'Raj Kapoor',
        relationship: 'son', 
        role: 'child',
        birthDate: '2015-07-22'
      },
      {
        name: 'Rajesh Sharma',
        relationship: "father-in-law (Priya's father)",
        role: 'dependent',
        birthDate: '1955-04-12'
      }
    ],

    financialDetails: {
      retirementPlanning: {
        currentSavings: 1990000, // Combined 401(k)s: $1.1M + $890K
        targetAmount: 6000000,
        monthlyContribution: 6500, // Combined contributions
        projectedRetirementAge: 62,
        yearsToRetirement: 20
      },
      collegeSavings: {
        currentAmount: 280000, // $160K Anika + $120K Raj
        targetAmount: 560000, // $280K per child for college costs
        monthlyContribution: 2500, // Maxed contributions
        yearsRemaining: 6, // Anika to college
        beneficiaryName: 'Anika & Raj Kapoor'
      },
      emergencyFund: {
        currentAmount: 210000,
        targetAmount: 240000, // 6 months of expenses
        monthlyExpenses: 40000,
        currentMonthsCovered: 5.3,
        targetMonths: 6
      },
      taxHarvesting: {
        potentialSavings: 18500,
        harvestableOpportunities: 12,
        estimatedTaxBracket: 35, // High income bracket
        yearToDateLosses: 0
      },
      lastMeeting: {
        portfolioPerformance: {
          quarterlyReturn: 8.2,
          benchmarkReturn: 6.8,
          outperformance: 1.4
        },
        retirementTimeline: {
          currentAge: 42, // David's age
          targetRetirementAge: 62,
          confidenceLevel: 78
        },
        rothContribution: {
          currentYear: 14000, // Both maxed out
          maxContribution: 14000,
          taxSavings: 4900
        },
        collegeFunding: {
          beneficiaryAge: 12, // Anika (older child)
          monthsToCollege: 72, // 6 years to college
          fundingProgress: 50 // 50% of target reached
        }
      },
      portfolioPerformance: {
        ytdReturn: 15.8, // Strong tech performance
        benchmarkReturn: 12.2,
        outperformance: 3.6,
        rebalancingImpact: 0.7,
        bondDuration: 3.8,
        internationalAllocation: 15
      },
      nextActions: {
        beneficiaryReview: {
          lastReviewDate: '2024-08-15',
          urgency: 'medium' as const,
          pendingUpdates: 2
        },
        retirement401k: {
          currentContribution: 46000, // Both maxing out
          maxContribution: 46000, // $23K each
          employerMatch: 23000, // Estimated combined match
          potentialTaxSavings: 0 // Already maxed
        },
        insuranceReview: {
          lifeInsurance: 2000000,
          disabilityInsurance: 800000,
          lastReviewDate: '2024-10-15',
          adequacyRating: 'adequate' as const
        },
        rothConversion: {
          opportunityAmount: 75000,
          taxImpact: 26250,
          recommendedTiming: 'Q2 2025'
        }
      }
    },

    referralData: {
      totalReferralsSent: 5,
      successfulReferrals: 4,
      conversionRate: 80,
      referralHistory: [
        {
          referredName: 'Michael Chen',
          referredDate: '2023-12-15',
          status: 'client',
          becameClientDate: '2024-01-20',
          estimatedValue: 850000,
          notes: 'Fellow tech professional interested in stock option planning'
        },
        {
          referredName: 'Jennifer Walsh',
          referredDate: '2024-02-10',
          status: 'client',
          becameClientDate: '2024-03-05',
          estimatedValue: 620000,
          notes: 'Neighbor seeking college funding optimization strategies'
        },
        {
          referredName: 'Robert Kim',
          referredDate: '2024-04-22',
          status: 'prospect',
          estimatedValue: 540000,
          notes: 'Friend from cultural association, still considering options'
        },
        {
          referredName: 'Sarah Patel',
          referredDate: '2024-06-08',
          status: 'client',
          becameClientDate: '2024-07-01',
          estimatedValue: 730000,
          notes: 'Professional network contact impressed with tax efficiency results'
        },
        {
          referredName: 'Alex Rodriguez',
          referredDate: '2024-07-30',
          status: 'client',
          becameClientDate: '2024-08-15',
          estimatedValue: 680000,
          notes: 'Work colleague seeking comprehensive financial planning'
        }
      ],
      referralValue: {
        totalPotentialAUM: 3420000,
        actualAUM: 2880000
      },
      isActiveReferrer: true
    },

    // Upcoming meetings
    upcomingMeetings: [
      {
        id: `kapoor-meeting-march`,
        clientId: 'client-david-priya-kapoor',
        clientName: 'David & Priya Kapoor',
        date: new Date('2025-03-15T14:00:00').toISOString(),
        time: '14:00',
        duration: 90,
        type: 'Annual Review',
        status: 'confirmed',
        priority: 'high',
        location: { type: 'office', details: 'Conference Room B' },
        preparationStatus: 'needs_attention',
        notes: 'Tech diversification strategy, college funding optimization, and father-in-law care planning',
        agenda: ['Tech Stock Diversification', 'College Funding Review', 'Estate Planning Updates', 'Tax Optimization Strategy']
      }
    ],

    advisorInsights: {
      keyInsights: [
        {
          title: 'College Funding Confidence',
          content: 'Your 529 plans are on pace to cover 75% of tuition for both kids, reducing future stress.',
          category: 'funding'
        },
        {
          title: 'Risk Management',
          content: 'Reallocating $200K from tech lowered concentration from 75% to 60% — reducing risk exposure while maintaining growth.',
          category: 'risk'
        },
        {
          title: 'Real Estate Strategy',
          content: 'Holding the Cape Cod mortgage makes sense today; elevated rates don\'t justify refinancing. But your income provides flexibility for early principal paydown later.',
          category: 'strategy'
        },
        {
          title: 'Family Health Planning',
          content: 'We\'ve earmarked $50K of your annual cash flow for potential family healthcare support, ensuring you can help without sacrificing your long-term plan.',
          category: 'planning'
        }
      ],
      advisorQuestions: [
        {
          question: 'Projected college shortfall if both kids attend private schools at $70K/yr?',
          answer: '$375K need vs. $280K funded → $95K gap.',
          category: 'projection'
        },
        {
          question: 'Performance attribution of brokerage portfolio?',
          answer: 'Nvidia contributed +3.5% YTD, MSFT +1.2%, others flat; without Nvidia, YTD return would be 2.5% lower.',
          category: 'performance'
        },
        {
          question: 'If tech corrected 25%, how much drop in brokerage?',
          answer: '$840K exposure → $210K loss, reducing brokerage from $1.4M to $1.19M.',
          category: 'risk'
        },
        {
          question: 'Liquidity available for 2 years of mortgage payments?',
          answer: 'Mortgage $40,200/yr → $80,400 for 2 years; current cash $210K > sufficient.',
          category: 'liquidity'
        },
        {
          question: 'After-tax free cash flow after contributions?',
          answer: '$590K combined gross → ~$380K net → ~$220K discretionary after 401k, 529, mortgage.',
          category: 'liquidity'
        },
        {
          question: 'Tax savings from max 401(k) + HSA?',
          answer: '$55K sheltered pre-tax → ~$17K in tax savings.',
          category: 'tax'
        }
      ]
    },
    
    keyMetrics: {
      portfolioReturn: 15.8,
      yearToDateReturn: 15.8,
      benchmarkComparison: 3.6,
      feeReview: false,
      complianceItems: generateComplianceItems(2),
    }
  },
  {
    // ===== JOHN & MARY THOMPSON =====
    id: 'client-john-mary-thompson',
    name: 'John & Mary Thompson',
    birthDate: '1957-03-12',
    email: 'john.thompson@email.com',
    phone: '(555) 892-1347',
    category: 'enhanced',
    householdAssets: 2100000,
    lastMeeting: new Date('2025-03-15').toISOString(),
    riskTolerance: 'conservative',
    investmentObjectives: ['Retirement Income', 'Healthcare Planning', 'Family Legacy'],
    
    extendedHousehold: [
      {
        name: 'Mary Thompson',
        relationship: 'spouse',
        role: 'spouse',
        birthDate: '1959-07-24'
      },
      {
        name: 'Lisa Thompson',
        relationship: 'daughter',
        role: 'child',
        birthDate: '1987-04-15'
      },
      {
        name: 'Michael Thompson', 
        relationship: 'son',
        role: 'child',
        birthDate: '1990-08-22'
      }
    ],

    professionalNetwork: {
      taxProfessional: {
        name: 'Robert Chen, CPA',
        firm: 'Florida Tax Professionals',
        email: 'rchen@floridatax.com',
        phone: '(555) 831-2456',
        specialties: ['Retirement Planning', 'RMD Management', 'Tax Optimization'],
        yearsWorking: 8,
        lastContact: '2025-02-15',
        collaborationFrequency: 'quarterly'
      },
      estateAttorney: {
        name: 'Jennifer Walsh, Esq.',
        firm: 'Walsh & Associates Law',
        email: 'jwalsh@walshlaw.com',
        phone: '(555) 742-9183',
        specialties: ['Estate Planning', 'Trust Management', 'Elder Law'],
        yearsWorking: 12,
        lastContact: '2024-11-20',
        collaborationFrequency: 'as-needed'
      },
      accountant: {
        name: 'Robert Chen, CPA',
        firm: 'Florida Tax Professionals',
        email: 'rchen@floridatax.com',
        phone: '(555) 831-2456',
        specialties: ['Tax Preparation', 'Retirement Tax Planning'],
        yearsWorking: 8,
        lastContact: '2025-02-15',
        collaborationFrequency: 'quarterly'
      }
    },

    financialDetails: {
      retirementPlanning: {
        currentSavings: 1775000, // John IRA + Mary IRA
        targetAmount: 2100000,
        monthlyContribution: 0, // Post-retirement, taking distributions
        projectedRetirementAge: 65, // Already retired
        yearsToRetirement: 0
      },
      collegeSavings: {
        currentAmount: 0,
        targetAmount: 0,
        monthlyContribution: 0,
        yearsRemaining: 0,
        beneficiaryName: ''
      },
      emergencyFund: {
        currentAmount: 125000, // $75K inheritance + $50K cash
        targetAmount: 100000,
        monthlyExpenses: 16000, // $80K annually / 5 months
        currentMonthsCovered: 7.8,
        targetMonths: 6
      },
      taxHarvesting: {
        potentialSavings: 2800,
        harvestableOpportunities: 4,
        estimatedTaxBracket: 22,
        yearToDateLosses: 800
      },
      lastMeeting: {
        portfolioPerformance: {
          quarterlyReturn: 3.2,
          benchmarkReturn: 3.8,
          outperformance: -0.6
        },
        retirementTimeline: {
          currentAge: 68,
          targetRetirementAge: 65,
          confidenceLevel: 95 // High confidence, already retired
        },
        rothContribution: {
          currentYear: 0, // No Roth contributions in retirement
          maxContribution: 8000, // Age 50+ catch-up if eligible
          taxSavings: 0
        },
        collegeFunding: {
          beneficiaryAge: 37, // Lisa's age
          monthsToCollege: 0, // Grandchild planning
          fundingProgress: 0
        }
      },
      portfolioPerformance: {
        ytdReturn: 4.2,
        benchmarkReturn: 5.0,
        outperformance: -0.8, // Conservative allocation underperforming in bull market
        rebalancingImpact: 0.1,
        bondDuration: 6.2,
        internationalAllocation: 10 // Conservative, minimal international
      },
      nextActions: {
        beneficiaryReview: {
          lastReviewDate: '2024-08-15',
          urgency: 'low' as const,
          pendingUpdates: 0
        },
        retirement401k: {
          currentContribution: 0, // Retired, no longer contributing
          maxContribution: 0,
          employerMatch: 0,
          potentialTaxSavings: 0
        },
        insuranceReview: {
          lifeInsurance: 500000, // Reduced in retirement
          disabilityInsurance: 0, // Not needed in retirement
          lastReviewDate: '2024-11-20',
          adequacyRating: 'adequate' as const
        },
        rothConversion: {
          opportunityAmount: 15000, // Limited in retirement
          taxImpact: 3300,
          recommendedTiming: 'Q1 2026'
        }
      }
    },
    upcomingMeetings: [], // Will be populated separately
    
    keyMetrics: {
      portfolioReturn: 4.2,
      yearToDateReturn: 4.2,
      benchmarkComparison: -0.8,
      feeReview: false,
      complianceItems: generateComplianceItems(1),
    },
    
    // ADVISOR INSIGHTS - Key insights about the Thompson family
    advisorInsights: {
      keyInsights: [
        {
          title: 'RMD Compliance On Track',
          content: 'You\'re pacing RMDs correctly, $22K already withdrawn. No penalties, steady income flow — your retirement income is on track.',
          category: 'planning'
        },
        {
          title: 'Healthcare Fund Secured',
          content: 'Mary\'s inheritance has been secured as a dedicated healthcare fund. Rising Medicare premiums and Sarasota\'s above-average LTC costs are covered, giving you stability no matter what health surprises come.',
          category: 'risk'
        },
        {
          title: 'Supporting Family & Celebrating Legacy',
          content: 'With $10K gifted to each child last year, your financial planning is already supporting your family. With Lisa\'s first child on the way and your 40th anniversary approaching, your wealth is enabling both legacy and joy.',
          category: 'strategy'
        }
      ],
      // CLIENT-SPECIFIC Q&A SYSTEM
      advisorQuestions: [
        {
          question: 'Show their RMD compliance history 3 years back.',
          answer: '2023: $39K required, $39K taken. 2024: $41K required, $42K taken. 2025 YTD: $22K of $42K taken.',
          category: 'risk'
        },
        {
          question: 'What % of portfolio income is bond coupons vs. dividends?',
          answer: '~72% coupons ($44K), 28% dividends ($17K).',
          category: 'performance'
        },
        {
          question: 'If John required assisted living for 18 months, how much coverage exists?',
          answer: '$95K liquid cash → covers ~18 months at Sarasota\'s $5,100/mo avg.',
          category: 'liquidity'
        },
        {
          question: 'How have dividend stocks done vs. S&P?',
          answer: 'Dividend Aristocrats ETF +2% vs. S&P +5% YTD.',
          category: 'performance'
        },
        {
          question: 'Cumulative gifting past 5 years and estate impact?',
          answer: '$120K total gifts, reduced taxable estate by same. At $2.1M net worth, estate tax not an issue.',
          category: 'tax'
        },
        {
          question: 'What is their current portfolio allocation strategy?',
          answer: '60% bonds (Treasuries 3.8% yield, IG Corporates 4.2%), 40% equities (S&P 500 Index 60%, Dividend Aristocrats ETF 40%). Conservative shift completed for retirement stability.',
          category: 'risk'
        }
      ]
    },
      
    referralData: {
      totalReferralsSent: 3,
      successfulReferrals: 2,
      conversionRate: 67,
      referralHistory: [
        {
          referredName: 'Eleanor Watson',
          referredDate: '2023-11-28',
          status: 'client',
          becameClientDate: '2023-12-20',
          estimatedValue: 1100000,
          notes: 'Fellow retiree from community center needing income planning'
        },
        {
          referredName: 'Frank Mitchell',
          referredDate: '2024-03-15',
          status: 'declined',
          estimatedValue: 900000,
          notes: 'Decided to manage investments independently'
        },
        {
          referredName: 'Dorothy Edwards',
          referredDate: '2024-06-20',
          status: 'client',
          becameClientDate: '2024-07-15',
          estimatedValue: 850000,
          notes: 'Widow from church group seeking comprehensive estate planning'
        }
      ],
      referralValue: {
        totalPotentialAUM: 2850000,
        actualAUM: 1950000
      },
      isActiveReferrer: true
    }
  },
  // ===== ADDITIONAL CLIENTS WITHOUT SCHEDULED MEETINGS =====
  // These clients appear in the "No Meetings" calendar view
  {
    id: 'client-anthony-richardson',
    name: 'Anthony Richardson',
    birthDate: '1978-03-22',
    email: 'anthony.richardson@email.com',
    phone: '(555) 234-8901',
    category: 'standard',
    householdAssets: 520000,
    lastMeeting: new Date('2024-08-15').toISOString(),
    riskTolerance: 'moderate',
    investmentObjectives: ['Growth', 'Retirement Planning'],
    financialDetails: {
      retirementPlanning: {
        currentSavings: 285000,
        targetAmount: 1500000,
        monthlyContribution: 2200,
        projectedRetirementAge: 65,
        yearsToRetirement: 19
      },
      collegeSavings: { currentAmount: 0, targetAmount: 0, monthlyContribution: 0, yearsRemaining: 0, beneficiaryName: '' },
      emergencyFund: { currentAmount: 35000, targetAmount: 42000, monthlyExpenses: 7000, currentMonthsCovered: 5, targetMonths: 6 },
      taxHarvesting: { potentialSavings: 3200, harvestableOpportunities: 6, estimatedTaxBracket: 24, yearToDateLosses: 0 },
      lastMeeting: { portfolioPerformance: { quarterlyReturn: 5.1, benchmarkReturn: 4.8, outperformance: 0.3 }, retirementTimeline: { currentAge: 46, targetRetirementAge: 65, confidenceLevel: 78 }, rothContribution: { currentYear: 7000, maxContribution: 7000, taxSavings: 1680 }, collegeFunding: { beneficiaryAge: 0, monthsToCollege: 0, fundingProgress: 0 } },
      portfolioPerformance: { ytdReturn: 11.5, benchmarkReturn: 10.2, outperformance: 1.3, rebalancingImpact: 0.3, bondDuration: 4.0, internationalAllocation: 22 },
      nextActions: { beneficiaryReview: { lastReviewDate: '2024-06-10', urgency: 'low' as const, pendingUpdates: 0 }, retirement401k: { currentContribution: 15000, maxContribution: 23000, employerMatch: 7500, potentialTaxSavings: 1920 }, insuranceReview: { lifeInsurance: 400000, disabilityInsurance: 180000, lastReviewDate: '2024-03-15', adequacyRating: 'adequate' as const }, rothConversion: { opportunityAmount: 25000, taxImpact: 6000, recommendedTiming: 'Q1 2025' } }
    },
    upcomingMeetings: [],
    keyMetrics: { portfolioReturn: 11.5, yearToDateReturn: 11.5, benchmarkComparison: 1.3, feeReview: false, complianceItems: generateComplianceItems(1) }
  },
  {
    id: 'client-jennifer-wu',
    name: 'Jennifer Wu',
    birthDate: '1985-11-08',
    email: 'jennifer.wu@email.com',
    phone: '(555) 345-9012',
    category: 'enhanced',
    householdAssets: 890000,
    lastMeeting: new Date('2024-09-02').toISOString(),
    riskTolerance: 'moderate',
    investmentObjectives: ['Growth', 'Tax Efficiency', 'Real Estate'],
    financialDetails: {
      retirementPlanning: { currentSavings: 425000, targetAmount: 2200000, monthlyContribution: 3500, projectedRetirementAge: 60, yearsToRetirement: 21 },
      collegeSavings: { currentAmount: 95000, targetAmount: 200000, monthlyContribution: 1500, yearsRemaining: 10, beneficiaryName: 'Emma Wu' },
      emergencyFund: { currentAmount: 55000, targetAmount: 60000, monthlyExpenses: 10000, currentMonthsCovered: 5.5, targetMonths: 6 },
      taxHarvesting: { potentialSavings: 6800, harvestableOpportunities: 9, estimatedTaxBracket: 32, yearToDateLosses: 2100 },
      lastMeeting: { portfolioPerformance: { quarterlyReturn: 6.8, benchmarkReturn: 5.9, outperformance: 0.9 }, retirementTimeline: { currentAge: 39, targetRetirementAge: 60, confidenceLevel: 82 }, rothContribution: { currentYear: 6500, maxContribution: 7000, taxSavings: 2080 }, collegeFunding: { beneficiaryAge: 8, monthsToCollege: 120, fundingProgress: 47.5 } },
      portfolioPerformance: { ytdReturn: 14.2, benchmarkReturn: 12.8, outperformance: 1.4, rebalancingImpact: 0.4, bondDuration: 3.5, internationalAllocation: 28 },
      nextActions: { beneficiaryReview: { lastReviewDate: '2024-07-20', urgency: 'low' as const, pendingUpdates: 1 }, retirement401k: { currentContribution: 20500, maxContribution: 23000, employerMatch: 10250, potentialTaxSavings: 800 }, insuranceReview: { lifeInsurance: 600000, disabilityInsurance: 280000, lastReviewDate: '2024-04-10', adequacyRating: 'adequate' as const }, rothConversion: { opportunityAmount: 40000, taxImpact: 12800, recommendedTiming: 'Q4 2024' } }
    },
    upcomingMeetings: [],
    keyMetrics: { portfolioReturn: 14.2, yearToDateReturn: 14.2, benchmarkComparison: 1.4, feeReview: false, complianceItems: generateComplianceItems(2) }
  },
  {
    id: 'client-marcus-freeman',
    name: 'Marcus Freeman',
    birthDate: '1970-06-30',
    email: 'marcus.freeman@email.com',
    phone: '(555) 456-0123',
    category: 'high-touch',
    householdAssets: 2100000,
    lastMeeting: new Date('2024-07-28').toISOString(),
    riskTolerance: 'moderate',
    investmentObjectives: ['Retirement Planning', 'Estate Planning', 'Income Generation'],
    financialDetails: {
      retirementPlanning: { currentSavings: 1450000, targetAmount: 2800000, monthlyContribution: 5000, projectedRetirementAge: 62, yearsToRetirement: 8 },
      collegeSavings: { currentAmount: 0, targetAmount: 0, monthlyContribution: 0, yearsRemaining: 0, beneficiaryName: '' },
      emergencyFund: { currentAmount: 120000, targetAmount: 120000, monthlyExpenses: 20000, currentMonthsCovered: 6, targetMonths: 6 },
      taxHarvesting: { potentialSavings: 18500, harvestableOpportunities: 15, estimatedTaxBracket: 35, yearToDateLosses: 8200 },
      lastMeeting: { portfolioPerformance: { quarterlyReturn: 5.2, benchmarkReturn: 4.8, outperformance: 0.4 }, retirementTimeline: { currentAge: 54, targetRetirementAge: 62, confidenceLevel: 88 }, rothContribution: { currentYear: 8000, maxContribution: 8000, taxSavings: 2800 }, collegeFunding: { beneficiaryAge: 0, monthsToCollege: 0, fundingProgress: 0 } },
      portfolioPerformance: { ytdReturn: 12.1, benchmarkReturn: 11.2, outperformance: 0.9, rebalancingImpact: 0.3, bondDuration: 4.8, internationalAllocation: 20 },
      nextActions: { beneficiaryReview: { lastReviewDate: '2024-05-15', urgency: 'medium' as const, pendingUpdates: 3 }, retirement401k: { currentContribution: 30000, maxContribution: 30000, employerMatch: 0, potentialTaxSavings: 0 }, insuranceReview: { lifeInsurance: 1500000, disabilityInsurance: 600000, lastReviewDate: '2024-02-20', adequacyRating: 'high' as const }, rothConversion: { opportunityAmount: 150000, taxImpact: 52500, recommendedTiming: 'Q2 2025' } }
    },
    upcomingMeetings: [],
    keyMetrics: { portfolioReturn: 12.1, yearToDateReturn: 12.1, benchmarkComparison: 0.9, feeReview: true, complianceItems: generateComplianceItems(3) }
  },
  {
    id: 'client-stephanie-nguyen',
    name: 'Stephanie Nguyen',
    birthDate: '1982-09-15',
    email: 'stephanie.nguyen@email.com',
    phone: '(555) 567-1234',
    category: 'standard',
    householdAssets: 380000,
    lastMeeting: new Date('2024-10-05').toISOString(),
    riskTolerance: 'moderate',
    investmentObjectives: ['Home Purchase', 'Growth', 'Emergency Fund'],
    financialDetails: {
      retirementPlanning: { currentSavings: 145000, targetAmount: 1400000, monthlyContribution: 1800, projectedRetirementAge: 65, yearsToRetirement: 23 },
      collegeSavings: { currentAmount: 0, targetAmount: 0, monthlyContribution: 0, yearsRemaining: 0, beneficiaryName: '' },
      emergencyFund: { currentAmount: 28000, targetAmount: 36000, monthlyExpenses: 6000, currentMonthsCovered: 4.7, targetMonths: 6 },
      taxHarvesting: { potentialSavings: 1800, harvestableOpportunities: 4, estimatedTaxBracket: 22, yearToDateLosses: 0 },
      lastMeeting: { portfolioPerformance: { quarterlyReturn: 4.5, benchmarkReturn: 4.2, outperformance: 0.3 }, retirementTimeline: { currentAge: 42, targetRetirementAge: 65, confidenceLevel: 72 }, rothContribution: { currentYear: 6500, maxContribution: 7000, taxSavings: 1430 }, collegeFunding: { beneficiaryAge: 0, monthsToCollege: 0, fundingProgress: 0 } },
      portfolioPerformance: { ytdReturn: 10.8, benchmarkReturn: 10.2, outperformance: 0.6, rebalancingImpact: 0.2, bondDuration: 3.8, internationalAllocation: 18 },
      nextActions: { beneficiaryReview: { lastReviewDate: '2024-08-25', urgency: 'low' as const, pendingUpdates: 0 }, retirement401k: { currentContribution: 12000, maxContribution: 23000, employerMatch: 6000, potentialTaxSavings: 2420 }, insuranceReview: { lifeInsurance: 250000, disabilityInsurance: 140000, lastReviewDate: '2024-06-30', adequacyRating: 'adequate' as const }, rothConversion: { opportunityAmount: 15000, taxImpact: 3300, recommendedTiming: 'Q1 2025' } }
    },
    upcomingMeetings: [],
    keyMetrics: { portfolioReturn: 10.8, yearToDateReturn: 10.8, benchmarkComparison: 0.6, feeReview: false, complianceItems: generateComplianceItems(0) }
  },
  {
    id: 'client-derek-and-lisa-patel',
    name: 'Derek & Lisa Patel',
    birthDate: '1976-02-18',
    email: 'derek.patel@email.com',
    phone: '(555) 678-2345',
    category: 'enhanced',
    householdAssets: 1350000,
    lastMeeting: new Date('2024-06-20').toISOString(),
    riskTolerance: 'moderate',
    investmentObjectives: ['Growth', 'College Funding', 'Retirement Planning'],
    financialDetails: {
      retirementPlanning: { currentSavings: 680000, targetAmount: 2500000, monthlyContribution: 4200, projectedRetirementAge: 63, yearsToRetirement: 15 },
      collegeSavings: { currentAmount: 185000, targetAmount: 350000, monthlyContribution: 2000, yearsRemaining: 6, beneficiaryName: 'Maya & Aiden Patel' },
      emergencyFund: { currentAmount: 72000, targetAmount: 78000, monthlyExpenses: 13000, currentMonthsCovered: 5.5, targetMonths: 6 },
      taxHarvesting: { potentialSavings: 9200, harvestableOpportunities: 11, estimatedTaxBracket: 32, yearToDateLosses: 3500 },
      lastMeeting: { portfolioPerformance: { quarterlyReturn: 5.8, benchmarkReturn: 5.2, outperformance: 0.6 }, retirementTimeline: { currentAge: 48, targetRetirementAge: 63, confidenceLevel: 85 }, rothContribution: { currentYear: 14000, maxContribution: 14000, taxSavings: 4480 }, collegeFunding: { beneficiaryAge: 12, monthsToCollege: 72, fundingProgress: 52.9 } },
      portfolioPerformance: { ytdReturn: 13.5, benchmarkReturn: 12.1, outperformance: 1.4, rebalancingImpact: 0.4, bondDuration: 4.2, internationalAllocation: 26 },
      nextActions: { beneficiaryReview: { lastReviewDate: '2024-04-10', urgency: 'low' as const, pendingUpdates: 1 }, retirement401k: { currentContribution: 46000, maxContribution: 46000, employerMatch: 18400, potentialTaxSavings: 0 }, insuranceReview: { lifeInsurance: 1200000, disabilityInsurance: 480000, lastReviewDate: '2024-01-15', adequacyRating: 'high' as const }, rothConversion: { opportunityAmount: 60000, taxImpact: 19200, recommendedTiming: 'Q4 2024' } }
    },
    upcomingMeetings: [],
    keyMetrics: { portfolioReturn: 13.5, yearToDateReturn: 13.5, benchmarkComparison: 1.4, feeReview: false, complianceItems: generateComplianceItems(2) }
  },
  {
    id: 'client-rachel-foster',
    name: 'Rachel Foster',
    birthDate: '1988-04-25',
    email: 'rachel.foster@email.com',
    phone: '(555) 789-3456',
    category: 'standard',
    householdAssets: 295000,
    lastMeeting: new Date('2024-11-12').toISOString(),
    riskTolerance: 'aggressive',
    investmentObjectives: ['Growth', 'Career Change Fund'],
    financialDetails: {
      retirementPlanning: { currentSavings: 125000, targetAmount: 1800000, monthlyContribution: 1500, projectedRetirementAge: 62, yearsToRetirement: 26 },
      collegeSavings: { currentAmount: 0, targetAmount: 0, monthlyContribution: 0, yearsRemaining: 0, beneficiaryName: '' },
      emergencyFund: { currentAmount: 22000, targetAmount: 30000, monthlyExpenses: 5000, currentMonthsCovered: 4.4, targetMonths: 6 },
      taxHarvesting: { potentialSavings: 1200, harvestableOpportunities: 3, estimatedTaxBracket: 22, yearToDateLosses: 0 },
      lastMeeting: { portfolioPerformance: { quarterlyReturn: 6.2, benchmarkReturn: 5.5, outperformance: 0.7 }, retirementTimeline: { currentAge: 36, targetRetirementAge: 62, confidenceLevel: 70 }, rothContribution: { currentYear: 7000, maxContribution: 7000, taxSavings: 1540 }, collegeFunding: { beneficiaryAge: 0, monthsToCollege: 0, fundingProgress: 0 } },
      portfolioPerformance: { ytdReturn: 15.8, benchmarkReturn: 13.5, outperformance: 2.3, rebalancingImpact: 0.5, bondDuration: 3.0, internationalAllocation: 30 },
      nextActions: { beneficiaryReview: { lastReviewDate: '2024-09-15', urgency: 'low' as const, pendingUpdates: 0 }, retirement401k: { currentContribution: 10000, maxContribution: 23000, employerMatch: 5000, potentialTaxSavings: 2860 }, insuranceReview: { lifeInsurance: 200000, disabilityInsurance: 120000, lastReviewDate: '2024-07-20', adequacyRating: 'adequate' as const }, rothConversion: { opportunityAmount: 10000, taxImpact: 2200, recommendedTiming: 'Q1 2025' } }
    },
    upcomingMeetings: [],
    keyMetrics: { portfolioReturn: 15.8, yearToDateReturn: 15.8, benchmarkComparison: 2.3, feeReview: false, complianceItems: generateComplianceItems(0) }
  },
  {
    id: 'client-william-and-sandra-brooks',
    name: 'William & Sandra Brooks',
    birthDate: '1962-08-12',
    email: 'william.brooks@email.com',
    phone: '(555) 890-4567',
    category: 'high-touch',
    householdAssets: 3800000,
    lastMeeting: new Date('2024-05-18').toISOString(),
    riskTolerance: 'conservative',
    investmentObjectives: ['Income Generation', 'Estate Planning', 'Legacy Giving'],
    financialDetails: {
      retirementPlanning: { currentSavings: 2950000, targetAmount: 3200000, monthlyContribution: 2000, projectedRetirementAge: 67, yearsToRetirement: 3 },
      collegeSavings: { currentAmount: 0, targetAmount: 0, monthlyContribution: 0, yearsRemaining: 0, beneficiaryName: '' },
      emergencyFund: { currentAmount: 200000, targetAmount: 200000, monthlyExpenses: 25000, currentMonthsCovered: 8, targetMonths: 6 },
      taxHarvesting: { potentialSavings: 32000, harvestableOpportunities: 20, estimatedTaxBracket: 37, yearToDateLosses: 15000 },
      lastMeeting: { portfolioPerformance: { quarterlyReturn: 3.8, benchmarkReturn: 3.5, outperformance: 0.3 }, retirementTimeline: { currentAge: 62, targetRetirementAge: 67, confidenceLevel: 94 }, rothContribution: { currentYear: 8000, maxContribution: 8000, taxSavings: 2960 }, collegeFunding: { beneficiaryAge: 0, monthsToCollege: 0, fundingProgress: 0 } },
      portfolioPerformance: { ytdReturn: 8.5, benchmarkReturn: 9.2, outperformance: -0.7, rebalancingImpact: 0.2, bondDuration: 5.5, internationalAllocation: 15 },
      nextActions: { beneficiaryReview: { lastReviewDate: '2024-03-20', urgency: 'high' as const, pendingUpdates: 4 }, retirement401k: { currentContribution: 30000, maxContribution: 30000, employerMatch: 0, potentialTaxSavings: 0 }, insuranceReview: { lifeInsurance: 2000000, disabilityInsurance: 0, lastReviewDate: '2023-12-10', adequacyRating: 'high' as const }, rothConversion: { opportunityAmount: 250000, taxImpact: 92500, recommendedTiming: 'Q3 2025' } }
    },
    upcomingMeetings: [],
    keyMetrics: { portfolioReturn: 8.5, yearToDateReturn: 8.5, benchmarkComparison: -0.7, feeReview: true, complianceItems: generateComplianceItems(4) }
  },
  {
    id: 'client-victoria-santos',
    name: 'Victoria Santos',
    birthDate: '1979-12-03',
    email: 'victoria.santos@email.com',
    phone: '(555) 901-5678',
    category: 'standard',
    householdAssets: 475000,
    lastMeeting: new Date('2024-09-28').toISOString(),
    riskTolerance: 'moderate',
    investmentObjectives: ['Retirement Planning', 'Travel Fund', 'Real Estate Investment'],
    financialDetails: {
      retirementPlanning: { currentSavings: 220000, targetAmount: 1600000, monthlyContribution: 2500, projectedRetirementAge: 63, yearsToRetirement: 18 },
      collegeSavings: { currentAmount: 0, targetAmount: 0, monthlyContribution: 0, yearsRemaining: 0, beneficiaryName: '' },
      emergencyFund: { currentAmount: 40000, targetAmount: 48000, monthlyExpenses: 8000, currentMonthsCovered: 5, targetMonths: 6 },
      taxHarvesting: { potentialSavings: 2800, harvestableOpportunities: 5, estimatedTaxBracket: 24, yearToDateLosses: 0 },
      lastMeeting: { portfolioPerformance: { quarterlyReturn: 5.5, benchmarkReturn: 5.0, outperformance: 0.5 }, retirementTimeline: { currentAge: 45, targetRetirementAge: 63, confidenceLevel: 76 }, rothContribution: { currentYear: 7000, maxContribution: 7000, taxSavings: 1680 }, collegeFunding: { beneficiaryAge: 0, monthsToCollege: 0, fundingProgress: 0 } },
      portfolioPerformance: { ytdReturn: 12.3, benchmarkReturn: 11.0, outperformance: 1.3, rebalancingImpact: 0.3, bondDuration: 4.0, internationalAllocation: 24 },
      nextActions: { beneficiaryReview: { lastReviewDate: '2024-07-05', urgency: 'low' as const, pendingUpdates: 0 }, retirement401k: { currentContribution: 18000, maxContribution: 23000, employerMatch: 9000, potentialTaxSavings: 1200 }, insuranceReview: { lifeInsurance: 350000, disabilityInsurance: 175000, lastReviewDate: '2024-05-15', adequacyRating: 'adequate' as const }, rothConversion: { opportunityAmount: 20000, taxImpact: 4800, recommendedTiming: 'Q1 2025' } }
    },
    upcomingMeetings: [],
    keyMetrics: { portfolioReturn: 12.3, yearToDateReturn: 12.3, benchmarkComparison: 1.3, feeReview: false, complianceItems: generateComplianceItems(1) }
  },
  // ===== SARAH WILSON =====
  {
    id: 'client-past-1',
    name: 'Sarah Wilson',
    birthDate: '1978-04-12',
    email: 'sarah.wilson@email.com',
    phone: '(555) 345-6789',
    category: 'standard',
    householdAssets: 920000,
    lastMeeting: new Date('2024-09-15').toISOString(),
    riskTolerance: 'moderate',
    investmentObjectives: ['Retirement Planning', 'College Savings', 'Tax Optimization'],
    financialDetails: {
      retirementPlanning: { currentSavings: 480000, targetAmount: 2200000, monthlyContribution: 3200, projectedRetirementAge: 64, yearsToRetirement: 18 },
      collegeSavings: { currentAmount: 95000, targetAmount: 240000, monthlyContribution: 1500, yearsRemaining: 6, beneficiaryName: 'Emily Wilson' },
      emergencyFund: { currentAmount: 55000, targetAmount: 60000, monthlyExpenses: 10000, currentMonthsCovered: 5.5, targetMonths: 6 },
      taxHarvesting: { potentialSavings: 5800, harvestableOpportunities: 8, estimatedTaxBracket: 28, yearToDateLosses: 2100 },
      lastMeeting: { portfolioPerformance: { quarterlyReturn: 4.8, benchmarkReturn: 4.2, outperformance: 0.6 }, retirementTimeline: { currentAge: 46, targetRetirementAge: 64, confidenceLevel: 82 }, rothContribution: { currentYear: 7000, maxContribution: 7000, taxSavings: 1960 }, collegeFunding: { beneficiaryAge: 12, monthsToCollege: 72, fundingProgress: 39.6 } },
      portfolioPerformance: { ytdReturn: 10.5, benchmarkReturn: 9.8, outperformance: 0.7, rebalancingImpact: 0.2, bondDuration: 4.5, internationalAllocation: 22 },
      nextActions: { beneficiaryReview: { lastReviewDate: '2024-06-20', urgency: 'low' as const, pendingUpdates: 0 }, retirement401k: { currentContribution: 19500, maxContribution: 23000, employerMatch: 9750, potentialTaxSavings: 840 }, insuranceReview: { lifeInsurance: 500000, disabilityInsurance: 200000, lastReviewDate: '2024-04-10', adequacyRating: 'adequate' as const }, rothConversion: { opportunityAmount: 30000, taxImpact: 8400, recommendedTiming: 'Q1 2025' } }
    },
    upcomingMeetings: [],
    keyMetrics: { portfolioReturn: 10.5, yearToDateReturn: 10.5, benchmarkComparison: 0.7, feeReview: false, complianceItems: generateComplianceItems(1) }
  },
  // ===== MICHAEL DAVIS =====
  {
    id: 'client-past-2',
    name: 'Michael Davis',
    birthDate: '1970-11-03',
    email: 'michael.davis@email.com',
    phone: '(555) 456-7890',
    category: 'high-touch',
    householdAssets: 1850000,
    lastMeeting: new Date('2024-09-20').toISOString(),
    riskTolerance: 'moderate',
    investmentObjectives: ['Growth', 'Estate Planning', 'Tax Optimization'],
    financialDetails: {
      retirementPlanning: { currentSavings: 1200000, targetAmount: 3000000, monthlyContribution: 5000, projectedRetirementAge: 62, yearsToRetirement: 8 },
      collegeSavings: { currentAmount: 180000, targetAmount: 200000, monthlyContribution: 1000, yearsRemaining: 2, beneficiaryName: 'Jason Davis' },
      emergencyFund: { currentAmount: 120000, targetAmount: 120000, monthlyExpenses: 18000, currentMonthsCovered: 6.7, targetMonths: 6 },
      taxHarvesting: { potentialSavings: 15000, harvestableOpportunities: 14, estimatedTaxBracket: 35, yearToDateLosses: 6800 },
      lastMeeting: { portfolioPerformance: { quarterlyReturn: 5.1, benchmarkReturn: 4.5, outperformance: 0.6 }, retirementTimeline: { currentAge: 54, targetRetirementAge: 62, confidenceLevel: 90 }, rothContribution: { currentYear: 7000, maxContribution: 7000, taxSavings: 2450 }, collegeFunding: { beneficiaryAge: 16, monthsToCollege: 24, fundingProgress: 90 } },
      portfolioPerformance: { ytdReturn: 13.2, benchmarkReturn: 11.5, outperformance: 1.7, rebalancingImpact: 0.4, bondDuration: 3.8, internationalAllocation: 28 },
      nextActions: { beneficiaryReview: { lastReviewDate: '2024-05-15', urgency: 'medium' as const, pendingUpdates: 2 }, retirement401k: { currentContribution: 23000, maxContribution: 23000, employerMatch: 11500, potentialTaxSavings: 0 }, insuranceReview: { lifeInsurance: 1500000, disabilityInsurance: 400000, lastReviewDate: '2024-03-20', adequacyRating: 'high' as const }, rothConversion: { opportunityAmount: 80000, taxImpact: 28000, recommendedTiming: 'Q4 2024' } }
    },
    upcomingMeetings: [],
    keyMetrics: { portfolioReturn: 13.2, yearToDateReturn: 13.2, benchmarkComparison: 1.7, feeReview: false, complianceItems: generateComplianceItems(2) }
  },
  // ===== JAMES CRAWFORD =====
  {
    id: 'client-james-crawford',
    name: 'James Crawford',
    birthDate: '1982-06-28',
    email: 'james.crawford@email.com',
    phone: '(555) 567-8901',
    category: 'standard',
    householdAssets: 580000,
    lastMeeting: new Date('2024-08-10').toISOString(),
    riskTolerance: 'moderate',
    investmentObjectives: ['Retirement Planning', 'Growth', 'Real Estate Investment'],
    financialDetails: {
      retirementPlanning: { currentSavings: 310000, targetAmount: 1800000, monthlyContribution: 2800, projectedRetirementAge: 65, yearsToRetirement: 21 },
      collegeSavings: { currentAmount: 45000, targetAmount: 180000, monthlyContribution: 800, yearsRemaining: 10, beneficiaryName: 'Olivia Crawford' },
      emergencyFund: { currentAmount: 38000, targetAmount: 48000, monthlyExpenses: 8000, currentMonthsCovered: 4.75, targetMonths: 6 },
      taxHarvesting: { potentialSavings: 3200, harvestableOpportunities: 5, estimatedTaxBracket: 24, yearToDateLosses: 900 },
      lastMeeting: { portfolioPerformance: { quarterlyReturn: 3.9, benchmarkReturn: 3.5, outperformance: 0.4 }, retirementTimeline: { currentAge: 42, targetRetirementAge: 65, confidenceLevel: 74 }, rothContribution: { currentYear: 6500, maxContribution: 7000, taxSavings: 1560 }, collegeFunding: { beneficiaryAge: 8, monthsToCollege: 120, fundingProgress: 25 } },
      portfolioPerformance: { ytdReturn: 9.8, benchmarkReturn: 9.4, outperformance: 0.4, rebalancingImpact: 0.1, bondDuration: 4.2, internationalAllocation: 18 },
      nextActions: { beneficiaryReview: { lastReviewDate: '2024-07-15', urgency: 'low' as const, pendingUpdates: 0 }, retirement401k: { currentContribution: 15000, maxContribution: 23000, employerMatch: 7500, potentialTaxSavings: 1920 }, insuranceReview: { lifeInsurance: 400000, disabilityInsurance: 160000, lastReviewDate: '2024-05-20', adequacyRating: 'adequate' as const }, rothConversion: { opportunityAmount: 20000, taxImpact: 4800, recommendedTiming: 'Q2 2025' } }
    },
    upcomingMeetings: [],
    keyMetrics: { portfolioReturn: 9.8, yearToDateReturn: 9.8, benchmarkComparison: 0.4, feeReview: false, complianceItems: generateComplianceItems(1) }
  },
  // ===== RACHEL KIM =====
  {
    id: 'client-rachel-kim',
    name: 'Rachel Kim',
    birthDate: '1988-09-17',
    email: 'rachel.kim@email.com',
    phone: '(555) 678-9012',
    category: 'standard',
    householdAssets: 420000,
    lastMeeting: new Date('2024-09-25').toISOString(),
    riskTolerance: 'aggressive',
    investmentObjectives: ['Growth', 'Early Retirement', 'Tax Optimization'],
    financialDetails: {
      retirementPlanning: { currentSavings: 195000, targetAmount: 2500000, monthlyContribution: 3500, projectedRetirementAge: 55, yearsToRetirement: 19 },
      collegeSavings: { currentAmount: 0, targetAmount: 0, monthlyContribution: 0, yearsRemaining: 0, beneficiaryName: '' },
      emergencyFund: { currentAmount: 32000, targetAmount: 36000, monthlyExpenses: 6000, currentMonthsCovered: 5.3, targetMonths: 6 },
      taxHarvesting: { potentialSavings: 4100, harvestableOpportunities: 7, estimatedTaxBracket: 28, yearToDateLosses: 1500 },
      lastMeeting: { portfolioPerformance: { quarterlyReturn: 6.2, benchmarkReturn: 5.0, outperformance: 1.2 }, retirementTimeline: { currentAge: 36, targetRetirementAge: 55, confidenceLevel: 68 }, rothContribution: { currentYear: 7000, maxContribution: 7000, taxSavings: 1960 }, collegeFunding: { beneficiaryAge: 0, monthsToCollege: 0, fundingProgress: 0 } },
      portfolioPerformance: { ytdReturn: 15.1, benchmarkReturn: 11.0, outperformance: 4.1, rebalancingImpact: 0.5, bondDuration: 2.5, internationalAllocation: 35 },
      nextActions: { beneficiaryReview: { lastReviewDate: '2024-08-10', urgency: 'low' as const, pendingUpdates: 0 }, retirement401k: { currentContribution: 23000, maxContribution: 23000, employerMatch: 9200, potentialTaxSavings: 0 }, insuranceReview: { lifeInsurance: 300000, disabilityInsurance: 150000, lastReviewDate: '2024-06-15', adequacyRating: 'adequate' as const }, rothConversion: { opportunityAmount: 15000, taxImpact: 4200, recommendedTiming: 'Q1 2025' } }
    },
    upcomingMeetings: [],
    keyMetrics: { portfolioReturn: 15.1, yearToDateReturn: 15.1, benchmarkComparison: 4.1, feeReview: false, complianceItems: generateComplianceItems(0) }
  },
  // ===== JENNIFER & MARK FOSTER =====
  {
    id: 'client-foster',
    name: 'Jennifer & Mark Foster',
    birthDate: '1970-03-22',
    email: 'jennifer.foster@email.com',
    phone: '(555) 789-0123',
    category: 'high-touch',
    householdAssets: 2800000,
    lastMeeting: new Date('2024-09-18').toISOString(),
    riskTolerance: 'moderate',
    investmentObjectives: ['Retirement Planning', 'Estate Planning', 'Tax Optimization', 'ESG Investing'],
    financialDetails: {
      retirementPlanning: { currentSavings: 1850000, targetAmount: 4500000, monthlyContribution: 8000, projectedRetirementAge: 65, yearsToRetirement: 9 },
      collegeSavings: { currentAmount: 185000, targetAmount: 350000, monthlyContribution: 2500, yearsRemaining: 3, beneficiaryName: 'Emma & Lucas Foster' },
      emergencyFund: { currentAmount: 95000, targetAmount: 90000, monthlyExpenses: 15000, currentMonthsCovered: 6.3, targetMonths: 6 },
      taxHarvesting: { potentialSavings: 12500, harvestableOpportunities: 8, estimatedTaxBracket: 35, yearToDateLosses: 4200 },
      lastMeeting: { portfolioPerformance: { quarterlyReturn: 4.8, benchmarkReturn: 4.2, outperformance: 0.6 }, retirementTimeline: { currentAge: 56, targetRetirementAge: 65, confidenceLevel: 88 }, rothContribution: { currentYear: 7000, maxContribution: 7500, taxSavings: 2450 }, collegeFunding: { beneficiaryAge: 20, monthsToCollege: 0, fundingProgress: 53 } },
      portfolioPerformance: { ytdReturn: 11.2, benchmarkReturn: 10.5, outperformance: 0.7, rebalancingImpact: 0.2, bondDuration: 5.1, internationalAllocation: 22 },
      nextActions: { beneficiaryReview: { lastReviewDate: '2024-08-25', urgency: 'medium' as const, pendingUpdates: 1 }, retirement401k: { currentContribution: 23000, maxContribution: 23000, employerMatch: 11500, potentialTaxSavings: 0 }, insuranceReview: { lifeInsurance: 1500000, disabilityInsurance: 400000, lastReviewDate: '2024-04-10', adequacyRating: 'adequate' as const }, rothConversion: { opportunityAmount: 45000, taxImpact: 15750, recommendedTiming: 'Q4 2025' } }
    },
    upcomingMeetings: [],
    keyMetrics: { portfolioReturn: 11.2, yearToDateReturn: 11.2, benchmarkComparison: 0.7, feeReview: false, complianceItems: generateComplianceItems(1) }
  },

  // ===== ROBERT & PATRICIA JOHNSON =====
  {
    id: 'client-johnson',
    name: 'Robert & Patricia Johnson',
    birthDate: '1954-10-08',
    email: 'robert.johnson@email.com',
    phone: '(555) 890-1234',
    category: 'high-touch',
    householdAssets: 4200000,
    lastMeeting: new Date('2024-10-01').toISOString(),
    riskTolerance: 'conservative',
    investmentObjectives: ['Income Generation', 'Estate Planning', 'Tax Optimization', 'Wealth Preservation'],
    financialDetails: {
      retirementPlanning: { currentSavings: 3200000, targetAmount: 5000000, monthlyContribution: 5000, projectedRetirementAge: 70, yearsToRetirement: 0 },
      collegeSavings: { currentAmount: 0, targetAmount: 0, monthlyContribution: 0, yearsRemaining: 0, beneficiaryName: '' },
      emergencyFund: { currentAmount: 180000, targetAmount: 150000, monthlyExpenses: 18000, currentMonthsCovered: 10, targetMonths: 6 },
      taxHarvesting: { potentialSavings: 18000, harvestableOpportunities: 10, estimatedTaxBracket: 37, yearToDateLosses: 6500 },
      lastMeeting: { portfolioPerformance: { quarterlyReturn: 3.1, benchmarkReturn: 3.5, outperformance: -0.4 }, retirementTimeline: { currentAge: 71, targetRetirementAge: 70, confidenceLevel: 95 }, rothContribution: { currentYear: 0, maxContribution: 7500, taxSavings: 0 }, collegeFunding: { beneficiaryAge: 0, monthsToCollege: 0, fundingProgress: 0 } },
      portfolioPerformance: { ytdReturn: 7.8, benchmarkReturn: 8.5, outperformance: -0.7, rebalancingImpact: 0.1, bondDuration: 7.2, internationalAllocation: 12 },
      nextActions: { beneficiaryReview: { lastReviewDate: '2024-09-10', urgency: 'high' as const, pendingUpdates: 2 }, retirement401k: { currentContribution: 0, maxContribution: 0, employerMatch: 0, potentialTaxSavings: 0 }, insuranceReview: { lifeInsurance: 2000000, disabilityInsurance: 0, lastReviewDate: '2024-03-15', adequacyRating: 'low' as const }, rothConversion: { opportunityAmount: 80000, taxImpact: 29600, recommendedTiming: 'Q1 2026' } }
    },
    upcomingMeetings: [],
    keyMetrics: { portfolioReturn: 7.8, yearToDateReturn: 7.8, benchmarkComparison: -0.7, feeReview: true, complianceItems: generateComplianceItems(2) }
  }
];

