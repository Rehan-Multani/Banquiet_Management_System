import mongoose from "mongoose";

const unitySchema = new mongoose.Schema({
  ticketid: { type: mongoose.Schema.Types.ObjectId, ref: "ticket" },
  unitid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  qualitymanagerid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      name: { type: String },
      quantity: { type: String },
      rating: { type: String },
      remainingQuantity: { type: String },
      qualityRating: String,
      weight: String,
    },
  ],
  comment: { type: String },
});

const unityModel = mongoose.model("unity", unitySchema);
export default unityModel;
