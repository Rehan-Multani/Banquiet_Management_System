import express from "express";
import {
  createbooking,
  getBooking,
} from "../../controllers/createBookingController/createBookingController.js";
import requireAuth from "../../middleware/requireAuth.js";
const bookingRouter = express.Router();

router.post("/createbooking", requireAuth, createbooking);
router.get("/getuser", requireAuth, getBooking);

export default bookingRouter;
