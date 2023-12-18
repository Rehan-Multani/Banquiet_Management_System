import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  customername: { type: String},
  mobilenumber: { type: String },
  email: { type: String },
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




// {
//   "customername":"rahul",
//   "mobilenumber":"9898989898",
//   "email":"rahul@gmail.com",
//   "bookingfrom":"djak",
//   "timestart":"22",
//   "bookingto":"30",
//   "timeend":"ijl",
//   "numberofguest":"wae",
//   "eventtypes":"radsadashul",
//   "message":"dsads",
//   "servicename":"dsa",
//   "servicedescription":"dsad",
//   "serviceprice":"wseds",
//   "applydate":"weqes",
//   "orderfinalstatus":"wqe",
//   "adminremark":"ewqe"

// }