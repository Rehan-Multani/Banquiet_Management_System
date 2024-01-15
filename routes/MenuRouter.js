import express from "express";
import {
  updateMenu,
  getMenu,
  deleteMenu,
  createMenu,
  getMenuall,
} from "../controllers/MenuController.js";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

router.post("/create-menu", requireAuth, createMenu);
router.get("/:date", requireAuth, getMenuall);
router.get("/singlemenu", requireAuth, getMenu);

router.put("/:id", requireAuth, updateMenu);
router.delete("/:id", requireAuth, deleteMenu);

export default router;
