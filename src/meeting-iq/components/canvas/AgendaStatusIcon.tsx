// @ts-nocheck
import React from 'react';
import { CheckCircle2, AlertTriangle, Sparkles, Clock, CalendarClock, Plus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { getAgendaTypeIcon, type AgendaStatusValue } from './AgendaStatus';

interface StatusVisual {
  Icon: React.ComponentType<{ className?: string }>;
  tooltip: string;
  colorClass: string;
  spin?: boolean;
}

const getStatusVisual = (status: AgendaStatusValue): StatusVisual => {
  switch (status) {
    case 'ready':
      return { Icon: CheckCircle2, tooltip: 'Agenda ready', colorClass: 'text-success' };
    case 'completed':
      return { Icon: CheckCircle2, tooltip: 'Meeting completed', colorClass: 'text-muted-foreground' };
    case 'failed':
      return { Icon: AlertTriangle, tooltip: 'Agenda Issue, view to resolve', colorClass: 'text-destructive' };
    case 'generating':
      return { Icon: Sparkles, tooltip: 'Generating agenda…', colorClass: 'text-primary animate-pulse', spin: false };
    case 'regenerating':
      return { Icon: Sparkles, tooltip: 'Regenerating agenda…', colorClass: 'text-warning animate-pulse', spin: false };
    case 'scheduled':
      return { Icon: CalendarClock, tooltip: 'Agenda scheduled', colorClass: 'text-primary' };
    case 'not_set':
      return { Icon: Plus, tooltip: 'No meeting type — click to set', colorClass: 'text-warning' };
    case 'in_progress':
    default:
      return { Icon: Clock, tooltip: 'Agenda in progress', colorClass: 'text-primary' };
  }
};

export interface AgendaStatusIconProps {
  status: AgendaStatusValue;
  meetingType?: string;
  showTypeIcon?: boolean;
  onResolve?: () => void;
  onTypeClick?: () => void;
  size?: 'sm' | 'md';
  className?: string;
}

export const AgendaStatusIcon: React.FC<AgendaStatusIconProps> = ({
  status,
  meetingType,
  showTypeIcon = true,
  onResolve,
  onTypeClick,
  size = 'sm',
  className,
}) => {
  const visual = getStatusVisual(status);
  const type = getAgendaTypeIcon(meetingType);
  const TypeIcon = type.Icon;
  const StatusIcon = visual.Icon;

  const iconSize = size === 'md' ? 'h-5 w-5' : 'h-4 w-4';
  const slotSize = size === 'md' ? 'h-8 w-8' : 'h-7 w-7';

  const isResolveClickable = status === 'failed' && !!onResolve;
  const isTypeClickable = !type.isSet && !!onTypeClick;

  const statusEl = isResolveClickable ? (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onResolve?.(); }}
      className={cn('inline-flex items-center justify-center rounded hover:bg-black/5', slotSize, visual.colorClass)}
      aria-label={visual.tooltip}
    >
      <StatusIcon className={cn(iconSize, visual.spin && 'animate-spin')} />
    </button>
  ) : (
    <span
      className={cn('inline-flex items-center justify-center', slotSize, visual.colorClass)}
      aria-label={visual.tooltip}
    >
      <StatusIcon className={cn(iconSize, visual.spin && 'animate-spin')} />
    </span>
  );

  const typeEl = !showTypeIcon ? null : isTypeClickable ? (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onTypeClick?.(); }}
      className={cn('inline-flex items-center justify-center rounded hover:bg-black/5 text-warning', slotSize)}
      aria-label={type.label}
    >
      <TypeIcon className={iconSize} />
    </button>
  ) : (
    <span
      className={cn('inline-flex items-center justify-center text-primary', slotSize)}
      aria-label={type.label}
    >
      <TypeIcon className={iconSize} />
    </span>
  );

  return (
    <TooltipProvider delayDuration={150}>
      <span className={cn('inline-flex items-center gap-0.5', className)}>
        {typeEl && (
          <Tooltip>
            <TooltipTrigger asChild>{typeEl}</TooltipTrigger>
            <TooltipContent>{type.label}</TooltipContent>
          </Tooltip>
        )}
        <Tooltip>
          <TooltipTrigger asChild>{statusEl}</TooltipTrigger>
          <TooltipContent>{visual.tooltip}</TooltipContent>
        </Tooltip>
      </span>
    </TooltipProvider>
  );
};

export default AgendaStatusIcon;
