import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

import bookingModel from "./../../models/createbooking/createbookingModel";

//create token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

//login user
// const loginUser = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     if (!email || !password) {
//       return res.status(400).json({ message: "Please enter all fields" });
//     }
//     const user = await userModel.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: "User does not exist" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }
//     const token = createToken(user._id);
//     res.status(200).json({ user, token });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

//register user
const createbooking = async (req, res) => {
  try {
    let {
      MobileNumber,
      Email,
      BookingFrom,
      TimeStart,
      BookingTo,
      TimeEnd,
      NumberOfGuest,
      EventTypes,
      Message,
      ServiceName,
      ServiceDescription,
      ServicePrice,
      ApplyDate,
      OrderFinalStatus,
      AdminRemark,
    } = req.body;
    //check if user already exists
    const exists = await bookingModel.findOne({ email: Email });
    if (exists) {
      return res.status(400).json({ message: "you  are already Booked" });
    }
    if (
      validator.isEmpty(MobileNumber) ||
      validator.isEmpty(BookingFrom) ||
      validator.isEmpty(TimeStart) ||
      validator.isEmpty(BookingTo) ||
      validator.isEmpty(TimeEnd) ||
      validator.isEmpty(NumberOfGuest) ||
      validator.isEmpty(EventTypes) ||
      validator.isEmpty(Message) ||
      validator.isEmpty(ServiceName) ||
      validator.isEmpty(ServiceDescription) ||
      validator.isEmpty(ServicePrice) ||
      validator.isEmpty(ApplyDate) ||
      validator.isEmpty(OrderFinalStatus) ||
      validator.isEmpty(AdminRemark)
    ) {
      return res
        .status(400)
        .json({ message: "Please provide full details for all fields" });
    }
    if (!validator.isEmail(Email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    const newBooking = new bookingModel({
      MobileNumber,
      Email,
      BookingFrom,
      TimeStart,
      BookingTo,
      TimeEnd,
      NumberOfGuest,
      EventTypes,
      Message,
      ServiceName,
      ServiceDescription,
      ServicePrice,
      ApplyDate,
      OrderFinalStatus,
      AdminRemark,
    });
    const booking = await newBooking.save();

    res.status(200).json({ booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get user info
const getBooking = async (req, res) => {
  const id = req.user.id;
  try {
    const user = await bookingModel.find({ _id: id });
    res.status(200).json({ user: user[0] });
  } catch (error) {
    res.status(502).json({ message: error.message });
  }
};
export { createbooking, getBooking };
