// @ts-nocheck
export interface ManagedQuestion {
  id: string;
  patterns: string[]; // Array of question patterns/variations
  responseTemplate: string; // Template with placeholders like {{client.name}}
  category: string;
  dataSources: string[];
  confidence: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Evaluation framework fields (optional for backward compatibility)
  prompt?: string; // Primary test prompt
  expectedResponse?: string; // Expected system response
  evaluationCriteria?: string[]; // Success criteria for response quality
  testCase?: string; // Reference to evaluation category
  synonyms?: string[]; // Alternative phrasings that should match
  priority?: 'high' | 'medium' | 'low'; // Question priority for meeting prep
  metadata?: {
    description?: string;
    examples?: string[];
    tags?: string[];
  };
}

export interface QuestionCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
  defaultDataSources: string[];
  questionCount: number;
}

export interface ResponseTemplate {
  id: string;
  name: string;
  template: string;
  placeholders: string[];
  category: string;
  examples: string[];
}

export interface QuestionMatchResult {
  question: ManagedQuestion;
  confidence: number;
  matchedPattern: string;
}

export interface TemplateProcessingResult {
  processedResponse: string;
  usedPlaceholders: string[];
  missingPlaceholders: string[];
}

export const DEFAULT_DATA_SOURCES = [
  'RedTail',
  'Uploaded documents', 
  'Schwab Advisor Center',
  'RightCapital',
  'Wealthbox',
  'Salesforce',
  'Market News'
];

export const DEFAULT_CATEGORIES: QuestionCategory[] = [
  {
    id: 'profile-retrieval',
    name: 'Profile Retrieval',
    description: 'Client demographic and personal information validation',
    color: 'blue',
    isActive: true,
    defaultDataSources: ['RedTail', 'CRM'],
    questionCount: 0
  },
  {
    id: 'account-asset',
    name: 'Account & Asset Information',
    description: 'Financial data retrieval and calculation across account types',
    color: 'green',
    isActive: true,
    defaultDataSources: ['Schwab Advisor Center', 'Portfolio Systems'],
    questionCount: 0
  },
  {
    id: 'goal-tracking',
    name: 'Goal Tracking & Planning',
    description: 'Financial planning goals and milestone tracking',
    color: 'purple',
    isActive: true,
    defaultDataSources: ['RightCapital', 'Planning Tools'],
    questionCount: 0
  },
  {
    id: 'client-meeting',
    name: 'Client Meeting',
    description: 'Meeting facilitation, agenda creation, and in-meeting support',
    color: 'cyan',
    isActive: true,
    defaultDataSources: ['Meeting Notes', 'Agenda Items', 'CRM'],
    questionCount: 0
  },
  {
    id: 'meeting-prep',
    name: 'Meeting Preparation Automation',
    description: 'Core Meeting Prep functionality for automated meeting preparation',
    color: 'orange',
    isActive: true,
    defaultDataSources: ['All Systems', 'Integrated Data'],
    questionCount: 0
  },
  {
    id: 'contextual-intelligence',
    name: 'Contextual Intelligence',
    description: 'Advisor workflow context and relevant insights',
    color: 'pink',
    isActive: true,
    defaultDataSources: ['Market Data', 'Client Analytics'],
    questionCount: 0
  }
];

export const EVALUATION_TEST_CASES: Partial<ManagedQuestion>[] = [
  // Profile Retrieval - Age & Birthday
  {
    prompt: "How old is Robert?",
    patterns: ["How old is {{client}}?", "What is {{client}}'s age?", "When was {{client}} born?"],
    responseTemplate: "{{client.name}} is {{client.age}} years old, born on {{client.birthDate}}.",
    expectedResponse: "Robert Martinez is 46 years old, born on March 15, 1979",
    evaluationCriteria: ["Accurate age calculation", "Grounded in CRM data", "Supports synonyms (birthday, DOB, age)"],
    testCase: "Age & Birthday Queries",
    synonyms: ["birthday", "DOB", "age", "birth date"],
    priority: "high",
    category: 'profile-retrieval',
    dataSources: ['RedTail', 'CRM'],
    confidence: 1.0
  },
  // Profile Retrieval - Marital Status
  {
    prompt: "What is Robert's marital status?",
    patterns: ["What is {{client}}'s marital status?", "Is {{client}} married?", "{{client}}'s relationship status"],
    responseTemplate: "{{client.name}} is {{client.maritalStatus}}.",
    expectedResponse: "Robert Martinez is married",
    evaluationCriteria: ["Correct marital status", "Concise response", "Sourced to CRM/household data"],
    testCase: "Marital Status",
    synonyms: ["married", "single", "relationship status", "spouse"],
    priority: "medium",
    category: 'profile-retrieval',
    dataSources: ['RedTail', 'CRM'],
    confidence: 1.0
  },
  // Profile Retrieval - Family Information
  {
    prompt: "How many kids does Robert have and how old are they?",
    patterns: ["How many kids does {{client}} have?", "{{client}}'s children", "Tell me about {{client}}'s family"],
    responseTemplate: "{{client.name}} has {{client.childrenCount}} children: {{client.childrenDetails}}.",
    expectedResponse: "Robert Martinez has 2 children: Emma (16) and Michael (14)",
    evaluationCriteria: ["Accurate count and ages", "Names included", "Grounded in CRM data"],
    testCase: "Family Information",
    synonyms: ["kids", "children", "family", "dependents"],
    priority: "high",
    category: 'profile-retrieval',
    dataSources: ['RedTail', 'CRM'],
    confidence: 1.0
  },
  // Account & Asset - 401k Balance
  {
    prompt: "What is the balance in Robert's 401k?",
    patterns: ["What is the balance in {{client}}'s 401k?", "{{client}}'s retirement account balance", "401k balance for {{client}}"],
    responseTemplate: "{{client.name}}'s 401(k) balance is {{client.retirement401k.balance}} as of {{client.retirement401k.lastUpdated}}.",
    expectedResponse: "Robert Martinez's 401(k) balance is $485,000 as of December 1, 2024",
    evaluationCriteria: ["Current accurate balance", "Recent date included", "Handles account type synonyms"],
    testCase: "Account Balance Queries",
    synonyms: ["401k", "retirement account", "401(k)", "employer plan"],
    priority: "high",
    category: 'account-asset',
    dataSources: ['Schwab Advisor Center', 'Portfolio Systems'],
    confidence: 1.0
  },
  // Account & Asset - Asset Allocation
  {
    prompt: "What's Robert's current asset allocation?",
    patterns: ["What's {{client}}'s current asset allocation?", "{{client}}'s portfolio allocation", "How is {{client}}'s portfolio allocated?"],
    responseTemplate: "{{client.name}}'s current asset allocation: {{client.portfolio.allocation}}.",
    expectedResponse: "Robert Martinez's allocation: 60% Stocks, 35% Bonds, 5% Cash",
    evaluationCriteria: ["Current data", "Properly calculated percentages", "Clear presentation"],
    testCase: "Asset Allocation",
    synonyms: ["allocation", "portfolio mix", "asset mix", "investment breakdown"],
    priority: "high",
    category: 'account-asset',
    dataSources: ['Schwab Advisor Center', 'Portfolio Systems'],
    confidence: 1.0
  },
  // Goal Tracking - Retirement Planning
  {
    prompt: "Is Robert on track for retirement?",
    patterns: ["Is {{client}} on track for retirement?", "{{client}}'s retirement progress", "How is {{client}} doing with retirement planning?"],
    responseTemplate: "{{client.name}} is {{client.retirementProgress.status}} for retirement. Current progress: {{client.retirementProgress.details}}.",
    expectedResponse: "Robert Martinez is on track for retirement at age 65. Current savings rate meets 85% of projected needs",
    evaluationCriteria: ["Data-driven analysis", "Clear progress indicators", "Actionable insights"],
    testCase: "Retirement Planning",
    synonyms: ["retirement", "retirement planning", "retirement goals", "retirement progress"],
    priority: "high",
    category: 'goal-tracking',
    dataSources: ['RightCapital', 'Planning Tools'],
    confidence: 0.9
  },
  // Meeting Preparation - Comprehensive Summary
  {
    prompt: "Generate meeting prep summary for Robert",
    patterns: ["Generate meeting prep summary for {{client}}", "{{client}} meeting preparation", "Prepare for {{client}} meeting"],
    responseTemplate: "Meeting Preparation Summary for {{client.name}}: {{client.meetingPrepSummary}}",
    expectedResponse: "Comprehensive one-page overview with key data points, recent changes, and action items",
    evaluationCriteria: ["All relevant information included", "Properly formatted", "Actionable insights"],
    testCase: "Comprehensive Client Summary",
    synonyms: ["meeting prep", "meeting preparation", "client summary", "meeting overview"],
    priority: "high",
    category: 'meeting-prep',
    dataSources: ['All Systems', 'Integrated Data'],
    confidence: 0.9
  },
  // Contextual Intelligence - Priority Focus
  {
    prompt: "What should I focus on in my meeting with Robert?",
    patterns: ["What should I focus on in my meeting with {{client}}?", "{{client}} meeting priorities", "Key topics for {{client}} meeting"],
    responseTemplate: "Priority topics for {{client.name}}: {{client.meetingPriorities}}",
    expectedResponse: "Prioritized list: 1. Portfolio rebalancing, 2. College funding review, 3. Tax planning",
    evaluationCriteria: ["Based on recent changes", "Considers goals and market conditions", "Actionable priorities"],
    testCase: "Priority Identification",
    synonyms: ["focus", "priorities", "key topics", "important items"],
    priority: "high",
    category: 'contextual-intelligence',
    dataSources: ['Market Data', 'Client Analytics'],
    confidence: 0.9
  }
];