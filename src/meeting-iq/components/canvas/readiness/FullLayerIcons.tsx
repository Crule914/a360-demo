// @ts-nocheck
import React, { useState } from 'react';
import { Calendar, Link, Users, DollarSign, FileText } from 'lucide-react';
import { ValidationLayer } from '@miq/services/HouseholdAgendaReadinessService';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ReadinessModal } from './ReadinessModal';
import { getReadinessColorClasses } from './readinessColors';

interface FullLayerIconsProps {
  layers: ValidationLayer[];
  clientName?: string;
}

const layerConfig: Record<string, { 
  Icon: React.ComponentType<any>; 
  name: string; 
  passedText: string; 
  failedText: string 
}> = {
  L1: { 
    Icon: Calendar,
    name: 'Meeting', 
    passedText: 'Meeting scheduled',
    failedText: 'No meeting scheduled'
  },
  L2: { 
    Icon: Link,
    name: 'Household', 
    passedText: 'Household linked',
    failedText: 'Not linked to household'
  },
  L3: { 
    Icon: Users,
    name: 'Context', 
    passedText: 'Context available',
    failedText: 'Missing context'
  },
  L4: { 
    Icon: DollarSign,
    name: 'Financials', 
    passedText: 'Data present',
    failedText: 'Missing data'
  },
  L5: { 
    Icon: FileText,
    name: 'Content', 
    passedText: 'Rich content',
    failedText: 'Minimal content'
  },
};

export const FullLayerIcons: React.FC<FullLayerIconsProps> = ({ 
  layers, 
  clientName,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const passedColor = 'text-emerald-500';
  const failedColor = 'text-rose-400 opacity-60';
  
  // Calculate percentage and color
  const passedCount = layers.filter(l => l.passed).length;
  const percentage = Math.round((passedCount / layers.length) * 100);
  const colors = getReadinessColorClasses(layers, percentage);
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };
  
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleClick}
            >
              <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${colors.bg}`} style={{ color: colors.textColor }}>{percentage}%</span>
              <div className="flex items-center gap-1">
                {layers.map((layer) => {
                  const config = layerConfig[layer.layer];
                  if (!config) return null;
                  const { Icon } = config;
                  return (
                    <Tooltip key={layer.layer}>
                      <TooltipTrigger asChild>
                        <Icon 
                          className={`h-4 w-4 ${layer.passed ? passedColor : failedColor}`}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        {config.name}: {layer.passed ? config.passedText : config.failedText}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="p-2">
            <div className="space-y-1">
              {layers.map((layer) => {
                const config = layerConfig[layer.layer];
                if (!config) return null;
                return (
                  <div key={layer.layer} className="text-xs flex items-center gap-1.5">
                    <span className={layer.passed ? 'text-emerald-500' : 'text-rose-400'}>
                      {layer.passed ? '✓' : '✗'}
                    </span>
                    <span className="font-medium">{config.name}</span>
                    <span className="text-muted-foreground">
                      – {layer.passed ? config.passedText : config.failedText}
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
        layers={layers}
        clientName={clientName}
      />
    </>
  );
};
