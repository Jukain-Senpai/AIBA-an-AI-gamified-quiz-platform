const path = require("path");
const nodemailer = require("nodemailer");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const isPlaceholderValue = (value) => /your-gmail|example\.com|your-16-character|placeholder/i.test(value || "");
const isGoogleMailbox = (value = "") => /@(gmail\.com|googlemail\.com)$/i.test(value.trim());

const validateSmtpConfig = (config) => {
  if (!config) {
    return;
  }

  const host = (config.host || "").toLowerCase();
  if (host.includes("gmail") || host.includes("googlemail")) {
    if (!isGoogleMailbox(config.user) || !isGoogleMailbox(config.from)) {
      throw new Error("Gmail SMTP requires SMTP_USER and SMTP_FROM to be the same real Gmail/Google mailbox.");
    }

    if (config.user.toLowerCase() !== config.from.toLowerCase()) {
      throw new Error("Gmail SMTP requires SMTP_USER and SMTP_FROM to be the same address.");
    }
  }
};

const getSmtpConfig = () => {
  const user = (process.env.SMTP_USER || "").trim();
  const pass = (process.env.SMTP_PASS || "").replace(/\s/g, "");
  const host = (process.env.SMTP_HOST || "smtp.gmail.com").trim();
  const defaultPort = host === "smtp.gmail.com" ? 465 : 587;
  const defaultSecure = host === "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || defaultPort);
  const secureValue = process.env.SMTP_SECURE;
  const secure = secureValue === undefined ? defaultSecure : secureValue === "true";
  const from = (process.env.SMTP_FROM || user || "").trim();

  if (!user || !pass || isPlaceholderValue(user) || isPlaceholderValue(pass)) {
    return null;
  }

  const config = { user, pass, host, port, secure, from };
  validateSmtpConfig(config);

  return config;
};

const createTransporter = () => {
  const config = getSmtpConfig();
  if (!config) {
    return null;
  }

  if (config.host) {
    return nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
};

const logEmailMode = async () => {
  const config = getSmtpConfig();

  if (!config) {
    console.warn(
      "[Email] SMTP is not configured. Password reset codes will be printed to this console only."
    );
    console.warn(
      "[Email] Add valid SMTP_USER and SMTP_PASS to backend/.env, or configure SMTP_HOST/SMTP_PORT/SMTP_SECURE."
    );
    return;
  }

  const transporter = createTransporter();
  if (!transporter) {
    console.warn("[Email] SMTP transporter could not be created.");
    return;
  }

  if (!isGoogleMailbox(config.user) || !isGoogleMailbox(config.from)) {
    console.warn("[Email] Gmail delivery requires SMTP_USER and SMTP_FROM to be the same real Gmail/Google account that owns the app password.");
    console.warn("[Email] Current values do not look like a Gmail sender. Update backend/.env before relying on email delivery.");
  }

  try {
    await transporter.verify();
    console.log(`[Email] SMTP enabled. Reset emails will be sent from ${config.user}`);
  } catch (error) {
    console.error("[Email] SMTP verification failed:", error.message);
    console.warn("[Email] Check your SMTP credentials or app password in backend/.env.");
  }
};

const sendPasswordResetCode = async ({ to, code }) => {
  const config = getSmtpConfig();
  const transporter = createTransporter();

  if (!transporter || !config) {
    console.log(`[DEV] Password reset code for ${to}: ${code}`);
    return;
  }

  try {
    await transporter.verify();
    const info = await transporter.sendMail({
      from: config.from ? config.from : `"AIBA" <${config.user}>`,
      to,
      subject: "Your AIBA Password Reset Code",
      text: `Your password reset code is: ${code}\n\nThis code expires in 15 minutes. If you did not request this, you can ignore this email.`,
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #4231cf; margin-bottom: 8px;">Password Reset</h2>
          <p style="color: #464555; line-height: 1.6;">Use the code below to reset your AIBA account password:</p>
          <p style="font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #1a1a2e; margin: 24px 0;">${code}</p>
          <p style="color: #777586; font-size: 14px;">This code expires in 15 minutes. If you did not request this, you can safely ignore this email.</p>
        </div>
      `,
    });
    console.log(`[Email] Password reset code queued for ${to}`);
    console.log(`[Email] Message ID: ${info.messageId}`);
    console.log(`[Email] Accepted recipients: ${info.accepted.join(", ")}`);
  } catch (error) {
    console.error("[Email] Failed to send password reset email:", error.message);
    throw new Error("Failed to send verification email. Check SMTP settings and try again.");
  }
};

module.exports = {
  sendPasswordResetCode,
  logEmailMode,
};
