import { Email, EmailTone, AiClassification, AiDraftReply, Rule } from "./types";

const simulateLatency = (min: number, max: number) =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * (max - min) + min));

export const agentStub = {
  async classify(email: Email): Promise<AiClassification> {
    await simulateLatency(300, 800);

    let labels: string[] = [];
    let priorityScore: number = email.priorityScore || 50;
    let summary: string = "";
    let suggestedActions: string[] = [];

    if (email.body.toLowerCase().includes("partnership") || email.subject.toLowerCase().includes("opportunity")) {
      labels.push("Partnership");
      priorityScore = Math.max(priorityScore, 85);
      summary = "This email is a potential partnership inquiry. It requires a prompt, detailed response.";
      suggestedActions.push("Schedule a discovery call", "Forward to sales manager");
    }

    if (email.body.toLowerCase().includes("issue") || email.subject.toLowerCase().includes("problem") || email.category === "support") {
      labels.push("Urgent");
      priorityScore = Math.max(priorityScore, 90);
      summary = "This is a critical support issue requiring immediate attention. The user is experiencing a bug.";
      suggestedActions.push("Create support ticket", "Escalate to engineering");
    }

    if (email.body.toLowerCase().includes("invoice") || email.category === "billing") {
        labels.push("Finance");
        priorityScore = Math.max(priorityScore, 70);
        summary = "This email is related to billing and likely contains an invoice or payment reminder.";
        suggestedActions.push("Process payment", "Archive invoice");
    }

    if (email.category === "marketing") {
        summary = "This is a marketing-related email, likely a newsletter or promotional material.";
        suggestedActions.push("Archive", "Mark as read");
        priorityScore = Math.min(priorityScore, 40);
    }

    // Default summary if no specific category matched yet
    if (!summary) {
        summary = `This email from ${email.sender} regarding \"${email.subject}\" contains general information.`;
    }

    return {
      labels: [...new Set([...labels, ...email.labels])],
      priorityScore,
      summary,
      suggestedActions,
    };
  },

  async draftReply(email: Email, tone: EmailTone, snippets: string[]): Promise<AiDraftReply> {
    await simulateLatency(500, 1200);

    const baseReply = `Thank you for your email regarding \"${email.subject}\".`;
    let toneModifier = "";
    let snippetText = snippets.length > 0 ? `\n\n${snippets.join("\n\n")}` : "";

    if (tone === "Professional") {
      toneModifier = "We appreciate you reaching out. Our team will review your request and get back to you shortly.";
    }
    if (tone === "Friendly") {
      toneModifier = "It's great to hear from you! We're on it and will get back to you soon.";
    }
    if (tone === "Brief") {
      toneModifier = "Received. We'll respond ASAP.";
    }

    const variants = [
      {
        text: `${baseReply} ${toneModifier}${snippetText}`, // Example 1
        tokens: Math.floor(Math.random() * 50) + 20,
        estimatedSendTime: "<1 min",
      },
      {
        text: `${baseReply} We are currently experiencing a high volume of inquiries and will respond within 24-48 hours. ${toneModifier}${snippetText}`, // Example 2
        tokens: Math.floor(Math.random() * 60) + 30,
        estimatedSendTime: "<1 min",
      },
      {
        text: `${baseReply} Our AI agent has categorized your email and will ensure it reaches the right department for a swift response. ${toneModifier}${snippetText}`, // Example 3
        tokens: Math.floor(Math.random() * 70) + 40,
        estimatedSendTime: "<1 min",
      },
    ];

    return { variants };
  },

  async evaluateRules(email: Email, rules: Rule[]): Promise<Rule[]> {
    await simulateLatency(100, 300);
    const matchingRules: Rule[] = [];
    for (const rule of rules) {
      if (!rule.isActive) continue;

      let conditionsMet = true;
      for (const condition of rule.conditions) {
        let fieldContent: string | number = "";
        switch (condition.field) {
          case "sender":
            fieldContent = email.sender.toLowerCase();
            break;
          case "subject":
            fieldContent = email.subject.toLowerCase();
            break;
          case "body":
            fieldContent = email.body.toLowerCase();
            break;
          case "category":
            fieldContent = email.category.toLowerCase();
            break;
          case "hasLabel":
            fieldContent = email.labels.map(label => label.toLowerCase()).join(" ");
            break;
          case "age": // Assuming age is in hours since time is ISO string
            const emailDate = new Date(email.time);
            const now = new Date();
            const diffMs = now.getTime() - emailDate.getTime();
            fieldContent = diffMs / (1000 * 60 * 60); // Age in hours
            break;
        }

        if (typeof condition.value === "string") {
            const conditionValue = condition.value.toLowerCase();
            if (condition.operator === "contains" && !String(fieldContent).includes(conditionValue)) {
              conditionsMet = false;
              break;
            }
            if (condition.operator === "not-contains" && String(fieldContent).includes(conditionValue)) {
                conditionsMet = false;
                break;
            }
            if (condition.operator === "equals" && String(fieldContent) !== conditionValue) {
                conditionsMet = false;
                break;
            }
            if (condition.operator === "not-equals" && String(fieldContent) === conditionValue) {
                conditionsMet = false;
                break;
            }
        } else if (typeof condition.value === "number" && typeof fieldContent === "number") {
            if (condition.operator === "less-than" && !(fieldContent < condition.value)) {
              conditionsMet = false;
              break;
            }
            if (condition.operator === "greater-than" && !(fieldContent > condition.value)) {
              conditionsMet = false;
              break;
            }
        }
      }

      if (conditionsMet) {
        matchingRules.push(rule);
      }
    }
    return matchingRules;
  }
};
