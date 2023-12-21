import validator from "validator";

import bookingModel from "../../models/createbooking/createbookingModel.js";
import { createTransport } from "nodemailer";
import userModel from "../../models/userModel.js";
import adminModel from "../../models/adminModel/adminModel.js";

const sendMail = (email, orderManagerEmail, status, data) => {
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "ranjanlamichhanekiaan@gmail.com",
    to: [email, orderManagerEmail],
    subject: `Your order got ${status}`,
    html: `<div>Name: ${data.customername}</div><div>Booking from: ${data.bookingfrom}</div><div>Booking to: ${data.bookingto}</div>
    <div>Service:${data.servicename}</div>
    <div>Status:${data.orderfinalstatus}</div>
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return false;
    } else {
      console.log("Email sent: " + info.response);
      return true;
    }
  });
};

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
    console.log(chef, servicedescription, servicename, waiter, items);
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
    const finalItems = JSON.parse(items);
    const finalChef = JSON.parse(chef);
    const finalWaiter = JSON.parse(waiter);

    const isValidFields = requiredFields.every(
      (field) => !validator.isEmpty(field)
    );

    if (
      !isValidFields ||
      !Array.isArray(finalItems) ||
      !validator.isEmail(email) ||
      !Array.isArray(finalChef) ||
      !Array.isArray(finalWaiter)
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
      items: finalItems,
      chef: finalChef,
      waiter: finalWaiter,
      userbookingid: req.user.id,
    });
    const { email: orderManagerEmail } = await userModel
      .findById(req.user.id)
      .select("email");
    const booking = await newBooking.save();
    sendMail(email, orderManagerEmail, "created", booking);
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
  const { id } = req.params;
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
  const finalItems = JSON.parse(items);
  const finalChef = JSON.parse(chef);
  const finalWaiter = JSON.parse(waiter);

  const isValidFields = requiredFields.every(
    (field) => !validator.isEmpty(field)
  );

  if (
    !isValidFields ||
    !Array.isArray(finalItems) ||
    !validator.isEmail(email) ||
    !Array.isArray(finalChef) ||
    !Array.isArray(finalWaiter)
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid details for all fields",
    });
  }
  try {
    const updatedBooking = await bookingModel.findByIdAndUpdate(
      id,
      {
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
        items: finalItems,
        chef: finalChef,
        waiter: finalWaiter,
      },
      { new: true }
    );
    const { email: orderManagerEmail } = await userModel
      .findById(req.user.id)
      .select("email");
    sendMail(email, orderManagerEmail, "updated", updatedBooking);
    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(502).json({ message: error.message });
  }
};

const getBooking = async (req, res) => {
  try {
    // sendMail();
    const isAdmin = await adminModel.findById(req.user.id);
    let bookings;
    if (isAdmin) {
      bookings = await bookingModel.find({});
    } else {
      bookings = await bookingModel.find({ userbookingid: req.user.id });
    }
    console.log("bookings", bookings);
    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      bookings,
    });
  } catch (error) {
    res.status(502).json({ success: false, message: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    await bookingModel.findOneAndDelete({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
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
