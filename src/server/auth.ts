import crypto from 'crypto';

interface TokenPayload {
  u: string;
  exp: number;
  nonce: string;
}

function getSecret(): string {
  return process.env.ADMIN_JWT_SECRET || 'deysla-secure-admin-secret-key-2026-prod';
}

function getExpectedUsername(): string {
  return process.env.ADMIN_USERNAME || 'admin';
}

function getExpectedPassword(): string {
  return process.env.ADMIN_PASSWORD || 'deyslaAdmin2026!';
}

export function generateToken(username: string): string {
  const secret = getSecret();
  const payload: TokenPayload = {
    u: username,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    nonce: crypto.randomBytes(8).toString('hex'),
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payloadBase64)
    .digest('base64url');

  return `${payloadBase64}.${signature}`;
}

export function verifyAdminToken(token: string | null | undefined): { valid: boolean; username?: string } {
  if (!token || typeof token !== 'string') return { valid: false };

  try {
    const parts = token.split('.');
    if (parts.length !== 2) return { valid: false };

    const [payloadBase64, providedSig] = parts;
    const secret = getSecret();
    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(payloadBase64)
      .digest('base64url');

    // Constant-time comparison
    if (providedSig.length !== expectedSig.length) return { valid: false };
    const isValidSig = crypto.timingSafeEqual(
      Buffer.from(providedSig),
      Buffer.from(expectedSig)
    );

    if (!isValidSig) return { valid: false };

    const payload: TokenPayload = JSON.parse(
      Buffer.from(payloadBase64, 'base64url').toString('utf-8')
    );

    if (Date.now() > payload.exp) {
      return { valid: false };
    }

    return { valid: true, username: payload.u };
  } catch (err) {
    return { valid: false };
  }
}

export function authenticateAdminCredentials(
  user: string,
  pass: string
): { success: boolean; token?: string; error?: string } {
  const expectedUser = getExpectedUsername();
  const expectedPass = getExpectedPassword();

  const userBuffer = Buffer.from(user || '');
  const expectedUserBuffer = Buffer.from(expectedUser);

  const passBuffer = Buffer.from(pass || '');
  const expectedPassBuffer = Buffer.from(expectedPass);

  let userMatches = false;
  let passMatches = false;

  if (userBuffer.length === expectedUserBuffer.length) {
    userMatches = crypto.timingSafeEqual(userBuffer, expectedUserBuffer);
  }

  if (passBuffer.length === expectedPassBuffer.length) {
    passMatches = crypto.timingSafeEqual(passBuffer, expectedPassBuffer);
  }

  if (userMatches && passMatches) {
    const token = generateToken(expectedUser);
    return { success: true, token };
  }

  return { success: false, error: 'Invalid administrator credentials.' };
}

export function extractTokenFromRequest(request: Request): string | null {
  // Check Authorization header
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }

  // Check Cookie header
  const cookieHeader = request.headers.get('cookie') || request.headers.get('Cookie');
  if (cookieHeader) {
    const match = cookieHeader.match(/deysla_admin_token=([^;]+)/);
    if (match) return match[1].trim();
  }

  return null;
}

export function requireAdmin(request: Request): { username: string } | Response {
  const token = extractTokenFromRequest(request);
  const result = verifyAdminToken(token);

  if (!result.valid || !result.username) {
    return Response.json(
      { success: false, error: 'Unauthorized. Admin credentials or valid session token required.' },
      { status: 401 }
    );
  }

  return { username: result.username };
}
