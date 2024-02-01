import TicketModel from "../models/TicketModel.js";
import unityModel from "../models/UnityModel.js";
import userModel from "../models/userModel.js";

const add = async (req, res) => {
  const { id: adminid } = req.admin;
  const { id } = req.params;
  const { items } = req.body;
  try {
    const roledata = await userModel.findOne({ _id: adminid });
    if (roledata.role == "Unit Manager") {
      let data = await unityModel.create({
        ticketid: id,
        unitid: roledata._id,
        items: JSON.parse(items),
        companyname: roledata.companyname,
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
  const { id } = req.user;
  const user = await userModel.findById(id);
  const data = await unityModel
    .find({ companyname: user.companyname })
    .populate("unitid");

  const finaldata = data.filter(
    (item) => !item.qualitymanagerid && item.unitid
  );

  console.log(finaldata);
  res.status(201).json({ tickets: finaldata });
};

const remaininggtzero = async (req, res) => {
  try {
    const data = await unityModel.find();

    // remainingQuantity > 0 logic
    const filteredData = data.filter((ticket) => {
      const hasRemainingQuantity = ticket.items.some(
        (item) => parseInt(item.remainingQuantity) > 0
      );
      return hasRemainingQuantity;
    });

    let newdata = [];
    for (const ticket of filteredData) {
      const remainingItems = ticket.items.filter(
        (item) => parseInt(item.remainingQuantity) > 0
      );
      if (remainingItems.length > 0) {
        newdata.push({ ticket, remainingItems });
      }
    }

    // Update the ticket in the database

    res.status(200).json({ newdata });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const setdata = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await unityModel.findById(id);
    const { items } = req.body;
    const updatedItems = JSON.parse(items).map((el) => ({
      name: el.name,
      quantity: el.quantity,
      rating: el.rating,
      remainingQuantity: el.remainingQuantity,
      qualityRating: el.qualityRating,
    }));
    const newUpdated = await TicketModel.findByIdAndUpdate(
      data.ticketid,
      {
        $push: { remaining_quantity: { $each: updatedItems } },
      },

      { new: true }
    );
    await unityModel.findByIdAndUpdate(id, {
      items: JSON.parse(items),
    });

    res.status(201).json({ newUpdated, message: "successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { add, getfilterdata, remaininggtzero, setdata };
