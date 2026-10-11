import {
  escapeHtml,
  isValidEmail,
  checkRateLimit,
  buildContactEmail,
  buildQuoteEmail,
  buildCareersEmail,
  isSmtpConfigured,
  getSmtpConfig,
} from '../src/server/mail/mailer';
import { POST as contactHandler } from '../app/api/contact/route';
import { POST as quoteHandler } from '../app/api/quote/route';
import { POST as careersHandler } from '../app/api/careers/route';
import { GET as verifySmtpHandler } from '../app/api/verify-smtp/route';

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

  // Test 4: Email Template Rendering
  console.log('\n--- Test Group 3: Email Templates ---');
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
  assert(careersEmail.html.includes('Rashid_Khan_CV.pdf'), 'Careers email contains resume attachment indicator');

  // Test 5: Next.js App Router Route Validation Testing
  console.log('\n--- Test Group 4: App Router Route Handlers ---');

  // 5a: Missing fields validation
  const invalidContactReq = new Request('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.0.1' },
    body: JSON.stringify({ name: '' }),
  });
  const contactRes = await contactHandler(invalidContactReq);
  const contactData = await contactRes.json();
  assert(contactRes.status === 400 && contactData.success === false, 'Contact route rejects empty fields with 400');

  // 5b: Honeypot rejection
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

  // 5c: Quote missing fields validation
  const invalidQuoteReq = new Request('http://localhost:3000/api/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.0.3' },
    body: JSON.stringify({ name: 'Test' }),
  });
  const quoteRes = await quoteHandler(invalidQuoteReq);
  const quoteData = await quoteRes.json();
  assert(quoteRes.status === 400 && quoteData.success === false, 'Quote route rejects incomplete payload with 400');

  // 5d: Verify-SMTP route test
  const verifyReq = new Request('http://localhost:3000/api/verify-smtp', { method: 'GET' });
  const verifyRes = await verifySmtpHandler();
  const verifyData = await verifyRes.json();
  assert(
    typeof verifyData.status === 'string',
    `Verify-SMTP reports configuration status (${verifyData.status}) without crashing`
  );

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
