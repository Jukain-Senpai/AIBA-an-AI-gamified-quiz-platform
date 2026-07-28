const normalizeRole = (role) => {
    if (typeof role !== "string") return "";
    return role.trim().toLowerCase();
};

const isAdminRole = (role) => normalizeRole(role) === "admin";

const isModRole = (role) => normalizeRole(role) === "mod";

const isStaffRole = (role) => {
    const r = normalizeRole(role);
    return r === "admin" || r === "mod";
};

const isSameUser = (userId, ownerId) => {
    if (userId === undefined || userId === null || ownerId === undefined || ownerId === null) {
        return false;
    }

    return Number(userId) === Number(ownerId);
};

const normalizeModerationStatus = (status) => {
    if (typeof status !== "string") return "approved";
    return status.trim().toLowerCase();
};

const isApprovedModerationStatus = (status) => {
    return normalizeModerationStatus(status) === "approved";
};

const canManageContent = (user, ownerId) => {
    return isSameUser(user?.id, ownerId) || isAdminRole(user?.role);
};

const canAccessQuiz = (user, quiz) => {
    if (!quiz) return false;
    if (canManageContent(user, quiz.creatorId)) return true;
    if (quiz.isPublished && isApprovedModerationStatus(quiz.moderationStatus)) return true;
    return false;
};

const canAccessPost = (user, post) => {
    if (!post) return false;
    if (canManageContent(user, post.authorId)) return true;
    return isApprovedModerationStatus(post.moderationStatus);
};

const canAccessComment = (user, comment) => {
    if (!comment) return false;
    if (canManageContent(user, comment.authorId)) return true;
    return isApprovedModerationStatus(comment.moderationStatus);
};

module.exports = {
    normalizeRole,
    isAdminRole,
    isModRole,
    isStaffRole,
    isSameUser,
    normalizeModerationStatus,
    isApprovedModerationStatus,
    canManageContent,
    canAccessQuiz,
    canAccessPost,
    canAccessComment,
};
