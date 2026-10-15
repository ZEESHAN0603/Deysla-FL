import {
  createTransporter,
  getSmtpConfig,
  isSmtpConfigured,
  checkRateLimit,
  isValidEmail,
  buildCareersEmail,
} from '../../../src/server/mail/mailer.ts';
import { recordCareerApplication } from '../../../src/server/db/cmsStore.ts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/octet-stream', // Some browsers send octet-stream for docx
];
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

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

    const contentType = request.headers.get('content-type') || '';
    let name = '';
    let email = '';
    let phone = '';
    let position = 'General Technical Application';
    let experience = '';
    let noticePeriod = '';
    let portfolioUrl = '';
    let coverLetter = '';
    let website = '';
    let attachmentBuffer: Buffer | null = null;
    let resumeFileName: string | undefined = undefined;
    let resumeFileSizeFormatted: string | undefined = undefined;
    let resumeMimeType: string = 'application/pdf';

    // 2. Parse either FormData or JSON
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      name = String(formData.get('name') || '');
      email = String(formData.get('email') || '');
      phone = String(formData.get('phone') || '');
      position = String(formData.get('position') || 'General Technical Application');
      experience = String(formData.get('experience') || '');
      noticePeriod = String(formData.get('noticePeriod') || '');
      portfolioUrl = String(formData.get('portfolioUrl') || '');
      coverLetter = String(formData.get('coverLetter') || '');
      website = String(formData.get('website') || '');

      const resumeFile = formData.get('resume');
      if (resumeFile && typeof resumeFile === 'object' && 'name' in resumeFile) {
        const file = resumeFile as File;
        if (file.size > 0) {
          // Validate file size
          if (file.size > MAX_FILE_SIZE_BYTES) {
            return Response.json(
              {
                success: false,
                error: `Resume file is too large (${formatBytes(file.size)}). Maximum allowed size is 5 MB.`,
              },
              { status: 400 }
            );
          }

          // Validate extension
          const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
          if (!ALLOWED_EXTENSIONS.includes(ext)) {
            return Response.json(
              {
                success: false,
                error: 'Invalid file format. Please upload your resume as PDF (.pdf) or Word document (.doc, .docx).',
              },
              { status: 400 }
            );
          }

          // Validate MIME type if provided and not generic
          if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
            return Response.json(
              {
                success: false,
                error: `Unsupported file type: ${file.type}. Please upload a valid PDF or Word document.`,
              },
              { status: 400 }
            );
          }

          const arrayBuffer = await file.arrayBuffer();
          attachmentBuffer = Buffer.from(arrayBuffer);
          resumeFileName = file.name;
          resumeFileSizeFormatted = formatBytes(file.size);
          resumeMimeType = file.type || 'application/octet-stream';
        }
      }
    } else {
      const body = await request.json().catch(() => null);
      if (!body || typeof body !== 'object') {
        return Response.json(
          { success: false, error: 'Invalid JSON request payload.' },
          { status: 400 }
        );
      }

      name = String(body.name || '');
      email = String(body.email || '');
      phone = String(body.phone || '');
      position = String(body.position || 'General Technical Application');
      experience = String(body.experience || '');
      noticePeriod = String(body.noticePeriod || '');
      portfolioUrl = String(body.portfolioUrl || '');
      coverLetter = String(body.coverLetter || '');
      website = String(body.website || '');

      if (body.resume && typeof body.resume === 'object') {
        const { fileName, base64, mimeType, size } = body.resume;
        if (base64) {
          const rawBase64 = base64.replace(/^data:[^;]+;base64,/, '');
          const buffer = Buffer.from(rawBase64, 'base64');

          if (buffer.length > MAX_FILE_SIZE_BYTES) {
            return Response.json(
              {
                success: false,
                error: `Resume file is too large (${formatBytes(buffer.length)}). Maximum allowed size is 5 MB.`,
              },
              { status: 400 }
            );
          }

          const ext = String(fileName || '').substring(String(fileName || '').lastIndexOf('.')).toLowerCase();
          if (!ALLOWED_EXTENSIONS.includes(ext)) {
            return Response.json(
              {
                success: false,
                error: 'Invalid resume format. Only PDF (.pdf) and Word documents (.doc, .docx) are allowed.',
              },
              { status: 400 }
            );
          }

          attachmentBuffer = buffer;
          resumeFileName = fileName || 'Resume.pdf';
          resumeFileSizeFormatted = formatBytes(buffer.length);
          resumeMimeType = mimeType || 'application/pdf';
        }
      }
    }

    // 3. Honeypot check
    if (website && typeof website === 'string' && website.trim() !== '') {
      return Response.json({
        success: true,
        message: 'Your job application has been recorded.',
      });
    }

    // 4. Server-side validation
    if (!name || name.trim().length < 2) {
      return Response.json(
        { success: false, error: 'Candidate name is required (minimum 2 characters).' },
        { status: 400 }
      );
    }

    if (!email || !isValidEmail(email)) {
      return Response.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    if (!phone || phone.trim().length < 6) {
      return Response.json(
        { success: false, error: 'A valid contact phone or WhatsApp number is required.' },
        { status: 400 }
      );
    }

    if (!position || position.trim().length < 2) {
      return Response.json(
        { success: false, error: 'Please select or specify the position you are applying for.' },
        { status: 400 }
      );
    }

    // 5. Persist application to Database (MySQL / JSON fallback) BEFORE email delivery
    let savedApplicationId = '';
    try {
      const applicationRecord = await recordCareerApplication({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        position: position.trim(),
        experience: experience ? experience.trim() : undefined,
        noticePeriod: noticePeriod ? noticePeriod.trim() : undefined,
        portfolioUrl: portfolioUrl ? portfolioUrl.trim() : undefined,
        coverLetter: coverLetter ? coverLetter.trim() : undefined,
        resumeFilename: resumeFileName,
      });
      savedApplicationId = applicationRecord.id;
    } catch (dbErr) {
      console.error('[Careers DB Error] Failed to persist career record:', dbErr);
    }

    // 6. Verify SMTP configuration and send notification email
    if (!isSmtpConfigured()) {
      return Response.json({
        success: true,
        applicationId: savedApplicationId,
        message: `Your application for "${position}" has been received and saved (Application ID: ${savedApplicationId}).`,
      });
    }

    const config = getSmtpConfig();
    const transporter = createTransporter();

    const submittedAt = new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'full',
      timeStyle: 'medium',
      timeZone: 'Asia/Riyadh',
    }).format(new Date()) + ' (Saudi Arabia Time)';

    const emailContent = buildCareersEmail({
      position: position.trim(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      experience: experience ? experience.trim() : undefined,
      noticePeriod: noticePeriod ? noticePeriod.trim() : undefined,
      portfolioUrl: portfolioUrl ? portfolioUrl.trim() : undefined,
      coverLetter: coverLetter ? coverLetter.trim() : undefined,
      resumeFileName,
      resumeFileSizeFormatted,
      submittedAt,
    });

    // Assemble Nodemailer payload
    const mailOptions: any = {
      from: config.from,
      to: config.contactEmail,
      replyTo: `"${name.trim()}" <${email.trim()}>`,
      subject: `[Job Application] ${position.trim()} - ${name.trim()}`,
      text: emailContent.text,
      html: emailContent.html,
    };

    if (attachmentBuffer && resumeFileName) {
      mailOptions.attachments = [
        {
          filename: resumeFileName,
          content: attachmentBuffer,
          contentType: resumeMimeType,
        },
      ];
    }

    try {
      const mailResult = await transporter.sendMail(mailOptions);
      return Response.json({
        success: true,
        applicationId: savedApplicationId,
        message: `Your application for "${position}" has been received along with your CV. Our recruitment team will review your profile.`,
        messageId: mailResult.messageId,
      });
    } catch (smtpErr: any) {
      console.warn('[Careers SMTP Warning] Email failed but application saved in DB:', smtpErr?.message);
      return Response.json({
        success: true,
        applicationId: savedApplicationId,
        message: `Your application for "${position}" has been safely recorded in our system.`,
      });
    }
  } catch (error: any) {
    console.error('Error handling /api/careers:', error);
    const errorMessage =
      error?.code === 'EAUTH'
        ? 'SMTP authentication failed. Please verify your SMTP credentials.'
        : error?.message || 'Failed to submit application. Please try again or reach out to info@deysla.com directly.';

    return Response.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
