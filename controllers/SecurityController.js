import TicketModel from "../models/TicketModel.js";
import userModel from "../models/userModel.js";

const add = async (req, res) => {
  const { id: adminid } = req.admin;
  const { id } = req.params;
  try {
    const rolekitchen = await userModel.findOne({ _id: adminid });
    console.log(rolekitchen);
    if (rolekitchen.role == "Security") {
      let updateweight = await TicketModel.findByIdAndUpdate(
        id,
        {
          $set: { weight: req.body.weight, securityid: adminid },
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

const getfilterdata = async (req, res) => {
  const { date } = req.params;
  const menu = await TicketModel.find();
  console.log(menu.securityid);
  const finalMenu = menu.filter((item) => {
    return (
      item.kitchenid !== null &&
      item.securityid !== undefined &&
      item.securityid !== null
    );
  });

  console.log(finalMenu);
  res.status(200).json({ data: { finalMenu } });
};

export { add, getfilterdata };
