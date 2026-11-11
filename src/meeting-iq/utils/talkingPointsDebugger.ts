// @ts-nocheck
/**
 * Debugging utility for tracking talking points data flow
 */

export const TalkingPointsDebugger = {
  logTalkingPointsFlow: (stage: string, data: any, context: string = '') => {
    console.group(`🔍 [TalkingPointsDebugger] ${stage} ${context}`);
    
    if (Array.isArray(data)) {
      console.log(`📊 Array of ${data.length} items:`);
      data.forEach((item, index) => {
        if (item?.talkingPoints) {
          console.log(`  Section ${index} (${item.id || 'unknown'}): ${item.talkingPoints.length} talking points`);
          item.talkingPoints.forEach((tp: any, tpIndex: number) => {
            console.log(`    TP ${tpIndex}:`, {
              id: tp.id,
              content: tp.content?.substring(0, 50) + '...',
              includeInReview: tp.includeInReview,
              isUserAdded: tp.isUserAdded,
              order: tp.order
            });
          });
        } else if (item?.content) {
          // This is a talking point
          console.log(`  TP ${index}:`, {
            id: item.id,
            content: item.content?.substring(0, 50) + '...',
            includeInReview: item.includeInReview,
            isUserAdded: item.isUserAdded,
            order: item.order
          });
        }
      });
    } else if (data && typeof data === 'object') {
      console.log('📋 Object data:', data);
      if (data.talkingPoints) {
        console.log(`  Has ${data.talkingPoints.length} talking points`);
        data.talkingPoints.forEach((tp: any, index: number) => {
          console.log(`    TP ${index}:`, {
            id: tp.id,
            content: tp.content?.substring(0, 50) + '...',
            includeInReview: tp.includeInReview,
            isUserAdded: tp.isUserAdded
          });
        });
      }
    } else {
      console.log('📦 Raw data:', data);
    }
    
    console.groupEnd();
  },

  logLocalStorageState: (clientId: string, meetingDate: string) => {
    console.group(`💾 [TalkingPointsDebugger] LocalStorage State`);
    
    try {
      const agendaKey = `agenda_${clientId}_${meetingDate}`;
      const stored = localStorage.getItem(agendaKey);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log(`📂 Found agenda data for ${clientId} on ${meetingDate}`);
        console.log(`📊 ${parsed.length} sections stored`);
        
        parsed.forEach((section: any, index: number) => {
          const tpCount = section.talkingPoints?.length || 0;
          console.log(`  Section ${index} (${section.id}): ${tpCount} talking points`);
          
          if (tpCount > 0) {
            section.talkingPoints.forEach((tp: any, tpIndex: number) => {
              console.log(`    TP ${tpIndex}:`, {
                content: tp.content?.substring(0, 40) + '...',
                includeInReview: tp.includeInReview,
                isUserAdded: tp.isUserAdded
              });
            });
          }
        });
      } else {
        console.log(`❌ No agenda data found for ${clientId} on ${meetingDate}`);
      }
    } catch (error) {
      console.error('💥 Error reading localStorage:', error);
    }
    
    console.groupEnd();
  },

  verifyTalkingPointIntegrity: (talkingPoints: any[]) => {
    console.group(`🔬 [TalkingPointsDebugger] Integrity Check`);
    
    const results = {
      total: talkingPoints.length,
      withIncludeInReview: 0,
      withIsUserAdded: 0,
      withContent: 0,
      valid: 0
    };
    
    talkingPoints.forEach((tp, index) => {
      const hasIncludeInReview = 'includeInReview' in tp;
      const hasIsUserAdded = 'isUserAdded' in tp;
      const hasContent = tp.content && tp.content.trim().length > 0;
      const isValid = hasIncludeInReview && hasIsUserAdded && hasContent && tp.includeInReview === true;
      
      if (hasIncludeInReview) results.withIncludeInReview++;
      if (hasIsUserAdded) results.withIsUserAdded++;
      if (hasContent) results.withContent++;
      if (isValid) results.valid++;
      
      console.log(`TP ${index}:`, {
        hasIncludeInReview,
        includeInReview: tp.includeInReview,
        hasIsUserAdded,
        isUserAdded: tp.isUserAdded,
        hasContent,
        isValid,
        content: hasContent ? tp.content.substring(0, 30) + '...' : 'EMPTY'
      });
    });
    
    console.log('📈 Summary:', results);
    console.log(`✅ ${results.valid}/${results.total} talking points are valid for client review`);
    
    console.groupEnd();
    
    return results;
  }
};