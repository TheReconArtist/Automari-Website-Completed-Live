// app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, timestamp: new Date().toISOString() });
}

export const runtime = 'edge'; // Optimized for Vercel Edge Functions


