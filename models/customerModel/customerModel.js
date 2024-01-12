import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  address: { type: String },
  mobile: { type: Number },
  companyname: String,
  customerbookingid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "booking",
  },
  totalOrders: { type: Number, default: 0 },
});

const customerModel = mongoose.model("customer", customerSchema);
export default customerModel;
