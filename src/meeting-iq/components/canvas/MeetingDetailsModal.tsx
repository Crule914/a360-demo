// @ts-nocheck
// Stub: not yet ported. Other ported pages only consume NewMeetingData as a type
// and render the modal under a "Schedule meeting" flow that's out of scope for Phase 3.
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export interface NewMeetingData {
  clientName: string;
  type: string;
  date: string;
  time: string;
  duration: number;
  location?: { type: string; details?: string };
  notes?: string;
}

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
  [k: string]: any;
}

export const MeetingDetailsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose?.()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Meeting Details</DialogTitle>
          <DialogDescription>
            This flow hasn't been ported yet. The Clients list is read-only in this phase.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingDetailsModal;
