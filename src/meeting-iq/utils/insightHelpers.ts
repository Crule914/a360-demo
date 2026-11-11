// @ts-nocheck
import { AlertTriangle, TrendingUp, TrendingDown, Scale, Calendar, DollarSign, Shield, FileText, BarChart3 } from 'lucide-react';
import { InsightData, InsightType } from '@miq/types/insights';

export const getImpactColors = (impact: InsightData['impact']) => {
  switch (impact) {
    case 'high':
      return {
        border: 'border-l-destructive',
        background: 'bg-card',
        badge: 'bg-destructive/10 text-destructive',
        text: 'text-destructive'
      };
    case 'medium':
      return {
        border: 'border-l-warning',
        background: 'bg-card',
        badge: 'bg-warning/10 text-warning',
        text: 'text-warning'
      };
    case 'low':
      return {
        border: 'border-l-success',
        background: 'bg-card',
        badge: 'bg-success/10 text-success',
        text: 'text-success'
      };
    default:
      return {
        border: 'border-l-muted',
        background: 'bg-card',
        badge: 'bg-muted/10 text-muted-foreground',
        text: 'text-muted-foreground'
      };
  }
};

export const getImpactIcon = (impact: InsightData['impact']) => {
  switch (impact) {
    case 'high':
      return AlertTriangle;
    case 'medium':
      return TrendingUp;
    case 'low':
      return TrendingDown;
    default:
      return TrendingUp;
  }
};

export const getSourceLabel = (source: InsightData['source']) => {
  switch (source) {
    case 'portfolio_analysis':
      return 'Portfolio Data';
    case 'market_data':
      return 'Market Analysis';
    case 'compliance_monitoring':
      return 'Compliance Check';
    case 'client_profile':
      return 'Client Profile';
    case 'regulatory_update':
      return 'Regulatory Update';
    default:
      return 'Unknown Source';
  }
};

export const getImpactText = (impact: InsightData['impact']) => {
  switch (impact) {
    case 'high':
      return 'High Impact';
    case 'medium':
      return 'Medium Impact';
    case 'low':
      return 'Low Impact';
    default:
      return 'Unknown Impact';
  }
};

export const getInsightIcon = (type: InsightType) => {
  switch (type) {
    case 'rebalance':
    case 'portfolio_rebalancing':
      return Scale;
    case 'rmd':
      return Calendar;
    case 'tax':
    case 'tax_strategy':
      return DollarSign;
    case 'compliance':
      return Shield;
    case 'market':
      return TrendingUp;
    case 'planning':
    case 'planning_opportunity':
      return FileText;
    case 'performance':
      return BarChart3;
    case 'risk':
    case 'risk_management':
      return AlertTriangle;
    default:
      return BarChart3;
  }
};

export const getPriorityColors = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return {
        badge: 'bg-destructive text-destructive-foreground',
        text: 'text-destructive'
      };
    case 'high':
      return {
        badge: 'bg-warning text-warning-foreground',
        text: 'text-warning'
      };
    case 'medium':
      return {
        badge: 'bg-secondary text-secondary-foreground',
        text: 'text-secondary-foreground'
      };
    case 'low':
      return {
        badge: 'bg-muted text-muted-foreground',
        text: 'text-muted-foreground'
      };
    default:
      return {
        badge: 'bg-muted text-muted-foreground',
        text: 'text-muted-foreground'
      };
  }
};