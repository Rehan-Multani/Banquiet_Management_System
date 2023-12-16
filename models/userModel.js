import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Invalid email address",
    },
  },
  companyname: { type: String },
  companyid: { type: String },
  contact: {
    type: String,
    validate: {
      validator: value => validator.isMobilePhone(value, "any", { strictMode: false }),
      message: "Invalid contact number",
    },
  },
  password: { type: String, required: true },
  resetToken: { type: String, required: false },
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
