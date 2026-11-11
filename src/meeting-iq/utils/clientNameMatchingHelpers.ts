// @ts-nocheck
import { ClientData } from '@miq/types/advisor';

/**
 * Enhanced client name matching utility with improved logic for household names
 */
export class ClientNameMatcher {
  private static logDebug = (message: string, ...args: any[]) => {
    console.log(`🔍 CLIENT MATCHER: ${message}`, ...args);
  };

  /**
   * Find the best matching client using multiple strategies
   */
  static findMatchingClient(searchName: string, allClients: ClientData[]): ClientData | null {
    if (!searchName || !allClients?.length) {
      this.logDebug('Invalid input - missing searchName or clients');
      return null;
    }

    const validClients = allClients.filter(c => c && c.name);
    this.logDebug('Searching for client:', searchName);
    this.logDebug('Available clients:', validClients.map(c => c.name));

    // Strategy 1: Exact match
    let match = validClients.find(c => c.name === searchName);
    if (match) {
      this.logDebug('✅ EXACT MATCH found:', match.name);
      return match;
    }

    // Strategy 2: Case-insensitive exact match
    match = validClients.find(c => c.name.toLowerCase() === searchName.toLowerCase());
    if (match) {
      this.logDebug('✅ CASE-INSENSITIVE MATCH found:', match.name);
      return match;
    }

    // Strategy 3: Name variation matching (Sara/Sarah, Mike/Michael, etc.)
    match = this.findNameVariationMatch(searchName, validClients);
    if (match) {
      this.logDebug('✅ NAME VARIATION MATCH found:', match.name);
      return match;
    }

    // Strategy 4: Household name matching (for names > 5 chars to avoid false positives)
    if (searchName.length > 5) {
      match = this.findHouseholdMatch(searchName, validClients);
      if (match) {
        this.logDebug('✅ HOUSEHOLD MATCH found:', match.name);
        return match;
      }
    }

    this.logDebug('❌ NO MATCH found for:', searchName);
    return null;
  }

  /**
   * Handle common name variations (Sara/Sarah, Mike/Michael, etc.)
   */
  private static findNameVariationMatch(searchName: string, clients: ClientData[]): ClientData | null {
    const nameVariations = new Map([
      // Common female name variations
      ['sara', 'sarah'],
      ['sarah', 'sara'],
      ['catherine', 'kate'],
      ['kate', 'catherine'],
      ['katherine', 'kate'],
      ['kate', 'katherine'],
      ['elizabeth', 'liz'],
      ['liz', 'elizabeth'],
      ['elizabeth', 'beth'],
      ['beth', 'elizabeth'],
      ['margaret', 'meg'],
      ['meg', 'margaret'],
      ['jennifer', 'jen'],
      ['jen', 'jennifer'],
      ['susan', 'sue'],
      ['sue', 'susan'],
      ['patricia', 'pat'],
      ['pat', 'patricia'],
      ['deborah', 'deb'],
      ['deb', 'deborah'],
      
      // Common male name variations
      ['michael', 'mike'],
      ['mike', 'michael'],
      ['william', 'bill'],
      ['bill', 'william'],
      ['william', 'will'],
      ['will', 'william'],
      ['robert', 'bob'],
      ['bob', 'robert'],
      ['robert', 'rob'],
      ['rob', 'robert'],
      ['richard', 'rick'],
      ['rick', 'richard'],
      ['richard', 'dick'],
      ['dick', 'richard'],
      ['james', 'jim'],
      ['jim', 'james'],
      ['john', 'jack'],
      ['jack', 'john'],
      ['thomas', 'tom'],
      ['tom', 'thomas'],
      ['david', 'dave'],
      ['dave', 'david'],
      ['christopher', 'chris'],
      ['chris', 'christopher'],
      ['matthew', 'matt'],
      ['matt', 'matthew'],
      ['andrew', 'andy'],
      ['andy', 'andrew'],
      ['joseph', 'joe'],
      ['joe', 'joseph']
    ]);

    const searchWords = searchName.toLowerCase().trim().split(/\s+/);
    
    return clients.find(client => {
      const clientWords = client.name.toLowerCase().trim().split(/\s+/);
      
      // Check if we can match all search words with client words (including variations)
      const allWordsMatch = searchWords.every(searchWord => {
        return clientWords.some(clientWord => {
          // Exact match
          if (clientWord === searchWord) return true;
          
          // Check name variations
          const variation = nameVariations.get(searchWord);
          if (variation && clientWord === variation) {
            this.logDebug(`Name variation match: "${searchWord}" → "${variation}" in client "${client.name}"`);
            return true;
          }
          
          return false;
        });
      });

      return allWordsMatch;
    });
  }

  /**
   * Handle household name matching (e.g., "David Williams" should match "David & Carol Williams")
   */
  private static findHouseholdMatch(searchName: string, clients: ClientData[]): ClientData | null {
    const searchWords = searchName.toLowerCase().trim().split(/\s+/);
    
    return clients.find(client => {
      const clientWords = client.name.toLowerCase().trim().split(/\s+/);
      
      // For household matching, we need at least 2 matching words for safety
      const matchingWords = searchWords.filter(searchWord => 
        clientWords.some(clientWord => {
          // Exact word match
          if (clientWord === searchWord) return true;
          
          // Partial match for longer words (> 3 chars)
          if (clientWord.length > 3 && searchWord.length > 3) {
            return clientWord.includes(searchWord) || searchWord.includes(clientWord);
          }
          
          return false;
        })
      );

      const hasStrongMatch = matchingWords.length >= 2;
      
      if (hasStrongMatch) {
        this.logDebug('Household match candidate:', client.name, 'matching words:', matchingWords);
      }

      return hasStrongMatch;
    });
  }

  /**
   * Validate client data consistency
   */
  static validateClientData(clients: ClientData[]): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    // Check for duplicate names
    const nameMap = new Map<string, number>();
    clients.forEach(client => {
      const count = nameMap.get(client.name) || 0;
      nameMap.set(client.name, count + 1);
    });

    nameMap.forEach((count, name) => {
      if (count > 1) {
        issues.push(`Duplicate client name found: "${name}" (${count} instances)`);
      }
    });

    // Check for missing demographics
    const missingDemographics = clients.filter(client => !client.demographics);
    if (missingDemographics.length > 0) {
      issues.push(`${missingDemographics.length} clients missing demographics data`);
    }

    // Check for inconsistent demographics format
    clients.forEach(client => {
      if (client.demographics) {
        const { ages, relationship } = client.demographics;
        
        // Validate ages format
        if (ages && ages.includes('(') && ages.includes(')')) {
          // Old format detected - should be cleaned up
          issues.push(`Client "${client.name}" has old demographics format in ages field`);
        }

        // Validate relationship values
        if (relationship) {
          const validRelationships = ['Married couple', 'Single', 'Single Parent', 'Widow', 'Widower'];
          if (!validRelationships.includes(relationship)) {
            issues.push(`Client "${client.name}" has invalid relationship value: "${relationship}"`);
          }
        }
      }
    });

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  /**
   * Generate matching statistics for debugging
   */
  static generateMatchingStats(meetingNames: string[], clients: ClientData[]): void {
    this.logDebug('=== CLIENT MATCHING STATISTICS ===');
    
    const stats = {
      totalMeetings: meetingNames.length,
      exactMatches: 0,
      householdMatches: 0,
      noMatches: 0,
      unmatched: [] as string[]
    };

    meetingNames.forEach(name => {
      const match = this.findMatchingClient(name, clients);
      if (match) {
        if (match.name === name) {
          stats.exactMatches++;
        } else {
          stats.householdMatches++;
        }
      } else {
        stats.noMatches++;
        stats.unmatched.push(name);
      }
    });

    this.logDebug('Matching Statistics:', stats);
    
    if (stats.unmatched.length > 0) {
      this.logDebug('⚠️ Unmatched meeting names:', stats.unmatched);
      this.logDebug('Available client names:', clients.map(c => c.name));
    }
  }
}

/**
 * Legacy function for backwards compatibility
 */
export const findClientByName = (searchName: string, clients: ClientData[]): ClientData | null => {
  return ClientNameMatcher.findMatchingClient(searchName, clients);
};