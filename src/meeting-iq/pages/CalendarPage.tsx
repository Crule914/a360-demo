// @ts-nocheck
import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CalendarCanvas } from '@miq/components/canvas/CalendarCanvas';

export const CalendarPage: React.FC = () => {
  return (
    <TooltipProvider>
      <div className="h-full w-full overflow-hidden">
        <CalendarCanvas />
      </div>
    </TooltipProvider>
  );
};

export default CalendarPage;
