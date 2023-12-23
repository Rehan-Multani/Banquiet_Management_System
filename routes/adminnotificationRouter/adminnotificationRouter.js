import express from "express";
import {
  createadminnotification,
  deleteadminnotification,
  getAdminNotification,
} from "../../controllers/adminnotificationController/adminnotificationController.js";
import requireAuth from "../../middleware/requireAuth.js";
import userModel from "../../models/userModel.js";
const router = express.Router();

// checking is user Admin or not function
const checkAdmin = async (req, res, next) => {
  const isAdmin = await userModel.findById({ _id: req.user.id });
  if (isAdmin.role == "admin") {
    next();
  } else {
    res.status(403).json({
      error: "Permission denied. Only super admins can perform this action.",
    });
  }
};

// routers
router.get("/", requireAuth, getAdminNotification);
router.post("/", createadminnotification);
router.delete("/:id", deleteadminnotification);

export default router;
