// @ts-nocheck
export interface StandardizedAgendaTopic {
  id: string;
  title: string;
  description: string;
  timeAllocation: number;
  priority: 'high' | 'medium' | 'low';
  quadrant: 'meeting-overview' | 'last-meeting' | 'planning-goals' | 'portfolio-performance' | 'next-actions';
  bulletPoints: string[];
  talkingPoints: TalkingPoint[];
  includeInClientReview: boolean;
  expandedInReview?: boolean;
}

export interface TalkingPoint {
  id: string;
  content: string;
  order: number;
  includeInReview: boolean;
  isUserAdded?: boolean;
}

export interface ReviewQuadrantData {
  quadrant: 'meeting-overview' | 'last-meeting' | 'planning-goals' | 'portfolio-performance' | 'next-actions';
  title: string;
  icon: string;
  agendaItems: StandardizedAgendaTopic[];
  bullets: string[];
  talkingPoints: TalkingPoint[];
  metrics?: Array<{
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'stable';
  }>;
  isExpanded: boolean;
}

export interface AgendaReviewMapping {
  clientId: string;
  standardizedTopics: StandardizedAgendaTopic[];
  quadrants: ReviewQuadrantData[];
  lastUpdated: Date;
}

// Client Review Settings Types
export interface ClientReviewSwitchState {
  sectionId: string;
  bulletIndex: number;
  includeInReview: boolean;
  lastUpdated: Date;
}

export interface MeetingReviewSettings {
  meetingDate: string;
  clientId: string;
  switches: Record<string, ClientReviewSwitchState>; // key: "${sectionId}-${bulletIndex}"
  lastUpdated: Date;
}

export interface ClientReviewSettings {
  clientId: string;
  meetings: Record<string, MeetingReviewSettings>; // key: meetingDate (YYYY-MM-DD)
  lastUpdated: Date;
}

// Standard 4-topic structure that every agenda will follow (Last Meeting Summary accessible via quick reply)
export const STANDARD_AGENDA_STRUCTURE = [
  {
    quadrant: 'meeting-overview' as const,
    title: 'Meeting Overview & Objectives',
    icon: '👋',
    defaultTimeAllocation: 5,
  },
  {
    quadrant: 'planning-goals' as const,
    title: 'Planning & Goals',
    icon: '🎯',
    defaultTimeAllocation: 15,
  },
  {
    quadrant: 'portfolio-performance' as const,
    title: 'Portfolio Performance & Market Insights',
    icon: '📊',
    defaultTimeAllocation: 15,
  },
  {
    quadrant: 'next-actions' as const,
    title: 'Suggested Next Actions',
    icon: '✅',
    defaultTimeAllocation: 10,
  },
];