import express from "express";
import {
  add,
  getunitmanger,
  getfilterdata,
} from "../controllers/QualityController.js";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

router.put("/:id", requireAuth, add);
router.get("/getfilterdata", requireAuth, getfilterdata);
router.get("/getunitmanger", requireAuth, getunitmanger);

export default router;
