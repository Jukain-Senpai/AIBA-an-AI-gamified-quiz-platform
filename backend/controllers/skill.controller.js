const prisma = require("../utils/prisma");

const getAllSkills = async (req, res) => {
    try {
        const skills = await prisma.skill.findMany();
        res.json(skills);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch skills" });
    }
};

const unlockSkill = async (req, res) => {
    try {
        const userId = req.user.id;
        const skillId = Number(req.params.skillId);

        const skill = await prisma.skill.findUnique({
            where: { id:skillId }
        });

        if (!skill) {
            return res.status(404).json({ message: "Skill Not Found"});
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (user.level < skill.requiredLevel) {
            return res.status(400).json({
                message: `Requires level ${skill.requiredLevel}`
            });
        }

        if (user.skillPoints < skill.cost) {
            return res.status(400).json({
                message: `Not enough Skill Points. Requires ${skill.cost} SP.`
            });
        }

        // Enforce prerequisites
        if (skill.requiredLevel > 1) {
            const userSkills = await prisma.userSkill.findMany({
                where: { userId },
                include: { skill: true }
            });
            const hasTier1 = userSkills.some(us => us.skill.path === skill.path && us.skill.requiredLevel === 1);
            if (!hasTier1) {
                return res.status(400).json({
                    message: `You must unlock the Tier 1 skill in the ${skill.path} path first.`
                });
            }
        }

        const existing = await prisma.userSkill.findUnique({
            where: {
                userId_skillId: {
                    userId,
                    skillId
                }
            }
        });

        if (existing) {
            return res.status(400).json({
                message: "Skill already unlocked"
            });
        }

        await prisma.user.update({
            where: { id:userId },
            data: {
                skillPoints: { decrement: skill.cost }
            }
        });

        await prisma.userSkill.create({
            data: {
                userId,
                skillId
            }
        });

        return res.status(200).json({
            message: "Skill unlocked sucessfully",
            skillId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to unlock skill" });
    }
};

module.exports = { unlockSkill, getAllSkills };