import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT ?? "587");
const smtpSecure = process.env.SMTP_SECURE === "true";
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const mailFrom = process.env.MAIL_FROM ?? smtpUser;
const ownerEmail = process.env.OWNER_EMAIL;

let cachedTransporter: nodemailer.Transporter | null = null;

export function getOwnerEmail() {
  return ownerEmail ?? "";
}

export function canSendEmail() {
  return Boolean(smtpHost && smtpUser && smtpPass && mailFrom);
}

function getTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  if (!canSendEmail()) {
    throw new Error("Missing SMTP configuration.");
  }

  cachedTransporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  return cachedTransporter;
}

type MailPayload = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export async function sendMail(payload: MailPayload) {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: mailFrom,
    to: payload.to,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  });
}
