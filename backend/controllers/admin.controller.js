const prisma = require("../utils/prisma");
const { Prisma } = require("@prisma/client");
const { isAdminRole } = require("../utils/access");
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
    creator: { select: { id: true, username: true, email: true } },
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
    author: { select: { id: true, username: true, email: true } },
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
    author: { select: { id: true, username: true, email: true } },
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
    reporter: { select: { id: true, username: true, email: true } },
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
        if (!isAdminRole(req.user?.role)) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { tab = "all", page = 1, limit = 20, status = "PENDING", search = "", sortBy = "desc" } = req.query;
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
            const searchParam = search ? Prisma.sql`%${search}%` : null;

            const qCond = search ? Prisma.sql`"moderationStatus" = ${statusParam} AND ("title" ILIKE ${searchParam} OR "description" ILIKE ${searchParam})` : Prisma.sql`"moderationStatus" = ${statusParam}`;
            const pCond = search ? Prisma.sql`"moderationStatus" = ${statusParam} AND ("title" ILIKE ${searchParam} OR "content" ILIKE ${searchParam})` : Prisma.sql`"moderationStatus" = ${statusParam}`;
            const cCond = search ? Prisma.sql`"moderationStatus" = ${statusParam} AND "content" ILIKE ${searchParam}` : Prisma.sql`"moderationStatus" = ${statusParam}`;
            const rCond = search ? Prisma.sql`"status" = 'OPEN' AND ("subject" ILIKE ${searchParam} OR "details" ILIKE ${searchParam})` : Prisma.sql`"status" = 'OPEN'`;

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
        if (!isAdminRole(req.user?.role)) {
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
        if (!isAdminRole(req.user?.role)) {
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
        if (!isAdminRole(req.user?.role)) {
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
                    admin: { select: { username: true, email: true } },
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

module.exports = {
    getAdminContent,
    updateModerationStatus,
    bulkModerateContent,
    getModerationLogs,
};
