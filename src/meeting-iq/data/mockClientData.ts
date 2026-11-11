// @ts-nocheck
import { ClientData } from '../types/advisor';

/**
 * Centralized client data with consistent IDs for the entire application
 * This ensures all components can reference clients by ID instead of name matching
 */
export const mockClients: ClientData[] = [
  {
    id: 'client-chen',
    name: 'Linda Chen',
    birthDate: '1972-04-15',
    email: 'linda.chen@email.com',
    phone: '(555) 123-4567',
    category: 'high-touch',
    householdAssets: 2450000,
    lastMeeting: new Date('2024-01-15').toISOString(),
    riskTolerance: 'moderate',
    keyMetrics: {
      portfolioReturn: 8.3,
      feeReview: false,
      complianceItems: [],
      yearToDateReturn: 12.5,
      benchmarkComparison: 1.2
    },
    portfolioData: {
      totalValue: 2450000,
      ytdReturn: 12.5,
      benchmarkReturn: 11.3,
      allocation: {
        stocks: 65,
        bonds: 25,
        alternatives: 8,
        cash: 2
      },
      topHoldings: [
        { symbol: 'AAPL', name: 'Apple Inc.', percentage: 8.5, value: 208250 },
        { symbol: 'MSFT', name: 'Microsoft Corporation', percentage: 7.2, value: 176400 },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', percentage: 6.8, value: 166600 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', percentage: 5.9, value: 144550 },
        { symbol: 'NVDA', name: 'NVIDIA Corporation', percentage: 5.1, value: 124950 }
      ]
    },
    professionalNetwork: {
      accountant: {
        name: 'Sarah Kim',
        firm: 'Kim & Associates CPA',
        email: 'sarah.kim@kimcpa.com',
        phone: '(555) 789-1234',
        specialties: ['Tax Planning', 'Estate Tax', 'Business Tax'],
        yearsWorking: 5,
        lastContact: '2024-01-10',
        collaborationFrequency: 'quarterly',
        referralSource: 'Client referral',
        keyAchievements: 'Saved $45K in taxes through strategic planning'
      },
      estateAttorney: {
        name: 'Michael Rodriguez',
        firm: 'Rodriguez Law Group',
        email: 'mrodriguez@rlg.com',
        phone: '(555) 456-7890',
        specialties: ['Estate Planning', 'Trust Administration', 'Probate'],
        yearsWorking: 4,
        lastContact: '2023-12-15',
        collaborationFrequency: 'annual',
        referralSource: 'Professional network',
        keyAchievements: 'Established comprehensive trust structure'
      },
      insuranceAgent: {
        name: 'Jennifer Walsh',
        firm: 'Walsh Insurance Solutions',
        email: 'jennifer@walshins.com',
        phone: '(555) 234-5678',
        coverageTypes: ['Life Insurance', 'Disability', 'Long-term Care'],
        yearsWorking: 3,
        lastContact: '2024-01-05',
        collaborationFrequency: 'semi-annual',
        referralSource: 'Industry association',
        keyAchievements: 'Secured $2M life insurance at preferred rates'
      },
      financialPlanner: {
        name: 'Robert Kim',
        firm: 'Strategic Financial Planning',
        email: 'robert@strategicfp.com',
        phone: '(555) 345-9876',
        specialties: ['Retirement Planning', 'Education Funding', 'Cash Flow'],
        yearsWorking: 5,
        lastContact: '2024-01-12',
        collaborationFrequency: 'monthly',
        referralSource: 'Long-term partnership',
        keyAchievements: 'Optimized retirement timeline by 3 years'
      }
    },
    extendedHousehold: [
      {
        name: 'Linda Chen',
        relationship: 'spouse',
        email: 'linda.chen@email.com',
        phone: '(555) 123-4568',
        role: 'spouse',
        birthDate: '1975-08-20',
        responsibilities: 'Joint account holder, estate beneficiary',
        emergencyContactPriority: 1
      },
      {
        name: 'Kevin Chen',
        relationship: 'son',
        birthDate: '2008-03-15',
        role: 'dependent',
        responsibilities: '529 plan beneficiary, trust beneficiary',
        emergencyContactPriority: 3
      },
      {
        name: 'Lisa Chen',
        relationship: 'daughter',
        birthDate: '2010-07-22',
        role: 'dependent',
        responsibilities: '529 plan beneficiary, trust beneficiary',
        emergencyContactPriority: 4
      },
      {
        name: 'Margaret Chen',
        relationship: 'mother-in-law',
        phone: '(555) 987-6543',
        role: 'emergency_contact',
        birthDate: '1948-04-12',
        responsibilities: 'Emergency contact, potential care recipient',
        emergencyContactPriority: 2
      }
    ],
    preferredCommunication: {
      method: 'email',
      frequency: 'monthly',
      bestTimeToContact: 'Mornings before 10 AM'
    },
    relationshipHistory: [
      {
        date: new Date('2019-03-15').toISOString(),
        milestone: 'Initial Onboarding',
        type: 'onboarding',
        description: 'Comprehensive financial planning engagement began',
        outcome: 'Established $2.1M initial AUM'
      },
      {
        date: new Date('2020-05-20').toISOString(),
        milestone: '529 Plan Setup',
        type: 'account_opening',
        description: 'Opened college savings accounts for both children',
        outcome: 'Added $300K in education funding'
      },
      {
        date: new Date('2021-03-12').toISOString(),
        milestone: 'Home Refinancing Advisory',
        type: 'life_event',
        description: 'Advised on mortgage refinancing during low rate environment',
        outcome: 'Saved $180K over loan term'
      },
      {
        date: new Date('2022-08-10').toISOString(),
        milestone: 'Portfolio Restructuring',
        type: 'service_change',
        description: 'Shifted to more conservative allocation approaching retirement',
        outcome: 'Reduced portfolio risk by 25%'
      },
      {
        date: new Date('2023-04-20').toISOString(),
        milestone: 'Referral Program',
        type: 'referral',
        description: 'Referred two colleagues to our practice',
        outcome: 'Generated $1.2M in new AUM'
      },
      {
        date: new Date('2023-11-15').toISOString(),
        milestone: 'Estate Plan Update',
        type: 'service_upgrade',
        description: 'Comprehensive estate planning review and updates',
        outcome: 'Optimized tax efficiency and succession planning'
      }
    ],
    documents: [
      {
        id: 'doc-1',
        name: 'Tax Return 2023.pdf',
        uploadedAt: new Date('2024-01-10').toISOString(),
        status: 'completed',
        size: 2048000,
        type: 'application/pdf'
      },
      {
        id: 'doc-2',
        name: 'Estate Plan Review.docx',
        uploadedAt: new Date('2024-01-08').toISOString(),
        status: 'completed',
        size: 1024000,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      },
      {
        id: 'doc-3',
        name: 'Portfolio Statement Q4.pdf',
        uploadedAt: new Date('2024-01-05').toISOString(),
        status: 'completed',
        size: 3072000,
        type: 'application/pdf'
      }
    ]
  },
  {
    id: 'client-johnson',
    name: 'Robert & Patricia Johnson',
    birthDate: '1954-10-08',
    email: 'robert.johnson@email.com',
    phone: '(555) 234-5678',
    category: 'enhanced',
    householdAssets: 1750000,
    lastMeeting: new Date('2024-01-20').toISOString(),
    riskTolerance: 'conservative',
    keyMetrics: {
      portfolioReturn: 6.1,
      feeReview: true,
      complianceItems: [],
      yearToDateReturn: 8.9,
      benchmarkComparison: 0.8
    },
    portfolioData: {
      totalValue: 1750000,
      ytdReturn: 8.9,
      benchmarkReturn: 8.1,
      allocation: {
        stocks: 45,
        bonds: 40,
        alternatives: 5,
        cash: 10
      },
      topHoldings: [
        { symbol: 'SCHB', name: 'Schwab US Broad Market ETF', percentage: 15.2, value: 266000 },
        { symbol: 'SCHZ', name: 'Schwab US Aggregate Bond ETF', percentage: 12.8, value: 224000 },
        { symbol: 'SCHF', name: 'Schwab International Equity ETF', percentage: 8.5, value: 148750 },
        { symbol: 'SCHE', name: 'Schwab Emerging Markets Equity ETF', percentage: 6.2, value: 108500 },
        { symbol: 'SCMB', name: 'Schwab Municipal Bond ETF', percentage: 5.8, value: 101500 }
      ]
    },
    professionalNetwork: {
      accountant: {
        name: 'David Thompson',
        firm: 'Thompson Tax Services',
        email: 'david@thompsontax.com',
        phone: '(555) 345-6789',
        specialties: ['Individual Tax', 'Retirement Planning', 'Small Business'],
        yearsWorking: 7,
        lastContact: '2024-01-08',
        collaborationFrequency: 'quarterly',
        referralSource: 'Client relationship since 2017',
        keyAchievements: 'Managed complex retirement distributions'
      },
      estateAttorney: {
        name: 'Patricia Lee',
        firm: 'Lee Estate Law',
        email: 'patricia@leeestate.com',
        phone: '(555) 567-8901',
        specialties: ['Wills & Trusts', 'Elder Law', 'Asset Protection'],
        yearsWorking: 6,
        lastContact: '2023-10-22',
        collaborationFrequency: 'annual',
        referralSource: 'Bar association referral',
        keyAchievements: 'Created protective trust structures for aging parents'
      },
      taxProfessional: {
        name: 'Mark Stevens',
        firm: 'Stevens Tax Advisory',
        email: 'mark@stevenstax.com',
        phone: '(555) 678-3456',
        specialties: ['Tax Optimization', 'IRA Conversions', 'Medicare Planning'],
        yearsWorking: 4,
        lastContact: '2023-12-30',
        collaborationFrequency: 'annual',
        referralSource: 'Professional network',
        keyAchievements: 'Executed strategic Roth conversions saving $85K in taxes'
      },
      insuranceAgent: {
        name: 'Thomas Wilson',
        firm: 'Wilson Insurance Group',
        email: 'thomas@wilsonins.com',
        phone: '(555) 432-7890',
        coverageTypes: ['Long-term Care', 'Life Insurance', 'Medicare Supplement'],
        yearsWorking: 5,
        lastContact: '2023-11-18',
        collaborationFrequency: 'annual',
        referralSource: 'Client referral',
        keyAchievements: 'Secured comprehensive LTC coverage at age 65'
      }
    },
    extendedHousehold: [
      {
        name: 'Patricia Johnson',
        relationship: 'spouse',
        email: 'patricia.johnson@email.com',
        phone: '(555) 234-5679',
        role: 'spouse',
        birthDate: '1952-12-03',
        responsibilities: 'Joint account holder, primary beneficiary',
        emergencyContactPriority: 1
      },
      {
        name: 'Margaret Johnson',
        relationship: 'mother',
        phone: '(555) 876-5432',
        role: 'emergency_contact',
        birthDate: '1928-06-18',
        responsibilities: 'Emergency contact, dependent care recipient',
        emergencyContactPriority: 2
      },
      {
        name: 'Michael Johnson',
        relationship: 'son',
        email: 'michael.johnson@email.com',
        phone: '(555) 654-3210',
        role: 'beneficiary',
        birthDate: '1985-09-14',
        responsibilities: 'Secondary beneficiary, financial POA backup',
        emergencyContactPriority: 3
      }
    ],
    preferredCommunication: {
      method: 'phone',
      frequency: 'quarterly',
      bestTimeToContact: 'Afternoons between 2-4 PM'
    },
    relationshipHistory: [
      {
        date: new Date('2017-05-10').toISOString(),
        milestone: 'Initial Onboarding',
        type: 'onboarding',
        description: 'Conservative portfolio strategy for retirement focus',
        outcome: 'Established $1.5M initial AUM'
      },
      {
        date: new Date('2018-09-22').toISOString(),
        milestone: 'Mother Care Planning',
        type: 'life_event',
        description: 'Implemented care strategy and Medicaid planning for aging mother',
        outcome: 'Protected $200K in assets through proper planning'
      },
      {
        date: new Date('2019-12-15').toISOString(),
        milestone: 'Social Security Optimization',
        type: 'service_change',
        description: 'Strategic Social Security claiming analysis and timing',
        outcome: 'Maximized lifetime benefits by $150K'
      },
      {
        date: new Date('2021-03-08').toISOString(),
        milestone: 'Required Minimum Distributions',
        type: 'compliance',
        description: 'Implemented systematic RMD strategy at age 72',
        outcome: 'Tax-efficient distribution strategy saving $12K annually'
      },
      {
        date: new Date('2022-11-30').toISOString(),
        milestone: 'Long-term Care Insurance',
        type: 'service_upgrade',
        description: 'Secured comprehensive LTC coverage for both spouses',
        outcome: 'Protected retirement assets from potential care costs'
      },
      {
        date: new Date('2023-07-18').toISOString(),
        milestone: 'Estate Plan Review',
        type: 'compliance',
        description: 'Updated wills and beneficiaries following policy changes',
        outcome: 'Ensured proper asset transfer and tax optimization'
      }
    ],
    documents: [
      {
        id: 'doc-4',
        name: 'RMD Distribution Plan.pdf',
        uploadedAt: new Date('2024-01-18').toISOString(),
        status: 'completed',
        size: 1536000,
        type: 'application/pdf'
      }
    ]
  },
  {
    id: 'client-martinez',
    name: 'Robert Martinez',
    birthDate: '1968-09-22',
    email: 'robert.martinez@email.com',
    phone: '(555) 987-6543',
    category: 'high-touch',
    householdAssets: 4200000,
    lastMeeting: new Date('2024-01-28').toISOString(),
    riskTolerance: 'moderate',
    keyMetrics: {
      portfolioReturn: 12.4,
      feeReview: false,
      complianceItems: [],
      yearToDateReturn: 14.8,
      benchmarkComparison: 1.6
    },
    portfolioData: {
      totalValue: 4200000,
      ytdReturn: 14.8,
      benchmarkReturn: 13.2,
      allocation: {
        stocks: 70,
        bonds: 15,
        alternatives: 12,
        cash: 3
      },
      topHoldings: [
        { symbol: 'TSLA', name: 'Tesla Inc.', percentage: 9.2, value: 386400 },
        { symbol: 'META', name: 'Meta Platforms Inc.', percentage: 8.1, value: 340200 },
        { symbol: 'QQQ', name: 'Invesco QQQ Trust', percentage: 7.5, value: 315000 },
        { symbol: 'ARKK', name: 'ARK Innovation ETF', percentage: 6.8, value: 285600 },
        { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', percentage: 6.2, value: 260400 }
      ]
    },
    professionalNetwork: {
      accountant: {
        name: 'Maria Santos',
        firm: 'Santos & Associates CPA',
        email: 'maria@santoscpa.com',
        phone: '(555) 321-9876',
        specialties: ['High Net Worth Tax', 'International Tax', 'Estate Tax Planning'],
        yearsWorking: 8,
        lastContact: '2024-01-20',
        collaborationFrequency: 'monthly',
        referralSource: 'Client relationship since 2016',
        keyAchievements: 'Optimized international holdings saving $180K in taxes annually'
      },
      estateAttorney: {
        name: 'Elizabeth Harper',
        firm: 'Harper Estate Law',
        email: 'elizabeth@harperestate.com',
        phone: '(555) 654-1234',
        specialties: ['Complex Trusts', 'International Estate Planning', 'Business Succession'],
        yearsWorking: 7,
        lastContact: '2024-01-05',
        collaborationFrequency: 'quarterly',
        referralSource: 'Elite professional network',
        keyAchievements: 'Structured international trust saving $500K in estate taxes'
      },
      insuranceAgent: {
        name: 'Christopher Davis',
        firm: 'Davis Executive Insurance',
        email: 'chris@davisexec.com',
        phone: '(555) 789-2345',
        coverageTypes: ['Executive Life Insurance', 'Disability', 'Umbrella Coverage'],
        yearsWorking: 6,
        lastContact: '2024-01-15',
        collaborationFrequency: 'semi-annual',
        referralSource: 'Professional association',
        keyAchievements: 'Secured $8M executive protection at preferred rates'
      },
      financialPlanner: {
        name: 'Rachel Kim',
        firm: 'Elite Wealth Strategies',
        email: 'rachel@elitewealth.com',
        phone: '(555) 456-8901',
        specialties: ['International Planning', 'Advanced Tax Strategies', 'Business Exit Planning'],
        yearsWorking: 9,
        lastContact: '2024-01-25',
        collaborationFrequency: 'monthly',
        referralSource: 'Long-term strategic partnership',
        keyAchievements: 'Orchestrated complex international restructuring saving $750K annually'
      }
    },
    extendedHousehold: [
      {
        name: 'Sofia Martinez',
        relationship: 'spouse',
        email: 'sofia.martinez@email.com',
        phone: '(555) 987-6544',
        role: 'spouse',
        birthDate: '1971-03-18',
        responsibilities: 'Joint account holder, estate co-executor',
        emergencyContactPriority: 1
      },
      {
        name: 'Carlos Martinez',
        relationship: 'son',
        email: 'carlos.martinez@college.edu',
        phone: '(555) 234-5671',
        role: 'beneficiary',
        birthDate: '1995-07-12',
        responsibilities: 'Trust beneficiary, business succession candidate',
        emergencyContactPriority: 3
      },
      {
        name: 'Isabella Martinez',
        relationship: 'daughter',
        email: 'isabella.martinez@university.edu',
        role: 'beneficiary',
        birthDate: '1998-11-05',
        responsibilities: 'Education trust beneficiary, emergency contact backup',
        emergencyContactPriority: 4
      },
      {
        name: 'Eduardo Martinez',
        relationship: 'father',
        phone: '(555) 876-9012',
        role: 'emergency_contact',
        birthDate: '1940-12-30',
        responsibilities: 'Emergency contact, care planning recipient',
        emergencyContactPriority: 2
      },
      {
        name: 'Ana Rodriguez',
        relationship: 'sister',
        email: 'ana.rodriguez@email.com',
        phone: '(555) 345-7890',
        role: 'emergency_contact',
        birthDate: '1966-05-14',
        responsibilities: 'Backup emergency contact, guardian designation',
        emergencyContactPriority: 5
      }
    ],
    preferredCommunication: {
      method: 'email',
      frequency: 'weekly',
      bestTimeToContact: 'Mornings 8-11 AM, or late afternoons 4-6 PM'
    },
    relationshipHistory: [
      {
        date: '2016-03-20',
        milestone: 'Initial Onboarding',
        type: 'onboarding',
        description: 'Comprehensive wealth management engagement for successful business owner',
        outcome: 'Established $3.2M initial AUM with holistic planning approach'
      },
      {
        date: '2017-08-15',
        milestone: 'International Holdings Optimization',
        type: 'service_change',
        description: 'Restructured international business holdings for tax efficiency',
        outcome: 'Reduced annual tax burden by $180K through strategic planning'
      },
      {
        date: '2018-11-30',
        milestone: 'Children Education Planning',
        type: 'life_event',
        description: 'Established education funding strategy for two children in college',
        outcome: 'Funded $500K in education expenses tax-efficiently'
      },
      {
        date: '2019-05-10',
        milestone: 'Business Expansion Financing',
        type: 'account_opening',
        description: 'Provided financial planning for major business expansion',
        outcome: 'Optimized capital structure saving $200K in financing costs'
      },
      {
        date: '2020-09-22',
        milestone: 'Pandemic Portfolio Protection',
        type: 'service_upgrade',
        description: 'Implemented defensive strategy during market volatility',
        outcome: 'Protected portfolio value and positioned for recovery'
      },
      {
        date: '2021-12-18',
        milestone: 'Estate Planning Overhaul',
        type: 'compliance',
        description: 'Comprehensive estate plan update including international structures',
        outcome: 'Created tax-efficient wealth transfer plan saving $500K in estate taxes'
      },
      {
        date: '2022-07-25',
        milestone: 'Referral Network Expansion',
        type: 'referral',
        description: 'Referred multiple high-net-worth business colleagues',
        outcome: 'Generated $2.8M in new AUM from quality referrals'
      },
      {
        date: '2023-03-12',
        milestone: 'Charitable Foundation Setup',
        type: 'service_upgrade',
        description: 'Established private foundation for philanthropic goals',
        outcome: 'Created $1M annual giving capacity with significant tax benefits'
      },
      {
        date: '2023-10-08',
        milestone: 'Succession Planning Implementation',
        type: 'service_change',
        description: 'Implemented comprehensive business succession plan',
        outcome: 'Structured exit strategy maximizing family wealth transfer'
      }
    ]
  },
  {
    id: 'client-anderson',
    name: 'Lisa Anderson',
    birthDate: '1980-06-12',
    email: 'lisa.anderson@email.com',
    phone: '(555) 456-7890',
    category: 'high-touch',
    householdAssets: 3200000,
    lastMeeting: new Date('2024-01-25').toISOString(),
    riskTolerance: 'aggressive',
    keyMetrics: {
      portfolioReturn: 15.7,
      feeReview: false,
      complianceItems: [],
      yearToDateReturn: 18.2,
      benchmarkComparison: 2.1
    },
    professionalNetwork: {
      accountant: {
        name: 'James Miller',
        firm: 'Miller Financial CPA',
        email: 'james@millerfinancial.com',
        phone: '(555) 678-9012',
        specialties: ['High Net Worth Tax', 'Investment Tax', 'Estate Tax Planning'],
        yearsWorking: 6,
        lastContact: '2024-01-15',
        collaborationFrequency: 'monthly',
        referralSource: 'Business advisory network',
        keyAchievements: 'Structured business sale to minimize tax impact by $450K'
      },
      estateAttorney: {
        name: 'Robert Chen',
        firm: 'Chen Estate Planning',
        email: 'robert@chenep.com',
        phone: '(555) 789-0123',
        specialties: ['Complex Trusts', 'Business Succession', 'Charitable Planning'],
        yearsWorking: 5,
        lastContact: '2023-12-20',
        collaborationFrequency: 'quarterly',
        referralSource: 'Professional referral network',
        keyAchievements: 'Created innovative charitable remainder trust saving $200K in taxes'
      },
      insuranceAgent: {
        name: 'Amanda Foster',
        firm: 'Foster Risk Management',
        email: 'amanda@fosterrisk.com',
        phone: '(555) 890-1234',
        coverageTypes: ['Executive Insurance', 'Umbrella Policy', 'Key Person'],
        yearsWorking: 4,
        lastContact: '2024-01-02',
        collaborationFrequency: 'semi-annual',
        referralSource: 'Industry specialist network',
        keyAchievements: 'Secured $5M executive protection package at competitive rates'
      },
      financialPlanner: {
        name: 'Diana Torres',
        firm: 'Elite Financial Strategies',
        email: 'diana@elitefs.com',
        phone: '(555) 321-6789',
        specialties: ['Business Exit Planning', 'Advanced Tax Strategies', 'Wealth Transfer'],
        yearsWorking: 6,
        lastContact: '2024-01-10',
        collaborationFrequency: 'monthly',
        referralSource: 'Long-term strategic partnership',
        keyAchievements: 'Orchestrated $25M business exit maximizing after-tax proceeds'
      },
      taxProfessional: {
        name: 'Steven Chang',
        firm: 'Chang Advanced Tax Planning',
        email: 'steven@changadvanced.com',
        phone: '(555) 456-1234',
        specialties: ['Alternative Investments', 'Cryptocurrency Tax', 'International Tax'],
        yearsWorking: 3,
        lastContact: '2023-12-28',
        collaborationFrequency: 'quarterly',
        referralSource: 'Specialized expertise referral',
        keyAchievements: 'Optimized complex investment structures saving $180K annually'
      }
    },
    extendedHousehold: [
      {
        name: 'Thomas Anderson',
        relationship: 'brother',
        email: 'thomas.anderson@email.com',
        role: 'emergency_contact',
        birthDate: '1978-02-28',
        responsibilities: 'Emergency contact, business succession backup',
        emergencyContactPriority: 1
      },
      {
        name: 'Jennifer Martinez',
        relationship: 'business_partner',
        email: 'jennifer@techventures.com',
        phone: '(555) 789-4567',
        role: 'business_contact',
        birthDate: '1979-11-15',
        responsibilities: 'Key person insurance beneficiary, succession planning',
        emergencyContactPriority: 2
      },
      {
        name: 'David Anderson',
        relationship: 'nephew',
        email: 'david.anderson@college.edu',
        role: 'beneficiary',
        birthDate: '2001-08-10',
        responsibilities: 'Education trust beneficiary, mentorship recipient',
        emergencyContactPriority: 3
      }
    ],
    preferredCommunication: {
      method: 'email',
      frequency: 'as_needed',
      bestTimeToContact: 'Business hours, any time'
    },
    relationshipHistory: [
      {
        date: new Date('2018-01-10'),
        milestone: 'Initial Consultation',
        type: 'onboarding',
        description: 'High-touch service engagement for business owner',
        outcome: 'Established $2.8M initial AUM from business proceeds'
      },
      {
        date: new Date('2019-06-15'),
        milestone: 'Business Sale Planning',
        type: 'service_change',
        description: 'Initiated exit strategy planning for tech company',
        outcome: 'Structured sale to maximize after-tax proceeds'
      },
      {
        date: new Date('2020-03-18'),
        milestone: 'Liquidity Event Planning',
        type: 'life_event',
        description: 'Prepared for major business acquisition during pandemic',
        outcome: 'Navigated market volatility to secure optimal sale timing'
      },
      {
        date: new Date('2021-11-30'),
        milestone: 'Referral Program',
        type: 'referral',
        description: 'Referred three colleagues, expanding our tech entrepreneur client base',
        outcome: 'Generated $4.2M in new AUM from quality referrals'
      },
      {
        date: new Date('2022-05-12'),
        milestone: 'Philanthropic Strategy',
        type: 'service_upgrade',
        description: 'Implemented comprehensive charitable giving and impact investing plan',
        outcome: 'Established $500K annual giving capacity with tax benefits'
      },
      {
        date: new Date('2023-02-28'),
        milestone: 'Alternative Investment Diversification',
        type: 'account_opening',
        description: 'Added private equity and real estate investments to portfolio',
        outcome: 'Enhanced diversification and expected returns by 2.5%'
      },
      {
        date: new Date('2023-08-15'),
        milestone: 'Succession Planning',
        type: 'service_change',
        description: 'Developed comprehensive wealth transfer strategy for next generation',
        outcome: 'Created tax-efficient transfer plan saving estimated $800K in estate taxes'
      }
    ]
  }
];

/**
 * Helper function to get client by ID
 */
export const getClientById = (clientId: string): ClientData | undefined => {
  return mockClients.find(client => client.id === clientId);
};

/**
 * Helper function to get client by name (for backward compatibility)
 */
export const getClientByName = (clientName: string): ClientData | undefined => {
  return mockClients.find(client => 
    client.name.toLowerCase().includes(clientName.toLowerCase()) ||
    clientName.toLowerCase().includes(client.name.toLowerCase())
  );
};