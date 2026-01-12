export type EmailCategory = "leads" | "support" | "marketing" | "billing" | "priority" | "spam";
export type EmailTone = "Professional" | "Friendly" | "Brief";
export type Locale = "en" | "es" | "fr" | "de";

export const EMAIL_CATEGORIES: EmailCategory[] = ["leads", "support", "marketing", "billing", "priority", "spam"];

export interface Email {
  id: string;
  sender: string;
  subject: string;
  body: string;
  time: string;
  read: boolean;
  category: EmailCategory;
  labels: string[];
  priorityScore: number;
  summary?: string;
  suggestedActions?: string[];
}

export interface Rule {
  id: string;
  name: string;
  isActive: boolean;
  conditions: RuleCondition[];
  actions: RuleAction[];
}

export interface RuleCondition {
  field: "sender" | "subject" | "body" | "category" | "age" | "hasLabel" | "priorityScore";
  operator: "contains" | "not-contains" | "equals" | "not-equals" | "less-than" | "greater-than";
  value: string | number;
}

export interface RuleAction {
  type: "auto-reply" | "apply-label" | "assign-teammate" | "snooze" | "draft-follow-up";
  value: string; // e.g., template name, label name, teammate ID, snooze duration
}

export interface Metric {
  id: string;
  title: string;
  value: string;
  sparklineData: number[];
  unit: string;
}

export interface AiClassification {
  labels: string[];
  priorityScore: number;
  summary: string;
  suggestedActions: string[];
}

export interface AiDraftReply {
  variants: Array<{
    text: string;
    tokens: number;
    estimatedSendTime: string;
  }>;
}

export interface DemoSettings {
  mode: "demo" | "live";
}
