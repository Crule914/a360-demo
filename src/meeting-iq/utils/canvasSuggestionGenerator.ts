// @ts-nocheck
import { CanvasUpdate, ClientData } from '../types/advisor';

export interface CanvasSuggestion {
  text: string;
  prompt: string;
  canvasType?: string;
  priority: number;
}

export class CanvasSuggestionGenerator {
  private static instance: CanvasSuggestionGenerator;

  static getInstance(): CanvasSuggestionGenerator {
    if (!CanvasSuggestionGenerator.instance) {
      CanvasSuggestionGenerator.instance = new CanvasSuggestionGenerator();
    }
    return CanvasSuggestionGenerator.instance;
  }

  /**
   * Generate context-aware suggestions based on current canvas state
   */
  generateSuggestions(
    displayedItems: CanvasUpdate[],
    queuedItems: CanvasUpdate[],
    currentClient?: ClientData
  ): CanvasSuggestion[] {
    const suggestions: CanvasSuggestion[] = [];

    // If showing meeting summary, suggest agenda and other prep items
    if (displayedItems.some(item => item.type === 'meeting_summary')) {
      suggestions.push({
        text: 'View detailed meeting agenda',
        prompt: currentClient ? `Show meeting agenda for ${currentClient.name}` : 'Show meeting agenda',
        canvasType: 'meeting_agenda',
        priority: 10
      });

      suggestions.push({
        text: 'Show talking points and preparation notes',
        prompt: currentClient ? `Show talking points for ${currentClient.name}` : 'Show talking points',
        priority: 8
      });

      suggestions.push({
        text: 'Review compliance checklist',
        prompt: currentClient ? `Show compliance requirements for ${currentClient.name}` : 'Show compliance checklist',
        canvasType: 'compliance_overview',
        priority: 7
      });
    }

    // If showing agenda, suggest other related items
    if (displayedItems.some(item => item.type === 'meeting_agenda')) {
      suggestions.push({
        text: 'Show portfolio details',
        prompt: currentClient ? `Show portfolio details for ${currentClient.name}` : 'Show portfolio overview',
        canvasType: 'portfolio_overview',
        priority: 8
      });

      suggestions.push({
        text: 'Show market insights',
        prompt: 'Show current market insights and impact analysis',
        canvasType: 'market_insights',
        priority: 6
      });
    }

    // Add suggestions for queued items
    queuedItems.forEach(item => {
      const suggestion = this.createSuggestionForItem(item, currentClient);
      if (suggestion) {
        suggestions.push(suggestion);
      }
    });

    // If no specific context, provide general suggestions
    if (suggestions.length === 0 && currentClient) {
      suggestions.push(
        {
          text: 'Show client CRM data',
          prompt: `Show CRM data for ${currentClient.name}`,
          canvasType: 'client_crm_data',
          priority: 5
        },
        {
          text: 'View portfolio performance',
          prompt: `Show portfolio performance for ${currentClient.name}`,
          canvasType: 'portfolio_overview',
          priority: 6
        },
        {
          text: 'Check compliance status',
          prompt: `Show compliance overview for ${currentClient.name}`,
          canvasType: 'compliance_overview',
          priority: 4
        }
      );
    }

    // Sort by priority and return top 3
    return suggestions
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3);
  }

  /**
   * Create a suggestion for a specific canvas item
   */
  private createSuggestionForItem(item: CanvasUpdate, currentClient?: ClientData): CanvasSuggestion | null {
    const clientName = currentClient?.name || item.data?.client?.name;

    switch (item.type) {
      case 'meeting_agenda':
        return {
          text: 'View detailed meeting agenda',
          prompt: clientName ? `Show meeting agenda for ${clientName}` : 'Show meeting agenda',
          canvasType: 'meeting_agenda',
          priority: 10
        };

      case 'portfolio_overview':
        return {
          text: 'Show portfolio performance',
          prompt: clientName ? `Show portfolio details for ${clientName}` : 'Show portfolio overview',
          canvasType: 'portfolio_overview',
          priority: 8
        };

      case 'compliance_overview':
        return {
          text: 'Review compliance requirements',
          prompt: clientName ? `Show compliance status for ${clientName}` : 'Show compliance overview',
          canvasType: 'compliance_overview',
          priority: 7
        };

      case 'client_crm_data':
        return {
          text: 'Show client CRM details',
          prompt: clientName ? `Show CRM data for ${clientName}` : 'Show client data',
          canvasType: 'client_crm_data',
          priority: 6
        };

      case 'market_insights':
        return {
          text: 'View market insights',
          prompt: 'Show current market insights and impact analysis',
          canvasType: 'market_insights',
          priority: 5
        };

      default:
        return null;
    }
  }

  /**
   * Generate meeting prep priority for canvas items
   */
  getMeetingPrepPriority(item: CanvasUpdate): number {
    switch (item.type) {
      case 'meeting_summary':
        return 100; // Always show first
      case 'meeting_agenda':
        return 90;  // Second priority
      case 'compliance_overview':
        return 80;
      case 'portfolio_overview':
        return 70;
      case 'client_crm_data':
        return 60;
      case 'market_insights':
        return 50;
      case 'daily_highlights':
        return 30;
      default:
        return 10;
    }
  }
}