// @ts-nocheck
import { isWeekend, addDays } from 'date-fns';
import { EnhancedMeetingData } from '../components/canvas/MeetingCard';

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

export const getMockMeetingData = (): EnhancedMeetingData[] => {
  const today = new Date();
  
  // Skip weekends - return empty array if today is weekend
  if (isWeekend(today)) {
    return [];
  }
  
  // Get only workdays for meeting dates
  const tomorrow = getNextWorkday(today, 1);
  const dayAfterTomorrow = getNextWorkday(today, 2);
  const thursday = getNextWorkday(today, 3);
  const friday = getNextWorkday(today, 4);
  const nextMonday = getNextWorkday(today, 5);
  
  return [
    // Today's meetings
    {
      id: 'meeting-sweets-family',
      clientId: 'client-sweets-family',
      clientName: 'The Sweets Family',
      date: today,
      time: '5:30 PM',
      duration: 60,
      type: 'Annual Review',
      title: 'Annual Review',
      status: 'confirmed',
      priority: 'high',
      location: {
        type: 'office',
        details: 'Conference Room A'
      },
      preparationStatus: 'ready',
      agenda: [
        'Household Financial Plan Review — The Sweets Family',
        'Retirement Timeline & Income Strategy',
        'Schwab Portfolio Performance & Rebalancing',
        'Estate Planning & Beneficiary Updates'
      ]
    },
    {
      id: 'meeting-robert-martinez',
      clientId: 'client-robert-martinez',
      clientName: 'Robert Martinez',
      date: tomorrow,
      time: '9:00 AM',
      duration: 60,
      type: 'Annual Review',
      title: 'Annual Review',
      status: 'confirmed',
      priority: 'medium',
      location: {
        type: 'virtual',
        details: 'Zoom Meeting'
      },
      preparationStatus: 'ready',
      agenda: [
        'Estate Planning Documentation Review',
        'Trust Structure Optimization',
        'Beneficiary Designation Updates',
        'Tax Minimization Strategies'
      ]
    },
    {
      id: 'meeting-linda-chen',
      clientId: 'client-linda-chen',
      clientName: 'Linda Chen',
      date: tomorrow,
      time: '2:30 PM',
      duration: 60,
      type: 'Bi-Annual Review',
      title: 'Annual Review',
      status: 'confirmed',
      priority: 'high',
      location: {
        type: 'office',
        details: 'Conference Room B'
      },
      preparationStatus: 'ready',
      agenda: [
        'Retirement Income Planning',
        'Social Security Optimization',
        'Healthcare Cost Planning',
        'Legacy Planning Discussion'
      ]
    },
    {
      id: 'meeting-david-carol-williams',
      clientId: 'client-david-carol-williams',
      clientName: 'David & Carol Williams',
      date: tomorrow,
      time: '4:00 PM',
      duration: 60,
      type: 'Annual Review',
      title: 'Annual Review',
      status: 'confirmed',
      priority: 'high',
      location: {
        type: 'office',
        details: 'Conference Room A'
      },
      preparationStatus: 'ready',
      agenda: [
        'Annual Investment Performance Review',
        'Asset Allocation Rebalancing',
        'Tax Planning for High Net Worth',
        'Estate Planning Updates'
      ]
    },
    {
      id: 'meeting-lisa-anderson-today',
      clientId: 'client-lisa-anderson',
      clientName: 'Lisa Anderson',
      date: dayAfterTomorrow,
      time: '5:30 PM',
      duration: 60,
      type: 'Client Planning',
      title: 'Insurance Review Session',
      status: 'confirmed',
      priority: 'medium',
      location: {
        type: 'virtual',
        details: 'Zoom Meeting'
      },
      preparationStatus: 'in_progress',
      agenda: [
        'Life Insurance Needs Analysis',
        'Disability Insurance Review',
        'Long-Term Care Planning',
        'Beneficiary Updates'
      ]
    },
    // Tomorrow's meetings
    {
      id: 'meeting-david-thompson',
      clientId: 'client-david-thompson',
      clientName: 'David Thompson',
      date: tomorrow,
      time: '10:00 AM',
      duration: 60,
      type: 'Quarterly Review',
      title: 'Q1 Portfolio Review',
      status: 'confirmed',
      priority: 'medium',
      location: {
        type: 'office',
        details: 'Conference Room C'
      },
      preparationStatus: 'needs_attention',
      agenda: [
        'Portfolio Rebalancing Review',
        'Market Outlook Discussion',
        'Risk Assessment Update',
        'Investment Recommendations'
      ]
    },
    {
      id: 'meeting-maria-gonzalez',
      clientId: 'client-maria-gonzalez',
      clientName: 'Maria Gonzalez',
      date: tomorrow,
      time: '1:00 PM',
      duration: 60,
      type: 'Annual Review',
      title: 'Home Purchase Planning',
      status: 'confirmed',
      priority: 'high',
      location: {
        type: 'virtual',
        details: 'Teams Meeting'
      },
      preparationStatus: 'ready',
      agenda: [
        'First-Time Home Buyer Strategy',
        'Mortgage Pre-Approval Process',
        'Down Payment Planning',
        'Credit Score Optimization'
      ]
    },
    {
      id: 'meeting-amanda-brown',
      clientId: 'client-amanda-brown',
      clientName: 'Amanda Brown',
      date: tomorrow,
      time: '3:30 PM',
      duration: 60,
      type: 'Bi-Annual Review',
      title: 'Tax Planning Strategy',
      status: 'confirmed',
      priority: 'high',
      location: {
        type: 'office',
        details: 'Conference Room B'
      },
      preparationStatus: 'needs_attention',
      agenda: [
        'Year-End Tax Planning',
        'Roth IRA Conversion Strategy',
        'Capital Gains Management',
        'Charitable Giving Optimization'
      ]
    },
    // Day after tomorrow's meetings
    {
      id: 'meeting-james-wilson',
      clientId: 'client-james-wilson',
      clientName: 'James Wilson',
      date: dayAfterTomorrow,
      time: '9:30 AM',
      duration: 60,
      type: 'Client Planning',
      title: 'Business Succession Planning',
      status: 'confirmed',
      priority: 'high',
      location: {
        type: 'office',
        details: 'Conference Room A'
      },
      preparationStatus: 'in_progress',
      agenda: [
        'Business Succession Planning',
        'Key Employee Insurance Review',
        'Exit Strategy Development',
        'Tax Efficiency Planning'
      ]
    },
    {
      id: 'meeting-margaret-thompson',
      clientId: 'client-margaret-thompson',
      clientName: 'Margaret Thompson',
      date: dayAfterTomorrow,
      time: '3:00 PM',
      duration: 60,
      type: 'Quarterly Review',
      title: 'Estate Planning Review',
      status: 'confirmed',
      priority: 'medium',
      location: {
        type: 'virtual',
        details: 'Zoom Meeting'
      },
      preparationStatus: 'ready',
      agenda: [
        'Quarterly Performance Review',
        'Asset Allocation Adjustment',
        'Fee Structure Discussion',
        'Goal Progress Assessment'
      ]
    },
    {
      id: 'meeting-patricia-davis',
      clientId: 'client-patricia-davis',
      clientName: 'Patricia Davis',
      date: dayAfterTomorrow,
      time: '11:00 AM',
      duration: 60,
      type: 'Quarterly Review',
      title: 'Quarterly Performance Review',
      status: 'confirmed',
      priority: 'medium',
      location: {
        type: 'virtual',
        details: 'Teams Meeting'
      },
      preparationStatus: 'ready',
      agenda: [
        'Trust Document Updates',
        'Power of Attorney Review',
        'Healthcare Directive Planning',
        'Inheritance Tax Strategy'
      ]
    },
    // Thursday's meetings
    {
      id: 'meeting-michael-brown',
      clientId: 'client-michael-brown',
      clientName: 'Michael Brown',
      date: thursday,
      time: '11:00 AM',
      duration: 60,
      type: 'Bi-Annual Review',
      title: 'College Funding Strategy',
      status: 'confirmed',
      priority: 'high',
      location: {
        type: 'office',
        details: 'Conference Room B'
      },
      preparationStatus: 'needs_attention',
      agenda: [
        'College Funding Strategy',
        '529 Plan Optimization',
        'Education Tax Credits',
        'Timeline Planning'
      ]
    },
    {
      id: 'meeting-carlos-elena-rodriguez',
      clientId: 'client-carlos-elena-rodriguez', 
      clientName: 'Carlos & Elena Rodriguez',
      date: thursday,
      time: '2:00 PM',
      duration: 60,
      type: 'Client Planning',
      title: 'Retirement Income Strategy',
      status: 'confirmed',
      priority: 'high',
      location: {
        type: 'office',
        details: 'Conference Room C'
      },
      preparationStatus: 'in_progress',
      agenda: [
        'Pre-Retirement Income Planning',
        '401(k) Rollover Strategy',
        'Social Security Timing',
        'Healthcare Transition Planning'
      ]
    },
    // Friday's meetings
    {
      id: 'meeting-jennifer-taylor',
      clientId: 'client-jennifer-taylor',
      clientName: 'Jennifer Taylor',
      date: friday,
      time: '10:30 AM',
      duration: 60,
      type: 'Annual Review',
      title: 'Divorce Financial Planning',
      status: 'confirmed',
      priority: 'medium',
      location: {
        type: 'virtual',
        details: 'Teams Meeting'
      },
      preparationStatus: 'ready',
      agenda: [
        'Divorce Financial Planning',
        'Asset Division Strategy',
        'Alimony Tax Implications',
        'Independent Financial Plan'
      ]
    },
    {
      id: 'meeting-william-anderson',
      clientId: 'client-william-anderson',
      clientName: 'William Anderson',
      date: friday,
      time: '2:00 PM',
      duration: 60,
      type: 'Annual Review',
      title: 'Annual Financial Review',
      status: 'confirmed',
      priority: 'high',
      location: {
        type: 'office',
        details: 'Conference Room C'
      },
      preparationStatus: 'in_progress',
      agenda: [
        'Annual Financial Review',
        'Investment Performance Analysis',
        'Risk Tolerance Assessment',
        'Strategic Planning Session'
      ]
    },
    {
      id: 'meeting-steven-julia-parker',
      clientId: 'client-steven-julia-parker',
      clientName: 'Steven & Julia Parker',
      date: friday,
      time: '4:30 PM',
      duration: 60,
      type: 'Quarterly Review',
      title: 'Portfolio Rebalancing Review',
      status: 'confirmed',
      priority: 'medium',
      location: {
        type: 'virtual',
        details: 'Zoom Meeting'
      },
      preparationStatus: 'ready',
      agenda: [
        'Asset Allocation Review',
        'Risk Tolerance Assessment',
        'Performance Attribution Analysis',
        'Investment Policy Updates'
      ]
    },
    // Next week preview
    {
      id: 'meeting-lisa-anderson-monday',
      clientId: 'client-lisa-anderson',
      clientName: 'Lisa Anderson',
      date: nextMonday,
      time: '9:00 AM',
      duration: 60,
      type: 'Annual Review',
      title: 'Comprehensive Financial Plan Update',
      status: 'confirmed',
      priority: 'high',
      location: {
        type: 'office',
        details: 'Conference Room A'
      },
      preparationStatus: 'needs_attention',
      agenda: [
        'Annual Financial Plan Review',
        'Goal Progress Assessment',
        'Investment Strategy Refinement',
        'Cash Flow Planning'
      ]
    }
  ];
};