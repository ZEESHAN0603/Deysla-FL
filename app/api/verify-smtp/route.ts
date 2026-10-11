import {
  getSmtpConfig,
  isSmtpConfigured,
  createTransporter,
} from '../../../src/server/mail/mailer.ts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = getSmtpConfig();
    const configured = isSmtpConfigured();

    if (!configured) {
      return Response.json({
        success: false,
        status: 'unconfigured',
        message:
          'SMTP is not yet configured. Please configure SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS in environment variables (.env.local or production server env).',
        config: {
          host: config.host || '(not set)',
          port: config.port,
          secure: config.secure,
          user: config.user ? `${config.user.slice(0, 3)}***@${config.user.split('@')[1] || 'domain'}` : '(not set)',
          from: config.from,
          contactEmail: config.contactEmail,
        },
      });
    }

    // Attempt verification with SMTP server
    const transporter = createTransporter();
    await transporter.verify();

    return Response.json({
      success: true,
      status: 'verified',
      message: 'SMTP server connection and authentication successfully verified!',
      config: {
        host: config.host,
        port: config.port,
        secure: config.secure,
        user: `${config.user.slice(0, 3)}***@${config.user.split('@')[1] || 'domain'}`,
        from: config.from,
        contactEmail: config.contactEmail,
      },
    });
  } catch (error: any) {
    const config = getSmtpConfig();
    return Response.json(
      {
        success: false,
        status: 'connection_failed',
        message: `SMTP verification failed: ${error?.message || 'Connection or authentication failed'}`,
        code: error?.code,
        config: {
          host: config.host,
          port: config.port,
          secure: config.secure,
          user: config.user ? `${config.user.slice(0, 3)}***` : '(not set)',
          from: config.from,
          contactEmail: config.contactEmail,
        },
      },
      { status: 500 }
    );
  }
}
