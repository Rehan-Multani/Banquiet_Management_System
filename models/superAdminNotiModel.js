import mongoose from "mongoose";

const superAdminnotification = new mongoose.Schema({
  creatorId: { type: mongoose.Schema.Types.ObjectId },
  message: { type: String },
  type: { type: String },
});

const superAdminNotification = mongoose.model(
  "superAdminNotification",
  superAdminnotification
);

export default superAdminNotification;
