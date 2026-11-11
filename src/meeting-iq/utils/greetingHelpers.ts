// @ts-nocheck
import { format } from 'date-fns';

export const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return 'Good morning';
  } else if (hour < 17) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
};

export const getUserName = (): string => {
  // Get user from userContext
  return 'John';
};

export const createInitialGreeting = (): string => {
  return `${getTimeBasedGreeting()}, ${getUserName()}! Ready to tackle your day?`;
};

export const createLandingGreeting = (
  todayCount: number,
  upcomingCount: number,
  todayMeetings: any[],
  busiestDay?: { date: Date; meetings: any[] }
): string => {
  const greeting = `${getTimeBasedGreeting()}, ${getUserName()}!`;

  const formatMeetingLine = (m: any) => {
    const details: string[] = [];
    if (m.location?.type === 'virtual') details.push('Virtual');
    else if (m.location?.type === 'office') details.push('Office');
    if (m.agenda?.length) details.push(m.agenda.slice(0, 2).join(', '));

    const label = `${m.time} - ${m.clientName}`;
    // Custom scheme handled in ChatMessage (routes to meeting prep)
    const linkedLabel = m.clientId && m.id ? `[${label}](meeting:${m.clientId}:${m.id})` : label;
    return `• ${linkedLabel}${details.length ? '\n  ' + details.join(' • ') : ''}`;
  };
  
  if (todayCount > 0) {
    const meetingList = todayMeetings.slice(0, 3).map(formatMeetingLine).join('\n');
    return `${greeting}\n\nYou have ${todayCount} meeting${todayCount !== 1 ? 's' : ''} today. Here's what to focus on:\n\n${meetingList}`;
  }
  
  if (busiestDay && busiestDay.meetings.length >= 2) {
    const dayName = format(busiestDay.date, 'EEEE');
    const meetingList = busiestDay.meetings.slice(0, 3).map(formatMeetingLine).join('\n');
    return `${greeting}\n\nNo meetings today, but ${dayName} looks busy with ${busiestDay.meetings.length} meetings:\n\n${meetingList}`;
  }
  
  if (upcomingCount > 0) {
    return `${greeting}\n\nYou have ${upcomingCount} meeting${upcomingCount !== 1 ? 's' : ''} scheduled this week. Ready to prepare?`;
  }
  
  return `${greeting}\n\nNo meetings scheduled for today. A great day to focus on planning and priorities!`;
};
