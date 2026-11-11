// @ts-nocheck
// Test utilities for debugging Client Review talking points
export const ClientReviewTestUtils = {
  // Force create talking points data in localStorage for testing
  createTestTalkingPoints: (clientId: string, meetingDate: string) => {
    const testAgenda = [
      {
        id: 'planning-goals',
        title: 'Planning & Goals',
        bullets: [
          { content: 'Retirement planning discussion', includeInClientReview: true },
          { content: 'College savings strategy', includeInClientReview: true }
        ],
        talkingPoints: [
          {
            id: 'tp-planning-goals-test1',
            content: 'Test talking point 1 - Retirement planning details',
            order: 1,
            includeInReview: true,
            isUserAdded: true
          },
          {
            id: 'tp-planning-goals-test2', 
            content: 'Test talking point 2 - College savings details',
            order: 2,
            includeInReview: true,
            isUserAdded: true
          }
        ]
      },
      {
        id: 'portfolio-performance',
        title: 'Portfolio Performance & Market Insights',
        bullets: [
          { content: 'YTD performance review', includeInClientReview: true }
        ],
        talkingPoints: []
      },
      {
        id: 'next-actions',
        title: 'Suggested Next Actions',
        bullets: [
          { content: 'Schedule quarterly review', includeInClientReview: true }
        ],
        talkingPoints: []
      }
    ];

    try {
      localStorage.setItem(`agenda_${clientId}_${meetingDate}`, JSON.stringify(testAgenda));
      console.log('✅ Created test talking points in localStorage:', testAgenda);
      return true;
    } catch (error) {
      console.error('❌ Failed to create test talking points:', error);
      return false;
    }
  },

  // Check what's actually in localStorage
  inspectLocalStorage: (clientId: string, meetingDate: string) => {
    try {
      const data = localStorage.getItem(`agenda_${clientId}_${meetingDate}`);
      console.log('🔍 localStorage inspection result:', data ? JSON.parse(data) : 'No data found');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('❌ Failed to inspect localStorage:', error);
      return null;
    }
  },

  // Clear all test data
  clearTestData: (clientId: string, meetingDate: string) => {
    try {
      localStorage.removeItem(`agenda_${clientId}_${meetingDate}`);
      console.log('🧹 Cleared test data from localStorage');
      return true;
    } catch (error) {
      console.error('❌ Failed to clear test data:', error);
      return false;
    }
  }
};