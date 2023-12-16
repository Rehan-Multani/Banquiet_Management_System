import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  CustomerName: { type: String, required: true },
  MobileNumber: { type: String },
  Email: { type: String, required: true, unique: true },
  BookingFrom: { type: String },
  TimeStart: { type: String },
  BookingTo: { type: String },
  TimeEnd: { type: String },
  NumberOfGuest: { type: String },
  EventTypes: { type: String },
  Message: { type: String },
  ServiceName: { type: String },
  ServiceDescription: { type: String },
  ServicePrice: { type: String },
  ApplyDate: { type: String },
  OrderFinalStatus: { type: String },
  AdminRemark: { type: String },
});

const bookingModel = mongoose.model("booking", bookingSchema);
export default bookingModel;
