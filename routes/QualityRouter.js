import express from "express";
import { add } from "../controllers/QualityController.js";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

router.put("/:id", requireAuth, add);

export default router;
