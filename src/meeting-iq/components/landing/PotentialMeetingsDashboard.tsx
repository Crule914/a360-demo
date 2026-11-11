// @ts-nocheck
import React, { useState, useCallback, useEffect, useRef } from "react";
import { useFeatureMode } from "@miq/hooks/useFeatureMode";
import { useAssistantMode } from "@miq/hooks/useAssistantMode";
import { getAdvisorForName } from "@miq/lib/userContext";
import { differenceInMonths } from "date-fns";
import { CalendarPlus, Sparkles, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CircularReadinessScore } from "@miq/components/canvas/readiness/CircularReadinessScore";
import { ReadinessModal } from "@miq/components/canvas/readiness/ReadinessModal";
import { ContentReadiness, getTierColor } from "@miq/services/HouseholdAgendaReadinessService";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MeetingDetailsModal, NewMeetingData } from "@miq/components/canvas/MeetingDetailsModal";
import { toast } from "@miq/hooks/use-toast";
import { format, parseISO } from "date-fns";

const formatDateWithMonths = (dateStr?: string): string => {
  if (!dateStr) return "—";
  try {
    const date = parseISO(dateStr);
    const today = new Date();
    const months = differenceInMonths(today, date);
    const formattedDate = format(date, "MMM d, yyyy");
    return `${formattedDate} (${months} ${months === 1 ? 'month' : 'months'})`;
  } catch {
    return "—";
  }
};

interface PotentialMeetingsDashboardProps {
  clients: ContentReadiness[];
  onClientClick?: (clientId: string, clientName: string) => void;
  onMeetingScheduled?: (clientName: string) => void;
  maxItems?: number;
}

export const PotentialMeetingsDashboard: React.FC<PotentialMeetingsDashboardProps> = ({
  clients,
  onClientClick,
  onMeetingScheduled,
  maxItems = 100
}) => {
  const { isPostMVP } = useFeatureMode();
  const { isAssistantMode, selectedAdvisors } = useAssistantMode();
  const [selectedClientReadiness, setSelectedClientReadiness] = useState<ContentReadiness | null>(null);
  const [filterTier, setFilterTier] = useState<"low" | null>(null);
  const [isReadinessModalOpen, setIsReadinessModalOpen] = useState(false);
  const [readinessModalClient, setReadinessModalClient] = useState<ContentReadiness | null>(null);
  // Track per-row generation state: 'generating' | 'removing'
  const [rowStates, setRowStates] = useState<Record<string, 'generating' | 'removing'>>({});
  const [removedClientIds, setRemovedClientIds] = useState<Set<string>>(new Set());
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  // Schedule modal state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleClientName, setScheduleClientName] = useState('');
  const [scheduleClientId, setScheduleClientId] = useState('');

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
    };
  }, []);

  const handleScheduleClick = useCallback((clientId: string, clientName: string) => {
    setScheduleClientId(clientId);
    setScheduleClientName(clientName);
    setIsScheduleModalOpen(true);
  }, []);

  const handleScheduleConfirm = useCallback((meetingData: NewMeetingData) => {
    const clientId = scheduleClientId;
    const clientName = scheduleClientName;
    setIsScheduleModalOpen(false);
    if (rowStates[clientId]) return;
    setRowStates((prev) => ({ ...prev, [clientId]: 'generating' }));
    onMeetingScheduled?.(clientName);
    const timer = setTimeout(() => {
      // Begin collapse animation
      setRowStates((prev) => ({ ...prev, [clientId]: 'removing' }));
      toast({
        title: 'Scheduled',
        description: `${clientName} meeting agenda was successfully scheduled`,
      });
      const removeTimer = setTimeout(() => {
        setRemovedClientIds((prev) => {
          const next = new Set(prev);
          next.add(clientId);
          return next;
        });
      }, 300);
      timersRef.current[`${clientId}-remove`] = removeTimer;
    }, 3000);
    timersRef.current[clientId] = timer;
  }, [rowStates, scheduleClientId, scheduleClientName, onMeetingScheduled]);

  const handleReadinessClick = (client: ContentReadiness) => {
    setReadinessModalClient(client);
    setIsReadinessModalOpen(true);
  };

  // Preferred display order for demo
  const preferredOrder = [
  "David & Priya Kapoor",
  "Robert Martinez",
  "Amanda Brown",
  "Marcus Freeman"];


  const orderedClients = (() => {
    const ordered: ContentReadiness[] = [];
    for (const name of preferredOrder) {
      const found = clients.find((c) => c.clientName === name);
      if (found) ordered.push(found);
    }
    const remaining = clients.filter((c) => !preferredOrder.includes(c.clientName));
    return [...ordered, ...remaining];
  })();

  const tierCounts = {
    high: clients.filter((c) => c.tier === "high").length,
    medium: clients.filter((c) => c.tier === "medium").length,
    low: clients.filter((c) => c.tier === "low").length
  };

  if (clients.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        <p className="text-sm">All clients have scheduled meetings.</p>
      </div>);
  }

  // Show all clients, filter by low tier and/or advisor if selected
  const advisorFiltered = isAssistantMode
    ? orderedClients.filter((c) => selectedAdvisors.includes(getAdvisorForName(c.clientName).id))
    : orderedClients;
  const filteredClients2 = filterTier ? advisorFiltered.filter((c) => c.tier === filterTier) : advisorFiltered;
  const visibleClients = filteredClients2.filter((c) => !removedClientIds.has(c.clientId));
  const displayedClients = visibleClients.slice(0, maxItems);

  return (
    <div>
      <div className="space-y-1">
        {tierCounts.low > 0 &&
        <div className="flex justify-end">
            <Badge
            variant={filterTier === "low" ? "default" : "outline"}
            className={`cursor-pointer text-xs ${filterTier === "low" ? "" : getTierColor("low").text}`}
            onClick={() => setFilterTier(filterTier === "low" ? null : "low")}>
              Needs Data ({tierCounts.low})
            </Badge>
          </div>
        }

        <div>
          <div className={`grid ${
            isPostMVP && isAssistantMode ? 'grid-cols-[1.2fr_0.8fr_0.8fr_1fr_1fr_130px]' :
            isPostMVP ? 'grid-cols-[1.2fr_0.8fr_1fr_1fr_130px]' :
            isAssistantMode ? 'grid-cols-[1.2fr_0.8fr_1fr_130px]' :
            'grid-cols-[1.2fr_1fr_130px]'
          } gap-4 items-center py-2 px-[25px] text-xs font-semibold text-muted-foreground uppercase tracking-wider text-left`}>
            <span>Household</span>
            {isAssistantMode && <span>Advisor</span>}
            {isPostMVP && <span>Category</span>}
            <span>Last Touch Point </span>
            {isPostMVP && <span>Context</span>}
            <span className="text-center">Schedule</span>
          </div>

          <div className="border border-border rounded-lg bg-white overflow-hidden">

          {displayedClients.map((client, index) => {
              const state = rowStates[client.clientId];
              const isRemoving = state === 'removing';
              return (
                <div
                  key={client.clientId}
                  className={`grid ${
                    isPostMVP && isAssistantMode ? 'grid-cols-[1.2fr_0.8fr_0.8fr_1fr_1fr_130px]' :
                    isPostMVP ? 'grid-cols-[1.2fr_0.8fr_1fr_1fr_130px]' :
                    isAssistantMode ? 'grid-cols-[1.2fr_0.8fr_1fr_130px]' :
                    'grid-cols-[1.2fr_1fr_130px]'
                  } gap-4 items-center px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                    isRemoving ? 'max-h-0 py-0 opacity-0 border-0' : 'max-h-20 py-2'
                  } ${index < displayedClients.length - 1 && !isRemoving ? 'border-b border-border' : ''}`}>

              <span className="text-sm font-medium text-foreground truncate text-left">
                {client.clientName}
              </span>

              {isAssistantMode && (
                <span className="text-xs text-muted-foreground truncate">
                  {getAdvisorForName(client.clientName).name}
                </span>
              )}

              {isPostMVP && (
                <span className="text-xs text-muted-foreground">
                  {client.serviceTier || '—'}
                </span>
              )}

              <span className="text-xs text-muted-foreground">{formatDateWithMonths(client.lastMeetingDate)}</span>

              {isPostMVP && (
                <div className="flex items-center">
                  <CircularReadinessScore
                        contentLayers={client.contentLayers}
                        contentPercentage={client.contentPercentage}
                        clientName={client.clientName}
                        onScoreClick={() => handleReadinessClick(client)}
                        size={32} />
                      
                </div>
              )}

              <div className="flex justify-center w-[130px]">
                {state === 'generating' || state === 'removing' ?
                    <div className="flex items-center gap-1.5 text-primary">
                    <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                    <span className="text-xs font-medium whitespace-nowrap">Scheduling...</span>
                  </div> :
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-lg"
                      onClick={() => handleScheduleClick(client.clientId, client.clientName)}
                      title="+ Schedule Meeting">
                    <CalendarPlus className="h-4 w-4" />
                  </Button>
                    }
              </div>
            </div>);

            })}
          </div>
        </div>

        </div>

        <p className="text-sm text-muted-foreground mt-4">Reach out to the client directly to schedule a meeting, or click the meeting icon to start preparing.</p>

      <MeetingDetailsModal
        mode="schedule"
        clientName={scheduleClientName}
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onCreate={handleScheduleConfirm} />
      

      {readinessModalClient &&
      <ReadinessModal
        isOpen={isReadinessModalOpen}
        onClose={() => setIsReadinessModalOpen(false)}
        layers={readinessModalClient.contentLayers}
        clientName={readinessModalClient.clientName}
        hideL1L2={true} />
      }
    </div>);

};