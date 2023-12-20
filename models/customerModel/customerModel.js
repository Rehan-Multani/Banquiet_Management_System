import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String}, 
  email: { type: String}, 
  address: { type: String}, 
  mobile: { type: Number}, 
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const customerModel = mongoose.model("customer", customerSchema);
export default customerModel;
