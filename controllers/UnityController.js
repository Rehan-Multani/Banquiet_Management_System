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
      let data = await unityModel.findByIdAndUpdate(id, {
        unitid: roledata._id,
        items: JSON.parse(items),
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
    const data = await unityModel.find();

    // remainingQuantity > 0 logic
    const filteredData = data.filter((ticket) => {
      const hasRemainingQuantity = ticket.items.some(
        (item) => parseInt(item.remainingQuantity) > 0
      );
      return hasRemainingQuantity;
    });

    for (const ticket of filteredData) {
      const remainingItems = ticket.items.filter(
        (item) => parseInt(item.remainingQuantity) > 0
      );

      // Update the ticket in the database
      await TicketModel.findByIdAndUpdate(ticket.ticketid, {
        $set: {
          remaining_quantity: remainingItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            rating: item.rating,
            remaining_quantity: item.remainingQuantity,
          })),
        },
      });

      // Delete items with remaining quantity greater than 0 from unityModel
      for (const item of ticket.items) {
        if (parseInt(item.remainingQuantity) > 0) {
          await unityModel.findByIdAndUpdate(ticket._id, {
            $pull: { items: { _id: item._id } },
          });
        }
      }
    }

    // Check if the length == 0, then delete whole data
    const dataforlength = await unityModel.find();
    for (const ticket of dataforlength) {
      if (ticket.items.length === 0) {
        await unityModel.findByIdAndDelete(ticket._id);
      }
    }

    res.status(200).json({ filteredData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { add, getfilterdata, remaininggtzero, setdata };
