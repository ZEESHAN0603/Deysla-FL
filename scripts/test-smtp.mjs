
import "dotenv/config";
import nodemailer from "nodemailer";

const required = [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "SMTP_FROM",
    "CONTACT_EMAIL",
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
    console.error("Missing environment variables:", missing.join(", "));
    process.exit(1);
}

const port = Number(process.env.SMTP_PORT);

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

try {
    console.log("Checking SMTP connection...");

    await transporter.verify();
    console.log("SMTP authentication successful!");

    const result = await transporter.sendMail({
        from: {
            name: "DEYSLA IT Solutions",
            address: "info@sa.deysla.com",
        },
        to: process.env.CONTACT_EMAIL || "info@sa.deysla.com",
        subject: "DEYSLA Website - SMTP Test",
        text: "SMTP is working. This is a test email from DEYSLA.",
        html: `
      <h2>DEYSLA IT Solutions</h2>
      <p>Your SMTP test email was sent successfully.</p>
    `,
    });

    console.log("Email accepted by SMTP server.");
    console.log("Message ID:", result.messageId);
    console.log("Recipient:", process.env.CONTACT_EMAIL);
} catch (error) {
    console.error("SMTP test failed.");
    console.error("Error code:", error.code || "Unknown");
    console.error("Error message:", error.message);
} finally {
    transporter.close();
}
