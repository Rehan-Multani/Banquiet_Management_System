import express from "express";
import {
  loginUser,
  registerUser,
  getUser,
  getsaffwaiter,
} from "../controllers/userController.js";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/getuser", requireAuth, getUser);
router.get("/saff-waiter", requireAuth, getsaffwaiter);

export default router;
