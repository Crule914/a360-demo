// @ts-nocheck
/**
 * Utility functions for normalizing date/timestamp data structures
 * Handles various date formats that may come from serialization or mock data
 */

export interface SerializedDate {
  _type: 'Date';
  value: {
    iso: string;
    value: number;
    local: string;
  };
}

/**
 * Normalizes timestamp data to a proper Date object
 * Handles various input formats including serialized date objects
 */
export const normalizeTimestamp = (timestamp: any): Date => {
  // Already a valid Date object
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  // Handle serialized date structure from mock data or API
  if (timestamp && typeof timestamp === 'object' && timestamp._type === 'Date') {
    if (timestamp.value && timestamp.value.value) {
      return new Date(timestamp.value.value);
    }
    if (timestamp.value && timestamp.value.iso) {
      return new Date(timestamp.value.iso);
    }
  }
  
  // Handle string or number timestamps
  if (typeof timestamp === 'string' || typeof timestamp === 'number') {
    const date = new Date(timestamp);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  
  // Fallback to current date if all else fails
  console.warn('Invalid timestamp provided, falling back to current date:', timestamp);
  return new Date();
};

/**
 * Normalizes an object's timestamp properties recursively
 */
export const normalizeObjectTimestamps = <T extends Record<string, any>>(obj: T): T => {
  const normalized = { ...obj } as any;
  
  for (const [key, value] of Object.entries(normalized)) {
    if (key === 'timestamp' || key === 'date' || key.includes('Date') || key.includes('Time')) {
      normalized[key] = normalizeTimestamp(value);
    } else if (Array.isArray(value)) {
      normalized[key] = value.map(item => 
        typeof item === 'object' && item !== null 
          ? normalizeObjectTimestamps(item)
          : item
      );
    } else if (typeof value === 'object' && value !== null) {
      normalized[key] = normalizeObjectTimestamps(value);
    }
  }
  
  return normalized as T;
};

/**
 * Validates that a value is a proper Date object
 */
export const isValidDate = (date: any): date is Date => {
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Safely formats a timestamp with fallback handling
 */
export const safeFormatTimestamp = (timestamp: any): string => {
  const normalizedDate = normalizeTimestamp(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - normalizedDate.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return diffMinutes <= 0 ? 'Just now' : `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else {
    return `${diffDays} days ago`;
  }
};