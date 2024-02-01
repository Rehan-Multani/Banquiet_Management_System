import TicketModel from "../models/TicketModel.js";
import unityModel from "../models/UnityModel.js";
import adminModel from "../models/adminModel/adminModel.js";
import userModel from "../models/userModel.js";

const createTicket = async (req, res) => {
  const { id: adminid } = req.admin;
  const { items, comment } = req.body;

  try {
    const rolekitchen = await userModel.findOne({ _id: adminid });

    if (rolekitchen.role == "Kitchen") {
      const newTicket = new TicketModel({
        companyname: rolekitchen.companyname,
        kitchenid: rolekitchen._id,
        items: JSON.parse(items),
        comment,
      });
      const savedTicket = await newTicket.save();
      res.status(201).json({ success: true, savedTicket });
    } else {
      res
        .status(201)
        .json({ success: false, message: "you are role is not authorised" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getTicket = async (req, res) => {
  console.log(req.user);
  console.log(req.admin);
  const Ticket = await TicketModel.findOne({ adminid: req.admin.id });
  res.status(200).json({ Ticket });
};

const getTicketall = async (req, res) => {
  const { id } = req.user;
  const admin = await adminModel.findById(id);
  const tickets = await TicketModel.find({ companyname: admin.companyname });
  const unitManagers = await userModel.find({ role: "Unit Manager" });
  const finalTickets = [];
  const tempUnit = [];
  for (const ticket of tickets) {
    for (const unit of unitManagers) {
      const unitTicket = await unityModel.findOne({
        ticketid: ticket._id,
        unitid: unit._id,
      });
      if (!unitTicket) {
        tempUnit.push({ name: unit.name, received: false });
      } else {
        tempUnit.push({ name: unit.name, received: true });
      }
    }
    console.log(tempUnit);
    finalTickets.push({
      unit: tempUnit.slice(),
      items: ticket.items,
      comment: ticket.comment,
      remaining_quantity: ticket.remaining_quantity,
      seceurityid: ticket.securityid,
      kitchenid: ticket.kitchenid,
      _id: ticket._id,
    });
    tempUnit.splice(0, tempUnit.length);
  }
  // console.log(finalTickets);
  res.status(200).json({ tickets: finalTickets });
};
const deleteTicket = async (req, res) => {
  const Ticket = await TicketModel.findOneAndDelete(req.params.id);
  res.status(200).json({ Ticket });
};

const getfilterdata = async (req, res) => {
  const menu = await TicketModel.find();
  console.log(menu);
  const finalMenu = menu.filter((item) => {
    return item.kitchenid !== null && item?.securityid !== null;
  });
  console.log(finalMenu);
  res.status(200).json({ data: { finalMenu } });
};
const statusHandeler = async (req, res) => {
  const updatedata = await TicketModel.findByIdAndUpdate(
    req.params.id,
    {
      remaining_quantity: JSON.parse(req.body.items),
    },
    { new: true }
  );
  res.status(201).json({ data: { updatedata } });
};
const getRemainingItems = async (req, res) => {
  try {
    const tickets = await TicketModel.find();
    const finalTickets = tickets.filter(
      (el) => el.remaining_quantity.length !== 0
    );
    return res.status(201).json({ remaining: finalTickets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  getTicket,
  deleteTicket,
  createTicket,
  getTicketall,
  getfilterdata,
  statusHandeler,
  getRemainingItems,
};
