const prisma = require("../utils/prisma");
const { Prisma } = require("@prisma/client");
const { isAdminRole, isStaffRole } = require("../utils/access");
const { createNotification } = require("../services/notification.service");

const modelMap = {
    quiz: { model: prisma.quiz, idField: "id" },
    post: { model: prisma.post, idField: "id" },
    comment: { model: prisma.comment, idField: "id" },
    report: { model: prisma.reportIssue, idField: "id" },
};

const quizSelect = {
    id: true,
    title: true,
    description: true,
    thumbnail: true,
    category: true,
    difficulty: true,
    isPublished: true,
    moderationStatus: true,
    moderationReason: true,
    moderatedAt: true,
    createdAt: true,
    creator: { select: { id: true, username: true, email: true, role: true } },
    _count: { select: { questions: true, attempts: true } },
};

const postSelect = {
    id: true,
    title: true,
    content: true,
    image: true,
    category: true,
    upvotes: true,
    moderationStatus: true,
    moderationReason: true,
    moderatedAt: true,
    createdAt: true,
    author: { select: { id: true, username: true, email: true, role: true } },
    _count: { select: { comments: true } },
};

const commentSelect = {
    id: true,
    content: true,
    image: true,
    upvotes: true,
    moderationStatus: true,
    moderationReason: true,
    moderatedAt: true,
    createdAt: true,
    author: { select: { id: true, username: true, email: true, role: true } },
    post: { select: { id: true, title: true } },
};

const reportSelect = {
    id: true,
    subject: true,
    details: true,
    page: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    reporter: { select: { id: true, username: true, email: true, role: true } },
};

const getTargetRecipient = async (type, id, client = prisma) => {
    if (type === "quiz") {
        const quiz = await client.quiz.findUnique({
            where: { id: Number(id) },
            select: { creatorId: true },
        });
        return { recipientId: quiz?.creatorId || null, link: "/quizzes" };
    }

    if (type === "post") {
        const post = await client.post.findUnique({
            where: { id: Number(id) },
            select: { authorId: true },
        });
        return { recipientId: post?.authorId || null, link: "/forum" };
    }

    if (type === "comment") {
        const comment = await client.comment.findUnique({
            where: { id: Number(id) },
            select: { authorId: true, postId: true },
        });
        return { recipientId: comment?.authorId || null, link: comment?.postId ? `/forum/post/${comment.postId}` : "/forum" };
    }

    return { recipientId: null, link: null };
};

const getAdminContent = async (req, res) => {
    try {
        if (!isStaffRole(req.user?.role)) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { tab = "all", page = 1, limit = 20, status = "PENDING", search = "", searchUser = "", sortBy = "desc" } = req.query;
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
        const offset = (pageNum - 1) * limitNum;
        const statusUpper = String(status).toUpperCase();
        const sortDirection = sortBy === "asc" ? "asc" : "desc";

        if (tab === "stats") {
            const [quizzes, posts, comments] = await Promise.all([
                prisma.quiz.count({ where: { moderationStatus: statusUpper } }),
                prisma.post.count({ where: { moderationStatus: statusUpper } }),
                prisma.comment.count({ where: { moderationStatus: statusUpper } }),
            ]);
            const reports = await prisma.reportIssue.count({ where: { status: "OPEN" } });
            return res.json({ pendingQuizzes: quizzes, pendingPosts: posts, pendingComments: comments, reportIssues: reports });
        }

        let items = [];
        let total = 0;

        if (tab === "all") {
            const statusParam = Prisma.sql`${statusUpper}::"ModerationStatus"`;
            const searchParam = search ? `%${search}%` : null;
            const searchUserParam = searchUser ? `%${searchUser}%` : null;

            let qCond = Prisma.sql`"moderationStatus" = ${statusParam}`;
            let pCond = Prisma.sql`"moderationStatus" = ${statusParam}`;
            let cCond = Prisma.sql`"moderationStatus" = ${statusParam}`;
            let rCond = Prisma.sql`"status" = 'OPEN'`;

            if (search) {
                qCond = Prisma.sql`${qCond} AND ("title" ILIKE ${searchParam} OR "description" ILIKE ${searchParam})`;
                pCond = Prisma.sql`${pCond} AND ("title" ILIKE ${searchParam} OR "content" ILIKE ${searchParam})`;
                cCond = Prisma.sql`${cCond} AND "content" ILIKE ${searchParam}`;
                rCond = Prisma.sql`${rCond} AND ("subject" ILIKE ${searchParam} OR "details" ILIKE ${searchParam})`;
            }

            if (searchUser) {
                qCond = Prisma.sql`${qCond} AND "creatorId" IN (SELECT id FROM "User" WHERE "username" ILIKE ${searchUserParam})`;
                pCond = Prisma.sql`${pCond} AND "authorId" IN (SELECT id FROM "User" WHERE "username" ILIKE ${searchUserParam})`;
                cCond = Prisma.sql`${cCond} AND "authorId" IN (SELECT id FROM "User" WHERE "username" ILIKE ${searchUserParam})`;
                rCond = Prisma.sql`${rCond} AND "reporterId" IN (SELECT id FROM "User" WHERE "username" ILIKE ${searchUserParam})`;
            }

            const orderClause = sortDirection === "asc" ? Prisma.sql`ASC` : Prisma.sql`DESC`;

            const query = Prisma.sql`
                SELECT id, 'quiz' as type, "createdAt" FROM "Quiz" WHERE ${qCond}
                UNION ALL
                SELECT id, 'post' as type, "createdAt" FROM "Post" WHERE ${pCond}
                UNION ALL
                SELECT id, 'comment' as type, "createdAt" FROM "Comment" WHERE ${cCond}
                UNION ALL
                SELECT id, 'report' as type, "createdAt" FROM "ReportIssue" WHERE ${rCond}
                ORDER BY "createdAt" ${orderClause}
                LIMIT ${limitNum} OFFSET ${offset};
            `;

            const countQuery = Prisma.sql`
                SELECT SUM(c) as count FROM (
                    SELECT COUNT(*) as c FROM "Quiz" WHERE ${qCond}
                    UNION ALL
                    SELECT COUNT(*) as c FROM "Post" WHERE ${pCond}
                    UNION ALL
                    SELECT COUNT(*) as c FROM "Comment" WHERE ${cCond}
                    UNION ALL
                    SELECT COUNT(*) as c FROM "ReportIssue" WHERE ${rCond}
                ) as total;
            `;

            const [result, [{ count }]] = await Promise.all([
                prisma.$queryRaw(query),
                prisma.$queryRaw(countQuery),
            ]);

            total = Number(count);

            const quizIds = result.filter(r => r.type === 'quiz').map(r => r.id);
            const postIds = result.filter(r => r.type === 'post').map(r => r.id);
            const commentIds = result.filter(r => r.type === 'comment').map(r => r.id);
            const reportIds = result.filter(r => r.type === 'report').map(r => r.id);

            const [quizzes, posts, comments, reports] = await Promise.all([
                quizIds.length > 0 ? prisma.quiz.findMany({ where: { id: { in: quizIds } }, select: quizSelect }) : [],
                postIds.length > 0 ? prisma.post.findMany({ where: { id: { in: postIds } }, select: postSelect }) : [],
                commentIds.length > 0 ? prisma.comment.findMany({ where: { id: { in: commentIds } }, select: commentSelect }) : [],
                reportIds.length > 0 ? prisma.reportIssue.findMany({ where: { id: { in: reportIds } }, select: reportSelect }) : [],
            ]);

            const itemMap = {
                quiz: new Map(quizzes.map(q => [q.id, { ...q, type: 'quiz' }])),
                post: new Map(posts.map(p => [p.id, { ...p, type: 'post' }])),
                comment: new Map(comments.map(c => [c.id, { ...c, type: 'comment' }])),
                report: new Map(reports.map(r => [r.id, { ...r, type: 'report' }])),
            };

            items = result.map(r => itemMap[r.type].get(r.id)).filter(Boolean);
        } else {
            const key = tab === "quizzes" ? "quiz" : tab === "posts" ? "post" : tab === "comments" ? "comment" : "report";
            const model = modelMap[key].model;
            let where = key === "report" ? {} : { moderationStatus: statusUpper };
            
            if (search) {
                if (tab === "quizzes") {
                    where.OR = [{ title: { contains: search, mode: "insensitive" } }, { description: { contains: search, mode: "insensitive" } }];
                } else if (tab === "posts") {
                    where.OR = [{ title: { contains: search, mode: "insensitive" } }, { content: { contains: search, mode: "insensitive" } }];
                } else if (tab === "comments") {
                    where.content = { contains: search, mode: "insensitive" };
                } else if (tab === "reports") {
                    where.OR = [{ subject: { contains: search, mode: "insensitive" } }, { details: { contains: search, mode: "insensitive" } }];
                }
            }
            
            if (searchUser) {
                const userField = tab === "quizzes" ? "creator" : tab === "reports" ? "reporter" : "author";
                where[userField] = { username: { contains: searchUser, mode: "insensitive" } };
            }

            if (tab === "reports") {
                where.status = "OPEN";
            }

            const [results, count] = await Promise.all([
                model.findMany({
                    where,
                    select: tab === "quizzes" ? quizSelect : tab === "posts" ? postSelect : tab === "comments" ? commentSelect : reportSelect,
                    orderBy: { createdAt: sortDirection },
                    skip: offset,
                    take: limitNum,
                }),
                model.count({ where }),
            ]);
            
            total = count;
            items = results.map(r => ({ ...r, type: tab === "quizzes" ? "quiz" : tab === "posts" ? "post" : tab === "comments" ? "comment" : "report" }));
        }

        res.json({
            items,
            total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
        });
    } catch (error) {
        console.error("Admin content error:", error);
        res.status(500).json({ message: "Failed to fetch admin content" });
    }
};

const updateModerationStatus = async (req, res) => {
    try {
        if (!isStaffRole(req.user?.role)) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { type, id } = req.params;
        const { moderationStatus, moderationReason } = req.body;

        if (!modelMap[type]) {
            return res.status(400).json({ message: "Invalid moderation type" });
        }

        const normalizedStatus = String(moderationStatus || "").trim().toUpperCase();
        if (!["PENDING", "APPROVED", "REJECTED"].includes(normalizedStatus)) {
            return res.status(400).json({ message: "Invalid moderation status" });
        }

        const updated = await prisma.$transaction(async (tx) => {
            const item = await tx[type].update({
                where: { [modelMap[type].idField]: Number(id) },
                data: {
                    moderationStatus: normalizedStatus,
                    moderationReason: moderationReason || null,
                    moderatedAt: new Date(),
                },
            });

            await tx.moderationLog.create({
                data: {
                    adminId: req.user.id,
                    targetType: type,
                    targetId: Number(id),
                    action: normalizedStatus,
                    reason: moderationReason || null,
                }
            });

            return item;
        });

        if (normalizedStatus === "REJECTED") {
            const { recipientId, link } = await getTargetRecipient(type, id);
            if (recipientId && recipientId !== req.user.id) {
                const titleMap = {
                    quiz: "Your quiz was rejected",
                    post: "Your post was rejected",
                    comment: "Your comment was rejected",
                };
                await createNotification({
                    recipientId,
                    actorId: req.user.id,
                    type: "moderation_rejected",
                    title: titleMap[type] || "Your content was rejected",
                    message: moderationReason
                        ? `Reason: ${moderationReason}`
                        : "An admin rejected one of your submissions.",
                    link,
                    targetType: type,
                    targetId: Number(id),
                });
            }
        }

        res.json({ message: "Moderation status updated", item: updated });
    } catch (error) {
        console.error("Moderation update error:", error);
        res.status(500).json({ message: "Failed to update moderation status" });
    }
};

const bulkModerateContent = async (req, res) => {
    try {
        if (!isStaffRole(req.user?.role)) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { items, moderationStatus, moderationReason } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "No items provided" });
        }

        const normalizedStatus = String(moderationStatus || "").trim().toUpperCase();
        if (!["PENDING", "APPROVED", "REJECTED"].includes(normalizedStatus)) {
            return res.status(400).json({ message: "Invalid moderation status" });
        }

        await prisma.$transaction(async (tx) => {
            for (const item of items) {
                if (!modelMap[item.type] || !item.id) continue;

                const previous = await getTargetRecipient(item.type, item.id, tx);

                await tx[item.type].update({
                    where: { [modelMap[item.type].idField]: Number(item.id) },
                    data: {
                        moderationStatus: normalizedStatus,
                        moderationReason: moderationReason || null,
                        moderatedAt: new Date(),
                    },
                });

                await tx.moderationLog.create({
                    data: {
                        adminId: req.user.id,
                        targetType: item.type,
                        targetId: Number(item.id),
                        action: normalizedStatus,
                        reason: moderationReason || null,
                    }
                });

                if (normalizedStatus === "REJECTED") {
                    const recipientId = previous?.recipientId;
                    if (recipientId && recipientId !== req.user.id) {
                        await tx.notification.create({
                            data: {
                                recipientId,
                                actorId: req.user.id,
                                type: "moderation_rejected",
                                title:
                                    item.type === "quiz"
                                        ? "Your quiz was rejected"
                                        : item.type === "post"
                                            ? "Your post was rejected"
                                            : "Your comment was rejected",
                                message: moderationReason ? `Reason: ${moderationReason}` : "An admin rejected one of your submissions.",
                                link: previous?.link,
                                targetType: item.type,
                                targetId: Number(item.id),
                            },
                        });
                    }
                }
            }
        });

        res.json({ message: `Bulk updated ${items.length} items to ${normalizedStatus}` });
    } catch (error) {
        console.error("Bulk moderation error:", error);
        res.status(500).json({ message: "Failed to bulk update moderation status" });
    }
};

const getModerationLogs = async (req, res) => {
    try {
        if (!isStaffRole(req.user?.role)) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { page = 1, limit = 20 } = req.query;
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
        const offset = (pageNum - 1) * limitNum;

        const [logs, total] = await Promise.all([
            prisma.moderationLog.findMany({
                skip: offset,
                take: limitNum,
                orderBy: { createdAt: "desc" },
                include: {
                    admin: { select: { username: true, email: true, role: true } },
                }
            }),
            prisma.moderationLog.count(),
        ]);

        res.json({
            items: logs,
            total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
        });
    } catch (error) {
        console.error("Fetch logs error:", error);
        res.status(500).json({ message: "Failed to fetch moderation logs" });
    }
};

// --- NEW DASHBOARD & USER MANAGEMENT ---

const getDashboardOverview = async (req, res) => {
    try {
        if (!isAdminRole(req.user?.role)) return res.status(403).json({ message: "Unauthorized" });

        const [
            totalUsers,
            totalQuizzes,
            totalPosts,
            totalQuizAttempts,
            pendingModeration,
            openReports
        ] = await Promise.all([
            prisma.user.count(),
            prisma.quiz.count(),
            prisma.post.count(),
            prisma.attempt.count(),
            prisma.$queryRaw`
                SELECT SUM(c) as count FROM (
                    SELECT COUNT(*) as c FROM "Quiz" WHERE "moderationStatus" = 'PENDING'
                    UNION ALL
                    SELECT COUNT(*) as c FROM "Post" WHERE "moderationStatus" = 'PENDING'
                    UNION ALL
                    SELECT COUNT(*) as c FROM "Comment" WHERE "moderationStatus" = 'PENDING'
                ) as total
            `.then(r => Number(r[0]?.count || 0)),
            prisma.reportIssue.count({ where: { status: 'OPEN' } })
        ]);

        // Recent Activities: We'll fetch the 5 most recent across some tables
        const activities = [];

        // 1. Quizzes
        const recentQuizzes = await prisma.quiz.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: { id: true, title: true, createdAt: true, creator: { select: { username: true } } }
        });
        recentQuizzes.forEach(q => activities.push({
            id: `q_${q.id}`,
            timestamp: q.createdAt,
            text: `${q.creator?.username || 'Unknown'} created a quiz: ${q.title}`
        }));

        // 2. Reports
        const recentReports = await prisma.reportIssue.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: { id: true, subject: true, createdAt: true, reporter: { select: { username: true } } }
        });
        recentReports.forEach(r => activities.push({
            id: `r_${r.id}`,
            timestamp: r.createdAt,
            text: `${r.reporter?.username || 'Unknown'} submitted a report: ${r.subject}`
        }));

        // 3. User Registrations
        const recentUsers = await prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: { id: true, username: true, createdAt: true }
        });
        recentUsers.forEach(u => activities.push({
            id: `u_${u.id}`,
            timestamp: u.createdAt,
            text: `New user registered: ${u.username || 'Unknown'}`
        }));

        // 4. Moderation Logs
        const recentLogs = await prisma.moderationLog.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: { id: true, action: true, targetType: true, createdAt: true, admin: { select: { username: true } } }
        });
        recentLogs.forEach(l => activities.push({
            id: `l_${l.id}`,
            timestamp: l.createdAt,
            text: `${l.admin?.username || 'Admin'} ${l.action.toLowerCase()} a ${l.targetType}`
        }));

        activities.sort((a, b) => b.timestamp - a.timestamp);
        const recentActivities = activities.slice(0, 10);

        res.json({
            stats: {
                totalUsers,
                totalQuizzes,
                totalPosts,
                totalQuizAttempts,
                pendingModeration,
                openReports
            },
            recentActivities
        });
    } catch (error) {
        console.error("Overview error:", error);
        res.status(500).json({ message: "Failed to load dashboard overview" });
    }
};

const getUsersList = async (req, res) => {
    try {
        if (!isAdminRole(req.user?.role)) return res.status(403).json({ message: "Unauthorized" });

        const { page = 1, limit = 20, search = "", role = "", status = "", sortBy = "desc" } = req.query;
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
        const offset = (pageNum - 1) * limitNum;

        const where = {};
        if (search) {
            where.OR = [
                { username: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (role) {
            where.role = role.toLowerCase();
        }
        if (status) {
            where.status = status.toUpperCase();
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip: offset,
                take: limitNum,
                orderBy: { createdAt: sortBy === 'asc' ? 'asc' : 'desc' },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    role: true,
                    level: true,
                    xp: true,
                    createdAt: true,
                    status: true,
                    lastLogin: true
                }
            }),
            prisma.user.count({ where })
        ]);

        // Calculate useful statistics
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const [totalUsers, newUsersThisWeek, activeUsersToday, adminCount, modCount, bannedUsers] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { createdAt: { gte: oneWeekAgo } } }),
            prisma.user.count({ where: { lastLogin: { gte: startOfDay } } }),
            prisma.user.count({ where: { role: 'admin' } }),
            prisma.user.count({ where: { role: 'mod' } }),
            prisma.user.count({ where: { status: 'SUSPENDED' } })
        ]);

        res.json({
            items: users,
            total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
            stats: {
                totalUsers,
                newUsersThisWeek,
                activeUsersToday,
                adminCount,
                modCount,
                bannedUsers
            }
        });
    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

const updateUserStatus = async (req, res) => {
    try {
        if (!isAdminRole(req.user?.role)) return res.status(403).json({ message: "Unauthorized" });

        const { id } = req.params;
        const { role, status } = req.body;

        const data = {};
        if (role) {
            const normalizedRole = role.toLowerCase();
            if (!["user", "admin", "mod"].includes(normalizedRole)) {
                return res.status(400).json({ message: "Invalid role" });
            }
            data.role = normalizedRole;
        }
        if (status) data.status = status.toUpperCase();

        const user = await prisma.user.update({
            where: { id: Number(id) },
            data,
            select: { id: true, username: true, role: true, status: true }
        });

        res.json({ message: "User updated successfully", user });
    } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({ message: "Failed to update user" });
    }
};

const deleteUser = async (req, res) => {
    try {
        if (!isAdminRole(req.user?.role)) return res.status(403).json({ message: "Unauthorized" });

        const { id } = req.params;

        // Ensure not deleting self
        if (Number(id) === req.user.id) {
            return res.status(400).json({ message: "Cannot delete your own account" });
        }

        await prisma.user.delete({
            where: { id: Number(id) }
        });

        res.json({ message: "User permanently deleted" });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ message: "Failed to delete user" });
    }
};

const resetUserPasswordAdmin = async (req, res) => {
    try {
        if (!isAdminRole(req.user?.role)) return res.status(403).json({ message: "Unauthorized" });

        const { id } = req.params;
        
        // Generate random 10-char password
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
        let tempPassword = "";
        for (let i = 0; i < 10; i++) {
            tempPassword += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const bcrypt = require("bcryptjs");
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        await prisma.user.update({
            where: { id: Number(id) },
            data: { password: hashedPassword }
        });

        res.json({ 
            message: "Password reset successfully", 
            temporaryPassword: tempPassword 
        });
    } catch (error) {
        console.error("Admin reset password error:", error);
        res.status(500).json({ message: "Failed to reset password" });
    }
};

module.exports = {
    getAdminContent,
    updateModerationStatus,
    bulkModerateContent,
    getModerationLogs,
    getDashboardOverview,
    getUsersList,
    updateUserStatus,
    deleteUser,
    resetUserPasswordAdmin,
};
