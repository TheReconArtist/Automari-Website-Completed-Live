import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Email, AiClassification } from '@/lib/types';

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) 
  : null;

export async function POST(req: Request) {
  const { email }: { email: Email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email data is required' }, { status: 400 });
  }

  // Use OpenAI if available, otherwise fallback to stub
  if (openai) {
    try {
      const prompt = `Analyze this email and provide intelligent classification:

From: ${email.sender}
Subject: ${email.subject}
Body: ${email.body}
Category: ${email.category}

Provide:
1. Priority score (0-100, where 100 is most urgent)
2. Relevant labels (e.g., Urgent, Partnership, Finance, Support, Marketing)
3. A brief summary (1-2 sentences)
4. Suggested actions (2-3 actionable items)

Respond in JSON format:
{
  "priorityScore": number,
  "labels": ["label1", "label2"],
  "summary": "brief summary",
  "suggestedActions": ["action1", "action2"]
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini', // Fast and cost-effective
        messages: [
          {
            role: 'system',
            content: 'You are an intelligent email classification assistant. Analyze emails and provide structured classifications in JSON format only, no additional text.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 300,
      });

      const content = response.choices[0]?.message?.content || '{}';
      const classification = JSON.parse(content);
      
      return NextResponse.json({
        labels: classification.labels || email.labels,
        priorityScore: classification.priorityScore || email.priorityScore || 50,
        summary: classification.summary || `Email from ${email.sender}`,
        suggestedActions: classification.suggestedActions || [],
      });
    } catch (error: any) {
      console.error('OpenAI classification error:', error);
      // Fallback to stub on error
    }
  }

  // Fallback to stub if OpenAI not available or error
  const { agentStub } = await import('@/lib/agentStub');
  const classification: AiClassification = await agentStub.classify(email);
  return NextResponse.json(classification);
}
