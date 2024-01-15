import express from "express";
import { add, getfilterdata } from "../controllers/SecurityController.js";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

router.put("/:id", requireAuth, add);
router.get("/getfilterdata", requireAuth, getfilterdata);
export default router;
