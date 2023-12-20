import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRouter from "./routes/userRoute.js";
import superAdmin from "./routes/superAdminRoute/superAdminRoute.js";
import admin from "./routes/adminRouter/adminRouter.js";

import taskRouter from "./routes/taskRoute.js";
import forgotPasswordRouter from "./routes/forgotPassword.js";
import bookingRouter from "./routes/createBookingRouter/createBookingRouter.js";
import customerRouter from "./routes/customerRouter/customerRouter.js";

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

//api endpoints
app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);
app.use("/api/forgotPassword", forgotPasswordRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/customer", customerRouter);

// super admin routes
app.use("/api/superadmin", superAdmin);
app.use("/api/admin", admin);

//listen
app.listen(port, () => console.log(`Listening on localhost:${port}`));
