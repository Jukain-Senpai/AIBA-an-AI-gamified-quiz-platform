const prisma = require("../utils/prisma");

const getMyNotifications = async (req, res) => {
  try {
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || "20")));
    const notifications = await prisma.notification.findMany({
      where: { recipientId: req.user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        actor: { select: { id: true, username: true, avatar: true } },
      },
    });
    res.json({ items: notifications });
  } catch (error) {
    console.error("Fetch notifications error:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

const getUnreadNotificationCount = async (req, res) => {
  try {
    const count = await prisma.notification.count({
      where: { recipientId: req.user.id, isRead: false },
    });
    res.json({ count });
  } catch (error) {
    console.error("Unread count error:", error);
    res.status(500).json({ message: "Failed to fetch unread count" });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const notification = await prisma.notification.findFirst({
      where: { id, recipientId: req.user.id },
      select: { id: true },
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });

    res.json({ item: updated });
  } catch (error) {
    console.error("Mark notification read error:", error);
    res.status(500).json({ message: "Failed to update notification" });
  }
};

const markAllNotificationsRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { recipientId: req.user.id, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
    res.json({ message: "Notifications marked as read" });
  } catch (error) {
    console.error("Mark all notifications read error:", error);
    res.status(500).json({ message: "Failed to update notifications" });
  }
};

module.exports = {
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
};
