import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const sendgridApiKey = process.env.SENDGRID_API_KEY;
const smtpHost = process.env.EMAIL_HOST;
const smtpPort = process.env.EMAIL_PORT;
const smtpUser = process.env.EMAIL_USER;
const smtpPassword = process.env.EMAIL_PASSWORD;

const createSendGridTransport = (apiKey) => {
  if (!apiKey) return null;
  try {
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey',
        pass: apiKey,
      },
    });
  } catch (error) {
    console.error('SendGrid transport initialization failed:', error?.message || error);
    return null;
  }
};

const createSmtpTransport = () => {
  if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) return null;
  try {
    return nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: Number(smtpPort) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });
  } catch (error) {
    console.error('SMTP transport initialization failed:', error?.message || error);
    return null;
  }
};

const getEmailTransporter = () => {
  if (sendgridApiKey) {
    const transport = createSendGridTransport(sendgridApiKey);
    if (transport) return transport;
  }

  const smtpTransport = createSmtpTransport();
  if (smtpTransport) return smtpTransport;

  return null;
};

export const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = getEmailTransporter();
  if (!transporter) {
    console.warn('Email transporter not configured. Skipping email:', { to, subject });
    return false;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'no-reply@smacom.local',
      to,
      subject,
      text,
      html,
    });
    return true;
  } catch (error) {
    console.error('Email send failed:', error?.message || error);
    return false;
  }
};
