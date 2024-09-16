const express = require("express");
const { listener } = require("../controllers/telegram.controller");
const router = express.Router();

router.post("/webhook", listener);

module.exports = router;
