// @ts-nocheck
import React from 'react';
import { Circle } from 'lucide-react';
import { ValidationLayer } from '@miq/services/HouseholdAgendaReadinessService';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ScoreDotsProps {
  layers: ValidationLayer[];
}

const layerDescriptions: Record<string, { name: string; passedText: string; failedText: string; remediation: string }> = {
  L1: { 
    name: 'Meeting Detection', 
    passedText: 'Meeting successfully detected',
    failedText: 'Not detected',
    remediation: 'Enable the Meeting Prep switch to activate this layer'
  },
  L2: { 
    name: 'Household Association', 
    passedText: 'Household correctly associated',
    failedText: 'Missing',
    remediation: 'Link this meeting to a household in HCRM'
  },
  L3: { 
    name: 'Context Retrieval', 
    passedText: 'Context data retrieved',
    failedText: 'Missing',
    remediation: 'Add household members and relationship notes in HCRM'
  },
  L4: { 
    name: 'Financial Data', 
    passedText: 'Financial data available',
    failedText: 'Missing',
    remediation: 'Link at least one account with holdings to this household'
  },
  L5: { 
    name: 'Content Richness', 
    passedText: 'Content is rich and complete',
    failedText: 'Minimal',
    remediation: 'Add recent activity notes or update AUM information'
  },
};

export const ScoreDots: React.FC<ScoreDotsProps> = ({ layers }) => {
  const passedColor = 'text-emerald-500';
  const failedColor = 'text-rose-500';
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Readiness</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-0.5 cursor-pointer">
            {layers.map((layer) => (
              <Circle 
                key={layer.layer}
                className={`h-2.5 w-2.5 ${layer.passed ? passedColor : failedColor}`}
                fill="currentColor"
              />
            ))}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="p-3 max-w-none">
          <div className="space-y-1.5">
            {layers.map((layer) => {
              const description = layerDescriptions[layer.layer] || { 
                name: layer.layer, 
                passedText: 'Passed',
                failedText: 'Failed',
                remediation: 'Contact support for assistance'
              };
              return (
                <div key={layer.layer} className="text-xs">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className={`flex-shrink-0 ${layer.passed ? passedColor : failedColor}`}>
                      {layer.passed ? '✓' : '✗'}
                    </span>
                    <span className="font-medium">{description.name}</span>
                    {!layer.passed && (
                      <span className="text-muted-foreground">– {description.failedText}</span>
                    )}
                  </div>
                  {!layer.passed && (
                    <div className="ml-5 mt-0.5 text-muted-foreground italic">
                      {description.remediation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
