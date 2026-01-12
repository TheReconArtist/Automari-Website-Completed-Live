// lib/ai/leadQualification.ts

import { conversationMemory, ConversationContext, MemoryInsight } from './conversationMemory';
import { businessTools, executeBusinessTool } from './businessTools';

export interface LeadProfile {
  sessionId: string;
  companyInfo: {
    name?: string;
    industry?: string;
    size?: string;
    location?: string;
    website?: string;
  };
  contactInfo: {
    name?: string;
    email?: string;
    phone?: string;
    title?: string;
    linkedin?: string;
  };
  businessProfile: {
    painPoints: string[];
    currentSystems: string[];
    budget?: string;
    timeline?: string;
    decisionMaker?: boolean;
    automationExperience?: string;
    competitors?: string[];
    useCases: string[];
  };
  qualification: {
    score: number;
    level: 'hot' | 'warm' | 'cold';
    factors: {
      budget: number;
      urgency: number;
      authority: number;
      need: number;
      timeline: number;
      engagement: number;
    };
    nextSteps: string[];
    priority: number;
  };
  conversationMetrics: {
    messageCount: number;
    averageResponseTime: number;
    engagementScore: number;
    businessValueScore: number;
    lastActivity: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface QualificationCriteria {
  budget: {
    high: number;
    medium: number;
    low: number;
  };
  urgency: {
    urgent: number;
    '3-6 months': number;
    '6+ months': number;
  };
  authority: {
    decisionMaker: number;
    influencer: number;
    user: number;
  };
  need: {
    critical: number;
    important: number;
    niceToHave: number;
  };
  timeline: {
    immediate: number;
    shortTerm: number;
    longTerm: number;
  };
  engagement: {
    high: number;
    medium: number;
    low: number;
  };
}

export class LeadQualificationSystem {
  private leads: Map<string, LeadProfile> = new Map();
  private criteria: QualificationCriteria = {
    budget: { high: 10, medium: 7, low: 4 },
    urgency: { urgent: 10, '3-6 months': 7, '6+ months': 4 },
    authority: { decisionMaker: 10, influencer: 7, user: 4 },
    need: { critical: 10, important: 7, niceToHave: 4 },
    timeline: { immediate: 10, shortTerm: 8, longTerm: 6 },
    engagement: { high: 10, medium: 7, low: 4 }
  };

  // Initialize or update lead profile
  async initializeLead(sessionId: string): Promise<LeadProfile> {
    const context = conversationMemory.getContext(sessionId);
    
    if (this.leads.has(sessionId)) {
      return this.updateLead(sessionId);
    }

    const leadProfile: LeadProfile = {
      sessionId,
      companyInfo: context.companyInfo || {},
      contactInfo: {},
      businessProfile: {
        painPoints: [],
        currentSystems: [],
        useCases: []
      },
      qualification: {
        score: 0,
        level: 'cold',
        factors: {
          budget: 0,
          urgency: 0,
          authority: 0,
          need: 0,
          timeline: 0,
          engagement: 0
        },
        nextSteps: [],
        priority: 0
      },
      conversationMetrics: {
        messageCount: 0,
        averageResponseTime: 0,
        engagementScore: 0,
        businessValueScore: 0,
        lastActivity: new Date()
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.leads.set(sessionId, leadProfile);
    return leadProfile;
  }

  // Update lead profile based on conversation
  async updateLead(sessionId: string): Promise<LeadProfile> {
    const context = conversationMemory.getContext(sessionId);
    const lead = this.leads.get(sessionId);
    
    if (!lead) {
      return this.initializeLead(sessionId);
    }

    // Update company information
    if (context.companyInfo) {
      lead.companyInfo = { ...lead.companyInfo, ...context.companyInfo };
    }

    // Update business profile
    if (context.businessProfile) {
      lead.businessProfile = { ...lead.businessProfile, ...context.businessProfile };
    }

    // Update conversation metrics
    lead.conversationMetrics.messageCount = context.conversationHistory.length;
    lead.conversationMetrics.lastActivity = new Date();

    // Recalculate qualification
    await this.calculateQualification(sessionId);

    lead.updatedAt = new Date();
    this.leads.set(sessionId, lead);
    return lead;
  }

  // Calculate lead qualification score
  async calculateQualification(sessionId: string): Promise<void> {
    const lead = this.leads.get(sessionId);
    if (!lead) return;

    const factors = lead.qualification.factors;

    // Budget factor
    if (lead.businessProfile.budget) {
      factors.budget = this.criteria.budget[lead.businessProfile.budget as keyof typeof this.criteria.budget] || 0;
    }

    // Urgency factor
    if (lead.businessProfile.timeline) {
      factors.urgency = this.criteria.urgency[lead.businessProfile.timeline as keyof typeof this.criteria.urgency] || 0;
    }

    // Authority factor
    if (lead.businessProfile.decisionMaker) {
      factors.authority = this.criteria.authority.decisionMaker;
    } else {
      factors.authority = this.criteria.authority.user;
    }

    // Need factor (based on pain points and use cases)
    const needScore = Math.min(lead.businessProfile.painPoints.length * 2, 10);
    factors.need = needScore >= 8 ? this.criteria.need.critical : 
                   needScore >= 5 ? this.criteria.need.important : 
                   this.criteria.need.niceToHave;

    // Timeline factor
    if (lead.businessProfile.timeline === 'urgent') {
      factors.timeline = this.criteria.timeline.immediate;
    } else if (lead.businessProfile.timeline === '3-6 months') {
      factors.timeline = this.criteria.timeline.shortTerm;
    } else {
      factors.timeline = this.criteria.timeline.longTerm;
    }

    // Engagement factor
    const engagementScore = this.calculateEngagementScore(sessionId);
    factors.engagement = engagementScore >= 8 ? this.criteria.engagement.high :
                        engagementScore >= 5 ? this.criteria.engagement.medium :
                        this.criteria.engagement.low;

    // Calculate overall score
    const totalScore = Object.values(factors).reduce((sum, score) => sum + score, 0);
    lead.qualification.score = Math.round((totalScore / 6) * 10) / 10;

    // Determine qualification level
    if (lead.qualification.score >= 8) {
      lead.qualification.level = 'hot';
    } else if (lead.qualification.score >= 6) {
      lead.qualification.level = 'warm';
    } else {
      lead.qualification.level = 'cold';
    }

    // Generate next steps
    lead.qualification.nextSteps = this.generateNextSteps(lead);

    // Calculate priority
    lead.qualification.priority = this.calculatePriority(lead);
  }

  // Calculate engagement score
  private calculateEngagementScore(sessionId: string): number {
    const context = conversationMemory.getContext(sessionId);
    const insights = conversationMemory['insights'].get(sessionId) || [];
    
    let score = 0;

    // Message count factor
    score += Math.min(context.conversationHistory.length * 0.5, 3);

    // Insight diversity factor
    const insightTypes = new Set(insights.map(i => i.type));
    score += Math.min(insightTypes.size * 0.5, 2);

    // Business value factor
    const businessInsights = insights.filter(i => 
      ['business_need', 'pain_point', 'budget', 'timeline'].includes(i.type)
    );
    score += Math.min(businessInsights.length * 0.3, 2);

    // Response quality factor
    const recentTurns = context.conversationHistory.slice(-3);
    const detailedResponses = recentTurns.filter(turn => turn.userMessage.length > 50);
    score += Math.min(detailedResponses.length * 0.5, 1.5);

    // Question asking factor
    const questionsAsked = context.conversationHistory.filter(turn => 
      turn.userMessage.includes('?') || turn.userMessage.includes('how') || turn.userMessage.includes('what')
    );
    score += Math.min(questionsAsked.length * 0.3, 1.5);

    return Math.min(score, 10);
  }

  // Generate next steps based on lead profile
  private generateNextSteps(lead: LeadProfile): string[] {
    const steps: string[] = [];

    if (lead.qualification.level === 'hot') {
      steps.push('Schedule immediate discovery call with our team');
      steps.push('Prepare customized proposal and ROI analysis');
      steps.push('Arrange technical assessment of current systems');
      steps.push('Set up demo environment for testing');
    } else if (lead.qualification.level === 'warm') {
      steps.push('Send detailed case studies and success stories');
      steps.push('Schedule follow-up call in 1-2 weeks');
      steps.push('Provide industry-specific automation insights');
      steps.push('Share relevant ROI calculations and benchmarks');
    } else {
      steps.push('Send educational content about automation benefits');
      steps.push('Schedule nurturing sequence with valuable insights');
      steps.push('Follow up in 30 days with industry updates');
      steps.push('Invite to webinars and educational events');
    }

    // Add specific steps based on business profile
    if (lead.businessProfile.painPoints.length > 0) {
      steps.push(`Address specific pain points: ${lead.businessProfile.painPoints.slice(0, 2).join(', ')}`);
    }

    if (lead.businessProfile.budget === 'high') {
      steps.push('Present comprehensive enterprise solution options');
    }

    if (lead.businessProfile.timeline === 'urgent') {
      steps.push('Expedite proposal and implementation timeline');
    }

    return steps.slice(0, 5); // Limit to 5 steps
  }

  // Calculate priority score
  private calculatePriority(lead: LeadProfile): number {
    let priority = 0;

    // Base priority from qualification score
    priority += lead.qualification.score * 2;

    // Urgency bonus
    if (lead.businessProfile.timeline === 'urgent') {
      priority += 5;
    }

    // Budget bonus
    if (lead.businessProfile.budget === 'high') {
      priority += 3;
    }

    // Decision maker bonus
    if (lead.businessProfile.decisionMaker) {
      priority += 3;
    }

    // Company size bonus
    if (lead.companyInfo.size === 'large') {
      priority += 2;
    }

    // Engagement bonus
    priority += lead.conversationMetrics.engagementScore * 0.5;

    return Math.round(priority);
  }

  // Get lead profile
  getLead(sessionId: string): LeadProfile | null {
    return this.leads.get(sessionId) || null;
  }

  // Get all leads sorted by priority
  getAllLeads(): LeadProfile[] {
    return Array.from(this.leads.values())
      .sort((a, b) => b.qualification.priority - a.qualification.priority);
  }

  // Get leads by qualification level
  getLeadsByLevel(level: 'hot' | 'warm' | 'cold'): LeadProfile[] {
    return this.getAllLeads().filter(lead => lead.qualification.level === level);
  }

  // Update contact information
  updateContactInfo(sessionId: string, contactInfo: Partial<LeadProfile['contactInfo']>): void {
    const lead = this.leads.get(sessionId);
    if (lead) {
      lead.contactInfo = { ...lead.contactInfo, ...contactInfo };
      lead.updatedAt = new Date();
      this.leads.set(sessionId, lead);
    }
  }

  // Update company information
  updateCompanyInfo(sessionId: string, companyInfo: Partial<LeadProfile['companyInfo']>): void {
    const lead = this.leads.get(sessionId);
    if (lead) {
      lead.companyInfo = { ...lead.companyInfo, ...companyInfo };
      lead.updatedAt = new Date();
      this.leads.set(sessionId, lead);
    }
  }

  // Add business insight
  addBusinessInsight(sessionId: string, insight: string, type: 'pain_point' | 'use_case' | 'system' | 'competitor'): void {
    const lead = this.leads.get(sessionId);
    if (lead) {
      switch (type) {
        case 'pain_point':
          if (!lead.businessProfile.painPoints.includes(insight)) {
            lead.businessProfile.painPoints.push(insight);
          }
          break;
        case 'use_case':
          if (!lead.businessProfile.useCases.includes(insight)) {
            lead.businessProfile.useCases.push(insight);
          }
          break;
        case 'system':
          if (!lead.businessProfile.currentSystems.includes(insight)) {
            lead.businessProfile.currentSystems.push(insight);
          }
          break;
        case 'competitor':
          if (!lead.businessProfile.competitors?.includes(insight)) {
            lead.businessProfile.competitors = [...(lead.businessProfile.competitors || []), insight];
          }
          break;
      }
      lead.updatedAt = new Date();
      this.leads.set(sessionId, lead);
    }
  }

  // Generate lead summary for Mike
  generateLeadSummary(sessionId: string): string {
    const lead = this.leads.get(sessionId);
    if (!lead) return 'Lead not found';

    let summary = `# Lead Summary: ${lead.companyInfo.name || 'Unknown Company'}\n\n`;
    
    summary += `## Contact Information\n`;
    summary += `- Name: ${lead.contactInfo.name || 'Not provided'}\n`;
    summary += `- Email: ${lead.contactInfo.email || 'Not provided'}\n`;
    summary += `- Phone: ${lead.contactInfo.phone || 'Not provided'}\n`;
    summary += `- Title: ${lead.contactInfo.title || 'Not provided'}\n\n`;

    summary += `## Company Profile\n`;
    summary += `- Industry: ${lead.companyInfo.industry || 'Unknown'}\n`;
    summary += `- Size: ${lead.companyInfo.size || 'Unknown'}\n`;
    summary += `- Location: ${lead.companyInfo.location || 'Unknown'}\n\n`;

    summary += `## Business Profile\n`;
    summary += `- Pain Points: ${lead.businessProfile.painPoints.join(', ') || 'None identified'}\n`;
    summary += `- Current Systems: ${lead.businessProfile.currentSystems.join(', ') || 'None identified'}\n`;
    summary += `- Budget: ${lead.businessProfile.budget || 'Unknown'}\n`;
    summary += `- Timeline: ${lead.businessProfile.timeline || 'Unknown'}\n`;
    summary += `- Decision Maker: ${lead.businessProfile.decisionMaker ? 'Yes' : 'Unknown'}\n\n`;

    summary += `## Qualification\n`;
    summary += `- Score: ${lead.qualification.score}/10\n`;
    summary += `- Level: ${lead.qualification.level.toUpperCase()}\n`;
    summary += `- Priority: ${lead.qualification.priority}\n\n`;

    summary += `## Next Steps\n`;
    lead.qualification.nextSteps.forEach((step, index) => {
      summary += `${index + 1}. ${step}\n`;
    });

    summary += `\n## Conversation Metrics\n`;
    summary += `- Messages: ${lead.conversationMetrics.messageCount}\n`;
    summary += `- Engagement Score: ${lead.conversationMetrics.engagementScore}/10\n`;
    summary += `- Last Activity: ${lead.conversationMetrics.lastActivity.toLocaleString()}\n`;

    return summary;
  }

  // Export leads data
  exportLeads(): LeadProfile[] {
    return this.getAllLeads();
  }

  // Clear lead data
  clearLead(sessionId: string): void {
    this.leads.delete(sessionId);
  }
}

// Export singleton instance
export const leadQualification = new LeadQualificationSystem();

