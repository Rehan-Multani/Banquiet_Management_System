import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema({
  adminid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "adminModel",
  },
  date_from: String,
  date_to: String,
  kitchenid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  securityid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [{ type: String }],
  comment: { type: String },
});

const menuModel = mongoose.model("menu", MenuSchema);
export default menuModel;
