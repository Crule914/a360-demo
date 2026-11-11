// @ts-nocheck
/**
 * Utility to detect and prevent JSX elements from being stored in data
 */

/**
 * Checks if a value is a React element or JSX element
 * CRITICAL: This must catch ALL possible React element signatures
 */
export const isReactElement = (value: any): boolean => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  
  // Check for React element signatures (comprehensive)
  return (
    '$$typeof' in value || // React.createElement signature
    ('type' in value && 'props' in value && 'key' in value) || // JSX element signature
    ('type' in value && 'props' in value && 'ref' in value) || // Full JSX signature
    ('_owner' in value && '_store' in value) || // React internal fields
    (value.$$typeof && String(value.$$typeof).includes('react')) || // React symbol check
    (typeof value.type === 'function' && 'props' in value) || // Function component element
    (typeof value.type === 'string' && 'props' in value) // DOM element
  );
};

/**
 * Deep sanitizes an object to remove all React elements
 */
export const sanitizeFromJSX = <T>(obj: T, path: string = 'root'): T => {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  // Check if this is a React element
  if (isReactElement(obj)) {
    console.error(`🚨 JSX element detected at ${path}, removing to prevent corruption`);
    return undefined as any;
  }
  
  // Handle Date objects
  if (obj instanceof Date) {
    console.warn(`⚠️ Date object at ${path}, converting to ISO string`);
    return obj.toISOString() as any;
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj
      .map((item, idx) => sanitizeFromJSX(item, `${path}[${idx}]`))
      .filter((item) => item !== undefined) as any;
  }
  
  // Handle plain objects
  if (typeof obj === 'object' && obj.constructor === Object) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const sanitizedValue = sanitizeFromJSX(value, `${path}.${key}`);
      if (sanitizedValue !== undefined) {
        sanitized[key] = sanitizedValue;
      }
    }
    return sanitized;
  }
  
  return obj;
};

/**
 * Validates that data is safe to store (no JSX elements)
 */
export const validateDataForStorage = (data: any, context: string = 'unknown'): boolean => {
  const hasJSX = findJSXElements(data);
  if (hasJSX.length > 0) {
    console.error(`🚨 ${context}: Found JSX elements at paths:`, hasJSX);
    return false;
  }
  return true;
};

/**
 * Recursively finds all paths containing JSX elements
 */
const findJSXElements = (obj: any, path: string = 'root'): string[] => {
  if (obj === null || obj === undefined) {
    return [];
  }
  
  if (isReactElement(obj)) {
    return [path];
  }
  
  if (Array.isArray(obj)) {
    return obj.flatMap((item, idx) => findJSXElements(item, `${path}[${idx}]`));
  }
  
  if (typeof obj === 'object' && obj.constructor === Object) {
    return Object.entries(obj).flatMap(([key, value]) => 
      findJSXElements(value, `${path}.${key}`)
    );
  }
  
  return [];
};
