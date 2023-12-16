import express from "express";
import {
  createbooking,
  getBooking,
} from "../../controllers/createBookingController/createBookingController.js";
import requireAuth from "../../middleware/requireAuth.js";
const router = express.Router();

router.post("/createbooking", requireAuth, createbooking);
router.get("/getuser", requireAuth, getBooking);

export default router;
