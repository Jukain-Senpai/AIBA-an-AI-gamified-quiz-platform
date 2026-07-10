const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const { createReportIssue, deleteReportIssue } = require("../controllers/reportIssue.controller");

router.post("/", protect, createReportIssue);
router.delete("/:id", protect, deleteReportIssue);

module.exports = router;
