import express from "express";
import {
  creationrole,
  getalldata,
  createadmin,
  adminlogin,
  getdata_NC,
  getdata_C,
  updateconfirmed,
  adduser,
  updateuser,
  deleteuser,
  superAdminLogin,
  getAllAdmin,
  verifyadmin,
  updateAdmin,
  deleteadmin,
  createadminV2,
  updateKitchenStatus,
  updateAdminV2,
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

router.post("/superlogin", superAdminLogin);

router.post("/creation/:id", requireAuth, checkAdmin, creationrole);

router.get("/getalldata", requireAuth, checkAdmin, getalldata);

router.get("/order_notconfirmed", requireAuth, getdata_NC);

router.get("/order_confirmed", requireAuth, getdata_C);

router.put("/:id", requireAuth, updateconfirmed);

router.get("/", requireAuth, getAllAdmin);

router.post("/verify", requireAuth, verifyadmin);

router.put("/update/:id", requireAuth, updateAdmin);
router.delete("/:id", requireAuth, deleteadmin);

// user by admin

router.post("/adduser", requireAuth, adduser);
router.put("/updateuser/:id", requireAuth, updateuser);
router.delete("/deleteuser/:id", requireAuth, deleteuser);

router.post("/v2/createadmin", createadminV2);
router.put("/v2/update/:id", requireAuth, updateAdminV2);

router.put("/kitchen/:id", requireAuth, updateKitchenStatus);

export default router;
