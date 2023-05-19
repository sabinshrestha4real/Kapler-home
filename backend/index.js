//importing express package
const express = require("express");

//initializing express server
const app = express();

// Importing mongoose
const mongoose = require("mongoose");

//importing routes
const blogRoutes = require("./routes/blogRoutes");

//middleware
app.use(express.json());

//take path of groups
app.use("/blog", blogRoutes);
//credential database
const credential = require("./credentials");

//connection to our database
mongoose
  .connect(
    `mongodb+srv://admin:${credential}@cluster0.nkk5cmb.mongodb.net/?retryWrites=true&w=majority`
  )
  .then((response) => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Failed to connect");
  });

// blog is group name
// listening to the request
app.listen(8000, () => {
  console.log("Server is running");
});
