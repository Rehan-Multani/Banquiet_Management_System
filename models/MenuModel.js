import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema({
  adminid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "adminModel",
  },
  items: [
    {
      name: { type: String },
      quantity: { type: String },
      weight: { type: String },
      rating: { type: String },
      remaining_quantity: { type: String },
    },
  ],
});

const menuModel = mongoose.model("menu", MenuSchema);
export default menuModel;
