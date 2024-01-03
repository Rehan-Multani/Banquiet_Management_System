import validator from "validator";

import bookingModel from "../../models/createbooking/createbookingModel.js";
import { createTransport } from "nodemailer";
import userModel from "../../models/userModel.js";
import adminModel from "../../models/adminModel/adminModel.js";
import customerModel from "../../models/customerModel/customerModel.js";
import adminNotification from "../../models/adminnotificationModel/adminnotificationModel.js";

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

// function that check if booking dates are available or not

const isBookingDateAvailable = async (fromDate, toDate, startTime, endTime) => {
  try {
    const existingBookings = await bookingModel.find({
      $or: [
        {
          $and: [
            { bookingfrom: { $lte: fromDate } },
            { bookingto: { $gte: fromDate } },
            { timestart: { $lte: endTime } },
            { timeend: { $gte: startTime } },
          ],
        },
        {
          $and: [
            { bookingfrom: { $lte: toDate } },
            { bookingto: { $gte: toDate } },
            { timestart: { $lte: endTime } },
            { timeend: { $gte: startTime } },
          ],
        },
      ],
    });

    return existingBookings.length === 0;
  } catch (error) {
    throw new Error("Error checking booking availability");
  }
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
      servicename,
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

    // check booking
    const isBookingAvailable = await isBookingDateAvailable(
      bookingfrom,
      bookingto,
      timestart,
      timeend
    );

    if (!isBookingAvailable) {
      return res.status(400).json({
        success: false,
        message: "Booking dates are not available.",
      });
    }

    let finalCusId;
    const curCustomer = await customerModel.findOne({ email });
    console.log(curCustomer, "curCustomer");
    if (!curCustomer) {
      const newCustomer = new customerModel({
        email,
        name: customername,
        address: "India",
        mobile: mobilenumber,
        totalOrders: 1,
      });
      const customer = await newCustomer.save();
      finalCusId = customer._id;
    } else {
      curCustomer.totalOrders = curCustomer.totalOrders + 1;
      await curCustomer.save();
      finalCusId = curCustomer._id;
    }
    let companyid;
    const data = await userModel.findById(req.user.id);
    if (data) {
      companyid = data.companyid;
    } else {
      const admin = await adminModel.findById(req.user.id);
      companyid = admin.companyid;
    }
    // Convert chef and waiter to arrays if they are not already
    const totalPrice = finalItems.reduce((acc, cur) => {
      return acc + parseInt(cur.price) * parseInt(cur.quantity);
    }, 0);
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
      companyid,
      items: finalItems,
      chef: finalChef,
      waiter: finalWaiter,
      customerid: finalCusId,
      totalPrice,
      userbookingid: req.user.id,
    });

    const booking = await newBooking.save();
    if (data) {
      sendMail(email, data.email, "created", booking);
    } else {
      sendMail(email, "study@gmail.com", "created", booking);
    }

    const admindata = await userModel.findOne({ id: req.user.id });
    console.log(admindata);
    let usernotification = admindata.notifications.push({
      message: `Your order for ${customername} was created.`,
    });
    await admindata.save();
    let adminnotification = await adminNotification.create({
      creatorId: req.user.id,
      message: `Order created for ${customername} by ${admindata.name}`,
      type: "information",
    });

    res.status(200).json({
      success: true,
      message: "Booking created successfully",
      booking,
      usernotification,
      adminnotification,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//get user info
const getsingleBooking = async (req, res) => {
  try {
    const user = await bookingModel.findOne({ _id: req.params.id });
    // .populate("userbookingid");
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
  const totalPrice = finalItems.reduce((acc, cur) => {
    return parseInt(cur.price) * parseInt(cur.quantity) + acc;
  }, 0);
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
        totalPrice,
      },
      { new: true }
    );
    const { email: orderManagerEmail } = await userModel
      .findById(req.user.id)
      .select("email");
    sendMail(email, orderManagerEmail, "updated", updatedBooking);

    let adminnotification = await adminNotification.create({
      creatorId: req.user.id,
      message: message,
      type: req?.body?.type,
    });
    const admindata = await userModel.findOne({ id: req.user.id });
    console.log(admindata);
    let usernotification = admindata.notifications.push(req.body.message[0]);
    await admindata.save();

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      booking: updatedBooking,
      adminnotification,
      admindata,
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
      bookings = await bookingModel
        .find({ companyid: isAdmin.companyid })
        .populate("customerid");
    } else {
      bookings = await bookingModel
        .find({ userbookingid: req.user.id })
        .populate("customerid");
      console.log(bookings);
    }
    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      bookings,
    });
  } catch (error) {
    res.status(502).json({ success: false, message: error.message });
  }
};
const getBookingByPage = async (req, res) => {
  const page = +req.params.page || 1;
  const ITEMS_PER_PAGE = 2;
  const skip = (page - 1) * ITEMS_PER_PAGE;
  try {
    // sendMail();
    const isAdmin = await adminModel.findById(req.user.id);
    let bookings, totalData;
    if (isAdmin) {
      totalData = await bookingModel.find();
      bookings = await bookingModel.find().skip(skip).limit(ITEMS_PER_PAGE);
    } else {
      totalData = await bookingModel.find({ userbookingid: req.user.id });
      bookings = await bookingModel
        .find({ userbookingid: req.user.id })
        .skip(skip)
        .limit(ITEMS_PER_PAGE);
    }
    console.log("bookings", bookings, totalData);
    const totalDocuments = totalData.length;
    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      bookings,
      totalPage: Math.ceil(totalDocuments / ITEMS_PER_PAGE),
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
  getBookingByPage,
};
