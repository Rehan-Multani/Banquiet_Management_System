import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import userRouter from "./routes/userRoute.js";
// import superAdmin from "./routes/superAdminRoute/superAdminRoute.js";
import admin from "./routes/adminRouter/adminRouter.js";
import notification from "./routes/notification/notificationRoute.js";

import taskRouter from "./routes/taskRoute.js";
import forgotPasswordRouter from "./routes/forgotPassword.js";
import bookingRouter from "./routes/createBookingRouter/createBookingRouter.js";
import adminnotification from "./routes/adminnotificationRouter/adminnotificationRouter.js";
import customerRouter from "./routes/customerRouter/customerRouter.js";
import companyRouter from "./routes/companyRoute.js";
import menuRoute from "./routes/MenuRoute.js";

//app config
dotenv.config();
const app = express();
const port = process.env.PORT || 8001;
mongoose.set("strictQuery", true);

//middlewares
app.use(express.json());
app.use(cors());

//db config
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
  },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("DB Connected");
    }
  }
);

const hashPw = async (req, res) => {
  const { password } = req.body;

  const salt = await bcrypt.genSalt(10);
  console.log(password, salt);
  const hashed = await bcrypt.hash(password, salt);
  return res.status(200).json({ password: hashed });
};

app.post("/hash", hashPw);

//api endpoints
app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);
app.use("/api/forgotPassword", forgotPasswordRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/customer", customerRouter);

// super admin routes
// app.use("/api/superadmin", superAdmin);
app.use("/api/admin", admin);
app.use("/api/admin/notification", adminnotification);

// notification route
app.use("/api/notification", notification);
app.use("/api/company", companyRouter);

app.use("/api/admin", admin);

// menu
app.use("/api/menu", menuRoute);

//listen
const server = app.listen(port, () =>
  console.log(`Listening on localhost:${port}`)
);
server.setTimeout(500000);
