import TicketModel from "../models/TicketModel.js";
import userModel from "../models/userModel.js";

const createTicket = async (req, res) => {
  const { id: adminid } = req.admin;
  const { items } = req.body;

  try {
    const rolekitchen = await userModel.findOne({ _id: adminid });

    if (rolekitchen.role == "Kitchen") {
      const newTicket = new TicketModel({
        adminid,
        kitchenid: rolekitchen._id,
        items: JSON.parse(items),
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
  const Ticket = await TicketModel.find();
  res.status(200).json({ Ticket });
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
      status: req.body.status,
    },
    { new: true }
  );
  res.status(200).json({ data: { updatedata } });
};

export {
  getTicket,
  deleteTicket,
  createTicket,
  getTicketall,
  getfilterdata,
  statusHandeler,
};
