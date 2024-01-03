import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  customername: { type: String },
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

  items: [
    {
      name: { type: String },
      price: { type: String },
      quantity: { type: String },
    },
  ],
  chef: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  waiter: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  orderfinalstatus: { type: String },
  userbookingid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  customerid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customer",
  },
  companyid: {
    type: String,
  },

  totalPrice: { type: Number },
});

const bookingModel = mongoose.model("booking", bookingSchema);
export default bookingModel;

// {
//   "customername":"lokesh",
//   "mobilenumber":"9865623569",
//   "email":"lokesh@gmai1.com",
//   "bookingfrom":"jhfskdh",
//   "timestart":"06",
//   "bookingto":"02",
//   "timeend":"12",
//   "numberofguest":"ewr",
//   "eventtypes":"ewrew",
//   "message":"ewrew",
//   "servicename":"ewr",
//   "servicedescription":"erw",
//   "serviceprice":"rer",
//   "orderfinalstatus":"ewf",
//   "items":[{
//     "name":"pronew",
//     "price":"400",
//     "quantity":"4"
//   }],
//   "list":[{"hubuh":"uhfghf","yhfgf":"jhghv"}]
// }
