import TicketModel from "../models/TicketModel.js";
import unityModel from "../models/UnityModel.js";
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
      const unitItems = updateweight.items.map((el) => ({
        ...el,
        remainingQuantity: 0,
      }));
      await unityModel.create({
        ticketid: updateweight._id,
        items: unitItems,
      });
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
  const menu = await unityModel.find();
  // console.log(menu);
  const finalMenu = menu.map((item) => {
    return {
      _id: item._id,
      ticketid: item.ticketid,
      items: item.items,
      disabled: !item.qualitymanagerid,
    };
  });

  console.log(finalMenu);
  res.status(201).json({ tickets: finalMenu });
};

export { add, getfilterdata };
