// @ts-nocheck
import React from 'react';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ValidationLayer, LayerType, getLayerDisplayName } from '@miq/services/HouseholdAgendaReadinessService';

export const getLayerRemediation = (layer: LayerType): string => {
  switch (layer) {
    case 'L3':
      return 'Add household members, log recent activities, or update the review schedule in HCRM';
    case 'L4':
      return 'Link at least one account with current holdings to this household';
    case 'L5':
      return 'Add recent meeting notes or activity history, or confirm AUM is $100K+';
    default:
      return 'Update client data in HCRM';
  }
};

interface MissingLayerBadgeProps {
  layer: ValidationLayer;
}

export const MissingLayerBadge: React.FC<MissingLayerBadgeProps> = ({ layer }) => {
  const displayName = getLayerDisplayName(layer.layer);
  const remediation = getLayerRemediation(layer.layer);
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-rose-100 text-rose-700 rounded-full hover:bg-rose-200 transition-colors cursor-pointer">
          {displayName}
          <Info className="h-3 w-3" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <p className="text-sm">{remediation}</p>
      </TooltipContent>
    </Tooltip>
  );
};
