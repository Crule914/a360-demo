// @ts-nocheck
/**
 * Utility to clean up corrupted canvas storage data
 * Removes JSX elements and other corruption from localStorage
 */

import { sanitizeFromJSX, validateDataForStorage } from './jsxSanitizer';

/**
 * Cleans all conversation data in localStorage, removing JSX corruption
 */
export const cleanAllCanvasStorage = (): void => {
  console.log('🧹 Starting comprehensive canvas storage cleanup...');
  
  try {
    const conversationsData = localStorage.getItem('vida-conversations');
    if (!conversationsData) {
      console.log('✅ No conversations found in storage');
      return;
    }
    
    const conversations = JSON.parse(conversationsData);
    let corruptionFound = false;
    let itemsCleaned = 0;
    
    // Clean each conversation
    for (const [key, conversation] of Object.entries(conversations)) {
      const conv = conversation as any;
      
      if (conv.canvasItems && Array.isArray(conv.canvasItems)) {
        const cleanedItems = conv.canvasItems.map((item: any) => {
          // Check for corruption
          if (!validateDataForStorage(item, `conversation[${key}].canvasItem[${item.type}]`)) {
            console.warn(`🚨 Corruption found in ${key}, item type: ${item.type}`);
            corruptionFound = true;
            itemsCleaned++;
          }
          
          // Sanitize the item
          const sanitized = sanitizeFromJSX(item, `conversation[${key}].canvasItem[${item.type}]`);
          
          // Remove JSX-prone fields
          if (sanitized.data) {
            delete sanitized.data._headerExtra;
            delete sanitized.data.headerExtra;
          }
          
          return sanitized;
        });
        
        conv.canvasItems = cleanedItems;
      }
    }
    
    if (corruptionFound) {
      console.log(`🧹 Cleaned ${itemsCleaned} corrupted items, saving...`);
      localStorage.setItem('vida-conversations', JSON.stringify(conversations));
      console.log('✅ Canvas storage cleaned successfully');
    } else {
      console.log('✅ No corruption found in canvas storage');
    }
  } catch (error) {
    console.error('❌ Failed to clean canvas storage:', error);
    // In case of critical corruption, clear everything
    console.warn('⚠️ Clearing all conversation data due to critical corruption');
    localStorage.removeItem('vida-conversations');
  }
};

/**
 * Removes all agenda-related storage for a specific client
 */
export const clearClientCanvasData = (clientId: string): void => {
  console.log(`🧹 Clearing canvas data for client: ${clientId}`);
  
  try {
    const conversationsData = localStorage.getItem('vida-conversations');
    if (!conversationsData) return;
    
    const conversations = JSON.parse(conversationsData);
    
    for (const conversation of Object.values(conversations)) {
      const conv = conversation as any;
      if (conv.canvasItems) {
        conv.canvasItems = conv.canvasItems.filter((item: any) => 
          item.clientId !== clientId || item.type !== 'meeting_agenda'
        );
      }
    }
    
    localStorage.setItem('vida-conversations', JSON.stringify(conversations));
    console.log(`✅ Cleared canvas data for client: ${clientId}`);
  } catch (error) {
    console.error('❌ Failed to clear client canvas data:', error);
  }
};

/**
 * Run on app initialization to clean any existing corruption
 */
export const initializeCanvasStorage = (): void => {
  console.log('🚀 Initializing canvas storage with cleanup...');
  cleanAllCanvasStorage();
};
