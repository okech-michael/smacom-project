import express from 'express';
import { prisma } from '../config/db.js';
import authMiddleware from '../middleware/auth.js';
import { hashPassword, verifyPassword, generateOtp, createToken, createResetToken, verifyResetToken, formatUser } from '../utils/helpers.js';
import { sendEmail } from '../utils/email.js';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { ALL_ROLES, isPublicRegistrationRole, isValidRole } from '../config/roles.js';
import roleGuard from '../middleware/roleGuard.js';

const router = express.Router();
const googleClient = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET)
  : null;
const jwtSecret = process.env.JWT_SECRET || 'supersecret';

router.use('/me', authMiddleware);

router.post('/admin/invite', authMiddleware, roleGuard('admin'), async (req, res) => {
  const { email, role } = req.body;
  if (!email || !isValidRole(role)) {
    return res.status(400).json({ error: `Email and a valid role are required (${ALL_ROLES.join(', ')})` });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ error: 'Email is already registered' });
  }

  const user = await prisma.user.create({
    data: {
      full_name: '',
      email,
      password_hash: await hashPassword(Math.random().toString(36)),
      role,
      is_verified: false,
    },
  });
  const resetToken = createResetToken(user.id);
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${encodeURIComponent(resetToken)}`;
  await sendEmail({
    to: email,
    subject: 'Your SMACom invitation',
    text: `You have been invited to SMACom. Set your password here: ${resetUrl}`,
  });
  return res.status(201).json({ message: 'Invitation sent' });
});

const buildAuthResponse = (user) => ({
  access_token: createToken({ id: user.id, email: user.email, role: user.role }),
  user: formatUser(user),
});

router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Email, password, and role are required' });
  }
  if (!isPublicRegistrationRole(role)) {
    return res.status(400).json({ error: 'Invalid registration role' });
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
      data: { otp_code: otpCode, otp_expires: otpExpires, role },
    });
  } else {
    const password_hash = await hashPassword(password);
    user = await prisma.user.create({
      data: {
        full_name: '',
        email,
        password_hash,
        role,
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

const getOAuthContext = (req, value) => {
  const isLocal = req.hostname === 'localhost' || req.hostname === '127.0.0.1';
  const clientOrigin = isLocal ? 'http://localhost:5173' : new URL(process.env.CLIENT_URL).origin;
  const callbackOrigin = isLocal ? 'http://localhost:4000' : new URL(process.env.CLIENT_URL).origin;
  const fallback = `${clientOrigin}/`;
  try {
    const candidate = new URL(value || fallback, clientOrigin);
    return {
      redirectUrl: candidate.origin === clientOrigin ? candidate.toString() : fallback,
      callbackUri: `${callbackOrigin}/api/auth/login/google/callback`,
    };
  } catch {
    return { redirectUrl: fallback, callbackUri: `${callbackOrigin}/api/auth/login/google/callback` };
  }
};

const createOAuthState = (payload) => jwt.sign(payload, jwtSecret, { expiresIn: '10m' });
const verifyOAuthState = (state) => jwt.verify(state, jwtSecret);

router.get('/login/:provider', (req, res) => {
  try {
    const { provider } = req.params;
    const { redirectUrl, callbackUri } = getOAuthContext(req, req.query.redirect_url);
    if (provider !== 'google') {
      return res.redirect(`${redirectUrl}?auth_error=provider_not_supported`);
    }
    if (!googleClient) {
      return res.redirect(`${redirectUrl}?auth_error=google_not_configured`);
    }

    const requestedRole = req.query.role;
    const state = createOAuthState({
      redirectUrl,
      callbackUri,
      role: isPublicRegistrationRole(requestedRole) ? requestedRole : null,
    });
    const authorizationUrl = googleClient.generateAuthUrl({
      access_type: 'online',
      redirect_uri: callbackUri,
      scope: ['openid', 'email', 'profile'],
      state,
      prompt: 'select_account',
    });
    res.status(302).set('Location', authorizationUrl).end();
  } catch (error) {
    console.error('Google OAuth start failed:', error?.message || error);
    return res.status(500).json({ error: 'Google OAuth is not configured correctly' });
  }
});

router.get('/login/google/callback', async (req, res) => {
  const defaultContext = getOAuthContext(req, '/');
  let redirectUrl = defaultContext.redirectUrl;
  let callbackUri = defaultContext.callbackUri;
  try {
    const state = verifyOAuthState(String(req.query.state || ''));
    const stateContext = getOAuthContext(req, state.redirectUrl);
    redirectUrl = stateContext.redirectUrl;
    callbackUri = state.callbackUri === stateContext.callbackUri ? state.callbackUri : stateContext.callbackUri;
    state.role = isPublicRegistrationRole(state.role) ? state.role : null;
    req.oauthState = state;
  } catch {
    return res.redirect(`${redirectUrl}?auth_error=google_state_invalid`);
  }

  if (req.query.error) {
    return res.redirect(`${redirectUrl}?auth_error=${encodeURIComponent(req.query.error)}`);
  }
  if (!googleClient || !req.query.code) {
    return res.redirect(`${redirectUrl}?auth_error=google_callback_invalid`);
  }

  try {
    const { tokens } = await googleClient.getToken({ code: String(req.query.code), redirect_uri: callbackUri });
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const profile = ticket.getPayload();
    if (!profile?.email || !profile.email_verified) {
      return res.redirect(`${redirectUrl}?auth_error=google_email_unverified`);
    }

    let user = await prisma.user.findUnique({ where: { email: profile.email } });
    if (!user) {
      const role = req.oauthState?.role;
      if (!role) {
        return res.redirect(`${redirectUrl}?auth_error=registration_role_required`);
      }
      user = await prisma.user.create({
        data: {
          full_name: profile.name || profile.email.split('@')[0],
          email: profile.email,
          password_hash: await hashPassword(Math.random().toString(36)),
          role,
          is_verified: true,
        },
      });
    }

    const token = createToken({ id: user.id, email: user.email, role: user.role });
    const dashboardUrl = new URL('/dashboard', redirectUrl);
    dashboardUrl.searchParams.set('access_token', token);
    return res.redirect(dashboardUrl.toString());
  } catch (error) {
    console.error('Google OAuth callback failed:', error?.message || error);
    return res.redirect(`${redirectUrl}?auth_error=google_auth_failed`);
  }
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

  const allowedFields = new Set(['full_name', 'password']);
  const data = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowedFields.has(key)));
  if (Object.prototype.hasOwnProperty.call(data, 'role') && data.role !== req.user.role) {
    return res.status(403).json({ error: 'Role changes require administrator approval' });
  }
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
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${encodeURIComponent(token)}`;
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
    const user = await prisma.user.update({ where: { id: userId }, data: { password_hash, is_verified: true } });
    return res.json({ message: 'Password reset successfully' });
  } catch (error) {
    return res.status(400).json({ error: 'Invalid or expired reset token' });
  }
});

export default router;
