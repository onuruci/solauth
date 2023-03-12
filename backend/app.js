var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const corsOptions = {
  origin: "https://solauth.xyz",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

require("dotenv").config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

var mongoose = require("mongoose");
var mongoDB = process.env.DB_LINK;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "Mongo.db connection error: "));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use("/", indexRouter);
app.use("/users", usersRouter);

module.exports = app;
