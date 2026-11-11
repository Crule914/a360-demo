// @ts-nocheck
export interface CustomAgendaTemplate {
  id: string;
  clientId: string;
  name: string;
  topics: AgendaTopicTemplate[];
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface AgendaTopicTemplate {
  id: string;
  title: string;
  description?: string;
  icon: string;
  timeAllocation: number;
  order: number;
  items: AgendaItemTemplate[];
}

export interface AgendaItemTemplate {
  id: string;
  content: string;
  order: number;
  includeInClientReview: boolean;
  expansionComponentType?: string;
  isUserAdded?: boolean;
}

export interface ClientAgendaSettings {
  clientId: string;
  useCustomTemplate: boolean;
  customTemplateId?: string;
  lastUpdated: Date | string;
}

export interface AgendaTemplatePreview {
  template: CustomAgendaTemplate;
  estimatedDuration: number;
  topicCount: number;
  itemCount: number;
}

// Default template structure for fallback
export const DEFAULT_AGENDA_TEMPLATE: Omit<CustomAgendaTemplate, 'id' | 'clientId' | 'createdAt' | 'updatedAt'> = {
  name: 'Standard Meeting Agenda',
  isActive: true,
  topics: [
    {
      id: 'planning-goals',
      title: 'Planning & Goals',
      description: 'Review progress toward your financial goals and identify opportunities for optimization. We\'ll examine your retirement readiness, education funding, emergency preparedness, and tax efficiency strategies.',
      icon: 'Target',
      timeAllocation: 15,
      order: 1,
      items: [
        { id: 'item-1', content: 'Retirement planning progress review', order: 1, includeInClientReview: false, expansionComponentType: 'RetirementAnalysis' },
        { id: 'item-2', content: 'College savings goal assessment', order: 2, includeInClientReview: false, expansionComponentType: 'CollegeSavings' },
        { id: 'item-3', content: 'Emergency fund status check', order: 3, includeInClientReview: false, expansionComponentType: 'EmergencyFund' },
        { id: 'item-4', content: 'Tax planning opportunities', order: 4, includeInClientReview: false, expansionComponentType: 'TaxLossHarvesting' },
      ],
    },
    {
      id: 'portfolio-performance',
      title: 'Portfolio Performance & Market Insights',
      description: 'Analyze your portfolio performance against benchmarks and review recent market developments. We\'ll discuss your investment strategy, rebalancing activities, and how current market conditions may impact your long-term objectives.',
      icon: 'BarChart3',
      timeAllocation: 15,
      order: 2,
      items: [
        { id: 'item-1', content: 'YTD portfolio performance analysis', order: 1, includeInClientReview: false, expansionComponentType: 'YTDPerformance' },
        { id: 'item-2', content: 'Recent portfolio rebalancing updates', order: 2, includeInClientReview: false, expansionComponentType: 'PortfolioRebalancing' },
        { id: 'item-3', content: 'Asset allocation adjustments', order: 3, includeInClientReview: false },
        { id: 'item-4', content: 'Market outlook and strategy', order: 4, includeInClientReview: false },
      ],
    },
    {
      id: 'next-actions',
      title: 'Suggested Next Actions',
      description: 'Outline specific action items and next steps to keep your financial plan on track. We\'ll prioritize immediate actions and establish timelines for ongoing financial management tasks.',
      icon: 'CheckSquare',
      timeAllocation: 10,
      order: 3,
      items: [
        { id: 'item-1', content: 'Document review and updates', order: 1, includeInClientReview: false },
        { id: 'item-2', content: 'Contribution increase considerations', order: 2, includeInClientReview: false },
        { id: 'item-3', content: 'Annual insurance review scheduling', order: 3, includeInClientReview: false },
        { id: 'item-4', content: 'Strategic planning discussions', order: 4, includeInClientReview: false },
      ],
    },
  ],
};