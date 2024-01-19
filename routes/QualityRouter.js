import express from "express";
import { add, getunitmanger } from "../controllers/QualityController.js";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

router.put("/:id", requireAuth, add);
router.get("/getunitmanger", requireAuth, getunitmanger);

export default router;
