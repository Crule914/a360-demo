// @ts-nocheck
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { ValidationLayer } from '@miq/services/HouseholdAgendaReadinessService';
import { getReadinessColorClasses, getContentReadinessColorClasses } from './readinessColors';
import { CircularRing, getRingColor, getReadinessRating } from './CircularReadinessScore';

interface ReadinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  layers: ValidationLayer[];
  clientName?: string;
  hideL1L2?: boolean;
}

const layerDescriptions: Record<string, { name: string; remediation: string }> = {
  L1: { 
    name: 'Meeting Detection', 
    remediation: 'Enable the Meeting Prep switch to activate this layer'
  },
  L2: { 
    name: 'Household Association', 
    remediation: 'Link this meeting to a household in HCRM'
  },
  L3: { 
    name: 'Context Retrieval', 
    remediation: 'Add household members and relationship notes in HCRM'
  },
  L4: { 
    name: 'Financial Data', 
    remediation: 'Link at least one account with holdings to this household'
  },
  L5: { 
    name: 'Content Richness', 
    remediation: 'Add recent activity notes or update AUM information'
  },
};

export const ReadinessModal: React.FC<ReadinessModalProps> = ({ 
  isOpen, 
  onClose, 
  layers, 
  clientName,
  hideL1L2 = false,
}) => {
  const displayLayers = hideL1L2 
    ? layers.filter(l => !['L1', 'L2'].includes(l.layer))
    : layers;
  
  const percentage = Math.round(displayLayers.reduce((sum, l) => sum + l.percentage, 0) / displayLayers.length);
  
  const colors = hideL1L2 
    ? getContentReadinessColorClasses(percentage) 
    : getReadinessColorClasses(displayLayers, percentage);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader className="pb-0">
          <DialogTitle>
            {clientName || 'Client'}
          </DialogTitle>
        </DialogHeader>
        
        <DialogBody>
          <div className="bg-white rounded-lg p-4 space-y-4">
            {/* Subheader with percentage and progress bar */}
            <div className="pb-3 border-b border-border space-y-2">
              <div className="text-sm font-medium">
                <span className="text-foreground">{hideL1L2 ? 'Context Quality:' : 'Meeting Readiness:'}</span>{' '}
                <span style={{ color: colors.textColor }}>{percentage}% · {getReadinessRating(percentage)}</span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: 'hsl(0, 0%, 85%)' }}>
                <div
                  className="h-full transition-all"
                  style={{ width: `${percentage}%`, backgroundColor: colors.indicatorColor }}
                />
              </div>
            </div>
            
            {/* Layer breakdown with circular gauges */}
            <div>
              {displayLayers.map((layer, index) => {
                const description = layerDescriptions[layer.layer] || { 
                  name: layer.layer, 
                  remediation: 'Contact support for assistance'
                };
                const ringColor = getRingColor(layer.percentage);
                return (
                  <div key={layer.layer} className={`text-sm pb-3 ${index > 0 ? 'pt-3' : ''} ${index < displayLayers.length - 1 ? 'border-b border-muted-foreground/30' : ''}`}>
                    <div className="flex items-center gap-3">
                      <CircularRing
                        size={56}
                        strokeWidth={5}
                        percentage={layer.percentage}
                        color={ringColor}
                      >
                        <span className="text-[14px] font-bold" style={{ color: ringColor }}>
                          {layer.percentage}
                        </span>
                      </CircularRing>
                      <div>
                        <span className="font-medium">{description.name}</span>
                        {layer.percentage < 100 && (
                          <div className="text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'hsl(38, 92%, 50%)' }} />
                              <span className="font-semibold">TO IMPROVE:</span>
                            </div>
                            <div className="ml-[18px]">{description.remediation}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </DialogBody>
        
        <DialogFooter className="justify-center sm:justify-center">
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
