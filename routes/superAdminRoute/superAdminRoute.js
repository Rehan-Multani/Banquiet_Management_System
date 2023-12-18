import express from "express";
import { creationrole } from "../../controllers/superAdminController/superAdminController.js";
import requireAuth from "../../middleware/requireAuth.js";
import userModel from "../../models/userModel.js";
const router = express.Router();

// checking is user super Admin or not function
const checkSuperAdmin = (req, res, next) => {
  const isSuperAdmin = userModel.findById({ _id: req.user.id });

  if (isSuperAdmin.role == "superadmin") {
    next();
  } else {
    res.status(403).json({
      error: "Permission denied. Only super admins can perform this action.",
    });
  }
};

// routers
router.post("/creation", requireAuth, checkSuperAdmin, creationrole);

export default router;
