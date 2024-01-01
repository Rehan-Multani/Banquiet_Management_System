import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, match: /^\S+@\S+\.\S+$/ },
  password: { type: String },
  notifications: [{ message: { type: String, required: false } }],
  companyname: String,
  companyid: String,
  contact: String,
  verify: { type: Boolean, default: false },
  resetToken: { type: String, required: false },
});

const adminModel = mongoose.model("adminmodel", adminSchema);

export default adminModel;

// {
//     "email":"admin@gmail.com",
//     "password": "admin@12345",
//     "notifications": ["sendmessage successfully" ]
// }
