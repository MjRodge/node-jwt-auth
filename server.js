const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

//bring in routes
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");

const app = express();

//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB config
require("dotenv").config();
const db = process.env.DB_HOST;
//connect to mongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

//passport middleware
app.use(passport.initialize());
//passport config
require("./config/passport")(passport);

//use routes
app.use("/api/users", users);
app.use("/api/profile", profile);

const port = process.env.PORT || 5003;

app.listen(port, () => console.log("Server running on port " + port));
