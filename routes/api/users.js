const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => res.json({ message: "test for user" }));

module.exports = router;
