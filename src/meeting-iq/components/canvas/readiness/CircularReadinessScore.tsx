// @ts-nocheck
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ValidationLayer } from '@miq/services/HouseholdAgendaReadinessService';
import { READINESS_COLORS } from './readinessColors';

interface CircularRingProps {
  size: number;
  strokeWidth: number;
  percentage: number;
  color: string;
  trackColor?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const CircularRing: React.FC<CircularRingProps> = ({
  size,
  strokeWidth,
  percentage,
  color,
  trackColor = 'hsl(0, 0%, 85%)',
  children,
  onClick,
  className = '',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export function getRingColor(percentage: number): string {
  if (percentage >= 81) return READINESS_COLORS.green;
  if (percentage >= 61) return READINESS_COLORS.blue;
  if (percentage >= 21) return READINESS_COLORS.orange;
  return READINESS_COLORS.red;
}

export function getReadinessRating(percentage: number): string {
  if (percentage >= 81) return 'Excellent';
  if (percentage >= 61) return 'Very Good';
  if (percentage >= 41) return 'Good';
  if (percentage >= 21) return 'Fair';
  return 'Poor';
}

interface CircularReadinessScoreProps {
  contentLayers: ValidationLayer[];
  contentPercentage: number;
  clientName?: string;
  onScoreClick?: () => void;
  size?: number;
}

export const CircularReadinessScore: React.FC<CircularReadinessScoreProps> = ({
  contentLayers,
  contentPercentage,
  onScoreClick,
  size = 44,
}) => {
  const mainColor = getRingColor(contentPercentage);
  const rating = getReadinessRating(contentPercentage);
  const fontSize = size <= 32 ? '10px' : '12px';
  const strokeWidth = size <= 32 ? 3 : 4;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onPointerDown={(e) => {
              e.stopPropagation();
              onScoreClick?.();
            }}
          >
            <CircularRing
              size={size}
              strokeWidth={strokeWidth}
              percentage={contentPercentage}
              color={mainColor}
            >
              <span className="font-bold" style={{ color: mainColor, fontSize }}>
                {contentPercentage}
              </span>
            </CircularRing>
            <span
              className="text-xs font-semibold whitespace-nowrap"
              style={{ color: mainColor }}
            >
              {rating}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          <span className="text-foreground font-medium">Context Quality:</span> {contentPercentage}%
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
