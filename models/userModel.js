import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  companyname: { type: String },
  companyid: { type: String },
  contact: { type: String },
  role: {
    type: String,
    default: "user",
    enum: ["user", "waiter", "staff"],
  },
  password: { type: String, required: true },
  resetToken: { type: String, required: false },
});

const userModel = mongoose.model("User", userSchema);
export default userModel;
