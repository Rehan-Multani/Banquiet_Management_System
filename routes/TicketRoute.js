import express from "express";
import {
  getTicket,
  deleteTicket,
  createTicket,
  getTicketall,
  getfilterdata,
  statusHandeler,
  getRemainingItems,
} from "../controllers/TicketController.js";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

router.post("/create-ticket", requireAuth, createTicket);
router.get("/", requireAuth, getTicketall);
router.get("/singleticket", requireAuth, getTicket);
router.get("/getfilterdata", requireAuth, getfilterdata);
router.get("/remaining", requireAuth, getRemainingItems);
router.delete("/:id", requireAuth, deleteTicket);
router.post("/status-handler/:id", requireAuth, statusHandeler);

export default router;
