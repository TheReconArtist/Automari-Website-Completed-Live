import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend lazily to avoid build-time errors
let resend: Resend | null = null;
function getResend(): Resend | null {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

// Destination email
const TO_EMAIL = 'contactautomari@gmail.com';

// Validate required fields
function validatePayload(data: Record<string, unknown>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.company || typeof data.company !== 'string' || data.company.trim().length === 0) {
    errors.push('Company name is required');
  }
  if (!data.industry || typeof data.industry !== 'string') {
    errors.push('Industry is required');
  }
  if (!data.size || typeof data.size !== 'string') {
    errors.push('Company size is required');
  }
  
  return { valid: errors.length === 0, errors };
}

// Sanitize string input
function sanitize(input: unknown): string {
  if (typeof input === 'string') {
    return input.trim().slice(0, 1000); // Max 1000 chars per field
  }
  if (Array.isArray(input)) {
    return input.map(i => sanitize(i)).join(', ');
  }
  return String(input || '');
}

// Format email body as plain text
function formatPlainText(data: Record<string, unknown>, metadata: Record<string, string>): string {
  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'long',
    timeZone: 'America/New_York',
  });

  return `
═══════════════════════════════════════════════════
       NEW BUSINESS ASSESSMENT SUBMISSION
═══════════════════════════════════════════════════

Submitted: ${timestamp}

───────────────────────────────────────────────────
COMPANY INFORMATION
───────────────────────────────────────────────────

Company Name:     ${sanitize(data.company)}
Industry:         ${sanitize(data.industry)}
Company Size:     ${sanitize(data.size)}
Annual Revenue:   ${sanitize(data.revenue) || 'Not provided'}

───────────────────────────────────────────────────
BUSINESS NEEDS
───────────────────────────────────────────────────

Pain Points:
${Array.isArray(data.painPoints) && data.painPoints.length > 0 
  ? data.painPoints.map((p: string) => `  • ${sanitize(p)}`).join('\n') 
  : '  • None specified'}

Hours on Repetitive Tasks: ${sanitize(data.timeSpent) || 'Not provided'}
Implementation Timeline:   ${sanitize(data.timeline) || 'Not provided'}

───────────────────────────────────────────────────
CONTACT INFORMATION
───────────────────────────────────────────────────

Name:   ${sanitize(data.name) || 'Not provided'}
Email:  ${sanitize(data.email) || 'Not provided'}
Phone:  ${sanitize(data.phone) || 'Not provided'}

───────────────────────────────────────────────────
METADATA
───────────────────────────────────────────────────

Page URL:    ${metadata.pageUrl}
User Agent:  ${metadata.userAgent}
IP Address:  ${metadata.ip}
Timestamp:   ${metadata.timestamp}

═══════════════════════════════════════════════════
         Automari.ai Business Assessment
═══════════════════════════════════════════════════
`.trim();
}

// Format email body as HTML
function formatHtml(data: Record<string, unknown>, metadata: Record<string, string>): string {
  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'long',
    timeZone: 'America/New_York',
  });

  const painPointsHtml = Array.isArray(data.painPoints) && data.painPoints.length > 0
    ? `<ul style="margin:0;padding-left:20px;">${data.painPoints.map((p: string) => `<li>${sanitize(p)}</li>`).join('')}</ul>`
    : '<em>None specified</em>';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1e293b;max-width:600px;margin:0 auto;padding:20px;background:#f8fafc;">
  
  <div style="background:linear-gradient(135deg,#0891b2,#3b82f6);color:white;padding:24px;border-radius:12px 12px 0 0;text-align:center;">
    <h1 style="margin:0;font-size:24px;">🚀 New Business Assessment</h1>
    <p style="margin:8px 0 0;opacity:0.9;font-size:14px;">${timestamp}</p>
  </div>
  
  <div style="background:white;padding:24px;border:1px solid #e2e8f0;border-top:none;">
    
    <h2 style="color:#0891b2;font-size:16px;margin:0 0 16px;padding-bottom:8px;border-bottom:2px solid #e2e8f0;">Company Information</h2>
    
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:8px 0;color:#64748b;width:140px;">Company Name</td><td style="padding:8px 0;font-weight:600;">${sanitize(data.company)}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;">Industry</td><td style="padding:8px 0;">${sanitize(data.industry)}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;">Company Size</td><td style="padding:8px 0;">${sanitize(data.size)}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;">Annual Revenue</td><td style="padding:8px 0;">${sanitize(data.revenue) || '<em>Not provided</em>'}</td></tr>
    </table>
    
    <h2 style="color:#0891b2;font-size:16px;margin:24px 0 16px;padding-bottom:8px;border-bottom:2px solid #e2e8f0;">Business Needs</h2>
    
    <p style="margin:0 0 8px;color:#64748b;font-size:14px;">Pain Points:</p>
    ${painPointsHtml}
    
    <table style="width:100%;border-collapse:collapse;margin-top:16px;">
      <tr><td style="padding:8px 0;color:#64748b;width:180px;">Hours on Repetitive Tasks</td><td style="padding:8px 0;">${sanitize(data.timeSpent) || '<em>Not provided</em>'}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;">Implementation Timeline</td><td style="padding:8px 0;">${sanitize(data.timeline) || '<em>Not provided</em>'}</td></tr>
    </table>
    
    <h2 style="color:#0891b2;font-size:16px;margin:24px 0 16px;padding-bottom:8px;border-bottom:2px solid #e2e8f0;">Contact Information</h2>
    
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:8px 0;color:#64748b;width:80px;">Name</td><td style="padding:8px 0;">${sanitize(data.name) || '<em>Not provided</em>'}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;">Email</td><td style="padding:8px 0;">${data.email ? `<a href="mailto:${sanitize(data.email)}" style="color:#0891b2;">${sanitize(data.email)}</a>` : '<em>Not provided</em>'}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;">Phone</td><td style="padding:8px 0;">${data.phone ? `<a href="tel:${sanitize(data.phone)}" style="color:#0891b2;">${sanitize(data.phone)}</a>` : '<em>Not provided</em>'}</td></tr>
    </table>
    
  </div>
  
  <div style="background:#f1f5f9;padding:16px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;border-top:none;">
    <p style="margin:0;font-size:12px;color:#64748b;">
      <strong>Page:</strong> ${metadata.pageUrl}<br>
      <strong>IP:</strong> ${metadata.ip}<br>
      <strong>User Agent:</strong> ${metadata.userAgent}
    </p>
  </div>
  
  <p style="text-align:center;margin:24px 0 0;font-size:12px;color:#94a3b8;">
    Automari.ai Business Assessment System
  </p>
  
</body>
</html>
`.trim();
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Parse request body
    let data: Record<string, unknown>;
    try {
      data = await req.json();
    } catch {
      console.error('[Survey API] Invalid JSON payload');
      return NextResponse.json(
        { success: false, error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Validate required fields
    const validation = validatePayload(data);
    if (!validation.valid) {
      console.error('[Survey API] Validation failed:', validation.errors);
      return NextResponse.json(
        { success: false, error: 'Missing required fields', details: validation.errors },
        { status: 400 }
      );
    }

    // Collect metadata
    const metadata = {
      timestamp: new Date().toISOString(),
      pageUrl: sanitize(data.pageUrl) || req.headers.get('referer') || 'Unknown',
      userAgent: req.headers.get('user-agent')?.slice(0, 200) || 'Unknown',
      ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
          req.headers.get('x-real-ip') || 
          'Unknown',
    };

    // Log submission (without sensitive data)
    console.log('[Survey API] New submission:', {
      company: sanitize(data.company),
      industry: sanitize(data.industry),
      timestamp: metadata.timestamp,
    });

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('[Survey API] RESEND_API_KEY not configured');
      // Still return success to user but log the issue
      // In production, you'd want to queue this or alert
      return NextResponse.json({
        success: true,
        message: 'Assessment received. Our team will contact you within 24 hours.',
        warning: 'Email delivery pending configuration',
      });
    }

    // Format email content
    const companyName = sanitize(data.company);
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const subject = `New Business Assessment — ${companyName} — ${date}`;

    // Send email via Resend
    const resendClient = getResend();
    if (!resendClient) {
      throw new Error('Resend client not initialized');
    }
    const { data: emailResult, error: emailError } = await resendClient.emails.send({
      from: 'Automari Assessments <assessments@resend.dev>', // Use resend.dev for testing, or your verified domain
      to: TO_EMAIL,
      subject,
      text: formatPlainText(data, metadata),
      html: formatHtml(data, metadata),
      replyTo: typeof data.email === 'string' && data.email.includes('@') ? data.email : undefined,
    });

    if (emailError) {
      console.error('[Survey API] Email send failed:', {
        error: emailError.message,
        company: companyName,
        duration: Date.now() - startTime,
      });
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to submit assessment. Please try calling us at 561-201-4365.',
        },
        { status: 500 }
      );
    }

    // Success
    console.log('[Survey API] Email sent successfully:', {
      emailId: emailResult?.id,
      company: companyName,
      duration: Date.now() - startTime,
    });

    return NextResponse.json({
      success: true,
      message: 'Assessment received! Mike will personally review and contact you within 24 hours.',
    });

  } catch (error) {
    console.error('[Survey API] Unexpected error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Something went wrong. Please try again or call us at 561-201-4365.',
      },
      { status: 500 }
    );
  }
}
