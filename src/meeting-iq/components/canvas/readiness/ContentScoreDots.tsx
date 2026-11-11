// @ts-nocheck
import React, { useState } from 'react';
import { Circle } from 'lucide-react';
import { ValidationLayer } from '@miq/services/HouseholdAgendaReadinessService';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ReadinessModal } from './ReadinessModal';

interface ContentScoreDotsProps {
  layers: ValidationLayer[];
  clientName?: string;
}

const contentLayerDescriptions: Record<string, { name: string; passedText: string; failedText: string }> = {
  L3: { 
    name: 'Context', 
    passedText: 'Household context available',
    failedText: 'Missing context data'
  },
  L4: { 
    name: 'Financials', 
    passedText: 'Financial data present',
    failedText: 'Missing financial data'
  },
  L5: { 
    name: 'Content', 
    passedText: 'Rich content available',
    failedText: 'Minimal content'
  },
};

export const ContentScoreDots: React.FC<ContentScoreDotsProps> = ({ layers, clientName }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const passedColor = 'text-emerald-500';
  const failedColor = 'text-rose-500';
  
  // Filter to only L3, L4, L5
  const contentLayers = layers.filter(l => ['L3', 'L4', 'L5'].includes(l.layer));
  
  // Convert content layers to full 5-layer format for modal (L1, L2 will show as N/A)
  const fullLayers: ValidationLayer[] = [
    { layer: 'L1', name: 'Meeting Detection', passed: false, percentage: 0, details: 'No scheduled meeting' },
    { layer: 'L2', name: 'Household Association', passed: true, percentage: 100, details: 'Household linked' },
    ...contentLayers,
  ];
  
  const handleDotsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };
  
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className="flex items-center gap-0.5 cursor-pointer"
              onClick={handleDotsClick}
            >
              {contentLayers.map((layer) => (
                <Circle 
                  key={layer.layer}
                  className={`h-2 w-2 ${layer.passed ? passedColor : failedColor}`}
                  fill="currentColor"
                />
              ))}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="p-2">
            <div className="space-y-1">
              {contentLayers.map((layer) => {
                const description = contentLayerDescriptions[layer.layer] || { 
                  name: layer.layer, 
                  passedText: 'Passed',
                  failedText: 'Failed'
                };
                return (
                  <div key={layer.layer} className="text-xs flex items-center gap-1.5">
                    <span className={layer.passed ? passedColor : failedColor}>
                      {layer.passed ? '✓' : '✗'}
                    </span>
                    <span className="font-medium">{description.name}</span>
                    <span className="text-muted-foreground">
                      – {layer.passed ? description.passedText : description.failedText}
                    </span>
                  </div>
                );
              })}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <ReadinessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        layers={fullLayers}
        clientName={clientName}
      />
    </>
  );
};
