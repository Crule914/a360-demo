// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useAssistantMode } from '@miq/hooks/useAssistantMode';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown } from 'lucide-react';
import { advisors as allAdvisors } from '@miq/lib/userContext';
import { useCurrentUser } from '@/lib/currentUser';

export const AdvisorFilterAvatars: React.FC = () => {
  const { isAssistantMode, selectedAdvisors, setSelectedAdvisors, advisors, advisorFilterVariant } = useAssistantMode();
  const me = useCurrentUser();

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<string[]>(selectedAdvisors);

  useEffect(() => {
    if (open) setDraft(selectedAdvisors);
  }, [open, selectedAdvisors]);

  if (!isAssistantMode) {
    return (
      <div className="ml-2">
        <button
          type="button"
          disabled
          className="h-8 px-3 rounded-lg bg-white/10 border border-white/30 text-white text-xs font-medium flex items-center gap-2 outline-none cursor-default"
          title={me.fullName}
        >
          <span className="max-w-[180px] truncate">{me.fullName}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-40" />
        </button>
      </div>
    );
  }

  const toggleDraft = (id: string) => {
    setDraft(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const toggle = (id: string) => {
    const next = selectedAdvisors.includes(id)
      ? selectedAdvisors.filter(a => a !== id)
      : [...selectedAdvisors, id];
    if (next.length > 0) setSelectedAdvisors(next);
  };

  if (advisorFilterVariant === 'dropdown') {
    const allSelected = selectedAdvisors.length === advisors.length;
    const selectedAdvisorObjs = advisors.filter(a => selectedAdvisors.includes(a.id));
    const label =
      selectedAdvisors.length === 0
        ? 'No advisors'
        : allSelected
        ? 'All Advisors'
        : selectedAdvisors.length === 1
        ? selectedAdvisorObjs[0]?.name
        : `Advisors (${selectedAdvisors.length})`;


    return (
      <div className="ml-2">
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className="h-8 px-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs font-medium flex items-center gap-2 outline-none transition-colors"
              title="Filter advisors"
            >
              {selectedAdvisors.length === 1 ? (
                <Avatar className="h-5 w-5">
                  {selectedAdvisorObjs[0]?.photo ? <AvatarImage src={selectedAdvisorObjs[0].photo} alt={selectedAdvisorObjs[0].name} /> : null}
                  <AvatarFallback className="text-[8px]">{selectedAdvisorObjs[0]?.initials}</AvatarFallback>
                </Avatar>
              ) : null}
              <span className="max-w-[180px] truncate">{label}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-56">
            <div className="px-2 py-1.5">
              <DropdownMenuLabel className="text-xs p-0">Filter by Clients of:</DropdownMenuLabel>
            </div>
            <DropdownMenuSeparator />

            {advisors.map(a => {
              const selected = draft.includes(a.id);
              return (
                <DropdownMenuItem
                  key={a.id}
                  onSelect={(e) => { e.preventDefault(); toggleDraft(a.id); }}
                  className="flex items-center gap-2 cursor-pointer hover:bg-[#EAF1FA] focus:bg-[#EAF1FA] data-[highlighted]:bg-[#EAF1FA]"
                >
                  <Avatar className="h-6 w-6">
                    {a.photo ? <AvatarImage src={a.photo} alt={a.name} /> : null}
                    <AvatarFallback className="text-[10px]">{a.initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{a.name}</span>
                  <Check className={`h-4 w-4 ml-auto ${selected ? 'opacity-100' : 'opacity-0'}`} />
                </DropdownMenuItem>
              );
            })}

            <DropdownMenuSeparator />
            <div className="flex items-center justify-between px-2 py-1.5">
              <button
                onClick={() => setDraft(advisors.map(a => a.id))}
                className="text-xs text-primary hover:underline"
              >
                Clear
              </button>
              <Button
                size="sm"
                className="h-7 px-3 text-xs"
                disabled={draft.length === 0}
                onClick={() => {
                  if (draft.length > 0) {
                    setSelectedAdvisors(draft);
                    setOpen(false);
                  }
                }}
              >
                Apply
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }


  if (advisorFilterVariant === 'lozenges') {
    return (
      <div className="flex items-center gap-2 ml-2">
        {advisors.map(a => {
          const selected = selectedAdvisors.includes(a.id);
          return (
            <button
              key={a.id}
              onClick={() => toggle(a.id)}
              title={a.name}
              className={`h-8 px-3 rounded-full text-xs font-medium transition-all flex items-center justify-center border outline-none ${
                selected
                  ? 'bg-white text-[#113057] border-[#69C6EC] hover:bg-[#69C6EC]/20'
                  : 'bg-transparent text-white/50 border-white/30 hover:bg-[#69C6EC]/20 hover:text-white/80 hover:border-[#69C6EC]/60'
              }`}
            >
              {a.name}
            </button>
          );
        })}
      </div>
    );
  }

  if (advisorFilterVariant === 'photos') {
    return (
      <div className="flex items-center gap-3 ml-2">
        {advisors.map(a => {
          const selected = selectedAdvisors.includes(a.id);
          return (
            <button
              key={a.id}
              onClick={() => toggle(a.id)}
              title={a.name}
              className={`h-8 w-8 rounded-full overflow-hidden transition-all ring-2 outline-none ${
                selected
                  ? 'ring-[#69C6EC] opacity-100'
                  : 'ring-white/30 opacity-40 grayscale hover:opacity-80 hover:grayscale-0 hover:ring-[#69C6EC]/60'
              }`}
            >
              {a.photo ? (
                <img src={a.photo} alt={a.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs font-semibold text-white">{a.initials}</span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Default: initials
  return (
    <div className="flex items-center gap-3 ml-2">
      {advisors.map(a => {
        const selected = selectedAdvisors.includes(a.id);
        return (
          <button
            key={a.id}
            onClick={() => toggle(a.id)}
            title={a.name}
            className={`h-8 w-8 rounded-full text-xs font-semibold transition-all flex items-center justify-center ring-1 outline-none ${
              selected
                ? 'bg-white text-[#113057] border border-[#69C6EC] ring-[#69C6EC] focus:ring-[#69C6EC] hover:bg-[#69C6EC]/30 hover:text-white/80 hover:ring-[#69C6EC]/60'
                : 'bg-transparent text-white/40 ring-white/30 focus:ring-white/30 hover:bg-[#69C6EC]/30 hover:text-white/80 hover:ring-[#69C6EC]/60'
            }`}
          >
            {a.initials}
          </button>
        );
      })}
    </div>
  );
};
