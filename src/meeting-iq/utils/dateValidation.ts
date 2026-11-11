// @ts-nocheck
import { isValid, parseISO } from 'date-fns';

/**
 * Validates if a date is a valid Date object
 */
export function isValidDate(date: any): date is Date {
  return date instanceof Date && isValid(date) && !isNaN(date.getTime());
}

/**
 * Safely converts various date inputs to a valid Date object
 */
export function ensureValidDate(input: any, fallback?: Date): Date {
  // If it's already a valid Date object
  if (isValidDate(input)) {
    return input;
  }
  
  // Try to parse string dates
  if (typeof input === 'string') {
    try {
      const parsed = parseISO(input);
      if (isValidDate(parsed)) {
        return parsed;
      }
      
      // Fallback to Date constructor
      const constructorDate = new Date(input);
      if (isValidDate(constructorDate)) {
        return constructorDate;
      }
    } catch (error) {
      console.warn('Failed to parse date string:', input, error);
    }
  }
  
  // Try numeric timestamps
  if (typeof input === 'number') {
    const date = new Date(input);
    if (isValidDate(date)) {
      return date;
    }
  }
  
  // Return fallback or current date
  const result = fallback || new Date();
  console.warn(`Invalid date input "${input}", using fallback:`, result);
  return result;
}

/**
 * Validates an array of objects with date properties
 */
export function validateDatesInArray<T extends { date: any }>(
  items: T[], 
  fallbackDate?: Date
): T[] {
  return items.map(item => ({
    ...item,
    date: ensureValidDate(item.date, fallbackDate)
  }));
}

/**
 * Logs date validation details for debugging
 */
export function logDateValidation(label: string, date: any): void {
  console.log(`🔍 Date validation for ${label}:`, {
    value: date,
    type: typeof date,
    isDate: date instanceof Date,
    isValid: isValidDate(date),
    toString: date?.toString?.(),
    getTime: isValidDate(date) ? date.getTime() : 'N/A'
  });
}