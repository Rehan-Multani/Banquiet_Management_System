import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  companyname: {
    type: String,
    required: true,
  },
  kitchenid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  securityid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      name: { type: String },
      quantity: { type: String },
      rating: { type: String },
      remaining_quantity: { type: String },
      last_update_security: { type: String },
      last_update_kitchen: { type: String },
      weight: { type: String },
    },
  ],
  remaining_quantity: [
    {
      name: { type: String },
      quantity: { type: String },
      rating: { type: String },
      remainingQuantity: { type: String },
      status: String,
      weight: String,
    },
  ],
  status: { type: String },
  comment: { type: String },
});

const menuModel = mongoose.model("ticket", TicketSchema);
export default menuModel;
