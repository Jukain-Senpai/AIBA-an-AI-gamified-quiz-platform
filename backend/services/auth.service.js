const prisma = require("../utils/prisma");
const bcrypt = require("bcryptjs");

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

  return user;
};

module.exports = {
  registerUser,
  loginUser,
};
