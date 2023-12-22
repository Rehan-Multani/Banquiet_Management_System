import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  companyname: { type: String },
  companyid: { type: String },
  contact: { type: String },
  role: {
    type: String,
    default: "Order Management",
    enum: ["Order Management", "Waiter", "Chef", "admin", "superadmin"],
  },
  verify: { type: Boolean, default: false },
  password: { type: String, required: true, select: true },
  resetToken: { type: String, required: false },
  notifications: [{ type: String }],
});

const userModel = mongoose.model("User", userSchema);
export default userModel;
