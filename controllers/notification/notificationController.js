import adminModel from "../../models/adminModel/adminModel.js";
import userModel from "../../models/userModel.js";

const createnotification = async (req, res) => {
  try {
    const admindata = await adminModel.findOne({ email: req.body.email });
    console.log(admindata);
    let newnotification = admindata.notifications.push(req.body.notifications[0]);
    await admindata.save();
    res.status(200).send({
      success: true,
      admindata,
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "internal server Error" + error });
  }
};

export { createnotification };
