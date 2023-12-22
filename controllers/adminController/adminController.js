import userModel from "../../models/userModel.js";
import adminmodel from "../../models/adminModel/adminModel.js";
import bookingmodel from "../../models/createbooking/createbookingModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1yr",
  });
};

const createadmin = async (req, res) => {
  try {
    const { email, password, notifications } = req.body;

    const exists = await adminmodel.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (validator.isEmpty(email) || validator.isEmpty(password)) {
      return res
        .status(400)
        .json({ message: "Please provide valid email and password" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }
    if (!validator.isStrongPassword(password)) {
      return res
        .status(400)
        .json({ message: "Please enter a strong password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new adminmodel({
      email,
      password: hashedPassword,
      notifications: notifications || [],
    });

    const admin = await newAdmin.save();

    const token = createToken(admin._id);
    res
      .status(201)
      .json({
        success: true,
        message: "Admin created successfully",
        admin,
        token,
      });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const adminlogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
    const admindata = await adminmodel.findOne({ email });
    if (!admindata) {
      return res.status(400).json({ message: "User does not exist" });
    }
    // console.log(password, user);
    const isMatch = await bcrypt.compare(password, admindata.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = createToken(admindata._id);
    console.log("datatoken", token);
    res.status(200).json({ admindata, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const creationrole = async (req, res) => {
  try {
    const updatecreationID = req.params.id;

    const ifupdated = await userModel.findByIdAndUpdate(updatecreationID, {
      role: req.body.role,
    });
    console.log("ifupdated", ifupdated);
    if (ifupdated) {
      res.status(200).send({
        success: true,
        message: `${req.body.role} is updated successfully..`,
      });
    } else {
      res.status(401).send({
        success: false,
        message: `you are not authorized`,
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "internal server Error" + error });
  }
};

const getalldata = async (req, res) => {
  try {
    const alldata = await userModel.find({});

    const data = alldata.filter((item) => {
      return item.role !== "superadmin";
    });
    res.status(200).send({
      success: true,
      data,
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "internal server Error" + error });
  }
};

const getdata_NC = async (req, res) => {
  try {
    const alldata = await bookingmodel.find({});
    const data = alldata.filter((item) => {
      return item.orderfinalstatus == "Not Confirmed";
    });
    res.status(200).send({
      success: true,
      message: "Not Confirmed",
      data,
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "internal server Error" + error });
  }
};

const getdata_C = async (req, res) => {
  try {
    const alldata = await bookingmodel.find({});
    const data = alldata.filter((item) => {
      return item.orderfinalstatus == "Confirmed";
    });
    res.status(200).send({
      success: true,
      message: "Confirmed",
      data,
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "internal server Error" + error });
  }
};

export {
  creationrole,
  getalldata,
  createadmin,
  adminlogin,
  getdata_NC,
  getdata_C,
};
