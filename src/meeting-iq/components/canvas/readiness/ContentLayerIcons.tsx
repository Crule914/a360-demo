// @ts-nocheck
import React, { useState } from 'react';
import { Users, DollarSign, FileText } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ValidationLayer } from '@miq/services/HouseholdAgendaReadinessService';
import { ReadinessModal } from './ReadinessModal';

interface ContentLayerIconsProps {
  layers: ValidationLayer[];
  clientName?: string;
  hideL1L2InModal?: boolean;  // Pass to modal to hide L1/L2
}

const layerConfig: Record<string, { 
  Icon: React.ComponentType<any>; 
  name: string; 
  passedText: string; 
  failedText: string 
}> = {
  L3: { 
    Icon: Users,
    name: 'Context', 
    passedText: 'Household context available',
    failedText: 'Missing context data'
  },
  L4: { 
    Icon: DollarSign,
    name: 'Financials', 
    passedText: 'Financial data present',
    failedText: 'Missing financial data'
  },
  L5: { 
    Icon: FileText,
    name: 'Content', 
    passedText: 'Rich content available',
    failedText: 'Minimal content'
  },
};

export const ContentLayerIcons: React.FC<ContentLayerIconsProps> = ({ 
  layers, 
  clientName,
  hideL1L2InModal = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const passedColor = 'text-emerald-500';
  const failedColor = 'text-rose-400 opacity-60';
  
  // Filter to only L3, L4, L5
  const contentLayers = layers.filter(l => ['L3', 'L4', 'L5'].includes(l.layer));
  
  // For modal, include L1/L2 placeholder layers unless hideL1L2InModal is true
  const fullLayers: ValidationLayer[] = hideL1L2InModal 
    ? contentLayers
    : [
        { layer: 'L1', name: 'Meeting Detection', passed: false, percentage: 0, details: 'No scheduled meeting' },
        { layer: 'L2', name: 'Household Association', passed: true, percentage: 100, details: 'Household linked' },
        ...contentLayers,
      ];
  
  const handleIconsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };
  
  return (
    <>
      <div 
        className="flex items-center gap-1.5 cursor-pointer"
        onClick={handleIconsClick}
      >
        <TooltipProvider delayDuration={200}>
          {contentLayers.map((layer) => {
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
                  {layer.passed ? config.passedText : config.failedText}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
      
      <ReadinessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        layers={fullLayers}
        clientName={clientName}
        hideL1L2={hideL1L2InModal}
      />
    </>
  );
};
