const nodemailer = require('nodemailer');
const { Resend } = require('resend');
const https = require('https');
const generateNewsletterHtml = require('./templates/newsletter.template');

class EmailService {
  constructor() {
    this.transporter = null; // Used for Gmail fallback only
    this.resend = null; // Used if RESEND_API_KEY is available
    this.useResend = false;
    this.useGmail = false;
    this.useBrevo = false; // Now means Brevo HTTP API
    this.init();
  }

  async init() {
    try {
      // 1. Initialize Resend if available
      if (process.env.RESEND_API_KEY) {
        this.resend = new Resend(process.env.RESEND_API_KEY);
        this.useResend = true;
        console.log('✅ Email Service initialized (Resend mode - up to 100/day)');
      }

      // 2. Initialize Brevo HTTP API (works on all hosting providers including Render)
      if (process.env.BREVO_API_KEY) {
        this.useBrevo = true;
        console.log('✅ Email Service initialized (Brevo API mode - up to 300/day)');
      } else if (process.env.BREVO_USER && process.env.BREVO_SMTP_KEY) {
        // Fallback to SMTP if only SMTP credentials are available (local dev only)
        this.transporter = nodemailer.createTransport({
          host: 'smtp-relay.brevo.com',
          port: 587,
          secure: false,
          connectionTimeout: 5000,
          greetingTimeout: 5000,
          auth: {
            user: process.env.BREVO_USER,
            pass: process.env.BREVO_SMTP_KEY
          }
        });
        this.useBrevo = false; // SMTP mode, tracked by transporter
        console.log('✅ Email Service initialized (Brevo SMTP mode - local dev)');
      } else if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
          }
        });
        this.useGmail = true;
        console.log('✅ Email Service initialized (Gmail SMTP mode)');
      }

      // 3. Fallback to Ethereal if nothing is configured
      if (!this.useResend && !this.useBrevo && !this.transporter) {
        let testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          connectionTimeout: 5000,
          greetingTimeout: 5000,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        console.log('✅ Email Service initialized (Ethereal test mode)');
        console.log('   Add RESEND_API_KEY or BREVO_API_KEY to .env to send real emails!');
      }
    } catch (error) {
      console.error('❌ Failed to initialize Email Service:', error);
    }
  }

  /**
   * Send email via Brevo HTTP API (works on Render - no SMTP port needed)
   */
  async sendViaBrevoAPI({ to, subject, html, fromName, fromEmail }) {
    const senderEmail = fromEmail || process.env.BREVO_SENDER_EMAIL || process.env.ADMIN_EMAIL;
    const senderName = fromName || 'CS Insights';

    const payload = JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: Array.isArray(to) ? to.map(email => ({ email })) : [{ email: to }],
      subject: subject,
      htmlContent: html,
    });

    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.brevo.com',
        path: '/v3/smtp/email',
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json',
          'content-length': Buffer.byteLength(payload),
        },
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(JSON.parse(data));
          } else {
            reject(new Error(`Brevo API error ${res.statusCode}: ${data}`));
          }
        });
      });

      req.on('error', reject);
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Brevo API request timed out'));
      });

      req.write(payload);
      req.end();
    });
  }

  /**
   * Send a newsletter campaign to a list of subscribers
   */
  async sendNewsletter(campaign, subscribers) {
    if (!this.useResend && !this.useBrevo && !this.transporter) {
      console.log('⏳ Email Service not yet ready. Retrying...');
      await new Promise(r => setTimeout(r, 2000));
    }

    if (!subscribers || subscribers.length === 0) {
      console.log('No subscribers to send to.');
      return null;
    }

    const htmlContent = generateNewsletterHtml(campaign);
    const subject = campaign.subject || campaign.title;

    try {
      let remainingSubscribers = [...subscribers];

      // 1. Prefer Brevo HTTP API for all subscribers (no Resend free-tier restrictions)
      if (this.useBrevo && remainingSubscribers.length > 0) {
        // Send in batches of 50 to stay within Brevo limits
        const BATCH_SIZE = 50;
        for (let i = 0; i < remainingSubscribers.length; i += BATCH_SIZE) {
          const batch = remainingSubscribers.slice(i, i + BATCH_SIZE);
          const emails = batch.map(s => s.email);
          await this.sendViaBrevoAPI({
            to: emails,
            subject,
            html: htmlContent,
            fromEmail: process.env.BREVO_SENDER_EMAIL || process.env.ADMIN_EMAIL,
          });
          console.log(`✅ SENT batch ${Math.floor(i/BATCH_SIZE)+1} (${batch.length} emails) VIA BREVO API!`);
        }
        remainingSubscribers = [];
      }

      // 2. Use Resend for remaining subscribers (overflow or if Brevo not configured)
      if (this.useResend && remainingSubscribers.length > 0) {
        const resendBatch = remainingSubscribers.splice(0, 100);
        const emails = resendBatch.map(s => s.email);
        
        const data = await this.resend.emails.send({
          from: process.env.FROM_EMAIL || 'CS Insights <onboarding@resend.dev>',
          to: emails[0] || process.env.ADMIN_EMAIL,
          bcc: emails.length > 1 ? emails.slice(1) : undefined,
          subject: subject,
          html: htmlContent,
        });

        console.log(`✅ SENT ${resendBatch.length} EMAILS VIA RESEND! ID: ${data.id}`);
      }

      // 3. Fallback to SMTP transporter (Gmail or Brevo SMTP)
      if (remainingSubscribers.length > 0 && this.transporter) {
        const emails = remainingSubscribers.map(s => s.email).join(', ');
        let fromEmail = `"CS Insights" <${process.env.GMAIL_USER || 'newsletter@csinsights.com'}>`;
        
        let info = await this.transporter.sendMail({
          from: fromEmail,
          to: fromEmail,
          bcc: emails,
          subject,
          html: htmlContent,
        });

        console.log(`✅ SENT via SMTP! Message ID: ${info.messageId}`);
        
        if (!this.useGmail) {
          const previewUrl = nodemailer.getTestMessageUrl(info);
          console.log('📧 PREVIEW: %s', previewUrl);
          return previewUrl;
        }
      }

      return null;
    } catch (error) {
      console.error('Error sending newsletter:', error);
      throw error;
    }
  }

  async sendPasswordResetEmail(email, resetUrl) {
    const subject = 'Password Reset Request - CS Insights';
    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #6366f1;">Reset Your Password</h2>
        <p>You requested a password reset. Click the button below to choose a new password.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
      </div>
    `;

    try {
      if (this.useResend) {
        const data = await this.resend.emails.send({
          from: process.env.FROM_EMAIL || 'CS Insights <support@resend.dev>',
          to: email,
          subject,
          html: htmlContent,
        });
        console.log(`Password reset email sent to ${email} via Resend`);
        return data;
      }

      if (this.useBrevo) {
        const data = await this.sendViaBrevoAPI({
          to: email,
          subject,
          html: htmlContent,
          fromEmail: process.env.BREVO_SENDER_EMAIL || process.env.ADMIN_EMAIL,
        });
        console.log(`Password reset email sent to ${email} via Brevo API`);
        return data;
      }

      if (this.transporter) {
        let fromEmail = `"CS Insights" <${process.env.GMAIL_USER || 'support@csinsights.com'}>`;
        let info = await this.transporter.sendMail({ from: fromEmail, to: email, subject, html: htmlContent });
        console.log(`Password reset email sent to ${email} via SMTP`);
        return info;
      }
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  async testEmailConnections(targetEmail) {
    const results = { resend: { configured: false, status: 'N/A' }, brevo: { configured: false, status: 'N/A' } };
    
    // Test Resend
    if (this.useResend && this.resend) {
      results.resend.configured = true;
      try {
        await this.resend.emails.send({
          from: process.env.FROM_EMAIL || 'CS Insights <onboarding@resend.dev>',
          to: targetEmail,
          subject: 'Test Email - CS Insights (Resend)',
          html: '<p>✅ This test email confirms Resend is configured correctly in CS Insights.</p>',
        });
        results.resend.status = 'SUCCESS';
      } catch (e) {
        results.resend.status = 'FAILED: ' + e.message;
      }
    }

    // Test Brevo HTTP API
    if (this.useBrevo) {
      results.brevo.configured = true;
      try {
        await this.sendViaBrevoAPI({
          to: targetEmail,
          subject: 'Test Email - CS Insights (Brevo)',
          html: '<p>✅ This test email confirms Brevo API is configured correctly in CS Insights.</p>',
          fromEmail: process.env.BREVO_SENDER_EMAIL || process.env.ADMIN_EMAIL,
        });
        results.brevo.status = 'SUCCESS';
      } catch (e) {
        results.brevo.status = 'FAILED: ' + e.message;
      }
    } else if (this.transporter) {
      // SMTP fallback test
      results.brevo.configured = true;
      try {
        let fromEmail = `"CS Insights Test" <${process.env.GMAIL_USER || 'support@csinsights.com'}>`;
        await this.transporter.sendMail({
          from: fromEmail,
          to: targetEmail,
          subject: 'Test Email - Brevo/Nodemailer',
          html: '<p>This is a test email from SMTP configuration.</p>',
        });
        results.brevo.status = 'SUCCESS';
      } catch (e) {
        results.brevo.status = 'FAILED: ' + e.message;
      }
    }

    return results;
  }
}

module.exports = new EmailService();
