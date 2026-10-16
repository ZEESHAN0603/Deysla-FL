import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: {
    name: string;
    address: string;
  };
  contactEmail: string;
}

export function getSmtpConfig(): SmtpConfig {
  const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER || 'info@sa.deysla.com';
  const pass = process.env.SMTP_PASS || '';
  const from = {
    name: 'DEYSLA IT Solutions',
    address: 'info@sa.deysla.com',
  };
  const contactEmail = process.env.CONTACT_EMAIL || 'info@sa.deysla.com';

  return {
    host,
    port,
    secure,
    user,
    pass,
    from,
    contactEmail,
  };
}

export function isSmtpConfigured(): boolean {
  const config = getSmtpConfig();
  if (!config.host || !config.user || !config.pass) {
    return false;
  }
  // Check for obvious placeholders
  if (
    config.host.includes('example.com') ||
    config.user.includes('example.com') ||
    config.pass.includes('your-')
  ) {
    return false;
  }
  return true;
}

export function createTransporter(): Transporter {
  const config = getSmtpConfig();

  if (!isSmtpConfigured()) {
    throw new Error(
      'SMTP credentials are not configured or contain placeholder values. Please set valid SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS in environment variables.'
    );
  }

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    },
  });
}

// In-memory rate limiting: IP -> { count, resetAt }
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

export function checkRateLimit(clientIp: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(clientIp);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfterSeconds: retryAfter };
  }

  entry.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

// Sanitization: Escape HTML to avoid injection in email clients
export function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Email format validator
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return regex.test(email.trim());
}

// Base Brand Email Layout
export function renderEmailWrapper(options: {
  badgeTitle: string;
  badgeColor?: string;
  heading: string;
  subheading?: string;
  contentHtml: string;
}): string {
  const currentYear = new Date().getFullYear();
  const badgeColor = options.badgeColor || '#0284c7';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(options.heading)}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f1f5f9;
      color: #0f172a;
      -webkit-font-smoothing: antialiased;
    }
    table { border-collapse: collapse; }
    .container {
      max-width: 640px;
      margin: 24px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
      border: 1px solid #e2e8f0;
    }
    .header {
      background: linear-gradient(135deg, #090d16 0%, #0f172a 100%);
      padding: 28px 32px;
      color: #ffffff;
      border-bottom: 3px solid ${badgeColor};
    }
    .brand-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #ffffff;
      margin: 0;
    }
    .brand-subtitle {
      font-size: 11px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 600;
      margin-top: 2px;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background-color: rgba(2, 132, 199, 0.2);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.4);
      margin-top: 10px;
    }
    .header-h1 {
      font-size: 22px;
      font-weight: 700;
      color: #ffffff;
      margin: 12px 0 4px 0;
    }
    .header-sub {
      font-size: 13px;
      color: #cbd5e1;
      margin: 0;
    }
    .body-content {
      padding: 32px;
    }
    .data-table {
      width: 100%;
      margin: 16px 0;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }
    .data-table th {
      text-align: left;
      padding: 10px 14px;
      background-color: #f8fafc;
      color: #475569;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #e2e8f0;
    }
    .data-table td {
      padding: 12px 14px;
      font-size: 13px;
      color: #1e293b;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: top;
    }
    .data-table tr:last-child td {
      border-bottom: none;
    }
    .data-table td.label-col {
      width: 32%;
      font-weight: 600;
      color: #64748b;
      background-color: #fafbfd;
    }
    .message-box {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid ${badgeColor};
      border-radius: 6px;
      padding: 16px;
      margin: 16px 0;
      font-size: 13px;
      line-height: 1.6;
      color: #334155;
      white-space: pre-wrap;
    }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 24px 0 8px 0;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .footer {
      background-color: #f8fafc;
      padding: 20px 32px;
      border-top: 1px solid #e2e8f0;
      font-size: 11px;
      color: #64748b;
      text-align: center;
      line-height: 1.5;
    }
    .footer a {
      color: #0284c7;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1 class="brand-title">DEYSLA IT Solutions</h1>
        <div class="brand-subtitle">Enterprise IT · Infrastructure · Cybersecurity</div>
      </div>
      <div>
        <span class="badge">${escapeHtml(options.badgeTitle)}</span>
      </div>
      <h2 class="header-h1">${escapeHtml(options.heading)}</h2>
      ${options.subheading ? `<p class="header-sub">${escapeHtml(options.subheading)}</p>` : ''}
    </div>
    
    <div class="body-content">
      ${options.contentHtml}
    </div>

    <div class="footer">
      <p style="margin: 0 0 6px 0; font-weight: 600; color: #334155;">
        DEYSLA IT Solutions · Dammam, Kingdom of Saudi Arabia
      </p>
      <p style="margin: 0 0 6px 0;">
        Tel: +966 50 206 0148 &bull; Email: <a href="mailto:info@sa.deysla.com">info@sa.deysla.com</a> &bull; Web: <a href="https://deysla.com">deysla.com</a>
      </p>
      <p style="margin: 0; font-size: 10px; color: #94a3b8;">
        &copy; ${currentYear} DEYSLA Information Technology. All rights reserved. Automated transmission from DEYSLA Web Platform.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// 1. Contact Form Email Template
export function buildContactEmail(data: {
  name: string;
  email: string;
  contact: string;
  companyName?: string;
  message: string;
  submittedAt: string;
}): { html: string; text: string } {
  const contentHtml = `
    <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-left: 4px solid #0284c7; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px;">
      <div style="font-size: 11px; font-weight: 700; color: #0284c7; text-transform: uppercase; letter-spacing: 0.5px;">Customer Contact Information:</div>
      <div style="font-size: 18px; font-weight: 800; color: #0369a1; margin-top: 2px;">${escapeHtml(data.name)} &bull; <a href="mailto:${escapeHtml(data.email)}" style="color: #0284c7; text-decoration: none;">${escapeHtml(data.email)}</a></div>
      <div style="font-size: 13px; color: #475569; margin-top: 4px;">Phone: <a href="tel:${escapeHtml(data.contact)}" style="color: #475569;">${escapeHtml(data.contact)}</a> ${data.companyName ? `&bull; Company: <strong>${escapeHtml(data.companyName)}</strong>` : ''}</div>
    </div>

    <div class="section-title">Customer Information</div>
    <table class="data-table">
      <tr>
        <td class="label-col">Full Name</td>
        <td><strong>${escapeHtml(data.name)}</strong></td>
      </tr>
      <tr>
        <td class="label-col">Corporate Email</td>
        <td><a href="mailto:${escapeHtml(data.email)}" style="color: #0284c7;">${escapeHtml(data.email)}</a></td>
      </tr>
      <tr>
        <td class="label-col">Phone / WhatsApp</td>
        <td><a href="tel:${escapeHtml(data.contact)}" style="color: #0284c7;">${escapeHtml(data.contact)}</a></td>
      </tr>
      <tr>
        <td class="label-col">Company Name</td>
        <td>${data.companyName ? escapeHtml(data.companyName) : '<em style="color:#94a3b8;">Not specified</em>'}</td>
      </tr>
      <tr>
        <td class="label-col">Date & Time</td>
        <td>${escapeHtml(data.submittedAt)}</td>
      </tr>
    </table>

    <div class="section-title">Customer Inquiry Details</div>
    <div class="message-box">${escapeHtml(data.message)}</div>

    <p style="font-size: 12px; color: #64748b; margin-top: 20px;">
      💡 <em>Tip: You can reply directly to this email to respond back to <strong>${escapeHtml(data.name)} (${escapeHtml(data.email)})</strong>.</em>
    </p>
  `;

  const html = renderEmailWrapper({
    badgeTitle: 'Customer Contact Inquiry',
    badgeColor: '#0284c7',
    heading: 'New Contact Request Received',
    subheading: `Customer: ${data.name} (${data.email}) via DEYSLA website contact portal`,
    contentHtml,
  });

  const text = `
DEYSLA IT SOLUTIONS - NEW CONTACT ENQUIRY
--------------------------------------------------
Customer: ${data.name} <${data.email}>
Phone: ${data.contact}
Company: ${data.companyName || 'N/A'}
Date & Time: ${data.submittedAt}

Message:
${data.message}

Reply directly to this email to respond to ${data.name} at ${data.email}.
  `.trim();

  return { html, text };
}

// 2. Quote Request / RFQ Email Template
export interface QuoteItem {
  id?: string;
  title: string;
  category?: string;
  brand?: string;
  sku?: string;
  partNumber?: string;
  quantity: number;
  notes?: string;
}

export function buildQuoteEmail(data: {
  rfqReference: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  city: string;
  projectTimeline: string;
  notes?: string;
  items: QuoteItem[];
  submittedAt: string;
}): { html: string; text: string } {
  const itemsRows = data.items && data.items.length > 0
    ? data.items
        .map(
          (item, idx) => `
      <tr>
        <td style="text-align: center; color: #64748b; width: 36px;">${idx + 1}</td>
        <td>
          <div style="font-weight: 600; color: #0f172a;">${escapeHtml(item.title)}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
            ${item.category ? `Category: ${escapeHtml(item.category)}` : ''}
            ${item.brand ? ` &bull; Brand: ${escapeHtml(item.brand)}` : ''}
            ${item.partNumber || item.sku ? ` &bull; Model/P/N: ${escapeHtml(item.partNumber || item.sku || '')}` : ''}
          </div>
          ${item.notes ? `<div style="font-size: 11px; color: #0284c7; margin-top: 3px;">Note: ${escapeHtml(item.notes)}</div>` : ''}
        </td>
        <td style="text-align: center; font-weight: 700; color: #0284c7; width: 64px;">${item.quantity}</td>
      </tr>
    `
        )
        .join('')
    : `<tr><td colspan="3" style="text-align: center; color: #94a3b8; padding: 16px;">No specific catalog items attached (General Bill of Quantities request)</td></tr>`;

  const totalQuantity = data.items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const contentHtml = `
    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px;">
      <span style="font-size: 11px; font-weight: 700; color: #166534; text-transform: uppercase;">RFQ Reference Number:</span>
      <div style="font-size: 18px; font-weight: 800; color: #15803d; letter-spacing: 0.5px;">${escapeHtml(data.rfqReference)}</div>
    </div>

    <div class="section-title">Corporate Buyer Information</div>
    <table class="data-table">
      <tr>
        <td class="label-col">Contact Name</td>
        <td><strong>${escapeHtml(data.name)}</strong></td>
      </tr>
      <tr>
        <td class="label-col">Corporate Email</td>
        <td><a href="mailto:${escapeHtml(data.email)}" style="color: #0284c7;">${escapeHtml(data.email)}</a></td>
      </tr>
      <tr>
        <td class="label-col">Phone / Mobile</td>
        <td><a href="tel:${escapeHtml(data.phone)}" style="color: #0284c7;">${escapeHtml(data.phone)}</a></td>
      </tr>
      <tr>
        <td class="label-col">Organization</td>
        <td><strong>${escapeHtml(data.companyName)}</strong></td>
      </tr>
      <tr>
        <td class="label-col">Project Location / City</td>
        <td>${escapeHtml(data.city)}</td>
      </tr>
      <tr>
        <td class="label-col">Project Timeline</td>
        <td>${escapeHtml(data.projectTimeline)}</td>
      </tr>
      <tr>
        <td class="label-col">Submission Time</td>
        <td>${escapeHtml(data.submittedAt)}</td>
      </tr>
    </table>

    <div class="section-title">Requested Bill of Quantities (${data.items.length} line items &bull; Total Units: ${totalQuantity})</div>
    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 36px; text-align: center;">#</th>
          <th>Equipment / Hardware Description</th>
          <th style="width: 64px; text-align: center;">Qty</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    ${data.notes ? `
      <div class="section-title">Additional Project Specifications &amp; Notes</div>
      <div class="message-box">${escapeHtml(data.notes)}</div>
    ` : ''}

    <p style="font-size: 12px; color: #64748b; margin-top: 20px;">
      💡 <em>Tip: Reply directly to this email to deliver the official quotation to <strong>${escapeHtml(data.name)} (${escapeHtml(data.email)})</strong>.</em>
    </p>
  `;

  const html = renderEmailWrapper({
    badgeTitle: `RFQ · ${data.rfqReference}`,
    badgeColor: '#10b981',
    heading: 'New Equipment Quotation Request',
    subheading: `${data.companyName} (${data.name}) - ${data.items.length} Line Items Requested`,
    contentHtml,
  });

  const textItems = data.items.map((it, i) => `${i + 1}. [Qty: ${it.quantity}] ${it.title} (${it.category || ''} ${it.sku ? 'P/N: ' + it.sku : ''}) ${it.notes ? 'Note: ' + it.notes : ''}`).join('\n');

  const text = `
DEYSLA IT SOLUTIONS - EQUIPMENT QUOTATION REQUEST (RFQ)
--------------------------------------------------
RFQ Reference: ${data.rfqReference}
Client Name: ${data.name}
Company: ${data.companyName}
Email: ${data.email}
Phone: ${data.phone}
Location: ${data.city}
Timeline: ${data.projectTimeline}
Date: ${data.submittedAt}

Requested Hardware Items:
${textItems || 'No catalog items attached'}

Project Notes:
${data.notes || 'None provided'}
  `.trim();

  return { html, text };
}

// 3. Careers Job Application Email Template
export function buildCareersEmail(data: {
  position: string;
  name: string;
  email: string;
  phone: string;
  experience?: string;
  noticePeriod?: string;
  portfolioUrl?: string;
  coverLetter?: string;
  resumeFileName?: string;
  resumeFileSizeFormatted?: string;
  submittedAt: string;
}): { html: string; text: string } {
  const contentHtml = `
    <div style="background-color: #eef2ff; border: 1px solid #c7d2fe; border-left: 4px solid #6366f1; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px;">
      <div style="font-size: 11px; font-weight: 700; color: #4f46e5; text-transform: uppercase; letter-spacing: 0.5px;">Candidate Application:</div>
      <div style="font-size: 18px; font-weight: 800; color: #3730a3; margin-top: 2px;">${escapeHtml(data.name)} &bull; <a href="mailto:${escapeHtml(data.email)}" style="color: #4f46e5; text-decoration: none;">${escapeHtml(data.email)}</a></div>
      <div style="font-size: 14px; font-weight: 600; color: #4338ca; margin-top: 4px;">Applied for: ${escapeHtml(data.position)} &bull; Phone: ${escapeHtml(data.phone)}</div>
    </div>

    <div class="section-title">Candidate Details</div>
    <table class="data-table">
      <tr>
        <td class="label-col">Candidate Name</td>
        <td><strong>${escapeHtml(data.name)}</strong></td>
      </tr>
      <tr>
        <td class="label-col">Email Address</td>
        <td><a href="mailto:${escapeHtml(data.email)}" style="color: #0284c7;">${escapeHtml(data.email)}</a></td>
      </tr>
      <tr>
        <td class="label-col">Phone / WhatsApp</td>
        <td><a href="tel:${escapeHtml(data.phone)}" style="color: #0284c7;">${escapeHtml(data.phone)}</a></td>
      </tr>
      <tr>
        <td class="label-col">Relevant Experience</td>
        <td>${data.experience ? escapeHtml(data.experience) : '<em style="color:#94a3b8;">Not specified</em>'}</td>
      </tr>
      <tr>
        <td class="label-col">Notice Period / Availability</td>
        <td>${data.noticePeriod ? escapeHtml(data.noticePeriod) : '<em style="color:#94a3b8;">Not specified</em>'}</td>
      </tr>
      ${data.portfolioUrl ? `
      <tr>
        <td class="label-col">LinkedIn / Portfolio</td>
        <td><a href="${escapeHtml(data.portfolioUrl)}" target="_blank" rel="noopener noreferrer" style="color: #0284c7;">${escapeHtml(data.portfolioUrl)}</a></td>
      </tr>
      ` : ''}
      <tr>
        <td class="label-col">Submission Timestamp</td>
        <td>${escapeHtml(data.submittedAt)}</td>
      </tr>
      ${data.resumeFileName ? `
      <tr>
        <td class="label-col">Resume Attachment</td>
        <td>
          <span style="font-weight: 600; color: #0f172a;">📎 ${escapeHtml(data.resumeFileName)}</span>
          ${data.resumeFileSizeFormatted ? `<span style="font-size: 11px; color: #64748b;"> (${escapeHtml(data.resumeFileSizeFormatted)})</span>` : ''}
        </td>
      </tr>
      ` : ''}
    </table>

    ${data.coverLetter ? `
      <div class="section-title">Candidate Cover Note / Executive Summary</div>
      <div class="message-box">${escapeHtml(data.coverLetter)}</div>
    ` : ''}

    <p style="font-size: 12px; color: #64748b; margin-top: 20px;">
      💡 <em>Tip: You can reply directly to this email to interview or communicate with <strong>${escapeHtml(data.name)} (${escapeHtml(data.email)})</strong>.</em>
    </p>
  `;

  const html = renderEmailWrapper({
    badgeTitle: 'Talent Acquisition · DEYSLA Careers',
    badgeColor: '#6366f1',
    heading: 'New Candidate Job Application',
    subheading: `Candidate: ${data.name} (${data.email}) applied for "${data.position}"`,
    contentHtml,
  });

  const text = `
DEYSLA IT SOLUTIONS - CAREERS APPLICATION
--------------------------------------------------
Position: ${data.position}
Candidate: ${data.name} <${data.email}>
Phone: ${data.phone}
Experience: ${data.experience || 'N/A'}
Notice Period: ${data.noticePeriod || 'N/A'}
LinkedIn / Portfolio: ${data.portfolioUrl || 'N/A'}
Resume: ${data.resumeFileName || 'None'}
Date: ${data.submittedAt}

Cover Note:
${data.coverLetter || 'None'}

Reply directly to this email to respond to ${data.name} at ${data.email}.
  `.trim();

  return { html, text };
}

// 4. Admin Direct Customer Reply Email Template
export function buildAdminReplyEmail(data: {
  customerName: string;
  originalSubject: string;
  inquiryId: string;
  message: string;
}): { html: string; text: string } {
  const contentHtml = `
    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #16a34a; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px;">
      <div style="font-size: 11px; font-weight: 700; color: #15803d; text-transform: uppercase; letter-spacing: 0.5px;">Support Reference:</div>
      <div style="font-size: 16px; font-weight: 800; color: #166534; margin-top: 2px;">Ticket #${escapeHtml(data.inquiryId)} &bull; ${escapeHtml(data.originalSubject)}</div>
    </div>

    <div class="section-title">Message from DEYSLA IT Solutions Support</div>
    <div class="message-box" style="border-left-color: #0284c7; background-color: #ffffff; border: 1px solid #e2e8f0; font-size: 14px; line-height: 1.7; color: #1e293b;">
      ${escapeHtml(data.message).replace(/\n/g, '<br/>')}
    </div>

    <p style="font-size: 12px; color: #64748b; margin-top: 24px;">
      Need further assistance? You can reply directly to this email or contact us at <a href="mailto:info@sa.deysla.com" style="color: #0284c7;">info@sa.deysla.com</a> or +966 50 206 0148.
    </p>
  `;

  const html = renderEmailWrapper({
    badgeTitle: `Support Response · #${data.inquiryId}`,
    badgeColor: '#0284c7',
    heading: 'Update from DEYSLA IT Solutions',
    subheading: `Dear ${data.customerName}, in response to your recent communication (#${data.inquiryId})`,
    contentHtml,
  });

  const text = `
DEYSLA IT SOLUTIONS - SUPPORT RESPONSE
--------------------------------------------------
Ticket ID: #${data.inquiryId}
Subject: ${data.originalSubject}
Recipient: ${data.customerName}

${data.message}

--------------------------------------------------
DEYSLA IT Solutions · Dammam, Kingdom of Saudi Arabia
Tel: +966 50 206 0148 · Email: info@sa.deysla.com · Web: https://deysla.com
  `.trim();

  return { html, text };
}
