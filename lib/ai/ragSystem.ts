// lib/ai/ragSystem.ts

import { marked } from 'marked';
import { businessTools, industryInsights } from './businessTools';

export interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  relevanceScore?: number;
}

export interface RAGResponse {
  answer: string;
  sources: KnowledgeDocument[];
  confidence: number;
  suggestions: string[];
}

// Enhanced knowledge base with business intelligence
const knowledgeBase: Record<string, KnowledgeDocument> = {
  'services.md': {
    id: 'services',
    title: 'Automari Services',
    category: 'services',
    tags: ['automation', 'email', 'workflow', 'integration'],
    content: `# Automari Services

## AI Email Automation
- **Smart Categorization**: Automatically sort emails into leads, support, marketing, billing, priority, and spam
- **Auto-Reply Generation**: Create professional responses tailored to your brand voice
- **Lead Qualification**: Identify and prioritize high-value prospects
- **Workflow Automation**: Set up rules to handle routine tasks automatically

## Business Process Automation
- **CRM Integration**: Sync with your existing customer management systems
- **Task Management**: Automate follow-ups and reminders
- **Analytics & Reporting**: Track performance and ROI metrics
- **Custom Workflows**: Build tailored automation for your specific needs

## Industry-Specific Solutions
- **Healthcare**: HIPAA-compliant patient communication and scheduling
- **Finance**: Secure transaction processing and compliance reporting
- **E-commerce**: Order processing and customer service automation
- **Professional Services**: Client management and project tracking

## Advanced Features
- **Machine Learning**: Continuously improve automation accuracy
- **API Integration**: Connect with 500+ business applications
- **Custom Development**: Tailored solutions for unique requirements
- **24/7 Support**: Dedicated account management and technical support`
  },

  'pricing.md': {
    id: 'pricing',
    title: 'Automari Pricing',
    category: 'pricing',
    tags: ['pricing', 'plans', 'cost', 'roi'],
    content: `# Automari Pricing

## Starter Plan - $297/month
- Up to 1,000 emails processed monthly
- Basic AI categorization
- Standard auto-reply templates
- Email support
- **ROI**: Typically 3-5x return on investment

## Professional Plan - $597/month
- Up to 5,000 emails processed monthly
- Advanced AI features
- Custom automation workflows
- Priority support
- CRM integrations
- **ROI**: Typically 5-8x return on investment

## Enterprise Plan - Custom Pricing
- Unlimited email processing
- White-label solutions
- Dedicated account manager
- Custom integrations
- 24/7 support
- **ROI**: Typically 8-15x return on investment

## Value-Based Pricing Factors
- **Complexity**: Number of integrations and customizations
- **Volume**: Email and transaction processing volume
- **Industry**: Compliance and security requirements
- **Timeline**: Implementation urgency and support needs

*All plans include setup and onboarding assistance. Custom pricing available for large enterprises.*`
  },

  'process.md': {
    id: 'process',
    title: 'Our Process',
    category: 'process',
    tags: ['process', 'implementation', 'onboarding', 'support'],
    content: `# Our Process

## 1. Discovery Call
We start with a comprehensive analysis of your current email management challenges and business goals.
- **Duration**: 60-90 minutes
- **Participants**: Key stakeholders and decision makers
- **Deliverables**: Current state assessment and opportunity analysis

## 2. Custom Strategy
Our team designs a tailored automation strategy that aligns with your specific needs and workflows.
- **Timeline**: 1-2 weeks
- **Components**: Process mapping, integration architecture, ROI projections
- **Review**: Collaborative refinement with your team

## 3. Implementation
We handle the technical setup and configuration, ensuring seamless integration with your existing systems.
- **Duration**: 2-4 weeks (depending on complexity)
- **Approach**: Phased rollout with minimal disruption
- **Testing**: Comprehensive quality assurance and user acceptance

## 4. Training & Support
Your team receives comprehensive training and ongoing support to maximize the value of your automation investment.
- **Training**: Hands-on workshops and documentation
- **Support**: Dedicated account manager and technical support
- **Monitoring**: Performance tracking and optimization

## 5. Optimization
We continuously monitor and optimize your automation to ensure peak performance and ROI.
- **Frequency**: Monthly reviews and quarterly optimizations
- **Metrics**: Efficiency gains, cost savings, user satisfaction
- **Enhancements**: New features and process improvements`
  },

  'case-studies.md': {
    id: 'case-studies',
    title: 'Success Stories',
    category: 'case-studies',
    tags: ['case-studies', 'success', 'roi', 'results'],
    content: `# Success Stories

## Tech Startup - 75% Time Savings
**Challenge**: A growing SaaS company was drowning in customer support emails, spending 20+ hours weekly on manual responses.

**Solution**: Implemented smart email categorization and auto-reply generation with CRM integration.

**Results**: 
- 75% reduction in email management time
- 300% increase in response speed
- 40% improvement in customer satisfaction
- **ROI**: 8x return on investment in first year

## E-commerce Business - 3x Lead Response Rate
**Challenge**: An online retailer was missing high-value leads due to slow response times and inconsistent follow-up.

**Solution**: Automated lead qualification, prioritization, and personalized follow-up sequences.

**Results**:
- 300% increase in lead response rate
- 50% reduction in lead response time
- 25% improvement in conversion rate
- **ROI**: 12x return on investment

## Professional Services - 90% Automation Rate
**Challenge**: A consulting firm was spending excessive time on administrative tasks, limiting client-facing activities.

**Solution**: Comprehensive workflow automation including client onboarding, project tracking, and billing.

**Results**:
- 90% automation of routine tasks
- 60% increase in billable hours
- 35% reduction in administrative costs
- **ROI**: 15x return on investment

## Healthcare Practice - HIPAA-Compliant Efficiency
**Challenge**: A medical practice needed to automate patient communication while maintaining strict HIPAA compliance.

**Solution**: Secure, HIPAA-compliant automation for appointment scheduling, reminders, and follow-up care.

**Results**:
- 80% reduction in no-show rates
- 50% improvement in patient satisfaction
- 100% HIPAA compliance maintained
- **ROI**: 6x return on investment

*Results may vary based on individual business needs and implementation.*`
  },

  'booking.md': {
    id: 'booking',
    title: 'Book a Consultation',
    category: 'booking',
    tags: ['consultation', 'booking', 'contact', 'meeting'],
    content: `# Book a Consultation

Ready to transform your business operations? Schedule a free consultation with our automation experts.

## What to Expect
- **Duration**: 60-90 minutes
- **Format**: Video call or in-person (Miami area)
- **Participants**: Key stakeholders and decision makers
- **Preparation**: Current process documentation and pain points

## Consultation Agenda
1. **Current State Analysis**: Review existing processes and challenges
2. **Opportunity Assessment**: Identify automation opportunities
3. **ROI Projection**: Calculate potential savings and efficiency gains
4. **Solution Design**: Outline recommended automation strategy
5. **Implementation Plan**: Discuss timeline and next steps

## Contact Information
- **Phone/Text**: [561-201-4365](tel:561-201-4365)
- **Email**: [contactautomari@gmail.com](mailto:contactautomari@gmail.com)
- **Website**: [Automari.ai](https://automari.ai)

## Availability
- **Monday-Friday**: 9 AM - 6 PM EST
- **Response Time**: Typically within 2 hours during business hours
- **Emergency**: Text for urgent matters

*Available Monday-Friday, 9 AM - 6 PM EST*`
  }
};

// Enhanced RAG system with business intelligence
export class RAGSystem {
  private documents: KnowledgeDocument[] = Object.values(knowledgeBase);
  private industryInsights = industryInsights;

  // Semantic search with business context
  async search(query: string, context?: any): Promise<KnowledgeDocument[]> {
    const lowerQuery = query.toLowerCase();
    const results: KnowledgeDocument[] = [];

    // Enhanced scoring algorithm
    for (const doc of this.documents) {
      let score = 0;
      const content = doc.content.toLowerCase();
      const title = doc.title.toLowerCase();

      // Title relevance (highest weight)
      if (title.includes(lowerQuery)) score += 10;
      
      // Content relevance
      const queryWords = lowerQuery.split(' ');
      for (const word of queryWords) {
        if (content.includes(word)) score += 2;
        if (doc.tags.includes(word)) score += 3;
      }

      // Category relevance
      if (context?.category && doc.category === context.category) score += 5;

      // Industry-specific relevance
      if (context?.industry && this.industryInsights[context.industry]) {
        const insights = this.industryInsights[context.industry];
        if (insights.commonProcesses.some((process: string) => content.includes(process.toLowerCase()))) {
          score += 4;
        }
      }

      if (score > 0) {
        results.push({ ...doc, relevanceScore: score });
      }
    }

    return results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0)).slice(0, 5);
  }

  // Generate comprehensive RAG response
  async generateResponse(query: string, context?: any): Promise<RAGResponse> {
    const relevantDocs = await this.search(query, context);
    
    if (relevantDocs.length === 0) {
      return {
        answer: "I don't have specific information about that topic in my knowledge base. Let me connect you with our support team, who can provide detailed insights tailored to your specific situation.",
        sources: [],
        confidence: 0.3,
        suggestions: [
          "Schedule a consultation with our team",
          "Ask about industry-specific automation solutions",
          "Request a custom ROI analysis for your business"
        ]
      };
    }

    // Build comprehensive answer from relevant sources
    let answer = "";
    let confidence = 0;

    for (const doc of relevantDocs) {
      const docScore = doc.relevanceScore || 0;
      confidence += docScore;
      
      // Extract relevant sections from document
      const sections = this.extractRelevantSections(doc.content, query);
      if (sections.length > 0) {
        answer += `\n\n## ${doc.title}\n${sections.join('\n')}`;
      }
    }

    // Normalize confidence score
    confidence = Math.min(confidence / 20, 1);

    // Add business intelligence insights
    if (context?.industry && this.industryInsights[context.industry]) {
      const insights = this.industryInsights[context.industry];
      answer += `\n\n## Industry-Specific Insights\n`;
      answer += `**Common Automation Opportunities**: ${insights.commonProcesses.join(', ')}\n`;
      answer += `**Typical ROI**: ${insights.roi}\n`;
      answer += `**Key Considerations**: ${insights.challenges.join(', ')}`;
    }

    // Generate suggestions based on query intent
    const suggestions = this.generateSuggestions(query, relevantDocs, context);

    return {
      answer: answer.trim(),
      sources: relevantDocs,
      confidence,
      suggestions
    };
  }

  // Extract relevant sections from document content
  private extractRelevantSections(content: string, query: string): string[] {
    const sections: string[] = [];
    const lines = content.split('\n');
    const queryWords = query.toLowerCase().split(' ');
    
    let currentSection = "";
    let inRelevantSection = false;

    for (const line of lines) {
      if (line.startsWith('#')) {
        // Save previous section if relevant
        if (inRelevantSection && currentSection.trim()) {
          sections.push(currentSection.trim());
        }
        
        // Check if new section is relevant
        const lineLower = line.toLowerCase();
        inRelevantSection = queryWords.some(word => lineLower.includes(word));
        currentSection = line + '\n';
      } else if (inRelevantSection) {
        currentSection += line + '\n';
      }
    }

    // Add final section if relevant
    if (inRelevantSection && currentSection.trim()) {
      sections.push(currentSection.trim());
    }

    return sections;
  }

  // Generate contextual suggestions
  private generateSuggestions(query: string, docs: KnowledgeDocument[], context?: any): string[] {
    const suggestions: string[] = [];
    const lowerQuery = query.toLowerCase();

    // Intent-based suggestions
    if (lowerQuery.includes('pricing') || lowerQuery.includes('cost')) {
      suggestions.push('Request a personalized ROI analysis');
      suggestions.push('Schedule a consultation to discuss budget options');
      suggestions.push('Ask about payment plans and financing options');
    } else if (lowerQuery.includes('implementation') || lowerQuery.includes('process')) {
      suggestions.push('Request a detailed implementation timeline');
      suggestions.push('Ask about change management and training support');
      suggestions.push('Schedule a technical assessment call');
    } else if (lowerQuery.includes('industry') || lowerQuery.includes('sector')) {
      suggestions.push('Request industry-specific case studies');
      suggestions.push('Ask about compliance and regulatory requirements');
      suggestions.push('Schedule an industry expert consultation');
    } else {
      suggestions.push('Schedule a discovery call with our team');
      suggestions.push('Request a custom automation strategy');
      suggestions.push('Ask about relevant success stories');
    }

    // Context-based suggestions
    if (context?.companySize === 'large') {
      suggestions.push('Ask about enterprise-level solutions and dedicated support');
    } else if (context?.budget === 'high') {
      suggestions.push('Request a comprehensive automation audit');
    }

    return suggestions.slice(0, 3);
  }

  // Get industry-specific insights
  getIndustryInsights(industry: string): any {
    return this.industryInsights[industry] || null;
  }

  // Add new document to knowledge base
  addDocument(doc: KnowledgeDocument): void {
    this.documents.push(doc);
  }

  // Update existing document
  updateDocument(id: string, updates: Partial<KnowledgeDocument>): void {
    const index = this.documents.findIndex(doc => doc.id === id);
    if (index !== -1) {
      this.documents[index] = { ...this.documents[index], ...updates };
    }
  }
}

// Export singleton instance
export const ragSystem = new RAGSystem();

