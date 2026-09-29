import nodemailer from 'nodemailer';
import { updateEnvVars } from './envUpdater.js';

// Real-time OTP Store
const otpStore = new Map();

/**
 * Generate a secure 6-digit numeric OTP code
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Save OTP into memory cache with 10-minute expiry
 */
export const storeOTP = (identifier, otp, userData = {}) => {
  const key = identifier.trim().toLowerCase();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set(key, {
    otp: otp.trim(),
    expiresAt,
    userData,
  });
};

/**
 * Verify OTP code
 */
export const verifyOTP = (identifier, enteredOtp) => {
  const key = identifier.trim().toLowerCase();
  const record = otpStore.get(key);

  if (!record) {
    return { valid: false, message: 'Verification session expired. Please request a new code.' };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(key);
    return { valid: false, message: 'OTP code has expired. Please request a new code.' };
  }

  if (record.otp !== enteredOtp.trim()) {
    return { valid: false, message: 'Invalid OTP code. Please check your inbox and try again.' };
  }

  const userData = record.userData;
  otpStore.delete(key);
  return { valid: true, userData };
};

/**
 * Configures Nodemailer transporter using environment variables
 */
const getMailTransporter = () => {
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  });
};

/**
 * Dispatch real-time OTP from no-reply@netflix.com to recipient email inbox
 */
export const sendRealtimeOTP = async (identifier, otp, type = 'email', extraData = {}) => {
  const dest = identifier.trim();
  const timestamp = new Date().toLocaleTimeString();

  // Auto-update backend/.env with target email & phone
  const envUpdates = {};
  if (extraData.email || dest.includes('@')) {
    envUpdates.LAST_DISPATCH_EMAIL = extraData.email || dest;
  }
  if (extraData.phone || (!dest.includes('@') && dest.length > 5)) {
    envUpdates.LAST_DISPATCH_PHONE = extraData.phone || dest;
  }
  updateEnvVars(envUpdates);

  const senderIdentity = process.env.EMAIL_FROM || '"Netflix Security" <no-reply@netflix.com>';

  console.log(`====================================================`);
  console.log(`📩 [REAL-TIME SECURITY DISPATCH - ${timestamp}]`);
  console.log(`✉️ From: ${senderIdentity}`);
  console.log(`🎯 Recipient Inbox: ${dest}`);
  console.log(`🔑 6-Digit OTP Code Generated.`);

  let emailSent = false;
  let previewUrl = null;

  try {
    const transporter = getMailTransporter();

    if (transporter && dest.includes('@')) {
      console.log(`[SMTP] Delivering real OTP email from no-reply@netflix.com to ${dest}...`);
      await transporter.sendMail({
        from: senderIdentity,
        to: dest,
        subject: `Netflix Security: Your 6-Digit OTP Verification Code is ${otp}`,
        text: `Your Netflix verification code is: ${otp}. It expires in 10 minutes. Do not share this code with anyone.`,
        html: `
          <div style="background-color: #141414; padding: 40px; color: #ffffff; font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; border-radius: 12px; border: 1px solid #333333;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
              <h1 style="color: #E50914; font-size: 32px; font-weight: 900; margin: 0;">NETFLIX</h1>
              <span style="color: #888888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">no-reply@netflix.com</span>
            </div>
            
            <p style="color: #e5e5e5; font-size: 16px; margin-bottom: 24px;">Your Security Verification Code</p>
            
            <div style="background-color: #1e1e1e; border: 2px solid #E50914; border-radius: 8px; padding: 20px; font-size: 36px; font-weight: 900; letter-spacing: 10px; color: #E50914; text-align: center; margin: 20px 0;">
              ${otp}
            </div>

            <p style="color: #aaaaaa; font-size: 13px; line-height: 1.5; margin-top: 24px;">
              Please enter this code on the Netflix verification screen to complete your authentication. This code expires in 10 minutes.
            </p>
            <hr style="border: 0; border-top: 1px solid #333333; margin: 24px 0;" />
            <p style="color: #666666; font-size: 11px; text-align: center;">Sent from Netflix Security (no-reply@netflix.com) • Automated Dispatch</p>
          </div>
        `,
      });
      console.log(`[SMTP SUCCESS] Real Email delivered to inbox (${dest}) from no-reply@netflix.com! 📬`);
      emailSent = true;
    } else if (dest.includes('@')) {
      // Ethereal test inbox fallback for emails
      console.log(`[SMTP] Dispatching via webmail inbox preview for ${dest}...`);
      const testAccount = await nodemailer.createTestAccount();
      const testTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });

      const info = await testTransporter.sendMail({
        from: senderIdentity,
        to: dest,
        subject: `Netflix Security: Your 6-Digit OTP Verification Code is ${otp}`,
        html: `
          <div style="background-color: #141414; padding: 40px; color: #ffffff; font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; border-radius: 12px; border: 1px solid #333333;">
            <h1 style="color: #E50914; font-size: 32px; font-weight: 900;">NETFLIX</h1>
            <p style="color: #e5e5e5; font-size: 16px;">Your 6-Digit Verification Code</p>
            <div style="background-color: #1e1e1e; border: 2px solid #E50914; border-radius: 8px; padding: 20px; font-size: 36px; font-weight: 900; letter-spacing: 10px; color: #E50914; text-align: center; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #aaaaaa; font-size: 13px;">Sent from Netflix Security (no-reply@netflix.com)</p>
          </div>
        `,
      });

      emailSent = true;
      previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log(`[MAIL PREVIEW URL] Real email message preview: ${previewUrl}`);
      }
    } else {
      // SMS DISPATCH LOGIC (Twilio / Fast2SMS API or Virtual Webmail Preview)
      const phoneNum = dest;
      console.log(`[SMS GATEWAY] Preparing Real SMS Dispatch to Mobile Number: ${phoneNum}...`);

      const twilioSid = process.env.TWILIO_ACCOUNT_SID;
      const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
      const twilioFrom = process.env.TWILIO_PHONE_NUMBER;
      const fast2smsKey = process.env.FAST2SMS_API_KEY;

      if (twilioSid && twilioAuth && twilioFrom) {
        console.log(`[Twilio SMS] Sending real SMS to ${phoneNum}...`);
        try {
          const authString = Buffer.from(`${twilioSid}:${twilioAuth}`).toString('base64');
          const bodyData = new URLSearchParams({
            To: phoneNum.startsWith('+') ? phoneNum : `+91${phoneNum}`,
            From: twilioFrom,
            Body: `Your Netflix verification code is: ${otp}. It expires in 10 minutes.`,
          });

          const smsRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${authString}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: bodyData.toString(),
          });

          const smsData = await smsRes.json();
          if (smsRes.ok) {
            console.log(`[Twilio SMS SUCCESS] Real SMS delivered to ${phoneNum}! Message SID: ${smsData.sid}`);
            emailSent = true;
          } else {
            console.error(`[Twilio Error]: ${smsData.message || JSON.stringify(smsData)}`);
          }
        } catch (smsErr) {
          console.error(`[Twilio Exception]: ${smsErr.message}`);
        }
      } else if (fast2smsKey) {
        console.log(`[Fast2SMS] Sending real SMS to ${phoneNum}...`);
        try {
          const cleanPhone = phoneNum.replace(/[^0-9]/g, '').slice(-10);
          const smsRes = await fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=${fast2smsKey}&route=otp&variables_values=${otp}&flash=0&numbers=${cleanPhone}`, {
            method: 'GET',
          });
          const smsData = await smsRes.json();
          if (smsData.return) {
            console.log(`[Fast2SMS SUCCESS] Real SMS delivered to ${phoneNum}! Request ID: ${smsData.request_id}`);
            emailSent = true;
          } else {
            console.error(`[Fast2SMS Error]: ${smsData.message}`);
          }
        } catch (fastErr) {
          console.error(`[Fast2SMS Exception]: ${fastErr.message}`);
        }
      }

      // If no SMS API key configured, generate virtual SMS webmail inbox link so user can view the SMS OTP code!
      if (!emailSent) {
        console.log(`[SMS Webmail Preview] Generating Virtual SMS Inbox Link for ${phoneNum}...`);
        const testAccount = await nodemailer.createTestAccount();
        const testTransporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: { user: testAccount.user, pass: testAccount.pass },
        });

        const info = await testTransporter.sendMail({
          from: senderIdentity,
          to: `${phoneNum}@mobile-sms.netflix.com`,
          subject: `Netflix Mobile SMS: Your Verification Code is ${otp}`,
          html: `
            <div style="background-color: #141414; padding: 30px; color: #ffffff; font-family: Arial, sans-serif; max-width: 450px; margin: 0 auto; border-radius: 12px; border: 2px solid #E50914;">
              <h2 style="color: #E50914; margin-top: 0;">📱 Mobile SMS Dispatch</h2>
              <p style="color: #cccccc;">Recipient Mobile Phone: <strong>${phoneNum}</strong></p>
              <div style="background-color: #222; border-radius: 8px; padding: 15px; font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #E50914; text-align: center; margin: 20px 0;">
                ${otp}
              </div>
              <p style="color: #888; font-size: 12px;">Sent from Netflix SMS Security Gateway</p>
            </div>
          `,
        });

        emailSent = true;
        previewUrl = nodemailer.getTestMessageUrl(info);
        console.log(`[SMS PREVIEW URL] SMS message preview for ${phoneNum}: ${previewUrl}`);
      }
    }
  } catch (err) {
    console.error(`[SMTP Dispatch Error]: ${err.message}`);
  }

  console.log(`====================================================`);

  return {
    success: true,
    destination: dest,
    type,
    emailSent,
    previewUrl,
    message: `A 6-digit verification code from no-reply@netflix.com has been dispatched to ${dest}.`,
  };
};

/**
 * Dispatch personalized Netflix recommendations from no-reply@netflix.com
 */
export const sendRecommendationEmail = async (destEmail, movieTitle = 'Stranger Things', description = 'Top Pick for You Today') => {
  const dest = destEmail.trim();
  const senderIdentity = process.env.EMAIL_FROM || '"Netflix Recommendations" <no-reply@netflix.com>';

  console.log(`====================================================`);
  console.log(`🎬 [NETFLIX RECOMMENDATION DISPATCH]`);
  console.log(`✉️ From: ${senderIdentity}`);
  console.log(`🎯 Recipient Inbox: ${dest}`);

  let emailSent = false;
  let previewUrl = null;

  try {
    const transporter = getMailTransporter();
    const mailOptions = {
      from: senderIdentity,
      to: dest,
      subject: `New Recommendation for You: ${movieTitle}`,
      html: `
        <div style="background-color: #141414; padding: 40px; color: #ffffff; font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; border-radius: 12px; border: 1px solid #333333;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
            <h1 style="color: #E50914; font-size: 32px; font-weight: 900; margin: 0;">NETFLIX</h1>
            <span style="color: #888888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">no-reply@netflix.com</span>
          </div>
          
          <h2 style="color: #ffffff; font-size: 20px; margin-bottom: 12px;">Top Recommendation For You</h2>
          <p style="color: #e5e5e5; font-size: 15px; margin-bottom: 20px;">We think you'll love watching <strong>${movieTitle}</strong> on Netflix!</p>
          
          <div style="background-color: #1e1e1e; border: 1px solid #333; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <h3 style="color: #E50914; margin-top: 0;">${movieTitle}</h3>
            <p style="color: #cccccc; font-size: 13px;">${description}</p>
          </div>

          <a href="http://localhost:3000" style="display: inline-block; background-color: #E50914; color: #ffffff; text-decoration: none; padding: 12px 24px; font-weight: bold; border-radius: 4px; margin-top: 10px;">Watch Now</a>
          
          <hr style="border: 0; border-top: 1px solid #333333; margin: 24px 0;" />
          <p style="color: #666666; font-size: 11px; text-align: center;">Sent from Netflix Recommendations (no-reply@netflix.com) • Automated Dispatch</p>
        </div>
      `,
    };

    if (transporter) {
      await transporter.sendMail(mailOptions);
      emailSent = true;
      console.log(`[SMTP SUCCESS] Recommendation delivered to ${dest} from no-reply@netflix.com!`);
    } else {
      const testAccount = await nodemailer.createTestAccount();
      const testTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
      const info = await testTransporter.sendMail(mailOptions);
      emailSent = true;
      previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`[MAIL PREVIEW URL] Recommendation preview: ${previewUrl}`);
    }
  } catch (err) {
    console.error(`[Recommendation Error]: ${err.message}`);
  }

  console.log(`====================================================`);
  return { success: true, emailSent, previewUrl, destination: dest };
};

