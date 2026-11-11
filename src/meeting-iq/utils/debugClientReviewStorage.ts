// @ts-nocheck
/**
 * Debug utility to inspect localStorage contents for client review settings
 */
export const debugClientReviewStorage = () => {
  console.log('=== CLIENT REVIEW STORAGE DEBUG ===');
  
  // Get all localStorage keys that start with clientReviewSettings
  const keys = Object.keys(localStorage).filter(key => key.startsWith('clientReviewSettings'));
  
  console.log(`Found ${keys.length} client review storage keys:`, keys);
  
  keys.forEach(key => {
    try {
      const data = JSON.parse(localStorage.getItem(key) || '{}');
      console.log(`\n--- ${key} ---`);
      console.log('Raw data:', data);
      
      if (data.meetings) {
        const meetingDates = Object.keys(data.meetings);
        console.log('Meeting dates:', meetingDates);
        
        meetingDates.forEach(date => {
          const meeting = data.meetings[date];
          const switchCount = Object.keys(meeting.switches || {}).length;
          console.log(`  ${date}: ${switchCount} switches`);
          
          // Show first few switches as examples
          const switches = Object.entries(meeting.switches || {}).slice(0, 3);
          switches.forEach(([switchKey, switchData]: [string, any]) => {
            console.log(`    ${switchKey}: ${switchData.includeInReview}`);
          });
          
          if (Object.keys(meeting.switches || {}).length > 3) {
            console.log(`    ... and ${Object.keys(meeting.switches || {}).length - 3} more`);
          }
        });
      }
    } catch (error) {
      console.error(`Error parsing ${key}:`, error);
    }
  });
  
  console.log('=== END DEBUG ===');
};

/**
 * Debug specific client's switch states
 */
export const debugClientSwitchStates = (clientId: string, meetingDate?: string) => {
  console.log(`=== CLIENT SWITCH STATES DEBUG: ${clientId} ===`);
  
  const date = meetingDate || new Date().toISOString().split('T')[0];
  console.log(`Using meeting date: ${date}`);
  
  try {
    const key = `clientReviewSettings:${clientId}`;
    const stored = localStorage.getItem(key);
    
    if (!stored) {
      console.log('❌ No settings found for this client');
      return;
    }
    
    const data = JSON.parse(stored);
    console.log('📋 Raw client settings:', data);
    
    if (data.meetings && data.meetings[date]) {
      const meeting = data.meetings[date];
      console.log(`📅 Meeting data for ${date}:`, meeting);
      
      const switches = Object.entries(meeting.switches || {});
      console.log(`🔄 Found ${switches.length} switches:`);
      
      switches.forEach(([switchKey, switchData]: [string, any]) => {
        console.log(`  ${switchKey}: ${switchData.includeInReview ? '✅ INCLUDED' : '❌ EXCLUDED'} (updated: ${switchData.lastUpdated})`);
      });
    } else {
      console.log(`❌ No meeting data found for date: ${date}`);
      console.log('Available meeting dates:', Object.keys(data.meetings || {}));
    }
  } catch (error) {
    console.error('❌ Error debugging client switch states:', error);
  }
  
  console.log('=== END CLIENT SWITCH DEBUG ===');
};

/**
 * Clear all localStorage data for a client (useful for debugging)
 */
export const clearClientStorage = (clientId: string) => {
  console.log(`🧹 Clearing all storage for client: ${clientId}`);
  
  const keysToRemove: string[] = [];
  
  // Find all keys that contain this client ID
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes(clientId) || key.includes('clientReviewSettings') || key.includes('clientReviewData'))) {
      keysToRemove.push(key);
    }
  }
  
  console.log(`Found ${keysToRemove.length} keys to remove:`, keysToRemove);
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`✅ Removed: ${key}`);
  });
  
  console.log(`🎉 Cleared all storage for ${clientId}`);
};

/**
 * Quick debug for Sarah Johnson specifically (with the 'h'!)
 */
export const debugSarahJohnsonSwitches = () => {
  console.log('🔍 Debugging Sarah Johnson specifically (with h)...');
  debugClientSwitchStates('client-sarah-johnson');
};

/**
 * Clear Sarah Johnson's storage specifically (with the 'h'!)
 */
export const clearSarahJohnsonStorage = () => {
  console.log('🧹 Clearing Sarah Johnson storage specifically (with h)...');
  clearClientStorage('client-sarah-johnson');
};

/**
 * Clear Sara Johnson's storage specifically
 */
export const clearSaraJohnsonStorage = () => {
  console.log('🧹 Clearing Sara Johnson storage specifically...');
  clearClientStorage('client-sarah-johnson');
};

// Make functions available globally for debugging
(window as any).debugClientReviewStorage = debugClientReviewStorage;
(window as any).debugClientSwitchStates = debugClientSwitchStates;
(window as any).debugSarahJohnsonSwitches = debugSarahJohnsonSwitches; // Fixed: Sarah with 'h'
(window as any).clearClientStorage = clearClientStorage;
(window as any).clearSarahJohnsonStorage = clearSarahJohnsonStorage; // Fixed: Sarah with 'h'