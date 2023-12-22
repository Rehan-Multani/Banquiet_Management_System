import adminModel from "../../models/adminModel/adminModel.js";
import userModel from "../../models/userModel.js";

const createnotification = async (req, res) => {
  try {
    const admindata = await adminModel.find({ email: req.body.email });

    admindata.forEach(async (item) => {
      item.notifications.push({ message: req.body.notifications });
      await item.save();
    });

    res.status(200).send({
      success: true,
      message: "Notification added successfully",
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "internal server Error" + error });
  }
};

export { createnotification };
