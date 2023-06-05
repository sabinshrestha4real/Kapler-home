const express = require("express");

const router = express.Router();

const UserModel = require("../models/userModel");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

router.post("/login", async (req, res) => {
  console.log("login api hit");

  try {
    const { email, password } = req.body;
    // console.log(email);
    const user = await UserModel.findOne({ email });

    // console.log(user);
    if (!user) {
      return res.status(400).json({
        message:
          "Invalid email or password. Please check your credentials and try again.",
      });
    }

    let contains = await new Promise((resolve, reject) => {
      //password compare from req and database
      bcrypt.compare(password, user.password, function (err, result) {
        console.log(result);
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    //encrypt returns true if password matches with database
    if (!contains) {
      return res.status(400).json({
        message:
          "Invalid email or password. Please check your credentials and try again.",
      });
    }
    jwt.sign(
      { user },
      process.env.SECRET_KEY,
      { expiresIn: "30s" },
      (err, token) => {
        if (err) {
        } else {
          res.json({
            success: true,
            message: "Login Success",
            data: {
              token,
            },
          });
        }
      }
    );
    // if(){}
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/profile", verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.SECRET_KEY, (err, result) => {
    if (err) {
      res.status(401).json({ success: false, message: "Invalid Token." });
    } else {
      res.json({
        success: true,
        message: "Profile successfully fetched",
        data: {
          id: result._id,
          name: result.name,
          phone: result.phone,
          address: result.address,
          email: result.email,
        },
      });
    }
  });
});

function verifyToken(req, res, next) {
  const header = req.headers["authorization"];
  if (typeof header !== "undefined") {
    //split text for removing bearer
    const bearer = header.split(" ");
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    res.status(401).json({ success: false, message: "Invalid Token" });
  }
}

router.post("/register", async (req, res) => {
  try {
    const existingUser = await UserModel.findOne({ email: req.body.email });

    if (req.body.password !== req.body.confirm_password) {
      return res.status(400).json({
        success: false,
        message: "Password doesn't match",
      });
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    //encrypt password when everything executes properly
    const hashPass = await new Promise((resolve, reject) => {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });

    await UserModel.create({
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      email: req.body.email,
      password: hashPass,
      confirm_password: hashPass,
    });

    res.json({
      success: true,
      message: "User successfully registered!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
module.exports = router;
