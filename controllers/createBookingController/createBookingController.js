import jwt from "jsonwebtoken";

import validator from "validator";

import bookingModel from "../../models/createbooking/createbookingModel.js";

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
      applydate,
      orderfinalstatus,
      adminremark,
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
      // validator.isEmpty(email) ||
      validator.isEmpty(timestart) ||
      validator.isEmpty(bookingto) ||
      validator.isEmpty(timeend) ||
      validator.isEmpty(numberofguest) ||
      validator.isEmpty(eventtypes) ||
      validator.isEmpty(message) ||
      validator.isEmpty(servicename) ||
      validator.isEmpty(servicedescription) ||
      validator.isEmpty(serviceprice) ||
      validator.isEmpty(applydate) ||
      validator.isEmpty(orderfinalstatus) ||
      validator.isEmpty(adminremark)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide full details for all fields",
      });
    }
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email" });
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
      applydate,
      orderfinalstatus,
      adminremark
    });
    const booking = await newBooking.save();

    res.status(200).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//get user info
const getsingleBooking = async (req, res) => {
  try {
    const user = await bookingModel.find({ _id: req.params.id });
    res.status(200).json({ success: true, user: user[0] });
  } catch (error) {
    res.status(502).json({ success: false, message: error.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    const { id } = req.params._id;
    const exists = await bookingModel.findByIdAndUpdate({ _id: id }, req.body);
    if (exists) {
      res.status(200).json({ success: true, exists });
    }
  } catch (error) {
    res.status(502).json({ message: error.message });
  }
};
const getBooking = async (req, res) => {
  try {
    const user = await bookingModel.find({});
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(502).json({ success: false, message: error.message });
  }
};
export { createbooking, getBooking, updateBooking, getsingleBooking };
