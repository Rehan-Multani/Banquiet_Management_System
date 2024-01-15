import express from "express";
import { add, getfilterdata } from "../controllers/UnityController.js";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

router.post("/", requireAuth, add);
router.get("/getfilterdata", requireAuth, getfilterdata);

export default router;
