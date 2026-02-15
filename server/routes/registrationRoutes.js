const express = require("express");
const {
  registerEvent,
  cancelRegistration,
  getMyRegistrations,
} = require("../controllers/registrationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:eventId", protect, registerEvent);
router.delete("/:eventId", protect, cancelRegistration);
router.get("/my", protect, getMyRegistrations);

module.exports = router;
