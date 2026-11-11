// @ts-nocheck
/**
 * Comprehensive localStorage recovery and cleanup utilities
 */

const STORAGE_VERSION = '1.0.0';
const STORAGE_VERSION_KEY = 'advisor-storage-version';

/**
 * Detects if an object contains serialized Date objects that appear as {}
 */
const containsCorruptedDates = (obj: any): boolean => {
  if (!obj || typeof obj !== 'object') return false;
  
  try {
    const str = JSON.stringify(obj);
    // Look for patterns that indicate corrupted Date objects
    // Serialized dates often appear as empty objects: {}
    return str.includes('"date":{}') || 
           str.includes('"timestamp":{}') ||
           str.includes('"processingStarted":{}') ||
           str.includes('"meetingDate":{}') ||
           str.includes('"lastMeeting":{}') ||
           str.includes('"birthDate":{}');
  } catch {
    return true; // If we can't stringify, it's corrupted
  }
};

/**
 * Clears all potentially corrupted localStorage data
 */
export const clearCorruptedStorage = (): void => {
  console.log('🧹 storageRecovery: Clearing potentially corrupted localStorage data');
  
  const keysToCheck = [
    'advisor-conversations',
    'sample-conversation-initialized',
    'advisor-canvas-state',
    'advisor-canvas-items',
    'advisor-messages',
    'advisor-files',
    'advisor-documents',
    'meeting-prep-chat-title',
    'meeting-prep-agenda',
    'meeting-prep-client-data',
    'agenda-sections-client-robert-martinez',
    'agenda-bullets-client-robert-martinez',
    'agenda-talking-points-client-robert-martinez'
  ];
  
  keysToCheck.forEach(key => {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        if (containsCorruptedDates(parsed)) {
          console.warn(`⚠️ storageRecovery: Removing corrupted data from ${key}`);
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.warn(`⚠️ storageRecovery: Error checking ${key}, removing it:`, error);
      localStorage.removeItem(key);
    }
  });
};

/**
 * Performs comprehensive startup validation and cleanup
 */
export const validateAndCleanStorage = (): { cleaned: boolean; errors: string[] } => {
  console.log('🔍 storageRecovery: Validating localStorage data...');
  
  const errors: string[] = [];
  let cleaned = false;
  
  try {
    // Check storage version
    const currentVersion = localStorage.getItem(STORAGE_VERSION_KEY);
    if (currentVersion !== STORAGE_VERSION) {
      console.warn(`⚠️ storageRecovery: Storage version mismatch (${currentVersion} vs ${STORAGE_VERSION}), clearing all data`);
      clearAllAppStorage();
      localStorage.setItem(STORAGE_VERSION_KEY, STORAGE_VERSION);
      cleaned = true;
      return { cleaned, errors };
    }
    
    // Check for corrupted data including meeting-specific keys
    const hasCorruptedData = [
      'advisor-conversations',
      'advisor-canvas-state',
      'advisor-canvas-items',
      'advisor-messages',
      'meeting-prep-agenda',
      'meeting-prep-client-data'
    ].some(key => {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          return containsCorruptedDates(parsed);
        }
        return false;
      } catch (error) {
        errors.push(`Failed to parse ${key}: ${error}`);
        return true;
      }
    });
    
    if (hasCorruptedData) {
      console.warn('⚠️ storageRecovery: Corrupted data detected, performing cleanup');
      clearCorruptedStorage();
      cleaned = true;
    }
    
  } catch (error) {
    errors.push(`Validation error: ${error}`);
    console.error('🚨 storageRecovery: Critical error during validation:', error);
    clearAllAppStorage();
    cleaned = true;
  }
  
  console.log(`✅ storageRecovery: Validation complete. Cleaned: ${cleaned}, Errors: ${errors.length}`);
  return { cleaned, errors };
};

/**
 * Nuclear option: Clear ALL app storage
 */
export const clearAllAppStorage = (): void => {
  console.log('💣 storageRecovery: Clearing ALL app storage (nuclear option)');
  
  const allKeys = Object.keys(localStorage);
  const appKeys = allKeys.filter(key => 
    key.startsWith('advisor-') || 
    key.startsWith('sample-') ||
    key.startsWith('vida-')
  );
  
  appKeys.forEach(key => {
    console.log(`  Removing: ${key}`);
    localStorage.removeItem(key);
  });
  
  // Reset storage version
  localStorage.setItem(STORAGE_VERSION_KEY, STORAGE_VERSION);
  
  console.log(`✅ storageRecovery: Cleared ${appKeys.length} storage keys`);
};

/**
 * Manual recovery function that can be called from UI
 */
export const performManualRecovery = (): void => {
  console.log('🔧 storageRecovery: Performing manual recovery');
  clearAllAppStorage();
  window.location.reload();
};

/**
 * Check if app is in a corrupted state
 */
export const isStorageCorrupted = (): boolean => {
  try {
    const conversations = localStorage.getItem('advisor-conversations');
    if (conversations) {
      const parsed = JSON.parse(conversations);
      return containsCorruptedDates(parsed);
    }
    return false;
  } catch {
    return true;
  }
};
