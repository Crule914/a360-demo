// @ts-nocheck
export const formatTime = (date: Date | string | number | null | undefined): string => {
  try {
    const validDate = date ? new Date(date) : new Date();
    if (isNaN(validDate.getTime())) {
      return 'Invalid Time';
    }
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(validDate);
  } catch (error) {
    console.warn('formatTime error:', error, 'for date:', date);
    return 'Invalid Time';
  }
};

export const formatDate = (date: Date | string | number | null | undefined): string => {
  try {
    const validDate = date ? new Date(date) : new Date();
    if (isNaN(validDate.getTime())) {
      return 'Invalid Date';
    }
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(validDate);
  } catch (error) {
    console.warn('formatDate error:', error, 'for date:', date);
    return 'Invalid Date';
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

export const formatTimeString = (timeString: string): string => {
  try {
    // If string is empty or null/undefined, return as is
    if (!timeString || typeof timeString !== 'string') {
      return timeString || '';
    }
    
    // Handle both 12-hour (e.g., "9:00 AM") and 24-hour (e.g., "16:00") formats
    if (timeString.includes('AM') || timeString.includes('PM')) {
      // Already in 12-hour format, return as is to prevent duplicate AM/PM
      return timeString.trim();
    }
    
    // Parse 24-hour format (e.g., "16:00")
    const timeParts = timeString.split(':');
    if (timeParts.length < 2) {
      return timeString; // Invalid format, return as is
    }
    
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    
    // Validate hours and minutes
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return timeString; // Invalid time, return as is
    }
    
    // Create a date object to use Intl.DateTimeFormat
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch (error) {
    console.warn('formatTimeString error:', error, 'for timeString:', timeString);
    return timeString; // Return original if parsing fails
  }
};

export const formatLargeNumber = (value: number): string => {
  if (value >= 1000000) {
    const millions = value / 1000000;
    // Use more precise rounding to avoid 1.25 becoming 1.3
    const roundedMillions = Math.round(millions * 100) / 100;
    // Show 2 decimal places if needed, otherwise 1 or none
    if (roundedMillions % 1 === 0) {
      return `${roundedMillions.toFixed(0)}M`;
    } else if (roundedMillions * 10 % 1 === 0) {
      return `${roundedMillions.toFixed(1)}M`;
    } else {
      return `${roundedMillions.toFixed(2)}M`;
    }
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
};

// Extract meaningful title from bullet content
export const extractBulletTitle = (bulletContent: string): string => {
  // Remove common prefixes and clean up the text
  let title = bulletContent
    .replace(/^(Review|Discuss|Consider|Schedule|Update|Maintain|Continue)\s+/i, '')
    .split(':')[0] // Take everything before the first colon
    .split('(')[0] // Remove parenthetical info
    .split('—')[0] // Remove em-dash content
    .split(' - ')[0] // Remove hyphen content
    .trim();

  // Capitalize first letter
  if (title.length > 0) {
    title = title.charAt(0).toUpperCase() + title.slice(1);
  }

  return title || 'Review Item';
};