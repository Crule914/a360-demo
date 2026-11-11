// @ts-nocheck
import { QuickReply } from '../types/advisor';

/**
 * Maps suggestion text to appropriate action strings
 */
const suggestionToActionMap: Record<string, string> = {
  // Meeting-related
  'Review Last Meeting Summary': 'show_last_meeting_summary',
  'Show Last Meeting Summary': 'show_last_meeting_summary',
  'Last Meeting Summary': 'show_last_meeting_summary',
  'Meeting Preparation': 'show_meeting_prep',
  'Show Meeting Prep': 'show_meeting_prep',
  
  // Meeting agenda context actions
  'Show portfolio performance details': 'show_portfolio_details',
  'Review goals progress': 'show_goals_analysis',
  'Show market insights and impact': 'show_market_insights',
  
  // Portfolio-related
  'Check portfolio performance': 'show_portfolio_performance',
  'Show Portfolio Performance': 'show_portfolio_performance',
  'Portfolio Performance': 'show_portfolio_performance',
  'View Portfolio': 'show_portfolio',
  'Show Portfolio': 'show_portfolio',
  
  // Goals-related
  'Goals': 'show_goals_analysis',
  'View Goals': 'show_goals_analysis',
  'View Goals Analysis': 'show_goals_analysis',
  'Show Goals': 'show_goals_analysis',
  'Off track goals': 'show_goals_analysis',
  
  // Market-related
  'Market updates': 'show_market_overview',
  'Market Updates': 'show_market_overview',
  'Show Market Updates': 'show_market_overview',
  
  // Client-related
  'Show Clients': 'show_clients',
  'View All Clients': 'show_clients',
  'Client List': 'show_clients',
  
  // Compliance
  'Check Compliance': 'show_compliance',
  'Compliance Review': 'show_compliance',
  'Show Compliance': 'show_compliance',
  
  // Dashboard/Overview
  'Daily Highlights': 'show_daily_highlights',
  'Show Daily Highlights': 'show_daily_highlights',
  'Today\'s Highlights': 'show_daily_highlights',
  'Market Overview': 'show_market_overview',
  'Show Market Overview': 'show_market_overview',
  
  // Generic actions
  'Tell me more': 'continue_conversation',
  'What should I focus on?': 'show_priorities',
  'Show me next steps': 'show_next_steps',
  'What else can you help with?': 'show_help',
};

/**
 * Converts string suggestions to QuickReply objects with appropriate actions
 */
export const convertSuggestionsToQuickReplies = (suggestions: string[], currentClient?: any): QuickReply[] => {
  console.log('🔄 convertSuggestionsToQuickReplies: Input suggestions:', suggestions);
  console.log('🔄 convertSuggestionsToQuickReplies: Input type:', typeof suggestions, 'Array?', Array.isArray(suggestions));
  
  if (!suggestions || !Array.isArray(suggestions)) {
    console.error('❌ convertSuggestionsToQuickReplies: Invalid input - not an array:', suggestions);
    return getDefaultQuickReplies();
  }
  
  const quickReplies = suggestions.map((suggestion, index) => {
    console.log(`🔄 convertSuggestionsToQuickReplies: Processing suggestion ${index}:`, suggestion, typeof suggestion);
    
    if (!suggestion || typeof suggestion !== 'string') {
      console.error(`❌ convertSuggestionsToQuickReplies: Invalid suggestion at index ${index}:`, suggestion);
      return null;
    }
    
    // Special handling for meeting agenda - check if there's an existing agenda to navigate to
    if (suggestion === 'View Meeting Agenda' || suggestion === 'Show Meeting Agenda' || suggestion === 'Meeting Agenda') {
      let agendaElement: HTMLElement | null = null;
      
      // First try to find agenda for current client if available
      if (currentClient?.id) {
        agendaElement = document.querySelector(`[data-canvas-type="meeting_prep"][data-client-id="${currentClient.id}"], [data-canvas-type="meeting_agenda"][data-client-id="${currentClient.id}"]`) as HTMLElement;
      }
      
      // Fallback to any meeting agenda if no client-specific one found
      if (!agendaElement) {
        agendaElement = document.querySelector('[data-canvas-type="meeting_agenda"], [data-canvas-type="agenda_builder"], [data-canvas-type="meeting_prep"]') as HTMLElement;
      }
      
      const itemId = agendaElement?.getAttribute('data-canvas-item-id');
      
      if (itemId) {
        // If agenda exists, create navigation link
        const quickReply = {
          id: `quick-reply-${Date.now()}-${index}`,
          text: suggestion,
          action: 'navigate_link',
          data: { link: `#canvas-${itemId}` }
        };
        console.log(`✅ convertSuggestionsToQuickReplies: Created navigation QuickReply ${index}:`, quickReply);
        return quickReply;
      } else {
        // If no agenda exists, trigger creation
        const quickReply = {
          id: `quick-reply-${Date.now()}-${index}`,
          text: suggestion,
          action: 'custom_query',
          data: { query: 'View meeting agenda' }
        };
        console.log(`✅ convertSuggestionsToQuickReplies: Created creation QuickReply ${index}:`, quickReply);
        return quickReply;
      }
    }
    
    const quickReply = {
      id: `quick-reply-${Date.now()}-${index}`,
      text: suggestion,
      action: suggestionToActionMap[suggestion] || 'custom_query',
      data: suggestionToActionMap[suggestion] ? undefined : { query: suggestion }
    };
    
    console.log(`✅ convertSuggestionsToQuickReplies: Created QuickReply ${index}:`, quickReply);
    return quickReply;
  }).filter(Boolean); // Remove null entries
  
  console.log('✅ convertSuggestionsToQuickReplies: Final result:', quickReplies);
  return quickReplies.length > 0 ? quickReplies : getDefaultQuickReplies();
};

/**
 * Creates default quick replies when no specific suggestions are provided
 */
export const getDefaultQuickReplies = (): QuickReply[] => {
  return [
    {
      id: 'default-1',
      text: 'Tell me more',
      action: 'continue_conversation'
    },
    {
      id: 'default-2', 
      text: 'What should I focus on?',
      action: 'show_priorities'
    },
    {
      id: 'default-3',
      text: 'Show me next steps',
      action: 'show_next_steps'
    }
  ];
};