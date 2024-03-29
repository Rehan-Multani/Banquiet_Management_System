import unityModel from "../models/UnityModel.js";
import userModel from "../models/userModel.js";

const add = async (req, res) => {
  const { id: adminid } = req.admin;
  const { id } = req.params;
  try {
    const rolekitchen = await userModel.findOne({ _id: adminid });
    console.log(JSON.parse(req.body.items));
    if (rolekitchen.role == "Quality Checker") {
      let updatequality = await unityModel.findByIdAndUpdate(
        id,
        {
          $set: {
            qualitymanagerid: adminid,
            items: JSON.parse(req.body.items),
            comment: req.body.comment,
          },
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
const getfilterdata = async (req, res) => {
  const data = await unityModel.find();

  const finaldata = data.filter((item) => item.qualitymanagerid !== undefined);

  console.log("helloooo", finaldata.length);
  res.status(201).json({ tickets: finaldata });
};
const getunitmanger = async (req, res) => {
  const data = await userModel.find({ role: "Unit Manager" });
  res.status(200).json({ data });
};
export { add, getunitmanger, getfilterdata };
