import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, match: /^\S+@\S+\.\S+$/ },
    password: { type: String },
    notifications: [
      {
        message: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const adminModel = mongoose.model("adminmodel", adminSchema);

export default adminModel;

// {
//     "email":"admin@gmail.com",
//     "password": "admin@12345",
//     "notifications": ["sendmessage successfully" ]
// }
