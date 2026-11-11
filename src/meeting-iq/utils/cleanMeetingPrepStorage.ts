// @ts-nocheck
/**
 * Clean upcoming_meetings_prompt from all meeting prep conversations in localStorage
 * This is a one-time cleanup utility to fix corrupted meeting prep data
 */
export const cleanMeetingPrepStorage = () => {
  try {
    const stored = localStorage.getItem('advisor-conversations');
    if (!stored) return;

    const conversations = JSON.parse(stored);
    let cleaned = false;

    const cleanedConversations = conversations.map((conv: any) => {
      const isMeetingPrep = conv.isMeetingPrep || 
                           conv.meetingType === 'meeting_prep' ||
                           conv.conversationKey?.includes('|meeting_prep|');

      if (isMeetingPrep && Array.isArray(conv.canvasItems)) {
        const originalLength = conv.canvasItems.length;
        conv.canvasItems = conv.canvasItems.filter((item: any) => 
          item.type !== 'upcoming_meetings_prompt'
        );
        
        if (conv.canvasItems.length !== originalLength) {
          cleaned = true;
          console.warn('🧹 Cleaned upcoming_meetings_prompt from meeting prep:', conv.conversationKey);
        }
      }

      return conv;
    });

    if (cleaned) {
      localStorage.setItem('advisor-conversations', JSON.stringify(cleanedConversations));
      console.log('✅ Meeting prep storage cleaned successfully');
    }
  } catch (error) {
    console.error('❌ Failed to clean meeting prep storage:', error);
  }
};

/**
 * Initialize cleanup on app load
 */
export const initMeetingPrepStorageCleanup = () => {
  cleanMeetingPrepStorage();
};
