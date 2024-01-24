import express from "express";
import {
  add,
  getfilterdata,
  remaininggtzero,
  setdata,
} from "../controllers/UnityController.js";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

router.post("/:id", requireAuth, add);
router.get("/getfilterdata", requireAuth, getfilterdata);
router.get("/remaininggt", requireAuth, remaininggtzero);
router.post("/remaining/:id", requireAuth, setdata);

export default router;
