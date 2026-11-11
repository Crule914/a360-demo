// @ts-nocheck
import { format, addHours, addDays, isToday, subHours, isWeekend } from 'date-fns';
import type { DailyHighlights, ScheduledMeeting, ScheduledTask, ScheduledDeadline, MarketData, AdvisorAlert, Communication, QuickAction } from '../types/advisor';
import { type EnhancedMeetingData } from '../components/canvas/MeetingCard';
import { getWorkWeekRange, getWorkDays, type WorkWeekRange } from '../utils/dateHelpers';
import { ensureValidDate, validateDatesInArray, logDateValidation } from '../utils/dateValidation';
import { normalizeTimestamp } from '../utils/dateNormalization';
import { getMockMeetingData } from './mockMeetingData';

// Cache for weekly meetings (most common call pattern)
let _cachedWeeklyMeetings: EnhancedMeetingData[] | null = null;

// Mark designated demo meetings as failed-to-generate so every consumer
// (Calendar, Calendar V2, Upcoming Meetings grid, Meeting Prep page) sees
// the same "Agenda Issue" status when looking up by clientId + date.
function applyFailedMeetingOverrides(meetings: EnhancedMeetingData[]): EnhancedMeetingData[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sorted = [...meetings].sort((a, b) => {
    const ad = new Date(a.date).getTime();
    const bd = new Date(b.date).getTime();
    return ad - bd;
  });
  const failedIds = new Set<string>();
  // First upcoming Robert & Patricia Johnson meeting fails to generate
  const firstJohnson = sorted.find(m => {
    const md = new Date(m.date);
    md.setHours(0, 0, 0, 0);
    return md.getTime() >= today.getTime() && m.clientName === 'Robert & Patricia Johnson';
  });
  if (firstJohnson) failedIds.add(firstJohnson.id);
  // Lisa Anderson's upcoming Client Planning also surfaces as Agenda Issue
  const firstLisa = sorted.find(m => {
    const md = new Date(m.date);
    md.setHours(0, 0, 0, 0);
    return md.getTime() >= today.getTime() && m.clientId === 'client-lisa-anderson';
  });
  if (firstLisa) failedIds.add(firstLisa.id);
  return meetings.map(m => failedIds.has(m.id) ? { ...m, preparationStatus: 'failed' as const } : m);
}


// Function to get enhanced meetings list for a specific work week
export function getEnhancedMeetingsList(targetWorkWeek?: WorkWeekRange, forWeeklyView?: boolean): EnhancedMeetingData[] {
  // If this is for weekly view with no specific week, return cached
  if (forWeeklyView && !targetWorkWeek) {
    if (_cachedWeeklyMeetings) return _cachedWeeklyMeetings;
    _cachedWeeklyMeetings = applyFailedMeetingOverrides(getWeeklyMeetingsWithTimeSpread());
    return _cachedWeeklyMeetings;
  }


  const today = normalizeTimestamp(new Date());
  
  // Use provided work week or get current work week
  const workWeek = targetWorkWeek || getWorkWeekRange(today);
  
  // Get all work days (Monday-Friday) for the target week
  const workDays = getWorkDays(workWeek);
  
  const meetings: EnhancedMeetingData[] = [];

  // Generate meetings for each work day
  workDays.forEach((meetingDate, dayIndex) => {
    const dayName = format(meetingDate, 'EEEE');
    
    // Different meeting patterns for different days
    const meetingsForDay = dayIndex === 0 ? [ // Monday - Williams, Thompson, Sarah Wilson
      {
        id: `monday-1-${format(meetingDate, 'yyyy-MM-dd')}`,
        clientId: 'client-david-carol-williams',
        clientName: 'David & Carol Williams',
        date: normalizeTimestamp(meetingDate),
        time: '10:30',
        duration: 60,
        type: '' as any,
        status: 'confirmed' as const,
        priority: 'medium' as const,
        location: { type: 'virtual' },
        preparationStatus: 'in_progress' as const,
        notes: 'Investment portfolio review',
        agenda: []
      },
      {
        id: `monday-2-${format(meetingDate, 'yyyy-MM-dd')}`,
        clientId: 'client-margaret-thompson',
        clientName: 'Margaret Thompson',
        date: normalizeTimestamp(meetingDate),
        time: '14:00',
        duration: 60,
        type: 'Client Planning' as const,
        status: 'confirmed' as const,
        priority: 'high' as const,
        location: { type: 'office' },
        preparationStatus: 'needs_attention' as const,
        notes: 'New client onboarding meeting',
        agenda: ['Welcome and Introduction', 'Account Setup', 'Investment Goals Discussion']
      },
      {
        id: `monday-3-${format(meetingDate, 'yyyy-MM-dd')}`,
        clientId: 'client-sarah-johnson',
        clientName: 'Sarah Johnson',
        date: normalizeTimestamp(meetingDate),
        time: '09:00',
        duration: 60,
        type: 'Quarterly Review' as const,
        status: 'confirmed' as const,
        priority: 'medium' as const,
        location: { type: 'office', details: 'Conference Room A' },
        preparationStatus: 'ready' as const,
        notes: 'Quarterly check-in and portfolio rebalancing',
        agenda: ['Q1 Performance Review', 'Rebalancing Discussion', 'Goal Updates']
      },
    ] : dayIndex === 1 ? [ // Tuesday - Robert, Linda
      {
        id: `tuesday-1-${format(meetingDate, 'yyyy-MM-dd')}`,
        clientId: 'client-robert-martinez',
        clientName: 'Robert Martinez',
        date: normalizeTimestamp(meetingDate),
        time: '09:00',
        duration: 60,
        type: 'Annual Review' as const,
        status: 'confirmed' as const,
        priority: 'high' as const,
        location: { type: 'office', details: 'Conference Room A' },
        preparationStatus: 'ready' as const,
        notes: 'Strategic portfolio review and planning session',
        agenda: ['Portfolio Performance Analysis', 'Investment Strategy Review', 'Risk Assessment']
      },
      {
        id: `tuesday-2-${format(meetingDate, 'yyyy-MM-dd')}`,
        clientId: 'client-linda-chen',
        clientName: 'Linda Chen',
        date: normalizeTimestamp(meetingDate),
        time: '14:30',
        duration: 60,
        type: 'Quarterly Review' as const,
        status: 'confirmed' as const,
        priority: 'medium' as const,
        location: { type: 'virtual' },
        preparationStatus: 'in_progress' as const,
        notes: 'Quarterly review and planning session',
        agenda: ['Q4 Performance Review', 'Investment Strategy Discussion', 'Risk Assessment']
      },
    ] : dayIndex === 2 ? [ // Wednesday
      {
        id: `wednesday-1-${format(meetingDate, 'yyyy-MM-dd')}`,
        clientId: 'client-foster',
        clientName: 'Jennifer & Mark Foster',
        date: normalizeTimestamp(meetingDate),
        time: '11:00',
        duration: 60,
        type: 'Annual Review' as const,
        status: 'confirmed' as const,
        priority: 'medium' as const,
        location: { type: 'office' },
        preparationStatus: 'ready' as const,
        notes: 'Annual portfolio review',
        agenda: ['Year-end Review', 'Tax Planning', 'Next Year Strategy']
      },
      {
        id: `wednesday-2-${format(meetingDate, 'yyyy-MM-dd')}`,
        clientId: 'client-carlos-elena-rodriguez',
        clientName: 'Carlos & Elena Rodriguez',
        date: normalizeTimestamp(meetingDate),
        time: '15:30',
        duration: 60,
        type: '' as any,
        status: 'confirmed' as const,
        priority: 'low' as const,
        location: { type: 'virtual' },
        preparationStatus: 'in_progress' as const,
        notes: 'Portfolio performance review',
        agenda: []
      },
    ] : dayIndex === 3 ? [ // Thursday - Sweets, Lisa Anderson, Johnson, Thompson
      {
        id: `thursday-sweets-${format(meetingDate, 'yyyy-MM-dd')}`,
        clientId: 'client-sweets-family',
        clientName: 'Rick & Karen Sweets',
        date: normalizeTimestamp(meetingDate),
        time: '09:00',
        duration: 60,
        type: 'Annual Review' as const,
        status: 'confirmed' as const,
        priority: 'high' as const,
        location: { type: 'office', details: 'Conference Room A' },
        preparationStatus: 'ready' as const,
        notes: 'Annual household financial plan review',
        agenda: [
          'Household Financial Plan Review — Rick & Karen',
          'Retirement Timeline & Income Strategy',
          'Schwab Portfolio Performance & Rebalancing',
          'Estate Planning & Beneficiary Updates'
        ]
      },
      {
        id: `thursday-1-${format(meetingDate, 'yyyy-MM-dd')}`,
        clientId: 'client-lisa-anderson',
        clientName: 'Lisa Anderson',
        date: normalizeTimestamp(meetingDate),
        time: '11:00',
        duration: 60,
        type: 'Client Planning' as const,
        status: 'confirmed' as const,
        priority: 'high' as const,
        location: { type: 'office', details: 'Conference Room B' },
        preparationStatus: 'in_progress' as const,
        notes: 'Investment strategy consultation',
        agenda: ['Risk Assessment', 'Investment Options', 'Strategy Implementation']
      },
      {
        id: `thursday-2-${format(meetingDate, 'yyyy-MM-dd')}`,
        clientId: 'client-johnson',
        clientName: 'Robert & Patricia Johnson',
        date: normalizeTimestamp(meetingDate),
        time: '15:00',
        duration: 60,
        type: 'Quarterly Review' as const,
        status: 'confirmed' as const,
        priority: 'medium' as const,
        location: { type: 'office', details: 'Conference Room A' },
        preparationStatus: 'in_progress' as const,
        notes: 'Estate and retirement planning check-in',
        agenda: ['Estate Review', 'Retirement Income Plan', 'Tax Optimization']
      },
      {
        id: `thursday-3-${format(meetingDate, 'yyyy-MM-dd')}`,
        clientId: 'client-john-mary-thompson',
        clientName: 'John & Mary Thompson',
        date: normalizeTimestamp(meetingDate),
        time: '13:00',
        duration: 60,
        type: 'Annual Review' as const,
        status: 'confirmed' as const,
        priority: 'high' as const,
        location: { type: 'virtual' },
        preparationStatus: 'ready' as const,
        notes: 'Annual comprehensive review',
        agenda: ['Year-End Summary', 'Tax Planning', 'Estate Updates']
      }
    ] : [ // Friday - Parker, Brown, Sarah Wilson
      {
        id: `friday-1-${format(meetingDate, 'yyyy-MM-dd')}`,
        clientId: 'client-steven-julia-parker',
        clientName: 'Steven & Julia Parker',
        date: normalizeTimestamp(meetingDate),
        time: '10:00',
        duration: 60,
        type: 'Quarterly Review' as const,
        status: 'confirmed' as const,
        priority: 'medium' as const,
        location: { type: 'office' },
        preparationStatus: 'ready' as const,
        notes: 'Follow-up on investment decisions',
        agenda: ['Decision Review', 'Implementation Timeline', 'Next Steps']
      },
      {
        id: `friday-2-${format(meetingDate, 'yyyy-MM-dd')}`,
        clientId: 'client-amanda-brown',
        clientName: 'Amanda Brown',
        date: normalizeTimestamp(meetingDate),
        time: '13:30',
        duration: 60,
        type: '' as any,
        status: 'confirmed' as const,
        priority: 'low' as const,
        location: { type: 'virtual' },
        preparationStatus: 'in_progress' as const,
        notes: 'Retirement planning discussion',
        agenda: []
      },
      {
        id: `friday-3-${format(meetingDate, 'yyyy-MM-dd')}`,
        clientId: 'client-past-1',
        clientName: 'Sarah Wilson',
        date: normalizeTimestamp(meetingDate),
        time: '09:00',
        duration: 60,
        type: 'Client Planning' as const,
        status: 'confirmed' as const,
        priority: 'medium' as const,
        location: { type: 'office', details: 'Conference Room A' },
        preparationStatus: 'ready' as const,
        notes: 'Financial planning session',
        agenda: ['Budget Review', 'Savings Goals', 'Investment Allocation']
      }
    ];

    meetingsForDay.forEach(meeting => {
      meetings.push(meeting);
    });
  });
  
  return meetings;
}

// Helper function to get the next workday from a given date
function getNextWorkday(fromDate: Date, daysToAdd: number): Date {
  let date = new Date(fromDate);
  let counter = 0;
  
  while (counter < Math.abs(daysToAdd)) {
    if (daysToAdd > 0) {
      date = addDays(date, 1);
    } else {
      date = addDays(date, -1);
    }
    
    if (!isWeekend(date)) {
      counter++;
    }
  }
  
  return date;
}

// Function to generate meetings across past, present, and future for better UI testing
function getWeeklyMeetingsWithTimeSpread(): EnhancedMeetingData[] {
  // Generate meetings for 4 weeks: last week, this week, next week, week after next
  const thisWeek = getWorkWeekRange();
  const lastWeek = getWorkWeekRange(addDays(thisWeek.start, -7));
  const nextWeek = getWorkWeekRange(addDays(thisWeek.start, 7));
  const weekAfterNext = getWorkWeekRange(addDays(thisWeek.start, 14));
  const threeWeeksOut = getWorkWeekRange(addDays(thisWeek.start, 21));

  const meetings: EnhancedMeetingData[] = [
    ...getEnhancedMeetingsList(lastWeek, false),
    ...getEnhancedMeetingsList(thisWeek, false),
    ...getEnhancedMeetingsList(nextWeek, false),
    ...getEnhancedMeetingsList(weekAfterNext, false),
    ...getEnhancedMeetingsList(threeWeeksOut, false),
  ];

  // Add unlinked client meetings (not in CRM) on today and tomorrow
  const today = normalizeTimestamp(new Date());
  const tomorrow = getNextWorkday(today, 1);
  const twoWeeksOut = getNextWorkday(today, 14);

  meetings.push(
    {
      id: `unlinked-1-${format(today, 'yyyy-MM-dd')}`,
      clientId: 'client-james-crawford',
      clientName: 'James Crawford',
      date: normalizeTimestamp(today),
      time: '16:30',
      duration: 60,
      type: 'Client Planning' as const,
      status: 'confirmed' as const,
      priority: 'low' as const,
      location: { type: 'virtual' },
      preparationStatus: 'needs_attention' as const,
      notes: 'Initial discovery call - not yet in CRM',
      agenda: ['Introduction', 'Needs Assessment']
    },
    {
      id: `unlinked-2-${format(tomorrow, 'yyyy-MM-dd')}`,
      clientId: 'client-rachel-kim',
      clientName: 'Rachel Kim',
      date: normalizeTimestamp(tomorrow),
      time: '11:00',
      duration: 60,
      type: 'Quarterly Review' as const,
      status: 'confirmed' as const,
      priority: 'medium' as const,
      location: { type: 'office' },
      preparationStatus: 'needs_attention' as const,
      notes: 'Client record pending CRM import',
      agenda: ['Portfolio Review', 'Account Setup']
    },
    {
      id: `unlinked-3-${format(today, 'yyyy-MM-dd')}`,
      clientId: 'client-michael-grant',
      clientName: 'Michael Grant',
      date: normalizeTimestamp(today),
      time: '17:30',
      duration: 60,
      type: '' as any,
      status: 'confirmed' as const,
      priority: 'medium' as const,
      location: { type: 'office' },
      preparationStatus: 'needs_attention' as const,
      notes: 'New prospect - household not yet connected',
      agenda: ['Introduction', 'Financial Overview']
    },
    {
      id: `stale-williams-${format(twoWeeksOut, 'yyyy-MM-dd')}`,
      clientId: 'client-david-carol-williams',
      clientName: 'David & Carol Williams',
      date: normalizeTimestamp(twoWeeksOut),
      time: '14:00',
      duration: 60,
      type: 'Annual Review' as const,
      status: 'confirmed' as const,
      priority: 'high' as const,
      location: { type: 'office', details: 'Conference Room A' },
      preparationStatus: 'ready' as const,
      notes: 'Far-future meeting for stale-agenda testing',
      agenda: [
        'Retirement Income Strategy',
        'Portfolio Performance Review',
        'Tax Planning Update',
        'Estate Plan Refresh'
      ]
    },
    {
      id: `stale-jennifer-taylor-${format(twoWeeksOut, 'yyyy-MM-dd')}`,
      clientId: 'client-jennifer-taylor',
      clientName: 'Jennifer Taylor',
      date: normalizeTimestamp(twoWeeksOut),
      time: '10:30',
      duration: 60,
      type: 'Annual Review' as const,
      status: 'confirmed' as const,
      priority: 'medium' as const,
      location: { type: 'virtual', details: 'Teams Meeting' },
      preparationStatus: 'ready' as const,
      notes: 'Far-future meeting for stale-agenda demo',
      agenda: [
        'Divorce Financial Planning',
        'Asset Division Strategy',
        'Alimony Tax Implications',
        'Independent Financial Plan'
      ]
    }
  );

  return meetings;
}

// Helper function to determine additional meetings needed based on current day
function getAdditionalMeetingsForWeek(currentDayOfWeek: number): number {
  switch (currentDayOfWeek) {
    case 1: return 8; // Monday - need 8 more meetings for the week
    case 2: return 6; // Tuesday - need 6 more meetings for the week
    case 3: return 4; // Wednesday - need 4 more meetings for the week
    case 4: return 3; // Thursday - need 3 more meetings for the week
    case 5: return 1; // Friday - need 1 more meeting for the week
    default: return 5; // Weekend or other - default to moderate amount
  }
}

// Helper function to determine how many meetings a specific day should have
function getDayMeetingCount(dayOfWeek: number, currentDayOfWeek: number, dayIndex: number): number {
  // If it's a past day (earlier in the week), give it 1-2 meetings
  if (dayOfWeek < currentDayOfWeek) {
    return Math.random() > 0.5 ? 2 : 1;
  }
  
  // If it's a future day, vary based on typical meeting patterns
  switch (dayOfWeek) {
    case 1: return 2; // Monday - typically busy
    case 2: return 3; // Tuesday - peak meeting day
    case 3: return 2; // Wednesday - moderate
    case 4: return 2; // Thursday - moderate
    case 5: return 1; // Friday - lighter
    default: return 1;
  }
}

// Helper function to generate a meeting for a specific day
function generateMeetingForDay(meetingDate: Date, dayIndex: number, meetingIndex: number): EnhancedMeetingData | null {
  const dayName = format(meetingDate, 'EEEE').toLowerCase();
  const clientOptions = [
    { id: 'client-brown', name: 'Amanda Brown' },
    { id: 'client-davis', name: 'Michael & Sarah Davis' },
    { id: 'client-wilson', name: 'Robert Wilson' },
    { id: 'client-garcia', name: 'Sofia Garcia' },
    { id: 'client-martin', name: 'John & Lisa Martin' },
    { id: 'client-taylor', name: 'Emma Taylor' },
    { id: 'client-lee', name: 'Kevin & Amy Lee' },
    { id: 'client-jackson', name: 'Tyler Jackson' }
  ];
  
  const times = ['09:00', '10:30', '11:30', '13:00', '14:30', '15:30', '16:00'];
  const meetingTypes = ['Annual Review', 'Bi-Annual Review', 'Quarterly Review', 'Client Planning'] as const;
  const priorities = ['high', 'medium', 'low'] as const;
  
  const clientIndex = (dayIndex + meetingIndex) % clientOptions.length;
  const client = clientOptions[clientIndex];
  const time = times[meetingIndex % times.length];
  const type = meetingTypes[meetingIndex % meetingTypes.length];
  const priority = priorities[meetingIndex % priorities.length];
  
  // Enhanced agenda items based on meeting type and client specifics
  const getComprehensiveAgenda = (meetingType: string, clientName: string) => {
    switch (meetingType) {
      case 'annual_review':
        return [
          'Year-End Portfolio Performance Analysis', 
          'Tax Planning & Optimization Strategies', 
          'Estate Planning Review & Updates', 
          'Next Year Investment Strategy'
        ];
      case 'quarterly_review':
        return [
          'Q4 Portfolio Performance Assessment', 
          'Market Impact Analysis & Outlook', 
          'Asset Allocation Rebalancing Review', 
          'Strategic Adjustments & Recommendations'
        ];
      case 'financial_planning':
        return [
          'Comprehensive Financial Goals Review', 
          'Investment Strategy Optimization', 
          'Risk Assessment & Management', 
          'Retirement Planning Progress Update'
        ];
      default:
        return ['Portfolio Review', 'Market Updates', 'Strategy Discussion'];
    }
  };

  const getDetailedNotes = (meetingType: string, clientName: string) => {
    switch (meetingType) {
      case 'Annual Review':
        return `Comprehensive annual review focusing on year-end performance, tax optimization strategies, and strategic planning for the upcoming year with ${clientName}`;
      case 'Client Planning':
        return `Quarterly portfolio assessment covering performance analysis, market impact evaluation, and strategic adjustments for ${clientName}`;
      case 'Financial Planning':
        return `Strategic financial planning session covering investment optimization, risk management, and long-term goal alignment for ${clientName}`;
      default:
        return `Strategic consultation session with ${clientName}`;
    }
  };
  
  return {
    id: `${dayName}-${meetingIndex + 1}-${format(meetingDate, 'yyyy-MM-dd')}`,
    clientId: client.id,
    clientName: client.name,
    date: normalizeTimestamp(meetingDate),
    time,
    duration: 60,
    type,
    status: 'confirmed' as const,
    priority,
    location: { 
      type: meetingIndex % 2 === 0 ? 'office' : 'virtual',
      details: meetingIndex % 2 === 0 ? `Conference Room ${['A', 'B', 'C'][meetingIndex % 3]}` : undefined
    },
    preparationStatus: (() => {
      const now = new Date();
      const startOfCurrentWeek = new Date(now);
      startOfCurrentWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
      startOfCurrentWeek.setHours(0, 0, 0, 0);
      const endOfCurrentWeek = new Date(startOfCurrentWeek);
      endOfCurrentWeek.setDate(startOfCurrentWeek.getDate() + 4); // Friday
      endOfCurrentWeek.setHours(23, 59, 59, 999);
      const meetingDay = new Date(meetingDate);
      meetingDay.setHours(0, 0, 0, 0);
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);

      // Current week, not in the past → always Ready
      if (meetingDay >= todayStart && meetingDay <= endOfCurrentWeek) {
        return 'ready' as const;
      }
      // Next week → first 2 days Ready, rest In Progress
      const startOfNextWeek = new Date(endOfCurrentWeek);
      startOfNextWeek.setDate(startOfNextWeek.getDate() + 3); // Next Monday
      startOfNextWeek.setHours(0, 0, 0, 0);
      if (meetingDay > endOfCurrentWeek) {
        const dayOfWeek = meetingDay.getDay(); // 1=Mon, 2=Tue...
        return (dayOfWeek <= 2) ? 'ready' as const : 'in_progress' as const;
      }
      // Past meetings → ready
      return 'ready' as const;
    })(),
    notes: getDetailedNotes(type, client.name),
    agenda: getComprehensiveAgenda(type, client.name)
  };
}

// Generate mock daily highlights
export function generateMockDailyHighlights(): DailyHighlights {
  const today = normalizeTimestamp(new Date());
  
  
  // Get all meetings for the current work week (daily view only)
  const allMeetings = getEnhancedMeetingsList(undefined, false);
  
  // Filter to only today's meetings with date validation
  const todaysMeetings = allMeetings.filter(meeting => {
    // Normalize and validate the meeting date first
    const normalizedDate = normalizeTimestamp(meeting.date);
    return isToday(normalizedDate);
  });
  
  // Ensure we always have at least 2 meetings for today
  const additionalMeetings = [];
  
    // If we have less than 2 meetings, add more
    if (todaysMeetings.length < 2) {
      // Add Robert Martinez as a priority client (always first)
      if (!todaysMeetings.some(m => m.clientName.includes('Robert Martinez'))) {
        additionalMeetings.unshift({
          id: `today-martinez-${format(today, 'yyyy-MM-dd')}`,
          clientId: 'client-robert-martinez',
          clientName: 'Robert Martinez',
          date: normalizeTimestamp(today),
          time: '09:00',
          duration: 60,
          type: 'Quarterly Review' as const,
          status: 'confirmed' as const,
          priority: 'high' as const,
          location: { type: 'office' as const, details: 'Conference Room A' },
          preparationStatus: 'ready' as const,
          notes: 'Comprehensive portfolio review and strategic planning',
          agenda: ['Portfolio Performance Analysis', 'Market Impact Assessment', 'Strategic Adjustments']
        });
      }
    
    // Add a second meeting if still needed
    if (todaysMeetings.length + additionalMeetings.length < 2) {
      additionalMeetings.push({
        id: `today-additional-${format(today, 'yyyy-MM-dd')}`,
        clientId: 'client-johnson',
        clientName: 'Robert & Patricia Johnson',
        date: normalizeTimestamp(today),
        time: '16:00',
        duration: 45,
        type: 'Client Planning' as const,
        status: 'confirmed' as const,
        priority: 'medium' as const,
        location: { type: 'virtual' as const },
        preparationStatus: 'ready' as const,
        notes: 'Review retirement planning strategy',
        agenda: ['Retirement Goals Review', 'Investment Rebalancing', 'Risk Tolerance Assessment']
      });
    }
  }

  // Add the additional meetings to today's meetings (Robert Martinez meetings first)
  const allTodaysMeetings = [...additionalMeetings, ...todaysMeetings];

  // Convert to ScheduledMeeting format with proper date normalization
  const scheduledMeetings: ScheduledMeeting[] = allTodaysMeetings.map(meeting => {
    // Parse the time string (e.g., "16:00") and combine with meeting date
    const [hours, minutes] = meeting.time.split(':').map(num => parseInt(num, 10));
    const meetingDateTime = new Date(meeting.date);
    meetingDateTime.setHours(hours, minutes, 0, 0);
    
    return {
      id: meeting.id,
      clientId: meeting.clientId,
      clientName: meeting.clientName,
      time: meeting.time,
      duration: meeting.duration,
      type: meeting.type,
      priority: meeting.priority,
      status: meeting.status,
      date: normalizeTimestamp(meetingDateTime), // Use combined date/time
      location: meeting.location,
      preparationStatus: meeting.preparationStatus,
      notes: meeting.notes,
      agenda: meeting.agenda
    };
  });

  const scheduledTasks: ScheduledTask[] = [
    {
      id: 'task-1',
      title: 'Review Q4 market analysis',
      clientId: 'client-chen',
      clientName: 'Linda Chen',
      category: 'analysis',
      priority: 'high',
      estimatedTime: 45,
      dueTime: '11:00'
    },
    {
      id: 'task-2',
      title: 'Prepare client portfolio summaries',
      clientId: 'client-johnson',
      clientName: 'Robert & Patricia Johnson',
      category: 'followup',
      priority: 'medium',
      estimatedTime: 120,
      dueTime: '15:00'
    },
    {
      id: 'task-3',
      title: 'Update compliance documentation',
      clientId: 'client-williams',
      clientName: 'Sarah Williams',
      category: 'compliance',
      priority: 'high',
      estimatedTime: 30,
      dueTime: '16:30'
    },
    {
      id: 'task-4',
      title: 'Call back Jennifer Foster regarding strategy',
      clientId: 'client-foster',
      clientName: 'Jennifer Foster',
      category: 'followup',
      priority: 'high',
      estimatedTime: 25,
      dueTime: '12:30'
    },
    {
      id: 'task-5',
      title: 'Review new client onboarding checklist',
      clientId: 'client-thompson',
      clientName: 'Michael Thompson',
      category: 'preparation',
      priority: 'medium',
      estimatedTime: 35,
      dueTime: '13:45'
    },
    {
      id: 'task-6',
      title: 'Research ESG investment options',
      clientId: 'client-foster',
      clientName: 'Jennifer Foster',
      category: 'analysis',
      priority: 'low',
      estimatedTime: 60,
      dueTime: '17:00'
    },
    {
      id: 'task-7',
      title: 'Send weekly market updates to clients',
      clientId: 'client-miller',
      clientName: 'David Miller',
      category: 'followup',
      priority: 'medium',
      estimatedTime: 40,
      dueTime: '14:15'
    }
  ];

  const scheduledDeadlines: ScheduledDeadline[] = [
    {
      id: 'deadline-1',
      title: 'Monthly client reports',
      clientName: 'All Clients',
      dueDate: normalizeTimestamp(new Date()),
      type: 'regulatory',
      status: 'pending'
    },
    {
      id: 'deadline-2',
      title: 'Regulatory filing submission',
      clientName: 'Compliance',
      dueDate: normalizeTimestamp(addDays(new Date(), 1)),
      type: 'regulatory',
      status: 'pending'
    }
  ];

  const marketData: MarketData = {
    indices: [
      { symbol: 'SPY', name: 'S&P 500', value: 4567.89, change: 1.23, changePercent: 0.27, trend: 'up' },
      { symbol: 'QQQ', name: 'NASDAQ', value: 14234.56, change: -15.67, changePercent: -0.11, trend: 'down' },
      { symbol: 'DIA', name: 'Dow Jones', value: 35678.90, change: 45.23, changePercent: 0.13, trend: 'up' }
    ],
    lastUpdated: normalizeTimestamp(addHours(new Date(), -1)),
    marketSentiment: 'neutral',
    keyNews: [
      {
        id: 'news-1',
        headline: 'Federal Reserve Policy Update',
        summary: 'Fed signals potential rate adjustments in upcoming meetings',
        impact: 'high' as const,
        relevantSectors: ['Banking', 'Real Estate']
      },
      {
        id: 'news-2',
        headline: 'Technology Sector Earnings Strong',
        summary: 'Major tech companies report better than expected quarterly results',
        impact: 'medium' as const,
        relevantSectors: ['Technology']
      },
      {
        id: 'news-3',
        headline: 'Energy Market Volatility',
        summary: 'Oil and gas prices show increased volatility amid global tensions',
        impact: 'medium' as const,
        relevantSectors: ['Energy']
      }
    ],
    clientImpact: [
      {
        clientName: 'Linda Chen',
        reason: 'Tech-heavy portfolio exposure to market volatility',
        estimatedImpact: -2500,
        impactType: 'negative' as const
      },
      {
        clientName: 'Robert & Patricia Johnson',
        reason: 'Conservative bond allocations benefit from rate environment',
        estimatedImpact: 1200,
        impactType: 'positive' as const
      }
    ]
  };

  const alerts: AdvisorAlert[] = [
    {
      id: 'alert-1',
      type: 'market',
      title: 'Tech Sector Volatility',
      priority: 'medium',
      timestamp: normalizeTimestamp(new Date(Date.now() - 2 * 60 * 60 * 1000)),
      clientId: ''
    },
    {
      id: 'alert-2',
      type: 'client',
      title: 'Large Withdrawal Request',
      priority: 'high',
      timestamp: normalizeTimestamp(new Date(Date.now() - 1 * 60 * 60 * 1000)),
      clientId: 'client-sarah'
    },
    {
      id: 'alert-3',
      type: 'compliance',
      title: 'Regulatory Update',
      priority: 'high',
      timestamp: normalizeTimestamp(new Date(Date.now() - 3 * 60 * 60 * 1000)),
      clientId: ''
    },
    {
      id: 'alert-4',
      type: 'client',
      title: 'Portfolio Rebalancing Due',
      priority: 'medium',
      timestamp: normalizeTimestamp(new Date(Date.now() - 4 * 60 * 60 * 1000)),
      clientId: 'client-chen'
    },
    {
      id: 'alert-5',
      type: 'market',
      title: 'Bond Yield Changes',
      priority: 'low',
      timestamp: normalizeTimestamp(new Date(Date.now() - 5 * 60 * 60 * 1000)),
      clientId: ''
    },
    {
      id: 'alert-6',
      type: 'client',
      title: 'New Investment Inquiry',
      priority: 'medium',
      timestamp: normalizeTimestamp(new Date(Date.now() - 30 * 60 * 1000)),
      clientId: 'client-williams'
    },
    {
      id: 'alert-7',
      type: 'compliance',
      title: 'Document Review Required',
      priority: 'high',
      timestamp: normalizeTimestamp(new Date(Date.now() - 6 * 60 * 60 * 1000)),
      clientId: ''
    }
  ];

  const communications: Communication[] = [
    {
      id: 'comm-1',
      clientId: 'client-chen',
      type: 'email',
      fromClient: 'Linda Chen',
      subject: 'Questions about portfolio allocation',
      summary: 'Hi, I wanted to discuss the recent changes to my portfolio allocation and understand...',
      timestamp: normalizeTimestamp(subHours(new Date(), 2)),
      priority: 'medium',
      requiresResponse: true,
      category: 'general'
    },
    {
      id: 'comm-2',
      clientId: 'client-foster',
      type: 'call',
      fromClient: 'Jennifer & Mark Foster',
      subject: 'Return call regarding investment strategy',
      summary: 'Missed call - left voicemail about updating investment strategy for next quarter',
      timestamp: normalizeTimestamp(subHours(new Date(), 4)),
      priority: 'high',
      requiresResponse: true,
      category: 'portfolio'
    },
    {
      id: 'comm-3',
      clientId: 'client-thompson',
      type: 'email',
      fromClient: 'Margaret Thompson',
      subject: 'Thank you for the consultation',
      summary: 'Thanks for the great consultation today. I\'m excited to move forward with...',
      timestamp: normalizeTimestamp(subHours(new Date(), 6)),
      priority: 'low',
      requiresResponse: false,
      category: 'general'
    },
    {
      id: 'comm-4',
      clientId: 'client-williams',
      type: 'email',
      fromClient: 'David & Carol Williams',
      subject: 'Quarterly statement questions',
      summary: 'Could you help clarify some items on our quarterly statement? Specifically the...',
      timestamp: normalizeTimestamp(subHours(new Date(), 1)),
      priority: 'medium',
      requiresResponse: true,
      category: 'portfolio'
    },
    {
      id: 'comm-5',
      clientId: 'client-anderson',
      type: 'call',
      fromClient: 'Lisa Anderson',
      subject: 'Meeting reminder',
      summary: 'Just confirming our 9:30 AM meeting tomorrow. Looking forward to discussing...',
      timestamp: normalizeTimestamp(subHours(new Date(), 3)),
      priority: 'low',
      requiresResponse: false,
      category: 'general'
    },
    {
      id: 'comm-6',
      clientId: 'client-rodriguez',
      type: 'call',
      fromClient: 'Carlos & Elena Rodriguez',
      subject: 'Urgent: Market volatility concerns',
      summary: 'Called about recent market volatility and impact on retirement savings. Please call back.',
      timestamp: normalizeTimestamp(subHours(new Date(), 0.5)),
      priority: 'high',
      requiresResponse: true,
      category: 'portfolio'
    },
    {
      id: 'comm-7',
      clientId: 'client-parker',
      type: 'email',
      fromClient: 'Steven & Julia Parker',
      subject: 'Estate planning consultation request',
      summary: 'We\'d like to schedule a consultation about estate planning and trust options...',
      timestamp: normalizeTimestamp(subHours(new Date(), 8)),
      priority: 'medium',
      requiresResponse: true,
      category: 'general'
    }
  ];

  const quickActions: QuickAction[] = [
    {
      id: 'action-1',
      title: 'Generate Portfolio Reports',
      description: 'Create updated portfolio performance reports for this week\'s meetings',
      category: 'portfolio',
      estimatedTime: 15,
      icon: 'FileText',
      action: 'generate_reports'
    },
    {
      id: 'action-2',
      title: 'Review Market News',
      description: 'Check latest market developments and news that may affect client portfolios',
      category: 'market',
      estimatedTime: 20,
      icon: 'TrendingUp',
      action: 'review_market'
    },
    {
      id: 'action-3',
      title: 'Update Client Notes',
      description: 'Add recent interaction notes to client profiles before today\'s meetings',
      category: 'client',
      estimatedTime: 10,
      icon: 'Edit',
      action: 'update_notes'
    }
  ];


  const dailyHighlights: DailyHighlights = {
    schedule: {
      meetings: scheduledMeetings,
      tasks: scheduledTasks,
      deadlines: scheduledDeadlines
    },
    alerts: alerts,
    upcomingDeadlines: scheduledDeadlines,
    portfolioAlerts: alerts,
    marketData: marketData,
    communications: communications
  };


  return dailyHighlights;
}