import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import adminNotification from "../models/adminnotificationModel/adminnotificationModel.js";
import adminModel from "../models/adminModel/adminModel.js";

//create token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1yr",
  });
};

//login user
const loginUser = async (req, res) => {
  // console.log("data", req.body);
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
    const user = await userModel.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    if (!user.verify) {
      return res.status(400).json({ message: "Not verified yet" });
    }
    // console.log(password, user);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = createToken(user._id);
    console.log("datatoken", token);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//register user
const registerUser = async (req, res) => {
  const { name, email, companyname, companyid, contact, role, password } =
    req.body;
  console.log(name, email, password);
  try {
    //check if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (
      validator.isEmpty(name) ||
      validator.isEmpty(email) ||
      validator.isEmpty(companyname) ||
      validator.isEmpty(companyid) ||
      validator.isEmpty(contact) ||
      validator.isEmpty(role) ||
      validator.isEmpty(password)
    ) {
      return res.status(400).json({ message: "Please enter all fields" });
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

    const newUser = new userModel({
      name,
      email,
      companyname,
      companyid,
      contact,
      role,
      password: hashedPassword,
    });
    const user = await newUser.save();
    await adminNotification.create({
      creatorId: user._id,
      message: `Please verify ${user.name}`,
      type: "verify",
      companyname,
    });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get user info
const getUser = async (req, res) => {
  const id = req.user.id;
  try {
    const user = await userModel.find({ _id: id });
    if (!user.length) {
      const user = await adminModel.find({ _id: id });
      console.log(user);
      if (!user.length && id === "834787584375") {
        return res
          .status(200)
          .json({ user: { email: "superadmin@gmail.com" } });
      }
      res.status(200).json({ user: user[0] });
      return;
    }
    res.status(200).json({ user: user[0] });
  } catch (error) {
    res.status(502).json({ message: error.message });
  }
};
const getsaffwaiter = async (req, res) => {
  const id = req.user.id;
  try {
    const user = await userModel.find({}).select("-password");

    const Waiter = user.filter((item) => {
      return item.role == "Waiter";
    });
    const Chef = user.filter((item) => {
      return item.role == "Chef";
    });
    res.status(200).json({ Waiter, Chef });
  } catch (error) {
    res.status(502).json({ message: error.message });
  }
};
const verifyuser = async (req, res) => {
  try {
    const id = req.body.id;
    const notificationId = req.body.notificationId;
    const user = await userModel.findById(id).select("-password");

    user.verify = true;
    await user.save();

    await adminNotification.findByIdAndDelete(notificationId);
    const notifications = await adminNotification.find();
    res.status(200).json({ user, notifications });
  } catch (error) {
    res.status(502).json({ message: error.message });
  }
};
const deletenotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("userId", userId);
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    user.notifications = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: "Notifications cleared successfully",
      user,
    });
  } catch (error) {
    res.status(502).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  const admin = await adminModel.findById(req.user.id);
  console.log(admin.companyname);
  try {
    const user = await userModel.find({ companyname: admin.companyname });
    res.status(200).json({ user });
  } catch (error) {
    res.status(502).json({ message: error.message });
  }
};
export {
  loginUser,
  registerUser,
  getUser,
  getsaffwaiter,
  verifyuser,
  deletenotifications,
};
