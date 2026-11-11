// @ts-nocheck
// Stub: not yet ported. Source data files import EnhancedMeetingData as a type.
import React from "react";

export interface EnhancedMeetingData {
  id: string;
  clientId?: string;
  clientName: string;
  date: Date | string;
  time: string;
  duration: number;
  type:
    | "Annual Review"
    | "Bi-Annual Review"
    | "Quarterly Review"
    | "Client Planning"
    | "Estate Planning Session";
  title?: string;
  status: "confirmed" | "pending" | "rescheduled";
  priority: "high" | "medium" | "low";
  location?: {
    type: "office" | "virtual" | "client_location";
    details?: string;
  };
  preparationStatus?: "ready" | "in_progress" | "needs_attention" | "failed";
  notes?: string;
  agenda?: string[];
}

export const MeetingCard: React.FC<{ meeting: EnhancedMeetingData; [k: string]: any }> = () => null;

export default MeetingCard;
