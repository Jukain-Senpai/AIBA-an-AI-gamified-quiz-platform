const prisma = require("../utils/prisma");

const createNotification = async ({
  recipientId,
  actorId = null,
  type,
  title,
  message,
  link = null,
  targetType = null,
  targetId = null,
}) => {
  if (!recipientId || !type || !title || !message) return null;

  return prisma.notification.create({
    data: {
      recipientId,
      actorId,
      type,
      title,
      message,
      link,
      targetType,
      targetId,
    },
  });
};

module.exports = {
  createNotification,
};
