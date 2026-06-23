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

  // Greetings — opening message already shown in the UI
  if (/^(hi|hello|hey|howdy|yo|good morning|good afternoon|good evening|what's up|whats up|sup|hiya)[\s!.?]*$/i.test(lowerMessage)) {
    return {
      text: "Hey! I'm Mari, your AI automation strategist. Most businesses we work with start in one of these areas — pick what sounds closest to you, or just tell me what's going on:",
      cta: "",
    };
  }

  // Guided category selections — advice-first, then options shown in UI
  if (lowerMessage.includes("not sure") || lowerMessage.includes("guide me") || lowerMessage.includes("where to start")) {
    return {
      text: "No problem — that's exactly what I'm here for. Most owners feel the same way. Pick the type of business you run below and I'll show you exactly where automation helps most:",
      cta: "",
    };
  }
  if (lowerMessage.includes("ai audit")) {
    return {
      text: "**AI audit** is the smartest place to start. We map your lead flow, customer communication, scheduling, CRM, marketing, and repetitive operations, then rank automation opportunities by ROI.\n\nThe goal is simple: find where you're leaking time, leads, and capacity before we build anything. Want to book the audit?",
      cta: "",
    };
  }
  if (lowerMessage.includes("operating layer")) {
    return {
      text: "**AI operating layer** means connecting your agents, CRM, marketing, support, scheduling, and reporting into one system. Instead of adding another tool, we make the tools you already use work together.\n\nFor most businesses, that starts with lead capture, follow-up, scheduling, and admin automation. Want me to help scope yours?",
      cta: "",
    };
  }
  if (lowerMessage.includes("crm") || lowerMessage.includes("marketing automation")) {
    return {
      text: "**CRM and marketing automation** is where a lot of revenue gets recovered. We can automate lead capture, enrichment, pipeline updates, follow-up sequences, retargeting, and sales handoffs.\n\nMost teams need this when leads are coming in, but the follow-up is inconsistent. Is that what's happening in your business?",
      cta: "",
    };
  }
  if (lowerMessage.includes("get more leads") || lowerMessage.includes("grow my sales") || lowerMessage.includes("grow sales")) {
    return {
      text: "**Lead generation** is one of the highest-ROI automations we build. Most businesses lose 30–40% of leads just from slow follow-up — if you wait more than 5 minutes, odds of closing drop sharply.\n\nOur Lead Generation Agent responds instantly, qualifies prospects, and books meetings 24/7. Clients typically see **2–3x more qualified leads** within 60 days.\n\nWhich of these sounds most like your situation?",
      cta: "",
    };
  }
  if (lowerMessage.includes("customer support") || lowerMessage.includes("customer inquiries")) {
    return {
      text: "**Customer support automation** handles 80%+ of routine inquiries automatically — FAQs, order status, booking questions — so your team focuses on high-value conversations.\n\nBusinesses like Thompson Legal now handle most client inquiries without staff lifting a finger. Response times go from hours to seconds.\n\nWhat's the biggest support headache for you?",
      cta: "",
    };
  }
  if (lowerMessage.includes("scheduling and appointment") || lowerMessage.includes("scheduling problems")) {
    return {
      text: "**Scheduling automation** eliminates double bookings, sends smart reminders (cutting no-shows by 30–50%), and handles timezone math automatically.\n\nVals Salon eliminated all double bookings in their first week with us. No more embarrassing calendar conflicts.\n\nWhich scheduling issue hits you hardest?",
      cta: "",
    };
  }
  if (lowerMessage.includes("emails and admin") || lowerMessage.includes("drowning in emails")) {
    return {
      text: "**Email automation** saves most teams 15–20 hours per week. The average professional spends 28% of their workday on email — that's roughly $16,000/year in lost productivity on a $60K salary.\n\nOur agent auto-sorts, prioritizes, and drafts replies in your brand voice.\n\nWhich email problem is costing you the most?",
      cta: "",
    };
  }
  if (lowerMessage.includes("leads go cold") || lowerMessage.includes("can't respond fast enough") || lowerMessage.includes("respond fast enough")) {
    return {
      text: "Speed-to-lead is everything. You have about **5 minutes** before a prospect moves on. Our agent responds instantly — even at 2 AM — qualifies them, and books the meeting before they go cold.\n\nMost clients recover **20–30% of previously lost leads** in the first month. Ready to see how this works for your business?",
      cta: "",
    };
  }
  if (lowerMessage.includes("not getting enough leads")) {
    return {
      text: "Volume is fixable. Our Lead Generation Agent captures leads from your website, social, and ads 24/7, then nurtures them until they're ready to buy. No more leads slipping through the cracks.\n\nTypical result: **200–300% more qualified leads** within 90 days. Want a custom plan for your business?",
      cta: "",
    };
  }
  if (lowerMessage.includes("unqualified leads")) {
    return {
      text: "Bad leads waste your best people's time. Our agent qualifies every inquiry before it hits your sales team — asking the right questions, scoring intent, and routing only hot prospects.\n\nThat alone saves most teams **10+ hours per week**. Worth exploring?",
      cta: "",
    };
  }
  if (lowerMessage.includes("same repetitive customer questions")) {
    return {
      text: "Repetitive questions are the #1 use case for AI support. We train an agent on your FAQs, policies, and brand voice — it handles the routine stuff instantly, 24/7.\n\nThompson Legal automated **80% of client inquiries** this way. Your team only handles what actually needs a human.",
      cta: "",
    };
  }
  if (lowerMessage.includes("after-hours customer")) {
    return {
      text: "After-hours inquiries are pure profit left on the table. Our agent never sleeps — it answers questions, captures lead info, and books appointments while you're offline.\n\nFor most service businesses, that's **15–25% of total inquiries** they'd otherwise miss entirely.",
      cta: "",
    };
  }
  if (lowerMessage.includes("double bookings")) {
    return {
      text: "Double bookings kill trust. Our Scheduling Agent syncs all calendars in real time, blocks conflicts, and sends confirmations automatically. Vals Salon went to **zero double bookings** in week one.\n\nSetup takes about 48 hours. Want to see how it'd work for your calendar?",
      cta: "",
    };
  }
  if (lowerMessage.includes("no-shows") || lowerMessage.includes("no shows")) {
    return {
      text: "No-shows cost real money. A 15% no-show rate at $100/appointment = **$1,500 lost per 100 bookings**. Automated SMS/email reminders cut that by 30–50% — and our agent handles rescheduling too.\n\nMost clients see ROI within the first month.",
      cta: "",
    };
  }
  if (lowerMessage.includes("manual scheduling takes")) {
    return {
      text: "Manual scheduling is usually 5–10 hours/week of back-and-forth emails. Our agent lets clients self-book, sends reminders, and handles reschedules — you just show up.\n\nThat's essentially a part-time employee for a fraction of the cost.",
      cta: "",
    };
  }
  if (lowerMessage.includes("inbox is completely overwhelming") || lowerMessage.includes("inbox is overwhelming")) {
    return {
      text: "An overflowing inbox is a productivity killer. Our Email Agent auto-sorts into leads, support, billing, and priority — then drafts replies in your voice. Most clients reclaim **15–20 hours per week**.\n\nWhat's the bigger issue — volume or finding the important ones?",
      cta: "",
    };
  }
  if (lowerMessage.includes("service business")) {
    return {
      text: "Service businesses usually win biggest with **lead response speed**, **appointment scheduling**, and **follow-up automation**. Those three alone can recover 20+ hours/week.\n\nWhat's eating most of your time right now — getting clients, managing bookings, or staying on top of communication?",
      cta: "",
    };
  }
  if (lowerMessage.includes("retail or e-commerce") || lowerMessage.includes("e-commerce business")) {
    return {
      text: "E-commerce and retail see huge ROI from **customer support automation**, **order follow-ups**, and **cart recovery**. Our agents handle support tickets and win back abandoned carts automatically.\n\nAre you losing more to slow support or missed sales opportunities?",
      cta: "",
    };
  }
  if (lowerMessage.includes("professional practice")) {
    return {
      text: "Professional practices — legal, medical, consulting — benefit most from **client intake automation**, **appointment scheduling**, and **after-hours inquiry handling**. Thompson Legal automated 80% of client inquiries with us.\n\nIs intake, scheduling, or follow-up your biggest bottleneck?",
      cta: "",
    };
  }

  // Thanks / appreciation
  if (/^(thanks|thank you|thx|appreciate it|great|awesome|perfect|sounds good)[\s!.?]*$/i.test(lowerMessage)) {
    return {
      text: pickRandom([
        "Anytime. What else can I help you figure out?",
        "Happy to help. Want to keep exploring automation options, or ready to book a call?",
      ]),
      cta: "",
    };
  }

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
  } else if (lowerMessage.includes("book") || lowerMessage.includes("call") || lowerMessage.includes("discovery") || lowerMessage.includes("schedule") || lowerMessage.includes("meeting") || lowerMessage.includes("appointment") || lowerMessage.includes("consultation") || lowerMessage.includes("quote")) {
    responseText = "Let's get you on the calendar. Call or text **561-201-4365**, or share your **name, email, and phone** right here and Mike will reach out within a few hours to confirm a time.";
    cta = "What's the best way to reach you?";
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
  } else if (lowerMessage.includes("automate") || lowerMessage.includes("automation") || lowerMessage.includes("ai agent")) {
    responseText = "Smart move. What's the one process you'd automate first — leads, emails, scheduling, or something else?";
    cta = "";
  } else if (lowerMessage.includes("real estate") || lowerMessage.includes("realtor")) {
    responseText = "Real estate. Brutal for response time. Are you losing leads to slow follow-ups, or is scheduling showings the bottleneck?";
    cta = "";
  } else if (lowerMessage.includes("law firm") || lowerMessage.includes("legal") || lowerMessage.includes("attorney")) {
    responseText = "Law firm. Client intake is usually the chaos point. After-hours inquiries, or volume during business hours?";
    cta = "";
  } else if (lowerMessage.includes("restaurant") || lowerMessage.includes("salon") || lowerMessage.includes("medical") || lowerMessage.includes("healthcare")) {
    responseText = "Got it. No-shows, scheduling, and follow-ups tend to be the big ones in your space. Which is hitting you hardest?";
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
