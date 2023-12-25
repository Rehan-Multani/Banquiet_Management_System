import userModel from "../../models/userModel.js";
import adminmodel from "../../models/adminModel/adminModel.js";
import bookingmodel from "../../models/createbooking/createbookingModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import adminNotification from "../../models/adminnotificationModel/adminnotificationModel.js";

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
    res.status(201).json({
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
    res.status(200).json({ user: admindata, token });
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

const updateconfirmed = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await bookingmodel.findOneAndUpdate(
      {
        _id: orderId,
        orderfinalstatus: "Not Confirmed",
      },
      {
        $set: {
          orderfinalstatus: "Confirmed",
        },
      },
      { new: true }
    );

    if (order) {
      res.status(200).json({
        success: true,
        message: "Order status updated from Not Confirmed to Confirmed",
        order,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Order not found or already confirmed",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const adduser = async (req, res) => {
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
      verify: true,
    });
    const user = await newUser.save();
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateuser = async (req, res) => {
  try {
    const existingUser = await userModel
      .findById(req.params.id)
      .select("+password");
    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const {
      name,
      email,
      companyname,
      companyid,
      contact,
      role,
      password,
      verify,
    } = req.body;

    const salt = await bcrypt.genSalt(10);

    existingUser.name = name !== undefined ? name : existingUser.name;
    existingUser.email = email !== undefined ? email : existingUser.email;
    existingUser.companyname =
      companyname !== undefined ? companyname : existingUser.companyname;
    existingUser.companyid =
      companyid !== undefined ? companyid : existingUser.companyid;
    existingUser.contact =
      contact !== undefined ? contact : existingUser.contact;
    existingUser.role = role !== undefined ? role : existingUser.role;

    // Check if password is provided and update it
    if (password !== undefined) {
      existingUser.password = await bcrypt.hash(password, salt);
    }

    existingUser.verify = verify !== undefined ? verify : existingUser.verify;

    const updatedUser = await existingUser.save();

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteuser = async (req, res) => {
  try {
    const deleteUser = await userModel.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ user: deleteUser, message: "User deleted successfully...." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  creationrole,
  getalldata,
  createadmin,
  adminlogin,
  getdata_NC,
  getdata_C,
  updateconfirmed,
  adduser,
  updateuser,
  deleteuser,
};
