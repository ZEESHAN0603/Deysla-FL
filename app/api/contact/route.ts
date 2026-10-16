import {
  createTransporter,
  getSmtpConfig,
  isSmtpConfigured,
  checkRateLimit,
  isValidEmail,
  buildContactEmail,
} from '../../../src/server/mail/mailer.ts';
import { recordComplaint } from '../../../src/server/db/database.ts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. IP Rate Limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    const rateCheck = checkRateLimit(clientIp);
    if (!rateCheck.allowed) {
      return Response.json(
        {
          success: false,
          error: `Too many submissions. Please wait ${rateCheck.retryAfterSeconds} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    // 2. Parse payload
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return Response.json(
        { success: false, error: 'Invalid JSON request payload.' },
        { status: 400 }
      );
    }

    const { name, email, contact, companyName, message, website, type } = body;

    // 3. Honeypot spam protection
    if (website && typeof website === 'string' && website.trim() !== '') {
      // Silently reject bot submissions
      return Response.json({
        success: true,
        message: 'Your inquiry has been received.',
      });
    }

    // 4. Server-side Validation with reasonable length limits
    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return Response.json(
        { success: false, error: 'Full name is required (2 to 100 characters).' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || email.trim().length > 120 || !isValidEmail(email)) {
      return Response.json(
        { success: false, error: 'A valid email address is required (maximum 120 characters).' },
        { status: 400 }
      );
    }

    if (companyName && (typeof companyName !== 'string' || companyName.trim().length > 120)) {
      return Response.json(
        { success: false, error: 'Company name exceeds 120 characters limit.' },
        { status: 400 }
      );
    }

    if (contact && (typeof contact !== 'string' || contact.trim().length > 50)) {
      return Response.json(
        { success: false, error: 'Contact number exceeds 50 characters limit.' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5 || message.trim().length > 5000) {
      return Response.json(
        { success: false, error: 'Message is required (5 to 5000 characters).' },
        { status: 400 }
      );
    }

    // Determine inquiry type
    const inquiryType: 'Contact Enquiry' | 'Complaint' =
      type === 'Complaint' || (typeof type === 'string' && type.toLowerCase().includes('complaint'))
        ? 'Complaint'
        : 'Contact Enquiry';

    // 5. Persist inquiry/complaint to database immediately
    const complaintRecord = recordComplaint({
      name: name.trim(),
      email: email.trim(),
      contact: contact ? contact.trim() : undefined,
      companyName: companyName ? String(companyName).trim() : undefined,
      message: message.trim(),
      type: inquiryType,
    });

    // 6. Verify SMTP configuration and send email notification
    let mailSent = false;
    let mailError: string | null = null;
    let mailMessageId: string | undefined = undefined;

    if (isSmtpConfigured()) {
      try {
        const config = getSmtpConfig();
        const transporter = createTransporter();

        const targetRecipient = config.contactEmail || 'info@sa.deysla.com';
        console.log(`[Contact] Sending notification email to: ${targetRecipient}`);

        const submittedAt = new Intl.DateTimeFormat('en-GB', {
          dateStyle: 'full',
          timeStyle: 'medium',
          timeZone: 'Asia/Riyadh',
        }).format(new Date()) + ' (Saudi Arabia Time)';

        const emailContent = buildContactEmail({
          name: name.trim(),
          email: email.trim(),
          contact: contact ? contact.trim() : 'Not provided',
          companyName: companyName ? String(companyName).trim() : undefined,
          message: message.trim(),
          submittedAt,
        });

        const subjectPrefix = inquiryType === 'Complaint' ? 'Customer Complaint' : 'New Customer Enquiry';

        const mailResult = await transporter.sendMail({
          from: {
            name: "DEYSLA IT Solutions",
            address: "info@sa.deysla.com",
          },
          to: targetRecipient,
          replyTo: `"${name.trim()}" <${email.trim()}>`,
          subject: `[${complaintRecord.id}] ${subjectPrefix} - DEYSLA: ${name.trim()}${companyName ? ` (${companyName.trim()})` : ''}`,
          text: emailContent.text,
          html: emailContent.html,
        });

        mailSent = true;
        mailMessageId = mailResult.messageId;
      } catch (smtpErr: any) {
        console.warn('[Contact] Smtp notification dispatch failed (record preserved in DB):', smtpErr?.message);
        mailError = smtpErr?.message;
      }
    }

    const recipient = getSmtpConfig().contactEmail || 'info@sa.deysla.com';

    return Response.json({
      success: true,
      complaintId: complaintRecord.id,
      recipient,
      message: 'Thank you! Your message has been sent successfully to the DEYSLA support team.',
      messageId: mailMessageId,
      mailSent,
    });

  } catch (error: any) {
    console.error('Error handling /api/contact:', error);
    const errorMessage =
      error?.code === 'EAUTH'
        ? 'SMTP authentication failed. Please verify your SMTP username and password / app password.'
        : error?.message || 'Failed to dispatch email. Please try again or reach out to info@sa.deysla.com directly.';

    return Response.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
