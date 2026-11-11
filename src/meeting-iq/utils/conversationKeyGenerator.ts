// @ts-nocheck
/**
 * Utility functions for generating conversation keys and extracting meeting context
 */

/**
 * Generates a composite conversation key for unique conversation identification
 * Format: {clientId}|{meetingType}|{meetingDate}|{conversationId}|{userId}
 * Each conversation thread gets a unique timestamp-based ID
 */
export const generateConversationKey = (
  clientId: string,
  meetingType: string,
  meetingDate: string,
  userId: string = 'advisor-123',
  conversationId?: string
): string => {
  const convId = conversationId || Date.now().toString();
  return `${clientId}|${meetingType}|${meetingDate}|${convId}|${userId}`;
};

/**
 * Extracts meeting type from action and data context
 */
export const extractMeetingType = (action: string, data?: any): string | undefined => {
  // Direct action mapping
  const actionToMeetingType: Record<string, string> = {
    'meeting_prep': 'meeting_prep',
    'portfolio_overview': 'portfolio_review', 
    'compliance_overview': 'compliance',
    'client_overview': 'household_review',
    'agenda_builder': 'planning',
  };

  if (actionToMeetingType[action]) {
    return actionToMeetingType[action];
  }

  // Extract from data context
  if (data?.meetingType) {
    return data.meetingType;
  }

  // Extract from meeting object structures
  if (data?.meeting?.type) {
    return data.meeting.type;
  }

  if (data?.meetingData?.type) {
    return data.meetingData.type;
  }

  // Extract from task context
  if (data?.taskTitle || data?.title) {
    const title = (data.taskTitle || data.title).toLowerCase();
    if (title.includes('review')) return 'review';
    if (title.includes('planning')) return 'planning';
    if (title.includes('onboarding')) return 'onboarding';
    if (title.includes('compliance')) return 'compliance';
  }

  // Default for meeting-related actions
  if (action.includes('meeting') || action.includes('prep')) {
    return 'review';
  }

  return undefined;
};

/**
 * Extracts meeting date from action and data context
 * Returns ISO date string (YYYY-MM-DD)
 */
export const extractMeetingDate = (action: string, data?: any): string | undefined => {
  // Extract from data context
  if (data?.meetingDate) {
    const date = new Date(data.meetingDate);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  }

  // Extract from meeting object structures
  if (data?.meeting?.date) {
    const date = new Date(data.meeting.date);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  }

  if (data?.meetingData?.date) {
    const date = new Date(data.meetingData.date);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  }

  if (data?.date) {
    const date = new Date(data.date);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  }

  // Extract from task scheduled date
  if (data?.scheduledDate) {
    const date = new Date(data.scheduledDate);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  }

  // For immediate meeting prep, use today's date
  if (action === 'meeting_prep' || action.includes('today')) {
    return new Date().toISOString().split('T')[0];
  }

  return undefined;
};

/**
 * Parses a conversation key back into its components
 */
export const parseConversationKey = (conversationKey: string): {
  clientId: string;
  meetingType: string;
  meetingDate: string;
  conversationId: string;
  userId: string;
} | null => {
  const parts = conversationKey.split('|');
  // Support both old (4 parts) and new (5 parts) format
  if (parts.length === 4) {
    return {
      clientId: parts[0],
      meetingType: parts[1],
      meetingDate: parts[2],
      conversationId: Date.now().toString(),
      userId: parts[3],
    };
  }
  if (parts.length !== 5) return null;

  return {
    clientId: parts[0],
    meetingType: parts[1],
    meetingDate: parts[2],
    conversationId: parts[3],
    userId: parts[4],
  };
};

/**
 * Checks if a conversation key should be created for the given context
 */
export const shouldCreateConversationKey = (action: string, data?: any): boolean => {
  const meetingType = extractMeetingType(action, data);
  const meetingDate = extractMeetingDate(action, data);
  const hasClient = Boolean(data?.clientId || data?.clientName || data?.name);
  
  return Boolean(meetingType && meetingDate && hasClient);
};