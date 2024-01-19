import TicketModel from "../models/TicketModel.js";
import unityModel from "../models/UnityModel.js";
import userModel from "../models/userModel.js";

const add = async (req, res) => {
  const { id: adminid } = req.admin;

  const { ticketid, items } = req.body;
  try {
    const roledata = await userModel.findOne({ _id: adminid });
    console.log(roledata);
    if (roledata.role == "Unit Manager") {
      let ticketdata = await TicketModel.findOne({ _id: ticketid });

      let data = await unityModel.create({
        ticketid: ticketdata._id,
        unitid: roledata._id,
        items: items,
      });
      res.status(201).json({ success: true, data });
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

  const finaldata = data.filter((item) => !item.qualitymanagerid);

  console.log(finaldata);
  res.status(200).json({ tickets: finaldata });
};

const remaininggt0 = async (req, res) => {
  try {
    const data = await unityModel.find();
    // remainingqunanty  > 0 logic
    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { add, getfilterdata, remaininggt0 };
