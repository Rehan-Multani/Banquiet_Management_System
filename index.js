const bodyParser = require("body-parser");
const express = require("express");
const dbConnect = require("./Config/dbconnect");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const app = express();
const dotenv = require("dotenv").config();

const PORT = 5000;


const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

dbConnect();
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use("/api/user", require('./Route/UserRoute/UserRoute'));


app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Your Server is running  at PORT ${PORT}`);
});
