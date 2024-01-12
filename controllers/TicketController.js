import TicketModel from "../models/TicketModel.js";

const createTicket = async (req, res) => {
  const { id: adminid } = req.admin;
  const { items } = req.body;

  try {
    const newTicket = new TicketModel({ adminid, items });
    const savedTicket = await newTicket.save();

    res.status(201).json(savedTicket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { items } = req.body;

  try {
    const updatedTicket = await TicketModel.findByIdAndUpdate(
      { _id: id, "items._id": req.body.id },
      { $set: { items } },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(updatedTicket);
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
  const Ticket = await TicketModel.findOne({ _id: req.params.id });
  res.status(200).json({ Ticket });
};

export { updateTicket, getTicket, deleteTicket, createTicket, getTicketall };
