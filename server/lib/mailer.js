const sgMail = require('@sendgrid/mail');

// Set SendGrid API key from environment variable
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@yourdomain.com';
const TO_EMAIL = process.env.SENDGRID_TO_EMAIL || 'kawishiqbal898@gmail.com';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
} else {
  console.warn('⚠️ SENDGRID_API_KEY not set. Email notifications will be disabled.');
}

async function sendNotificationEmail({ subject, text, html, to }) {
  if (!SENDGRID_API_KEY) {
    console.log('Email not sent (SendGrid not configured):', { subject, to: to || TO_EMAIL });
    return { skipped: true };
  }

  const msg = {
    to: to || TO_EMAIL,
    from: FROM_EMAIL,
    subject,
    text,
    html
  };

  try {
    await sgMail.send(msg);
    console.log('✅ Email sent successfully:', subject);
    return { success: true };
  } catch (error) {
    console.error('❌ SendGrid error:', error.response ? error.response.body : error.message);
    throw error;
  }
}

module.exports = { sendNotificationEmail };
