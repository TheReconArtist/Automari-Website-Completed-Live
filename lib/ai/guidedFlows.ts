// Guided conversation flows — tap-to-select options for non-technical users

export interface GuidedOption {
  label: string;
  query: string;
}

export const MAIN_CATEGORIES: GuidedOption[] = [
  { label: "Get More Leads & Sales", query: "I want to get more leads and grow my sales" },
  { label: "Book an AI Audit", query: "I want to book an AI audit for my business" },
  { label: "Build My AI Operating Layer", query: "I want to build an AI operating layer for my business" },
  { label: "CRM & Marketing Automation", query: "I need CRM and marketing automation" },
  { label: "Not Sure - Guide Me", query: "I'm not sure where to start with automation" },
];

export const LEAD_OPTIONS: GuidedOption[] = [
  { label: "Leads go cold before I respond", query: "My leads go cold because I can't respond fast enough" },
  { label: "Not enough leads coming in", query: "I'm not getting enough leads" },
  { label: "Sales team wastes time on bad leads", query: "My sales team wastes time on unqualified leads" },
  { label: "Book a discovery call", query: "I'd like to book a discovery call about lead generation" },
];

export const SUPPORT_OPTIONS: GuidedOption[] = [
  { label: "Can't respond fast enough", query: "We can't respond to customers fast enough" },
  { label: "Same questions over and over", query: "We get the same repetitive customer questions daily" },
  { label: "After-hours inquiries lost", query: "We miss after-hours customer inquiries" },
  { label: "Book a discovery call", query: "I'd like to book a discovery call about customer support automation" },
];

export const SCHEDULING_OPTIONS: GuidedOption[] = [
  { label: "Double bookings happen", query: "We keep getting double bookings" },
  { label: "Too many no-shows", query: "We have too many appointment no-shows" },
  { label: "Manual scheduling eats my time", query: "Manual scheduling takes too much of my time" },
  { label: "Book a discovery call", query: "I'd like to book a discovery call about scheduling automation" },
];

export const EMAIL_OPTIONS: GuidedOption[] = [
  { label: "Inbox is overwhelming", query: "My inbox is completely overwhelming" },
  { label: "Missing important emails", query: "Important emails get buried and missed" },
  { label: "Too much time on email daily", query: "I spend too many hours on email every day" },
  { label: "Book a discovery call", query: "I'd like to book a discovery call about email automation" },
];

export const UNSURE_OPTIONS: GuidedOption[] = [
  { label: "I run a service business", query: "I run a service business and need automation help" },
  { label: "I run a retail or e-commerce store", query: "I run a retail or e-commerce business" },
  { label: "I run a professional practice", query: "I run a professional practice like legal, medical, or consulting" },
  { label: "Just talk to someone", query: "I'd like to book a discovery call to discuss my options" },
];

export const NEXT_STEP_OPTIONS: GuidedOption[] = [
  { label: "Book an AI audit", query: "I'd like to book an AI audit" },
  { label: "Get a custom quote", query: "I need a quote for AI automation" },
  { label: "Build my AI operating layer", query: "I want to build my AI operating layer" },
  { label: "Explore another area", query: "I want to explore a different automation area" },
];

/** Returns follow-up option chips based on the user's last message */
export function getFollowUpOptions(lastUserMessage: string, lastAiMessage?: string): GuidedOption[] | null {
  const msg = lastUserMessage.toLowerCase();
  const ai = (lastAiMessage || '').toLowerCase();

  if (msg.includes('explore a different') || msg.includes('another area')) return MAIN_CATEGORIES;
  if (msg.includes('not sure') || msg.includes("don't know") || msg.includes('guide me')) return UNSURE_OPTIONS;

  if (
    msg.includes('ai audit') || msg.includes('operating layer') ||
    msg.includes('crm') || msg.includes('marketing automation')
  ) {
    return NEXT_STEP_OPTIONS;
  }

  if (
    msg.includes('lead') || msg.includes('sales') || msg.includes('cold') ||
    msg.includes('not enough') || msg.includes('unqualified') ||
    ai.includes('lead generation') || ai.includes('qualified leads')
  ) {
    if (msg.includes('discovery') || msg.includes('book') || msg.includes('quote')) return NEXT_STEP_OPTIONS;
    return LEAD_OPTIONS;
  }

  if (
    msg.includes('support') || msg.includes('customer') || msg.includes('inquir') ||
    msg.includes('repetitive') || msg.includes('after-hours') ||
    ai.includes('customer support') || ai.includes('customer inquiries')
  ) {
    if (msg.includes('discovery') || msg.includes('book')) return NEXT_STEP_OPTIONS;
    return SUPPORT_OPTIONS;
  }

  if (
    msg.includes('schedul') || msg.includes('appointment') || msg.includes('booking') ||
    msg.includes('double book') || msg.includes('no-show') ||
    ai.includes('scheduling') || ai.includes('appointment')
  ) {
    if (msg.includes('discovery') || msg.includes('book')) return NEXT_STEP_OPTIONS;
    return SCHEDULING_OPTIONS;
  }

  if (
    msg.includes('email') || msg.includes('inbox') || msg.includes('admin') ||
    ai.includes('email') || ai.includes('inbox')
  ) {
    if (msg.includes('discovery') || msg.includes('book')) return NEXT_STEP_OPTIONS;
    return EMAIL_OPTIONS;
  }

  if (
    msg.includes('service business') || msg.includes('retail') || msg.includes('e-commerce') ||
    msg.includes('professional practice') || msg.includes('legal') || msg.includes('medical')
  ) {
    return NEXT_STEP_OPTIONS;
  }

  if (/^(hi|hello|hey|howdy|sup)[\s!.?]*$/i.test(msg)) return MAIN_CATEGORIES;

  if (
    msg.includes('grow') || msg.includes('automate') || msg.includes('help') ||
    msg.includes('chaotic') || msg.includes('overwhelm') || msg.includes('bottleneck')
  ) {
    return MAIN_CATEGORIES;
  }

  return null;
}

/** Whether to show the main category picker (early in conversation) */
export function shouldShowMainCategories(messages: { sender: string; text: string }[]): boolean {
  const userMessages = messages.filter(m => m.sender === 'You');
  if (userMessages.length === 0) return true;
  if (userMessages.length === 1) {
    const msg = userMessages[0].text.toLowerCase();
    if (/^(hi|hello|hey|howdy|sup)[\s!.?]*$/i.test(msg)) return true;
  }
  return false;
}
