// @ts-nocheck
import React from 'react';
import { LandingPotentialMeetingsCanvas } from '@miq/components/canvas/LandingPotentialMeetingsCanvas';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AdvisorFilterAvatars } from '@miq/components/canvas/AdvisorFilterAvatars';
import { useCopy } from '@miq/lib/copy';

const ClientsPage: React.FC = () => {
  const title = useCopy('clients.title', 'Clients Due for Reviews');

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header matching app PageHeader theme */}
      <div className="h-11 bg-header flex items-center justify-between pl-6 pr-4 flex-shrink-0">
        <h1 className="text-[15px] font-medium text-white/90">
          {title}
        </h1>
        <AdvisorFilterAvatars />
      </div>

      {/* Content - no card wrapper */}
      <ScrollArea className="flex-1">
        <div className="px-8 py-6 min-h-full">
          <LandingPotentialMeetingsCanvas />
        </div>
      </ScrollArea>
    </div>
  );
};

export default ClientsPage;

