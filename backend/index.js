// Importing express package
const express = require("express");

// Importing mongoose
const mongoose = require("mongoose");

// Importing cors
const cors = require("cors");

// Importing dotenv
const dotenv = require("dotenv");

// initializing express server
const app = express();

dotenv.config();

// importing routes
const kaplerRoutes = require("./routes/authRoute");
//importing profile route
const profileRote = require("./routes/profileRoute");

// Responding to the request
app.use(cors());
app.use(express.json());

app.use("/kapler", kaplerRoutes);
app.use("/kapler", profileRote);

// connecting to our database
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to database");
    // listening to the request
    app.listen(process.env.PORT, () => {
      console.log("Server is running !!");
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
