import express from "express";
import {
  updateKitchen,
  getfilterdata,
} from "../controllers/KitchenController.js";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

router.put("/:id", requireAuth, updateKitchen);
router.get("/getfilterdata", requireAuth, getfilterdata);

export default router;
