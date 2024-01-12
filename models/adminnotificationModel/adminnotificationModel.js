import mongoose from "mongoose";

const adminnotification = new mongoose.Schema({
  creatorId: { type: mongoose.Schema.Types.ObjectId },
  message: { type: String },
  type: { type: String },
  companyname: String,
});

const adminNotification = mongoose.model(
  "adminnotification",
  adminnotification
);

export default adminNotification;
