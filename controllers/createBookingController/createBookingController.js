import jwt from "jsonwebtoken";

import validator from "validator";

import bookingModel from "../../models/createbooking/createbookingModel.js";

//register user
const createbooking = async (req, res) => {
  try {
    const {
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
      chef,
      waiter,
    } = req.body;

    // Check if user already exists
    const exists = await bookingModel.findOne({ email: email });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "You are already booked" });
    }

    // Validate fields
    const requiredFields = [
      customername,
      mobilenumber,
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
    ];

    const isValidFields = requiredFields.every(
      (field) => !validator.isEmpty(field)
    );

    if (
      !isValidFields ||
      !Array.isArray(items) ||
      !validator.isEmail(email) ||
      !Array.isArray(chef)||
      !Array.isArray(waiter)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid details for all fields",
      });
    }

    // Convert chef and waiter to arrays if they are not already
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
      chef,
      waiter,
      userbookingid: req.user.id,
    });

    const booking = await newBooking.save();
    res.status(200).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//get user info
const getsingleBooking = async (req, res) => {
  try {
    const user = await bookingModel
      .findOne({ _id: req.params.id })
      .populate("userbookingid");
    res.status(200).json({ success: true, message: "GetSingle Booking", user });
  } catch (error) {
    res.status(502).json({ success: false, message: error.message });
  }
};

// booking updated
const updateBooking = async (req, res) => {
  try {
    const exists = await bookingModel.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (exists) {
      res.status(200).json({
        success: true,
        message: "Booking updated successfully",
        exists,
      });
    }
  } catch (error) {
    res.status(502).json({ message: error.message });
  }
};

const getBooking = async (req, res) => {
  try {
    const resultperpage = 1;
    const user = await bookingModel.find({}).populate("userbookingid");
    console.log("user", user);
    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      user,
    });
  } catch (error) {
    res.status(502).json({ success: false, message: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const user = await bookingModel.deleteOne({ _id: req.params.id });
    res
      .status(200)
      .json({ success: true, message: "Booking deleted successfully", user });
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
