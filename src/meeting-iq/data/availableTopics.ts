// @ts-nocheck
import { AgendaTopicTemplate } from '@miq/types/custom-agenda';

export interface AvailableTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
  defaultTimeAllocation: number;
  defaultItems: { content: string; expansionComponentType?: string }[];
}

export const AVAILABLE_TOPICS: AvailableTopic[] = [
  {
    id: 'recap-past-year',
    title: 'Recap of the Past Year',
    description: 'CRM activities, communications, action items from last 12 months',
    icon: 'ClipboardList',
    defaultTimeAllocation: 10,
    defaultItems: [
      { content: 'Review CRM activities and communications' },
      { content: 'Follow up on prior action items' },
    ],
  },
  {
    id: 'kyc-profile-update',
    title: 'KYC & Profile Update',
    description: 'Update client financial situation, goals, risk tolerance, time horizon, and investment objectives',
    icon: 'UserCheck',
    defaultTimeAllocation: 10,
    defaultItems: [
      { content: 'Confirm financial situation and goals' },
      { content: 'Review risk tolerance and time horizon' },
      { content: 'Update investment objectives' },
    ],
  },
  {
    id: 'recent-activities',
    title: 'Recent Activities & Transactions',
    description: 'Account activity: transfers, contributions, withdrawals, trades',
    icon: 'ArrowRightLeft',
    defaultTimeAllocation: 10,
    defaultItems: [
      { content: 'Review recent transfers and contributions' },
      { content: 'Discuss withdrawals and trades' },
    ],
  },
  {
    id: 'portfolio-review',
    title: 'Portfolio Review & Performance Analysis',
    description: "Portfolio value, allocation, performance vs. benchmarks, diversification, top holdings, rebalancing needs — reviewed against client's current profile",
    icon: 'BarChart3',
    defaultTimeAllocation: 15,
    defaultItems: [
      { content: 'YTD portfolio performance analysis', expansionComponentType: 'YTDPerformance' },
      { content: 'Asset allocation and diversification review', expansionComponentType: 'PortfolioRebalancing' },
      { content: 'Top holdings and rebalancing needs' },
      { content: 'Performance vs. benchmarks' },
    ],
  },
  {
    id: 'fees-costs-disclosures',
    title: 'Fees, Costs & Disclosures',
    description: 'Fee review, service summary, cost transparency, any material changes to disclosures or Form CRS',
    icon: 'Receipt',
    defaultTimeAllocation: 5,
    defaultItems: [
      { content: 'Fee review and cost transparency' },
      { content: 'Service summary and disclosure updates' },
    ],
  },
  {
    id: 'conflicts-of-interest',
    title: 'Conflicts of Interest Review',
    description: 'Disclose any compensation arrangements, commissions, or incentives relevant to recommendations made this year',
    icon: 'Shield',
    defaultTimeAllocation: 5,
    defaultItems: [
      { content: 'Review compensation arrangements and commissions' },
      { content: 'Disclose relevant incentives' },
    ],
  },
  {
    id: 'financial-plan-update',
    title: 'Financial Plan Update',
    description: 'Progress toward financial goals, net worth snapshot, cash flow & budgeting, savings rate & contributions',
    icon: 'Target',
    defaultTimeAllocation: 15,
    defaultItems: [
      { content: 'Financial goal progress review' },
      { content: 'Net worth snapshot' },
      { content: 'Cash flow, budgeting, and savings rate' },
    ],
  },
  {
    id: 'retirement-planning',
    title: 'Retirement Planning',
    description: 'Retirement readiness/projections, 401(k)/IRA contributions & strategy, Social Security planning, RMDs',
    icon: 'Landmark',
    defaultTimeAllocation: 15,
    defaultItems: [
      { content: 'Retirement readiness and projections', expansionComponentType: 'RetirementAnalysis' },
      { content: '401(k)/IRA contribution strategy' },
      { content: 'Social Security planning' },
      { content: 'Required Minimum Distributions (RMDs)' },
    ],
  },
  {
    id: 'tax-planning',
    title: 'Tax Planning',
    description: 'Tax-loss harvesting, Roth conversion strategy, estimated tax payments, year-end tax planning',
    icon: 'Calculator',
    defaultTimeAllocation: 10,
    defaultItems: [
      { content: 'Tax-loss harvesting opportunities', expansionComponentType: 'TaxLossHarvesting' },
      { content: 'Roth conversion strategy' },
      { content: 'Estimated tax payments' },
      { content: 'Year-end tax planning' },
    ],
  },
  {
    id: 'estate-planning',
    title: 'Estate Planning',
    description: 'Will & trust review, beneficiary designations, gifting strategy, power of attorney & healthcare directives',
    icon: 'FileText',
    defaultTimeAllocation: 10,
    defaultItems: [
      { content: 'Will and trust review' },
      { content: 'Beneficiary designation check' },
      { content: 'Gifting strategy' },
      { content: 'Power of attorney and healthcare directives' },
    ],
  },
  {
    id: 'insurance-risk',
    title: 'Insurance & Risk',
    description: 'Life insurance review, long-term care planning, disability insurance, property & liability coverage',
    icon: 'Umbrella',
    defaultTimeAllocation: 10,
    defaultItems: [
      { content: 'Life insurance coverage assessment' },
      { content: 'Long-term care planning' },
      { content: 'Disability insurance review' },
      { content: 'Property and liability coverage' },
    ],
  },
  {
    id: 'opportunities-risks',
    title: 'Opportunities & Risks',
    description: 'Optimization opportunities, alternative investments, concentration risks, market risk considerations',
    icon: 'TrendingUp',
    defaultTimeAllocation: 10,
    defaultItems: [
      { content: 'Optimization opportunities' },
      { content: 'Alternative investment considerations' },
      { content: 'Concentration and market risk review' },
    ],
  },
  {
    id: 'life-events-goals',
    title: 'Life Events & Goals',
    description: 'Major life changes (marriage, divorce, birth, death), education planning (529s), home purchase, business interests',
    icon: 'Heart',
    defaultTimeAllocation: 10,
    defaultItems: [
      { content: 'Review major life changes' },
      { content: 'Education planning and 529s', expansionComponentType: 'CollegeSavings' },
      { content: 'Home purchase or business interests' },
    ],
  },
  {
    id: 'actions-recommendations',
    title: 'Actions & Recommendations',
    description: 'Next steps and action items',
    icon: 'CheckSquare',
    defaultTimeAllocation: 10,
    defaultItems: [
      { content: 'Document agreed-upon action items' },
      { content: 'Schedule follow-up meetings' },
      { content: 'Assign responsibilities and deadlines' },
    ],
  },
];

export interface StandardTemplate {
  id: string;
  name: string;
  description: string;
  topicIds: string[];
  meetingType: string;
  clientCategories: string[];
}

export const STANDARD_TEMPLATES: StandardTemplate[] = [
  {
    id: 'annual-review',
    name: 'Default Annual Review',
    description: 'Comprehensive yearly review covering all key planning areas.',
    topicIds: ['recap-past-year', 'kyc-profile-update', 'portfolio-review', 'financial-plan-update', 'tax-planning', 'estate-planning', 'actions-recommendations'],
    meetingType: 'Annual Review',
    clientCategories: ['Platinum', 'Gold', 'Silver', 'Bronze'],
  },
  {
    id: 'quarterly-checkin',
    name: 'Quarterly Check-in',
    description: 'Focused quarterly performance update and action items.',
    topicIds: ['recent-activities', 'portfolio-review', 'opportunities-risks', 'actions-recommendations'],
    meetingType: 'Quarterly Update',
    clientCategories: ['Platinum', 'Gold', 'Silver', 'Bronze'],
  },
  {
    id: 'new-client-onboarding',
    name: 'New Client Onboarding',
    description: 'Initial meeting to establish goals, risk tolerance, and planning framework.',
    topicIds: ['kyc-profile-update', 'financial-plan-update', 'portfolio-review', 'insurance-risk', 'actions-recommendations'],
    meetingType: 'Initial Consultation',
    clientCategories: ['Gold', 'Silver', 'Bronze'],
  },
  {
    id: 'retirement-planning-review',
    name: 'Retirement Planning Review',
    description: 'Deep dive into retirement readiness, income planning, and Social Security strategies.',
    topicIds: ['retirement-planning', 'portfolio-review', 'tax-planning', 'estate-planning', 'actions-recommendations'],
    meetingType: 'Retirement Planning',
    clientCategories: ['Platinum', 'Gold'],
  },
  {
    id: 'high-net-worth',
    name: 'High Net Worth Review',
    description: 'Comprehensive review for high-net-worth clients including estate and tax strategies.',
    topicIds: ['recap-past-year', 'kyc-profile-update', 'portfolio-review', 'fees-costs-disclosures', 'conflicts-of-interest', 'tax-planning', 'estate-planning', 'actions-recommendations'],
    meetingType: 'HNW Review',
    clientCategories: ['Platinum'],
  },
];

export function topicFromAvailable(availableTopic: AvailableTopic, order: number): AgendaTopicTemplate {
  return {
    id: availableTopic.id,
    title: availableTopic.title,
    description: availableTopic.description,
    icon: availableTopic.icon,
    timeAllocation: availableTopic.defaultTimeAllocation,
    order,
    items: availableTopic.defaultItems.map((item, idx) => ({
      id: `item-${idx + 1}`,
      content: item.content,
      order: idx + 1,
      includeInClientReview: false,
      expansionComponentType: item.expansionComponentType,
    })),
  };
}
