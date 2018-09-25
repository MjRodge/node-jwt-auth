const express = require("express");
const mongoose = require("mongoose");

const app = express();

//DB config
require("dotenv").config();
const db = process.env.DB_HOST;
//connect to mongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("test!"));

const port = process.env.PORT || 5003;

app.listen(port, () => console.log("Server running on port " + port));
