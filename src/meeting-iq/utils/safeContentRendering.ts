// @ts-nocheck
/**
 * Comprehensive safe content rendering utilities
 */

/**
 * Safely converts any value to a renderable string
 */
export const safeStringify = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  
  if (value instanceof Date) {
    return value.toISOString();
  }
  
  // If it's a React element
  if (typeof value === 'object' && value !== null && 'type' in value) {
    console.warn('⚠️ React element detected in content, converting to [React Element]');
    return '[React Element]';
  }
  
  // If it's an object or array
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return '[Object]';
    }
  }
  
  return String(value);
};

/**
 * Safely renders any content value for display
 */
export const safeRenderContent = (content: unknown): string => {
  if (!content) return '';
  
  if (typeof content === 'string') {
    return content;
  }
  
  console.warn('⚠️ Non-string content detected:', typeof content, content);
  return safeStringify(content);
};

/**
 * Validates that a value is safe to render as React children
 */
export const isSafeForRender = (value: unknown): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return true;
  if (Array.isArray(value)) return value.every(isSafeForRender);
  
  // Check if it's a React element
  if (typeof value === 'object' && value !== null && 'type' in value) {
    return false;
  }
  
  return false;
};

/**
 * Deep sanitizes an object, converting all unsafe values to strings
 */
export const sanitizeForStorage = <T>(obj: T): T => {
  if (obj === null || obj === undefined) return obj;
  
  if (obj instanceof Date) {
    return obj.toISOString() as unknown as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForStorage(item)) as unknown as T;
  }
  
  if (typeof obj === 'object') {
    const sanitized = {} as Record<string, unknown>;
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      sanitized[key] = sanitizeForStorage(value);
    }
    return sanitized as T;
  }
  
  return obj;
};
