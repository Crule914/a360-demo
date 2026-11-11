// @ts-nocheck
import { ClientData } from '@miq/types/advisor';
import { formatCurrency, formatPercentage } from './formatters';

export interface StatTile {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'stable';
  trendLabel?: string;
}

export interface InsightItem {
  title: string;
  description: string;
  recommendation?: string;
}

export interface ClientReviewMetrics {
  stats: StatTile[];
  insights: InsightItem[];
  analysis: string;
}

export const extractClientReviewMetrics = (
  client: ClientData,
  quadrantId: string,
  bulletIndex?: number
): ClientReviewMetrics => {
  switch (quadrantId) {
    case 'planning-goals':
      return extractPlanningGoalsMetrics(client, bulletIndex);
    case 'portfolio-performance':
      return extractPortfolioMetrics(client, bulletIndex);
    case 'next-actions':
      return extractNextActionsMetrics(client, bulletIndex);
    default:
      return { stats: [], insights: [], analysis: '' };
  }
};

const extractPlanningGoalsMetrics = (client: ClientData, bulletIndex?: number): ClientReviewMetrics => {
  if (bulletIndex === 0) {
    // Retirement planning
    return {
      stats: [
        { label: 'Current Savings', value: formatCurrency(845000) },
        { label: 'Target Amount', value: formatCurrency(1500000) },
        { label: 'Monthly Contribution', value: formatCurrency(3200) },
        { label: 'Timeline Progress', value: '56.3%', trend: 'up', trendLabel: 'On Track' }
      ],
      insights: [
        {
          title: '401(k) Optimization',
          description: 'Increase contribution to 15% to maximize employer match',
          recommendation: 'Update payroll deductions'
        },
        {
          title: 'Roth Conversion Window',
          description: 'Optimal opportunity for $15,000 conversion this year',
          recommendation: 'Execute before year-end'
        }
      ],
      analysis: 'Current retirement savings show strong progress at 56.3% of target. The growth trajectory indicates you\'re on track to meet your $1.5M goal. Maximizing employer match and considering Roth conversions could accelerate progress.'
    };
  }

  if (bulletIndex === 1) {
    // College savings
    return {
      stats: [
        { label: 'Current 529 Balance', value: formatCurrency(85000) },
        { label: '2029 Target', value: formatCurrency(180000) },
        { label: 'Monthly Contribution', value: formatCurrency(1200) },
        { label: 'Goal Progress', value: '47.2%', trend: 'up' }
      ],
      insights: [
        {
          title: 'Monthly Contribution Gap',
          description: 'Need to increase monthly savings to meet 2029 target',
          recommendation: 'Increase to $1,500/month'
        },
        {
          title: 'Tax Benefits',
          description: 'State tax deduction available for 529 contributions',
          recommendation: 'Maximize state tax benefits'
        }
      ],
      analysis: 'College savings at 47.2% of target with 5 years remaining. Current contributions need to increase from $1,200 to $1,500 monthly to bridge the gap. State tax benefits provide additional incentive for higher contributions.'
    };
  }

  // Default/Emergency fund
  return {
    stats: [
      { label: 'Emergency Fund', value: formatCurrency(45000) },
      { label: 'Target (6 months)', value: formatCurrency(60000) },
      { label: 'Monthly Expenses', value: formatCurrency(10000) },
      { label: 'Coverage', value: '4.5 months', trend: 'stable' }
    ],
    insights: [
      {
        title: 'Coverage Gap',
        description: 'Emergency fund covers 4.5 months vs. recommended 6 months',
        recommendation: 'Add $15,000 to reach full 6-month target'
      }
      ],
      analysis: 'Emergency fund covers 4.5 months of expenses versus the recommended 6 months. Adding $15,000 would achieve full coverage and provide better financial security for unexpected events.'
    };
};

const extractPortfolioMetrics = (client: ClientData, bulletIndex?: number): ClientReviewMetrics => {
  if (bulletIndex === 0) {
    // Portfolio rebalancing
    return {
      stats: [
        { label: 'Days Since Rebalance', value: '127 days' },
        { label: 'Max Drift', value: '+4.2%', trend: 'down', trendLabel: 'Action Needed' },
        { label: 'US Stocks', value: '65%' },
        { label: 'Rebalance Status', value: 'Complete', trend: 'up' }
      ],
      insights: [
        {
          title: 'Rebalancing Complete',
          description: 'Portfolio now aligned with strategic targets',
          recommendation: 'Monitor performance vs targets quarterly'
        },
        {
          title: 'Tax-Efficient Execution',
          description: 'Rebalancing executed primarily in tax-advantaged accounts',
          recommendation: 'Continue this approach for future rebalancing'
        }
      ],
      analysis: 'Portfolio rebalancing completed successfully, bringing allocations back to strategic targets. The 127-day drift correction was executed tax-efficiently. Monitor quarterly to prevent excessive drift from occurring again.'
    };
  }

  if (bulletIndex === 1) {
    // Interest rate impact
    return {
      stats: [
        { label: 'Fed Funds Rate', value: '5.25%' },
        { label: 'Bond Duration', value: '4.8 years' },
        { label: 'Rate Sensitivity', value: 'Moderate' },
        { label: 'Impact Range', value: '-10% to +15%' }
      ],
      insights: [
        {
          title: 'Balanced Duration Strategy',
          description: 'Current bond duration provides good balance between yield and sensitivity',
          recommendation: 'Maintain current duration strategy in this rate environment'
        },
        {
          title: 'Short-Term Opportunity',
          description: 'High short-term rates create attractive cash allocation opportunities',
          recommendation: 'Consider laddering short-term CDs or Treasury bills'
        }
      ],
      analysis: 'Current interest rate environment creates both risks and opportunities. Bond duration of 4.8 years provides balanced exposure. High short-term rates make cash alternatives attractive for tactical allocation adjustments.'
    };
  }

  // Default/International exposure
  return {
    stats: [
      { label: 'US Allocation', value: '65%' },
      { label: 'International', value: '35%' },
      { label: 'US Performance', value: '+11.2%', trend: 'up' },
      { label: 'International', value: '+6.8%', trend: 'up' }
    ],
    insights: [
      {
        title: 'Appropriate Diversification',
        description: 'Current international allocation provides good diversification',
        recommendation: 'Maintain current allocation strategy'
      }
      ],
      analysis: 'International allocation at 35% provides appropriate diversification. US markets have outperformed recently but maintaining global exposure helps manage long-term risk and capture opportunities across regions.'
    };
};

const extractNextActionsMetrics = (client: ClientData, bulletIndex?: number): ClientReviewMetrics => {
  if (bulletIndex === 0) {
    // 401(k) optimization
    return {
      stats: [
        { label: 'Current Contribution', value: formatCurrency(18000) },
        { label: '2024 Limit', value: formatCurrency(30500) },
        { label: 'Remaining Room', value: formatCurrency(12500), trend: 'up' },
        { label: 'Employer Match', value: formatCurrency(6000) }
      ],
      insights: [
        {
          title: 'Maximize 401(k) Contributions',
          description: 'Opportunity to increase contributions to annual limit',
          recommendation: 'Update payroll deductions to increase contribution rate'
        },
        {
          title: 'Catch-up Contributions',
          description: 'Take advantage of additional $7,500 if age 50+',
          recommendation: 'Enable catch-up contributions if eligible'
        }
      ],
      analysis: 'Significant opportunity exists with $12,500 remaining contribution room for 2024. Increasing contributions would provide immediate tax benefits while building retirement wealth. Consider catch-up contributions if age-eligible.'
    };
  }

  if (bulletIndex === 1) {
    // Insurance review
    return {
      stats: [
        { label: 'Life Insurance', value: formatCurrency(500000) },
        { label: 'Recommended', value: formatCurrency(750000) },
        { label: 'Coverage Gap', value: formatCurrency(250000), trend: 'down' },
        { label: 'Disability Insurance', value: formatCurrency(5000) + '/month' }
      ],
      insights: [
        {
          title: 'Life Insurance Gap',
          description: 'Current coverage falls short of recommended amount',
          recommendation: 'Obtain quotes for additional term life insurance'
        },
        {
          title: 'Disability Coverage Adequate',
          description: 'Current disability insurance meets 60% income replacement',
          recommendation: 'Review coverage annually with salary changes'
        }
      ],
      analysis: 'Life insurance shows a $250,000 coverage gap versus recommendations. Disability coverage meets the 60% replacement target. Obtaining quotes for additional term life insurance should be prioritized given the significant shortfall.'
    };
  }

  // Default/Roth conversion
  return {
    stats: [
      { label: 'Traditional IRA', value: formatCurrency(125000) },
      { label: 'Recommended Conversion', value: formatCurrency(25000) },
      { label: 'Tax Cost', value: formatCurrency(6000) },
      { label: 'Tax Bracket', value: '24%' }
    ],
    insights: [
      {
        title: 'Optimal Conversion Window',
        description: 'Current tax bracket provides good conversion opportunity',
        recommendation: 'Execute $25,000 conversion before year-end'
      }
      ],
      analysis: 'Current 24% tax bracket creates an optimal window for Roth conversions. Converting $25,000 would cost $6,000 in taxes but provide tax-free growth and withdrawals in retirement. Execute before year-end to maximize benefits.'
    };
};