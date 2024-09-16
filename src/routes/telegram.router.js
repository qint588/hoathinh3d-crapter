const express = require("express");
const { listener, detailView } = require("../controllers/telegram.controller");
const router = express.Router();

router.post("/webhook", listener);
router.get("/detail/:id", detailView);

module.exports = router;
