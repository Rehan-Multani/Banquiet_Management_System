import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema({
  adminid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "adminModel",
  },
  date_from: String,
  date_to: String,
  items: [
    {
      name: { type: String },
      quantity: { type: String },
      weight: { type: String },
      rating: { type: String },
      remaining_quantity: { type: String },
      kitchenid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      securityid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      last_update_security: { type: String },
      last_update_kitchen: { type: String },
    },
  ],
  comment: { type: String },
});

const menuModel = mongoose.model("menu", MenuSchema);
export default menuModel;
