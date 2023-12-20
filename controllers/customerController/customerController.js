import validator from "validator";

import Cdata from "../../models/customerModel/customerModel.js";

//register user
const addcustomer = async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            mobile,
        } = req.body;

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
        // Create a new customer entry
        const newCustomer = new Cdata({
            name,
            email,
            address,
            mobile,
            userid: req.user.id,
        });

        const customer = await newCustomer.save();
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
    const user = await Cdata
      .findOne({ _id: req.params.id })
    //   .populate("userbookingid");
    res.status(200).json({ success: true, message: "getviewone customer", user });
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
    const user = await Cdata.find({})
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
    updatecustomer
};
