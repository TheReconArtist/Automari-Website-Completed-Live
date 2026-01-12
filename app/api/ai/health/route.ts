import { NextRequest, NextResponse } from 'next/server';

// Health check endpoint to determine which AI providers are available
// This is used by the client to choose the best model without making a full API call

export async function GET() {
  const providers: Record<string, boolean> = {
    groq: !!process.env.GROQ_API_KEY,
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    openai: !!process.env.OPENAI_API_KEY,
    gemini: !!process.env.GOOGLE_AI_API_KEY,
    openrouter: !!process.env.OPENROUTER_API_KEY,
  };

  // Determine priority order
  let activeProvider: string | null = null;
  if (providers.groq) {
    activeProvider = 'groq';
  } else if (providers.anthropic) {
    activeProvider = 'anthropic';
  } else if (providers.openai) {
    activeProvider = 'openai';
  } else if (providers.gemini) {
    activeProvider = 'gemini';
  } else if (providers.openrouter) {
    activeProvider = 'openrouter';
  }

  return NextResponse.json({
    available: activeProvider !== null,
    provider: activeProvider,
    providers,
  });
}

