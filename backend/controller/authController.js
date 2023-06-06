const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { undefined } = require("webidl-conversions");

module.exports.login_post = async (req, res) => {
  // console.log("login api hit");

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
        // console.log(result);
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

    let myToken = "";
    let existingToken = user.token;
    // console.log("Token check: " + existingToken);
    if (typeof existingToken !== "undefined") {
      // console.log("time: " + user.signedAt);
      // existingToken = existingToken.filter((e) => {
      const timeDiff = (Date.now() - parseInt(user.signedAt)) / 1000;

      // console.log(timeDiff);
      if (timeDiff < 10) {
        myToken = existingToken;
      } else {
        //if time difference is less greater than int 10
        myToken = createJwt(user);
      }
      await UserModel.findByIdAndUpdate(
        { _id: user._id },
        {
          token: myToken,
          signedAt: Date.now().toString(),
        }
      );
    } else {
      myToken = createJwt(user);
      await UserModel.findByIdAndUpdate(
        { _id: user._id },
        {
          token: myToken,
          signedAt: Date.now().toString(),
        }
      );
      // console.log("new token created: " + myToken);
    }
    res.json({
      success: true,
      message: "Login Success",
      data: {
        token: myToken,
      },
    });
    // if(){}
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: error });
  }
};

function createJwt(user) {
  // console.log(user);
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      phone: user.phone,
      address: user.address,
      email: user.email,
    },
    process.env.SECRET_KEY,
    { expiresIn: "10s" } //expire token in 10 seconds
  );
}

module.exports.register_post = async (req, res) => {
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
    if (req.body.password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be more than 6 characters",
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
};
