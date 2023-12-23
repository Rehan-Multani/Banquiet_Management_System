import express from "express";
import {
  creationrole,
  getalldata,
  createadmin,
  adminlogin,
  getdata_NC,
  getdata_C,
} from "../../controllers/adminController/adminController.js";
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
router.post("/createadmin", createadmin);

router.post("/login", adminlogin);

router.post("/creation/:id", requireAuth, checkAdmin, creationrole);

router.get("/getalldata", requireAuth, checkAdmin, getalldata);

router.get("/order_notconfirmed", requireAuth, getdata_NC);

router.get("/order_confirmed", requireAuth, getdata_C);
router.get("/order_confirmed", requireAuth, getdata_C);

export default router;
