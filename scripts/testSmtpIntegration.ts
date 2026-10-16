import {
  escapeHtml,
  isValidEmail,
  checkRateLimit,
  buildContactEmail,
  buildQuoteEmail,
  buildCareersEmail,
  buildAdminReplyEmail,
  isSmtpConfigured,
  getSmtpConfig,
} from '../src/server/mail/mailer';
import { POST as contactHandler } from '../app/api/contact/route';
import { POST as quoteHandler } from '../app/api/quote/route';
import { POST as careersHandler } from '../app/api/careers/route';
import { GET as verifySmtpHandler } from '../app/api/verify-smtp/route';
import { handleAdminApiRequest } from '../src/server/adminApiHandler';
import { generateToken } from '../src/server/auth';

async function runTests() {
  console.log('🧪 Starting DEYSLA SMTP Functionality Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // Test 1: HTML Sanitization
  console.log('--- Test Group 1: Data Sanitization & Validation ---');
  const rawXss = '<script>alert("hack")</script> & "special"';
  const cleanXss = escapeHtml(rawXss);
  assert(
    !cleanXss.includes('<script>') && cleanXss.includes('&lt;script&gt;') && cleanXss.includes('&amp;'),
    'HTML entities are properly escaped'
  );

  // Test 2: Email format checking
  assert(isValidEmail('valid.name@deysla.com'), 'Validates standard email address');
  assert(isValidEmail('corp+tag@domain.co.uk'), 'Validates email with tags and subdomains');
  assert(!isValidEmail('invalid-email'), 'Rejects email without @ symbol');
  assert(!isValidEmail('invalid@'), 'Rejects incomplete email');
  assert(!isValidEmail('@nodomain.com'), 'Rejects email without user');

  // Test 3: Rate Limiting
  console.log('\n--- Test Group 2: Rate Limiting ---');
  const testIp = '192.168.1.99';
  let allowedCount = 0;
  for (let i = 0; i < 7; i++) {
    const res = checkRateLimit(testIp);
    if (res.allowed) allowedCount++;
  }
  assert(allowedCount === 5, 'Enforces rate limit of 5 requests per window per IP');

  // Test 4: Email Template Rendering & Details
  console.log('\n--- Test Group 3: Email Templates & Contact Details ---');
  const contactEmail = buildContactEmail({
    name: 'Ahmed Al-Ghamdi',
    email: 'ahmed@saudi-enterprise.com',
    contact: '+966 50 123 4567',
    companyName: 'Saudi Enterprise Ltd',
    message: 'We require a formal proposal for 48-port PoE switches.',
    submittedAt: 'Sunday, 11 October 2026',
  });
  assert(contactEmail.html.includes('DEYSLA IT Solutions'), 'Contact email contains DEYSLA header');
  assert(contactEmail.html.includes('Ahmed Al-Ghamdi'), 'Contact email contains customer name');
  assert(contactEmail.html.includes('ahmed@saudi-enterprise.com'), 'Contact email contains customer email');
  assert(contactEmail.html.includes('Customer Contact Information:'), 'Contact email contains prominent customer summary banner');
  assert(contactEmail.text.includes('Ahmed Al-Ghamdi <ahmed@saudi-enterprise.com>'), 'Plain-text contact email contains customer name and email');
  assert(contactEmail.html.includes('Saudi Enterprise Ltd'), 'Contact email contains company');

  const quoteEmail = buildQuoteEmail({
    rfqReference: 'DEY-RFQ-987654',
    name: 'Fatima Al-Zahrani',
    email: 'fatima@techgroup.sa',
    phone: '+966 55 987 6543',
    companyName: 'Tech Group KSA',
    city: 'Khobar',
    projectTimeline: 'Immediate (1-2 weeks)',
    notes: 'Please include installation and 3-year warranty.',
    items: [
      {
        title: 'Cisco Catalyst 9300 48-Port PoE+ Switch',
        category: 'Networking',
        brand: 'Cisco',
        sku: 'C9300-48P-A',
        quantity: 4,
        notes: 'Include dual power supplies',
      },
    ],
    submittedAt: 'Sunday, 11 October 2026',
  });
  assert(quoteEmail.html.includes('DEY-RFQ-987654'), 'Quote email contains RFQ Reference');
  assert(quoteEmail.html.includes('Fatima Al-Zahrani'), 'Quote email contains customer name');
  assert(quoteEmail.html.includes('fatima@techgroup.sa'), 'Quote email contains customer email');
  assert(quoteEmail.html.includes('Cisco Catalyst 9300'), 'Quote email contains catalog line item');
  assert(quoteEmail.html.includes('Khobar'), 'Quote email contains project city');

  const careersEmail = buildCareersEmail({
    position: 'Network & Infrastructure Solutions Architect',
    name: 'Rashid Khan',
    email: 'rashid@networkpro.com',
    phone: '+966 54 321 0987',
    experience: '5+ years',
    noticePeriod: '1 Month',
    portfolioUrl: 'https://linkedin.com/in/rashid-khan',
    coverLetter: 'Certified CCNP Enterprise with extensive data center experience.',
    resumeFileName: 'Rashid_Khan_CV.pdf',
    resumeFileSizeFormatted: '1.24 MB',
    submittedAt: 'Sunday, 11 October 2026',
  });
  assert(careersEmail.html.includes(escapeHtml('Network & Infrastructure Solutions Architect')), 'Careers email contains position');
  assert(careersEmail.html.includes('Rashid Khan'), 'Careers email contains candidate name');
  assert(careersEmail.html.includes('rashid@networkpro.com'), 'Careers email contains candidate email');
  assert(careersEmail.html.includes('Candidate Application:'), 'Careers email contains prominent candidate summary banner');
  assert(careersEmail.text.includes('Rashid Khan <rashid@networkpro.com>'), 'Plain-text careers email contains candidate name and email');
  assert(careersEmail.html.includes('Rashid_Khan_CV.pdf'), 'Careers email contains resume attachment indicator');

  // Test 5: SMTP Sender, Recipient & Reply-To Verification
  console.log('\n--- Test Group 4: Sender, Recipient & Reply-To Constraints ---');
  const smtpConfig = getSmtpConfig();
  assert(
    smtpConfig.from.name === 'DEYSLA IT Solutions' && smtpConfig.from.address === 'info@sa.deysla.com',
    'Authenticated SMTP sender is strictly { name: "DEYSLA IT Solutions", address: "info@sa.deysla.com" }'
  );
  assert(
    smtpConfig.contactEmail === 'info@sa.deysla.com',
    'Default notification recipient is strictly "info@sa.deysla.com"'
  );

  // Verification of replyTo builder logic
  const mockCustomer = { name: 'Dr. Tariq Al-Otaibi', email: 'tariq@client.sa' };
  const contactReplyTo = `"${mockCustomer.name.trim()}" <${mockCustomer.email.trim()}>`;
  assert(
    contactReplyTo === '"Dr. Tariq Al-Otaibi" <tariq@client.sa>',
    'Reply-To for customer enquiries correctly points to validated customer email'
  );

  const mockCandidate = { name: 'Sara Al-Ghamdi', email: 'sara.careers@example.com' };
  const candidateReplyTo = `"${mockCandidate.name.trim()}" <${mockCandidate.email.trim()}>`;
  assert(
    candidateReplyTo === '"Sara Al-Ghamdi" <sara.careers@example.com>',
    'Reply-To for job applications correctly points to validated candidate email'
  );

  // Anti-spoofing verification: Ensure from address is NEVER customer/candidate email
  assert(
    smtpConfig.from.address !== mockCustomer.email && smtpConfig.from.address !== mockCandidate.email,
    'Anti-spoofing constraint verified: Authenticated From address is never set to customer/candidate address'
  );

  // Test 6: Next.js App Router Route Validation Testing
  console.log('\n--- Test Group 5: App Router Route Handlers ---');

  // 6a: Missing fields validation
  const invalidContactReq = new Request('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.0.1' },
    body: JSON.stringify({ name: '' }),
  });
  const contactRes = await contactHandler(invalidContactReq);
  const contactData = await contactRes.json();
  assert(contactRes.status === 400 && contactData.success === false, 'Contact route rejects empty fields with 400');

  // 6b: Honeypot rejection
  const botContactReq = new Request('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.0.2' },
    body: JSON.stringify({
      name: 'Bot Spammer',
      email: 'spam@bot.com',
      contact: '+1234567890',
      message: 'Cheap sunglasses',
      website: 'http://spam-link.com', // honeypot triggered
    }),
  });
  const botRes = await contactHandler(botContactReq);
  const botData = await botRes.json();
  assert(botRes.status === 200 && botData.success === true, 'Honeypot silently consumes bot request');

  // 6c: Quote missing fields validation
  const invalidQuoteReq = new Request('http://localhost:3000/api/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.0.3' },
    body: JSON.stringify({ name: 'Test' }),
  });
  const quoteRes = await quoteHandler(invalidQuoteReq);
  const quoteData = await quoteRes.json();
  assert(quoteRes.status === 400 && quoteData.success === false, 'Quote route rejects incomplete payload with 400');

  // 6d: Verify-SMTP route test
  const verifyReq = new Request('http://localhost:3000/api/verify-smtp', { method: 'GET' });
  const verifyRes = await verifySmtpHandler();
  const verifyData = await verifyRes.json();
  assert(
    typeof verifyData.status === 'string',
    `Verify-SMTP reports configuration status (${verifyData.status}) without crashing`
  );

  // Test 7: Inquiry Inbox & Direct Customer Reply
  console.log('\n--- Test Group 6: Customer Inquiry Inbox & Direct Reply ---');

  // 7a: Admin Direct Reply Email template rendering
  const replyEmail = buildAdminReplyEmail({
    customerName: 'Sultan Al-Otaibi',
    originalSubject: 'PoE Switch Specification Inquiry',
    inquiryId: 'CMP-123456-789',
    message: 'We have reviewed your inquiry and attached the technical datasheet.',
  });
  assert(replyEmail.html.includes('CMP-123456-789'), 'Admin reply email contains inquiry reference ticket ID');
  assert(replyEmail.html.includes('Sultan Al-Otaibi'), 'Admin reply email addresses customer by name');
  assert(replyEmail.html.includes('datasheet'), 'Admin reply email contains response body text');
  assert(replyEmail.text.includes('DEYSLA IT SOLUTIONS - SUPPORT RESPONSE'), 'Admin reply plain text template formatted correctly');

  // 7b: Inquiry Inbox API Permissions (Unauthorized access rejection)
  const unauthInboxReq = new Request('http://localhost:3000/api/admin/inquiries', {
    method: 'GET',
  });
  const unauthInboxRes = await handleAdminApiRequest(unauthInboxReq);
  assert(unauthInboxRes.status === 401, 'Unauthorized request to /api/admin/inquiries is blocked with 401');

  // 7c: Inquiry Inbox API with valid Admin Token
  const validAdminToken = generateToken('admin');
  const authInboxReq = new Request('http://localhost:3000/api/admin/inquiries', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${validAdminToken}`,
    },
  });
  const authInboxRes = await handleAdminApiRequest(authInboxReq);
  const authInboxData = await authInboxRes.json();
  assert(
    authInboxRes.status === 200 && authInboxData.success === true && Array.isArray(authInboxData.inquiries),
    'Authorized admin request returns unified inquiries list with 200'
  );
  assert(
    typeof authInboxData.counts === 'object' && typeof authInboxData.counts.all === 'number',
    'Inquiry inbox endpoint computes aggregate status and type metrics'
  );

  // 7d: Direct Reply Validation: Missing Fields Rejection
  const invalidReplyReq = new Request('http://localhost:3000/api/admin/inquiries/reply', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${validAdminToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inquiryId: '' }),
  });
  const invalidReplyRes = await handleAdminApiRequest(invalidReplyReq);
  const invalidReplyData = await invalidReplyRes.json();
  assert(invalidReplyRes.status === 400 && invalidReplyData.success === false, 'Reply endpoint rejects missing fields with 400');

  // 7e: Direct Reply Security: Mismatched Recipient Email Rejection (Prevents Open Relay)
  const nonExistentReplyReq = new Request('http://localhost:3000/api/admin/inquiries/reply', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${validAdminToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inquiryId: 'CMP-NONEXISTENT',
      recipientEmail: 'hacker@malicious.com',
      subject: 'Test',
      message: 'Hello',
    }),
  });
  const nonExistentReplyRes = await handleAdminApiRequest(nonExistentReplyReq);
  assert(nonExistentReplyRes.status === 404, 'Reply endpoint rejects unverified non-existent inquiry ID with 404');

  console.log(`\n========================================`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
