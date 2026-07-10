const prisma = require("../utils/prisma");

const createReportIssue = async (req, res) => {
    try {
        const { subject, details, page } = req.body;

        if (!subject || !details) {
            return res.status(400).json({ message: "Subject and details are required" });
        }

        if (!prisma.reportIssue) {
            return res.status(500).json({ message: "Report system is not ready yet. Please restart the backend after Prisma generation." });
        }

        const report = await prisma.reportIssue.create({
            data: {
                subject: subject.trim(),
                details: details.trim(),
                page: page || null,
                reporterId: req.user.id,
            },
            include: {
                reporter: {
                    select: { id: true, username: true, email: true },
                },
            },
        });

        res.status(201).json(report);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to submit report" });
    }
};

const deleteReportIssue = async (req, res) => {
    try {
        if (!prisma.reportIssue) {
            return res.status(500).json({ message: "Report system is not ready yet. Please restart the backend after Prisma generation." });
        }

        const report = await prisma.reportIssue.findUnique({
            where: { id: Number(req.params.id) },
        });

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        await prisma.reportIssue.delete({
            where: { id: report.id },
        });

        res.json({ message: "Report deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete report" });
    }
};

module.exports = {
    createReportIssue,
    deleteReportIssue,
};
