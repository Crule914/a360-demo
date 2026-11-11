// @ts-nocheck
import { ClientData } from '../types/advisor';
import { format } from 'date-fns';

export interface MeetingPrepIntroData {
  message: string;
  quickReplies?: string[];
}

export const generateMeetingPrepIntro = (client: ClientData): MeetingPrepIntroData => {
  const currentTime = new Date();
  const timeOfDay = currentTime.getHours() < 12 ? 'morning' : currentTime.getHours() < 17 ? 'afternoon' : 'evening';
  
  // Extract client-specific data
  const portfolioValue = (client.householdAssets / 1000000).toFixed(2);
  const meetingType = client.nextMeetingDetails?.type || 'review';
  const meetingTime = client.nextMeetingDetails?.time || '2:00 PM';
  const meetingLocation = client.nextMeetingDetails?.location || 'Conference Room B';
  
  // Performance data (using actual client keyMetrics)
  const ytdReturn = client.keyMetrics?.yearToDateReturn || 8.4;
  const benchmarkOutperformance = client.keyMetrics?.benchmarkComparison || 1.2;
  
  // Children data for personalization
  const childrenInfo = client.children?.length > 0 
    ? client.children.map(child => `${child.name} (${child.age})`).join(' and ')
    : null;

  // Build personalized message
  let message = `Good ${timeOfDay}, John! I've prepared ${client.name}'s ${meetingType} briefing. `;
  
  // Portfolio performance
  message += `${client.name.split(' ')[0]}'s portfolio ($${portfolioValue}M) is performing well at +${ytdReturn}% YTD, outperforming the benchmark by +${benchmarkOutperformance}%. `;
  
  // Meeting details
  message += `Your ${meetingTime} ${meetingType} session covers quarterly review, rebalancing assessment`;
  
  // Add family context if available
  if (childrenInfo) {
    message += `, and college funding progress for ${childrenInfo}`;
  }
  
  message += `. All preparation materials are ready - review the agenda and key metrics below.`;

  const quickReplies = [
    'Review Last Meeting Summary',
    'View Goals Analysis',
    'Check portfolio performance'
  ];

  return {
    message,
    quickReplies
  };
};

const calculateAge = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};