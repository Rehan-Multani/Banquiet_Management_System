import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema({
  adminid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "adminModel",
  },
  date_from: String,
  date_to: String,
  items: [{ type: String }],
});

const menuModel = mongoose.model("menu", MenuSchema);
export default menuModel;
