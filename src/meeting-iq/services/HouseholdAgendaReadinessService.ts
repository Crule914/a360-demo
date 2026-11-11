// @ts-nocheck
import { ClientData } from '@miq/types/advisor';

// ============================================================================
// Household Agenda Readiness Service
// 
// Implements the 5-layer validation framework for determining if a household
// has sufficient data to generate a meaningful meeting agenda.
// ============================================================================

export type LayerType = 'L1' | 'L2' | 'L3' | 'L4' | 'L5';

export interface ValidationLayer {
  layer: LayerType;
  name: string;
  passed: boolean;
  percentage: number;  // 0-100 granular score
  details?: string;
}

export interface HouseholdReadiness {
  clientId: string;
  clientName: string;
  layers: ValidationLayer[];
  readinessTier: 'high' | 'medium' | 'low';
  readinessScore: number;            // 0-5, count of all layers passing
  canGenerateAgenda: boolean;        // L3 + L4 + L5 all true
  hasUpcomingMeeting: boolean;       // L1 true
  remediationSuggestion?: string;
  nextMeetingDate?: string;
}

export interface ReadinessSummary {
  totalWithMeetings: number;              // Clients with upcoming meetings
  highReadinessCount: number;             // Meetings with full data
  mediumReadinessCount: number;           // Missing L5 only
  lowReadinessCount: number;              // Missing L3 or L4
  householdsNeedingAttention: HouseholdReadiness[]; // Medium + Low only (need data remediation)
  allHouseholdsWithMeetings: HouseholdReadiness[]; // All households with meetings for filtering
}

// ============================================================================
// Layer Validation Functions
// ============================================================================

/**
 * L1 - Meeting Detection
 * Check: Appointment exists with client review flag + future date
 */
function validateL1(client: ClientData): ValidationLayer {
  const now = new Date();
  let hasFutureMeeting = false;
  
  if (client.nextMeeting) {
    const nextMeetingDate = new Date(client.nextMeeting);
    if (nextMeetingDate > now) {
      hasFutureMeeting = true;
    }
  }
  
  return {
    layer: 'L1',
    name: 'Meeting Detection',
    passed: hasFutureMeeting,
    percentage: hasFutureMeeting ? 100 : 0,
    details: hasFutureMeeting 
      ? `Future meeting scheduled` 
      : 'No scheduled meeting detected'
  };
}

/**
 * L2 - Household Association
 * Check: Valid household ID in "regarding" field AND household is active
 * Note: In mock data, all clients have valid IDs. Production would check HCRM link.
 */
function validateL2(client: ClientData): ValidationLayer {
  const hasValidId = !!client.id && client.id.length > 0;
  
  return {
    layer: 'L2',
    name: 'Household Association',
    passed: hasValidId,
    percentage: hasValidId ? 100 : 0,
    details: hasValidId ? 'Household linked' : 'No household association'
  };
}

/**
 * L3 - Context Retrieval
 * Check: At least 2 of 4 context APIs return non-empty 
 * (members, activities, review schedule, alerts)
 */
function validateL3(client: ClientData): ValidationLayer {
  let contextCount = 0;
  const sources: string[] = [];
  
  if (client.extendedHousehold && client.extendedHousehold.length > 0) {
    contextCount++;
    sources.push('household members');
  }
  if (client.relationshipHistory && client.relationshipHistory.length > 0) {
    contextCount++;
    sources.push('activities');
  }
  if (client.meetingHistory && client.meetingHistory.length > 0) {
    contextCount++;
    sources.push('review schedule');
  }
  if (client.keyMetrics?.complianceItems && client.keyMetrics.complianceItems.length > 0) {
    contextCount++;
    sources.push('alerts');
  }
  
  const percentage = Math.round((contextCount / 4) * 100);
  
  return {
    layer: 'L3',
    name: 'Context Retrieval',
    passed: contextCount >= 2,
    percentage,
    details: contextCount >= 2 
      ? `${contextCount}/4 context sources (${sources.join(', ')})` 
      : `Only ${contextCount}/4 context sources available`
  };
}

/**
 * L4 - Financial Data
 * Check: At least 1 account with non-zero balance + holdings data present
 */
function validateL4(client: ClientData): ValidationLayer {
  const hasAssets = (client.householdAssets ?? 0) > 0;
  const hasHoldings = (client.portfolioData?.topHoldings?.length ?? 0) > 0;
  const passed = hasAssets && hasHoldings;
  
  let scoreCount = 0;
  if (hasAssets) scoreCount++;
  if (hasHoldings) scoreCount++;
  const percentage = Math.round((scoreCount / 2) * 100);
  
  let details: string;
  if (passed) {
    details = 'Financial data present';
  } else if (!hasAssets && !hasHoldings) {
    details = 'Missing account balance and holdings data';
  } else if (!hasAssets) {
    details = 'Missing account balance data';
  } else {
    details = 'Missing holdings data';
  }
  
  return {
    layer: 'L4',
    name: 'Financial Data',
    passed,
    percentage,
    details
  };
}

/**
 * L5 - Content Richness
 * Check: At least 2 recent activities with notes OR meaningful AUM (>$100K)
 */
function validateL5(client: ClientData): ValidationLayer {
  const recentActivities = (client.relationshipHistory?.length ?? 0) >= 2;
  const meaningfulAUM = (client.householdAssets ?? 0) >= 100000;
  const passed = recentActivities || meaningfulAUM;
  
  let scoreCount = 0;
  if (recentActivities) scoreCount++;
  if (meaningfulAUM) scoreCount++;
  const percentage = Math.round((scoreCount / 2) * 100);
  
  let details: string;
  if (passed) {
    if (recentActivities && meaningfulAUM) {
      details = 'Rich activity history and meaningful AUM';
    } else if (recentActivities) {
      details = 'Good activity history';
    } else {
      details = 'Meaningful AUM ($100K+)';
    }
  } else {
    details = 'Minimal data - add recent activity notes or confirm AUM';
  }
  
  return {
    layer: 'L5',
    name: 'Content Richness',
    passed,
    percentage,
    details
  };
}

// ============================================================================
// Remediation Message Generator
// ============================================================================

function getRemediationSuggestion(layers: ValidationLayer[]): string | undefined {
  const l1 = layers.find(l => l.layer === 'L1');
  const l2 = layers.find(l => l.layer === 'L2');
  const l3 = layers.find(l => l.layer === 'L3');
  const l4 = layers.find(l => l.layer === 'L4');
  const l5 = layers.find(l => l.layer === 'L5');
  
  // High readiness, no meeting - primary use case for on-demand agenda
  if (l3?.passed && l4?.passed && l5?.passed && !l1?.passed) {
    return "We have all the data to create a compelling agenda for this household, but we can't identify upcoming meetings because you haven't marked a client review flag or synced your Outlook to HCRM.";
  }
  
  // Meeting detected but household association missing
  if (l1?.passed && !l2?.passed) {
    return "Meeting detected but household association missing. Link the appointment to a household in HCRM.";
  }
  
  // No meeting and no household link
  if (!l1?.passed && !l2?.passed) {
    return "No scheduled meeting and no household linked. Schedule a meeting and ensure it's associated with this household.";
  }
  
  // Missing context data
  if (!l3?.passed) {
    return "Missing context data. Ensure household members, activities, or review schedule are populated.";
  }
  
  // No financial data
  if (!l4?.passed) {
    return "No financial data. Link at least one account with holdings to this household.";
  }
  
  // Minimal content
  if (!l5?.passed) {
    return "Data is minimal. Add recent activity notes or confirm AUM for richer agenda content.";
  }
  
  return undefined;
}

// ============================================================================
// Readiness Calculation
// ============================================================================

function calculateReadinessTier(layers: ValidationLayer[]): 'high' | 'medium' | 'low' {
  const l3 = layers.find(l => l.layer === 'L3')?.passed ?? false;
  const l4 = layers.find(l => l.layer === 'L4')?.passed ?? false;
  const l5 = layers.find(l => l.layer === 'L5')?.passed ?? false;
  
  // High Readiness: L3 + L4 + L5 all TRUE (can generate compelling agenda)
  if (l3 && l4 && l5) {
    return 'high';
  }
  
  // Medium Readiness: L3 + L4 TRUE, L5 FALSE (basic agenda possible)
  if (l3 && l4) {
    return 'medium';
  }
  
  // Low Readiness: Less than L3 + L4 (insufficient data)
  return 'low';
}

export function evaluateHouseholdReadiness(client: ClientData): HouseholdReadiness {
  const layers: ValidationLayer[] = [
    validateL1(client),
    validateL2(client),
    validateL3(client),
    validateL4(client),
    validateL5(client),
  ];
  
  const readinessTier = calculateReadinessTier(layers);
  const l1 = layers.find(l => l.layer === 'L1');
  const l3 = layers.find(l => l.layer === 'L3');
  const l4 = layers.find(l => l.layer === 'L4');
  const l5 = layers.find(l => l.layer === 'L5');
  
  const canGenerateAgenda = !!(l3?.passed && l4?.passed && l5?.passed);
  const hasUpcomingMeeting = l1?.passed ?? false;
  const readinessScore = layers.filter(l => l.passed).length;
  
  // Get next meeting date if available
  let nextMeetingDate: string | undefined;
  if (client.nextMeeting) {
    const date = new Date(client.nextMeeting);
    if (date > new Date()) {
      nextMeetingDate = date.toISOString();
    }
  }
  
  return {
    clientId: client.id,
    clientName: client.name,
    layers,
    readinessTier,
    readinessScore,
    canGenerateAgenda,
    hasUpcomingMeeting,
    remediationSuggestion: getRemediationSuggestion(layers),
    nextMeetingDate,
  };
}

// ============================================================================
// Summary Calculation
// ============================================================================

export function getReadinessSummary(clients: ClientData[]): ReadinessSummary {
  if (clients.length === 0) {
    return {
      totalWithMeetings: 0,
      highReadinessCount: 0,
      mediumReadinessCount: 0,
      lowReadinessCount: 0,
      householdsNeedingAttention: [],
      allHouseholdsWithMeetings: [],
    };
  }
  
  const readinessResults = clients.map(evaluateHouseholdReadiness);
  
  // Only count clients with upcoming meetings
  const withMeetings = readinessResults.filter(r => r.hasUpcomingMeeting);
  
  const highReadinessCount = withMeetings.filter(r => r.readinessTier === 'high').length;
  const mediumReadinessCount = withMeetings.filter(r => r.readinessTier === 'medium').length;
  const lowReadinessCount = withMeetings.filter(r => r.readinessTier === 'low').length;
  
  // Sort all households by meeting date (earliest first)
  const allHouseholdsWithMeetings = withMeetings.sort((a, b) => {
    if (a.nextMeetingDate && b.nextMeetingDate) {
      return new Date(a.nextMeetingDate).getTime() - new Date(b.nextMeetingDate).getTime();
    }
    return 0;
  });
  
  // Households needing attention: those with meetings but missing data (medium or low readiness)
  const householdsNeedingAttention = allHouseholdsWithMeetings
    .filter(r => r.readinessTier !== 'high')
    .slice(0, 10);
  
  return {
    totalWithMeetings: withMeetings.length,
    highReadinessCount,
    mediumReadinessCount,
    lowReadinessCount,
    householdsNeedingAttention,
    allHouseholdsWithMeetings,
  };
}

/**
 * Get short display name for a failing layer
 */
export function getLayerDisplayName(layer: LayerType): string {
  switch (layer) {
    case 'L3': return 'Context';
    case 'L4': return 'Financial Data';
    case 'L5': return 'Content Richness';
    default: return layer;
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

export function getLayerStatusIcon(passed: boolean): string {
  return passed ? '✓' : '✗';
}

export function getTierColor(tier: 'high' | 'medium' | 'low'): {
  bg: string;
  text: string;
  border: string;
} {
  switch (tier) {
    case 'high':
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-600',
        border: 'border-emerald-500/20',
      };
    case 'medium':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-600',
        border: 'border-amber-500/20',
      };
    case 'low':
      return {
        bg: 'bg-rose-500/10',
        text: 'text-rose-600',
        border: 'border-rose-500/20',
      };
  }
}

export function getTierLabel(tier: 'high' | 'medium' | 'low'): string {
  switch (tier) {
    case 'high':
      return 'High Readiness';
    case 'medium':
      return 'Medium Readiness';
    case 'low':
      return 'Low Readiness';
  }
}

/**
 * Create a readiness result for meetings with no client match.
 * L1 passes (meeting exists), L2 fails (no household association), 
 * and L3-L5 all fail (can't retrieve data without household).
 */
export function createUnmatchedClientReadiness(meetingId: string, clientName: string): HouseholdReadiness {
  const layers: ValidationLayer[] = [
    {
      layer: 'L1',
      name: 'Meeting Detection',
      passed: true,
      percentage: 100,
      details: 'Meeting scheduled'
    },
    {
      layer: 'L2',
      name: 'Household Association',
      passed: false,
      percentage: 0,
      details: 'No household match found - client not in system'
    },
    {
      layer: 'L3',
      name: 'Context Retrieval',
      passed: false,
      percentage: 0,
      details: 'Cannot retrieve context without household association'
    },
    {
      layer: 'L4',
      name: 'Financial Data',
      passed: false,
      percentage: 0,
      details: 'Cannot retrieve financial data without household association'
    },
    {
      layer: 'L5',
      name: 'Content Richness',
      passed: false,
      percentage: 0,
      details: 'Cannot assess content without household association'
    },
  ];

  return {
    clientId: meetingId,
    clientName,
    layers,
    readinessTier: 'low',
    readinessScore: 1,
    canGenerateAgenda: false,
    hasUpcomingMeeting: true,
    remediationSuggestion: 'No household match found. Import or link this client to a household in HCRM.',
  };
}

// ============================================================================
// Content Readiness (L3-L5 Only) - For Clients Without Meetings
// ============================================================================

export interface ContentReadiness {
  clientId: string;
  clientName: string;
  serviceTier?: 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
  contentLayers: ValidationLayer[];  // Only L3, L4, L5
  contentScore: number;              // 0-3 based on L3-L5 passing
  contentPercentage: number;         // Average of L3, L4, L5 percentages
  tier: 'high' | 'medium' | 'low';
  hasContext: boolean;               // L3 passed
  hasFinancials: boolean;            // L4 passed
  hasRichContent: boolean;           // L5 passed
  lastMeetingDate?: string;          // Last meeting date (ISO string)
  lastTouchPointDate?: string;       // Last touch point/activity date (ISO string)
}

/**
 * Evaluate content readiness for a client using only L3-L5 layers.
 * Used for clients without scheduled meetings to determine data quality.
 */
export function evaluateContentReadiness(client: ClientData): ContentReadiness {
  const l3 = validateL3(client);
  const l4 = validateL4(client);
  const l5 = validateL5(client);
  
  const contentLayers = [l3, l4, l5];
  const contentScore = contentLayers.filter(l => l.passed).length;
  const contentPercentage = Math.round(contentLayers.reduce((sum, l) => sum + l.percentage, 0) / contentLayers.length);
  
  let tier: 'high' | 'medium' | 'low';
  if (contentScore === 3) {
    tier = 'high';
  } else if (contentScore >= 2) {
    tier = 'medium';
  } else {
    tier = 'low';
  }
  
  // Helper to generate a stable "random" date based on client name (deterministic)
  const getStableDateWithinRange = (clientName: string, maxMonths: number): Date => {
    // Use client name hash to get stable "random" values per client
    let hash = 0;
    for (let i = 0; i < clientName.length; i++) {
      hash = ((hash << 5) - hash) + clientName.charCodeAt(i);
      hash |= 0;
    }
    const now = new Date();
    // Generate days offset between 30 days and maxMonths * 30 days
    const minDays = 30;
    const maxDays = maxMonths * 30;
    const daysAgo = minDays + (Math.abs(hash) % (maxDays - minDays));
    return new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  };
  
  // Extract last meeting date - cap at 15 months old
  const maxMeetingMonths = 15;
  const maxMeetingMs = maxMeetingMonths * 30 * 24 * 60 * 60 * 1000;
  let lastMeetingDate: string | undefined;
  if (client.lastMeeting) {
    const date = new Date(client.lastMeeting);
    if (!isNaN(date.getTime())) {
      const now = new Date();
      // If date is older than 15 months, generate a stable date within range
      if (now.getTime() - date.getTime() > maxMeetingMs) {
        lastMeetingDate = getStableDateWithinRange(client.name + '_meeting', maxMeetingMonths).toISOString();
      } else {
        lastMeetingDate = date.toISOString();
      }
    }
  }
  
  // Extract last touch point from relationship history - cap at 11 months old
  const maxTouchMonths = 11;
  const maxTouchMs = maxTouchMonths * 30 * 24 * 60 * 60 * 1000;
  let lastTouchPointDate: string | undefined;
  if (client.relationshipHistory && client.relationshipHistory.length > 0) {
    const sortedHistory = [...client.relationshipHistory].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
    const mostRecent = sortedHistory[0];
    if (mostRecent) {
      const date = new Date(mostRecent.date);
      if (!isNaN(date.getTime())) {
        const now = new Date();
        // If date is older than 11 months, generate a stable date within range
        if (now.getTime() - date.getTime() > maxTouchMs) {
          lastTouchPointDate = getStableDateWithinRange(client.name + '_touch', maxTouchMonths).toISOString();
        } else {
          lastTouchPointDate = date.toISOString();
        }
      }
    }
  }
  
  return {
    clientId: client.id,
    clientName: client.name,
    serviceTier: client.serviceTier,
    contentLayers,
    contentScore,
    contentPercentage,
    tier,
    hasContext: l3.passed,
    hasFinancials: l4.passed,
    hasRichContent: l5.passed,
    lastMeetingDate,
    lastTouchPointDate,
  };
}

/**
 * Get all clients without scheduled meetings, evaluated for content readiness.
 * Sorted by content score (highest first) to prioritize "ready to schedule" clients.
 */
export function getClientsWithoutMeetings(clients: ClientData[]): ContentReadiness[] {
  const now = new Date();
  
  // Filter to clients without future meetings (L1 fails)
  const clientsWithoutMeetings = clients.filter(client => {
    if (!client.nextMeeting) return true;
    const nextMeetingDate = new Date(client.nextMeeting);
    return nextMeetingDate <= now;
  });
  
  // Evaluate content readiness for each
  const readinessResults = clientsWithoutMeetings.map(evaluateContentReadiness);
  
  // Sort by content score descending (best candidates first)
  const sorted = readinessResults.sort((a, b) => b.contentScore - a.contentScore);
  
  // Apply demo overrides for varied failure examples
  // Apply failures to specific indices to create a mixed pattern
  // Indices 1, 3, 5 get failures; 0, 2, 4+ stay as high tier (all green)
  
  if (sorted.length >= 2) {
    // Index 1: L3 fails only (Context missing)
    sorted[1].contentLayers[0] = { ...sorted[1].contentLayers[0], passed: false, details: 'Missing context data (demo)' };
    sorted[1].hasContext = false;
    sorted[1].contentScore = sorted[1].contentLayers.filter(l => l.passed).length;
    sorted[1].contentPercentage = Math.round(sorted[1].contentLayers.reduce((sum, l) => sum + l.percentage, 0) / sorted[1].contentLayers.length);
    sorted[1].tier = sorted[1].contentScore === 3 ? 'high' : sorted[1].contentScore >= 2 ? 'medium' : 'low';
  }
  
  if (sorted.length >= 4) {
    // Index 3: L4 fails only (Financials missing)
    sorted[3].contentLayers[1] = { ...sorted[3].contentLayers[1], passed: false, details: 'Missing financial data (demo)' };
    sorted[3].hasFinancials = false;
    sorted[3].contentScore = sorted[3].contentLayers.filter(l => l.passed).length;
    sorted[3].contentPercentage = Math.round(sorted[3].contentLayers.reduce((sum, l) => sum + l.percentage, 0) / sorted[3].contentLayers.length);
    sorted[3].tier = sorted[3].contentScore === 3 ? 'high' : sorted[3].contentScore >= 2 ? 'medium' : 'low';
  }
  
  if (sorted.length >= 6) {
    // Index 5: L5 fails only (Content minimal)
    sorted[5].contentLayers[2] = { ...sorted[5].contentLayers[2], passed: false, details: 'Minimal content (demo)' };
    sorted[5].hasRichContent = false;
    sorted[5].contentScore = sorted[5].contentLayers.filter(l => l.passed).length;
    sorted[5].contentPercentage = Math.round(sorted[5].contentLayers.reduce((sum, l) => sum + l.percentage, 0) / sorted[5].contentLayers.length);
    sorted[5].tier = sorted[5].contentScore === 3 ? 'high' : sorted[5].contentScore >= 2 ? 'medium' : 'low';
  }
  
  return sorted;
}
