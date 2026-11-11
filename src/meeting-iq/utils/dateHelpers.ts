// @ts-nocheck
import { startOfWeek, endOfWeek, format, addDays, isSameDay, isWeekend } from 'date-fns';

export interface WorkWeekRange {
  start: Date;
  end: Date;
  label: string;
}

/**
 * Gets the work week range (Monday-Friday) for a given date
 */
export function getWorkWeekRange(date: Date = new Date()): WorkWeekRange {
  // Get Monday (start of work week)
  const start = startOfWeek(date, { weekStartsOn: 1 });
  // Get Friday (end of work week)
  const end = addDays(start, 4);
  
  const startLabel = format(start, 'MMM d');
  const endLabel = format(end, 'd, yyyy');
  const label = `Week of ${startLabel}-${endLabel}`;
  
  return { start, end, label };
}

/**
 * Gets the current or next work week based on today's date
 * If today is Saturday/Sunday, returns the upcoming work week
 */
export function getCurrentWorkWeek(): WorkWeekRange {
  const today = new Date();
  
  if (isWeekend(today)) {
    // If it's weekend, get next Monday's work week
    const nextMonday = addDays(today, 8 - today.getDay());
    return getWorkWeekRange(nextMonday);
  }
  
  return getWorkWeekRange(today);
}

/**
 * Gets the previous work week
 */
export function getPreviousWorkWeek(currentWeekStart: Date): WorkWeekRange {
  const previousWeekStart = addDays(currentWeekStart, -7);
  return getWorkWeekRange(previousWeekStart);
}

/**
 * Gets the next work week
 */
export function getNextWorkWeek(currentWeekStart: Date): WorkWeekRange {
  const nextWeekStart = addDays(currentWeekStart, 7);
  return getWorkWeekRange(nextWeekStart);
}

/**
 * Checks if a date falls within a work week range
 */
export function isDateInWorkWeek(date: Date, workWeek: WorkWeekRange): boolean {
  return date >= workWeek.start && date <= workWeek.end;
}

/**
 * Gets all work days (Monday-Friday) for a given work week
 */
export function getWorkDays(workWeek: WorkWeekRange): Date[] {
  const days: Date[] = [];
  for (let i = 0; i < 5; i++) {
    days.push(addDays(workWeek.start, i));
  }
  return days;
}

/**
 * Checks if today is a work day and returns appropriate messaging
 */
/**
 * Validates if a value is a valid date
 */
export function isValidDate(date: any): boolean {
  if (!date) return false;
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
}

/**
 * Safely parses a date input, returning null if invalid
 */
export function safeParseDate(dateInput: any): Date | null {
  if (!dateInput) return null;
  
  try {
    const parsed = new Date(dateInput);
    return isNaN(parsed.getTime()) ? null : parsed;
  } catch (error) {
    console.warn('Date parsing error:', error);
    return null;
  }
}

/**
 * Filters appointments for a specific date range with error handling
 */
export function getAppointmentsForDateRange(appointments: any[], range: WorkWeekRange): any[] {
  if (!appointments || !Array.isArray(appointments)) {
    console.warn('Invalid appointments array provided to date filter');
    return [];
  }

  return appointments.filter(apt => {
    if (!apt.date) {
      console.warn('Appointment missing date field:', apt.id);
      return false;
    }

    const aptDate = safeParseDate(apt.date);
    if (!aptDate) {
      console.warn('Invalid appointment date:', apt.date, 'for appointment:', apt.id);
      return false;
    }

    return isDateInWorkWeek(aptDate, range);
  });
}

/**
 * Filters appointments for a specific day with error handling
 */
export function getAppointmentsForDay(appointments: any[], targetDate: Date): any[] {
  if (!appointments || !Array.isArray(appointments)) {
    console.warn('Invalid appointments array provided to day filter');
    return [];
  }

  return appointments.filter(apt => {
    if (!apt.date) {
      console.warn('Appointment missing date field:', apt.id);
      return false;
    }

    const aptDate = safeParseDate(apt.date);
    if (!aptDate) {
      console.warn('Invalid appointment date:', apt.date, 'for appointment:', apt.id);
      return false;
    }

    return isSameDay(aptDate, targetDate);
  });
}

/**
 * Checks if today is a work day and returns appropriate messaging
 */
export function getWorkDayStatus(): {
  isWorkDay: boolean;
  message: string;
  nextWorkDay?: Date;
} {
  const today = new Date();
  
  if (isWeekend(today)) {
    const nextMonday = addDays(today, 8 - today.getDay());
    return {
      isWorkDay: false,
      message: "No meetings scheduled for weekends",
      nextWorkDay: nextMonday
    };
  }
  
  return {
    isWorkDay: true,
    message: "Today's schedule"
  };
}

/**
 * Get current and next work week days for calendar navigation
 */
export function getWorkWeekDays(): { 
  currentDay: { date: Date; label: string } | null; 
  nextDay: { date: Date; label: string }; 
} {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Weekend logic - show None for today, Monday for next
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    const nextMonday = addDays(today, 8 - dayOfWeek);
    
    return {
      currentDay: null,
      nextDay: { date: nextMonday, label: 'Monday' }
    };
  }
  
  // Friday logic - show Today, next is Monday
  if (dayOfWeek === 5) {
    const nextMonday = addDays(today, 3); // Friday + 3 = Monday
    
    return {
      currentDay: { date: today, label: 'Today' },
      nextDay: { date: nextMonday, label: 'Monday' }
    };
  }
  
  // Monday-Thursday logic - show Today, next is tomorrow
  const tomorrow = addDays(today, 1);
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const tomorrowLabel = dayNames[tomorrow.getDay()];
  
  return {
    currentDay: { date: today, label: 'Today' },
    nextDay: { date: tomorrow, label: tomorrowLabel }
  };
}