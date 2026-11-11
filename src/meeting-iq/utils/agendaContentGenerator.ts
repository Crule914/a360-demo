// @ts-nocheck
import { ClientData } from '@miq/types/advisor';
import { 
  DetailedAgendaContent, 
  ConfidenceBuilder, 
  ActionableInsight, 
  DataPoint, 
  SupportingMaterial 
} from '@miq/types/agenda-enhancement';
import { formatCurrency } from '@miq/utils/formatters';

export class AgendaContentGenerator {
  static generateOpeningContent(client: ClientData): DetailedAgendaContent {
    const confidenceBuilders: ConfidenceBuilder[] = [];
    const dataPoints: DataPoint[] = [];
    
    // Career and income achievements
    if (client.keyMetrics?.portfolioReturn && client.keyMetrics.portfolioReturn > 0) {
      confidenceBuilders.push({
        category: 'performance',
        achievement: 'Strong Investment Performance',
        impact: `Your disciplined investment approach delivered ${client.keyMetrics.portfolioReturn > 0 ? '+' : ''}${client.keyMetrics.portfolioReturn.toFixed(1)}% returns, outperforming expectations.`,
        metrics: {
          before: '0%',
          after: `${client.keyMetrics.portfolioReturn.toFixed(1)}%`,
          improvement: 'Portfolio growth on track'
        }
      });
    }

    // Net worth and asset growth
    if (client.householdAssets) {
      confidenceBuilders.push({
        category: 'financial',
        achievement: 'Growing Net Worth',
        impact: `Your total household assets of ${formatCurrency(client.householdAssets)} reflect consistent saving and smart investment decisions.`,
      });

      dataPoints.push({
        label: 'Total Household Assets',
        value: formatCurrency(client.householdAssets),
        context: 'Strong financial foundation providing security and options',
        trend: 'up'
      });
    }

    // Emergency fund assessment
    const emergencyFundAmount = Math.min(client.householdAssets * 0.05, 100000);
    confidenceBuilders.push({
      category: 'planning',
      achievement: 'Emergency Fund Strength',
      impact: `Adequate liquidity reserves of approximately ${formatCurrency(emergencyFundAmount)} provide financial security and peace of mind.`,
    });

    return {
      sections: [{
        title: 'Confidence-Building Stories',
        content: 'Your financial journey is marked by meaningful progress and resilience. Today we\'ll celebrate the achievements that define your family\'s financial strength.',
        bullets: confidenceBuilders.map(cb => `${cb.achievement}: ${cb.impact}`)
      }],
      confidenceBuilders,
      actionableInsights: [{
        insight: 'Strong financial foundation established',
        recommendation: 'Continue current disciplined approach while exploring growth opportunities',
        urgency: 'low',
        expectedOutcome: 'Sustained long-term wealth accumulation',
        timeframe: 'Ongoing'
      }],
      dataPoints,
      urgencyLevel: 'low',
      estimatedOutcomes: [
        'Increased client confidence in financial strategy',
        'Positive meeting tone established',
        'Foundation set for productive discussion'
      ]
    };
  }

  static generatePortfolioContent(client: ClientData): DetailedAgendaContent {
    const dataPoints: DataPoint[] = [];
    const actionableInsights: ActionableInsight[] = [];
    
    const portfolioValue = client.portfolioData?.totalValue || client.householdAssets * 0.8;
    const ytdReturn = client.keyMetrics?.portfolioReturn || 8.4;
    const benchmarkReturn = 7.2; // Consistent benchmark across all components
    
    dataPoints.push(
      {
        label: 'Portfolio Value',
        value: formatCurrency(portfolioValue),
        context: 'Total invested assets across all accounts',
        trend: ytdReturn > 0 ? 'up' : 'down'
      },
      {
        label: 'YTD Return',
        value: `${ytdReturn > 0 ? '+' : ''}${ytdReturn.toFixed(1)}%`,
        context: 'Year-to-date performance',
        trend: ytdReturn > benchmarkReturn ? 'up' : 'down',
        comparison: {
          benchmark: `${benchmarkReturn.toFixed(1)}%`,
          performance: ytdReturn > benchmarkReturn ? 'outperform' : 'underperform'
        }
      }
    );

    // Generate insights based on performance
    if (ytdReturn > benchmarkReturn) {
      actionableInsights.push({
        insight: `Portfolio outperformance of +${(ytdReturn - benchmarkReturn).toFixed(1)}% above benchmark demonstrates effective strategy`,
        recommendation: 'Consider rebalancing to maintain target allocation while protecting gains',
        urgency: 'medium',
        expectedOutcome: 'Sustained outperformance with managed risk',
        timeframe: 'Next 30 days'
      });
    }

    // Asset allocation analysis
    const sections = [{
      title: 'Current Position & Performance',
      content: `Your financial foundation shows strength with ${formatCurrency(portfolioValue)} in invested assets delivering ${ytdReturn > 0 ? '+' : ''}${ytdReturn.toFixed(1)}% YTD performance.`,
      bullets: [
        `Portfolio Value: ${formatCurrency(portfolioValue)}`,
        `YTD Performance: ${ytdReturn > 0 ? '+' : ''}${ytdReturn.toFixed(1)}% vs ${benchmarkReturn.toFixed(1)}% benchmark`,
        `Outperformance: ${ytdReturn > benchmarkReturn ? '+' : ''}${(ytdReturn - benchmarkReturn).toFixed(1)}%`,
        'Strong diversification across asset classes'
      ],
      subsections: [{
        title: 'Strengths',
        content: 'Portfolio demonstrates solid fundamentals',
        bullets: [
          'Consistent outperformance vs benchmark',
          'Appropriate risk-adjusted returns',
          'Effective diversification strategy'
        ]
      }, {
        title: 'Areas for Discussion',
        content: 'Opportunities to optimize and enhance',
        bullets: [
          'Rebalancing opportunities in growth sectors',
          'Tax-loss harvesting potential',
          'ESG integration possibilities'
        ]
      }]
    }];

    return {
      sections,
      confidenceBuilders: [{
        category: 'performance',
        achievement: 'Investment Outperformance',
        impact: `Portfolio delivered ${ytdReturn > 0 ? '+' : ''}${ytdReturn.toFixed(1)}% vs ${benchmarkReturn.toFixed(1)}% benchmark, demonstrating effective investment strategy.`,
        metrics: {
          before: `${benchmarkReturn.toFixed(1)}%`,
          after: `${ytdReturn.toFixed(1)}%`,
          improvement: `+${(ytdReturn - benchmarkReturn).toFixed(1)}% outperformance`
        }
      }],
      actionableInsights,
      dataPoints,
      urgencyLevel: ytdReturn < benchmarkReturn ? 'medium' : 'low',
      estimatedOutcomes: [
        'Clear understanding of portfolio performance',
        'Alignment on strategic positioning',
        'Specific action items for optimization'
      ]
    };
  }

  static generateComplianceContent(client: ClientData): DetailedAgendaContent {
    const complianceItems = client.keyMetrics?.complianceItems || [];
    const urgentItems = complianceItems.filter(item => item.priority === 'high');
    
    const actionableInsights: ActionableInsight[] = urgentItems.map(item => ({
      insight: `${item.type} requires immediate attention`,
      recommendation: item.description || 'Review and complete required documentation',
      urgency: 'high',
      expectedOutcome: 'Compliance maintained and regulatory requirements met',
      timeframe: '30 days'
    }));

    const dataPoints: DataPoint[] = [
      {
        label: 'Total Compliance Items',
        value: complianceItems.length,
        context: 'Outstanding compliance and regulatory items',
        trend: 'stable'
      },
      {
        label: 'High Priority Items',
        value: urgentItems.length,
        context: 'Items requiring immediate attention',
        trend: urgentItems.length > 0 ? 'up' : 'stable'
      }
    ];

    const sections = [{
      title: 'Compliance & Documentation Review',
      content: `We need to address ${complianceItems.length} compliance items, including ${urgentItems.length} high-priority requirements.`,
      bullets: complianceItems.map(item => 
        `${item.type} (${item.priority} priority): ${item.description || 'Pending completion'}`
      )
    }];

    return {
      sections,
      confidenceBuilders: [],
      actionableInsights,
      dataPoints,
      urgencyLevel: urgentItems.length > 0 ? 'high' : 'medium',
      estimatedOutcomes: [
        'All compliance requirements addressed',
        'Regulatory documentation updated',
        'Clear timeline for completion'
      ]
    };
  }

  static generateSupportingMaterials(category: string, client?: ClientData): SupportingMaterial[] {
    switch (category) {
      case 'portfolio':
        return [
          {
            id: 'portfolio-allocation',
            type: 'chart',
            title: 'Asset Allocation Overview',
            description: 'Current vs target allocation with rebalancing recommendations',
            category: 'Portfolio Analysis',
            relevanceScore: 0.95,
            urgency: 'medium',
            visualType: 'pie-chart',
            chartData: {
              labels: ['Large Cap Stocks', 'International Equity', 'Fixed Income', 'REITs', 'Cash & Equivalents'],
              datasets: [{
                label: 'Current Allocation',
                data: [45, 20, 25, 7, 3],
                backgroundColor: ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))', 'hsl(var(--border))']
              }]
            },
            keyInsights: [
              'Large cap allocation 5% above target (45% vs 40%)',
              'Fixed income underweighted by 3% for risk profile',
              'International exposure within acceptable range'
            ],
            actionItems: [
              'Consider rebalancing $125,000 from large cap to fixed income',
              'Review international allocation after Q1 performance'
            ]
          },
          {
            id: 'performance-timeline',
            type: 'chart',
            title: 'Performance vs Benchmark (3-Year)',
            description: 'Rolling 12-month returns compared to benchmark with key events annotated',
            category: 'Performance Review',
            relevanceScore: 0.92,
            urgency: 'low',
            visualType: 'line-chart',
            chartData: {
              labels: ['Jan 2022', 'Apr 2022', 'Jul 2022', 'Oct 2022', 'Jan 2023', 'Apr 2023', 'Jul 2023', 'Oct 2023', 'Jan 2024', 'Apr 2024', 'Jul 2024', 'Oct 2024'],
              datasets: [
                {
                  label: 'Portfolio Return',
                  data: [-2.1, -8.4, -12.6, -18.2, -5.8, 4.2, 8.7, 11.3, 18.2, 22.1, 19.8, 24.5],
                  borderColor: 'hsl(var(--primary))',
                  fill: false
                },
                {
                  label: 'S&P 500',
                  data: [-1.8, -7.9, -11.2, -16.8, -4.2, 6.1, 10.2, 12.8, 19.7, 21.3, 18.9, 22.8],
                  borderColor: 'hsl(var(--muted-foreground))',
                  fill: false
                }
              ]
            },
            keyInsights: [
              'Outperformed benchmark by 1.7% over 3-year period',
              'Lower volatility during 2022 market decline',
              'Strong recovery performance in 2023-2024'
            ]
          },
          {
            id: 'holdings-analysis',
            type: 'analysis',
            title: 'Top Holdings Performance Attribution',
            description: 'Contribution analysis of top 10 holdings to overall portfolio performance',
            category: 'Portfolio Analysis',
            relevanceScore: 0.88,
            urgency: 'low',
            visualType: 'table',
            tableData: {
              headers: ['Holding', 'Weight', 'YTD Return', 'Contribution', 'vs Benchmark'],
              rows: [
                ['TESLA INC', '8.2%', '+15.4%', '+1.26%', '+2.1%'],
                ['AMAZON.COM', '6.8%', '+12.1%', '+0.82%', '+0.8%'],
                ['MICROSOFT CORP', '6.5%', '+18.7%', '+1.22%', '+1.9%'],
                ['VANGUARD S&P 500 ETF', '12.1%', '+11.2%', '+1.35%', 'Benchmark'],
                ['ISHARES CORE INTL', '8.9%', '+8.9%', '+0.79%', '+1.2%']
              ]
            },
            keyInsights: [
              'Top 5 holdings contribute 5.44% to YTD performance',
              'Technology overweight driving outperformance',
              'International allocation providing diversification benefit'
            ]
          },
          {
            id: 'risk-metrics',
            type: 'analysis',
            title: 'Risk & Volatility Analysis',
            description: 'Portfolio risk metrics including Sharpe ratio, beta, and downside capture',
            category: 'Risk Management',
            relevanceScore: 0.85,
            visualType: 'table',
            tableData: {
              headers: ['Metric', 'Portfolio', 'Benchmark', 'Assessment'],
              rows: [
                ['Sharpe Ratio (3yr)', '1.24', '1.18', 'Above Benchmark'],
                ['Beta', '0.92', '1.00', 'Lower Risk'],
                ['Standard Deviation', '14.2%', '15.1%', 'Lower Volatility'],
                ['Max Drawdown', '-19.8%', '-23.1%', 'Better Downside Protection'],
                ['Upside Capture', '96.4%', '100%', 'Good Upside Participation'],
                ['Downside Capture', '84.2%', '100%', 'Excellent Downside Protection']
              ]
            },
            keyInsights: [
              'Portfolio exhibits lower risk with comparable returns',
              'Strong downside protection during market declines',
              'Slight underperformance in strong up markets acceptable for risk profile'
            ]
          }
        ];
        
      case 'planning':
        return [
          {
            id: 'retirement-projection',
            type: 'projection',
            title: 'Monte Carlo Retirement Analysis',
            description: 'Probability of achieving retirement goals under various market scenarios',
            category: 'Retirement Planning',
            relevanceScore: 0.95,
            urgency: 'high',
            visualType: 'bar-chart',
            chartData: {
              labels: ['25th Percentile', '50th Percentile', '75th Percentile', '90th Percentile'],
              datasets: [{
                label: 'Portfolio Value at Age 65',
                data: [2400000, 3200000, 4100000, 5300000],
                backgroundColor: ['hsl(var(--destructive))', 'hsl(var(--warning))', 'hsl(var(--primary))', 'hsl(var(--success))']
              }]
            },
            calculatorData: {
              inputs: [
                { label: 'Current Age', value: 45, type: 'number' },
                { label: 'Retirement Age', value: 65, type: 'number' },
                { label: 'Current Savings', value: 1250000, type: 'currency' },
                { label: 'Annual Contribution', value: 75000, type: 'currency' },
                { label: 'Expected Return', value: 7.2, type: 'percentage' }
              ],
              outputs: [
                { label: 'Success Probability', value: '87%', highlight: true },
                { label: 'Median Portfolio Value', value: '$3,200,000', highlight: true },
                { label: 'Safe Withdrawal Rate', value: '3.8%', highlight: false },
                { label: 'Annual Income Potential', value: '$121,600', highlight: false }
              ]
            },
            keyInsights: [
              '87% probability of meeting retirement income goals',
              'Consider increasing contributions if possible to reach 90%+ confidence',
              'Current trajectory supports $120k+ annual retirement income'
            ],
            actionItems: [
              'Review contribution levels after salary increase',
              'Consider Roth conversion strategies',
              'Update beneficiary designations'
            ]
          },
          {
            id: 'education-funding',
            type: 'calculator',
            title: 'Education Funding Analysis',
            description: 'College cost projections and 529 plan optimization for Emma and Lucas',
            category: 'Education Planning',
            relevanceScore: 0.93,
            urgency: 'critical',
            visualType: 'calculator',
            calculatorData: {
              inputs: [
                { label: 'Emma - Current Age', value: 17, type: 'number' },
                { label: 'Lucas - Current Age', value: 14, type: 'number' },
                { label: 'Current 529 Balance (Emma)', value: 85000, type: 'currency' },
                { label: 'Current 529 Balance (Lucas)', value: 42000, type: 'currency' },
                { label: 'Annual College Cost (Today)', value: 45000, type: 'currency' },
                { label: 'Education Inflation Rate', value: 5.5, type: 'percentage' }
              ],
              outputs: [
                { label: 'Emma - Total Need (UC Berkeley)', value: '$196,200', highlight: true },
                { label: 'Emma - Funding Gap', value: '$28,400', highlight: true },
                { label: 'Lucas - Projected Total Need', value: '$267,800', highlight: true },
                { label: 'Lucas - Funding Gap', value: '$189,300', highlight: true }
              ]
            },
            keyInsights: [
              'Emma\'s funding nearly complete with current 529 balance',
              'Lucas requires significant catch-up contributions',
              'Consider increasing 529 contributions by $800/month for Lucas'
            ],
            actionItems: [
              'Plan 529 withdrawals for Emma\'s fall semester',
              'Increase Lucas 529 contributions to $1,200/month',
              'Research education tax credits and benefits'
            ]
          },
          {
            id: 'cash-flow-analysis',
            type: 'projection',
            title: 'Cash Flow Projection (5-Year)',
            description: 'Detailed income and expense projections including life events',
            category: 'Financial Planning',
            relevanceScore: 0.89,
            visualType: 'line-chart',
            chartData: {
              labels: ['2024', '2025', '2026', '2027', '2028'],
              datasets: [
                {
                  label: 'Net Income',
                  data: [184500, 195800, 201400, 187200, 192800],
                  borderColor: 'hsl(var(--primary))',
                  fill: false
                },
                {
                  label: 'Total Expenses',
                  data: [132000, 165400, 148200, 143800, 147600],
                  borderColor: 'hsl(var(--destructive))',
                  fill: false
                },
                {
                  label: 'Net Cash Flow',
                  data: [52500, 30400, 53200, 43400, 45200],
                  borderColor: 'hsl(var(--success))',
                  fill: false
                }
              ]
            },
            keyInsights: [
              'Cash flow tightens significantly in 2025 due to college expenses',
              'Recovery expected in 2026 as Emma graduates',
              'Sarah\'s potential early retirement in 2027 manageable'
            ]
          }
        ];
        
      case 'compliance':
        return [
          {
            id: 'rmd-calculator',
            type: 'calculator',
            title: 'Required Minimum Distribution Analysis',
            description: 'IRA RMD calculations and tax-efficient distribution strategies',
            category: 'Tax & Compliance',
            relevanceScore: 0.96,
            urgency: 'critical',
            visualType: 'calculator',
            calculatorData: {
              inputs: [
                { label: 'Traditional IRA Balance', value: 485000, type: 'currency' },
                { label: 'Current Age', value: 74, type: 'number' },
                { label: 'Life Expectancy Factor', value: 23.8, type: 'number' },
                { label: 'Marginal Tax Rate', value: 24, type: 'percentage' }
              ],
              outputs: [
                { label: '2024 RMD Required', value: '$20,378', highlight: true },
                { label: 'Estimated Tax Liability', value: '$4,891', highlight: true },
                { label: 'Net Distribution', value: '$15,487', highlight: false },
                { label: 'Deadline', value: 'December 31, 2024', highlight: true }
              ]
            },
            keyInsights: [
              'RMD must be completed by December 31st to avoid 25% penalty',
              'Consider qualified charitable distribution to reduce tax impact',
              'Timing distributions with other income to optimize tax bracket'
            ],
            actionItems: [
              'Schedule RMD distribution before year-end',
              'Review QCD opportunities with charity goals',
              'Coordinate with tax preparer for optimal timing'
            ]
          },
          {
            id: 'tax-loss-harvesting',
            type: 'analysis',
            title: 'Tax-Loss Harvesting Opportunities',
            description: 'Analysis of unrealized losses and tax optimization strategies',
            category: 'Tax Strategy',
            relevanceScore: 0.91,
            urgency: 'medium',
            visualType: 'table',
            tableData: {
              headers: ['Holding', 'Current Value', 'Cost Basis', 'Unrealized Loss', 'Potential Tax Savings'],
              rows: [
                ['META PLATFORMS', '$45,200', '$52,800', '-$7,600', '$1,824'],
                ['NETFLIX INC', '$28,400', '$31,900', '-$3,500', '$840'],
                ['ZOOM VIDEO', '$12,100', '$15,600', '-$3,500', '$840'],
                ['PELOTON INTERACTIVE', '$8,200', '$18,700', '-$10,500', '$2,520']
              ]
            },
            keyInsights: [
              'Total harvestable losses: $25,100',
              'Potential tax savings: $6,024 at 24% rate',
              'Wash sale rules require 31-day holding period'
            ],
            actionItems: [
              'Execute tax-loss harvesting on PTON position',
              'Consider similar ETF substitutions to maintain exposure',
              'Schedule implementation before December 1st'
            ]
          },
          {
            id: 'estate-planning-review',
            type: 'document',
            title: 'Estate Plan Update Checklist',
            description: 'Review of current estate planning documents and recommended updates',
            category: 'Estate Planning',
            relevanceScore: 0.87,
            urgency: 'medium',
            visualType: 'table',
            tableData: {
              headers: ['Document', 'Last Updated', 'Status', 'Action Required'],
              rows: [
                ['Will', '2021-03-15', 'Review Needed', 'Update beneficiaries after children\'s age changes'],
                ['Trust Documents', '2023-08-20', 'Current', 'No action required'],
                ['Power of Attorney', '2021-03-15', 'Review Needed', 'Consider updating agents'],
                ['Beneficiary Designations', '2022-11-10', 'Review Needed', 'Update 401k and IRA beneficiaries'],
                ['Healthcare Directive', '2021-03-15', 'Expired', 'Update required - past 3-year mark']
              ]
            },
            keyInsights: [
              'Healthcare directive requires immediate update',
              'Beneficiary designations should reflect current family situation',
              'Consider trust funding strategies for tax efficiency'
            ],
            actionItems: [
              'Schedule meeting with estate planning attorney',
              'Update all beneficiary designations',
              'Review trust funding and asset titling'
            ]
          }
        ];
        
      case 'tax':
        return [
          {
            id: 'tax-optimization',
            type: 'analysis',
            title: 'Tax Optimization Strategies',
            description: 'Current year tax planning and loss harvesting opportunities',
            category: 'Tax Planning',
            relevanceScore: 0.90,
            urgency: 'high',
            keyInsights: [
              'Consider Roth conversion before year-end',
              'Tax-loss harvesting opportunities in growth stocks',
              'Review charitable giving strategies'
            ],
            actionItems: [
              'Schedule tax planning meeting with CPA',
              'Execute tax-loss harvesting trades',
              'Evaluate Roth conversion amount'
            ]
          }
        ];
      
      case 'compliance':
        return [
          {
            id: 'compliance-review',
            type: 'document',
            title: 'Regulatory Compliance Review',
            description: 'Outstanding documentation and beneficiary updates required',
            category: 'Compliance',
            relevanceScore: 0.95,
            urgency: 'critical',
            keyInsights: [
              'Beneficiary designations require immediate update',
              'Investment policy statement needs annual review',
              'Form ADV delivery pending'
            ],
            actionItems: [
              'Update all beneficiary designations',
              'Review and sign investment policy statement',
              'Acknowledge receipt of Form ADV'
            ]
          }
        ];
      
      case 'market':
        return [
          {
            id: 'market-context',
            type: 'analysis',
            title: 'Market Impact Analysis',
            description: 'How current market conditions affect your specific portfolio',
            category: 'Market Context',
            relevanceScore: 0.85,
            urgency: 'medium',
            keyInsights: [
              'Fed policy changes may impact bond allocation',
              'Technology sector volatility affecting growth positions',
              'International markets providing diversification benefit'
            ],
            actionItems: [
              'Monitor interest rate sensitivity',
              'Consider rebalancing technology allocation',
              'Evaluate emerging market exposure'
            ]
          }
        ];

      default:
        return [];
    }
  }
}