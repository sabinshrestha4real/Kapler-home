const express = require("express");

const router = express.Router();

const UserModel = require("../models/registerModel");

router.post("/login", async (req, res) => {
  console.log("login api hit");
  try {
    const { email, password } = req.body;
    // console.log(email);
    const user = await UserModel.findOne({ email });
    // console.log(user);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.json({
      success: true,
      message: "Login Success",
      data: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        address: user.address,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }

  // }
});

router.post("/register", async (req, res) => {
  try {
    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (req.body.password !== req.body.confirm_password) {
      return res.status(400).json({ message: "Password doesn't match" });
    }

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    let resgiterData = await UserModel.create({
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      email: req.body.email,
      password: req.body.password,
      confirm_password: req.body.confirm_password,
    });

    res.json({
      message: "User successfully registered!",
      data: resgiterData,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;