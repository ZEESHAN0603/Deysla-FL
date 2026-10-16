# DEYSLA IT Solutions - SMTP Email Setup Guide

This guide details how to configure, test, and maintain SMTP email delivery for the DEYSLA IT Solutions website across **Contact Us**, **Quotation / RFQ Request**, and **Careers** applications.

---

## 1. Overview of SMTP Environment Variables

Create a `.env.local` (for local development) or configure production environment variables on your server with the following keys:

```env
# Outgoing SMTP Server hostname for Hostinger Mail
SMTP_HOST=smtp.hostinger.com

# SMTP Port: 465 (SSL/TLS)
SMTP_PORT=465

# Set to true for port 465 SSL/TLS
SMTP_SECURE=true

# Authenticated mailbox / username
SMTP_USER=info@sa.deysla.com

# Hostinger mailbox password
SMTP_PASS=your-hostinger-mailbox-password

# Displayed sender address in outgoing mail headers
SMTP_FROM="DEYSLA IT Solutions <info@sa.deysla.com>"

# Destination address where form submissions are routed
CONTACT_EMAIL=info@sa.deysla.com
```

> **Security Guarantee:** These environment variables are only read on the server side (`src/server/mail/mailer.ts` and App Router API handlers). They are never exposed in frontend JavaScript bundles or public meta tags.

---

## 2. Obtaining Credentials by Email Provider

### Option A: Hostinger Mail (Verified & Recommended)
1. Log in to **Hostinger hPanel** (`hpanel.hostinger.com`).
2. Navigate to **Emails** &rarr; **Email Accounts** for your domain (`deysla.com` / `sa.deysla.com`).
3. Locate the verified mailbox `info@sa.deysla.com`.
4. If you need to set or reset the password, click the menu (`⋮`) next to the mailbox and select **Change Password**.
5. Hostinger outgoing SMTP configuration:
   - **SMTP Host**: `smtp.hostinger.com`
   - **SMTP Port**: `465`
   - **Encryption**: `SSL/TLS` (`SMTP_SECURE=true`)
   - **Username**: `info@sa.deysla.com`
   - **Password**: Your Hostinger mailbox password
6. Configure in `.env.local` (or server environment):
   ```env
   SMTP_HOST=smtp.hostinger.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=info@sa.deysla.com
   SMTP_PASS=your-hostinger-mailbox-password
   SMTP_FROM="DEYSLA IT Solutions <info@sa.deysla.com>"
   CONTACT_EMAIL=info@sa.deysla.com
   ```

---

### Option B: Google Workspace / Gmail
1. Log in to your Google Workspace account.
2. Ensure **2-Step Verification** is enabled under **Google Account Security** (`myaccount.google.com/security`).
3. Search for **App passwords** in your Google Account search bar.
4. Generate a new App Password (name it `DEYSLA Web Server`).
5. Copy the 16-character generated string (e.g. `abcd efgh ijkl mnop`).
6. Set in `.env.local`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=your-account@gmail.com
   SMTP_PASS=abcdefghijklmnop
   SMTP_FROM="DEYSLA IT Solutions <your-account@gmail.com>"
   CONTACT_EMAIL=your-account@gmail.com
   ```

---

### Option C: Microsoft 365 / Outlook (Exchange Online)
1. In the Microsoft 365 Admin Center (`admin.microsoft.com`), ensure **Authenticated SMTP** is enabled for the `info@deysla.com` user under **Mail > Email apps**.
2. If MFA is enforced on the account, generate an **App Password** from the Security info page (`mysignins.microsoft.com/security-info`).
3. Set in `.env.local`:
   ```env
   SMTP_HOST=smtp.office365.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=info@deysla.com
   SMTP_PASS=YourOffice365AppPassword
   SMTP_FROM="DEYSLA IT Solutions <info@deysla.com>"
   CONTACT_EMAIL=info@deysla.com
   ```

---

### Option C: Zoho Mail (Popular for GCC Enterprises)
1. Log in to `mail.zoho.com` or `accounts.zoho.com`.
2. Go to **Security > Application-Specific Passwords**.
3. Generate a password for `DEYSLA Portal`.
4. Set in `.env.local`:
   ```env
   SMTP_HOST=smtppro.zoho.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=info@deysla.com
   SMTP_PASS=YourZohoAppPassword
   SMTP_FROM="DEYSLA IT Solutions <info@deysla.com>"
   CONTACT_EMAIL=info@deysla.com
   ```

---

### Option D: Amazon SES / Brevo / SendGrid / Mailgun
1. Verify the domain `deysla.com` and configure SPF (`v=spf1 include:... ~all`) and DKIM TXT records in your DNS.
2. Generate SMTP credentials from the provider dashboard.
3. Example for Amazon SES (Frankfurt or Bahrain region):
   ```env
   SMTP_HOST=email-smtp.me-south-1.amazonaws.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=AKIAIOSFODNN7EXAMPLE
   SMTP_PASS=BJ4g...
   SMTP_FROM="DEYSLA IT Solutions <info@deysla.com>"
   CONTACT_EMAIL=info@deysla.com
   ```

---

## 3. Server-side Endpoints & Verification

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/contact` | `POST` | Processes General Enquiries from the Contact Us page |
| `/api/quote` | `POST` | Processes RFQ Quotation requests from Cart and Drawer |
| `/api/careers` | `POST` | Processes Job Applications & CV uploads (PDF/DOC/DOCX) |
| `/api/verify-smtp` | `GET` | Tests connection and credentials with the SMTP server |

### Testing SMTP Connection Status
You can visit or curl:
```bash
curl http://localhost:3000/api/verify-smtp
```
- **If unconfigured:** Returns `{ "success": false, "status": "unconfigured", "message": "..." }`
- **If configured & verified:** Returns `{ "success": true, "status": "verified", "message": "SMTP server connection and authentication successfully verified!" }`
- **If credentials invalid:** Returns `{ "success": false, "status": "connection_failed", "code": "EAUTH", ... }`

---

## 4. Built-in Security Features
1. **Rate Limiting:** Enforces a sliding window of max 5 submissions per 10 minutes per IP.
2. **Honeypot Anti-Spam:** Hidden `website` field catches automatic web crawlers and rejects spam without disturbing human visitors.
3. **Data Sanitization:** Strict regex email validation and HTML entity escaping (`<`, `>`, `&`, `"`, `'`) prevent email injection attacks.
4. **File Validation:** Resumes must be `.pdf`, `.doc`, or `.docx` and strictly under 5 MB.
5. **Direct Reply-To:** Every email sets the customer/applicant's email as `Reply-To`, allowing one-click responses directly from your email client.
