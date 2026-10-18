import {
  createTransporter,
  getSmtpConfig,
  isSmtpConfigured,
  checkRateLimit,
  isValidEmail,
  buildQuoteEmail,
  QuoteItem,
} from '../../../src/server/mail/mailer.ts';
import { recordQuote } from '../../../src/server/db/database.ts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting
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

    // 2. Parse request
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return Response.json(
        { success: false, error: 'Invalid JSON request payload.' },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      phone,
      companyName,
      city = 'Dammam',
      projectTimeline = 'Immediate (1-2 weeks)',
      notes,
      items = [],
      website,
    } = body;

    // 3. Honeypot check
    if (website && typeof website === 'string' && website.trim() !== '') {
      return Response.json({
        success: true,
        rfqReference: `DEY-RFQ-${Math.floor(100000 + Math.random() * 900000)}`,
        message: 'Your quotation request has been submitted.',
      });
    }

    // 4. Server-side validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return Response.json(
        { success: false, error: 'Contact name is required (minimum 2 characters).' },
        { status: 400 }
      );
    }

    if (!email || !isValidEmail(email)) {
      return Response.json(
        { success: false, error: 'A valid corporate email address is required.' },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 6) {
      return Response.json(
        { success: false, error: 'A valid telephone / mobile number is required.' },
        { status: 400 }
      );
    }

    if (!companyName || typeof companyName !== 'string' || companyName.trim().length < 2) {
      return Response.json(
        { success: false, error: 'Company or organization name is required.' },
        { status: 400 }
      );
    }

    // 5. Generate Official RFQ Reference Code
    const rfqReference = `DEY-RFQ-${Date.now().toString().slice(-4)}${Math.floor(10 + Math.random() * 90)}`;

    // Sanitize items list
    const sanitizedItems: QuoteItem[] = Array.isArray(items)
      ? items.map((it: any) => ({
          id: it.id ? String(it.id) : undefined,
          title: String(it.title || 'Custom Line Item').slice(0, 200),
          category: it.category ? String(it.category).slice(0, 100) : undefined,
          brand: it.brand ? String(it.brand).slice(0, 100) : undefined,
          sku: it.sku || it.partNumber ? String(it.sku || it.partNumber).slice(0, 100) : undefined,
          partNumber: it.partNumber ? String(it.partNumber).slice(0, 100) : undefined,
          quantity: Math.max(1, parseInt(it.quantity, 10) || 1),
          notes: it.notes ? String(it.notes).slice(0, 500) : undefined,
        }))
      : [];

    // 6. Persist to Database immediately
    const savedQuote = await recordQuote({
      rfqReference,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      companyName: companyName.trim(),
      city: String(city).trim(),
      projectTimeline: String(projectTimeline).trim(),
      notes: notes ? String(notes).trim() : undefined,
      items: sanitizedItems,
    });

    // 7. Send via Nodemailer if SMTP configured
    let mailSent = false;
    let mailMessageId: string | undefined = undefined;

    if (isSmtpConfigured()) {
      try {
        const config = getSmtpConfig();
        const transporter = createTransporter();

        const submittedAt = new Intl.DateTimeFormat('en-GB', {
          dateStyle: 'full',
          timeStyle: 'medium',
          timeZone: 'Asia/Riyadh',
        }).format(new Date()) + ' (Saudi Arabia Time)';

        const emailContent = buildQuoteEmail({
          rfqReference,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          companyName: companyName.trim(),
          city: String(city).trim(),
          projectTimeline: String(projectTimeline).trim(),
          notes: notes ? String(notes).trim() : undefined,
          items: sanitizedItems,
          submittedAt,
        });

        const targetRecipient = config.contactEmail || 'info@sa.deysla.com';
        console.log(`[Quote] Sending notification email to: ${targetRecipient}`);

        const mailResult = await transporter.sendMail({
          from: {
            name: "DEYSLA IT Solutions",
            address: "info@sa.deysla.com",
          },
          to: targetRecipient,
          replyTo: `"${name.trim()}" <${email.trim()}>`,
          subject: `[RFQ ${rfqReference}] ${companyName.trim()} - ${sanitizedItems.length} Products Requested`,
          text: emailContent.text,
          html: emailContent.html,
        });

        mailSent = true;
        mailMessageId = mailResult.messageId;
      } catch (smtpErr: any) {
        console.warn('[Quote] Smtp notification dispatch failed (record preserved in DB):', smtpErr?.message);
      }
    }

    const recipient = getSmtpConfig().contactEmail || 'info@sa.deysla.com';

    return Response.json({
      success: true,
      rfqReference: savedQuote.id,
      recipient,
      message: `Quotation request ${savedQuote.id} successfully received. Our commercial desk will review and dispatch the BOQ proposal shortly.`,
      messageId: mailMessageId,
      mailSent,
    });
  } catch (error: any) {
    console.error('Error handling /api/quote:', error);
    const errorMessage =
      error?.code === 'EAUTH'
        ? 'SMTP authentication failed. Please verify your SMTP credentials.'
        : error?.message || 'Failed to dispatch quotation request. Please try again or reach out to info@sa.deysla.com directly.';

    return Response.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
