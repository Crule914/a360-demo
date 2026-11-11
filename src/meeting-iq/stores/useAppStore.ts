// @ts-nocheck
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { initMeetingPrepStorageCleanup } from '@miq/utils/cleanMeetingPrepStorage';
import { logger } from '@miq/utils/logger';

// Debounced localStorage writer — batches writes to avoid blocking main thread
let _persistTimer: ReturnType<typeof setTimeout> | null = null;
const persistConversations = (conversations: ConversationEntry[]) => {
  if (_persistTimer) clearTimeout(_persistTimer);
  _persistTimer = setTimeout(() => {
    try {
      localStorage.setItem('advisor-conversations', JSON.stringify(conversations));
    } catch (e) {
      console.error('Failed to persist conversations:', e);
    }
  }, 500);
};
// Flush immediately (used by deleteConversation, updateConversationTitle)
const persistConversationsSync = (conversations: ConversationEntry[]) => {
  if (_persistTimer) clearTimeout(_persistTimer);
  try {
    localStorage.setItem('advisor-conversations', JSON.stringify(conversations));
  } catch (e) {
    console.error('Failed to persist conversations:', e);
  }
};

export interface ConversationEntry {
  id: string;
  conversationKey: string;
  title: string;
  timestamp: string;
  messages: any[];
  canvasItems: any[];
  clientId?: string;
  meetingType?: string;
  meetingDate?: string;
  isMeetingPrep?: boolean;
}

export interface UploadedFile {
  id: string;
  name: string;
  file: File;
  uploadStatus?: 'uploading' | 'completed' | 'error';
  uploadProgress?: number;
  status?: string;
  uploadedAt?: string;
  size?: number;
}

export interface AppState {
  currentClient: any;
  setCurrentClient: (client: any) => void;
  canvasItems: any[];
  setCanvasItems: (items: any[]) => void;
  addCanvasItem: (item: any) => void;
  updateCanvasItem: (id: string, data: any) => void;
  removeCanvasItem: (id: string) => void;
  clearCanvas: () => void;
  allClients: any[];
  setAllClients: (clients: any[]) => void;
  showMeetingPrep: boolean;
  setShowMeetingPrep: (show: boolean) => void;
  showMeetingAgenda: boolean;
  setShowMeetingAgenda: (show: boolean) => void;
  showClientReview: boolean;
  setShowClientReview: (show: boolean) => void;
  showDocuments: boolean;
  setShowDocuments: (show: boolean) => void;
  showSupportingMaterial: boolean;
  setShowSupportingMaterial: (show: boolean) => void;
  showCanvas: boolean;
  setShowCanvas: (show: boolean) => void;
  uploadedFiles: UploadedFile[];
  setUploadedFiles: (files: UploadedFile[]) => void;
  addUploadedFile: (file: UploadedFile) => void;
  updateUploadedFile: (id: string, updates: Partial<UploadedFile>) => void;
  removeUploadedFile: (id: string) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  isNavVisible: boolean;
  toggleNavVisibility: () => void;
  isNavCollapsed: boolean;
  setNavCollapsed: (collapsed: boolean) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  isConversationLoading: boolean;
  setConversationLoading: (loading: boolean) => void;
  messages: any[];
  addMessage: (message: any) => void;
  clearMessages: () => void;
  setMessages: (messages: any[]) => void;
  conversations: ConversationEntry[];
  conversationsVersion: number; // Increment to force re-renders when conversations change
  addConversation: (conversation: ConversationEntry) => void;
  loadConversation: (conversationKey: string) => void;
  deleteConversation: (conversationKey: string) => void;
  updateConversationTitle: (conversationKey: string, title: string) => void;
  setActiveConversation: (conversationKey: string | null, clientId?: string | null) => void;
  activeConversationKey: string | null;
  activeConversationId?: string;
  activeConversationTitle?: string;
  saveActiveConversationSnapshot: () => void;
  clearAllConversations: () => void;
  currentMeetingDate: string;
  setCurrentMeetingDate: (date: string) => void;
  refreshCurrentMeetingDate: () => void;
  // UI State
  isChatVisible?: boolean;
  toggleChat?: () => void;
  setChatVisible?: (visible: boolean) => void;
  setNavVisible?: (visible: boolean) => void;
  toggleNav?: () => void;
  toggleNavCollapsed?: () => void;
  setActiveTab?: (tab: string) => void;
  isCanvasIntentionallyCleared?: boolean;
  setCanvasIntentionallyCleared?: (cleared: boolean) => void;
  isInConversationTransition?: boolean;
  setConversationTransition?: (inTransition: boolean) => void;
  isMeetingPrepTransitionInProgress?: boolean;
  setMeetingPrepTransition?: (inTransition: boolean) => void;
  // Home reset - single source of truth
  resetToHome: () => void;
  lastHomeResetAt?: number;
  // Chat specific
  leftChatTab?: string;
  setLeftChatTab?: (tab: string) => void;
  showSuggestedInfo?: boolean;
  setShowSuggestedInfo?: (show: boolean) => void;
  renameConversation?: (key: string, title: string) => void;
  updateFileStatus?: (id: string, status: string) => void;
  loadOrCreateConversationByKey?: (key: string, clientId?: string, meetingType?: string) => void;
  // Feature mode toggle
  featureMode: 'mvp' | 'post-mvp';
  setFeatureMode: (mode: 'mvp' | 'post-mvp') => void;
  // Upcoming meeting card interaction mode
  cardInteractionMode: 'inline-actions' | 'clickable-card';
  setCardInteractionMode: (mode: 'inline-actions' | 'clickable-card') => void;
  // Meeting prep header layout mode
  prepHeaderLayout: 'right-only' | 'full-width';
  setPrepHeaderLayout: (mode: 'right-only' | 'full-width') => void;
  // Meeting prep toggle states (shared between Calendar and Landing page)
  meetingPrepStates: Record<string, boolean>;
  meetingPrepStatesInitialized: boolean;
  setMeetingPrepState: (meetingId: string, enabled: boolean) => void;
  initMeetingPrepStates: (states: Record<string, boolean>) => void;
  // Meeting generating/processing states (shared between Calendar and Landing page)
  meetingGeneratingStates: Record<string, 'generating' | 'in_progress'>;
  setMeetingGeneratingState: (meetingId: string, state: 'generating' | 'in_progress' | null) => void;
  // Per-meeting "no agenda yet" flag for the prep page placeholder
  noAgendaMeetingId: string | null;
  setNoAgendaMeetingId: (id: string | null) => void;
  // Per-meeting "agenda generation failed" flag for the prep page error state
  agendaIssueMeetingId: string | null;
  setAgendaIssueMeetingId: (id: string | null) => void;
  // Per-meeting "agenda is currently regenerating" flag for the prep page placeholder
  regeneratingMeetingId: string | null;
  setRegeneratingMeetingId: (id: string | null) => void;
  // Per-client agenda regeneration lock (demo-only, blocks card on dashboard)
  regeneratingClientIds: Record<string, boolean>;
  setClientRegenerating: (clientId: string, value: boolean) => void;
  // Assistant mode
  assistantMode: boolean;
  setAssistantMode: (on: boolean) => void;
  selectedAdvisors: string[];
  setSelectedAdvisors: (ids: string[]) => void;
  advisorFilterVariant: 'initials' | 'photos' | 'lozenges' | 'dropdown';
  setAdvisorFilterVariant: (v: 'initials' | 'photos' | 'lozenges' | 'dropdown') => void;
  // Active template name
  activeTemplateName: string;
  setActiveTemplateName: (name: string) => void;
}

// Load conversations safely with error recovery
const MAX_STORED_CONVERSATIONS = 50;

const loadConversationsFromStorage = (): ConversationEntry[] => {
  try {
    // Clean any corrupted meeting prep conversations first
    initMeetingPrepStorageCleanup();
    
    const raw = localStorage.getItem('advisor-conversations');
    if (!raw) return [];
    
    const conversations = JSON.parse(raw);
    if (!Array.isArray(conversations)) {
      logger.warn('Invalid conversation data format, clearing...');
      localStorage.removeItem('advisor-conversations');
      return [];
    }
    
    // Clean any corrupted data and ensure all required fields
    const cleaned = conversations
      .filter((c: any) => c && typeof c === 'object' && (c.id || c.conversationKey))
      .map((c: any) => {
        // Detect if this is a meeting prep conversation
        const conversationKey = c.conversationKey || c.id;
        const isMeetingPrep = c.isMeetingPrep || 
                             (typeof conversationKey === 'string' && conversationKey.includes('|meeting_prep|'));
        
        return {
          ...c,
          // Ensure both id and conversationKey exist
          id: c.id || c.conversationKey,
          conversationKey: c.conversationKey || c.id,
          // Mark meeting prep conversations
          isMeetingPrep,
          // Ensure title is always a string
          // Normalize old meeting prep titles to the standard default
          title: (typeof c.title === 'string' && (c.title === 'Meeting Chat' || c.title.startsWith('Meeting Prep -') || c.title.startsWith('Meeting Prep:') || c.title === 'Meeting Prep' || /^Meeting Prep \(\d+\)$/.test(c.title)))
            ? 'Meeting Prep Chat'
            : (typeof c.title === 'string' ? c.title : 'Untitled'),
          timestamp: typeof c.timestamp === 'string' ? c.timestamp : 
                     (c.timestamp instanceof Date ? c.timestamp.toISOString() : new Date().toISOString()),
          messages: Array.isArray(c.messages) ? c.messages.map((m: any) => ({
            ...m,
            timestamp: typeof m.timestamp === 'string' ? m.timestamp : 
                       (m.timestamp instanceof Date ? m.timestamp.toISOString() : new Date().toISOString())
          })) : [],
          // For meeting prep conversations, ALWAYS clear canvas on load
          canvasItems: isMeetingPrep ? [] : (Array.isArray(c.canvasItems) ? c.canvasItems
            .filter((ci: any) => ci.type !== 'upcoming_meetings_prompt')
            .map((ci: any) => ({
              ...ci,
              timestamp: typeof ci.timestamp === 'string' ? ci.timestamp : 
                         (ci.timestamp instanceof Date ? ci.timestamp.toISOString() : new Date().toISOString())
            })) : [])
        };
      });

    // Cap at MAX_STORED_CONVERSATIONS — keep most recent
    if (cleaned.length > MAX_STORED_CONVERSATIONS) {
      const trimmed = cleaned
        .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, MAX_STORED_CONVERSATIONS);
      // Persist the trimmed list back
      try {
        localStorage.setItem('advisor-conversations', JSON.stringify(trimmed));
      } catch (_) { /* ignore */ }
      return trimmed;
    }

    return cleaned;
  } catch (error) {
    console.error('Error loading conversations, clearing storage:', error);
    localStorage.removeItem('advisor-conversations');
    localStorage.removeItem('sample-conversation-initialized');
    return [];
  }
};

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentClient: null,
      canvasItems: [],
      allClients: [],
      showMeetingPrep: false,
      showMeetingAgenda: false,
      showClientReview: false,
      showDocuments: false,
      showSupportingMaterial: false,
      showCanvas: true,
      uploadedFiles: [],
      currentView: 'home',
      isNavVisible: true,
      isNavCollapsed: true,
      isLoading: false,
      isConversationLoading: false,
      messages: [],
      conversations: [], // Loaded asynchronously below
      conversationsVersion: 0, // Increment to force re-renders when conversations change
      activeConversationKey: null,
      activeConversationId: null,
      activeConversationTitle: null,
      currentMeetingDate: new Date().toISOString().split('T')[0],
      // UI defaults
      isChatVisible: true,
      isCanvasIntentionallyCleared: false,
      isInConversationTransition: false,
      isMeetingPrepTransitionInProgress: false,
      lastHomeResetAt: 0,
      leftChatTab: 'recent',
      showSuggestedInfo: false,
      featureMode: (localStorage.getItem('featureMode') as 'mvp' | 'post-mvp') || 'mvp',
      cardInteractionMode: (localStorage.getItem('cardInteractionMode') as 'inline-actions' | 'clickable-card') || 'clickable-card',
      prepHeaderLayout: (localStorage.getItem('prepHeaderLayout') as 'right-only' | 'full-width') || 'right-only',
      assistantMode: localStorage.getItem('assistantMode_v2') === null ? false : localStorage.getItem('assistantMode_v2') === 'true',
      selectedAdvisors: (() => {
        const DEFAULT_KEY = 'selectedAdvisors_v3';
        const stored = localStorage.getItem(DEFAULT_KEY);
        if (stored) return JSON.parse(stored);
        const defaults = ['jm'];
        localStorage.setItem(DEFAULT_KEY, JSON.stringify(defaults));
        localStorage.setItem('selectedAdvisors', JSON.stringify(defaults));
        return defaults;
      })(),
      advisorFilterVariant: (localStorage.getItem('advisorFilterVariant_v2') as 'initials' | 'photos' | 'lozenges' | 'dropdown') || 'dropdown',
      activeTemplateName: 'Default Annual Review',

      // Actions
      setCurrentClient: (client) => set({ currentClient: client }),
      
      setCanvasItems: (items) => set((state) => {
        if (state.activeConversationKey?.includes('|meeting_prep|')) {
          const filtered = items.filter(item => item.type !== 'upcoming_meetings_prompt');
          return { canvasItems: filtered };
        }
        return { canvasItems: items };
      }),
      
      addCanvasItem: (item) => set((state) => {
        // Block canvas additions during meeting prep transition
        if (state.isMeetingPrepTransitionInProgress) {
          logger.warn('⚠️ addCanvasItem BLOCKED by isMeetingPrepTransitionInProgress flag. Item type:', item.type, 'id:', item.id);
          return state;
        }
        
        if (state.isInConversationTransition) {
          logger.warn('⚠️ addCanvasItem BLOCKED by isInConversationTransition flag. Item type:', item.type, 'id:', item.id);
          return state;
        }
        
        // Prevent landing widgets in client/meeting context
        const landingWidgetTypes = ['day_view_calendar', 'landing_daily_briefing', 
                                      'landing_client_data_quality', 'landing_potential_meetings'];
        if (landingWidgetTypes.includes(item.type) && 
            (state.activeConversationKey?.includes('|meeting_prep|') || state.currentClient !== null)) {
          return state;
        }
        
        return {
          canvasItems: [...state.canvasItems, item]
        };
      }),
      
      updateCanvasItem: (id, data) => set((state) => ({
        canvasItems: state.canvasItems.map(item =>
          item.id === id ? { ...item, ...data } : item
        )
      })),
      
      removeCanvasItem: (id) => set((state) => ({
        canvasItems: state.canvasItems.filter(item => item.id !== id)
      })),
      
      clearCanvas: () => set({ canvasItems: [], isCanvasIntentionallyCleared: false, isInConversationTransition: false }),
      setCanvasIntentionallyCleared: (cleared: boolean) => set({ isCanvasIntentionallyCleared: cleared }),
      setConversationTransition: (inTransition: boolean) => set({ isInConversationTransition: inTransition }),
      setMeetingPrepTransition: (inTransition: boolean) => set({ isMeetingPrepTransitionInProgress: inTransition }),
      
      // CRITICAL: Full reset to home - single source of truth for "go home" behavior
      resetToHome: () => {
        set({
          currentClient: null,
          activeConversationKey: null,
          activeConversationId: undefined,
          activeConversationTitle: undefined,
          messages: [],
          canvasItems: [],
          isCanvasIntentionallyCleared: false,
          isInConversationTransition: false,
          isMeetingPrepTransitionInProgress: false,
          lastHomeResetAt: Date.now(),
        });
      },
      
      setAllClients: (clients) => set({ allClients: clients }),
      
      setShowMeetingPrep: (show) => set({ showMeetingPrep: show }),
      setShowMeetingAgenda: (show) => set({ showMeetingAgenda: show }),
      setShowClientReview: (show) => set({ showClientReview: show }),
      setShowDocuments: (show) => set({ showDocuments: show }),
      setShowSupportingMaterial: (show) => set({ showSupportingMaterial: show }),
      setShowCanvas: (show) => set({ showCanvas: show }),
      
      setUploadedFiles: (files) => set({ uploadedFiles: files }),
      
      addUploadedFile: (file) => set((state) => ({
        uploadedFiles: [...state.uploadedFiles, file]
      })),
      
      updateUploadedFile: (id, updates) => set((state) => ({
        uploadedFiles: state.uploadedFiles.map(file =>
          file.id === id ? { ...file, ...updates } : file
        )
      })),
      
      removeUploadedFile: (id) => set((state) => ({
        uploadedFiles: state.uploadedFiles.filter(file => file.id !== id)
      })),
      
      setCurrentView: (view) => set({ currentView: view }),
      
      toggleNavVisibility: () => set((state) => ({ isNavVisible: !state.isNavVisible })),
      setNavCollapsed: (collapsed) => set({ isNavCollapsed: collapsed }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      setConversationLoading: (loading) => set({ isConversationLoading: loading }),
      
      addMessage: (message) => set((state) => {
        return {
          messages: [...state.messages, { ...message }]
        };
      }),
      
      clearMessages: () => set({ messages: [] }),
      setMessages: (messages) => set({ messages }),
      
      addConversation: (conversation) => set((state) => {
        const existingIndex = state.conversations.findIndex(c => c.id === conversation.id);
        let newConversations;
        
        if (existingIndex >= 0) {
          // Update existing conversation - ALWAYS preserve existing title if it's not a default
          const existing = state.conversations[existingIndex];
          const isDefaultTitle = existing.title === 'New Chat' || 
                                 existing.title === 'Meeting Chat' || 
                                 existing.title === 'Meeting Prep Chat' ||
                                 existing.title === 'Chat' || 
                                 existing.title === 'Untitled' ||
                                 !existing.title;
          
          // Only use new title if existing title is a default placeholder
          const finalTitle = isDefaultTitle 
            ? (conversation.title || 'Meeting Prep Chat')
            : existing.title;
          
          
          newConversations = [...state.conversations];
          newConversations[existingIndex] = {
            ...conversation,
            title: finalTitle,
            timestamp: conversation.timestamp || existing.timestamp || new Date().toISOString()
          };
        } else {
          // Add new conversation - preserve title as-is
          const newConversation = {
            ...conversation,
            title: conversation.title || 'Meeting Chat',
            timestamp: conversation.timestamp || new Date().toISOString(),
            conversationKey: conversation.conversationKey || conversation.id
          };
          
          newConversations = [newConversation, ...state.conversations];
        }
        
        const isMatchingActiveConversation = 
          conversation.conversationKey === state.activeConversationKey ||
          conversation.id === state.activeConversationKey;
        
        persistConversations(newConversations);
        return { 
          conversations: newConversations,
          // Sync the active conversation ID if this matches the active key
          ...(isMatchingActiveConversation ? { 
            activeConversationId: conversation.id,
            activeConversationTitle: conversation.title || state.activeConversationTitle
          } : {})
        };
      }),
      
      loadConversation: (identifier) => {
        const conversation = get().conversations.find(c => 
          c.conversationKey === identifier || c.id === identifier
        );
        if (conversation) {
          const canvasToLoad = conversation.isMeetingPrep ? [] : (conversation.canvasItems || []);
          
          if (conversation.isMeetingPrep) {
            set({ canvasItems: [], messages: [] });
          }
          
          set({
            messages: conversation.messages || [],
            canvasItems: canvasToLoad,
            activeConversationKey: conversation.conversationKey || conversation.id,
            activeConversationId: conversation.id,
            activeConversationTitle: String(conversation.title || 'Untitled'),
            currentClient: conversation.clientId 
              ? get().allClients.find(c => c.id === conversation.clientId) || null 
              : null
          });
        }
      },
      
      deleteConversation: (identifier) => set((state) => {
        // Filter by either conversationKey or id
        const filteredConversations = state.conversations.filter(c => 
          c.conversationKey !== identifier && c.id !== identifier
        );
        persistConversationsSync(filteredConversations);
        return { conversations: filteredConversations };
      }),
      
      updateConversationTitle: (identifier, title) => set((state) => {
        const safeTitle = String(title || 'Untitled');
        
        const foundConversation = state.conversations.find(c => c.conversationKey === identifier || c.id === identifier);
        
        const updatedConversations = state.conversations.map(c => {
          const isMatch = c.conversationKey === identifier || 
                         c.id === identifier ||
                         (foundConversation && c.id === foundConversation.id);
          return isMatch ? { ...c, title: safeTitle } : c;
        });
        
        persistConversationsSync(updatedConversations);
        
        const isActiveConversation = state.activeConversationKey === identifier || 
                                      state.activeConversationId === identifier;
        
        return { 
          conversations: updatedConversations,
          conversationsVersion: state.conversationsVersion + 1,
          ...(isActiveConversation ? { activeConversationTitle: safeTitle } : {})
        };
      }),
      
      setActiveConversation: (identifier, titleOrClientId) => {
        if (identifier) {
          get().loadConversation(identifier);
        } else {
          set({
            messages: [],
            canvasItems: [],
            activeConversationKey: null,
            activeConversationId: undefined,
            activeConversationTitle: undefined,
            currentClient: typeof titleOrClientId === 'string' && titleOrClientId 
              ? get().allClients.find(c => c.id === titleOrClientId) || null 
              : null
          });
        }
      },
      
      saveActiveConversationSnapshot: () => {
        const state = get();
        if (!state.activeConversationKey || state.messages.length === 0) return;
        
        const conversationIndex = state.conversations.findIndex(
          c => c.conversationKey === state.activeConversationKey
        );
        
        // Extract metadata from conversation key if it follows pattern: clientId|meetingType|meetingDate|...
        const keyParts = state.activeConversationKey.split('|');
        const clientIdFromKey = keyParts[0];
        const meetingTypeFromKey = keyParts[1];
        const meetingDateFromKey = keyParts[2];
        
        // Detect if this is a meeting prep conversation
        const isMeetingPrep = meetingTypeFromKey === 'meeting_prep' || 
                             state.activeConversationKey.includes('|meeting_prep|');
        
        if (conversationIndex >= 0) {
          const existing = state.conversations[conversationIndex];
          const updatedConversations = [...state.conversations];
          updatedConversations[conversationIndex] = {
            ...existing,
            messages: state.messages,
            canvasItems: state.canvasItems.filter(item => item.type !== 'upcoming_meetings_prompt'),
            timestamp: new Date().toISOString(),
            title: state.activeConversationTitle || existing.title,
            clientId: existing.clientId || state.currentClient?.id || clientIdFromKey,
            meetingType: existing.meetingType || meetingTypeFromKey,
            meetingDate: existing.meetingDate || meetingDateFromKey,
            conversationKey: state.activeConversationKey,
            isMeetingPrep: isMeetingPrep || existing.isMeetingPrep
          };
          
          
          persistConversations(updatedConversations);
          set({ conversations: updatedConversations });
        } else {
          // Create new conversation snapshot
          const newConversation: ConversationEntry = {
            id: state.activeConversationKey,
            conversationKey: state.activeConversationKey,
            title: state.activeConversationTitle || 'Meeting Chat',
            messages: state.messages,
            canvasItems: state.canvasItems.filter(item => item.type !== 'upcoming_meetings_prompt'),
            timestamp: new Date().toISOString(),
            clientId: state.currentClient?.id || clientIdFromKey,
            meetingType: meetingTypeFromKey,
            meetingDate: meetingDateFromKey,
            isMeetingPrep
          };
          
          const updatedConversations = [newConversation, ...state.conversations];
          
          persistConversations(updatedConversations);
          set({ conversations: updatedConversations });
        }
      },
      
      clearAllConversations: () => {
        localStorage.removeItem('advisor-conversations');
        localStorage.removeItem('sample-conversation-initialized');
        set({ conversations: [], activeConversationKey: null });
      },
      
      setCurrentMeetingDate: (date) => set({ currentMeetingDate: date }),
      
      refreshCurrentMeetingDate: () => {
        const newDate = new Date().toISOString().split('T')[0];
        set({ currentMeetingDate: newDate });
      },
      
      // UI Actions
      toggleChat: () => set((state) => ({ isChatVisible: !state.isChatVisible })),
      setChatVisible: (visible) => set({ isChatVisible: visible }),
      setNavVisible: (visible) => set({ isNavVisible: visible }),
      toggleNav: () => set((state) => ({ isNavVisible: !state.isNavVisible })),
      toggleNavCollapsed: () => set((state) => ({ isNavCollapsed: !state.isNavCollapsed })),
      setActiveTab: (tab) => set({ currentView: tab }),
      
      // Chat actions
      setLeftChatTab: (tab) => set({ leftChatTab: tab }),
      setShowSuggestedInfo: (show) => set({ showSuggestedInfo: show }),
      renameConversation: (identifier, title) => {
        get().updateConversationTitle(identifier, title);
      },
      updateFileStatus: (id, status) => {
        get().updateUploadedFile(id, { status });
      },
      loadOrCreateConversationByKey: (key, clientId, meetingType) => {
        const state = get();
        
        // Extract context from key: {clientId}|{meetingType}|{meetingDate}|{conversationId}|{userId}
        const keyParts = key.split('|');
        const [keyClientId, keyMeetingType, keyMeetingDate] = keyParts;
        
        // Find existing conversation by partial key match (clientId|meetingType|meetingDate prefix)
        const prefix = `${keyClientId}|${keyMeetingType}|${keyMeetingDate}`;
        const matchingConversations = state.conversations
          .filter(c => c.conversationKey?.startsWith(prefix))
          .sort((a, b) => {
            const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return timeB - timeA; // Most recent first
          });
        
        const existingConversation = matchingConversations[0];
        
        if (existingConversation) {
          get().loadConversation(existingConversation.conversationKey);
        } else {
          const client = clientId ? state.allClients.find(c => c.id === clientId) : null;
          
          set({
            currentClient: client,
            activeConversationKey: key,
            activeConversationId: undefined,
            activeConversationTitle: undefined,
            messages: [],
            canvasItems: [],
          });
        }
      },

      setFeatureMode: (mode) => {
        localStorage.setItem('featureMode', mode);
        set({ featureMode: mode });
      },

      setCardInteractionMode: (mode) => {
        localStorage.setItem('cardInteractionMode', mode);
        set({ cardInteractionMode: mode });
      },

      setPrepHeaderLayout: (mode) => {
        localStorage.setItem('prepHeaderLayout', mode);
        set({ prepHeaderLayout: mode });
      },


      setAssistantMode: (on: boolean) => {
        localStorage.setItem('assistantMode_v2', String(on));
        if (on) {
          const allAdvisors = ['jm', 'ja', 'sk'];
          localStorage.setItem('selectedAdvisors_v3', JSON.stringify(allAdvisors));
          localStorage.setItem('selectedAdvisors', JSON.stringify(allAdvisors));
          set({ assistantMode: on, selectedAdvisors: allAdvisors });
        } else {
          set({ assistantMode: on });
        }
      },
      setSelectedAdvisors: (ids: string[]) => {
        localStorage.setItem('selectedAdvisors_v3', JSON.stringify(ids));
        localStorage.setItem('selectedAdvisors', JSON.stringify(ids));
        set({ selectedAdvisors: ids });
      },
      setAdvisorFilterVariant: (v) => {
        localStorage.setItem('advisorFilterVariant_v2', v);
        set({ advisorFilterVariant: v });
      },
      setActiveTemplateName: (name: string) => set({ activeTemplateName: name }),

      // Meeting prep toggle states
      meetingPrepStates: {},
      meetingPrepStatesInitialized: false,
      setMeetingPrepState: (meetingId, enabled) => set((state) => ({
        meetingPrepStates: { ...state.meetingPrepStates, [meetingId]: enabled }
      })),
      initMeetingPrepStates: (states) => set((state) => {
        if (state.meetingPrepStatesInitialized) return state;
        return { meetingPrepStates: { ...states, ...state.meetingPrepStates }, meetingPrepStatesInitialized: true };
      }),
      // Meeting generating/processing states
      meetingGeneratingStates: {},
      setMeetingGeneratingState: (meetingId, genState) => set((state) => {
        const next = { ...state.meetingGeneratingStates };
        if (genState === null) {
          delete next[meetingId];
        } else {
          next[meetingId] = genState;
        }
        return { meetingGeneratingStates: next };
      }),
      noAgendaMeetingId: null,
      setNoAgendaMeetingId: (id) => set({ noAgendaMeetingId: id }),
      agendaIssueMeetingId: null,
      setAgendaIssueMeetingId: (id) => set({ agendaIssueMeetingId: id }),
      regeneratingMeetingId: null,
      setRegeneratingMeetingId: (id) => set({ regeneratingMeetingId: id }),
      regeneratingClientIds: {},
      setClientRegenerating: (clientId, value) => set((state) => {
        const next = { ...state.regeneratingClientIds };
        if (value) {
          next[clientId] = true;
        } else {
          delete next[clientId];
        }
        return { regeneratingClientIds: next };
      }),
    }),
    { name: 'app-store' }
  )
);

// Defer conversation loading to avoid blocking store creation
if (typeof window !== 'undefined') {
  const load = () => {
    const conversations = loadConversationsFromStorage();
    if (conversations.length > 0) {
      useAppStore.setState({ conversations });
    }
  };
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(load);
  } else {
    setTimeout(load, 0);
  }
}