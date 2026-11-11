// @ts-nocheck
export interface InteractiveElement {
  id: string;
  type: 'client' | 'action';
  text: string;
  clientId?: string;
  action?: string;
}

export interface ActionButton {
  id: string;
  label: string;
  action: string;
  variant?: 'default' | 'outline' | 'secondary';
}

export interface QuickReply {
  id: string;
  text: string;
  action?: string;
  data?: any;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date | string;
  relatedData?: CanvasUpdate[];
  interactiveElements?: InteractiveElement[];
  quickReplies?: QuickReply[];
  actionButtons?: ActionButton[];
  canvasAction?: string;
}

export interface ReferralData {
  totalReferralsSent: number;
  successfulReferrals: number;
  conversionRate: number;
  referralHistory: Array<{
    referredName: string;
    referredDate: string;
    status: 'prospect' | 'client' | 'declined';
    becameClientDate?: string;
    estimatedValue?: number;
    notes?: string;
  }>;
  referralValue: {
    totalPotentialAUM: number;
    actualAUM: number;
  };
  isActiveReferrer: boolean;
}

export interface ClientData {
  id: string;
  name: string;
  birthDate?: string;
  meetingDate?: Date | string;
  nextMeeting?: Date | string;
  nextMeetingDetails?: {
    time: string;
    duration: number;
    type: 'review' | 'planning' | 'compliance' | 'onboarding' | 'Quarterly Review' | 'Annual Review' | 'Bi-Annual Review' | 'Client Planning' | 'Estate Planning Session';
    location: {
      type: 'office' | 'virtual' | 'client_location';
      details?: string;
    };
    preparationStatus?: 'ready' | 'in_progress' | 'needs_attention';
  };
  category: 'standard' | 'enhanced' | 'high-touch';
  serviceTier?: 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
  householdAssets: number;
  lastMeeting?: Date | string;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  email: string;
  phone: string;
  investmentObjectives?: string[];
  pinned?: boolean;
  demographics?: {
    ages?: string;
    occupations?: string;
    location?: string;
    relationship?: string;
  };
  children?: Array<{
    name: string;
    age: number;
  }>;
  keyMetrics: {
    portfolioReturn: number;
    feeReview: boolean;
    complianceItems: ComplianceItem[];
    yearToDateReturn: number;
    benchmarkComparison: number;
  };
  portfolioData?: PortfolioMetrics;
  complianceStatus?: ComplianceChecklist;
  planningData?: PlanningMetrics;
  meetingHistory?: MeetingNote[];
  professionalNetwork?: {
    accountant?: {
      name: string;
      firm: string;
      email: string;
      phone: string;
      specialties: string[];
      yearsWorking?: number;
      lastContact?: string;
      collaborationFrequency?: string;
      referralSource?: string;
      keyAchievements?: string;
    };
    estateAttorney?: {
      name: string;
      firm: string;
      email: string;
      phone: string;
      specialties: string[];
      yearsWorking?: number;
      lastContact?: string;
      collaborationFrequency?: string;
      referralSource?: string;
      keyAchievements?: string;
    };
    taxProfessional?: {
      name: string;
      firm: string;
      email: string;
      phone: string;
      specialties: string[];
      yearsWorking?: number;
      lastContact?: string;
      collaborationFrequency?: string;
      referralSource?: string;
      keyAchievements?: string;
    };
    insuranceAgent?: {
      name: string;
      firm: string;
      email: string;
      phone: string;
      coverageTypes: string[];
      yearsWorking?: number;
      lastContact?: string;
      collaborationFrequency?: string;
      referralSource?: string;
      keyAchievements?: string;
    };
    financialPlanner?: {
      name: string;
      firm: string;
      email: string;
      phone: string;
      specialties: string[];
      yearsWorking?: number;
      lastContact?: string;
      collaborationFrequency?: string;
      referralSource?: string;
      keyAchievements?: string;
    };
  };
  extendedHousehold?: Array<{
    name: string;
    relationship: string;
    email?: string;
    phone?: string;
    birthDate?: string;
    role: 'spouse' | 'child' | 'dependent' | 'emergency_contact' | 'beneficiary' | 'business_contact';
    responsibilities?: string;
    emergencyContactPriority?: number;
  }>;
  primaryResidence?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  seasonalResidence?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    season?: string;
  };
  preferredCommunication?: {
    method: 'email' | 'phone' | 'text' | 'in_person';
    frequency: 'weekly' | 'monthly' | 'quarterly' | 'as_needed' | 'bi-weekly';
    bestTimeToContact?: string;
  };
  relationshipHistory?: Array<{
    date: Date | string;
    milestone: string;
    type: 'onboarding' | 'account_opening' | 'major_transaction' | 'service_change' | 'referral' | 'life_event' | 'compliance' | 'service_upgrade' | 'regular_review';
    description: string;
    outcome?: string;
  }>;
  documents?: Array<{
    id: string;
    name: string;
    uploadedAt: Date | string;
    status: 'processing' | 'completed';
    size?: number;
    type?: string;
  }>;
  advisorInsights?: {
    keyInsights: Array<{
      title: string;
      content: string;
      category: 'funding' | 'risk' | 'strategy' | 'planning';
    }>;
    advisorQuestions: Array<{
      question: string;
      answer: string;
      category: 'projection' | 'performance' | 'risk' | 'liquidity' | 'tax';
    }>;
  };
  referralData?: ReferralData;
}

export interface ComplianceItem {
  id: string;
  type: 'rmd' | 'beneficiary' | 'review' | 'regulatory';
  description: string;
  status: 'pending' | 'completed' | 'overdue';
  dueDate?: Date | string;
  priority: 'high' | 'medium' | 'low';
}

export interface PortfolioMetrics {
  totalValue: number;
  ytdReturn: number;
  benchmarkReturn: number;
  allocation: {
    stocks: number;
    bonds: number;
    alternatives: number;
    cash: number;
  };
  topHoldings: Array<{
    symbol: string;
    name: string;
    percentage: number;
    value: number;
  }>;
}

export interface ComplianceChecklist {
  rmdRequired: boolean;
  beneficiaryUpdated: Date | string;
  lastReview: Date | string;
  pendingItems: ComplianceItem[];
}

export interface PlanningMetrics {
  retirementReadiness: number;
  goalProgress: Array<{
    goal: string;
    target: number;
    current: number;
    onTrack: boolean;
  }>;
  insuranceNeeds: {
    life: boolean;
    disability: boolean;
    longTermCare: boolean;
  };
}

export interface MeetingNote {
  id: string;
  date: Date | string;
  type: 'review' | 'planning' | 'compliance' | 'other' | 'Quarterly Review' | 'Annual Review' | 'Bi-Annual Review' | 'Client Planning' | 'Estate Planning Session';
  summary: string;
  followUpItems: string[];
  nextMeetingDate?: Date | string;
}

export interface MeetingAgenda {
  id: string;
  client: ClientData;
  meetingDate: Date | string;
  duration: number;
  objectives: string[];
  discussionTopics: AgendaItem[];
  requiredDocuments: Document[];
  followUpItems: string[];
}

export interface VisualContent {
  id: string;
  type: 'chart' | 'document' | 'image';
  title: string;
  description?: string;
  data?: any; // Chart data for charts
  url?: string; // URL for documents/images
  clientFacing: boolean; // Whether to show to client
}

export interface TalkingPoint {
  id: string;
  content: string;
  order: number;
  includeInReview: boolean;
  isUserAdded?: boolean;
  isEditing?: boolean;
}

export interface AgendaItem {
  id: string;
  title: string;
  description: string;
  timeAllocation: number;
  priority: 'high' | 'medium' | 'low';
  category: 'portfolio' | 'planning' | 'compliance' | 'personal' | 'market' | 'goals';
  requiredPrep?: string[];
  visualContent?: VisualContent[]; // Array of attached visuals
  notes?: string; // Presenter notes separate from client-facing description
  dependencies?: string[]; // IDs of agenda items that must come first
  estimatedPrepTime?: number; // Time needed for preparation in minutes
  includeInClientReview?: boolean;
  talkingPoints?: TalkingPoint[];
  aiSummary?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  required: boolean;
  generated?: boolean;
}

export type CanvasItemType = 'client_snapshot' | 'meeting_prep' | 'meeting_summary' | 'meeting_agenda' | 'compliance_review' | 'agenda' | 'compliance' | 'portfolio' | 'action_items' | 'portfolio_overview' | 'compliance_overview' | 'calendar_view' | 'day_view_calendar' | 'calendar_dashboard' | 'communications_view' | 'tasks_view' | 'market_view' | 'agenda_review' | 'email_draft' | 'daily_highlights' | 'client_selection' | 'market_article' | 'market_insight_detail' | 'single_task' | 'single_communication' | 'client_overview' | 'client_detail' | 'communications_overview' | 'tasks_overview' | 'market_overview' | 'meetings_overview' | 'clients_with_upcoming_meetings' | 'household_birthdays' | 'dashboard_this_week' | 'dashboard_next_week' | 'todays_review_meetings' | 'todays_tasks' | 'market_impact_insights' | 'market_insights' | 'supporting_material_portfolio' | 'supporting_material_planning' | 'supporting_material_tax' | 'supporting_material_compliance' | 'supporting_material_market' | 'in_a_minute_briefing' | 'client_crm_data' | 'agenda_detailed_toggle' | 'agenda_bullet_toggle' | 'agenda_toggles_reset' | 'tax_prep' | 'uploaded_files' | 'document_upload_status' | 'client_review_overlay' | 'client_portfolio_chart' | 'client_data_display' | 'landing_daily_briefing' | 'landing_client_data_quality';

export interface CanvasUpdate {
  id: string;
  type: CanvasItemType;
  data: any;
  timestamp: Date | string;
  collapsed?: boolean;
  clientId?: string;
}

export interface EmailDraft {
  id: string;
  communicationId: string;
  to: string;
  from: string;
  subject: string;
  content: string;
  clientContext?: string;
  originalCommunication?: Communication;
}

// New types for enhanced header functionality
export interface HeaderDropdownItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  priority?: 'high' | 'medium' | 'low';
  timestamp?: string | Date;
  action?: 'select_client' | 'load_appointment' | 'load_communication' | 'load_task' | 'load_market_news' | 'load_meeting_prep' | 'view_all_meetings' | 'view_all_communications' | 'view_all_tasks' | 'view_all_market' | 'view_all_clients' | 'load_dashboard_period' | 'view_all_dashboard' | 'load_client_review';
  data?: any;
}

export interface AppointmentData {
  id: string;
  clientName: string;
  time: string;
  date: Date | string; // Made required for proper filtering
  type: string;
  status: 'confirmed' | 'tentative' | 'requires_action';
  preparation?: string[];
}

export interface CommunicationData {
  id: string;
  clientId: string; // Required client ID
  clientName: string;
  type: 'email' | 'call' | 'text';
  subject: string;
  timestamp: Date | string;
  priority: 'high' | 'medium' | 'low';
  requiresResponse: boolean;
  preview: string;
}

export interface TaskData {
  id: string;
  title: string;
  clientId: string; // Required client ID
  clientName?: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: Date | string;
  dateCreated: Date | string;
  estimatedTime: number; // in minutes
  category: 'client_work' | 'compliance' | 'administrative' | 'planning';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  assignedTo: string;
  completedBy?: string; // Staff member who completed the task
  completedAt?: Date; // Completion timestamp
  preparedBy?: string; // Staff member who prepared the task
  description?: string;
  completedComment?: string;
  requiresAdvisorAction?: boolean; // Whether task requires advisor action
  taskType?: 'ready_for_review' | 'advisor_only' | 'urgent' | 'general'; // Task type for categorization
  details?: {
    agenda?: string[];
    clientContext?: {
      householdAssets?: string;
      riskTolerance?: string;
      retirementGoal?: string;
      specialConsiderations?: string;
    };
    preparations?: string[];
  };
}

export interface MarketNewsData {
  id: string;
  title: string;
  category: 'compliance' | 'markets' | 'bonds' | 'insurance';
  impact: 'high' | 'medium' | 'low';
  timestamp: Date | string;
  summary: string;
  clientRelevance?: string[];
  fullArticle?: string;
  source?: string;
  author?: string;
  url?: string;
}

export interface ConversationContext {
  previousMessages: ChatMessage[];
  currentClient?: ClientData | null;
  canvasData: CanvasUpdate[];
  allClients?: ClientData[];
}

export interface ProcessedQuery {
  intent: 'client_lookup' | 'meeting_prep' | 'portfolio_analysis' | 'compliance_check' | 'agenda_generation' | 'email_response' | 'schedule_view' | 'daily_highlights' | 'market_overview' | 'market_article' | 'market_insight_detail' | 'client_data' | 'portfolio_details' | 'tax_preparation' | 'client_query';
  entities: {
    clientName?: string;
    dateTime?: Date;
    meetingType?: string;
    topics?: string[];
    useCurrentClient?: boolean;
    communicationSubject?: string;
  };
  confidence: number;
}

export interface AIResponse {
  textResponse: string;
  canvasUpdates: CanvasUpdate[];
  suggestedActions: string[];
  interactiveElements?: InteractiveElement[];
  quickReplies?: QuickReply[];
  actionButtons?: ActionButton[];
}

export interface DailyHighlights {
  schedule: TodaysSchedule;
  alerts: AdvisorAlert[];
  upcomingDeadlines: ScheduledDeadline[];
  portfolioAlerts: AdvisorAlert[];
  marketData: MarketData;
  communications: Communication[];
}

export interface TodaysSchedule {
  meetings: ScheduledMeeting[];
  tasks: ScheduledTask[];
  deadlines: ScheduledDeadline[];
}

export interface ScheduledMeeting {
  id: string;
  clientName: string;
  clientId?: string;
  time: string;
  type: 'review' | 'planning' | 'compliance' | 'onboarding';
  duration: number;
  status: 'confirmed' | 'pending' | 'rescheduled';
  priority: 'high' | 'medium' | 'low';
  date: Date; // Made required instead of optional
  location?: {
    type: 'office' | 'virtual' | 'client_location';
    details?: string;
  };
  preparationStatus?: 'ready' | 'in_progress' | 'needs_attention';
  notes?: string;
  agenda?: string[];
}

export interface ScheduledTask {
  id: string;
  title: string;
  clientId: string; // Required client ID
  clientName?: string;
  dueTime?: string;
  category: 'compliance' | 'followup' | 'analysis' | 'preparation';
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
}

export interface ScheduledDeadline {
  id: string;
  title: string;
  clientName: string;
  dueDate: Date;
  type: 'rmd' | 'beneficiary' | 'review' | 'regulatory' | 'tax';
  status: 'pending' | 'in_progress' | 'overdue';
}

export interface MarketData {
  indices: MarketIndex[];
  lastUpdated: Date;
  marketSentiment: 'bullish' | 'bearish' | 'neutral';
  keyNews: MarketNews[];
  clientImpact: ClientImpactSummary[];
}

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'flat';
}

export interface MarketNews {
  id: string;
  headline: string;
  summary: string;
  impact: 'high' | 'medium' | 'low';
  relevantSectors: string[];
}

export interface ClientImpactSummary {
  clientName: string;
  estimatedImpact: number;
  impactType: 'positive' | 'negative' | 'neutral';
  reason: string;
}

export interface AdvisorAlert {
  id: string;
  type: 'compliance' | 'market' | 'client' | 'regulatory';
  title: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  timestamp: Date | string;
  clientId: string;
}

export interface Communication {
  id: string;
  clientId?: string; // Optional client ID for general communications
  type: 'email' | 'document' | 'call' | 'meeting_note';
  fromClient?: string;
  subject: string;
  summary: string;
  timestamp: Date | string;
  priority: 'high' | 'medium' | 'low';
  requiresResponse: boolean;
  category: 'general' | 'urgent' | 'compliance' | 'portfolio';
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  category: 'client' | 'compliance' | 'market' | 'portfolio';
  estimatedTime: number;
  icon: string;
  action: string;
}