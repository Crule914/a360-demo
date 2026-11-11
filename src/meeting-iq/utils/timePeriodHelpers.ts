// @ts-nocheck
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, addWeeks, addMonths } from 'date-fns';
import type { HouseholdTimePeriod } from '@miq/components/canvas/HouseholdTimePeriodFilter';

export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Get the date range for a given time period
 */
export function getDateRangeForPeriod(period: HouseholdTimePeriod): DateRange {
  const now = new Date();
  
  switch (period) {
    case 'this_week':
      return {
        start: startOfWeek(now, { weekStartsOn: 1 }), // Monday
        end: endOfWeek(now, { weekStartsOn: 1 }), // Sunday
      };
    case 'next_week':
      const nextWeekStart = addWeeks(startOfWeek(now, { weekStartsOn: 1 }), 1);
      return {
        start: nextWeekStart,
        end: endOfWeek(nextWeekStart, { weekStartsOn: 1 }),
      };
    case 'this_month':
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      };
    case 'next_month':
      const nextMonth = addMonths(now, 1);
      return {
        start: startOfMonth(nextMonth),
        end: endOfMonth(nextMonth),
      };
    case 'this_quarter':
      return {
        start: startOfQuarter(now),
        end: endOfQuarter(now),
      };
    default:
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      };
  }
}

/**
 * Check if a date falls within a date range
 */
export function isDateInRange(date: Date, range: DateRange): boolean {
  return date >= range.start && date <= range.end;
}

/**
 * Check if a date string falls within a time period
 */
export function isDateInPeriod(dateStr: string | undefined, period: HouseholdTimePeriod): boolean {
  if (!dateStr) return false;
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return false;
    
    const range = getDateRangeForPeriod(period);
    return isDateInRange(date, range);
  } catch {
    return false;
  }
}
