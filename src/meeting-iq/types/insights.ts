// @ts-nocheck
import { LucideIcon } from 'lucide-react';

export type InsightType = 'rebalance' | 'rmd' | 'tax' | 'compliance' | 'market' | 'planning' | 'performance' | 'risk' | 'portfolio_rebalancing' | 'tax_strategy' | 'risk_management' | 'planning_opportunity';
export type InsightImpact = 'high' | 'medium' | 'low';
export type InsightSource = 'portfolio_analysis' | 'market_data' | 'compliance_monitoring' | 'tax_planning' | 'risk_assessment' | 'performance_review' | 'client_profile' | 'regulatory_update';

export interface InsightData {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  impact: InsightImpact;
  confidence: number; // 0-100
  source: InsightSource;
  icon: LucideIcon;
  metadata?: {
    clientId?: string;
    deadline?: Date;
    amount?: number;
    currency_amount?: number;
    percentage?: number;
    category?: string;
    tags?: string[];
    risk_level?: string;
  };
  recommendation?: {
    action: string;
    steps: string[];
    timeline: string;
    priority: 'urgent' | 'high' | 'medium' | 'low';
  };
  explanation?: {
    methodology: string;
    dataPoints: string[];
    assumptions: string[];
    alternatives: string[];
    risks: string[];
  };
}

export interface InsightCardProps {
  insight: InsightData;
  onAddAsTopic?: (insight: InsightData) => void;
  onAddAsTask?: (insight: InsightData) => void;
  onViewSource?: (insight: InsightData) => void;
  className?: string;
}