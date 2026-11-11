// @ts-nocheck
/**
 * Client data sanitization utilities
 * Ensures Date objects are converted to ISO strings to prevent corruption
 */

import { ClientData } from '@miq/types/advisor';

/**
 * Recursively converts all Date objects to ISO strings
 */
function sanitizeValue(value: any): any {
  if (value instanceof Date) {
    return value.toISOString();
  }
  
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  
  if (value && typeof value === 'object') {
    const sanitized: any = {};
    for (const [key, val] of Object.entries(value)) {
      sanitized[key] = sanitizeValue(val);
    }
    return sanitized;
  }
  
  return value;
}

/**
 * Sanitizes client data to ensure no raw Date objects exist
 */
export function sanitizeClientData<T extends Partial<ClientData>>(client: T): T {
  if (!client) return client;
  
  return sanitizeValue(client) as T;
}

/**
 * Validates that client data doesn't contain raw Date objects
 */
export function validateClientData(client: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  function checkForDates(obj: any, path: string = ''): void {
    if (obj instanceof Date) {
      errors.push(`Raw Date object found at: ${path}`);
      return;
    }
    
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => checkForDates(item, `${path}[${index}]`));
      return;
    }
    
    if (obj && typeof obj === 'object') {
      for (const [key, value] of Object.entries(obj)) {
        checkForDates(value, path ? `${path}.${key}` : key);
      }
    }
  }
  
  checkForDates(client);
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
