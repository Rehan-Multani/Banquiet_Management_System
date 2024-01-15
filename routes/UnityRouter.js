import express from "express";
import { add } from "../controllers/UnityController.js";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

router.post("/", requireAuth, add);

export default router;
