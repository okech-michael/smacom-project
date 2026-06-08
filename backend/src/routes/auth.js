import express from 'express';
import { prisma } from '../config/db.js';
import authMiddleware from '../middleware/auth.js';
import { hashPassword, verifyPassword, generateOtp, createToken, createResetToken, verifyResetToken, formatUser } from '../utils/helpers.js';
import { sendEmail } from '../utils/email.js';

const router = express.Router();

router.use('/me', authMiddleware);

const buildAuthResponse = (user) => ({
  access_token: createToken({ id: user.id, email: user.email, role: user.role }),
  user: formatUser(user),
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  const otpCode = generateOtp();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  let user = existingUser;

  if (existingUser) {
    if (existingUser.is_verified) {
      return res.status(400).json({ error: 'Email is already registered' });
    }
    user = await prisma.user.update({
      where: { email },
      data: { otp_code: otpCode, otp_expires: otpExpires },
    });
  } else {
    const password_hash = await hashPassword(password);
    user = await prisma.user.create({
      data: {
        full_name: '',
        email,
        password_hash,
        otp_code: otpCode,
        otp_expires: otpExpires,
      },
    });
  }

  await sendEmail({
    to: email,
    subject: 'Your SMACom verification code',
    text: `Your verification code is ${otpCode}. It expires in 10 minutes.`,
  });

  return res.json({ message: 'Verification code sent to email.' });
});

router.post('/verify-otp', async (req, res) => {
  const { email, otp_code } = req.body;
  if (!email || !otp_code) {
    return res.status(400).json({ error: 'Email and OTP code are required' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.otp_code !== otp_code) {
    return res.status(400).json({ error: 'Invalid verification code' });
  }

  if (user.otp_expires && user.otp_expires < new Date()) {
    return res.status(400).json({ error: 'OTP code expired' });
  }

  const updatedUser = await prisma.user.update({
    where: { email },
    data: { is_verified: true, otp_code: null, otp_expires: null },
  });

  return res.json(buildAuthResponse(updatedUser));
});

router.post('/resend-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const otpCode = generateOtp();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  await prisma.user.update({ where: { email }, data: { otp_code: otpCode, otp_expires: otpExpires } });

  await sendEmail({
    to: email,
    subject: 'Your SMACom verification code',
    text: `Your verification code is ${otpCode}. It expires in 10 minutes.`,
  });

  return res.json({ message: 'Verification code resent' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const validPassword = await verifyPassword(password, user.password_hash);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (!user.is_verified) {
    return res.status(403).json({ error: 'Email not verified' });
  }

  return res.json(buildAuthResponse(user));
});

router.get('/login/:provider', async (req, res) => {
  const { provider } = req.params;
  const redirectUrl = req.query.redirect_url || process.env.CLIENT_URL || 'http://localhost:5173';
  if (provider !== 'google') {
    return res.redirect(`${redirectUrl}?auth_error=provider_not_supported`);
  }

  const email = 'google-user@smacom.local';
  const defaultName = 'Google User';
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        full_name: defaultName,
        email,
        password_hash: await hashPassword(Math.random().toString(36)),
        is_verified: true,
      },
    });
  }

  const token = createToken({ id: user.id, email: user.email, role: user.role });
  return res.redirect(`${redirectUrl}?access_token=${encodeURIComponent(token)}`);
});

router.get('/me', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json(formatUser(user));
});

router.put('/me', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const data = { ...req.body };
  if (data.password) {
    data.password_hash = await hashPassword(data.password);
    delete data.password;
  }
  delete data.email;

  const updated = await prisma.user.update({
    where: { id: req.user.id },
    data,
  });

  return res.json(formatUser(updated));
});

router.post('/reset-password-request', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const token = createResetToken(user.id);
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${encodeURIComponent(token)}`;
    await sendEmail({
      to: email,
      subject: 'Reset your SMACom password',
      text: `Click the link to reset your password: ${resetUrl}`,
    });
  }

  return res.json({ message: 'If an account exists with that email, a reset link has been sent.' });
});

router.post('/reset-password', async (req, res) => {
  const { reset_token, new_password } = req.body;
  if (!reset_token || !new_password) {
    return res.status(400).json({ error: 'Token and new password are required' });
  }

  try {
    const userId = verifyResetToken(reset_token);
    const password_hash = await hashPassword(new_password);
    const user = await prisma.user.update({ where: { id: userId }, data: { password_hash } });
    return res.json({ message: 'Password reset successfully' });
  } catch (error) {
    return res.status(400).json({ error: 'Invalid or expired reset token' });
  }
});

export default router;
