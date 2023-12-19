import jwt from "jsonwebtoken";

import validator from "validator";

import bookingModel from "../../models/createbooking/createbookingModel.js";

//register user
const createbooking = async (req, res) => {
  try {
    let {
      customername,
      mobilenumber,
      email,
      bookingfrom,
      timestart,
      bookingto,
      timeend,
      numberofguest,
      eventtypes,
      message,
      servicename,
      servicedescription,
      serviceprice,
      orderfinalstatus,
      items,
    } = req.body;
    //check if user already exists
    const exists = await bookingModel.findOne({ email: email });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "you  are already Booked" });
    }

    if (
      validator.isEmpty(customername) ||
      validator.isEmpty(mobilenumber) ||
      validator.isEmpty(bookingfrom) ||
      validator.isEmpty(timestart) ||
      validator.isEmpty(bookingto) ||
      validator.isEmpty(timeend) ||
      validator.isEmpty(numberofguest) ||
      validator.isEmpty(eventtypes) ||
      validator.isEmpty(message) ||
      validator.isEmpty(servicename) ||
      validator.isEmpty(servicedescription) ||
      validator.isEmpty(serviceprice) ||
      validator.isEmpty(orderfinalstatus) ||
      !Array.isArray(items) ||
      items.some(
        (item) =>
          validator.isEmpty(item.name) ||
          validator.isEmpty(item.price) ||
          validator.isEmpty(item.quantity)
      ) ||

      !validator.isEmail(email)
    ) {
      return res.status(400).json({ success: false, message: "Please provide valid details for all fields" });
    }

    const newBooking = new bookingModel({
      customername,
      mobilenumber,
      email,
      bookingfrom,
      timestart,
      bookingto,
      timeend,
      numberofguest,
      eventtypes,
      message,
      servicename,
      servicedescription,
      serviceprice,
      orderfinalstatus,
      items,
      userbookingid: req.User.id,
    });
    const booking = await newBooking.save();
    res.status(200).json({ success: true,  message: 'Booking created successfully', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//get user info
const getsingleBooking = async (req, res) => {
  try {
    const user = await bookingModel.findOne({ _id: req.params.id }).populate('userbookingid');
    res.status(200).json({ success: true, message: 'GetSingle Booking', user });
  } catch (error) {
    res.status(502).json({ success: false, message: error.message });
  }
};


// booking updated
const updateBooking = async (req, res) => {
  try {
    const exists = await bookingModel.findByIdAndUpdate(
      { _id: req.params.id},
      { $set:req.body},
      { new: true }
    );
    if (exists) {
      res.status(200).json({ success: true, message: 'Booking updated successfully', exists });
    }
  } catch (error) {
    res.status(502).json({ message: error.message });
  }
};

const getBooking = async (req, res) => {
  try {
    const user = await bookingModel.find({}).populate('userbookingid');
    console.log("user", user);
    res.status(200).json({ success: true, message: 'Bookings retrieved successfully', user });
  } catch (error) {
    res.status(502).json({ success: false, message: error.message });
  }
};


const deleteBooking = async (req, res) => {
  try {
    const user = await bookingModel.deleteOne({ _id: req.params.id });
    res.status(200).json({ success: true, message: 'Booking deleted successfully', user });  
  } catch (error) {
    res.status(502).json({ success: false, message: error.message });
  }
};

export {
  createbooking,
  getBooking,
  updateBooking,
  deleteBooking,
  getsingleBooking,
};
