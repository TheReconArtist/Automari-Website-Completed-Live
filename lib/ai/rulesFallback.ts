// lib/ai/rulesFallback.ts
import { marked } from 'marked';

interface FallbackAnswer {
  text: string;
  cta?: string;
}

// Inline knowledge base content for client-side compatibility
const knowledgeBase: Record<string, string> = {
  'services.md': `# Automari Services

## AI Email Automation
- **Smart Categorization**: Automatically sort emails into leads, support, marketing, billing, priority, and spam
- **Auto-Reply Generation**: Create professional responses tailored to your brand voice
- **Lead Qualification**: Identify and prioritize high-value prospects
- **Workflow Automation**: Set up rules to handle routine tasks automatically

## Business Process Automation
- **CRM Integration**: Sync with your existing customer management systems
- **Task Management**: Automate follow-ups and reminders
- **Analytics & Reporting**: Track performance and ROI metrics
- **Custom Workflows**: Build tailored automation for your specific needs`,

  'pricing.md': `# Automari Pricing

## Starter Plan - $297/month
- Up to 1,000 emails processed monthly
- Basic AI categorization
- Standard auto-reply templates
- Email support

## Professional Plan - $597/month
- Up to 5,000 emails processed monthly
- Advanced AI features
- Custom automation workflows
- Priority support
- CRM integrations

## Enterprise Plan - Custom Pricing
- Unlimited email processing
- White-label solutions
- Dedicated account manager
- Custom integrations
- 24/7 support

*All plans include setup and onboarding assistance.*`,

  'process.md': `# Our Process

## 1. Discovery Call
We start with a comprehensive analysis of your current email management challenges and business goals.

## 2. Custom Strategy
Our team designs a tailored automation strategy that aligns with your specific needs and workflows.

## 3. Implementation
We handle the technical setup and configuration, ensuring seamless integration with your existing systems.

## 4. Training & Support
Your team receives comprehensive training and ongoing support to maximize the value of your automation investment.

## 5. Optimization
We continuously monitor and optimize your automation to ensure peak performance and ROI.`,

  'booking.md': `# Book a Consultation

Ready to transform your email management? Schedule a free consultation with our automation experts.

## What to Expect
- 30-minute strategy session
- Custom automation recommendations
- ROI projections for your business
- No-obligation consultation

## Contact Information
- **Phone/Text**: [561-201-4365](tel:561-201-4365)
- **Email**: [contactautomari@gmail.com](mailto:contactautomari@gmail.com)
- **Website**: [Automari.ai](https://automari.ai)

*Available Monday-Friday, 9 AM - 6 PM EST*`,

  'case-studies.md': `# Success Stories

## Tech Startup - 75% Time Savings
A growing SaaS company reduced email management time by 75% using our smart categorization and auto-reply features.

## E-commerce Business - 3x Lead Response Rate
An online retailer increased lead response rates by 300% with our automated lead qualification and follow-up system.

## Professional Services - 90% Automation Rate
A consulting firm automated 90% of their routine email tasks, allowing them to focus on high-value client work.

*Results may vary based on individual business needs and implementation.*`
};

async function loadKnowledgeFile(filename: string): Promise<string | null> {
  try {
    return knowledgeBase[filename] || null;
  } catch (error) {
    console.warn(`Could not load knowledge file: ${filename}`, error);
    return null;
  }
}

// Track conversation context to avoid repetition
let conversationHistory: string[] = [];

export function resetConversationHistory() {
  conversationHistory = [];
}

export function addToConversationHistory(message: string) {
  conversationHistory.push(message.toLowerCase().substring(0, 100)); // Store first 100 chars
  // Keep only last 10 messages to avoid memory issues
  if (conversationHistory.length > 10) {
    conversationHistory.shift();
  }
}

function hasBeenSaidBefore(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return conversationHistory.some(prev => 
    lowerMessage.includes(prev) || prev.includes(lowerMessage.substring(0, 50))
  );
}

export async function getRulesFallbackResponse(
  message: string, 
  isFirstMessage: boolean = false
): Promise<FallbackAnswer> {
  const lowerMessage = message.toLowerCase().trim();
  
  // Handle empty messages
  if (!lowerMessage || lowerMessage.length === 0) {
    // Only send greeting on first message if empty
    if (isFirstMessage) {
      return {
        text: "Hey! I'm Mari, your AI-automation strategist. Tell me the one part of your business that feels the most chaotic or time-consuming right now.",
        cta: ""
      };
    }
    return {
      text: "Tell me anything you're struggling with — even in one sentence.",
      cta: "What's the biggest pain point in your business right now?"
    };
  }

  // Track this message
  addToConversationHistory(message);

  let responseText = "";
  let cta = "";

  // CRITICAL: Only send greeting on actual first message, never repeat it
  if (isFirstMessage && !hasBeenSaidBefore("Hey! I'm Mari")) {
    // First message - use the exact greeting specified
    responseText = "Hey! I'm Mari, your AI-automation strategist. Tell me the one part of your business that feels the most chaotic or time-consuming right now.";
    cta = "";
    return { text: responseText, cta };
  }

  // Response variations to prevent repetition
  const leadResponses = [
    "Leads. That's what we do best. Volume issue or speed issue?",
    "Ah, leads. Are you not getting enough, or losing them before you can follow up?",
    "Leads - yeah, that's usually where it breaks down. What's happening with them right now?",
    "So leads are the issue. Where are most of yours coming from currently?",
  ];
  
  const emailResponses = [
    "Email chaos. Roughly how many are you dealing with daily?",
    "Inbox overwhelm. Is it the volume or finding the important ones?",
    "Yeah, email is a time killer. How much of your day goes to it?",
    "Emails piling up. Are you the bottleneck or is it team-wide?",
  ];
  
  const schedulingResponses = [
    "Scheduling issues. Double bookings, no-shows, or the back-and-forth?",
    "Ah, calendar chaos. Manual process or using software?",
    "Scheduling. How many appointments per week are we talking?",
    "Booking headaches. What's your current process look like?",
  ];
  
  // Pick a random response from array
  const pickRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  // Keyword routing for common intents (only for non-first messages)
  // LEADS - Most common request, be very responsive
  if (lowerMessage.includes("lead") || lowerMessage.includes("leads")) {
    responseText = pickRandom(leadResponses);
    cta = "";
  } else if (lowerMessage.includes("not enough") || lowerMessage.includes("more leads") || lowerMessage.includes("need more")) {
    responseText = "So volume is the issue. Our Lead Generation Agent captures and qualifies leads 24/7. Most clients see 2-3x more qualified leads within 60 days. Where are yours coming from now?";
    cta = "";
  } else if (lowerMessage.includes("cold") || lowerMessage.includes("slow") || lowerMessage.includes("response") || lowerMessage.includes("follow up") || lowerMessage.includes("following up")) {
    responseText = "Speed to lead. You've got about 5 minutes before they go cold. Our agent responds instantly and books meetings automatically. How fast are you getting back to leads currently?";
    cta = "";
  } else if (lowerMessage.includes("grow") && (lowerMessage.includes("business") || lowerMessage.includes("revenue"))) {
    responseText = "Growth. What's the main blocker - not enough leads, or manual work eating your time?";
    cta = "";
  } else if (lowerMessage.includes("pricing") || lowerMessage.includes("cost") || lowerMessage.includes("price") || lowerMessage.includes("how much")) {
    const pricingContent = await loadKnowledgeFile("pricing.md");
    if (pricingContent) {
      responseText = marked.parse(pricingContent) as string;
      cta = "Want a personalized quote? Our team can give you exact numbers based on your setup.";
    } else {
      responseText = "Our pricing varies based on what you need. Most businesses see ROI in 30-60 days. The investment typically ranges based on complexity, integrations, and scale.";
      cta = "For a precise quote tailored to your business, reach out to our support team.";
    }
  } else if (lowerMessage.includes("services") || lowerMessage.includes("what do you do") || lowerMessage.includes("what can you")) {
    const servicesContent = await loadKnowledgeFile("services.md");
    if (servicesContent) {
      responseText = marked.parse(servicesContent) as string;
      cta = "Which of these would help your business the most?";
    } else {
      responseText = "We specialize in AI automation agents: customer support, email management, appointment scheduling, financial automation, HR, marketing, inventory, and more. We streamline operations so you can focus on growth.";
      cta = "What's your biggest operational challenge? I can show you exactly how we'd solve it.";
    }
  } else if (lowerMessage.includes("book") || lowerMessage.includes("call") || lowerMessage.includes("discovery") || lowerMessage.includes("schedule") || lowerMessage.includes("meeting")) {
    responseText = "Got you. I can set everything up. You can reach our support team by calling or texting 561-201-4365, or email us at contactautomari@gmail.com — whichever you prefer.";
    cta = "We usually respond within 2 hours during business hours.";
  } else if (lowerMessage.includes("onboarding") || lowerMessage.includes("process") || lowerMessage.includes("how does it work") || lowerMessage.includes("how do you")) {
    const processContent = await loadKnowledgeFile("process.md");
    if (processContent) {
      responseText = marked.parse(processContent) as string;
      cta = "Ready to start?";
    } else {
      responseText = "Here's how it works: We start with a discovery call to understand your challenges, design a custom automation strategy, implement it seamlessly, train your team, and continuously optimize for maximum ROI. Typically takes 3-5 steps from start to finish.";
      cta = "Want to see how this would work for your specific situation?";
    }
  } else if (lowerMessage.includes("case studies") || lowerMessage.includes("examples") || lowerMessage.includes("success") || lowerMessage.includes("results")) {
    const caseStudiesContent = await loadKnowledgeFile("case-studies.md");
    if (caseStudiesContent) {
      responseText = marked.parse(caseStudiesContent) as string;
      cta = "Want to learn more about results we've achieved?";
    } else {
      responseText = "We've helped businesses across industries. For example, a Miami Beach boutique reduced response time from hours to minutes. A legal firm automated 80% of client inquiries. A restaurant group saved thousands by preventing stockouts. Results vary, but the pattern is clear: automation transforms operations.";
      cta = "Our team can share case studies relevant to your industry during a consultation.";
    }
  } else if (lowerMessage.includes("contact") || lowerMessage.includes("reach out") || lowerMessage.includes("get in touch") || lowerMessage.includes("phone") || lowerMessage.includes("email")) {
    responseText = "You can reach our support team by calling or texting 561-201-4365, or email us at contactautomari@gmail.com. We're ready to discuss your business needs.";
    cta = "We usually respond within 2 hours during business hours (Mon-Fri, 9 AM - 6 PM EST).";
  // EMAILS / INBOX
  } else if (lowerMessage.includes("email") || lowerMessage.includes("inbox") || lowerMessage.includes("emails")) {
    responseText = pickRandom(emailResponses);
    cta = "";
  // APPOINTMENTS / SCHEDULING
  } else if (lowerMessage.includes("appointment") || lowerMessage.includes("booking") || lowerMessage.includes("double book") || lowerMessage.includes("no-show") || (lowerMessage.includes("schedule") && !lowerMessage.includes("call"))) {
    responseText = pickRandom(schedulingResponses);
    cta = "";
  // CUSTOMERS / SUPPORT
  } else if (lowerMessage.includes("customer") || lowerMessage.includes("support") || lowerMessage.includes("inquiry") || lowerMessage.includes("inquiries")) {
    responseText = "Customer inquiries can be overwhelming. Are you struggling to respond fast enough, or is it the sheer volume?";
    cta = "";
  // TIME / BUSY / OVERWHELMED
  } else if (lowerMessage.includes("time") || lowerMessage.includes("busy") || lowerMessage.includes("overwhelm") || lowerMessage.includes("too much")) {
    responseText = "Sounds like you're stretched thin. What's eating up most of your time right now?";
    cta = "";
  // STAFF / EMPLOYEES / HIRING
  } else if (lowerMessage.includes("staff") || lowerMessage.includes("employee") || lowerMessage.includes("hiring") || lowerMessage.includes("team")) {
    responseText = "Team challenges. Is it that you can't find good people, or your current team is buried in repetitive work?";
    cta = "";
  // MONEY / REVENUE / SALES
  } else if (lowerMessage.includes("money") || lowerMessage.includes("revenue") || lowerMessage.includes("sales") || lowerMessage.includes("profit")) {
    responseText = "Revenue. Let's dig in. Where do you think you're leaving money on the table - missed opportunities, slow follow-ups, or something else?";
    cta = "";
  // HELP / NEED / WANT (generic but common)
  } else if (lowerMessage.includes("help") || lowerMessage.includes("need") || lowerMessage.includes("want")) {
    responseText = "Got it. What's the one thing in your business that takes way more time than it should?";
    cta = "";
  // PROBLEM DESCRIPTIONS
  } else {
    const problemKeywords = ['problem', 'issue', 'struggle', 'difficult', 'hard', 'slow', 'manual', 'chaotic', 'overwhelming', 'bottleneck', 'pain', 'frustrated', 'stuck', 'waste', 'losing', 'missing'];
    const hasProblem = problemKeywords.some(keyword => lowerMessage.includes(keyword));
    
    if (hasProblem) {
      responseText = "I hear you. That's exactly the kind of thing we solve. Is it costing you time, money, or opportunities?";
      cta = "";
    } else if (lowerMessage.length < 15) {
      // Very short message - ask for clarification simply
      responseText = "Tell me more. What's going on?";
      cta = "";
    } else {
      // Generic catch-all - still be simple
      responseText = "Got it. What's the main thing you're dealing with right now? Even one sentence helps.";
      cta = "";
    }
  }

  // Only add contact info if user is asking about contact or ready to proceed
  let contactInfo = "";
  if (lowerMessage.includes("contact") || lowerMessage.includes("reach out") || lowerMessage.includes("get in touch") || lowerMessage.includes("phone") || lowerMessage.includes("email") || lowerMessage.includes("book") || lowerMessage.includes("call") || lowerMessage.includes("schedule")) {
    contactInfo = `\n\nYou can reach our support team: Call/Text [561-201-4365](tel:561-201-4365) | Email [contactautomari@gmail.com](mailto:contactautomari@gmail.com)`;
  }

  return { text: responseText + contactInfo, cta };
}
