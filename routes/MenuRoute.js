import express from "express";
import {
  updateMenu,
  getmenu,
  deletedata,
  createMenu,
} from "../controllers/MenuController.js";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

router.post("/create-menu", requireAuth, createMenu);
router.get("/", requireAuth, getmenu);

router.put("/:id", requireAuth, updateMenu);
router.delete("/:id", requireAuth, deletedata);

export default router;
