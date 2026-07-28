const prisma = require("../utils/prisma");
const bcrypt = require("bcryptjs");
const { buildCaseInsensitiveEmailFilter, normalizeEmail } = require("../utils/email");
const { sendPasswordResetCode: sendResetEmail } = require("./email.service");

const RESET_CODE_EXPIRY_MINUTES = 15;

const generateResetCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const registerUser = async ({ email, password, username, avatar }) => {
  if (!email || !password || !username) {
    throw new Error("Missing required fields");
  }

  // Check if email already exists
  const existingEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existingEmail) {
    throw new Error("Email already registered");
  }

  // Check if username already exists
  const existingUsername = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUsername) {
    throw new Error("Username already taken");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      avatar: avatar || "NeonKnight_M.jpg",
    },
  });

  return user;
};

const loginUser = async ({ email, password }) => {
  // 'email' parameter can now be either an email or a username
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: email },
        { username: email }
      ]
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid password");
  }

  if (user.status === 'SUSPENDED') {
    throw new Error("Account suspended");
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() }
  });

  return user;
};

const requestPasswordReset = async ({ email }) => {
  if (!email || !email.trim()) {
    throw new Error("Email is required");
  }

  const normalizedEmail = normalizeEmail(email);
  const user = await prisma.user.findFirst({
    where: buildCaseInsensitiveEmailFilter(normalizedEmail),
  });

  if (!user) {
    return { message: "If an account exists for that email, a reset code has been sent." };
  }

  const code = generateResetCode();
  const expiry = new Date(Date.now() + RESET_CODE_EXPIRY_MINUTES * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetCode: code,
      resetCodeExpiry: expiry,
    },
  });

  await sendResetEmail({ to: user.email, code });

  return { message: "If an account exists for that email, a reset code has been sent." };
};

const verifyPasswordResetCode = async ({ email, code }) => {
  if (!email || !code) {
    throw new Error("Email and verification code are required");
  }

  const normalizedEmail = normalizeEmail(email);
  const user = await prisma.user.findFirst({
    where: buildCaseInsensitiveEmailFilter(normalizedEmail),
  });

  if (!user || !user.resetCode || !user.resetCodeExpiry) {
    throw new Error("Invalid or expired verification code");
  }

  if (user.resetCode.toUpperCase() !== code.trim().toUpperCase()) {
    throw new Error("Invalid or expired verification code");
  }

  if (user.resetCodeExpiry < new Date()) {
    throw new Error("Invalid or expired verification code");
  }

  return { message: "Verification code accepted", email: user.email };
};

const resetPassword = async ({ email, code, password }) => {
  if (!email || !code || !password) {
    throw new Error("Email, verification code, and new password are required");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const normalizedEmail = normalizeEmail(email);
  const user = await prisma.user.findFirst({
    where: buildCaseInsensitiveEmailFilter(normalizedEmail),
  });

  if (!user || !user.resetCode || !user.resetCodeExpiry) {
    throw new Error("Invalid or expired verification code");
  }

  if (user.resetCode.toUpperCase() !== code.trim().toUpperCase()) {
    throw new Error("Invalid or expired verification code");
  }

  if (user.resetCodeExpiry < new Date()) {
    throw new Error("Invalid or expired verification code");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetCode: null,
      resetCodeExpiry: null,
    },
  });

  return { message: "Password reset successfully" };
};

module.exports = {
  registerUser,
  loginUser,
  requestPasswordReset,
  verifyPasswordResetCode,
  resetPassword,
};
