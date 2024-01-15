import TicketModel from "../models/TicketModel.js";
import userModel from "../models/userModel.js";

const add = async (req, res) => {
  const { id: adminid } = req.admin;
  try {
    const rolekitchen = await userModel.findOne({ _id: adminid });
    console.log(rolekitchen);
    if (rolekitchen.role == "Security") {
      let updateweight = await TicketModel.findByIdAndUpdate(
        req.body.id,
        {
          $set: { weight: req.body.weight },
        },
        { new: true }
      );
      res.status(201).json({ success: true, updateweight });
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
