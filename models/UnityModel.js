import mongoose from "mongoose";

const unitySchema = new mongoose.Schema({
  ticketid: { type: mongoose.Schema.Types.ObjectId, ref: "ticket" },
  unitid: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  qualitymanagerid: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  items: [
    {
      name: { type: String },
      quantity: { type: String },
      rating: { type: String },
      remainingQuantity: { type: String },
    },
  ],
  comment: { type: String },
});

const unityModel = mongoose.model("unity", unitySchema);
export default unityModel;
