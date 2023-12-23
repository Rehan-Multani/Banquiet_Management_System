import express from "express";
import { creationrole, getalldata } from "../../controllers/superAdminController/superAdminController.js";
import requireAuth from "../../middleware/requireAuth.js";
import userModel from "../../models/userModel.js";
const router = express.Router();

// checking is user super Admin or not function
const checkSuperAdmin = async (req, res, next) => {
  const isSuperAdmin = await userModel.findById({ _id: req.user.id });

  if (isSuperAdmin.role == "superadmin") {
    next();
  } else {
    res.status(403).json({
      error: "Permission denied. Only superadmins admins can perform this action.",
    });
  }
};

// routers
router.post("/creation/:id", requireAuth, checkSuperAdmin, creationrole);

router.get("/getalldata", requireAuth, checkSuperAdmin, getalldata);

export default router;
