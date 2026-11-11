// @ts-nocheck
/**
 * Safe rendering utilities to prevent Date objects from being rendered directly in JSX
 */

import { formatTime, formatDate } from './formatters';
import { isValidDate } from './dateValidation';

/**
 * Safely renders any value, converting Date objects to strings
 */
export const safeRender = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (value instanceof Date) {
    return isValidDate(value) ? value.toISOString() : 'Invalid Date';
  }
  
  if (typeof value === 'object') {
    return '[Object]';
  }
  
  return String(value);
};

/**
 * Safely formats a date for time display
 */
export const safeFormatTime = (date: unknown): string => {
  if (date instanceof Date && isValidDate(date)) {
    return formatTime(date);
  }
  
  if (typeof date === 'string' || typeof date === 'number') {
    const parsedDate = new Date(date);
    if (isValidDate(parsedDate)) {
      return formatTime(parsedDate);
    }
  }
  
  return String(date || '');
};

/**
 * Safely formats a date for date display
 */
export const safeFormatDate = (date: unknown): string => {
  if (date instanceof Date && isValidDate(date)) {
    return formatDate(date);
  }
  
  if (typeof date === 'string' || typeof date === 'number') {
    const parsedDate = new Date(date);
    if (isValidDate(parsedDate)) {
      return formatDate(parsedDate);
    }
  }
  
  return String(date || '');
};

/**
 * Safely extracts display values from objects, converting Date objects to strings
 */
export const safeExtractDisplayValue = (obj: Record<string, unknown>, key: string): string => {
  const value = obj[key];
  return safeRender(value);
};

/**
 * Deep sanitizes an object by converting all Date objects to ISO strings
 */
export const sanitizeForRendering = <T>(obj: T): T => {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (obj instanceof Date) {
    return isValidDate(obj) ? (obj.toISOString() as unknown as T) : ('Invalid Date' as unknown as T);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForRendering(item)) as unknown as T;
  }
  
  if (typeof obj === 'object') {
    const sanitized = {} as Record<string, unknown>;
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      sanitized[key] = sanitizeForRendering(value);
    }
    return sanitized as T;
  }
  
  return obj;
};