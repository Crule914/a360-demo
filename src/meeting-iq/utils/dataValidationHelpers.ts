// @ts-nocheck
import { ClientData } from '@miq/types/advisor';
import { getEnhancedMeetingsList } from '@miq/data/mockDailyHighlights';
import { mockClients } from '@miq/data/mockClients';
import { ClientNameMatcher } from './clientNameMatchingHelpers';

/**
 * Data validation and debugging utilities for client and meeting data
 */
export class DataValidator {
  /**
   * Run comprehensive validation of meeting and client data alignment
   */
  static validateDataIntegrity(): {
    isValid: boolean;
    summary: string;
    details: {
      clientValidation: any;
      meetingValidation: any;
      matchingStats: any;
    };
  } {
    console.log('🔍 DATA VALIDATION: Starting comprehensive validation...');
    
    // Validate client data consistency
    const clientValidation = ClientNameMatcher.validateClientData(mockClients);
    
    // Get all meeting names from the daily highlights (daily view)
    const meetings = getEnhancedMeetingsList(undefined, false);
    const meetingNames = meetings.map(m => m.clientName);
    const uniqueMeetingNames = [...new Set(meetingNames)];
    
    // Validate meeting-client name alignment
    const matchingStats = this.validateMeetingClientAlignment(uniqueMeetingNames, mockClients);
    
    // Overall validation
    const isValid = clientValidation.isValid && matchingStats.unmatchedCount === 0;
    
    const summary = isValid 
      ? '✅ All data validation checks passed!'
      : `❌ Found ${clientValidation.issues.length} client issues and ${matchingStats.unmatchedCount} unmatched meetings`;
    
    const details = {
      clientValidation,
      meetingValidation: {
        totalMeetings: meetingNames.length,
        uniqueClients: uniqueMeetingNames.length,
        meetingNames: uniqueMeetingNames
      },
      matchingStats
    };
    
    console.log('📊 DATA VALIDATION SUMMARY:', summary);
    console.log('📋 DETAILS:', details);
    
    return { isValid, summary, details };
  }
  
  /**
   * Validate meeting-client name alignment
   */
  private static validateMeetingClientAlignment(meetingNames: string[], clients: ClientData[]) {
    const stats = {
      totalMeetings: meetingNames.length,
      exactMatches: 0,
      partialMatches: 0,
      unmatchedCount: 0,
      unmatched: [] as string[],
      matches: [] as Array<{ meetingName: string; clientName: string; matchType: string }>
    };
    
    meetingNames.forEach(meetingName => {
      const client = ClientNameMatcher.findMatchingClient(meetingName, clients);
      
      if (client) {
        const matchType = client.name === meetingName ? 'exact' : 'partial';
        if (matchType === 'exact') {
          stats.exactMatches++;
        } else {
          stats.partialMatches++;
        }
        
        stats.matches.push({
          meetingName,
          clientName: client.name,
          matchType
        });
      } else {
        stats.unmatchedCount++;
        stats.unmatched.push(meetingName);
      }
    });
    
    return stats;
  }
  
  /**
   * Generate detailed report for debugging
   */
  static generateDetailedReport(): void {
    console.log('\n=== COMPREHENSIVE DATA VALIDATION REPORT ===');
    
    const validation = this.validateDataIntegrity();
    
    console.log('\n📊 OVERALL STATUS:');
    console.log(validation.summary);
    
    console.log('\n👥 CLIENT DATA VALIDATION:');
    if (validation.details.clientValidation.isValid) {
      console.log('✅ All client data is valid');
    } else {
      console.log('❌ Client data issues found:');
      validation.details.clientValidation.issues.forEach((issue: string) => {
        console.log(`  - ${issue}`);
      });
    }
    
    console.log('\n📅 MEETING DATA VALIDATION:');
    console.log(`Total meetings: ${validation.details.meetingValidation.totalMeetings}`);
    console.log(`Unique clients in meetings: ${validation.details.meetingValidation.uniqueClients}`);
    console.log('Meeting client names:', validation.details.meetingValidation.meetingNames);
    
    console.log('\n🔗 MATCHING STATISTICS:');
    const { matchingStats } = validation.details;
    console.log(`Exact matches: ${matchingStats.exactMatches}`);
    console.log(`Partial matches: ${matchingStats.partialMatches}`);
    console.log(`Unmatched meetings: ${matchingStats.unmatchedCount}`);
    
    if (matchingStats.unmatched.length > 0) {
      console.log('\n⚠️ UNMATCHED MEETING NAMES:');
      matchingStats.unmatched.forEach((name: string) => {
        console.log(`  - "${name}"`);
      });
      
      console.log('\n📋 AVAILABLE CLIENT NAMES:');
      mockClients.forEach(client => {
        console.log(`  - "${client.name}"`);
      });
    }
    
    console.log('\n✅ SUCCESSFUL MATCHES:');
    matchingStats.matches.forEach((match: any) => {
      const icon = match.matchType === 'exact' ? '🎯' : '🔗';
      console.log(`${icon} "${match.meetingName}" → "${match.clientName}" (${match.matchType})`);
    });
    
    console.log('\n=== END REPORT ===\n');
  }
  
  /**
   * Auto-fix common data issues (demonstration purposes)
   */
  static suggestDataFixes(): string[] {
    const suggestions = [];
    const validation = this.validateDataIntegrity();
    
    if (validation.details.matchingStats.unmatchedCount > 0) {
      suggestions.push('Update meeting client names in mockDailyHighlights.ts to match existing client names');
      validation.details.matchingStats.unmatched.forEach((name: string) => {
        suggestions.push(`  - Replace "${name}" with an existing client name`);
      });
    }
    
    validation.details.clientValidation.issues.forEach((issue: string) => {
      if (issue.includes('demographics format')) {
        suggestions.push('Clean up demographics.ages field to only include primary client ages');
      }
      if (issue.includes('missing demographics')) {
        suggestions.push('Add missing demographics data for clients');
      }
    });
    
    return suggestions;
  }
}

/**
 * Initialize validation on app load (development only)
 */
export const runDataValidation = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Running data validation after client updates...');
    DataValidator.generateDetailedReport();
  }
};