// lib/ai/analytics.ts

import { conversationMemory, ConversationContext } from './conversationMemory';
import { leadQualification, LeadProfile } from './leadQualification';

export interface ConversationAnalytics {
  sessionId: string;
  metrics: {
    totalMessages: number;
    averageResponseTime: number;
    engagementScore: number;
    businessValueScore: number;
    conversionProbability: number;
    timeSpent: number;
  };
  insights: {
    topIntents: string[];
    painPoints: string[];
    businessNeeds: string[];
    budgetIndicators: string[];
    timelineIndicators: string[];
    decisionMakerSignals: string[];
  };
  trends: {
    messageFrequency: number;
    questionPatterns: string[];
    interestAreas: string[];
    objectionPatterns: string[];
  };
  recommendations: {
    nextActions: string[];
    contentSuggestions: string[];
    followUpStrategy: string;
    personalizationTips: string[];
  };
  timestamp: Date;
}

export interface BusinessIntelligence {
  overallMetrics: {
    totalConversations: number;
    averageQualificationScore: number;
    conversionRate: number;
    averageEngagementScore: number;
    topIndustries: Array<{ industry: string; count: number; avgScore: number }>;
    topPainPoints: Array<{ painPoint: string; frequency: number; impact: number }>;
  };
  leadInsights: {
    hotLeads: number;
    warmLeads: number;
    coldLeads: number;
    averageLeadScore: number;
    topPerformingIndustries: string[];
    commonObjections: string[];
    successFactors: string[];
  };
  performanceMetrics: {
    responseTime: number;
    userSatisfaction: number;
    conversationCompletionRate: number;
    leadQualityScore: number;
    businessValueGenerated: number;
  };
  recommendations: {
    processImprovements: string[];
    contentOptimizations: string[];
    targetingSuggestions: string[];
    automationOpportunities: string[];
  };
  timestamp: Date;
}

export interface AnalyticsEvent {
  type: 'message' | 'intent' | 'conversion' | 'engagement' | 'business_value';
  sessionId: string;
  data: any;
  timestamp: Date;
}

export class AnalyticsSystem {
  private events: AnalyticsEvent[] = [];
  private analytics: Map<string, ConversationAnalytics> = new Map();
  private businessIntelligence: BusinessIntelligence | null = null;

  // Track analytics event
  trackEvent(event: AnalyticsEvent): void {
    this.events.push(event);
    this.updateAnalytics(event.sessionId);
  }

  // Update conversation analytics
  private updateAnalytics(sessionId: string): void {
    const context = conversationMemory.getContext(sessionId);
    const lead = leadQualification.getLead(sessionId);
    
    if (!context || !lead) return;

    const analytics: ConversationAnalytics = {
      sessionId,
      metrics: {
        totalMessages: context.conversationHistory.length,
        averageResponseTime: this.calculateAverageResponseTime(context),
        engagementScore: lead.conversationMetrics.engagementScore,
        businessValueScore: this.calculateBusinessValueScore(context),
        conversionProbability: this.calculateConversionProbability(lead),
        timeSpent: this.calculateTimeSpent(context)
      },
      insights: {
        topIntents: this.extractTopIntents(context),
        painPoints: lead.businessProfile.painPoints,
        businessNeeds: this.extractBusinessNeeds(context),
        budgetIndicators: this.extractBudgetIndicators(context),
        timelineIndicators: this.extractTimelineIndicators(context),
        decisionMakerSignals: this.extractDecisionMakerSignals(context)
      },
      trends: {
        messageFrequency: this.calculateMessageFrequency(context),
        questionPatterns: this.extractQuestionPatterns(context),
        interestAreas: this.extractInterestAreas(context),
        objectionPatterns: this.extractObjectionPatterns(context)
      },
      recommendations: {
        nextActions: lead.qualification.nextSteps,
        contentSuggestions: this.generateContentSuggestions(lead),
        followUpStrategy: this.generateFollowUpStrategy(lead),
        personalizationTips: this.generatePersonalizationTips(lead)
      },
      timestamp: new Date()
    };

    this.analytics.set(sessionId, analytics);
  }

  // Calculate average response time
  private calculateAverageResponseTime(context: ConversationContext): number {
    if (context.conversationHistory.length < 2) return 0;

    let totalTime = 0;
    let count = 0;

    for (let i = 1; i < context.conversationHistory.length; i++) {
      const prev = context.conversationHistory[i - 1];
      const curr = context.conversationHistory[i];
      
      // Calculate time between AI response and next user message
      if (prev.aiResponse && curr.userMessage) {
        const timeDiff = curr.timestamp.getTime() - prev.timestamp.getTime();
        totalTime += timeDiff;
        count++;
      }
    }

    return count > 0 ? totalTime / count / 1000 : 0; // Return in seconds
  }

  // Calculate business value score
  private calculateBusinessValueScore(context: ConversationContext): number {
    let score = 0;
    const insights = conversationMemory['insights'].get(context.sessionId) || [];

    // Business need insights
    const businessNeeds = insights.filter(i => i.type === 'business_need');
    score += businessNeeds.length * 2;

    // Pain point insights
    const painPoints = insights.filter(i => i.type === 'pain_point');
    score += painPoints.length * 1.5;

    // Budget insights
    const budgetInsights = insights.filter(i => i.type === 'budget');
    score += budgetInsights.length * 3;

    // Timeline insights
    const timelineInsights = insights.filter(i => i.type === 'timeline');
    score += timelineInsights.length * 2;

    // Decision maker insights
    const decisionMakerInsights = insights.filter(i => i.type === 'decision_maker');
    score += decisionMakerInsights.length * 4;

    return Math.min(score, 10);
  }

  // Calculate conversion probability
  private calculateConversionProbability(lead: LeadProfile): number {
    let probability = 0;

    // Base probability from qualification score
    probability += lead.qualification.score * 0.1;

    // Budget factor
    if (lead.businessProfile.budget === 'high') probability += 0.2;
    else if (lead.businessProfile.budget === 'medium') probability += 0.1;

    // Timeline factor
    if (lead.businessProfile.timeline === 'urgent') probability += 0.15;
    else if (lead.businessProfile.timeline === '3-6 months') probability += 0.1;

    // Decision maker factor
    if (lead.businessProfile.decisionMaker) probability += 0.15;

    // Engagement factor
    probability += lead.conversationMetrics.engagementScore * 0.01;

    // Pain points factor
    probability += Math.min(lead.businessProfile.painPoints.length * 0.05, 0.1);

    return Math.min(probability, 1);
  }

  // Calculate time spent in conversation
  private calculateTimeSpent(context: ConversationContext): number {
    if (context.conversationHistory.length < 2) return 0;

    const first = context.conversationHistory[0];
    const last = context.conversationHistory[context.conversationHistory.length - 1];

    return (last.timestamp.getTime() - first.timestamp.getTime()) / 1000; // Return in seconds
  }

  // Extract top intents
  private extractTopIntents(context: ConversationContext): string[] {
    const intents: string[] = [];
    
    context.conversationHistory.forEach(turn => {
      if (turn.intent) {
        intents.push(turn.intent);
      }
    });

    // Count and sort by frequency
    const intentCounts = intents.reduce((acc, intent) => {
      acc[intent] = (acc[intent] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(intentCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([intent]) => intent);
  }

  // Extract business needs
  private extractBusinessNeeds(context: ConversationContext): string[] {
    const insights = conversationMemory['insights'].get(context.sessionId) || [];
    return insights
      .filter(i => i.type === 'business_need')
      .map(i => i.value)
      .slice(0, 5);
  }

  // Extract budget indicators
  private extractBudgetIndicators(context: ConversationContext): string[] {
    const insights = conversationMemory['insights'].get(context.sessionId) || [];
    return insights
      .filter(i => i.type === 'budget')
      .map(i => i.value)
      .slice(0, 3);
  }

  // Extract timeline indicators
  private extractTimelineIndicators(context: ConversationContext): string[] {
    const insights = conversationMemory['insights'].get(context.sessionId) || [];
    return insights
      .filter(i => i.type === 'timeline')
      .map(i => i.value)
      .slice(0, 3);
  }

  // Extract decision maker signals
  private extractDecisionMakerSignals(context: ConversationContext): string[] {
    const insights = conversationMemory['insights'].get(context.sessionId) || [];
    return insights
      .filter(i => i.type === 'decision_maker')
      .map(i => i.value)
      .slice(0, 3);
  }

  // Calculate message frequency
  private calculateMessageFrequency(context: ConversationContext): number {
    if (context.conversationHistory.length < 2) return 0;

    const timeSpent = this.calculateTimeSpent(context);
    return timeSpent > 0 ? context.conversationHistory.length / (timeSpent / 60) : 0; // Messages per minute
  }

  // Extract question patterns
  private extractQuestionPatterns(context: ConversationContext): string[] {
    const patterns: string[] = [];
    
    context.conversationHistory.forEach(turn => {
      if (turn.userMessage.includes('?')) {
        // Extract question type
        if (turn.userMessage.toLowerCase().includes('how')) patterns.push('how');
        if (turn.userMessage.toLowerCase().includes('what')) patterns.push('what');
        if (turn.userMessage.toLowerCase().includes('when')) patterns.push('when');
        if (turn.userMessage.toLowerCase().includes('where')) patterns.push('where');
        if (turn.userMessage.toLowerCase().includes('why')) patterns.push('why');
        if (turn.userMessage.toLowerCase().includes('who')) patterns.push('who');
      }
    });

    // Count and return top patterns
    const patternCounts = patterns.reduce((acc, pattern) => {
      acc[pattern] = (acc[pattern] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(patternCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([pattern]) => pattern);
  }

  // Extract interest areas
  private extractInterestAreas(context: ConversationContext): string[] {
    const areas: string[] = [];
    
    context.conversationHistory.forEach(turn => {
      const message = turn.userMessage.toLowerCase();
      
      // Industry-specific interests
      if (message.includes('healthcare') || message.includes('medical')) areas.push('healthcare');
      if (message.includes('finance') || message.includes('banking')) areas.push('finance');
      if (message.includes('e-commerce') || message.includes('retail')) areas.push('e-commerce');
      if (message.includes('legal') || message.includes('law')) areas.push('legal');
      if (message.includes('real estate') || message.includes('property')) areas.push('real-estate');
      
      // Process-specific interests
      if (message.includes('email') || message.includes('communication')) areas.push('email-automation');
      if (message.includes('crm') || message.includes('customer')) areas.push('crm-integration');
      if (message.includes('scheduling') || message.includes('appointment')) areas.push('scheduling');
      if (message.includes('billing') || message.includes('invoice')) areas.push('billing');
      if (message.includes('support') || message.includes('helpdesk')) areas.push('support');
    });

    // Count and return top areas
    const areaCounts = areas.reduce((acc, area) => {
      acc[area] = (acc[area] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(areaCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([area]) => area);
  }

  // Extract objection patterns
  private extractObjectionPatterns(context: ConversationContext): string[] {
    const objections: string[] = [];
    
    context.conversationHistory.forEach(turn => {
      const message = turn.userMessage.toLowerCase();
      
      if (message.includes('expensive') || message.includes('cost')) objections.push('cost');
      if (message.includes('complex') || message.includes('complicated')) objections.push('complexity');
      if (message.includes('time') || message.includes('long')) objections.push('timeline');
      if (message.includes('security') || message.includes('safe')) objections.push('security');
      if (message.includes('change') || message.includes('different')) objections.push('change-management');
      if (message.includes('prove') || message.includes('evidence')) objections.push('proof');
    });

    return [...new Set(objections)].slice(0, 5);
  }

  // Generate content suggestions
  private generateContentSuggestions(lead: LeadProfile): string[] {
    const suggestions: string[] = [];

    // Industry-specific content
    if (lead.companyInfo.industry) {
      suggestions.push(`${lead.companyInfo.industry} automation case study`);
      suggestions.push(`${lead.companyInfo.industry} compliance guide`);
    }

    // Pain point-specific content
    lead.businessProfile.painPoints.forEach(painPoint => {
      suggestions.push(`How to solve ${painPoint} with automation`);
    });

    // Budget-specific content
    if (lead.businessProfile.budget === 'high') {
      suggestions.push('Enterprise automation solutions');
    } else if (lead.businessProfile.budget === 'low') {
      suggestions.push('Cost-effective automation strategies');
    }

    // Timeline-specific content
    if (lead.businessProfile.timeline === 'urgent') {
      suggestions.push('Quick implementation guide');
    }

    return suggestions.slice(0, 5);
  }

  // Generate follow-up strategy
  private generateFollowUpStrategy(lead: LeadProfile): string {
    if (lead.qualification.level === 'hot') {
      return 'Immediate follow-up within 2 hours with personalized proposal';
    } else if (lead.qualification.level === 'warm') {
      return 'Follow-up within 24 hours with relevant case studies and ROI analysis';
    } else {
      return 'Nurturing sequence with educational content over 2-4 weeks';
    }
  }

  // Generate personalization tips
  private generatePersonalizationTips(lead: LeadProfile): string[] {
    const tips: string[] = [];

    // Industry personalization
    if (lead.companyInfo.industry) {
      tips.push(`Use ${lead.companyInfo.industry} terminology and examples`);
      tips.push(`Reference ${lead.companyInfo.industry} compliance requirements`);
    }

    // Company size personalization
    if (lead.companyInfo.size === 'large') {
      tips.push('Focus on enterprise features and scalability');
      tips.push('Emphasize dedicated support and account management');
    } else if (lead.companyInfo.size === 'small') {
      tips.push('Highlight cost-effectiveness and ease of use');
      tips.push('Focus on quick implementation and ROI');
    }

    // Pain point personalization
    lead.businessProfile.painPoints.forEach(painPoint => {
      tips.push(`Address ${painPoint} specifically in communications`);
    });

    // Budget personalization
    if (lead.businessProfile.budget === 'high') {
      tips.push('Present comprehensive solution options');
    } else if (lead.businessProfile.budget === 'low') {
      tips.push('Focus on value and cost savings');
    }

    return tips.slice(0, 5);
  }

  // Generate business intelligence report
  generateBusinessIntelligence(): BusinessIntelligence {
    const allLeads = leadQualification.getAllLeads();
    const allAnalytics = Array.from(this.analytics.values());

    const overallMetrics = {
      totalConversations: allLeads.length,
      averageQualificationScore: allLeads.reduce((sum, lead) => sum + lead.qualification.score, 0) / allLeads.length || 0,
      conversionRate: allLeads.filter(lead => lead.qualification.level === 'hot').length / allLeads.length || 0,
      averageEngagementScore: allAnalytics.reduce((sum, analytics) => sum + analytics.metrics.engagementScore, 0) / allAnalytics.length || 0,
      topIndustries: this.calculateTopIndustries(allLeads),
      topPainPoints: this.calculateTopPainPoints(allLeads)
    };

    const leadInsights = {
      hotLeads: allLeads.filter(lead => lead.qualification.level === 'hot').length,
      warmLeads: allLeads.filter(lead => lead.qualification.level === 'warm').length,
      coldLeads: allLeads.filter(lead => lead.qualification.level === 'cold').length,
      averageLeadScore: overallMetrics.averageQualificationScore,
      topPerformingIndustries: overallMetrics.topIndustries.slice(0, 3).map(i => i.industry),
      commonObjections: this.calculateCommonObjections(allAnalytics),
      successFactors: this.calculateSuccessFactors(allLeads)
    };

    const performanceMetrics = {
      responseTime: allAnalytics.reduce((sum, analytics) => sum + analytics.metrics.averageResponseTime, 0) / allAnalytics.length || 0,
      userSatisfaction: allAnalytics.reduce((sum, analytics) => sum + analytics.metrics.engagementScore, 0) / allAnalytics.length || 0,
      conversationCompletionRate: allAnalytics.filter(analytics => analytics.metrics.totalMessages > 5).length / allAnalytics.length || 0,
      leadQualityScore: overallMetrics.averageQualificationScore,
      businessValueGenerated: allAnalytics.reduce((sum, analytics) => sum + analytics.metrics.businessValueScore, 0)
    };

    const recommendations = {
      processImprovements: this.generateProcessImprovements(allAnalytics),
      contentOptimizations: this.generateContentOptimizations(allAnalytics),
      targetingSuggestions: this.generateTargetingSuggestions(allLeads),
      automationOpportunities: this.generateAutomationOpportunities(allAnalytics)
    };

    this.businessIntelligence = {
      overallMetrics,
      leadInsights,
      performanceMetrics,
      recommendations,
      timestamp: new Date()
    };

    return this.businessIntelligence;
  }

  // Helper methods for business intelligence calculations
  private calculateTopIndustries(leads: LeadProfile[]): Array<{ industry: string; count: number; avgScore: number }> {
    const industryMap = new Map<string, { count: number; totalScore: number }>();

    leads.forEach(lead => {
      const industry = lead.companyInfo.industry || 'Unknown';
      const existing = industryMap.get(industry) || { count: 0, totalScore: 0 };
      industryMap.set(industry, {
        count: existing.count + 1,
        totalScore: existing.totalScore + lead.qualification.score
      });
    });

    return Array.from(industryMap.entries())
      .map(([industry, data]) => ({
        industry,
        count: data.count,
        avgScore: data.totalScore / data.count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private calculateTopPainPoints(leads: LeadProfile[]): Array<{ painPoint: string; frequency: number; impact: number }> {
    const painPointMap = new Map<string, { frequency: number; totalScore: number }>();

    leads.forEach(lead => {
      lead.businessProfile.painPoints.forEach(painPoint => {
        const existing = painPointMap.get(painPoint) || { frequency: 0, totalScore: 0 };
        painPointMap.set(painPoint, {
          frequency: existing.frequency + 1,
          totalScore: existing.totalScore + lead.qualification.score
        });
      });
    });

    return Array.from(painPointMap.entries())
      .map(([painPoint, data]) => ({
        painPoint,
        frequency: data.frequency,
        impact: data.totalScore / data.frequency
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);
  }

  private calculateCommonObjections(analytics: ConversationAnalytics[]): string[] {
    const objectionMap = new Map<string, number>();

    analytics.forEach(analytics => {
      analytics.trends.objectionPatterns.forEach(objection => {
        objectionMap.set(objection, (objectionMap.get(objection) || 0) + 1);
      });
    });

    return Array.from(objectionMap.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([objection]) => objection);
  }

  private calculateSuccessFactors(leads: LeadProfile[]): string[] {
    const factors: string[] = [];

    // Analyze hot leads for common patterns
    const hotLeads = leads.filter(lead => lead.qualification.level === 'hot');

    if (hotLeads.length > 0) {
      const highBudgetCount = hotLeads.filter(lead => lead.businessProfile.budget === 'high').length;
      const decisionMakerCount = hotLeads.filter(lead => lead.businessProfile.decisionMaker).length;
      const urgentTimelineCount = hotLeads.filter(lead => lead.businessProfile.timeline === 'urgent').length;

      if (highBudgetCount / hotLeads.length > 0.5) factors.push('High budget allocation');
      if (decisionMakerCount / hotLeads.length > 0.7) factors.push('Decision maker involvement');
      if (urgentTimelineCount / hotLeads.length > 0.6) factors.push('Urgent implementation timeline');
    }

    return factors;
  }

  private generateProcessImprovements(analytics: ConversationAnalytics[]): string[] {
    const improvements: string[] = [];

    // Analyze response times
    const avgResponseTime = analytics.reduce((sum, a) => sum + a.metrics.averageResponseTime, 0) / analytics.length;
    if (avgResponseTime > 300) { // 5 minutes
      improvements.push('Reduce average response time to improve user experience');
    }

    // Analyze engagement scores
    const avgEngagement = analytics.reduce((sum, a) => sum + a.metrics.engagementScore, 0) / analytics.length;
    if (avgEngagement < 6) {
      improvements.push('Improve conversation engagement through better personalization');
    }

    // Analyze conversion rates
    const conversionRate = analytics.filter(a => a.metrics.conversionProbability > 0.7).length / analytics.length;
    if (conversionRate < 0.3) {
      improvements.push('Enhance lead qualification process to improve conversion rates');
    }

    return improvements;
  }

  private generateContentOptimizations(analytics: ConversationAnalytics[]): string[] {
    const optimizations: string[] = [];

    // Analyze common objections
    const commonObjections = this.calculateCommonObjections(analytics);
    commonObjections.forEach(objection => {
      optimizations.push(`Create content addressing ${objection} objections`);
    });

    // Analyze interest areas
    const allInterestAreas = analytics.flatMap(a => a.trends.interestAreas);
    const interestCounts = allInterestAreas.reduce((acc, area) => {
      acc[area] = (acc[area] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topInterests = Object.entries(interestCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([area]) => area);

    topInterests.forEach(interest => {
      optimizations.push(`Develop more content around ${interest} automation`);
    });

    return optimizations;
  }

  private generateTargetingSuggestions(leads: LeadProfile[]): string[] {
    const suggestions: string[] = [];

    // Analyze top performing industries
    const topIndustries = this.calculateTopIndustries(leads);
    topIndustries.slice(0, 3).forEach(industry => {
      suggestions.push(`Focus marketing efforts on ${industry.industry} industry`);
    });

    // Analyze company sizes
    const sizeCounts = leads.reduce((acc, lead) => {
      const size = lead.companyInfo.size || 'Unknown';
      acc[size] = (acc[size] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topSize = Object.entries(sizeCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0];

    if (topSize) {
      suggestions.push(`Target ${topSize} companies for better conversion rates`);
    }

    return suggestions;
  }

  private generateAutomationOpportunities(analytics: ConversationAnalytics[]): string[] {
    const opportunities: string[] = [];

    // Analyze common questions
    const allQuestions = analytics.flatMap(a => a.trends.questionPatterns);
    const questionCounts = allQuestions.reduce((acc, question) => {
      acc[question] = (acc[question] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topQuestions = Object.entries(questionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([question]) => question);

    topQuestions.forEach(question => {
      opportunities.push(`Automate responses to common ${question} questions`);
    });

    // Analyze pain points
    const allPainPoints = analytics.flatMap(a => a.insights.painPoints);
    const painPointCounts = allPainPoints.reduce((acc, painPoint) => {
      acc[painPoint] = (acc[painPoint] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topPainPoints = Object.entries(painPointCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([painPoint]) => painPoint);

    topPainPoints.forEach(painPoint => {
      opportunities.push(`Create automated solutions for ${painPoint}`);
    });

    return opportunities;
  }

  // Get analytics for specific session
  getAnalytics(sessionId: string): ConversationAnalytics | null {
    return this.analytics.get(sessionId) || null;
  }

  // Get all analytics
  getAllAnalytics(): ConversationAnalytics[] {
    return Array.from(this.analytics.values());
  }

  // Get business intelligence
  getBusinessIntelligence(): BusinessIntelligence | null {
    return this.businessIntelligence;
  }

  // Export analytics data
  exportAnalytics(): { analytics: ConversationAnalytics[]; businessIntelligence: BusinessIntelligence | null } {
    return {
      analytics: this.getAllAnalytics(),
      businessIntelligence: this.getBusinessIntelligence()
    };
  }

  // Clear analytics data
  clearAnalytics(): void {
    this.events = [];
    this.analytics.clear();
    this.businessIntelligence = null;
  }
}

// Export singleton instance
export const analyticsSystem = new AnalyticsSystem();

