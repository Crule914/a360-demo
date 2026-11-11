// @ts-nocheck
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { AgendaStatus, type AgendaStatusValue } from './AgendaStatus';
import { AgendaStatusIcon } from './AgendaStatusIcon';

import { useAssistantMode } from '@miq/hooks/useAssistantMode';
import { useFeatureMode } from '@miq/hooks/useFeatureMode';
import { getAdvisorForName } from '@miq/lib/userContext';
import { ToggleLeft, Gauge, X, Check, UserPlus, Users, Search, Loader2, Sparkles, RefreshCw, Play, ArrowUp, ArrowDown, ClipboardList, LineChart, Target, PiggyBank, Building2, Calculator, Shield, MessageSquare, Plus, Info, CalendarCheck, PlusCircle, MoreVertical, Pencil, Trash2, FileText, Tag, CheckCircle2, AlertTriangle, Clock, CalendarClock } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@miq/components/common/ConfirmDialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@miq/stores/useAppStore';
import { useCopy } from '@miq/lib/copy';

import { generateMessySubject } from '@miq/utils/messySubjectGenerator';
import {
  format,
  startOfWeek,
  endOfWeek,
  addWeeks,
  addDays,
  isSameDay,
  parseISO,
  startOfMonth,
  endOfMonth,
  addMonths,
  startOfDay,
  endOfDay,
  differenceInDays,
  isPast,
  isToday } from
'date-fns';
import { ChevronLeft, ChevronRight, Calendar, ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogDescription } from
'@/components/ui/dialog';
import { getEnhancedMeetingsList } from '@miq/data/mockDailyHighlights';
import { getClientByName, mockClients } from '@miq/data/mockClients';
import { evaluateHouseholdReadiness, createUnmatchedClientReadiness, HouseholdReadiness } from '@miq/services/HouseholdAgendaReadinessService';
import { CircularReadinessScore } from '@miq/components/canvas/readiness/CircularReadinessScore';
import { ReadinessModal } from '@miq/components/canvas/readiness';
import { EnhancedMeetingData } from '@miq/components/canvas/MeetingCard';
import { MeetingDetailsModal } from '@miq/components/canvas/MeetingDetailsModal';
import { Input } from '@/components/ui/input';
import { AdvisorFilterAvatars } from '@miq/components/canvas/AdvisorFilterAvatars';

export interface MeetingWithReadiness extends Omit<EnhancedMeetingData, 'preparationStatus'> {
  preparationStatus: 'ready' | 'in_progress' | 'needs_attention' | 'queued' | 'failed';
  readiness: HouseholdReadiness | null;
  resolvedClient?: ReturnType<typeof getClientByName>;
}

interface DayGroup {
  date: Date;
  dateLabel: string;
  meetings: MeetingWithReadiness[];
}

interface CalendarCanvasProps {
  data?: {
    initialWeekStart?: string;
    viewMode?: 'day' | 'week' | 'month';
  };
  onCanvasAction?: (action: string, data?: any) => void;
  onPromptRequest?: (prompt: string) => void;
}

const formatTimeRange = (time: string | undefined, duration: number): string => {
  if (!time) return 'Time TBD';
  try {
    const parts = time.split(':');
    if (parts.length < 2) return time;
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    if (isNaN(hours) || isNaN(minutes)) return time;
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    const endDate = new Date(startDate.getTime() + (duration || 60) * 60000);
    const formatTime = (date: Date) => format(date, 'h:mm a').toLowerCase();
    return `${formatTime(startDate)} - ${formatTime(endDate)}`;
  } catch {
    return time || 'Time TBD';
  }
};

const getAttendeeNames = (meeting: { clientName: string; resolvedClient?: ReturnType<typeof getClientByName> }): string[] => {
  const client = meeting.resolvedClient;
  if (!client) {
    const ampMatch = client ? null : meeting.clientName.match(/^(.+?)\s*&\s*(.+?)\s+(\S+)$/);
    if (ampMatch) {
      return [`${ampMatch[1]} ${ampMatch[3]}`, `${ampMatch[2].trim()} ${ampMatch[3]}`];
    }
    return [meeting.clientName];
  }
  const names: string[] = [];
  if (!/^the\s+/i.test(client.name) && !/\bfamily\b/i.test(client.name)) {
    const ampMatch = client.name.match(/^(.+?)\s*&\s*(.+?)\s+(\S+)$/);
    if (ampMatch) {
      names.push(`${ampMatch[1]} ${ampMatch[3]}`, `${ampMatch[2].trim()} ${ampMatch[3]}`);
    } else {
      names.push(client.name);
    }
  }
  if (client.extendedHousehold) {
    for (const member of client.extendedHousehold) {
      if (member.role === 'spouse' && !names.some(n => n === member.name)) {
        names.push(member.name);
      }
    }
  }
  if (names.length === 0) names.push(client.name);
  return names;
};

const getAgendaTypeIcon = (type?: string): { Icon: React.ComponentType<{ className?: string }>; tone: string; label: string; isSet: boolean } => {
  const t = (type || '').trim();
  switch (t) {
    case 'Annual Review':
    case 'Bi-Annual Review':
    case 'Quarterly Review':
      return { Icon: ClipboardList, tone: 'text-primary', label: t, isSet: true };
    case 'Portfolio Review':
      return { Icon: LineChart, tone: 'text-primary', label: t, isSet: true };
    case 'Financial Planning':
    case 'Client Planning':
      return { Icon: Target, tone: 'text-primary', label: t, isSet: true };
    case 'Retirement Planning':
      return { Icon: PiggyBank, tone: 'text-primary', label: t, isSet: true };
    case 'Estate Planning':
    case 'Estate Planning Session':
      return { Icon: Building2, tone: 'text-primary', label: t, isSet: true };
    case 'Tax Planning':
      return { Icon: Calculator, tone: 'text-primary', label: t, isSet: true };
    case 'Insurance Review':
      return { Icon: Shield, tone: 'text-primary', label: t, isSet: true };
    case 'Initial Consultation':
      return { Icon: UserPlus, tone: 'text-primary', label: t, isSet: true };
    case 'Follow-up':
      return { Icon: MessageSquare, tone: 'text-primary', label: t, isSet: true };
    default:
      return { Icon: Plus, tone: 'text-primary', label: 'No meeting type — click to set', isSet: false };
  }
};

const getMvpStatusVisual = (status: AgendaStatusValue) => {
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
      return { Icon: Plus, tooltip: 'Set Meeting Type', colorClass: 'text-primary' };
    case 'in_progress':
    default:
      return { Icon: Clock, tooltip: 'Agenda in progress', colorClass: 'text-primary' };
  }
};

const AGENDA_STATUS_LABELS: Record<AgendaStatusValue, string> = {
  ready: 'Ready',
  in_progress: 'Scheduled',
  scheduled: 'Scheduled',
  generating: 'Generating Agenda…',
  regenerating: 'Regenerating',
  completed: 'Completed',
  failed: 'Agenda Issue',
  not_set: 'Schedule Agenda',
};

const AgendaCellMVP: React.FC<{
  status: AgendaStatusValue;
  meetingType?: string;
  onClick?: () => void;
}> = ({ status, meetingType, onClick }) => {
  const v = getMvpStatusVisual(status);
  const StatusIcon = v.Icon;
  void meetingType;
  const statusLabel = AGENDA_STATUS_LABELS[status] ?? 'Scheduled';
  return (
    <button
      type="button"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      className="flex items-center gap-1 min-w-0 text-left hover:opacity-80 transition-opacity"
      title={v.tooltip}
    >
      <span className={cn('inline-flex items-center justify-center h-5 w-5 shrink-0', v.colorClass)} title={v.tooltip}>
        <StatusIcon className={cn('h-4 w-4', v.spin && 'animate-spin')} />
      </span>
      <span className={cn('text-xs font-medium whitespace-nowrap', v.colorClass)}>{statusLabel}</span>
    </button>
  );
};

const CALENDAR_GRID = "grid grid-cols-[110px_minmax(100px,0.75fr)_minmax(100px,0.75fr)_110px_170px_24px] gap-x-3 items-center";
const CALENDAR_GRID_ASSISTANT = "grid grid-cols-[110px_minmax(100px,0.75fr)_minmax(100px,0.75fr)_150px_110px_170px_24px] gap-x-3 items-center";
const CALENDAR_GRID_MVP = "grid grid-cols-[90px_minmax(100px,0.75fr)_minmax(100px,0.75fr)_190px_24px] gap-x-3 items-center";
const CALENDAR_GRID_MVP_ASSISTANT = "grid grid-cols-[90px_minmax(100px,0.75fr)_minmax(100px,0.75fr)_150px_190px_24px] gap-x-3 items-center";
const ALT_CALENDAR_GRID = "grid grid-cols-[170px_minmax(100px,0.75fr)_minmax(100px,0.75fr)_110px_170px_24px] gap-x-3 items-center";
const ALT_CALENDAR_GRID_ASSISTANT = "grid grid-cols-[170px_minmax(100px,0.75fr)_minmax(100px,0.75fr)_150px_110px_170px_24px] gap-x-3 items-center";
const ALT_CALENDAR_GRID_MVP = "grid grid-cols-[150px_minmax(100px,0.75fr)_minmax(100px,0.75fr)_190px_24px] gap-x-3 items-center";
const ALT_CALENDAR_GRID_MVP_ASSISTANT = "grid grid-cols-[150px_minmax(100px,0.75fr)_minmax(100px,0.75fr)_150px_190px_24px] gap-x-3 items-center";

export const RowActionsMenu: React.FC<{
  agendaStatus: AgendaStatusValue;
  hasHousehold: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onViewAgenda: () => void;
  onGenerate: () => void;
  onSetType: () => void;
  clientName?: string;
  meetingDateLabel?: string;
}> = ({ agendaStatus, hasHousehold, onEdit, onDelete, onViewAgenda, onGenerate, onSetType, clientName, meetingDateLabel }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const copyViewDetails = useCopy('home.card.menu.view', 'View Details');
  const copySetType = useCopy('home.card.menu.settype', 'Set Meeting Type');
  const copyGenerate = useCopy('home.card.menu.generate', 'Generate Agenda');
  const copyEdit = useCopy('home.card.menu.edit', 'Edit Meeting Prep');
  const copyDelete = useCopy('home.card.menu.delete', 'Delete Meeting Prep');
  const copyConfirmTitle = useCopy('confirm.delete.title', 'Delete Meeting Prep?');
  const copyConfirmBtn = useCopy('confirm.delete.confirm', 'Delete Meeting Prep');

  const requestDelete = (e: Event) => { e.preventDefault(); setConfirmDelete(true); };

  const renderAgendaItems = () => {
    const viewDetails = (
      <DropdownMenuItem onSelect={onViewAgenda}>
        <FileText className="h-4 w-4 mr-2" /> {copyViewDetails}
      </DropdownMenuItem>
    );
    switch (agendaStatus) {
      case 'not_set':
        return (
          <>
            {hasHousehold && viewDetails}
            <DropdownMenuItem onSelect={onSetType}>
              <Tag className="h-4 w-4 mr-2" /> {copySetType}
            </DropdownMenuItem>
          </>
        );
      case 'scheduled':
      case 'in_progress':
        return (
          <>
            {viewDetails}
            <DropdownMenuItem onSelect={onGenerate}>
              <RefreshCw className="h-4 w-4 mr-2" /> {copyGenerate}
            </DropdownMenuItem>
          </>
        );
      default:
        return viewDetails;
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Row actions"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center h-6 w-6 -ml-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" onClick={(e) => e.stopPropagation()}>
          {renderAgendaItems()}
          <DropdownMenuItem onSelect={onEdit}>
            <Pencil className="h-4 w-4 mr-2" /> {copyEdit}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={requestDelete}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" /> {copyDelete}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={copyConfirmTitle}
        description={
          <>
            This permanently deletes the meeting prep and its agenda
            {clientName ? <> for <strong>{clientName}</strong></> : null}
            {meetingDateLabel ? <> on <strong>{meetingDateLabel}</strong></> : null}
            . The meeting itself will not be deleted or canceled. This cannot be undone.
          </>
        }
        confirmLabel={copyConfirmBtn}
        destructive
        onConfirm={() => { setConfirmDelete(false); onDelete(); }}
      />
    </>
  );
};

const MeetingRow: React.FC<any> = ({ meeting, isPrepEnabled, isConnected, isContextLoading, isAssistantMode, isPostMVP, gridClass, onTogglePrep, onEditMeeting, onClientClick, onConnectClick, onScoreViewed }) => {
  const [showReadinessModal, setShowReadinessModal] = useState(false);
  const { meetingGeneratingStates, setMeetingGeneratingState } = useAppStore();

  const isGenerating = meetingGeneratingStates[meeting.id] === 'generating';
  const hasJustGenerated = meetingGeneratingStates[meeting.id] === 'in_progress';

  const handleGenerateNow = () => {
    setMeetingGeneratingState(meeting.id, 'generating');
    setTimeout(() => setMeetingGeneratingState(meeting.id, 'in_progress'), 3000);
  };

  const meetingDate = typeof meeting.date === 'string' ? parseISO(meeting.date) : new Date(meeting.date);
  const isMeetingPast = isPast(meetingDate) && !isToday(meetingDate);
  const hasHousehold = !!meeting.resolvedClient || isConnected;
  const agendaIcon = getAgendaTypeIcon(meeting.type as string | undefined);
  const hasType = agendaIcon.isSet;
  const isDimmed = !hasHousehold || !hasType;

  const handleClientClick = () => {
    onClientClick(meeting.clientName, meeting.resolvedClient?.id || meeting.clientId, meetingDate);
  };

  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  const todayStart = startOfDay(new Date());
  const sevenDaysOut = new Date(todayStart);
  sevenDaysOut.setDate(todayStart.getDate() + 7);
  const withinSevenDays = meetingDate >= todayStart && meetingDate < sevenDaysOut;

  const isParkerForceGenerating = /steven\s*&\s*julia\s*parker/i.test(meeting.clientName || '');
  const isJenniferTaylorStale = /jennifer\s+taylor/i.test(meeting.clientName || '');
  const agendaStatus: AgendaStatusValue =
    isParkerForceGenerating ? 'generating'
    : isJenniferTaylorStale ? 'ready'
    : isGenerating ? 'generating'
    : hasJustGenerated ? 'in_progress'
    : !hasType ? 'not_set'
    : isMeetingPast ? 'completed'
    : meeting.preparationStatus === 'failed' ? 'failed'
    : withinSevenDays ? 'ready'
    : 'in_progress';

  const dimCell = isDimmed ? "opacity-60" : "";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClientClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClientClick(); } }}
      className={cn(gridClass, "py-1.5 px-6 border-b border-border last:border-b-0 group transition-colors cursor-pointer hover:bg-blue-50")}
    >
      <span className={cn("text-xs text-muted-foreground whitespace-nowrap", dimCell)}>
        {formatTimeRange(meeting.time, meeting.duration)}
      </span>

      <div className={cn("truncate text-left min-w-0", dimCell)}>
        <span className="text-xs font-medium text-foreground">
          {generateMessySubject(meeting)}
        </span>
      </div>

      <div className={cn("min-w-0", dimCell)}>
        {hasHousehold ? (() => {
          const attendeeNames = getAttendeeNames(meeting);
          const displayText = attendeeNames.join(', ');
          return attendeeNames.length > 1 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs text-muted-foreground truncate block min-w-0">{displayText}</span>
              </TooltipTrigger>
              <TooltipContent side="top">
                {attendeeNames.map(name => <div key={name}>{name}</div>)}
              </TooltipContent>
            </Tooltip>
          ) : (
            <span className="text-xs text-muted-foreground truncate block min-w-0">{displayText}</span>
          );
        })() : (
          <span className="text-xs text-muted-foreground truncate block min-w-0">{meeting.clientName}</span>
        )}
      </div>

      {isAssistantMode && (
        <span className={cn("text-xs text-muted-foreground truncate", dimCell)}>
          {hasHousehold ? getAdvisorForName(meeting.clientName).name : ''}
        </span>
      )}

      {isPostMVP && (
        <div className={cn("flex items-center justify-start", dimCell)} onPointerDown={stop} onClick={stop}>
          {isContextLoading ? (
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          ) : hasHousehold && meeting.readiness ? (
            <CircularReadinessScore
              contentLayers={meeting.readiness.layers}
              contentPercentage={Math.round(meeting.readiness.layers.reduce((sum, l) => sum + l.percentage, 0) / meeting.readiness.layers.length)}
              onScoreClick={() => { setShowReadinessModal(true); onScoreViewed?.(); }}
              size={28} />
          ) : null}
        </div>
      )}

      <div className="flex items-center justify-start min-w-0 gap-1.5" onPointerDown={stop} onClick={stop}>
        {isPostMVP ? (
          <AgendaStatus
            meetingType={meeting.type as string | undefined}
            status={agendaStatus}
            onSetAgenda={onEditMeeting}
            onViewAgenda={hasHousehold ? handleClientClick : undefined}
            onGenerate={handleGenerateNow}
            disclosureMode="popover"
            tooltip={isGenerating || hasJustGenerated || (hasType && !isMeetingPast && meeting.preparationStatus !== 'ready')
              ? 'This may take up to 20 minutes. You will be notified when ready.'
              : undefined}
          />
        ) : (
          <AgendaCellMVP
            status={agendaStatus}
            meetingType={meeting.type as string | undefined}
            onClick={agendaStatus === 'not_set' ? onEditMeeting : handleClientClick}
          />
        )}
        {isJenniferTaylorStale && (
          <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-100 px-1.5 py-0.5 text-[10px] font-medium text-orange-800 whitespace-nowrap">
            <AlertTriangle className="h-2.5 w-2.5" />
            Stale
          </span>
        )}
      </div>

      {isPostMVP ? (
        <div onPointerDown={stop} onClick={stop}>
          <RowActionsMenu
            agendaStatus={agendaStatus}
            hasHousehold={hasHousehold}
            onEdit={onEditMeeting}
            onDelete={() => {}}
            onViewAgenda={handleClientClick}
            onGenerate={handleGenerateNow}
            onSetType={onEditMeeting}
          />
        </div>
      ) : (
        <span />
      )}

      {meeting.readiness && (
        <ReadinessModal
          isOpen={showReadinessModal}
          onClose={() => setShowReadinessModal(false)}
          layers={meeting.readiness.layers}
          clientName={meeting.clientName} />
      )}
    </div>
  );
};

const ConnectHouseholdModal: React.FC<any> = ({ isOpen, meetingType, onClose, onSave }) => {
  const [selectedMeetingType, setSelectedMeetingType] = useState(meetingType);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHousehold, setSelectedHousehold] = useState<{ id: string; name: string } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedMeetingType(meetingType);
      setSearchTerm('');
      setSelectedHousehold(null);
      setIsDropdownOpen(false);
      setHasInteracted(false);
    }
  }, [isOpen, meetingType]);

  const allClients = useMemo(() => [...mockClients].sort((a, b) => a.name.localeCompare(b.name)), []);
  const filteredClients = useMemo(() => {
    if (!searchTerm) return allClients;
    const needle = searchTerm.toLowerCase();
    return allClients.filter(c => c.name.toLowerCase().includes(needle));
  }, [searchTerm, allClients]);

  const handleSelectHousehold = (client: { id: string; name: string }) => {
    setSelectedHousehold(client);
    setSearchTerm(client.name);
    setIsDropdownOpen(false);
  };

  const handleSave = () => {
    if (selectedHousehold) onSave(selectedHousehold.id, selectedHousehold.name, selectedMeetingType);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Connect a Household</DialogTitle>
          <DialogDescription className="sr-only">Connect a household to this calendar meeting</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div className="bg-white rounded-lg p-4 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Meeting Type</label>
              <Select value={selectedMeetingType} onValueChange={setSelectedMeetingType}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Annual Review">Annual Review</SelectItem>
                  <SelectItem value="Quarterly Review">Quarterly Review</SelectItem>
                  <SelectItem value="Bi-Annual Review">Bi-Annual Review</SelectItem>
                  <SelectItem value="Client Planning">Client Planning</SelectItem>
                  <SelectItem value="Tax Planning">Tax Planning</SelectItem>
                  <SelectItem value="Estate Planning">Estate Planning</SelectItem>
                  <SelectItem value="Retirement Planning">Retirement Planning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Household</label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search households..."
                    value={selectedHousehold ? selectedHousehold.name : searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setSelectedHousehold(null); setIsDropdownOpen(true); }}
                    onFocus={() => { setHasInteracted(true); if (!selectedHousehold) setIsDropdownOpen(true); }}
                    onClick={() => { setHasInteracted(true); if (!selectedHousehold) setIsDropdownOpen(true); }}
                    className={cn("pl-9 border-input-border", selectedHousehold && "pr-8")}
                    readOnly={!!selectedHousehold}
                  />
                  {selectedHousehold && (
                    <button
                      type="button"
                      onClick={() => { setSelectedHousehold(null); setSearchTerm(''); setHasInteracted(true); setIsDropdownOpen(true); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {hasInteracted && isDropdownOpen && !selectedHousehold && (
                  <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md max-h-[200px] overflow-y-auto">
                    {filteredClients.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground">No households found</div>
                    ) : (
                      filteredClients.map(client => (
                        <button
                          key={client.id}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-primary hover:text-primary-foreground cursor-pointer"
                          onClick={() => handleSelectHousehold(client)}
                        >
                          {client.name}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!selectedHousehold}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DaySection: React.FC<any> = ({ group, meetingPrepStates, connectedMeetings, contextLoadingMeetings, isAssistantMode, isPostMVP, onTogglePrep, onEditMeeting, onClientClick, onConnectClick, onScoreViewed }) => {
  const gridClass = isPostMVP
    ? (isAssistantMode ? CALENDAR_GRID_ASSISTANT : CALENDAR_GRID)
    : (isAssistantMode ? CALENDAR_GRID_MVP_ASSISTANT : CALENDAR_GRID_MVP);
  return (
    <div className="mb-6 overflow-x-auto">
      <div className={`${gridClass} py-2 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider`}>
        <span className="whitespace-nowrap">{group.dateLabel}</span>
        <span>Subject</span>
        <span>Attendees</span>
        {isAssistantMode && <span>Advisor</span>}
        {isPostMVP && <span className="whitespace-nowrap">Context</span>}
        <span className="flex items-center justify-start gap-1">Agenda Status<Tooltip><TooltipTrigger asChild><Info className="h-3 w-3 text-muted-foreground cursor-help" /></TooltipTrigger><TooltipContent side="top" className="text-xs max-w-[260px] normal-case tracking-normal font-normal">Agenda is automatically scheduled for meetings identified as a client annual review. Otherwise click Set Meeting Type to mark it as such in CRM and schedule the agenda.</TooltipContent></Tooltip></span>
        <span />
      </div>
      <div className="border border-border rounded-lg bg-white overflow-hidden">
        {group.meetings.length > 0 ?
          group.meetings.map((meeting: any) =>
            <MeetingRow
              key={meeting.id}
              meeting={meeting}
              isPrepEnabled={meetingPrepStates[meeting.id] ?? false}
              isConnected={connectedMeetings[meeting.id] ?? false}
              isContextLoading={contextLoadingMeetings[meeting.id] ?? false}
              isAssistantMode={isAssistantMode}
              isPostMVP={isPostMVP}
              gridClass={gridClass}
              onTogglePrep={(checked: boolean) => onTogglePrep(meeting.id, checked)}
              onEditMeeting={() => onEditMeeting(meeting)}
              onClientClick={onClientClick}
              onConnectClick={() => onConnectClick(meeting)}
              onScoreViewed={onScoreViewed} />
          ) :
          <div className="py-4 px-4 text-sm text-muted-foreground text-center">No meetings scheduled</div>
        }
      </div>
    </div>
  );
};

const AltMeetingRow: React.FC<any> = ({ meeting, dateLabel, isPrepEnabled, isConnected, isContextLoading, isAssistantMode, isPostMVP, gridClass, showDate, onTogglePrep, onEditMeeting, onClientClick, onConnectClick, onScoreViewed }) => {
  const [showReadinessModal, setShowReadinessModal] = useState(false);
  const { meetingGeneratingStates, setMeetingGeneratingState } = useAppStore();

  const isGenerating = meetingGeneratingStates[meeting.id] === 'generating';
  const hasJustGenerated = meetingGeneratingStates[meeting.id] === 'in_progress';

  const handleGenerateNow = () => {
    setMeetingGeneratingState(meeting.id, 'generating');
    setTimeout(() => setMeetingGeneratingState(meeting.id, 'in_progress'), 3000);
  };

  const meetingDate = typeof meeting.date === 'string' ? parseISO(meeting.date) : new Date(meeting.date);
  const isMeetingPast = isPast(meetingDate) && !isToday(meetingDate);
  const hasHousehold = !!meeting.resolvedClient || isConnected;
  const agendaIcon = getAgendaTypeIcon(meeting.type as string | undefined);
  const hasType = agendaIcon.isSet;
  const isDimmed = !hasHousehold || !hasType;

  const handleClientClick = () => {
    onClientClick(meeting.clientName, meeting.resolvedClient?.id || meeting.clientId, meetingDate);
  };

  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  const todayStart = startOfDay(new Date());
  const sevenDaysOut = new Date(todayStart);
  sevenDaysOut.setDate(todayStart.getDate() + 7);
  const withinSevenDays = meetingDate >= todayStart && meetingDate < sevenDaysOut;

  const isParkerForceGenerating = /steven\s*&\s*julia\s*parker/i.test(meeting.clientName || '');
  const isJenniferTaylorStale = /jennifer\s+taylor/i.test(meeting.clientName || '');
  const agendaStatus: AgendaStatusValue =
    isParkerForceGenerating ? 'generating'
    : isJenniferTaylorStale ? 'ready'
    : isGenerating ? 'generating'
    : hasJustGenerated ? 'in_progress'
    : !hasType ? 'not_set'
    : isMeetingPast ? 'completed'
    : meeting.preparationStatus === 'failed' ? 'failed'
    : withinSevenDays ? 'ready'
    : 'in_progress';

  const dimCell = isDimmed ? "opacity-60" : "";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClientClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClientClick(); } }}
      className={cn(gridClass, "py-1.5 px-6 border-b border-border last:border-b-0 group transition-colors cursor-pointer hover:bg-blue-50")}
    >
      <span className={cn("text-xs text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis", dimCell)}>
        {showDate && <span className="font-medium text-foreground">{format(typeof meeting.date === 'string' ? parseISO(meeting.date) : new Date(meeting.date), 'M/d')}{' '}</span>}
        {formatTimeRange(meeting.time, meeting.duration)}
      </span>

      <div className={cn("truncate text-left min-w-0", dimCell)}>
        <span className="text-xs font-medium text-foreground">{generateMessySubject(meeting)}</span>
      </div>

      <div className={cn("min-w-0", dimCell)}>
        {hasHousehold ? (() => {
          const attendeeNames = getAttendeeNames(meeting);
          const displayText = attendeeNames.join(', ');
          return attendeeNames.length > 1 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs text-muted-foreground truncate block min-w-0">{displayText}</span>
              </TooltipTrigger>
              <TooltipContent side="top">
                {attendeeNames.map((name: string) => <div key={name}>{name}</div>)}
              </TooltipContent>
            </Tooltip>
          ) : (
            <span className="text-xs text-muted-foreground truncate block min-w-0">{displayText}</span>
          );
        })() : (
          <span className="text-xs text-muted-foreground truncate block min-w-0">{meeting.clientName}</span>
        )}
      </div>

      {isAssistantMode && (
        <span className={cn("text-xs text-muted-foreground truncate", dimCell)}>
          {hasHousehold ? getAdvisorForName(meeting.clientName).name : ''}
        </span>
      )}

      {isPostMVP && (
        <div className={cn("flex items-center justify-start", dimCell)} onPointerDown={stop} onClick={stop}>
          {!hasHousehold ? null : isContextLoading ? (
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          ) : meeting.readiness ? (
            <CircularReadinessScore
              contentLayers={meeting.readiness.layers}
              contentPercentage={Math.round(meeting.readiness.layers.reduce((sum: number, l: any) => sum + l.percentage, 0) / meeting.readiness.layers.length)}
              onScoreClick={() => { setShowReadinessModal(true); onScoreViewed?.(); }}
              size={28} />
          ) : null}
        </div>
      )}

      <div className="flex items-center justify-start min-w-0 gap-1.5" onPointerDown={stop} onClick={stop}>
        {isPostMVP ? (
          <AgendaStatus
            meetingType={meeting.type as string | undefined}
            status={agendaStatus}
            onSetAgenda={onEditMeeting}
            onViewAgenda={hasHousehold ? handleClientClick : undefined}
            onGenerate={handleGenerateNow}
            disclosureMode="popover"
            tooltip={isGenerating || hasJustGenerated || (hasType && !isMeetingPast && meeting.preparationStatus !== 'ready')
              ? 'This may take up to 20 minutes. You will be notified when ready.'
              : undefined}
          />
        ) : (
          <AgendaCellMVP
            status={agendaStatus}
            meetingType={meeting.type as string | undefined}
            onClick={agendaStatus === 'not_set' ? onEditMeeting : handleClientClick}
          />
        )}
        {isJenniferTaylorStale && (
          <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-100 px-1.5 py-0.5 text-[10px] font-medium text-orange-800 whitespace-nowrap">
            <AlertTriangle className="h-2.5 w-2.5" />
            Stale
          </span>
        )}
      </div>

      {isPostMVP ? (
        <div onPointerDown={stop} onClick={stop}>
          <RowActionsMenu
            agendaStatus={agendaStatus}
            hasHousehold={hasHousehold}
            onEdit={onEditMeeting}
            onDelete={() => {}}
            onViewAgenda={handleClientClick}
            onGenerate={handleGenerateNow}
            onSetType={onEditMeeting}
          />
        </div>
      ) : (
        <span />
      )}

      {meeting.readiness && (
        <ReadinessModal
          isOpen={showReadinessModal}
          onClose={() => setShowReadinessModal(false)}
          layers={meeting.readiness.layers}
          clientName={meeting.clientName} />
      )}
    </div>
  );
};

const OnboardingInfoCard: React.FC<{ onDismiss: () => void; completedSteps: Set<number> }> = ({ onDismiss, completedSteps }) => {
  const badge = useCopy('onb.badge', 'Getting Started');
  const intro = useCopy('onb.intro', "Your calendar is synced. Here's how Meeting Prep prepares your Client Annual Reviews.");
  const step1Title = useCopy('onb.step1.title', 'Meetings Synced & Scheduled');
  const step1Body = useCopy('onb.step1.body', 'Your calendar meetings have been synced. Any meeting identified as a Client Annual Review is automatically scheduled to have an agenda generated.');
  const step2Title = useCopy('onb.step2.title', 'Add an Agenda');
  const step2Body = useCopy('onb.step2.body', 'If a meeting shows a "Set Meeting Type" button, it wasn\'t auto-identified as a review. Click it to mark the meeting as a Client Annual Review and queue agenda generation.');
  const step3Title = useCopy('onb.step3.title', 'More Agenda types coming soon');
  const step3Body = useCopy('onb.step3.body', 'Meeting Prep currently only prepares agendas for Client Annual Review meetings. Other meeting types appear in your calendar for visibility, but no agenda will be generated.');

  const steps = [
    { icon: <RefreshCw className="h-5 w-5 text-primary" />, title: step1Title, description: step1Body },
    { icon: <PlusCircle className="h-5 w-5 text-primary" />, title: step2Title, description: step2Body },
    { icon: <CalendarCheck className="h-5 w-5 text-primary" />, title: step3Title, description: step3Body },
  ];

  return (
    <div className="relative rounded-xl border border-border bg-white shadow-lg overflow-hidden mb-6">
      <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/60 to-accent" />
      <div className="p-6 py-[15px]">
        <button onClick={onDismiss} className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary">{badge}</span>
        </div>
        <p className="text-sm mb-6 mt-[15px] text-secondary-foreground">{intro}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="relative flex gap-3 p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full text-sm font-bold shadow-sm bg-primary text-primary-foreground">
                {i + 1}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-1.5">
                  {step.icon}
                  <span className="text-sm font-semibold text-foreground">{step.title}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const NoSyncContent: React.FC = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  return (
    <>
      <div className="flex items-center justify-center py-20">
        <div className="border border-border rounded-xl bg-white w-full max-w-xl">
          <div className="p-0 flex flex-col items-center justify-center py-16 text-center">
            <RefreshCw className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-foreground/70 text-base mb-6">Enable Outlook Sync to start prepping for client meetings.</p>
            <Button onClick={() => setIsVideoOpen(true)} className="px-8 bg-primary text-primary-foreground hover:bg-primary/80">
              Get Started
            </Button>
          </div>
        </div>
      </div>
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>How to Connect Outlook Sync</DialogTitle>
            <DialogDescription className="sr-only">Instructions for connecting Outlook calendar sync</DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-6">
            <AspectRatio ratio={16 / 9}>
              <div className="w-full h-full rounded-lg bg-muted flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Play className="h-8 w-8 text-primary ml-1" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">Instructional video coming soon</p>
                <p className="text-xs text-muted-foreground/60">Learn how to connect your Outlook calendar to enable meeting sync</p>
              </div>
            </AspectRatio>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const CalendarCanvas: React.FC<CalendarCanvasProps & { demoMode?: boolean; onboardingMode?: boolean; noSyncMode?: boolean }> = ({ data, demoMode = false, onboardingMode = false, noSyncMode = false }) => {
  const navigate = useNavigate();
  const { isAssistantMode, selectedAdvisors } = useAssistantMode();
  const { isPostMVP } = useFeatureMode();

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (data?.initialWeekStart) return parseISO(data.initialWeekStart);
    return startOfWeek(new Date(), { weekStartsOn: 1 });
  });

  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>(data?.viewMode || 'week');
  const [altLayout, setAltLayout] = useState(true);

  type SortColumn = 'date' | 'subject' | 'household' | 'context' | 'clientReview';
  const [sortColumn, setSortColumn] = useState<SortColumn>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSortClick = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const [editingMeeting, setEditingMeeting] = useState<MeetingWithReadiness | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [a360Client, setA360Client] = useState<{ name: string; id?: string } | null>(null);
  const [isA360ModalOpen, setIsA360ModalOpen] = useState(false);

  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [connectingMeeting, setConnectingMeeting] = useState<MeetingWithReadiness | null>(null);
  const [connectedMeetings, setConnectedMeetings] = useState<Record<string, boolean>>({});
  const [contextLoadingMeetings, setContextLoadingMeetings] = useState<Record<string, boolean>>({});

  const allMeetingsWithReadiness = useMemo((): MeetingWithReadiness[] => {
    const meetings = getEnhancedMeetingsList(undefined, true);
    const clientCache = new Map<string, ReturnType<typeof getClientByName>>();
    const readinessCache = new Map<string, HouseholdReadiness>();
    const today = startOfDay(new Date());
    return meetings.map((meeting) => {
      const key = meeting.clientName;
      if (!clientCache.has(key)) clientCache.set(key, getClientByName(key));
      const client = clientCache.get(key);
      if (!readinessCache.has(key)) {
        readinessCache.set(key, client
          ? evaluateHouseholdReadiness(client)
          : createUnmatchedClientReadiness(meeting.id, key));
      }
      const meetingDate = typeof meeting.date === 'string' ? parseISO(meeting.date) : new Date(meeting.date);
      const daysDiff = differenceInDays(startOfDay(meetingDate), today);
      let preparationStatus: MeetingWithReadiness['preparationStatus'] = meeting.preparationStatus === 'failed'
        ? 'failed'
        : daysDiff < 0 ? 'ready' : daysDiff <= 2 ? 'ready' : daysDiff >= 6 ? 'queued' : 'in_progress';
      if (meeting.id === 'meeting-margaret-thompson') preparationStatus = 'in_progress';
      return { ...meeting, preparationStatus, readiness: readinessCache.get(key)!, resolvedClient: client || undefined };
    });
  }, []);

  const initialPrepStates = useMemo(() => {
    if (demoMode || onboardingMode) return {};
    const initialStates: Record<string, boolean> = {};
    allMeetingsWithReadiness.forEach((meeting, index) => {
      const meetingDate = typeof meeting.date === 'string' ? parseISO(meeting.date) : new Date(meeting.date);
      if (!isPast(meetingDate) || isToday(meetingDate)) {
        initialStates[meeting.id] = index % 5 !== 2;
      }
    });
    return initialStates;
  }, [allMeetingsWithReadiness, demoMode, onboardingMode]);

  const { meetingPrepStates, setMeetingPrepState, initMeetingPrepStates, setMeetingGeneratingState } = useAppStore();

  useEffect(() => {
    if (!demoMode && !onboardingMode) initMeetingPrepStates(initialPrepStates);
  }, [initialPrepStates, demoMode, onboardingMode, initMeetingPrepStates]);

  const [onboardingDismissed, setOnboardingDismissed] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const markStepComplete = (stepIndex: number) => {
    if (!onboardingMode || completedSteps.has(stepIndex)) return;
    setCompletedSteps(prev => new Set([...prev, stepIndex]));
  };

  const [meetingUpdates, setMeetingUpdates] = useState<Record<string, Partial<MeetingWithReadiness>>>({});

  const toggleMeetingPrep = (meetingId: string, checked: boolean) => {
    setMeetingPrepState(meetingId, checked);
    if (checked) markStepComplete(0);
  };

  const handleEditMeeting = (meeting: MeetingWithReadiness) => {
    setEditingMeeting(meeting);
    setIsModalOpen(true);
  };

  const handleSaveMeeting = (updatedMeeting: MeetingWithReadiness) => {
    setMeetingUpdates((prev) => ({ ...prev, [updatedMeeting.id]: updatedMeeting }));
    setIsModalOpen(false);
    setEditingMeeting(null);
    setMeetingGeneratingState(updatedMeeting.id, 'generating');
    setTimeout(() => setMeetingGeneratingState(updatedMeeting.id, 'in_progress'), 3000);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMeeting(null);
  };

  const handleClientClick = (clientName: string, clientId?: string, meetingDate?: Date, meeting?: any) => {
    const client = getClientByName(clientName);
    const resolvedClientId = client?.id || clientId || clientName.toLowerCase().replace(/[&]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
    const formattedDate = format(meetingDate || new Date(), 'yyyy-MM-dd');
    navigate(`/meeting-prep/${resolvedClientId}/${formattedDate}`, {
      state: meeting ? {
        meetingId: meeting.id,
        meetingType: meeting.type,
        meetingTime: meeting.time,
        meetingTitle: meeting.title,
        meetingLocation: meeting.location,
      } : undefined,
    });
  };

  const handleCloseA360Modal = () => {
    setIsA360ModalOpen(false);
    setA360Client(null);
  };

  const handleOpenConnect = (meeting: MeetingWithReadiness) => {
    setConnectingMeeting(meeting);
    setConnectModalOpen(true);
  };

  const handleConnectSave = (householdId: string, householdName: string, meetingType: string) => {
    if (!connectingMeeting) return;
    const meetingId = connectingMeeting.id;
    setConnectModalOpen(false);
    setConnectingMeeting(null);
    setContextLoadingMeetings(prev => ({ ...prev, [meetingId]: true }));
    setTimeout(() => {
      setContextLoadingMeetings(prev => ({ ...prev, [meetingId]: false }));
      setConnectedMeetings(prev => ({ ...prev, [meetingId]: true }));
    }, 2500);
  };

  const { rangeStart, rangeEnd, dateRangeLabel } = useMemo(() => {
    switch (viewMode) {
      case 'day':
        return {
          rangeStart: startOfDay(selectedDate),
          rangeEnd: endOfDay(selectedDate),
          dateRangeLabel: format(selectedDate, 'EEEE, MMMM d')
        };
      case 'month': {
        const monthStart = startOfMonth(selectedDate);
        const monthEnd = endOfMonth(selectedDate);
        return { rangeStart: monthStart, rangeEnd: monthEnd, dateRangeLabel: format(selectedDate, 'MMMM yyyy') };
      }
      case 'week':
      default: {
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
        return {
          rangeStart: weekStart,
          rangeEnd: weekEnd,
          dateRangeLabel: `${format(weekStart, 'MMM dd, yyyy')} - ${format(weekEnd, 'MMM dd, yyyy')}`
        };
      }
    }
  }, [selectedDate, viewMode]);

  const meetingsWithReadiness = useMemo((): MeetingWithReadiness[] => {
    if (!Object.keys(meetingUpdates).length) return allMeetingsWithReadiness;
    const today = startOfDay(new Date());
    return allMeetingsWithReadiness.map((m) => {
      const update = meetingUpdates[m.id];
      if (!update) return m;
      const merged = { ...m, ...update } as MeetingWithReadiness;
      const meetingDate = typeof merged.date === 'string' ? parseISO(merged.date) : new Date(merged.date);
      const daysDiff = differenceInDays(startOfDay(meetingDate), today);
      merged.preparationStatus = daysDiff < 0 ? 'ready' : daysDiff <= 2 ? 'ready' : daysDiff >= 6 ? 'queued' : 'in_progress';
      return merged;
    });
  }, [allMeetingsWithReadiness, meetingUpdates]);

  const groupedMeetings = useMemo((): DayGroup[] => {
    const today = startOfDay(new Date());
    const filtered = meetingsWithReadiness.filter((m) => {
      const meetingDate = typeof m.date === 'string' ? parseISO(m.date) : new Date(m.date);
      const inRange = meetingDate >= rangeStart && meetingDate <= rangeEnd;
      if (onboardingMode && meetingDate < today) return false;
      if (!inRange) return false;
      if (isAssistantMode) {
        const advisor = getAdvisorForName(m.clientName);
        if (!selectedAdvisors.includes(advisor.id)) return false;
      }
      return true;
    });

    if (viewMode === 'day') {
      const dayMeetings = [...filtered].sort((a, b) => a.time.localeCompare(b.time));
      return dayMeetings.length > 0 ? [{
        date: selectedDate,
        dateLabel: format(selectedDate, 'EEEE, MMMM d'),
        meetings: dayMeetings
      }] : [];
    }

    const daysCount = differenceInDays(rangeEnd, rangeStart) + 1;
    const daysInRange: DayGroup[] = [];
    for (let i = 0; i < daysCount; i++) {
      const dayDate = addDays(rangeStart, i);
      const dayMeetings = filtered.filter((m) => {
        const meetingDate = typeof m.date === 'string' ? parseISO(m.date) : new Date(m.date);
        return isSameDay(meetingDate, dayDate);
      });
      dayMeetings.sort((a, b) => a.time.localeCompare(b.time));
      daysInRange.push({ date: dayDate, dateLabel: format(dayDate, 'EEEE, MMMM d'), meetings: dayMeetings });
    }
    return daysInRange.filter((day) => day.meetings.length > 0);
  }, [meetingsWithReadiness, rangeStart, rangeEnd, viewMode, selectedDate, isAssistantMode, selectedAdvisors, onboardingMode]);

  const sortedFlatMeetings = useMemo(() => {
    const flat = groupedMeetings.flatMap(g => g.meetings.map(m => ({ ...m, _dateLabel: g.dateLabel })));
    const dir = sortDirection === 'asc' ? 1 : -1;
    return flat.sort((a, b) => {
      switch (sortColumn) {
        case 'date': {
          const da = typeof a.date === 'string' ? a.date : new Date(a.date).toISOString();
          const db = typeof b.date === 'string' ? b.date : new Date(b.date).toISOString();
          const cmp = da.localeCompare(db) || a.time.localeCompare(b.time);
          return cmp * dir;
        }
        case 'subject':
          return (a.type || '').localeCompare(b.type || '') * dir;
        case 'household': {
          const aLinked = !!a.resolvedClient;
          const bLinked = !!b.resolvedClient;
          if (aLinked !== bLinked) return aLinked ? -1 * dir : 1 * dir;
          const ha = a.resolvedClient?.name || a.clientName || '';
          const hb = b.resolvedClient?.name || b.clientName || '';
          return ha.localeCompare(hb) * dir;
        }
        case 'context': {
          const ca = a.readiness ? a.readiness.layers.reduce((s, l) => s + l.percentage, 0) / a.readiness.layers.length : 0;
          const cb = b.readiness ? b.readiness.layers.reduce((s, l) => s + l.percentage, 0) / b.readiness.layers.length : 0;
          return (ca - cb) * dir;
        }
        case 'clientReview':
          return ((a.preparationStatus || '').localeCompare(b.preparationStatus || '')) * dir;
        default:
          return 0;
      }
    });
  }, [groupedMeetings, sortColumn, sortDirection]);

  const goToPrev = () => {
    switch (viewMode) {
      case 'day': setSelectedDate((prev) => addDays(prev, -1)); break;
      case 'month': setSelectedDate((prev) => addMonths(prev, -1)); break;
      case 'week':
      default: setSelectedDate((prev) => addWeeks(prev, -1));
    }
  };

  const goToNext = () => {
    switch (viewMode) {
      case 'day': setSelectedDate((prev) => addDays(prev, 1)); break;
      case 'month': setSelectedDate((prev) => addMonths(prev, 1)); break;
      case 'week':
      default: setSelectedDate((prev) => addWeeks(prev, 1));
    }
  };

  const goToToday = () => {
    const now = new Date();
    switch (viewMode) {
      case 'day': setSelectedDate(startOfDay(now)); break;
      case 'month': setSelectedDate(startOfMonth(now)); break;
      case 'week':
      default: setSelectedDate(startOfWeek(now, { weekStartsOn: 1 }));
    }
  };

  return (
    <TooltipProvider>
      <div className="h-full overflow-auto bg-background">
        <div className="sticky top-0 z-10 bg-header text-white px-4 h-11 flex items-center">
          <div className="flex items-center justify-between w-full relative">
            <div className="flex items-center gap-3 flex-shrink-0">
              <button onClick={() => setAltLayout(prev => !prev)} className="cursor-default bg-transparent border-none p-0 m-0 outline-none">
                <h1 className="text-[15px] font-medium pl-2 text-white/90">Calendar of Meetings</h1>
              </button>
            </div>

            {!noSyncMode && (
              <div className="flex items-center gap-2 sm:gap-4 absolute left-1/2 -translate-x-1/2">
                <button onClick={goToToday} className="text-sm text-white/80 hover:text-white transition-colors">
                  Go to today
                </button>
                <span className="text-white/30">|</span>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-white/70 hidden sm:block" />
                  <span className="text-sm text-white">{dateRangeLabel}</span>
                </div>
                <div className="w-4" />
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 border border-white/30 text-white hover:bg-white/10 hover:text-white" onClick={goToPrev}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 border border-white/30 text-white hover:bg-white/10 hover:text-white" onClick={goToNext}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Select value={viewMode} onValueChange={(v) => setViewMode(v as 'day' | 'week' | 'month')}>
                  <SelectTrigger className="w-[90px] h-8 bg-white/10 border-white/30 text-white [&>svg]:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex-shrink-0">
              <AdvisorFilterAvatars />
            </div>
          </div>
        </div>

        <div className="p-4">
          {noSyncMode ? (
            <NoSyncContent />
          ) : (
            <>
              {onboardingMode && !onboardingDismissed &&
                <OnboardingInfoCard onDismiss={() => setOnboardingDismissed(true)} completedSteps={completedSteps} />
              }
              {groupedMeetings.length > 0 ? (
                altLayout ? (
                  <div>
                    <div className={`${
                      isPostMVP
                        ? (isAssistantMode ? ALT_CALENDAR_GRID_ASSISTANT : ALT_CALENDAR_GRID)
                        : (isAssistantMode ? ALT_CALENDAR_GRID_MVP_ASSISTANT : ALT_CALENDAR_GRID_MVP)
                    } py-2 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider sticky top-14 bg-background z-10 border-b border-border`}>
                      <button onClick={() => handleSortClick('date')} className="flex items-center gap-1 uppercase whitespace-nowrap hover:text-foreground transition-colors cursor-pointer">
                        Date/Time
                        {sortColumn === 'date' && (sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                      </button>
                      <button onClick={() => handleSortClick('subject')} className="flex items-center gap-1 uppercase hover:text-foreground transition-colors cursor-pointer">
                        Subject
                        {sortColumn === 'subject' && (sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                      </button>
                      <span>Attendees</span>
                      {isAssistantMode && <span>Advisor</span>}
                      {isPostMVP && (
                        <button onClick={() => handleSortClick('context')} className="flex items-center gap-1 uppercase whitespace-nowrap hover:text-foreground transition-colors cursor-pointer">
                          Context
                          {sortColumn === 'context' && (sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                        </button>
                      )}
                      <span className="flex items-center justify-start gap-1">Agenda Status<Tooltip><TooltipTrigger asChild><Info className="h-3 w-3 text-muted-foreground cursor-help" /></TooltipTrigger><TooltipContent side="top" className="text-xs max-w-[260px] normal-case tracking-normal font-normal">Agenda is automatically scheduled for meetings identified as a client annual review. Otherwise click Set Meeting Type to mark it as such in CRM and schedule the agenda.</TooltipContent></Tooltip></span>
                      <span />
                    </div>
                    <div className="border border-border rounded-lg bg-white overflow-hidden">
                      {sortColumn === 'date' ? (
                        (sortDirection === 'desc' ? [...groupedMeetings].reverse() : groupedMeetings).map((group) => (
                          <React.Fragment key={`alt-${group.dateLabel}`}>
                            <div className="px-6 py-1.5 text-xs font-semibold text-muted-foreground bg-primary/10 border-b border-border" style={{ gridColumn: '1 / -1' }}>
                              {group.dateLabel}
                            </div>
                            {group.meetings.map((meeting) => (
                              <AltMeetingRow
                                key={meeting.id}
                                meeting={meeting}
                                dateLabel={group.dateLabel}
                                isPrepEnabled={meetingPrepStates[meeting.id] ?? false}
                                isConnected={connectedMeetings[meeting.id] ?? false}
                                isContextLoading={contextLoadingMeetings[meeting.id] ?? false}
                                isAssistantMode={isAssistantMode}
                                isPostMVP={isPostMVP}
                                gridClass={
                                  isPostMVP
                                    ? (isAssistantMode ? ALT_CALENDAR_GRID_ASSISTANT : ALT_CALENDAR_GRID)
                                    : (isAssistantMode ? ALT_CALENDAR_GRID_MVP_ASSISTANT : ALT_CALENDAR_GRID_MVP)
                                }
                                onTogglePrep={(checked: boolean) => toggleMeetingPrep(meeting.id, checked)}
                                onEditMeeting={() => handleEditMeeting(meeting)}
                                onClientClick={handleClientClick}
                                onConnectClick={() => handleOpenConnect(meeting)}
                                onScoreViewed={() => markStepComplete(2)}
                              />
                            ))}
                          </React.Fragment>
                        ))
                      ) : (
                        sortedFlatMeetings.map((meeting) => (
                          <AltMeetingRow
                            key={meeting.id}
                            showDate
                            meeting={meeting}
                            dateLabel={(meeting as any)._dateLabel}
                            isPrepEnabled={meetingPrepStates[meeting.id] ?? false}
                            isConnected={connectedMeetings[meeting.id] ?? false}
                            isContextLoading={contextLoadingMeetings[meeting.id] ?? false}
                            isAssistantMode={isAssistantMode}
                            isPostMVP={isPostMVP}
                            gridClass={
                              isPostMVP
                                ? (isAssistantMode ? ALT_CALENDAR_GRID_ASSISTANT : ALT_CALENDAR_GRID)
                                : (isAssistantMode ? ALT_CALENDAR_GRID_MVP_ASSISTANT : ALT_CALENDAR_GRID_MVP)
                            }
                            onTogglePrep={(checked: boolean) => toggleMeetingPrep(meeting.id, checked)}
                            onEditMeeting={() => handleEditMeeting(meeting)}
                            onClientClick={handleClientClick}
                            onConnectClick={() => handleOpenConnect(meeting)}
                            onScoreViewed={() => markStepComplete(2)}
                          />
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  groupedMeetings.map((group) => (
                    <DaySection
                      key={group.dateLabel}
                      group={group}
                      meetingPrepStates={meetingPrepStates}
                      connectedMeetings={connectedMeetings}
                      contextLoadingMeetings={contextLoadingMeetings}
                      onTogglePrep={toggleMeetingPrep}
                      onEditMeeting={handleEditMeeting}
                      onClientClick={handleClientClick}
                      onConnectClick={handleOpenConnect}
                      onScoreViewed={() => markStepComplete(2)}
                      isAssistantMode={isAssistantMode}
                      isPostMVP={isPostMVP}
                    />
                  ))
                )
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No meetings scheduled for this {viewMode}.</p>
                  <button onClick={goToToday} className="mt-2 text-sm text-primary hover:underline">
                    Go to current {viewMode}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <MeetingDetailsModal
          mode="edit"
          variant="setup"
          meeting={editingMeeting as any}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveMeeting as any}
        />

        <Dialog open={isA360ModalOpen} onOpenChange={(open) => !open && handleCloseA360Modal()}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Schwab Advisor Center Household</DialogTitle>
              <DialogDescription>View the complete household profile for {a360Client?.name}.</DialogDescription>
            </DialogHeader>
            <DialogBody>
              <div className="text-center text-muted-foreground">This will open in a new tab.</div>
            </DialogBody>
            <DialogFooter>
              <Button onClick={handleCloseA360Modal}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ConnectHouseholdModal
          isOpen={connectModalOpen}
          meetingType={connectingMeeting?.type || 'Annual Review'}
          onClose={() => { setConnectModalOpen(false); setConnectingMeeting(null); }}
          onSave={handleConnectSave}
        />
      </div>
    </TooltipProvider>
  );
};

export default CalendarCanvas;
