import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Generic contact form API endpoint
// Handles various contact form submissions and sends email notification

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'contactautomari@gmail.com',
      pass: process.env.EMAIL_PASS || '',
    },
  });
};

function formatContactEmail(data: Record<string, any>): string {
  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'long',
    timeZone: 'America/New_York',
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0891b2, #3b82f6); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
    .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-top: none; }
    .field { margin-bottom: 15px; padding: 10px; background: white; border-radius: 6px; border-left: 4px solid #0891b2; }
    .label { font-weight: bold; color: #0891b2; font-size: 12px; text-transform: uppercase; }
    .value { margin-top: 5px; font-size: 16px; color: #1e293b; }
    .footer { text-align: center; padding: 15px; color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0;">📧 ${data.type === 'agent' ? 'Agent Inquiry' : 'New Contact Request'}</h1>
    <p style="margin: 5px 0 0 0; opacity: 0.9;">${timestamp}</p>
  </div>
  
  <div class="content">
    ${data.name ? `<div class="field"><div class="label">Name</div><div class="value">${data.name}</div></div>` : ''}
    ${data.email ? `<div class="field"><div class="label">Email</div><div class="value"><a href="mailto:${data.email}">${data.email}</a></div></div>` : ''}
    ${data.phone ? `<div class="field"><div class="label">Phone</div><div class="value"><a href="tel:${data.phone}">${data.phone}</a></div></div>` : ''}
    ${data.company ? `<div class="field"><div class="label">Company</div><div class="value">${data.company}</div></div>` : ''}
    ${data.agent ? `<div class="field"><div class="label">Agent Interested In</div><div class="value">${data.agent}</div></div>` : ''}
    ${data.message ? `<div class="field"><div class="label">Message</div><div class="value">${data.message}</div></div>` : ''}
    ${data.source ? `<div class="field"><div class="label">Source</div><div class="value">${data.source}</div></div>` : ''}
  </div>
  
  <div class="footer">
    <p>From Automari.ai Website</p>
  </div>
</body>
</html>
  `;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Log the contact request
    console.log('📧 New Contact Request:', {
      timestamp: new Date().toISOString(),
      type: data.type || 'general',
      name: data.name,
      email: data.email,
    });

    // Attempt to send email if credentials are configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = createTransporter();
        
        const subject = data.type === 'agent' 
          ? `🤖 Agent Inquiry: ${data.agent} - ${data.name || data.email || 'Unknown'}`
          : `📧 Contact: ${data.name || data.email || 'Unknown'}`;

        await transporter.sendMail({
          from: `"Automari Contact" <${process.env.EMAIL_USER}>`,
          to: 'contactautomari@gmail.com',
          replyTo: data.email || undefined,
          subject,
          html: formatContactEmail(data),
        });
        
        console.log('✅ Contact email sent successfully');
      } catch (error: any) {
        console.error('❌ Failed to send contact email:', error.message);
      }
    }

    return NextResponse.json({ success: true, message: 'Message received. We\'ll be in touch soon!' });
  } catch (error: any) {
    console.error('❌ Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process request. Please call us at 561-201-4365.' },
      { status: 500 }
    );
  }
}

