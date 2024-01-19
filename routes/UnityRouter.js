import express from "express";
import {
  add,
  getfilterdata,
  remaininggt0,
} from "../controllers/UnityController.js";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

router.post("/:id", requireAuth, add);
router.get("/getfilterdata", requireAuth, getfilterdata);
router.get("/remaininggt", requireAuth, remaininggt0);

export default router;
