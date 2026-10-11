import {
  createTransporter,
  getSmtpConfig,
  isSmtpConfigured,
  checkRateLimit,
  isValidEmail,
  buildQuoteEmail,
  QuoteItem,
} from '../../../src/server/mail/mailer.ts';

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

    // 5. Verify SMTP configuration
    if (!isSmtpConfigured()) {
      return Response.json(
        {
          success: false,
          error:
            'Email server (SMTP) is not configured yet. Please configure SMTP_HOST, SMTP_USER, and SMTP_PASS in the server environment variables.',
        },
        { status: 503 }
      );
    }

    const config = getSmtpConfig();
    const transporter = createTransporter();

    // 6. Generate Official RFQ Reference Code
    const rfqReference = `DEY-RFQ-${Date.now().toString().slice(-4)}${Math.floor(10 + Math.random() * 90)}`;

    const submittedAt = new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'full',
      timeStyle: 'medium',
      timeZone: 'Asia/Riyadh',
    }).format(new Date()) + ' (Saudi Arabia Time)';

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

    // 7. Send via Nodemailer with Reply-To
    const mailResult = await transporter.sendMail({
      from: config.from,
      to: config.contactEmail,
      replyTo: `"${name.trim()}" <${email.trim()}>`,
      subject: `[RFQ ${rfqReference}] ${companyName.trim()} - ${sanitizedItems.length} Products Requested`,
      text: emailContent.text,
      html: emailContent.html,
    });

    return Response.json({
      success: true,
      rfqReference,
      message: `Quotation request ${rfqReference} successfully received. Our commercial desk will review and dispatch the BOQ proposal shortly.`,
      messageId: mailResult.messageId,
    });
  } catch (error: any) {
    console.error('Error handling /api/quote:', error);
    const errorMessage =
      error?.code === 'EAUTH'
        ? 'SMTP authentication failed. Please verify your SMTP credentials.'
        : error?.message || 'Failed to dispatch quotation request. Please try again or reach out to info@deysla.com directly.';

    return Response.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
