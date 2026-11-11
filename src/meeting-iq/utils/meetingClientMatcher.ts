// @ts-nocheck
import { ClientData } from '@miq/types/advisor';
import { EnhancedMeetingData } from '@miq/components/canvas/MeetingCard';

/**
 * Helper function to find meetings for a specific client
 * Uses multiple matching strategies to handle ID/name mismatches
 */
export const isMeetingForClient = (meeting: EnhancedMeetingData, client: ClientData): boolean => {
  // Direct clientId match (e.g., "client-linda-chen" === "client-linda-chen")
  if (meeting.clientId && client.id && meeting.clientId === client.id) {
    return true;
  }

  // Direct clientName match (e.g., "Linda Chen" === "Linda Chen")
  if (meeting.clientName && client.name && meeting.clientName === client.name) {
    return true;
  }

  // Fuzzy name matching - normalize and compare
  const normalizeClientName = (name: string): string => {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '');
  };

  if (meeting.clientName && client.name) {
    const normalizedMeetingName = normalizeClientName(meeting.clientName);
    const normalizedClientName = normalizeClientName(client.name);
    
    // Exact match
    if (normalizedMeetingName === normalizedClientName) {
      return true;
    }
    // Containment match (handles various name formats)
    if (
      normalizedMeetingName.includes(normalizedClientName) ||
      normalizedClientName.includes(normalizedMeetingName)
    ) {
      return true;
    }
  }

  // Check if clientId contains the normalized client name
  // e.g., "client-linda-chen" should match "Linda Chen"
  if (meeting.clientId && client.name) {
    const normalizedClientName = normalizeClientName(client.name);
    const normalizedClientId = normalizeClientName(meeting.clientId);
    
    if (normalizedClientId.includes(normalizedClientName)) {
      return true;
    }
  }

  // Check if client ID contains the normalized meeting client name
  // e.g., "client-linda-chen" should match meeting with clientName "Linda Chen"
  if (client.id && meeting.clientName) {
    const normalizedMeetingName = normalizeClientName(meeting.clientName);
    const normalizedClientId = normalizeClientName(client.id);
    
    if (normalizedClientId.includes(normalizedMeetingName)) {
      return true;
    }
  }

  return false;
};

/**
 * Find all meetings for a client using flexible matching
 */
export const findMeetingsForClient = (client: ClientData, allMeetings: EnhancedMeetingData[]): EnhancedMeetingData[] => {
  return allMeetings.filter(meeting => isMeetingForClient(meeting, client));
};

/**
 * Find the most relevant meeting for a client
 * Prefers upcoming meetings, then most recent past meetings
 */
export const findMostRelevantMeeting = (client: ClientData, allMeetings: EnhancedMeetingData[]): EnhancedMeetingData | null => {
  const clientMeetings = findMeetingsForClient(client, allMeetings);
  
  if (clientMeetings.length === 0) {
    return null;
  }

  const now = new Date();
  
  // Separate upcoming and past meetings
  const upcomingMeetings = clientMeetings.filter(meeting => {
    const meetingDate = typeof meeting.date === 'string' ? new Date(meeting.date) : meeting.date;
    return meetingDate >= now;
  });
  
  const pastMeetings = clientMeetings.filter(meeting => {
    const meetingDate = typeof meeting.date === 'string' ? new Date(meeting.date) : meeting.date;
    return meetingDate < now;
  });

  // Prefer upcoming meetings (earliest first)
  if (upcomingMeetings.length > 0) {
    upcomingMeetings.sort((a, b) => {
      const dateA = typeof a.date === 'string' ? new Date(a.date) : a.date;
      const dateB = typeof b.date === 'string' ? new Date(b.date) : b.date;
      return dateA.getTime() - dateB.getTime();
    });
    return upcomingMeetings[0];
  }

  // Fallback to most recent past meeting
  if (pastMeetings.length > 0) {
    pastMeetings.sort((a, b) => {
      const dateA = typeof a.date === 'string' ? new Date(a.date) : a.date;
      const dateB = typeof b.date === 'string' ? new Date(b.date) : b.date;
      return dateB.getTime() - dateA.getTime();
    });
    return pastMeetings[0];
  }

  return null;
};