import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    // Check if email is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.warn('Email not configured. Skipping email send.');
      return { success: false, error: 'Email not configured' };
    }

    const info = await transporter.sendMail({
      from: `"${process.env.APP_NAME || 'Pakistan Marketplace'}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

// Email templates
export const emailTemplates = {
  welcome: (name: string) => ({
    subject: 'Welcome to Pakistan Marketplace!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #002f34; padding: 20px; text-align: center;">
          <h1 style="color: #23e5db; margin: 0;">Pakistan Marketplace</h1>
        </div>
        <div style="padding: 30px; background: #fff;">
          <h2 style="color: #002f34;">Welcome, ${name}!</h2>
          <p>Thank you for joining Pakistan Marketplace. We're excited to have you on board!</p>
          <p>With your new account, you can:</p>
          <ul>
            <li>Post ads for free</li>
            <li>Browse thousands of listings</li>
            <li>Chat with sellers directly</li>
            <li>Save your favorite ads</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/post-ad" 
               style="background: #002f34; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Post Your First Ad
            </a>
          </div>
          <p>Happy selling!</p>
          <p>The Pakistan Marketplace Team</p>
        </div>
      </div>
    `,
  }),

  adApproved: (name: string, adTitle: string, adUrl: string) => ({
    subject: 'Your ad has been approved!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #002f34; padding: 20px; text-align: center;">
          <h1 style="color: #23e5db; margin: 0;">Pakistan Marketplace</h1>
        </div>
        <div style="padding: 30px; background: #fff;">
          <h2 style="color: #002f34;">Good news, ${name}!</h2>
          <p>Your ad <strong>"${adTitle}"</strong> has been approved and is now live on Pakistan Marketplace.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${adUrl}" 
               style="background: #002f34; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">
              View Your Ad
            </a>
          </div>
          <p>Tips to get more responses:</p>
          <ul>
            <li>Share your ad on social media</li>
            <li>Feature your ad to get more visibility</li>
            <li>Respond to messages quickly</li>
          </ul>
          <p>Good luck with your sale!</p>
        </div>
      </div>
    `,
  }),

  featureRequestApproved: (name: string, adTitle: string, adUrl: string) => ({
    subject: 'Your feature request has been approved!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #002f34; padding: 20px; text-align: center;">
          <h1 style="color: #ffce32; margin: 0;">Pakistan Marketplace</h1>
        </div>
        <div style="padding: 30px; background: #fff;">
          <h2 style="color: #002f34;">Congratulations, ${name}!</h2>
          <p>Your feature request for <strong>"${adTitle}"</strong> has been approved!</p>
          <p>Your ad is now featured and will appear at the top of search results for the next 7 days.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${adUrl}" 
               style="background: #ffce32; color: #002f34; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
              View Your Featured Ad
            </a>
          </div>
          <p>Featured ads get up to 5x more views!</p>
        </div>
      </div>
    `,
  }),

  passwordReset: (name: string, resetUrl: string) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #002f34; padding: 20px; text-align: center;">
          <h1 style="color: #23e5db; margin: 0;">Pakistan Marketplace</h1>
        </div>
        <div style="padding: 30px; background: #fff;">
          <h2 style="color: #002f34;">Password Reset</h2>
          <p>Hi ${name},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: #002f34; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
        </div>
      </div>
    `,
  }),

  newMessage: (name: string, senderName: string, messagePreview: string, chatUrl: string) => ({
    subject: `New message from ${senderName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #002f34; padding: 20px; text-align: center;">
          <h1 style="color: #23e5db; margin: 0;">Pakistan Marketplace</h1>
        </div>
        <div style="padding: 30px; background: #fff;">
          <h2 style="color: #002f34;">New Message</h2>
          <p>Hi ${name},</p>
          <p>You have a new message from <strong>${senderName}</strong>:</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; color: #666;">"${messagePreview}"</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${chatUrl}" 
               style="background: #002f34; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Reply Now
            </a>
          </div>
        </div>
      </div>
    `,
  }),

  commissionReminder: (name: string, adTitle: string, commissionAmount: number, paymentUrl: string) => ({
    subject: 'Commission Payment Reminder',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #002f34; padding: 20px; text-align: center;">
          <h1 style="color: #23e5db; margin: 0;">Pakistan Marketplace</h1>
        </div>
        <div style="padding: 30px; background: #fff;">
          <h2 style="color: #002f34;">Commission Payment Reminder</h2>
          <p>Hi ${name},</p>
          <p>Congratulations on selling your item <strong>"${adTitle}"</strong>!</p>
          <p>As per our agreement, please pay the 2% commission amount:</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 4px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; color: #666;">Commission Amount</p>
            <p style="margin: 10px 0; font-size: 24px; font-weight: bold; color: #002f34;">Rs ${commissionAmount.toLocaleString()}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${paymentUrl}" 
               style="background: #002f34; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Pay Commission
            </a>
          </div>
          <p>Thank you for using Pakistan Marketplace!</p>
        </div>
      </div>
    `,
  }),
};

export async function sendWelcomeEmail(name: string, email: string) {
  const template = emailTemplates.welcome(name);
  return sendEmail({ to: email, ...template });
}

export async function sendAdApprovedEmail(name: string, email: string, adTitle: string, adId: string) {
  const adUrl = `${process.env.NEXT_PUBLIC_APP_URL}/ad/${adId}`;
  const template = emailTemplates.adApproved(name, adTitle, adUrl);
  return sendEmail({ to: email, ...template });
}

export async function sendFeatureRequestApprovedEmail(name: string, email: string, adTitle: string, adId: string) {
  const adUrl = `${process.env.NEXT_PUBLIC_APP_URL}/ad/${adId}`;
  const template = emailTemplates.featureRequestApproved(name, adTitle, adUrl);
  return sendEmail({ to: email, ...template });
}

export async function sendPasswordResetEmail(name: string, email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  const template = emailTemplates.passwordReset(name, resetUrl);
  return sendEmail({ to: email, ...template });
}

export async function sendNewMessageEmail(name: string, email: string, senderName: string, message: string) {
  const chatUrl = `${process.env.NEXT_PUBLIC_APP_URL}/chat`;
  const template = emailTemplates.newMessage(name, senderName, message.slice(0, 100), chatUrl);
  return sendEmail({ to: email, ...template });
}

export async function sendCommissionReminderEmail(name: string, email: string, adTitle: string, commissionAmount: number) {
  const paymentUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pay-commission`;
  const template = emailTemplates.commissionReminder(name, adTitle, commissionAmount, paymentUrl);
  return sendEmail({ to: email, ...template });
}
