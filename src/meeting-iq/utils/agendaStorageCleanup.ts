// @ts-nocheck
/**
 * Agenda-specific localStorage cleanup utilities
 * Targets corrupted agenda data for specific clients
 */

/**
 * Clears all agenda-related localStorage for a specific client
 */
export const clearClientAgendaStorage = (clientId: string): void => {
  console.log(`🧹 Clearing agenda storage for client: ${clientId}`);
  
  const keysToRemove = [
    `agenda-sections-${clientId}`,
    `agenda-bullets-${clientId}`,
    `agenda-talking-points-${clientId}`,
    `meeting-prep-agenda-${clientId}`,
    `meeting-prep-client-data-${clientId}`
  ];
  
  keysToRemove.forEach(key => {
    try {
      localStorage.removeItem(key);
      console.log(`  ✓ Removed: ${key}`);
    } catch (error) {
      console.warn(`  ✗ Failed to remove ${key}:`, error);
    }
  });
};

/**
 * Detects and clears corrupted agenda storage for all clients
 */
export const detectAndClearCorruptedAgendas = (): number => {
  console.log('🔍 Scanning for corrupted agenda data...');
  let clearedCount = 0;
  
  try {
    const allKeys = Object.keys(localStorage);
    const agendaKeys = allKeys.filter(key => 
      key.includes('agenda-') || 
      key.includes('meeting-prep-')
    );
    
    agendaKeys.forEach(key => {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          const str = JSON.stringify(parsed);
          
          // Check for corrupted Date patterns
          if (str.includes('"date":{}') || 
              str.includes('"meetingDate":{}') ||
              str.includes('"lastMeeting":{}')) {
            console.warn(`  ⚠️ Corrupted data detected in ${key}, removing...`);
            localStorage.removeItem(key);
            clearedCount++;
          }
        }
      } catch (error) {
        console.warn(`  ✗ Error processing ${key}, removing it:`, error);
        localStorage.removeItem(key);
        clearedCount++;
      }
    });
    
    console.log(`✅ Cleared ${clearedCount} corrupted agenda items`);
  } catch (error) {
    console.error('🚨 Error during agenda cleanup:', error);
  }
  
  return clearedCount;
};

/**
 * Force clear all Robert Martinez agenda data (nuclear option)
 */
export const clearRobertMartinezAgenda = (): void => {
  console.log('💣 Force clearing all Robert Martinez agenda data...');
  clearClientAgendaStorage('client-robert-martinez');
  
  // Also clear any variations
  const variations = [
    'robert-martinez',
    'robertmartinez',
    'client-martinez',
    'martinez'
  ];
  
  variations.forEach(variation => {
    clearClientAgendaStorage(variation);
  });
  
  console.log('✅ Robert Martinez agenda storage cleared');
};