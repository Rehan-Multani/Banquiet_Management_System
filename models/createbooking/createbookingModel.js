import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  customername: { type: String, required: true },
  mobilenumber: { type: String },
  email: { type: String, required: true, unique: true },
  bookingfrom: { type: String },
  timestart: { type: String },
  bookingto: { type: String },
  timeend: { type: String },
  numberofguest: { type: String },
  eventtypes: { type: String },
  message: { type: String },
  servicename: { type: String },
  servicedescription: { type: String },
  serviceprice: { type: String },
  applydate: { type: String },
  orderfinalstatus: { type: String },
  adminremark: { type: String },
});

const bookingModel = mongoose.model("booking", bookingSchema);
export default bookingModel;
