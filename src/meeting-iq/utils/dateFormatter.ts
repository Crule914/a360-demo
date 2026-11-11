// @ts-nocheck
/**
 * Safe date formatting utilities that always return strings
 * Prevents React rendering errors from Date objects
 */

/**
 * Safely formats a date to locale date string
 */
export const formatDateSafe = (date: Date = new Date()): string => {
  try {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return new Date().toLocaleDateString();
    }
    return date.toLocaleDateString();
  } catch (error) {
    console.error('formatDateSafe error:', error);
    return new Date().toLocaleDateString();
  }
};

/**
 * Safely formats a date to locale time string
 */
export const formatTimeSafe = (date: Date = new Date()): string => {
  try {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    console.error('formatTimeSafe error:', error);
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
};

/**
 * Safely formats a date to both locale date and time string
 */
export const formatDateTimeSafe = (date: Date = new Date()): { date: string; time: string } => {
  return {
    date: formatDateSafe(date),
    time: formatTimeSafe(date)
  };
};

/**
 * Get current date string for display
 */
export const getCurrentDateString = (): string => {
  return formatDateSafe(new Date());
};

/**
 * Get current time string for display
 */
export const getCurrentTimeString = (): string => {
  return formatTimeSafe(new Date());
};
