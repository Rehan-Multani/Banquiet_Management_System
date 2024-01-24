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
      const updateweight = await TicketModel.findByIdAndUpdate(
        id,
        {
          securityid: rolekitchen._id,
          items: JSON.parse(req.body.items),
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
  const filtered = menu.filter((el) => !el.unitid);
  const finalMenu = filtered
    .map((item) => {
      const existingUnit = menu.find(
        (el) =>
          String(el.unitid) === req.user.id &&
          String(el.ticketid) === String(item.ticketid)
      );
      console.log(existingUnit);
      if (
        existingUnit &&
        existingUnit.items.some((el) => el.remainingQuantity !== "0")
      ) {
        return null;
      }
      if (existingUnit) {
        return {
          _id: existingUnit._id,
          ticketid: item.ticketid,
          items: existingUnit.items,
          quantityDisabled: true,
          disabled: !existingUnit.qualitymanagerid,
        };
      }
      return {
        _id: item._id,
        ticketid: item.ticketid,
        items: item.items,
        quantityDisabled: menu.some(
          (el) =>
            String(el.unitid) === req.user.id &&
            String(el.ticketid) === String(item.ticketid)
        ),
        disabled: !menu.some(
          (el) =>
            !!el.qualitymanagerid &&
            String(el.unitid) === req.user.id &&
            String(el.ticketid) === String(item.ticketid)
        ),
      };
    })
    .filter(Boolean);

  // console.log(finalMenu);
  res.status(201).json({ tickets: finalMenu });
};

export { add, getfilterdata };
