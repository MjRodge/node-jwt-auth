const express = require("express");
const router = express.Router();

// @route GET api/profile/test
// @desc Test profile routes
// @access Public
router.get("/test", (req, res) => res.json({ message: "test for profile" }));

module.exports = router;
