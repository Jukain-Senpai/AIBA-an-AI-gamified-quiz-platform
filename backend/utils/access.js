const normalizeRole = (role) => {
    if (typeof role !== "string") return "";
    return role.trim().toLowerCase();
};

const isAdminRole = (role) => normalizeRole(role) === "admin";

const isSameUser = (userId, ownerId) => {
    if (userId === undefined || userId === null || ownerId === undefined || ownerId === null) {
        return false;
    }

    return Number(userId) === Number(ownerId);
};

const canManageContent = (user, ownerId) => {
    return isSameUser(user?.id, ownerId) || isAdminRole(user?.role);
};

const canAccessQuiz = (user, quiz) => {
    if (!quiz) return false;
    if (quiz.isPublished) return true;
    return canManageContent(user, quiz.creatorId);
};

module.exports = {
    normalizeRole,
    isAdminRole,
    isSameUser,
    canManageContent,
    canAccessQuiz,
};
