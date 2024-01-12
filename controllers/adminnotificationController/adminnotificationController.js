import adminModel from "../../models/adminModel/adminModel.js";
import adminNotification from "../../models/adminnotificationModel/adminnotificationModel.js";
import superAdminNotification from "../../models/superAdminNotiModel.js";
import userModel from "../../models/userModel.js";

const getAdminNotification = async (req, res) => {
  try {
    const admin = await adminModel.findById(req.user.id);
    console.log(admin, "adminnnn");
    const notifications = await adminNotification.find({
      companyname: admin.companyname,
    });
    res.status(200).send({
      success: true,
      notifications,
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "internal server Error" + error });
  }
};
const getSuperAdminNotification = async (req, res) => {
  try {
    const notifications = await superAdminNotification.find();
    res.status(200).send({
      success: true,
      notifications,
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "internal server Error" + error });
  }
};

const createadminnotification = async (req, res) => {
  try {
    const noticationcreate = await adminNotification.create({
      creatorId: req.user.id,
      message: req.body.message,
      type: req.body.type,
    });

    res.status(200).send({
      success: true,
      noticationcreate,
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "internal server Error" + error });
  }
};
const deleteadminnotification = async (req, res) => {
  try {
    if (req.params.id) {
      const notificationToDelete = await adminNotification.findByIdAndDelete(
        req.params.id
      );
      const notifications = await adminNotification.find();
      if (notificationToDelete) {
        res.status(200).send({
          success: true,
          notificationToDelete,
          notifications,
        });
      } else {
        res.status(404).send({
          success: false,
          message: "Notification not found",
        });
      }
    } else {
      res.status(400).send({
        success: false,
        message: "ID is not available for deleting notification",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};
const deletesuperadminnotification = async (req, res) => {
  try {
    if (req.params.id) {
      const notificationToDelete =
        await superAdminNotification.findByIdAndDelete(req.params.id);
      const notifications = await superAdminNotification.find();
      if (notificationToDelete) {
        res.status(200).send({
          success: true,
          notificationToDelete,
          notifications,
        });
      } else {
        res.status(404).send({
          success: false,
          message: "Notification not found",
        });
      }
    } else {
      res.status(400).send({
        success: false,
        message: "ID is not available for deleting notification",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

export {
  getAdminNotification,
  createadminnotification,
  getSuperAdminNotification,
  deleteadminnotification,
  deletesuperadminnotification,
};
