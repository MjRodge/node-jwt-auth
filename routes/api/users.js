const express = require("express");
const router = express.Router();

// @route GET api/users/test
// @desc Test user routes
// @access Public
router.get("/test", (req, res) => res.json({ message: "test for user" }));

module.exports = router;
