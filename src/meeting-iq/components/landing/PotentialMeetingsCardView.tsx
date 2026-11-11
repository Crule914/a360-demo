// @ts-nocheck
import React, { useState } from 'react';
import { CalendarPlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ReadinessModal } from '@miq/components/canvas/readiness/ReadinessModal';
import { CircularReadinessScore } from '@miq/components/canvas/readiness/CircularReadinessScore';
import { MeetingDetailsModal, NewMeetingData } from '@miq/components/canvas/MeetingDetailsModal';
import { ContentReadiness } from '@miq/services/HouseholdAgendaReadinessService';
import { useFeatureMode } from '@miq/hooks/useFeatureMode';
import { toast } from '@miq/hooks/use-toast';
import { format, parseISO, differenceInDays } from 'date-fns';

const formatLastMeeting = (dateStr?: string): string => {
  if (!dateStr) return '—';
  try {
    const date = parseISO(dateStr);
    const daysAgo = differenceInDays(new Date(), date);
    return `${format(date, 'MMM d')} (${daysAgo}d ago)`;
  } catch {
    return '—';
  }
};

interface PotentialMeetingsCardViewProps {
  clients: ContentReadiness[];
  onClientClick?: (clientId: string, clientName: string) => void;
}

export const PotentialMeetingsCardView: React.FC<PotentialMeetingsCardViewProps> = ({
  clients,
  onClientClick
}) => {
  const { isPostMVP } = useFeatureMode();
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedClientName, setSelectedClientName] = useState('');
  const [selectedClientReadiness, setSelectedClientReadiness] = useState<ContentReadiness | null>(null);
  const [readinessModalClient, setReadinessModalClient] = useState<ContentReadiness | null>(null);
  const [isReadinessModalOpen, setIsReadinessModalOpen] = useState(false);

  const displayedClients = clients.slice(0, 5);

  const handleScheduleClick = (e: React.MouseEvent, clientName: string) => {
    e.stopPropagation();
    const clientReadiness = clients.find(c => c.clientName === clientName) || null;
    setSelectedClientName(clientName);
    setSelectedClientReadiness(clientReadiness);
    setIsScheduleModalOpen(true);
  };

  const handleCreateMeeting = (meetingData: NewMeetingData) => {
    toast({
      title: 'Meeting Scheduled',
      description: `Meeting scheduled for ${meetingData.clientName || selectedClientName}`
    });
    setIsScheduleModalOpen(false);
  };

  const handleReadinessClick = (e: React.MouseEvent, client: ContentReadiness) => {
    e.stopPropagation();
    setReadinessModalClient(client);
    setIsReadinessModalOpen(true);
  };

  if (clients.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        <p className="text-sm">All clients have scheduled meetings.</p>
      </div>);

  }

  return (
    <>
      <div className="grid grid-cols-5 gap-4">
        {displayedClients.map((client) =>
        <Card
          key={client.clientId}
          className="transition-all duration-200 bg-white overflow-hidden border border-gray-200 rounded-xl">
          
            <CardContent className="p-0 h-full flex flex-col">
              {/* Header */}
              <div
              className="px-4 py-3 bg-slate-50 border-b border-border rounded-t-xl">
              
                <h3 className="font-semibold text-sm truncate text-primary">{client.clientName}</h3>
              </div>

              {/* Body */}
              <div className="px-4 pt-3 pb-4 flex-1 flex flex-col gap-3">
                {/* Last review */}
                <div className="text-xs text-muted-foreground">
                  <span className="block text-[11px] uppercase tracking-wide text-muted-foreground/70 mb-0.5">Last Review</span>
                  {formatLastMeeting(client.lastMeetingDate)}
                </div>

                {/* Agenda Readiness heading + score + layer icons */}
                {isPostMVP && (
                  <div>
                    <span className="block text-[11px] uppercase tracking-wide text-muted-foreground/70 mb-1">Context Quality</span>
                    <div className="flex items-center gap-2">
                      <CircularReadinessScore
                        contentLayers={client.contentLayers}
                        contentPercentage={client.contentPercentage}
                        onScoreClick={() => {
                          setReadinessModalClient(client);
                          setIsReadinessModalOpen(true);
                        }}
                        size={32}
                      />
                    </div>
                  </div>
                )}

                {/* Schedule action */}
                <div className="mt-auto pt-1">
                  <Button
                  variant="ghost"
                  size="sm"
                    className="w-full h-7 text-xs gap-1.5"
                    onClick={(e) => handleScheduleClick(e, client.clientName)}
                     title="+ Schedule Meeting">
                    
                      <CalendarPlus className="h-3.5 w-3.5" />
                      + Schedule Meeting
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <MeetingDetailsModal
        mode="schedule"
        clientName={selectedClientName}
        
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onCreate={handleCreateMeeting} />
      

      {readinessModalClient &&
      <ReadinessModal
        isOpen={isReadinessModalOpen}
        onClose={() => setIsReadinessModalOpen(false)}
        layers={readinessModalClient.contentLayers}
        clientName={readinessModalClient.clientName}
        hideL1L2 />

      }
    </>);

};