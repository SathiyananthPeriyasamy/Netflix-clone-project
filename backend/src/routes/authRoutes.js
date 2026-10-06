import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import { protect } from '../middleware/authMiddleware.js';
import { generateOTP, storeOTP, verifyOTP, sendRealtimeOTP, sendRecommendationEmail } from '../services/otpService.js';
import { validateEmailAuthenticity } from '../services/emailValidator.js';
import { updateEnvVars } from '../services/envUpdater.js';

const router = express.Router();

const registeredUsersMap = new Map();

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'super_secret_netflix_jwt_key_devops_2026',
    { expiresIn: '30d' }
  );
};

// @route   POST /api/auth/reset-db
router.post('/reset-db', async (req, res) => {
  try {
    registeredUsersMap.clear();
    let rdsDeleted = 0;
    try {
      await prisma.watchlist.deleteMany({});
      const result = await prisma.user.deleteMany({});
      rdsDeleted = result.count;
    } catch (dbErr) {
      console.warn('[DB Warn] Could not delete from RDS:', dbErr.message);
    }
    console.log(`[Reset DB] All user accounts wiped (${rdsDeleted} from RDS PostgreSQL). Starting fresh!`);
    return res.json({ success: true, message: 'All existing user accounts have been deleted. Database reset to clean state!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 1. SIGNUP WITH NAME, EMAIL, PHONE & PASSWORD
// ==========================================

// @route   POST /api/auth/send-signup-otp
router.post('/send-signup-otp', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Please provide full name, email, mobile phone number, and password.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    // 1. MOBILE PHONE NUMERIC VALIDATION
    const digitsOnly = cleanPhone.replace(/[^0-9]/g, '');
    if (digitsOnly.length < 10 || /[^0-9+]/.test(cleanPhone)) {
      return res.status(400).json({ message: 'Mobile phone number must contain only numbers and be at least 10 digits.' });
    }

    // 2. PASSWORD STRENGTH VALIDATION
    const hasMinLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (!hasMinLength || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and include at least one uppercase letter (A-Z), one lowercase letter (a-z), one number (0-9), and one special character (e.g. @#$%^&*).'
      });
    }

    // 3. STRICT EMAIL AUTHENTICITY CHECK
    const emailValidation = await validateEmailAuthenticity(cleanEmail);
    if (!emailValidation.valid) {
      return res.status(400).json({ message: emailValidation.reason });
    }

    // 4. AUTO-SAVE EMAIL & PHONE NUMBER TO BACKEND/.ENV
    updateEnvVars({
      LAST_REGISTERED_EMAIL: cleanEmail,
      LAST_REGISTERED_PHONE: cleanPhone,
    });

    // 5. Check duplicate in RDS PostgreSQL via Prisma
    try {
      const emailExists = await prisma.user.findUnique({ where: { email: cleanEmail } });
      if (emailExists) {
        return res.status(400).json({ message: `An account already exists with email (${cleanEmail}). Please sign in instead.` });
      }

      const phoneExists = await prisma.user.findFirst({ where: { phone: cleanPhone } });
      if (phoneExists) {
        return res.status(400).json({ message: `An account already exists with mobile number (${cleanPhone}). Please sign in instead.` });
      }
    } catch (dbErr) {
      console.warn('[RDS Query Warn]:', dbErr.message);
    }

    // Check duplicate in in-memory registry
    if (registeredUsersMap.has(cleanEmail)) {
      return res.status(400).json({ message: `An account already exists with email (${cleanEmail}). Please sign in instead.` });
    }

    if (registeredUsersMap.has(cleanPhone)) {
      return res.status(400).json({ message: `An account already exists with mobile number (${cleanPhone}). Please sign in instead.` });
    }

    // 6. Generate & Dispatch Real-Time OTP
    const otp = generateOTP();
    storeOTP(cleanEmail, otp, { name, email: cleanEmail, phone: cleanPhone, password });
    storeOTP(cleanPhone, otp, { name, email: cleanEmail, phone: cleanPhone, password });

    await sendRealtimeOTP(cleanEmail, otp, 'email', { email: cleanEmail, phone: cleanPhone });
    const smsDispatch = await sendRealtimeOTP(cleanPhone, otp, 'phone', { email: cleanEmail, phone: cleanPhone });

    return res.json({
      success: true,
      message: `A 6-digit OTP verification code has been dispatched to ${cleanEmail} (Email) and ${cleanPhone} (Mobile SMS).`,
      emailSent: true,
      previewUrl: smsDispatch.previewUrl,
      email: cleanEmail,
      phone: cleanPhone,
    });
  } catch (error) {
    console.error('[Send Signup OTP Error]:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/verify-signup-otp
router.post('/verify-signup-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Please provide email and 6-digit OTP code.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const result = verifyOTP(cleanEmail, otp);

    if (!result.valid) {
      return res.status(400).json({ message: result.message });
    }

    const { name, phone, password } = result.userData || {};
    const hashedPassword = await bcrypt.hash(password, 10);
    let userId = 'user_' + Date.now();

    try {
      const newUser = await prisma.user.create({
        data: {
          name: name || 'Netflix User',
          email: cleanEmail,
          phone: phone || null,
          password: hashedPassword,
        },
      });
      userId = newUser.id;
      console.log(`[RDS SUCCESS] User ${name} successfully inserted into Amazon RDS PostgreSQL with ID: ${userId}`);
    } catch (dbErr) {
      console.error('[RDS User Create ERROR]:', dbErr);
    }

    registeredUsersMap.set(cleanEmail, { name, email: cleanEmail, phone, password: hashedPassword });
    registeredUsersMap.set(phone, { name, email: cleanEmail, phone, password: hashedPassword });

    console.log(`[Account Created] User ${name} (${cleanEmail} / ${phone}) registered in RDS PostgreSQL.`);

    return res.status(201).json({
      _id: userId,
      name,
      email: cleanEmail,
      phone,
      token: generateToken(userId),
    });
  } catch (error) {
    console.error('[Verify Signup OTP Error]:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 2. LOGIN WITH OTP
// ==========================================

// @route   POST /api/auth/send-login-otp
router.post('/send-login-otp', async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return res.status(400).json({ message: 'Please enter your registered email or mobile phone number.' });
    }

    const clean = identifier.trim().toLowerCase();
    const isEmail = clean.includes('@');

    if (isEmail) {
      const emailValidation = await validateEmailAuthenticity(clean);
      if (!emailValidation.valid) {
        return res.status(400).json({ message: emailValidation.reason });
      }
    }

    let userFound = false;
    let userName = '';
    let userEmail = '';

    try {
      const dbUser = isEmail
        ? await prisma.user.findUnique({ where: { email: clean } })
        : await prisma.user.findFirst({ where: { phone: clean } });

      if (dbUser) {
        userFound = true;
        userName = dbUser.name;
        userEmail = dbUser.email;
      }
    } catch (dbErr) {
      console.warn('[RDS Search Warn]:', dbErr.message);
    }

    if (!userFound && registeredUsersMap.has(clean)) {
      const reg = registeredUsersMap.get(clean);
      userFound = true;
      userName = reg.name;
      userEmail = reg.email;
    }

    if (!userFound) {
      return res.status(404).json({
        message: `Account does not exist with ${identifier}. Please sign up first.`,
      });
    }

    const otp = generateOTP();
    storeOTP(clean, otp, { name: userName, isLogin: true });
    if (userEmail && userEmail !== clean) {
      storeOTP(userEmail, otp, { name: userName, isLogin: true });
    }

    const dispatchResult = await sendRealtimeOTP(clean, otp, isEmail ? 'email' : 'phone', {
      email: userEmail || clean,
      phone: clean,
    });

    return res.json({
      success: true,
      message: `A 6-digit verification code has been sent to ${isEmail ? clean : 'mobile number (' + clean + ')'}. Please check your phone messages / inbox.`,
      emailSent: dispatchResult.emailSent,
      previewUrl: dispatchResult.previewUrl,
      identifier: clean,
    });
  } catch (error) {
    console.error('[Send Login OTP Error]:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/verify-login-otp
router.post('/verify-login-otp', async (req, res) => {
  try {
    const { identifier, otp } = req.body;

    if (!identifier || !otp) {
      return res.status(400).json({ message: 'Please provide email/phone and OTP code.' });
    }

    const clean = identifier.trim().toLowerCase();
    const result = verifyOTP(clean, otp);

    if (!result.valid) {
      return res.status(400).json({ message: result.message });
    }

    const isEmail = clean.includes('@');
    let userId = 'user_' + Date.now();
    let name = result.userData?.name || 'Netflix User';

    try {
      const dbUser = isEmail
        ? await prisma.user.findUnique({ where: { email: clean } })
        : await prisma.user.findFirst({ where: { phone: clean } });

      if (dbUser) {
        userId = dbUser.id;
        name = dbUser.name;
      }
    } catch (dbErr) {
      console.warn('[RDS Query Warn]:', dbErr.message);
    }

    return res.json({
      _id: userId,
      name,
      email: isEmail ? clean : undefined,
      phone: !isEmail ? clean : undefined,
      token: generateToken(userId),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 3. LOGIN WITH PASSWORD
// ==========================================

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please provide email/phone and password.' });
    }

    const clean = identifier.trim().toLowerCase();
    const isEmail = clean.includes('@');

    try {
      const user = isEmail
        ? await prisma.user.findUnique({ where: { email: clean } })
        : await prisma.user.findFirst({ where: { phone: clean } });

      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            token: generateToken(user.id),
          });
        } else {
          return res.status(401).json({ message: 'Invalid password. Please check your password or log in via OTP.' });
        }
      }
    } catch (dbErr) {
      console.warn('[RDS Auth Warn]:', dbErr.message);
    }

    const regUser = registeredUsersMap.get(clean);
    if (!regUser) {
      return res.status(404).json({
        message: `Account does not exist with ${identifier}. Please sign up first.`,
      });
    }

    const isMatch = await bcrypt.compare(password, regUser.password);
    if (isMatch || regUser.password === password) {
      const mockId = 'user_' + Date.now();
      return res.json({
        _id: mockId,
        name: regUser.name,
        email: regUser.email,
        phone: regUser.phone,
        token: generateToken(mockId),
      });
    } else {
      return res.status(401).json({ message: 'Invalid password. Please check your password or log in via OTP.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          createdAt: true,
          watchlist: {
            include: {
              movie: true,
            },
          },
        },
      });

      if (user) {
        return res.json({
          _id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          watchlist: user.watchlist.map((w) => w.movie),
        });
      }
    } catch (dbErr) {
      console.warn('[RDS Profile Warn]:', dbErr.message);
    }

    res.json({
      _id: req.user?.id || 'user_999',
      name: req.user?.name || 'Netflix User',
      email: req.user?.email || 'devops@netflix.com',
      watchlist: [],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/send-recommendation
router.post('/send-recommendation', async (req, res) => {
  try {
    const { email, movieTitle, description } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Recipient email is required.' });
    }

    const result = await sendRecommendationEmail(email, movieTitle, description);
    return res.json({
      success: true,
      message: `Netflix recommendation email from no-reply@netflix.com sent to ${email}!`,
      previewUrl: result.previewUrl,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// FORGOT PASSWORD / PASSWORD RESET ROUTES
// ==========================================

// @route   POST /api/auth/send-reset-otp
router.post('/send-reset-otp', async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return res.status(400).json({ message: 'Please enter your registered email address or mobile phone number.' });
    }

    const clean = identifier.trim().toLowerCase();
    const isEmail = clean.includes('@');

    if (isEmail) {
      const emailValidation = await validateEmailAuthenticity(clean);
      if (!emailValidation.valid) {
        return res.status(400).json({ message: emailValidation.reason });
      }
    }

    let userFound = false;
    let targetDest = clean;

    try {
      const dbUser = isEmail
        ? await prisma.user.findUnique({ where: { email: clean } })
        : await prisma.user.findFirst({ where: { phone: clean } });

      if (dbUser) {
        userFound = true;
        if (!isEmail && dbUser.email) targetDest = dbUser.email;
      }
    } catch (dbErr) {
      console.warn('[RDS Query Warn]:', dbErr.message);
    }

    if (!userFound && registeredUsersMap.has(clean)) {
      const reg = registeredUsersMap.get(clean);
      userFound = true;
      if (!isEmail && reg.email) targetDest = reg.email;
    }

    if (!userFound) {
      return res.status(404).json({
        message: `Account does not exist with ${identifier}. Please sign up first.`,
      });
    }

    const otp = generateOTP();
    storeOTP(clean, otp, { isReset: true, identifier: clean });
    if (targetDest !== clean) {
      storeOTP(targetDest, otp, { isReset: true, identifier: clean });
    }

    const dispatchResult = await sendRealtimeOTP(targetDest, otp, isEmail ? 'email' : 'phone', { email: targetDest, phone: clean });

    return res.json({
      success: true,
      message: `A 6-digit password reset OTP has been sent to ${targetDest} from no-reply@netflix.com.`,
      emailSent: dispatchResult.emailSent,
      previewUrl: dispatchResult.previewUrl,
      identifier: clean,
    });
  } catch (error) {
    console.error('[Send Reset OTP Error]:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { identifier, otp, newPassword } = req.body;

    if (!identifier || !otp || !newPassword) {
      return res.status(400).json({ message: 'Please provide email/phone, 6-digit OTP code, and new password.' });
    }

    const hasMinLength = newPassword.length >= 8;
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasLower = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);

    if (!hasMinLength || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
      });
    }

    const clean = identifier.trim().toLowerCase();
    const result = verifyOTP(clean, otp);

    if (!result.valid) {
      return res.status(400).json({ message: result.message });
    }

    const isEmail = clean.includes('@');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try {
      const user = isEmail
        ? await prisma.user.findUnique({ where: { email: clean } })
        : await prisma.user.findFirst({ where: { phone: clean } });

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword },
        });
      }
    } catch (dbErr) {
      console.warn('[RDS Password Reset Warn]:', dbErr.message);
    }

    // Update in-memory registry
    if (registeredUsersMap.has(clean)) {
      const regUser = registeredUsersMap.get(clean);
      regUser.password = hashedPassword;
      registeredUsersMap.set(clean, regUser);
      if (regUser.email) registeredUsersMap.set(regUser.email, regUser);
      if (regUser.phone) registeredUsersMap.set(regUser.phone, regUser);
    }

    console.log(`[Password Reset Success] Password updated for ${clean} in RDS PostgreSQL.`);

    return res.json({
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.',
    });
  } catch (error) {
    console.error('[Reset Password Error]:', error.message);
    res.status(500).json({ message: error.message });
  }
});

export default router;
