import unityModel from "../models/UnityModel.js";
import userModel from "../models/userModel.js";

const add = async (req, res) => {
  const { id: adminid } = req.admin;
  const { id } = req.params;
  try {
    const rolekitchen = await userModel.findOne({ _id: adminid });
    console.log(rolekitchen);
    if (rolekitchen.role == "Quality Checker") {
      let updatequality = await unityModel.findByIdAndUpdate(
        id,
        {
          $set: { qualitymanagerid: adminid, items: req.body.items },
        },
        { new: true }
      );
      res.status(201).json({ success: true, updatequality });
    } else {
      res
        .status(201)
        .json({ success: false, message: "Your role is not authorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { add };
