// @ts-nocheck
import React, { useState } from 'react';
import {
  ClipboardList,
  LineChart,
  Target,
  PiggyBank,
  Building2,
  Calculator,
  Shield,
  UserPlus,
  Clock,
  CalendarClock,
  Loader2,
  MessageSquare,
  Plus,
  AlertTriangle,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AgendaStatusDisclosure } from './AgendaStatusDisclosure';

export type AgendaStatusValue =
  | 'ready'
  | 'in_progress'
  | 'scheduled'
  | 'generating'
  | 'regenerating'
  | 'completed'
  | 'failed'
  | 'not_set';

export const getAgendaTypeIcon = (
  type?: string
): { Icon: React.ComponentType<{ className?: string }>; label: string; isSet: boolean } => {
  const t = (type || '').trim();
  switch (t) {
    case 'Annual Review':
    case 'Bi-Annual Review':
    case 'Quarterly Review':
      return { Icon: ClipboardList, label: t, isSet: true };
    case 'Portfolio Review':
      return { Icon: LineChart, label: t, isSet: true };
    case 'Financial Planning':
    case 'Client Planning':
      return { Icon: Target, label: t, isSet: true };
    case 'Retirement Planning':
      return { Icon: PiggyBank, label: t, isSet: true };
    case 'Estate Planning':
    case 'Estate Planning Session':
      return { Icon: Building2, label: t, isSet: true };
    case 'Tax Planning':
      return { Icon: Calculator, label: t, isSet: true };
    case 'Insurance Review':
      return { Icon: Shield, label: t, isSet: true };
    case 'Initial Consultation':
      return { Icon: UserPlus, label: t, isSet: true };
    case 'Follow-up':
      return { Icon: MessageSquare, label: t, isSet: true };
    default:
      return { Icon: Plus, label: 'No meeting type — click to set', isSet: false };
  }
};

const STATUS_CONFIG: Record<
  AgendaStatusValue,
  { text: string; badge: string; pulse?: boolean; icon?: React.ComponentType<{ className?: string }>; iconColor?: string }
> = {
  ready: { text: 'Ready', badge: 'bg-transparent text-success border border-success' },
  in_progress: { text: 'Scheduled', badge: 'text-primary', icon: Clock, iconColor: 'text-primary' },
  scheduled: { text: 'Scheduled', badge: 'text-primary', icon: CalendarClock, iconColor: 'text-primary' },
  generating: { text: 'Generating Agenda...', badge: 'text-primary', pulse: true, icon: Loader2, iconColor: 'text-primary' },
  regenerating: { text: 'Regenerating', badge: 'text-warning', pulse: true, icon: Loader2, iconColor: 'text-warning' },
  completed: { text: 'Completed', badge: 'bg-transparent text-foreground border border-foreground/40' },
  failed: { text: 'Agenda Issue', badge: 'text-destructive', icon: AlertTriangle, iconColor: 'text-destructive' },
  not_set: { text: 'Not Set', badge: 'bg-transparent text-primary border border-primary' },
};

interface AgendaStatusProps {
  meetingType?: string;
  status: AgendaStatusValue;
  onSetAgenda?: () => void;
  onViewAgenda?: () => void;
  onGenerate?: () => void;
  disclosureMode?: 'popover' | 'inline';
  tooltip?: string;
  className?: string;
  iconClassName?: string;
}

export const AgendaStatus: React.FC<AgendaStatusProps> = ({
  meetingType,
  status,
  onSetAgenda,
  onViewAgenda,
  onGenerate,
  disclosureMode = 'popover',
  tooltip,
  className,
  iconClassName,
}) => {
  const cfg = STATUS_CONFIG[status];
  void meetingType;
  void getAgendaTypeIcon;

  const [inlineOpen, setInlineOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  const isDisclosureStatus = (status === 'in_progress' || status === 'failed') && !!onGenerate;

  const isInteractive =
    (status === 'not_set' && !!onSetAgenda) ||
    (status === 'ready' && !!onViewAgenda) ||
    (status === 'completed' && !!onViewAgenda) ||
    isDisclosureStatus;

  const handleClick = (e: React.MouseEvent) => {
    if (status === 'not_set' && onSetAgenda) {
      e.stopPropagation();
      onSetAgenda();
    } else if ((status === 'ready' || status === 'completed') && onViewAgenda) {
      e.stopPropagation();
      onViewAgenda();
    } else if (isDisclosureStatus) {
      e.stopPropagation();
      if (disclosureMode === 'inline') {
        setInlineOpen((v) => !v);
      } else {
        setPopoverOpen((v) => !v);
      }
    }
  };

  const hasInlineIcon = !!cfg.icon;
  const StatusIcon = cfg.icon;

  const statusEl = (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-sm font-normal whitespace-nowrap',
        hasInlineIcon
          ? cfg.badge
          : cn('px-2 py-0.5 rounded-full', cfg.badge),
        cfg.pulse && !StatusIcon && 'animate-pulse',
        isInteractive && !isDisclosureStatus && 'cursor-pointer hover:opacity-80'
      )}
    >
      {StatusIcon ? (
        <StatusIcon
          className={cn(
            'h-3.5 w-3.5 flex-shrink-0',
            cfg.iconColor,
            cfg.pulse && 'animate-spin'
          )}
        />
      ) : cfg.pulse ? (
        <span
          className={cn(
            'inline-block h-1.5 w-1.5 rounded-full',
            status === 'generating' ? 'bg-primary' : 'bg-warning',
            'animate-[ping_1.5s_ease-in-out_infinite]'
          )}
        />
      ) : null}
      {cfg.text}
    </span>
  );

  const wrappedStatus = tooltip && !isDisclosureStatus ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{statusEl}</span>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs max-w-[220px]">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    statusEl
  );

  const showViewLink = status === 'ready' || status === 'completed';

  const coreContent = showViewLink ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-primary/40 text-sm font-medium text-primary hover:bg-primary/5 transition-colors cursor-pointer">
      View Agenda
    </span>
  ) : status === 'not_set' ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center text-sm font-medium text-warning hover:text-warning/70 transition-colors cursor-pointer">
            Set Meeting Type
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs max-w-[220px] whitespace-normal">
          Confirm or select a meeting type to schedule an agenda
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : isDisclosureStatus ? (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer",
      status === 'in_progress'
        ? "border border-primary/40 text-primary hover:bg-primary/5"
        : "border border-destructive/40 text-destructive hover:bg-destructive/5"
    )}>
      {wrappedStatus}
    </span>
  ) : (
    wrappedStatus
  );

  if (isDisclosureStatus && disclosureMode === 'popover') {
    return (
      <span
        className={cn('inline-flex items-center gap-1.5 whitespace-nowrap', className)}
        onPointerDown={stop}
      >
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <span onClick={handleClick}>{coreContent}</span>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="center"
            collisionPadding={16}
            className="w-auto border-0 bg-transparent p-0 z-50 shadow-none"
            onPointerDown={stop}
            onClick={stop}
          >
            <AgendaStatusDisclosure
              status={status as 'in_progress' | 'failed'}
              onGenerate={() => onGenerate?.()}
              onView={onViewAgenda}
              onClose={() => setPopoverOpen(false)}
            />
          </PopoverContent>
        </Popover>
      </span>
    );
  }

  if (isDisclosureStatus && disclosureMode === 'inline') {
    return (
      <span
        className={cn('inline-flex flex-col items-center gap-2 whitespace-nowrap', className)}
        onPointerDown={stop}
      >
        <span onClick={handleClick}>{coreContent}</span>
        {inlineOpen && (
          <div className="w-full">
            <AgendaStatusDisclosure
              status={status as 'in_progress' | 'failed'}
              onGenerate={() => onGenerate?.()}
              onView={onViewAgenda}
              onClose={() => setInlineOpen(false)}
              className="w-full"
            />
          </div>
        )}
      </span>
    );
  }

  return (
    <span
      className={cn('inline-flex items-center gap-1.5 whitespace-nowrap', className)}
      onPointerDown={isInteractive ? stop : undefined}
      onClick={isInteractive ? handleClick : undefined}
    >
      {coreContent}
    </span>
  );
};
