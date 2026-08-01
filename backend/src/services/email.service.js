const nodemailer = require('nodemailer');
const { Resend } = require('resend');
const generateNewsletterHtml = require('./templates/newsletter.template');

class EmailService {
  constructor() {
    this.transporter = null; // Used for Gmail or Ethereal
    this.resend = null; // Used if RESEND_API_KEY is available
    this.useResend = false;
    this.useGmail = false;
    this.useBrevo = false;
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

      // 2. Initialize Nodemailer (Brevo or Gmail)
      if (process.env.BREVO_USER && process.env.BREVO_SMTP_KEY) {
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
        this.useBrevo = true;
        console.log('✅ Email Service initialized (Brevo SMTP mode - up to 300/day)');
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
      if (!this.useResend && !this.transporter) {
        // Create a test account on Ethereal (Fake SMTP service)
        let testAccount = await nodemailer.createTestAccount();

        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false, // true for 465, false for other ports
          connectionTimeout: 5000,
          greetingTimeout: 5000,
          auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
          },
        });
        
        console.log('✅ Email Service initialized (Ethereal test mode)');
        console.log('   Add RESEND_API_KEY to .env to send real emails via Resend!');
      }
    } catch (error) {
      console.error('❌ Failed to initialize Email Service:', error);
    }
  }

  /**
   * Send a newsletter campaign to a list of subscribers
   */
  async sendNewsletter(campaign, subscribers) {
    if (!this.useResend && !this.transporter) {
      console.log('⏳ Email Service not yet ready. Retrying...');
      await new Promise(r => setTimeout(r, 2000));
    }

    if (!subscribers || subscribers.length === 0) {
      console.log('No subscribers to send to.');
      return null;
    }

    // Generate the gorgeous HTML matching the design
    const htmlContent = generateNewsletterHtml(campaign);
    const subject = campaign.subject || campaign.title;

    try {
      let remainingSubscribers = [...subscribers];

      // 1. Send up to 100 via Resend if available
      if (this.useResend && remainingSubscribers.length > 0) {
        const resendBatch = remainingSubscribers.splice(0, 100);
        const emails = resendBatch.map(s => s.email);
        
        const data = await this.resend.emails.send({
          from: process.env.FROM_EMAIL || 'CS Insights <newsletter@resend.dev>',
          to: emails[0] || process.env.ADMIN_EMAIL,
          bcc: emails.length > 1 ? emails.slice(1) : undefined,
          subject: subject,
          html: htmlContent,
        });

        console.log('----------------------------------------------------');
        console.log(`🚀 SENT ${resendBatch.length} EMAILS VIA RESEND!`);
        console.log('Message ID: %s', data.id);
      }

      // 2. Send remaining via Brevo/Gmail if available and there are still subscribers left
      if (remainingSubscribers.length > 0) {
        if (this.transporter) {
          // If we have more than 300 left, Brevo might reject it, but we'll try to send the batch
          const emails = remainingSubscribers.map(s => s.email).join(', ');
          
          let fromEmail = '"CS Insights 💻" <newsletter@csinsights.com>';
          if (this.useBrevo) fromEmail = `"CS Insights" <${process.env.BREVO_SENDER_EMAIL || process.env.ADMIN_EMAIL}>`;
          else if (this.useGmail) fromEmail = `"CS Insights" <${process.env.GMAIL_USER}>`;
          
          let toEmail = 'subscribers@csinsights.com';
          if (this.useBrevo) toEmail = process.env.BREVO_SENDER_EMAIL || process.env.ADMIN_EMAIL;
          else if (this.useGmail) toEmail = process.env.GMAIL_USER;
          
          let info = await this.transporter.sendMail({
            from: fromEmail,
            to: toEmail,
            bcc: emails,
            subject: subject,
            html: htmlContent,
          });

          console.log(`🚀 SENT ${remainingSubscribers.length} EMAILS VIA ${this.useBrevo ? 'BREVO' : (this.useGmail ? 'GMAIL' : 'ETHEREAL')}!`);
          console.log('Message ID: %s', info.messageId);
          console.log('----------------------------------------------------');
          
          if (!this.useBrevo && !this.useGmail) {
             const previewUrl = nodemailer.getTestMessageUrl(info);
             console.log('👀 VIEW EMAIL PREVIEW: %s', previewUrl);
             return previewUrl;
          }
        } else {
          console.log(`⚠️ WARNING: ${remainingSubscribers.length} subscribers were skipped because no secondary email provider (Brevo/Gmail) is configured to handle the overflow from Resend!`);
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error sending newsletter:', error);
      throw error;
    }
  }

  async sendPasswordResetEmail(email, resetUrl) {
    if (!this.useResend && !this.transporter) {
      console.log('Email Service not yet ready. Retrying...');
      await new Promise(r => setTimeout(r, 2000));
    }

    const subject = 'Password Reset Request - CS Insights';
    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset Your Password</h2>
        <p>You requested a password reset. Click the button below to choose a new password.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
        <p>This link will expire in 1 hour.</p>
      </div>
    `;

    try {
      if (this.useResend) {
        const data = await this.resend.emails.send({
          from: process.env.FROM_EMAIL || 'CS Insights <support@resend.dev>',
          to: email,
          subject: subject,
          html: htmlContent,
        });
        console.log(`Password reset email sent to ${email} via Resend`);
        return data;
      }

      if (this.transporter) {
        let fromEmail = '"CS Insights" <support@csinsights.com>';
        if (this.useBrevo) fromEmail = `"CS Insights" <${process.env.BREVO_SENDER_EMAIL || process.env.ADMIN_EMAIL}>`;
        else if (this.useGmail) fromEmail = `"CS Insights" <${process.env.GMAIL_USER}>`;

        let info = await this.transporter.sendMail({
          from: fromEmail,
          to: email,
          subject: subject,
          html: htmlContent,
        });

        console.log(`Password reset email sent to ${email} via Nodemailer`);
        
        if (!this.useBrevo && !this.useGmail) {
          const previewUrl = nodemailer.getTestMessageUrl(info);
          console.log('VIEW EMAIL PREVIEW: %s', previewUrl);
          return previewUrl;
        }
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
          subject: 'Test Email - Resend',
          html: '<p>This is a test email sent from your Resend configuration in CS Insights.</p>',
        });
        results.resend.status = 'SUCCESS';
      } catch (e) {
        results.resend.status = 'FAILED: ' + e.message;
      }
    }

    // Test Nodemailer (Brevo)
    if (this.transporter) {
      results.brevo.configured = true;
      try {
        let fromEmail = '"CS Insights Test" <support@csinsights.com>';
        if (this.useBrevo) fromEmail = `"CS Insights Test" <${process.env.BREVO_SENDER_EMAIL || process.env.ADMIN_EMAIL}>`;
        
        await this.transporter.sendMail({
          from: fromEmail,
          to: targetEmail,
          subject: 'Test Email - Brevo/Nodemailer',
          html: '<p>This is a test email sent from your Brevo/SMTP configuration in CS Insights.</p>',
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
