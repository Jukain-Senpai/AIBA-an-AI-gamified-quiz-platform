const express = require("express");
const router = express.Router();
const { unlockSkill } = require("../controllers/skill.controller");
const authMiddleware = require("../middleware/auth.middleware");

/**
 * @swagger
 * /skills/{skillId}/unlock:
 *   post:
 *     summary: Unlock a skill
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: skillId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the skill to unlock
 *     responses:
 *       200:
 *         description: Skill unlocked successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Skill not found
 */

router.post("/:skillId/unlock", authMiddleware, unlockSkill);

module.exports = router;

