// @ts-nocheck
import React from 'react';
import { ValidationLayer } from '@miq/services/HouseholdAgendaReadinessService';
import { getReadinessColorClasses } from './readinessColors';

interface ReadinessScoreProps {
  layers: ValidationLayer[];
  onScoreClick: () => void;
}

export const ReadinessScore: React.FC<ReadinessScoreProps> = ({ layers, onScoreClick }) => {
  const percentage = Math.round(layers.reduce((sum, l) => sum + l.percentage, 0) / layers.length);
  const colors = getReadinessColorClasses(layers, percentage);
  
  return (
    <button
      onClick={onScoreClick}
      className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-pointer transition-opacity ${colors.bg} ${colors.hover}`}
      style={{ color: colors.textColor }}
    >
      {percentage}
    </button>
  );
};
