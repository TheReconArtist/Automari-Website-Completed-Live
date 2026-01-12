// lib/ai/conversationMemory.ts

export interface ConversationContext {
  sessionId: string;
  userId?: string;
  companyInfo?: {
    name?: string;
    industry?: string;
    size?: string;
    location?: string;
  };
  businessProfile?: {
    painPoints: string[];
    currentSystems: string[];
    budget?: string;
    timeline?: string;
    decisionMaker?: boolean;
    automationExperience?: string;
  };
  conversationHistory: ConversationTurn[];
  leadScore?: number;
  qualification?: 'hot' | 'warm' | 'cold';
  lastUpdated: Date;
}

export interface ConversationTurn {
  id: string;
  timestamp: Date;
  userMessage: string;
  aiResponse: string;
  intent?: string;
  entities?: Record<string, any>;
  sentiment?: 'positive' | 'neutral' | 'negative';
  businessValue?: number;
}

export interface MemoryInsight {
  type: 'business_need' | 'pain_point' | 'budget' | 'timeline' | 'decision_maker' | 'competitor' | 'use_case';
  value: string;
  confidence: number;
  source: string;
  timestamp: Date;
}

export class ConversationMemory {
  private contexts: Map<string, ConversationContext> = new Map();
  private insights: Map<string, MemoryInsight[]> = new Map();

  // Initialize or retrieve conversation context
  getContext(sessionId: string): ConversationContext {
    if (!this.contexts.has(sessionId)) {
      this.contexts.set(sessionId, {
        sessionId,
        conversationHistory: [],
        lastUpdated: new Date()
      });
    }
    return this.contexts.get(sessionId)!;
  }

  // Update conversation context
  updateContext(sessionId: string, updates: Partial<ConversationContext>): void {
    const context = this.getContext(sessionId);
    const updatedContext = {
      ...context,
      ...updates,
      lastUpdated: new Date()
    };
    this.contexts.set(sessionId, updatedContext);
  }

  // Add conversation turn
  addTurn(sessionId: string, turn: ConversationTurn): void {
    const context = this.getContext(sessionId);
    context.conversationHistory.push(turn);
    context.lastUpdated = new Date();
    
    // Extract insights from the turn
    this.extractInsights(sessionId, turn);
    
    // Update business profile based on new information
    this.updateBusinessProfile(sessionId, turn);
  }

  // Extract business insights from conversation
  private extractInsights(sessionId: string, turn: ConversationTurn): void {
    const insights = this.insights.get(sessionId) || [];
    const newInsights: MemoryInsight[] = [];

    // Extract business needs
    const businessNeedPatterns = [
      /need to (automate|streamline|improve|optimize)/i,
      /looking for (solution|help|assistance)/i,
      /struggling with|challenge|problem|issue/i
    ];

    // Extract pain points
    const painPointPatterns = [
      /too much time|wasting time|inefficient/i,
      /manual process|repetitive task|tedious/i,
      /error|mistake|inconsistency/i,
      /overwhelmed|stressed|burnout/i
    ];

    // Extract budget information
    const budgetPatterns = [
      /budget|cost|price|investment|spend/i,
      /\$[\d,]+|\d+ thousand|\d+ k/i,
      /afford|expensive|cheap|value/i
    ];

    // Extract timeline information
    const timelinePatterns = [
      /asap|urgent|immediately|soon/i,
      /next month|next quarter|this year/i,
      /timeline|schedule|when|deadline/i
    ];

    // Extract decision maker information
    const decisionMakerPatterns = [
      /i decide|i make|i choose|i'm responsible/i,
      /ceo|founder|owner|director|manager/i,
      /final say|approval|sign off/i
    ];

    // Analyze user message for insights
    const userMessage = turn.userMessage.toLowerCase();
    
    // Business needs
    if (businessNeedPatterns.some(pattern => pattern.test(userMessage))) {
      newInsights.push({
        type: 'business_need',
        value: this.extractBusinessNeed(turn.userMessage),
        confidence: 0.8,
        source: turn.id,
        timestamp: turn.timestamp
      });
    }

    // Pain points
    if (painPointPatterns.some(pattern => pattern.test(userMessage))) {
      newInsights.push({
        type: 'pain_point',
        value: this.extractPainPoint(turn.userMessage),
        confidence: 0.7,
        source: turn.id,
        timestamp: turn.timestamp
      });
    }

    // Budget information
    if (budgetPatterns.some(pattern => pattern.test(userMessage))) {
      newInsights.push({
        type: 'budget',
        value: this.extractBudgetInfo(turn.userMessage),
        confidence: 0.6,
        source: turn.id,
        timestamp: turn.timestamp
      });
    }

    // Timeline information
    if (timelinePatterns.some(pattern => pattern.test(userMessage))) {
      newInsights.push({
        type: 'timeline',
        value: this.extractTimelineInfo(turn.userMessage),
        confidence: 0.7,
        source: turn.id,
        timestamp: turn.timestamp
      });
    }

    // Decision maker information
    if (decisionMakerPatterns.some(pattern => pattern.test(userMessage))) {
      newInsights.push({
        type: 'decision_maker',
        value: 'User appears to be a decision maker',
        confidence: 0.8,
        source: turn.id,
        timestamp: turn.timestamp
      });
    }

    // Add new insights
    this.insights.set(sessionId, [...insights, ...newInsights]);
  }

  // Update business profile based on conversation insights
  private updateBusinessProfile(sessionId: string, turn: ConversationTurn): void {
    const context = this.getContext(sessionId);
    const insights = this.insights.get(sessionId) || [];

    if (!context.businessProfile) {
      context.businessProfile = {
        painPoints: [],
        currentSystems: []
      };
    }

    // Update pain points
    const painPointInsights = insights.filter(i => i.type === 'pain_point');
    context.businessProfile.painPoints = [
      ...new Set([...context.businessProfile.painPoints, ...painPointInsights.map(i => i.value)])
    ];

    // Update budget
    const budgetInsights = insights.filter(i => i.type === 'budget');
    if (budgetInsights.length > 0) {
      context.businessProfile.budget = budgetInsights[budgetInsights.length - 1].value;
    }

    // Update timeline
    const timelineInsights = insights.filter(i => i.type === 'timeline');
    if (timelineInsights.length > 0) {
      context.businessProfile.timeline = timelineInsights[timelineInsights.length - 1].value;
    }

    // Update decision maker status
    const decisionMakerInsights = insights.filter(i => i.type === 'decision_maker');
    if (decisionMakerInsights.length > 0) {
      context.businessProfile.decisionMaker = true;
    }
  }

  // Extract business need from message
  private extractBusinessNeed(message: string): string {
    const patterns = [
      /need to (automate|streamline|improve|optimize) (.+)/i,
      /looking for (solution|help|assistance) with (.+)/i,
      /want to (automate|streamline|improve|optimize) (.+)/i
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        return match[2] || match[1];
      }
    }

    return 'Business process improvement';
  }

  // Extract pain point from message
  private extractPainPoint(message: string): string {
    const patterns = [
      /(too much time|wasting time|inefficient) on (.+)/i,
      /(manual process|repetitive task|tedious) (.+)/i,
      /(error|mistake|inconsistency) in (.+)/i,
      /(overwhelmed|stressed|burnout) by (.+)/i
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        return match[2] || match[1];
      }
    }

    return 'Operational inefficiency';
  }

  // Extract budget information from message
  private extractBudgetInfo(message: string): string {
    const patterns = [
      /budget is (\$[\d,]+|\d+ thousand|\d+ k)/i,
      /can spend (\$[\d,]+|\d+ thousand|\d+ k)/i,
      /looking to invest (\$[\d,]+|\d+ thousand|\d+ k)/i
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        return match[1];
      }
    }

    // Check for budget level indicators
    if (/high|large|significant|substantial/i.test(message)) {
      return 'high';
    } else if (/medium|moderate|reasonable/i.test(message)) {
      return 'medium';
    } else if (/low|small|limited|tight/i.test(message)) {
      return 'low';
    }

    return 'medium';
  }

  // Extract timeline information from message
  private extractTimelineInfo(message: string): string {
    if (/asap|urgent|immediately|soon/i.test(message)) {
      return 'urgent';
    } else if (/next month|next quarter|this year/i.test(message)) {
      return '3-6 months';
    } else if (/next year|future|eventually/i.test(message)) {
      return '6+ months';
    }

    return '3-6 months';
  }

  // Get conversation summary
  getConversationSummary(sessionId: string): string {
    const context = this.getContext(sessionId);
    const insights = this.insights.get(sessionId) || [];

    let summary = `Conversation Summary for ${context.companyInfo?.name || 'Prospect'}:\n\n`;

    // Company information
    if (context.companyInfo) {
      summary += `Company: ${context.companyInfo.name || 'Unknown'}\n`;
      summary += `Industry: ${context.companyInfo.industry || 'Unknown'}\n`;
      summary += `Size: ${context.companyInfo.size || 'Unknown'}\n\n`;
    }

    // Business profile
    if (context.businessProfile) {
      summary += `Business Profile:\n`;
      summary += `- Pain Points: ${context.businessProfile.painPoints.join(', ')}\n`;
      summary += `- Budget: ${context.businessProfile.budget || 'Unknown'}\n`;
      summary += `- Timeline: ${context.businessProfile.timeline || 'Unknown'}\n`;
      summary += `- Decision Maker: ${context.businessProfile.decisionMaker ? 'Yes' : 'Unknown'}\n\n`;
    }

    // Key insights
    if (insights.length > 0) {
      summary += `Key Insights:\n`;
      insights.forEach(insight => {
        summary += `- ${insight.type}: ${insight.value} (confidence: ${insight.confidence})\n`;
      });
    }

    // Lead qualification
    if (context.qualification) {
      summary += `\nLead Qualification: ${context.qualification.toUpperCase()}\n`;
      summary += `Lead Score: ${context.leadScore || 'Not calculated'}\n`;
    }

    return summary;
  }

  // Get relevant context for AI response
  getRelevantContext(sessionId: string, currentQuery: string): string {
    const context = this.getContext(sessionId);
    const insights = this.insights.get(sessionId) || [];
    
    let relevantContext = '';

    // Add company information
    if (context.companyInfo) {
      relevantContext += `Company: ${context.companyInfo.name || 'Unknown'}, Industry: ${context.companyInfo.industry || 'Unknown'}, Size: ${context.companyInfo.size || 'Unknown'}\n`;
    }

    // Add business profile
    if (context.businessProfile) {
      relevantContext += `Business Profile: Pain Points: ${context.businessProfile.painPoints.join(', ')}, Budget: ${context.businessProfile.budget || 'Unknown'}, Timeline: ${context.businessProfile.timeline || 'Unknown'}\n`;
    }

    // Add recent insights
    const recentInsights = insights.slice(-5); // Last 5 insights
    if (recentInsights.length > 0) {
      relevantContext += `Recent Insights: ${recentInsights.map(i => `${i.type}: ${i.value}`).join(', ')}\n`;
    }

    // Add conversation history context
    const recentTurns = context.conversationHistory.slice(-3); // Last 3 turns
    if (recentTurns.length > 0) {
      relevantContext += `Recent Conversation: ${recentTurns.map(t => `User: ${t.userMessage.substring(0, 100)}...`).join(' | ')}\n`;
    }

    return relevantContext;
  }

  // Calculate lead score based on conversation
  calculateLeadScore(sessionId: string): number {
    const context = this.getContext(sessionId);
    const insights = this.insights.get(sessionId) || [];

    let score = 0;

    // Budget factor
    if (context.businessProfile?.budget === 'high') score += 3;
    else if (context.businessProfile?.budget === 'medium') score += 2;
    else if (context.businessProfile?.budget === 'low') score += 1;

    // Timeline factor
    if (context.businessProfile?.timeline === 'urgent') score += 3;
    else if (context.businessProfile?.timeline === '3-6 months') score += 2;
    else if (context.businessProfile?.timeline === '6+ months') score += 1;

    // Decision maker factor
    if (context.businessProfile?.decisionMaker) score += 3;

    // Pain points factor
    score += Math.min(context.businessProfile?.painPoints.length || 0, 3);

    // Business needs factor
    const businessNeedInsights = insights.filter(i => i.type === 'business_need');
    score += Math.min(businessNeedInsights.length, 2);

    // Conversation engagement factor
    score += Math.min(context.conversationHistory.length, 3);

    // Normalize to 0-10 scale
    return Math.min(score, 10);
  }

  // Update lead qualification
  updateLeadQualification(sessionId: string): void {
    const score = this.calculateLeadScore(sessionId);
    const context = this.getContext(sessionId);
    
    context.leadScore = score;
    
    if (score >= 8) {
      context.qualification = 'hot';
    } else if (score >= 6) {
      context.qualification = 'warm';
    } else {
      context.qualification = 'cold';
    }
  }

  // Clear conversation context
  clearContext(sessionId: string): void {
    this.contexts.delete(sessionId);
    this.insights.delete(sessionId);
  }

  // Get all active contexts
  getAllContexts(): ConversationContext[] {
    return Array.from(this.contexts.values());
  }
}

// Export singleton instance
export const conversationMemory = new ConversationMemory();

