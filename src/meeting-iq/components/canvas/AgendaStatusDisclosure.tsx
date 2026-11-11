// @ts-nocheck
import React from 'react';
import { Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgendaStatusDisclosureProps {
  status: 'in_progress' | 'failed';
  onGenerate: () => void;
  onView?: () => void;
  onClose: () => void;
  className?: string;
}

export const AgendaStatusDisclosure: React.FC<AgendaStatusDisclosureProps> = ({
  status,
  onGenerate,
  onView,
  onClose,
  className,
}) => {
  const isFailed = status === 'failed';
  const title = isFailed ? 'Agenda Issue' : 'Auto-generation scheduled';
  const body = isFailed
    ? "The agenda generation failed to complete. Click Regenerate to try again."
    : 'Agenda will be generated automatically 7 days before the meeting. You can generate it now if you\u2019re ready.';
  const cta = isFailed ? 'Regenerate' : 'Generate Now';

  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  return (
    <div
      className={cn(
        'w-80 rounded-lg border border-input-border bg-white p-3 text-left shadow-xl',
        className
      )}
      style={{ boxShadow: '0 18px 45px hsl(var(--foreground) / 0.18)' }}
      onPointerDown={stop}
      onClick={stop}
    >
      <div className="flex items-start justify-between gap-2">
        <p className={cn('text-xs font-semibold', isFailed ? 'text-destructive' : 'text-foreground')}>
          {title}
        </p>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="text-muted-foreground hover:text-foreground -mt-0.5"
          aria-label="Close"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{body}</p>
      <div className="mt-2.5 flex items-center gap-x-3 gap-y-2">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onGenerate(); onClose(); }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {cta}
        </button>
        {onView && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onView(); onClose(); }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-primary/40 text-xs font-medium text-primary hover:bg-primary/5 transition-colors whitespace-nowrap"
          >
            View Agenda
          </button>
        )}
      </div>
    </div>
  );
};
