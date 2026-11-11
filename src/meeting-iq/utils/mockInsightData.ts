// @ts-nocheck
import { InsightData } from '@miq/types/insights';
import { Scale, Calendar, DollarSign, Shield, TrendingUp, FileText, BarChart3, AlertTriangle } from 'lucide-react';

export const createSampleInsight = (): InsightData => ({
  id: 'insight-rebalance-sample',
  type: 'rebalance',
  title: 'Portfolio Rebalancing Opportunity',
  description: 'Portfolio allocation is 5% overweight in equities compared to target allocation. This deviation from the strategic asset allocation may increase portfolio risk and reduce expected risk-adjusted returns.',
  impact: 'medium',
  confidence: 85,
  source: 'portfolio_analysis',
  icon: Scale,
  metadata: {
    clientId: 'client-123',
    percentage: 5,
    amount: 125000,
    category: 'portfolio',
    tags: ['allocation', 'equity overweight', 'rebalancing', 'risk management']
  },
  recommendation: {
    action: 'Execute portfolio rebalancing to restore target allocation',
    steps: [
      'Review current asset allocation across all accounts',
      'Calculate target allocation based on investment policy',
      'Identify positions to reduce (equities) and increase (bonds/cash)',
      'Execute trades with tax-loss harvesting consideration',
      'Update client records and send confirmation'
    ],
    timeline: 'Within 2 weeks',
    priority: 'medium'
  },
  explanation: {
    methodology: 'Our portfolio analysis engine continuously monitors client allocations against their target investment policy. We use daily price data and account balances to calculate drift from strategic targets.',
    dataPoints: [
      'Current equity allocation: 65% (Target: 60%)',
      'Recent 3-month equity performance: +12.3%',
      'Bond allocation: 25% (Target: 30%)',
      'Cash allocation: 10% (Target: 10%)',
      'Portfolio volatility: 14.2% (Target range: 12-15%)'
    ],
    assumptions: [
      'Client maintains current risk tolerance and investment objectives',
      'No major changes to investment policy statement',
      'Market conditions remain stable for execution period',
      'Transaction costs will not exceed 0.1% of rebalanced amount'
    ],
    alternatives: [
      'Wait for natural rebalancing through new contributions over next 6 months',
      'Implement gradual rebalancing over 3 months to reduce market timing risk',
      'Use new cash flows and dividends to rebalance without selling existing positions',
      'Consider tax-loss harvesting opportunities while rebalancing'
    ],
    risks: [
      'Market timing risk if executed during high volatility period',
      'Transaction costs may reduce net benefit, especially in smaller accounts',
      'Potential tax implications in taxable accounts from capital gains',
      'Opportunity cost if equity markets continue strong performance'
    ]
  }
});

export const createTaxInsight = (): InsightData => ({
  id: 'insight-tax-loss-sample',
  type: 'tax',
  title: 'Tax-Loss Harvesting Opportunity',
  description: 'Several positions show unrealized losses that could be harvested to offset capital gains and reduce current year tax liability.',
  impact: 'high',
  confidence: 92,
  source: 'tax_planning',
  icon: DollarSign,
  metadata: {
    clientId: 'client-456',
    amount: 35000,
    category: 'tax_planning',
    tags: ['tax-loss harvesting', 'capital gains', 'tax efficiency']
  },
  recommendation: {
    action: 'Execute tax-loss harvesting on identified positions',
    steps: [
      'Review all taxable accounts for unrealized losses',
      'Identify positions for harvesting while avoiding wash sale rules',
      'Calculate net tax benefit considering state and federal rates',
      'Execute sales and reinvest in similar but not substantially identical securities',
      'Document transactions for tax reporting'
    ],
    timeline: 'Before December 31st',
    priority: 'high'
  },
  explanation: {
    methodology: 'Our tax optimization system analyzes all taxable positions daily, calculating unrealized gains/losses and identifying harvest opportunities while considering wash sale rules and client tax situation.',
    dataPoints: [
      'Total unrealized losses available: $35,000',
      'Client marginal tax rate: 32% federal + 8% state',
      'Current year realized gains: $28,000',
      'Remaining loss carryforward capacity: $7,000',
      'Estimated tax savings: $14,000'
    ],
    assumptions: [
      'Client remains in current tax bracket through year-end',
      'No significant additional capital gains expected this year',
      'Suitable replacement securities available for purchase',
      'Client will maintain similar risk profile after harvesting'
    ],
    alternatives: [
      'Wait until next tax year if current year gains are minimal',
      'Harvest only partial losses to match current year gains',
      'Combine with charitable giving strategies for additional benefits',
      'Consider Roth conversion opportunities with harvested losses'
    ],
    risks: [
      'Wash sale violations if client purchases similar securities within 30 days',
      'Market risk during transition period between sale and reinvestment',
      'Potential for higher cost basis in replacement securities',
      'Changes in tax law could affect projected benefits'
    ]
  }
});

export const createComplianceInsight = (): InsightData => ({
  id: 'insight-compliance-sample',
  type: 'compliance',
  title: 'Required Minimum Distribution Due',
  description: 'Client has an upcoming RMD deadline that requires immediate attention to avoid IRS penalties.',
  impact: 'high',
  confidence: 98,
  source: 'compliance_monitoring',
  icon: Shield,
  metadata: {
    clientId: 'client-789',
    amount: 45000,
    deadline: new Date('2024-12-31'),
    category: 'compliance',
    tags: ['RMD', 'IRA', 'compliance', 'penalty avoidance']
  },
  recommendation: {
    action: 'Process required minimum distribution immediately',
    steps: [
      'Calculate exact RMD amount using current account balances',
      'Determine optimal securities to liquidate for distribution',
      'Coordinate with tax advisor on withholding preferences',
      'Execute distribution and process payment to client',
      'Update compliance tracking system and client records'
    ],
    timeline: 'Within 5 business days',
    priority: 'urgent'
  },
  explanation: {
    methodology: 'Our compliance monitoring system tracks all retirement account requirements including RMDs, using IRS life expectancy tables and daily account balance monitoring.',
    dataPoints: [
      'Required distribution amount: $45,000',
      'Account balance as of 12/31/2023: $580,000',
      'Client age: 74 years',
      'Life expectancy factor: 23.8',
      'Penalty for non-compliance: 25% of shortfall'
    ],
    assumptions: [
      'No other distributions taken this calendar year',
      'Account balance calculation is accurate as of prior year-end',
      'Client has no other IRA accounts requiring aggregation',
      'Distribution will be processed before December 31st deadline'
    ],
    alternatives: [
      'Take distribution in cash and client manages reinvestment',
      'Direct rollover to Roth IRA for portion not required',
      'In-kind distribution of securities to minimize cash impact',
      'Quarterly distributions next year to avoid year-end rush'
    ],
    risks: [
      'Severe IRS penalty (25% of shortfall) if deadline missed',
      'Market volatility could affect account value at distribution',
      'Tax withholding may be insufficient for client tax situation',
      'Administrative delays could impact timing'
    ]
  }
});

export const getMockInsights = (): InsightData[] => [
  createSampleInsight(),
  createTaxInsight(),
  createComplianceInsight()
];