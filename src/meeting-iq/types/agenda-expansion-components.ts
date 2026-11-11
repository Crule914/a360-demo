// @ts-nocheck
import { ClientData } from './advisor';

export type ExpansionComponentType = 
  | 'RetirementAnalysis'
  | 'CollegeSavings'
  | 'EmergencyFund'
  | 'TaxLossHarvesting'
  | 'YTDPerformance'
  | 'PortfolioRebalancing';

export interface ExpansionComponentProps {
  client: ClientData;
  bulletIndex?: number;
  sectionId: string;
  onToggleClientReview?: (sectionId: string, bulletIndex: number, checked: boolean) => void;
}

export interface ExpansionComponentInfo {
  type: ExpansionComponentType;
  label: string;
  description: string;
  category: 'planning' | 'performance' | 'tax' | 'general';
}

export const EXPANSION_COMPONENTS: ExpansionComponentInfo[] = [
  {
    type: 'RetirementAnalysis',
    label: 'Retirement Analysis',
    description: 'Detailed retirement planning projections and scenarios',
    category: 'planning'
  },
  {
    type: 'CollegeSavings',
    label: 'College Savings',
    description: '529 plan progress and education funding strategies',
    category: 'planning'
  },
  {
    type: 'EmergencyFund',
    label: 'Emergency Fund',
    description: 'Emergency fund adequacy and funding recommendations',
    category: 'planning'
  },
  {
    type: 'TaxLossHarvesting',
    label: 'Tax-Loss Harvesting',
    description: 'Tax optimization opportunities and harvest recommendations',
    category: 'tax'
  },
  {
    type: 'YTDPerformance',
    label: 'YTD Performance Analysis',
    description: 'Year-to-date performance attribution and benchmark comparison',
    category: 'performance'
  },
  {
    type: 'PortfolioRebalancing',
    label: 'Portfolio Rebalancing',
    description: 'Asset allocation analysis and rebalancing recommendations',
    category: 'performance'
  }
];