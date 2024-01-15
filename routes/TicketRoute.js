import express from "express";
import {
  getTicket,
  deleteTicket,
  createTicket,
  getTicketall,
} from "../controllers/TicketController.js";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

router.post("/create-ticket", requireAuth, createTicket);
router.get("/", requireAuth, getTicketall);
router.get("/singleticket", requireAuth, getTicket);

router.delete("/:id", requireAuth, deleteTicket);

export default router;
