// @ts-nocheck
export interface DetailedAgendaContent {
  sections: AgendaSection[];
  confidenceBuilders: ConfidenceBuilder[];
  actionableInsights: ActionableInsight[];
  dataPoints: DataPoint[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  estimatedOutcomes: string[];
}

export interface AgendaSection {
  title: string;
  content: string;
  bullets: string[];
  subsections?: {
    title: string;
    content: string;
    bullets: string[];
  }[];
}

export interface ConfidenceBuilder {
  category: 'financial' | 'personal' | 'performance' | 'planning';
  achievement: string;
  impact: string;
  metrics?: {
    before: string | number;
    after: string | number;
    improvement: string;
  };
}

export interface ActionableInsight {
  insight: string;
  recommendation: string;
  urgency: 'low' | 'medium' | 'high';
  expectedOutcome: string;
  timeframe: string;
}

export interface DataPoint {
  label: string;
  value: string | number;
  context: string;
  trend?: 'up' | 'down' | 'stable';
  comparison?: {
    benchmark: string | number;
    performance: 'outperform' | 'underperform' | 'meet';
  };
}

export interface EnhancedAgendaItem extends Omit<import('./advisor').AgendaItem, 'description'> {
  detailedContent: DetailedAgendaContent;
  originalDescription?: string; // Keep for fallback
}

export interface SupportingMaterial {
  id: string;
  type: 'chart' | 'document' | 'analysis' | 'comparison' | 'calculator' | 'projection';
  title: string;
  description: string;
  category: string;
  relevanceScore: number; // 0-1, how relevant to this agenda item
  urgency?: 'low' | 'medium' | 'high' | 'critical';
  visualType?: 'pie-chart' | 'line-chart' | 'bar-chart' | 'timeline' | 'progress' | 'table' | 'calculator';
  chartData?: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string[];
      borderColor?: string;
      fill?: boolean;
    }>;
  };
  tableData?: {
    headers: string[];
    rows: Array<(string | number)[]>;
  };
  calculatorData?: {
    inputs: Array<{
      label: string;
      value: number | string;
      type: 'currency' | 'percentage' | 'number' | 'date';
    }>;
    outputs: Array<{
      label: string;
      value: string | number;
      highlight?: boolean;
    }>;
  };
  keyInsights?: string[];
  actionItems?: string[];
  generatedContent?: any;
}