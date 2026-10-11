import 'dotenv/config';
import { POST } from '../app/api/contact/route';

async function testContactDispatch() {
  console.log('Testing Contact form submission with customer complaint...');
  const req = new Request('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '203.0.113.1' },
    body: JSON.stringify({
      name: 'Customer Test User',
      email: 'regularuse426@gmail.com',
      contact: '+966501234567',
      companyName: 'Customer Corp',
      message: 'Hi, there is a bug on your website. Please fix it.',
    }),
  });

  const res = await POST(req);
  const data = await res.json();
  console.log('HTTP Status Code:', res.status);
  console.log('Response Payload:', data);

  if (res.status === 200 && data.success) {
    console.log('SUCCESS: Email dispatched through SMTP!');
    console.log('Message ID:', data.messageId);
  } else {
    console.error('FAILED:', data);
    process.exit(1);
  }
}

testContactDispatch().catch((err) => {
  console.error('Fatal error in test:', err);
  process.exit(1);
});
