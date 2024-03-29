import validator from "validator";

import Cdata from "../../models/customerModel/customerModel.js";
import userModel from "../../models/userModel.js";
import adminModel from "../../models/adminModel/adminModel.js";

//register user
const addcustomer = async (req, res) => {
  try {
    const { name, email, address, mobile,gst } = req.body;

    // Check if user already exists
    const exists = await Cdata.findOne({ email: email });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "This email already exists" });
    }

    // Validate fields
    const requiredFields = [name, email, address, mobile];
    const isValidFields = requiredFields.every(
      (field) => field && !validator.isEmpty(field.toString())
    );

    // Validate email format
    const isValidEmail = validator.isEmail(email);

    if (!isValidFields || !isValidEmail) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid details for all fields",
      });
    }

    const isAdmin = await adminModel.findById(req.user.id);
    let customer;
    if (isAdmin) {
      const newCustomer = new Cdata({
        name,
        email,
        address,
        mobile,
        gst,
        companyname: isAdmin.companyname,
      });

      customer = await newCustomer.save();
    } else {
      const user = await userModel.findById(req.user.id);
      const newCustomer = new Cdata({
        name,
        email,
        address,
        mobile,
        companyname: user.companyname,
      });

      customer = await newCustomer.save();
    }

    // Create a new customer entry

    res.status(200).json({
      success: true,
      message: "Customer added successfully",
      customer,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//get user info
const getsinglecustomer = async (req, res) => {
  try {
    const user = await Cdata.findOne({ _id: req.params.id });
    //   .populate("userbookingid");
    res
      .status(200)
      .json({ success: true, message: "getviewone customer", user });
  } catch (error) {
    res.status(502).json({ success: false, message: error.message });
  }
};

// booking updated
const updatecustomer = async (req, res) => {
  try {
    const exists = await Cdata.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (exists) {
      res.status(200).json({
        success: true,
        message: "Customer updated successfully",
        exists,
      });
    }
  } catch (error) {
    res.status(502).json({ message: error.message });
  }
};

const getcustomer = async (req, res) => {
  try {
    const isAdmin = await adminModel.findById(req.user.id);
    let user;
    if (isAdmin) {
      user = await Cdata.find({ companyname: { $regex: new RegExp(`^${isAdmin.companyname}$`, "i") }, });
    } else {
      const userOne = await userModel.findById(req.user.id);
      user = await Cdata.find({ companyname: { $regex: new RegExp(`^${userOne.companyname}$`, "i") }, });
    }
    // .populate("userbookingid");
    console.log("user", user);
    res.status(200).json({
      success: true,
      message: "Customer retrieved successfully",
      user,
    });
  } catch (error) {
    res.status(502).json({ success: false, message: error.message });
  }
};

const deletecustomer = async (req, res) => {
  try {
    const user = await Cdata.deleteOne({ _id: req.params.id });
    res
      .status(200)
      .json({ success: true, message: "Customer deleted successfully", user });
  } catch (error) {
    res.status(502).json({ success: false, message: error.message });
  }
};

export {
  addcustomer,
  getsinglecustomer,
  getcustomer,
  deletecustomer,
  updatecustomer,
};
