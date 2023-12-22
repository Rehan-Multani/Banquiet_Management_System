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

export { createadminnotification };
