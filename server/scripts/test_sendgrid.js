require('dotenv').config();
const sgMail = require('@sendgrid/mail');

console.log('Testing SendGrid Configuration...\n');

// Check environment variables
console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? '✅ Set' : '❌ Not set');
console.log('SENDGRID_FROM_EMAIL:', process.env.SENDGRID_FROM_EMAIL || '❌ Not set');
console.log('SENDGRID_TO_EMAIL:', process.env.SENDGRID_TO_EMAIL || '❌ Not set');
console.log('');

if (!process.env.SENDGRID_API_KEY) {
  console.error('❌ SENDGRID_API_KEY is not set in .env file');
  process.exit(1);
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: process.env.SENDGRID_TO_EMAIL,
  from: process.env.SENDGRID_FROM_EMAIL,
  subject: 'SendGrid Test Email - Real Estate Website',
  text: 'This is a test email from your real estate website to verify SendGrid is working correctly.',
  html: '<h2>SendGrid Test Email</h2><p>This is a test email from your real estate website.</p><p>If you received this, your SendGrid integration is working! ✅</p>',
};

console.log('Sending test email...');
console.log(`From: ${msg.from}`);
console.log(`To: ${msg.to}`);
console.log('');

sgMail
  .send(msg)
  .then(() => {
    console.log('✅ Test email sent successfully!');
    console.log('');
    console.log('Check your inbox:', process.env.SENDGRID_TO_EMAIL);
    console.log('');
    console.log('⚠️  Important Notes:');
    console.log('1. Check your spam/junk folder if you don\'t see the email');
    console.log('2. Make sure the sender email is verified in SendGrid');
    console.log('3. Free SendGrid accounts have a limit of 100 emails/day');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ SendGrid Error:');
    console.error('');
    
    if (error.response) {
      console.error('Status Code:', error.response.statusCode);
      console.error('Body:', JSON.stringify(error.response.body, null, 2));
      console.error('');
      
      const errors = error.response.body.errors;
      if (errors && errors.length > 0) {
        console.error('Error Details:');
        errors.forEach((err, index) => {
          console.error(`  ${index + 1}. ${err.message}`);
          if (err.field) console.error(`     Field: ${err.field}`);
        });
        console.error('');
        
        // Common error solutions
        if (errors.some(e => e.message.includes('verified Sender Identity'))) {
          console.error('🔧 SOLUTION:');
          console.error('   Your sender email is NOT verified in SendGrid.');
          console.error('   Steps to fix:');
          console.error('   1. Go to https://app.sendgrid.com/settings/sender_auth');
          console.error('   2. Click "Verify a Single Sender"');
          console.error('   3. Use email: ' + process.env.SENDGRID_FROM_EMAIL);
          console.error('   4. Check your email and click the verification link');
        }
        
        if (errors.some(e => e.message.includes('authorization'))) {
          console.error('🔧 SOLUTION:');
          console.error('   Your API key is invalid or has insufficient permissions.');
          console.error('   Steps to fix:');
          console.error('   1. Go to https://app.sendgrid.com/settings/api_keys');
          console.error('   2. Create a new API key with "Full Access" or "Mail Send" permission');
          console.error('   3. Update SENDGRID_API_KEY in your .env file');
        }
      }
    } else {
      console.error('Message:', error.message);
    }
    
    process.exit(1);
  });
