import express from "express";
import {
  createbooking,
  getBooking,
  updateBooking,
} from "../../controllers/createBookingController/createBookingController.js";
import requireAuth from "../../middleware/requireAuth.js";
const router = express.Router();

router.post("/", requireAuth, createbooking);
router.get("/", requireAuth, getBooking);
router.put("/:id", requireAuth, updateBooking);

export default router;
