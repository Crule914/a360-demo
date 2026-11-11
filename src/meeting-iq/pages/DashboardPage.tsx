// @ts-nocheck
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@miq/hooks/use-toast';
import { UpcomingMeetingsGrid } from '@miq/components/canvas/UpcomingMeetingsGrid';
import { LandingPotentialMeetingsCanvas } from '@miq/components/canvas/LandingPotentialMeetingsCanvas';
import { MeetingDetailsModal } from '@miq/components/canvas/MeetingDetailsModal';
import { Calendar, Sparkles } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const [isAddMeetingOpen, setIsAddMeetingOpen] = useState(false);
  const { toast } = useToast();

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 py-6 space-y-6">
      {/* Daily Briefing — Upcoming Meetings */}
      <section className="space-y-3">
        <div className="flex items-center gap-3 w-full">
          <div className="flex-shrink-0 text-[#13294B]">
            <Calendar className="w-4 h-4" />
          </div>
          <h2 className="text-left flex-1 text-[15px] font-semibold text-[#13294B]">
            Upcoming Meetings
          </h2>
          <button
            onClick={() => setIsAddMeetingOpen(true)}
            className="text-[13px] text-[#13294B] hover:underline cursor-pointer whitespace-nowrap"
          >
            + Schedule Meeting
          </button>
          <span className="text-border">|</span>
          <Link to="/calendar" className="text-[13px] text-[#13294B] hover:underline cursor-pointer whitespace-nowrap">
            View Calendar
          </Link>
        </div>
        <UpcomingMeetingsGrid />
      </section>

      {/* Potential Meetings */}
      <section className="space-y-3">
        <div className="flex items-center gap-3 w-full">
          <div className="flex-shrink-0 text-[#13294B]">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-left flex-1 text-[15px] font-semibold text-[#13294B]">
            Potential Meetings
          </h2>
          <Link to="/clients" className="text-[13px] text-[#13294B] hover:underline cursor-pointer whitespace-nowrap">
            View Clients
          </Link>
        </div>
        <LandingPotentialMeetingsCanvas variant="table" maxItems={8} />
      </section>

      <MeetingDetailsModal
        mode="add"
        isOpen={isAddMeetingOpen}
        onClose={() => setIsAddMeetingOpen(false)}
        onCreate={(newMeeting: any) => {
          toast({ title: 'Meeting Added', description: `Meeting with ${newMeeting.clientName} scheduled.` });
          setIsAddMeetingOpen(false);
        }}
      />
    </div>
  );
};

export default DashboardPage;
