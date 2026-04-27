const express = require("express");
const router = express.Router();

const {
  getEvents,
  getStats,
} = require("../controllers/eventsController");

router.get("/", getEvents);
router.get("/stats", getStats);

module.exports = router;