import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Email, EmailTone, AiDraftReply } from '@/lib/types';

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) 
  : null;

export async function POST(req: Request) {
  const { email, tone, snippets }: { email: Email; tone: EmailTone; snippets: string[] } = await req.json();

  if (!email || !tone) {
    return NextResponse.json({ error: 'Email and tone are required' }, { status: 400 });
  }

  // Use OpenAI if available, otherwise fallback to stub
  if (openai) {
    try {
      const toneInstructions: Record<EmailTone, string> = {
        Professional: 'Write in a formal, business-appropriate tone',
        Friendly: 'Write in a warm, conversational, and approachable tone',
        Brief: 'Write concisely, keeping the response short and to the point',
      };

      const prompt = `Draft a professional email reply with the following tone: ${toneInstructions[tone]}

Original Email:
From: ${email.sender}
Subject: ${email.subject}
Body: ${email.body}

${snippets.length > 0 ? `Include these talking points:\n${snippets.join('\n')}` : ''}

Generate 3 different reply variations, each progressively more detailed. Return ONLY valid JSON in this format:
{
  "variants": [
    {
      "text": "reply text here",
      "tokens": estimated_token_count,
      "estimatedSendTime": "<1 min"
    }
  ]
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini', // Fast and cost-effective
        messages: [
          {
            role: 'system',
            content: 'You are an expert email assistant. Generate professional email replies in the requested tone. Return ONLY valid JSON, no additional text.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 800,
      });

      const content = response.choices[0]?.message?.content || '{}';
      const draftReply = JSON.parse(content);
      
      return NextResponse.json(draftReply);
    } catch (error: any) {
      console.error('OpenAI draft error:', error);
      // Fallback to stub on error
    }
  }

  // Fallback to stub if OpenAI not available or error
  const { agentStub } = await import('@/lib/agentStub');
  const draftReply: AiDraftReply = await agentStub.draftReply(email, tone, snippets || []);
  return NextResponse.json(draftReply);
}
