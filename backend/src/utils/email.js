import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import nodemailerSendgrid from 'nodemailer-sendgrid-transport';

dotenv.config();

const sendgridApiKey = process.env.SENDGRID_API_KEY;
const smtpHost = process.env.EMAIL_HOST;
const smtpPort = process.env.EMAIL_PORT;
const smtpUser = process.env.EMAIL_USER;
const smtpPassword = process.env.EMAIL_PASSWORD;

const transporter = sendgridApiKey
  ? nodemailer.createTransport(
      nodemailerSendgrid({ auth: { api_key: sendgridApiKey } })
    )
  : smtpHost && smtpPort && smtpUser && smtpPassword
  ? nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: Number(smtpPort) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    })
  : null;

export const sendEmail = async ({ to, subject, text, html }) => {
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
