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
    }
  ],
  orderfinalstatus: { type: String },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const bookingModel = mongoose.model("booking", bookingSchema);
export default bookingModel;

// "customername": "raj",
// "mobilenumber": "5555555555",
// "email": "raj@gmail.com",
// "bookingfrom": "wdewkhd",
// "timestart": "05",
// "bookingto": "3",
// "timeend": "2",
// "numberofguest": "wew",
// "eventtypes": "www",
// "message": "www",
// "servicename": "www",
// "servicedescription": "rr",
// "serviceprice": "rrr",
// "items": [
//     {
//         "id": "5",
//         "name": "t shirt",
//         "price": "300",
//         "quantity": "1",
//         "_id": "65815157f7f3c064591f0998"
//     }
// ],
// "orderfinalstatus": "rrr",
