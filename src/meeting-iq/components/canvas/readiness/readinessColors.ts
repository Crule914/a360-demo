// @ts-nocheck
import { ValidationLayer } from '@miq/services/HouseholdAgendaReadinessService';

// Shared HSL color constants for readiness
export const READINESS_COLORS = {
  green: 'hsl(160, 84%, 39%)',
  blue: 'hsl(217, 91%, 60%)',
  orange: 'hsl(38, 92%, 50%)',
  red: 'hsl(0, 72%, 51%)',
};

interface ReadinessColorSet {
  bg: string;
  textColor: string;
  hover: string;
  indicatorColor: string;
}

/**
 * Returns color classes for readiness score badges.
 * Rules:
 * - Green: 100% (all layers pass)
 * - Orange: exactly 1 layer fails (and no L1/L2 failure)
 * - Red: 2+ layers fail, or any L1/L2 fails
 */
export const getReadinessColorClasses = (
  layers: ValidationLayer[],
  percentage: number
): ReadinessColorSet => {
  const l1l2Failed = layers.some(l => (l.layer === 'L1' || l.layer === 'L2') && !l.passed);

  if (l1l2Failed) {
    return { bg: 'bg-red-100', textColor: READINESS_COLORS.red, hover: 'hover:bg-red-200', indicatorColor: READINESS_COLORS.red };
  }
  if (percentage >= 81) {
    return { bg: 'bg-emerald-100', textColor: READINESS_COLORS.green, hover: 'hover:bg-emerald-200', indicatorColor: READINESS_COLORS.green };
  }
  if (percentage >= 61) {
    return { bg: 'bg-blue-100', textColor: READINESS_COLORS.blue, hover: 'hover:bg-blue-200', indicatorColor: READINESS_COLORS.blue };
  }
  if (percentage >= 21) {
    return { bg: 'bg-orange-100', textColor: READINESS_COLORS.orange, hover: 'hover:bg-orange-200', indicatorColor: READINESS_COLORS.orange };
  }
  return { bg: 'bg-red-100', textColor: READINESS_COLORS.red, hover: 'hover:bg-red-200', indicatorColor: READINESS_COLORS.red };
};

/**
 * Simplified version for content-only readiness (L3-L5, no L1/L2).
 * Green >= 100, Blue >= 67, Orange >= 34, Red < 34
 */
export const getContentReadinessColorClasses = (contentPercentage: number): ReadinessColorSet => {
  if (contentPercentage >= 81) {
    return { bg: 'bg-emerald-100', textColor: READINESS_COLORS.green, hover: 'hover:bg-emerald-200', indicatorColor: READINESS_COLORS.green };
  }
  if (contentPercentage >= 61) {
    return { bg: 'bg-blue-100', textColor: READINESS_COLORS.blue, hover: 'hover:bg-blue-200', indicatorColor: READINESS_COLORS.blue };
  }
  if (contentPercentage >= 21) {
    return { bg: 'bg-orange-100', textColor: READINESS_COLORS.orange, hover: 'hover:bg-orange-200', indicatorColor: READINESS_COLORS.orange };
  }
  return { bg: 'bg-red-100', textColor: READINESS_COLORS.red, hover: 'hover:bg-red-200', indicatorColor: READINESS_COLORS.red };
};
