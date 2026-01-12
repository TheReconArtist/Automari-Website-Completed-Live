import { NextRequest, NextResponse } from 'next/server';
import { OpenAIStream, AnthropicStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Import system prompt for consistent persona
import { SYSTEM_PROMPT } from '@/lib/ai/systemPrompt';
import { conversationMemory } from '@/lib/ai/conversationMemory';

// Initialize AI SDKs based on environment variables
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;
const gemini = process.env.GOOGLE_AI_API_KEY ? new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY) : null;

// Note: Edge runtime may not work with all AI SDKs, using nodejs runtime for compatibility
// export const runtime = 'edge';

// Retry logic with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
        console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
      }
    }
  }
  throw lastError;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: messages array is required', details: 'Messages must be a non-empty array' },
        { status: 400 }
      );
    }

    // Ensure messages are properly formatted
    const formattedMessages = messages
      .filter((m: any) => m.content && m.content.trim().length > 0)
      .map((m: any) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content.trim()
      }));

    if (formattedMessages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: no valid messages found', details: 'All messages must have non-empty content' },
        { status: 400 }
      );
    }

    // Count user messages to determine if this is the first message
    const userMessageCount = formattedMessages.filter((m: any) => m.role === 'user').length;
    const isFirstMessage = userMessageCount === 1;
    
    // Get conversation context from memory (if available)
    // Extract session ID from request headers or use a default
    const sessionId = req.headers.get('x-session-id') || `session-${Date.now()}`;
    const context = conversationMemory.getContext(sessionId);
    const relevantContext = conversationMemory.getRelevantContext(sessionId, formattedMessages[formattedMessages.length - 1]?.content || '');
    
    // Get the last user message for focused response
    const lastUserMessage = formattedMessages.filter((m: any) => m.role === 'user').pop()?.content || '';
    
    // Get previous AI responses to prevent repetition
    const previousAIResponses = formattedMessages
      .filter((m: any) => m.role === 'assistant')
      .map((m: any) => m.content.substring(0, 100)) // First 100 chars of each
      .slice(-5); // Last 5 responses
    
    // Enhance system prompt with conversation context
    const enhancedSystemPrompt = `${SYSTEM_PROMPT}

## CRITICAL: CURRENT CONVERSATION STATE
- Total user messages: ${userMessageCount}
- ${isFirstMessage ? '⚠️ FIRST MESSAGE - Send greeting only' : '⚠️ NOT first message - NEVER greet again, respond to what they said'}
- User just said: "${lastUserMessage}"

## ANTI-REPETITION: YOUR PREVIOUS RESPONSES
${previousAIResponses.length > 0 ? previousAIResponses.map((r: string, i: number) => `${i + 1}. "${r}..."`).join('\n') : 'None yet'}

🚫 DO NOT repeat any of the above responses. Generate something COMPLETELY DIFFERENT.
🚫 DO NOT start with the same words as your previous responses.
🚫 DO NOT ask the same question twice.

## YOUR TASK RIGHT NOW
The user said: "${lastUserMessage}"

1. ACKNOWLEDGE what they said (use their exact words/topic)
2. Add a brief insight that shows you understand
3. Ask ONE simple follow-up question (different from any you've asked before)

Keep it to 2-4 sentences. Be conversational. Sound human.

${relevantContext ? `## CONTEXT FROM EARLIER
${relevantContext}` : ''}`;

    // Determine which provider to use based on environment variables
    let stream: ReadableStream;
    let provider: string | null = null;

    try {
    // Optimized priority: OpenAI GPT-4o-mini (fastest + cheapest) > Groq > Claude > GPT-4o > Gemini
    // GPT-4o-mini is prioritized for speed and cost-efficiency while maintaining high quality
    if (openai) {
      provider = 'openai';
      const openaiStream = await retryWithBackoff(() => openai.chat.completions.create({
        model: 'gpt-4o-mini', // Fast, intelligent, cost-effective - best for sales conversations
        messages: [{ role: 'system', content: enhancedSystemPrompt }, ...formattedMessages],
        temperature: 0.85, // Balanced for natural yet focused responses
        max_tokens: 1500, // Optimized for conversational responses
        presence_penalty: 0.3, // Encourage diverse vocabulary
        frequency_penalty: 0.2, // Reduce repetition
        stream: true,
      }));
      stream = OpenAIStream(openaiStream as any);
    } else if (groq) {
      provider = 'groq';
      const groqStream = await retryWithBackoff(() => groq.chat.completions.create({
        model: 'llama-3.1-70b-versatile', // Extremely fast, high quality
        messages: [{ role: 'system', content: enhancedSystemPrompt }, ...formattedMessages],
        temperature: 0.85, // Balanced for natural yet focused responses
        max_tokens: 1500, // Optimized for conversational responses
        stream: true,
      }));
      stream = GroqStream(groqStream);
    } else if (anthropic) {
      provider = 'anthropic';
      const anthropicStream = await retryWithBackoff(() => anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022', // Best quality for business intelligence
        messages: formattedMessages,
        system: enhancedSystemPrompt,
        temperature: 0.85, // Balanced for natural yet focused responses
        max_tokens: 1500, // Optimized for conversational responses
        stream: true,
      }));
      stream = AnthropicStream(anthropicStream as any);
    } else if (gemini) {
      provider = 'gemini';
      const model = gemini.getGenerativeModel({ model: 'gemini-1.5-pro' });
      const prompt = `${enhancedSystemPrompt}\n\n${formattedMessages.map((m: any) => `${m.role}: ${m.content}`).join('\n')}`;
      const result = await retryWithBackoff(() => model.generateContentStream(prompt));
      
      // Convert Gemini stream to ReadableStream
      const encoder = new TextEncoder();
      stream = new ReadableStream({
        async start(controller) {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        }
      });
    } else if (process.env.OPENROUTER_API_KEY) {
      provider = 'openrouter';
      const openrouterOpenai = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
      });
      const openrouterStream = await retryWithBackoff(() => openrouterOpenai.chat.completions.create({
        model: "anthropic/claude-3.5-sonnet", // Best available model on OpenRouter
        messages: [{ role: 'system', content: enhancedSystemPrompt }, ...formattedMessages],
        temperature: 0.9, // Higher for more natural, varied, intelligent responses
        max_tokens: 2500, // Increased for more comprehensive responses
        stream: true,
      }));
      stream = OpenAIStream(openrouterStream as any);
    } else {
      // If no server-side LLM keys, signal client to use WebLLM or rules fallback
      return NextResponse.json({ mode: 'local' });
    }

      return new StreamingTextResponse(stream, { 
        headers: { 
          'x-llm-provider': provider || 'none',
          'Content-Type': 'text/plain; charset=utf-8',
        } 
      });
    } catch (providerError: any) {
      // If one provider fails, try fallback providers
      if (provider === 'groq' && anthropic) {
        try {
          provider = 'anthropic';
          const anthropicStream = await retryWithBackoff(() => anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            messages: formattedMessages,
            system: enhancedSystemPrompt,
            temperature: 0.9,
            max_tokens: 2500, // Increased for more comprehensive responses
            stream: true,
          }));
          stream = AnthropicStream(anthropicStream as any);
          return new StreamingTextResponse(stream, { 
            headers: { 
              'x-llm-provider': provider,
              'Content-Type': 'text/plain; charset=utf-8',
            } 
          });
        } catch (fallbackError: any) {
          // Fallback also failed, continue to error response
        }
      }
      
      // If all providers fail, return error
      return NextResponse.json(
        { 
          error: 'Failed to get response from AI provider.', 
          details: providerError.message || 'Unknown error',
          provider: provider || 'none'
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: 'Invalid request or server error.', 
        details: error.message || 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// Helper for GroqStream as 'ai' SDK doesn't export it directly yet
function GroqStream(res: AsyncIterable<Groq.Chat.Completions.ChatCompletionChunk>): ReadableStream {
  return new ReadableStream({
    async start(controller) {
      for await (const chunk of res) {
        const content = chunk.choices[0]?.delta?.content || "";
        controller.enqueue(content);
      }
      controller.close();
    },
  });
}
