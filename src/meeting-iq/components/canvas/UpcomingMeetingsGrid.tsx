// @ts-nocheck
import React, { useMemo, useEffect, useState } from "react";
import { Calendar, MapPin, Video, Clock, UserCog, CheckCircle2, AlertTriangle, Sparkles, CalendarClock, Plus } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { getEnhancedMeetingsList } from "@miq/data/mockDailyHighlights";
import { getUnifiedClientById } from "@miq/data/unifiedClientData";
import { useAppStore } from "@miq/stores/useAppStore";
import { useAssistantMode } from "@miq/hooks/useAssistantMode";
import { useCardInteractionMode, useFeatureMode } from "@miq/hooks/useFeatureMode";
import { useCardStatusLocation } from "@miq/hooks/useCardStatusLocation";
import { getAdvisorForName } from "@miq/lib/userContext";
import {
  differenceInMonths,
  format,
  isPast,
  isToday,
} from "date-fns";
import { cn } from "@miq/lib/utils";
import { formatTimeString } from "@miq/utils/formatters";
import type { EnhancedMeetingData } from "@miq/components/canvas/MeetingCard";
import { AgendaStatus, type AgendaStatusValue } from "@miq/components/canvas/AgendaStatus";

import { RowActionsMenu } from "@miq/components/canvas/CalendarCanvas";
import { MeetingDetailsModal } from "@miq/components/canvas/MeetingDetailsModal";
import { useCopy } from "@miq/lib/copy";


export type TimeFilter = "today" | "this_week" | "this_month" | "all_upcoming" | "custom";

interface UpcomingMeetingsGridProps {
  onCanvasAction?: (action: string, data?: any) => void;
  onPromptRequest?: (prompt: string) => void;
  onAddMeetingClick?: () => void;
}

export const UpcomingMeetingsGrid: React.FC<UpcomingMeetingsGridProps> = ({
  onCanvasAction,
}) => {
  const meetingData = useMemo(() => getEnhancedMeetingsList(undefined, true), []);
  const { meetingPrepStates, initMeetingPrepStates, meetingGeneratingStates, regeneratingClientIds, setMeetingGeneratingState } = useAppStore();
  const { isClickableCard } = useCardInteractionMode();
  const { isPostMVP } = useFeatureMode();
  const { isFooter: statusInFooter } = useCardStatusLocation();
  const navigate = useNavigate();
  const [editingMeeting, setEditingMeeting] = useState<EnhancedMeetingData | null>(null);

  const buildEditMeeting = (m: EnhancedMeetingData) => {
    let isoDate: string;
    try {
      const d = typeof m.date === 'string' ? new Date(m.date) : m.date;
      isoDate = d.toISOString();
    } catch {
      isoDate = new Date().toISOString();
    }
    return {
      id: m.id,
      clientId: m.clientId || '',
      clientName: m.clientName,
      type: m.type || 'Annual Review',
      title: m.title || `${m.type || 'Annual Review'} – ${m.clientName}`,
      date: isoDate,
      time: m.time || '09:00',
      duration: m.duration || 60,
      location: m.location || { type: 'office' as const },
      readiness: null,
    } as any;
  };

  const handleGenerateNow = (meetingId: string) => {
    setMeetingGeneratingState(meetingId, 'generating');
    setTimeout(() => {
      setMeetingGeneratingState(meetingId, 'in_progress');
    }, 3000);
  };
  const { isAssistantMode, selectedAdvisors } = useAssistantMode();

  const getMeetingStartTime = (meeting: EnhancedMeetingData) => {
    const date = typeof meeting.date === "string" ? new Date(meeting.date) : new Date(meeting.date);
    const time = String(meeting.time || "").trim();
    const twelveHour = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    const twentyFourHour = time.match(/^(\d{1,2}):(\d{2})$/);

    if (twelveHour) {
      let hours = Number(twelveHour[1]);
      const minutes = Number(twelveHour[2]);
      const period = twelveHour[3].toUpperCase();
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      date.setHours(hours, minutes, 0, 0);
    } else if (twentyFourHour) {
      date.setHours(Number(twentyFourHour[1]), Number(twentyFourHour[2]), 0, 0);
    }

    return date.getTime();
  };

  useEffect(() => {
    const nowMs = Date.now();
    const isSweetsInit = (m: EnhancedMeetingData) =>
      m.clientId === 'client-sweets-family' || /sweets/i.test(m.clientName || '');
    const sortedUpcoming = meetingData
      .filter((m) => isSweetsInit(m) || getMeetingStartTime(m) >= nowMs)
      .sort((a, b) => getMeetingStartTime(a) - getMeetingStartTime(b));
    const upcomingMeetings = sortedUpcoming.slice(0, 10);
    const defaults: Record<string, boolean> = {};
    upcomingMeetings.forEach((m) => { defaults[m.id] = true; });
    if (Object.keys(defaults).length > 0) {
      initMeetingPrepStates(defaults);
    }
  }, [meetingData, initMeetingPrepStates]);

  const displayMeetings = useMemo(() => {
    const now = new Date();
    const nowMs = now.getTime();
    const todayStart = new Date(now.toDateString());
    const isSweets = (m: EnhancedMeetingData) =>
      m.clientId === 'client-sweets-family' || /sweets/i.test(m.clientName || '');
    const filtered = meetingData
      .filter((meeting) => {
        if (!meetingPrepStates[meeting.id]) return false;
        if (!isSweets(meeting) && getMeetingStartTime(meeting) < nowMs) return false;
        if (isAssistantMode) {
          const advisor = getAdvisorForName(meeting.clientName);
          if (!selectedAdvisors.includes(advisor.id)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (isSweets(a) && !isSweets(b)) return -1;
        if (!isSweets(a) && isSweets(b)) return 1;
        return getMeetingStartTime(a) - getMeetingStartTime(b);
      });
    const chronologicalMeetings = filtered.slice(0, 10);
    const sevenDaysOut = new Date(todayStart);
    sevenDaysOut.setDate(todayStart.getDate() + 7);
    return chronologicalMeetings
      .map(m => {
        const genState = meetingGeneratingStates[m.id];
        const meetingDate = typeof m.date === 'string' ? new Date(m.date) : m.date;
        const isFailed = m.clientId === 'client-lisa-anderson' || m.clientName === 'Lisa Anderson'
          || m.clientId === 'client-johnson' || m.clientName === 'Robert & Patricia Johnson';
        const withinSevenDays = meetingDate >= todayStart && meetingDate < sevenDaysOut;
        let prepStatus: 'ready' | 'in_progress' | 'failed';
        if (isFailed && withinSevenDays) {
          prepStatus = 'failed';
        } else if (withinSevenDays) {
          prepStatus = 'ready';
        } else {
          prepStatus = 'in_progress';
        }
        if (genState) prepStatus = 'in_progress';
        return { ...m, preparationStatus: prepStatus, _generatingState: genState || null };
      });
  }, [meetingData, meetingPrepStates, meetingGeneratingStates, isAssistantMode, selectedAdvisors]);

  const getMeetingTypeTitle = (meeting: EnhancedMeetingData) => {
    if (meeting.title) return meeting.title;
    switch (meeting.type) {
      case "Annual Review": return "Annual Review";
      case "Bi-Annual Review": return "Bi-Annual Review";
      case "Quarterly Review": return "Quarterly Review";
      case "Client Planning": return "Client Planning";
      case "Estate Planning Session": return "Estate Planning Session";
      default: return "Meeting";
    }
  };

  const getFormattedDate = (date: Date | string) => {
    try {
      const d = typeof date === "string" ? new Date(date) : date;
      return d.toLocaleDateString("en-US", {
        weekday: "short", month: "short", day: "numeric",
      });
    } catch {
      return "Date TBD";
    }
  };

  const getLocationText = (location?: { type: string; details?: string }) => {
    let text = "";
    switch (location?.type) {
      case "virtual": text = "Virtual"; break;
      case "client_location": text = location.details || "Client Location"; break;
      case "office":
      default: text = location?.details || "Office";
    }
    return text.replace("Conference", "Conf.");
  };

  const getLocationIcon = (type?: "office" | "virtual" | "client_location") => {
    switch (type) {
      case "virtual": return <Video className="h-4 w-4" />;
      case "client_location": return <MapPin className="h-4 w-4" />;
      case "office":
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getStatusVisual = (status: AgendaStatusValue) => {
    switch (status) {
      case 'ready': return { Icon: CheckCircle2, tooltip: 'Agenda ready', colorClass: 'text-success' };
      case 'completed': return { Icon: CheckCircle2, tooltip: 'Meeting completed', colorClass: 'text-muted-foreground' };
      case 'failed': return { Icon: AlertTriangle, tooltip: 'Agenda Issue, view to resolve', colorClass: 'text-destructive' };
      case 'generating': return { Icon: Sparkles, tooltip: 'Generating agenda…', colorClass: 'text-primary animate-pulse', spin: false };
      case 'regenerating': return { Icon: Sparkles, tooltip: 'Regenerating agenda…', colorClass: 'text-warning animate-pulse', spin: false };
      case 'scheduled': return { Icon: CalendarClock, tooltip: 'Agenda scheduled', colorClass: 'text-primary' };
      case 'not_set': return { Icon: Plus, tooltip: 'No meeting type — click to set', colorClass: 'text-warning' };
      case 'in_progress':
      default: return { Icon: Clock, tooltip: 'Agenda in progress', colorClass: 'text-primary' };
    }
  };

  const handleClick = (meeting: EnhancedMeetingData, opts?: { noAgenda?: boolean }) => {
    if (isClickableCard && meeting.clientId) {
      const meetingDate = typeof meeting.date === 'string' ? meeting.date : meeting.date.toISOString();
      const dateStr = meetingDate.split('T')[0];
      navigate(`/meeting-prep/${meeting.clientId}/${dateStr}`, {
        state: {
          noAgenda: !!opts?.noAgenda,
          meetingId: meeting.id,
          meetingType: meeting.type,
          meetingTime: meeting.time,
          meetingTitle: meeting.title,
          meetingLocation: meeting.location,
        },
      });
      return;
    }
    onCanvasAction?.("meeting_prep", { clientName: meeting.clientName, meeting });
  };

  if (displayMeetings.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="h-full w-full overflow-visible">
      <div className="w-full pb-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {displayMeetings.map((meeting) => {
            const meetingDate = typeof meeting.date === "string" ? new Date(meeting.date) : meeting.date;
            const isMeetingPast = isPast(meetingDate) && !isToday(meetingDate);
            const isRegenerating = !!(meeting.clientId && regeneratingClientIds[meeting.clientId]);
            const isParkerForceGenerating = /steven\s*&\s*julia\s*parker/i.test(meeting.clientName || '');
            const status: AgendaStatusValue =
              isParkerForceGenerating ? 'generating'
              : isRegenerating ? 'regenerating'
              : meeting._generatingState === 'generating' ? 'generating'
              : meeting._generatingState === 'in_progress' ? 'in_progress'
              : meeting.preparationStatus === 'failed' ? 'failed'
              : isMeetingPast ? 'completed'
              : meeting.preparationStatus === 'ready' ? 'ready'
              : 'in_progress';
            const hideAgendaStatus = !isPostMVP || (isClickableCard && (status === 'ready' || status === 'completed'));
            const noAgendaForRoute = status === 'in_progress' || status === 'failed' || status === 'generating' || status === 'regenerating';
            const statusVisual = getStatusVisual(status);
            const StatusIcon = statusVisual.Icon;
            return (
              <Card
                key={meeting.id}
                onClick={isClickableCard && !isRegenerating ? () => handleClick(meeting, { noAgenda: noAgendaForRoute }) : undefined}
                className={cn(
                  "bg-white overflow-hidden border border-border w-full rounded-lg",
                  isClickableCard && !isRegenerating && "cursor-pointer transition-all hover:shadow-md hover:border-primary/40"
                )}
              >
                <CardContent className="p-0 h-full flex flex-col">
                  <div className={cn(
                    "px-3 bg-[#F2F7FC] border-b border-border rounded-t-lg flex items-start gap-2",
                    statusInFooter ? "py-1.5" : "py-2"
                  )}>
                    <div className="min-w-0 flex-1">
                      <h3 className={cn("font-semibold text-xs text-primary truncate", !statusInFooter && "mb-0.5")}>{meeting.clientName}</h3>
                      {!statusInFooter && (
                        <div className="flex items-center min-w-0">
                          <p className="text-[11px] font-medium whitespace-nowrap text-muted-foreground">
                            {`${getMeetingTypeTitle(meeting)} Agenda`}
                          </p>
                        </div>
                      )}
                    </div>
                    {!statusInFooter && (
                      <span
                        className={cn('inline-flex items-center justify-center h-5 w-5 shrink-0', statusVisual.colorClass)}
                        title={statusVisual.tooltip}
                      >
                        <StatusIcon className={cn('h-5 w-5', statusVisual.spin && 'animate-spin')} />
                      </span>
                    )}
                    <div className="shrink-0 -mr-1 -mt-0.5">
                      {isPostMVP && (
                        <RowActionsMenu
                          agendaStatus={status}
                          hasHousehold={true}
                          onEdit={() => setEditingMeeting(meeting)}
                          onDelete={() => { toast.success('Meeting prep deleted'); }}
                          onViewAgenda={() => handleClick(meeting)}
                          onGenerate={() => handleGenerateNow(meeting.id)}
                          onSetType={() => handleClick(meeting)}
                        />
                      )}
                    </div>
                  </div>

                  <div className="px-3 pt-2 pb-2 flex-1 flex flex-col">
                    <div className="space-y-1.5">
                      {isAssistantMode && (
                        <div className="flex items-center gap-1.5 text-[11px] text-foreground">
                          <UserCog className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{getAdvisorForName(meeting.clientName).name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-[11px] text-foreground">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{getFormattedDate(meeting.date)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-foreground">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          {formatTimeString(meeting.time)} ({meeting.duration} min)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-foreground">
                        <span className="shrink-0 [&_svg]:h-3.5 [&_svg]:w-3.5">{getLocationIcon(meeting.location?.type)}</span>
                        <span className="truncate">{getLocationText(meeting.location)}</span>
                      </div>
                    </div>
                    {statusInFooter && (
                      <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-center gap-1 min-w-0">
                        <span className={cn('inline-flex items-center justify-center h-4 w-4 shrink-0', statusVisual.colorClass)} title={statusVisual.tooltip}>
                          <StatusIcon className={cn('h-3.5 w-3.5', statusVisual.spin && 'animate-spin')} />
                        </span>
                        <p className="text-[11px] font-semibold whitespace-nowrap text-gray-700">
                          {`${getMeetingTypeTitle(meeting)} Agenda`}
                        </p>
                      </div>
                    )}
                  </div>

                  {!hideAgendaStatus && (
                    <div className="px-3 pb-3 flex justify-center rounded-b-lg">
                      <AgendaStatus
                        meetingType={meeting.type}
                        status={status}
                        tooltip={
                          !isClickableCard && meeting.preparationStatus !== 'failed' && !isRegenerating && !isMeetingPast && meeting._generatingState !== 'generating' && meeting.preparationStatus !== 'ready'
                            ? 'This may take up to 20 minutes. You will be notified when ready.'
                            : undefined
                        }
                        onViewAgenda={isRegenerating ? undefined : () => handleClick(meeting)}
                        onSetAgenda={isRegenerating ? undefined : () => handleClick(meeting)}
                        onGenerate={isRegenerating ? undefined : () => handleGenerateNow(meeting.id)}
                        disclosureMode="popover"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      {editingMeeting && (
        <MeetingDetailsModal
          mode="edit"
          meeting={buildEditMeeting(editingMeeting)}
          isOpen={!!editingMeeting}
          onClose={() => setEditingMeeting(null)}
          onSave={() => { setEditingMeeting(null); toast.success('Meeting updated'); }}
        />
      )}
    </div>
  );
};

const EmptyState: React.FC = () => {
  const title = useCopy('home.empty.title', 'No active meeting preps.');
  const body = useCopy('home.empty.body', 'Toggle "Client Review" on in the Calendar to add meetings here.');
  return (
    <div className="h-full w-full overflow-auto">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <div className="rounded-full bg-muted p-3 mb-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="font-semibold text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground mt-1">{body}</p>
        </div>
      </div>
    </div>
  );
};
