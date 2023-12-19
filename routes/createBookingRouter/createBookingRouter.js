import express from "express";

import {
  createbooking,
  getBooking,
  updateBooking,
  getsingleBooking,
  deleteBooking
} from "../../controllers/createBookingController/createBookingController.js";
import requireAuth from "../../middleware/requireAuth.js";
const router = express.Router();

router.post("/", requireAuth, createbooking);
router.get("/:id", requireAuth, getsingleBooking);
router.get("/", requireAuth, getBooking);
router.delete("/:id", requireAuth, deleteBooking);
router.put("/:id", requireAuth, updateBooking);

export default router;
