import adminModel from "../../models/adminModel/adminModel.js";
import adminNotification from "../../models/adminnotificationModel/adminnotificationModel.js";
import userModel from "../../models/userModel.js";

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

      if (notificationToDelete) {
        res.status(200).send({
          success: true,
          notificationToDelete,
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

export { createadminnotification, deleteadminnotification };
