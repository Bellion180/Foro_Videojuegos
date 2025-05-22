const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");

// Public route to get site-wide statistics
router.get("/", statsController.getSiteStats);

module.exports = router;
