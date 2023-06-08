const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

    let accessToken;
    let refreshToken;
    // let existingToken = user.token;

    if (typeof user.token !== "undefined") {
      accessToken = createAccessToken(user);
      refreshToken = createRefreshToken(user);
      await UserModel.findByIdAndUpdate(
        { _id: user._id },
        {
          token: refreshToken,
          signedAt: Date.now().toString(),
        }
      );
    } else {
      // accessToken = createAccessToken(user);
      refreshToken = createRefreshToken(user);
      await UserModel.findByIdAndUpdate(
        { _id: user._id },
        {
          token: refreshToken,
          signedAt: Date.now().toString(),
        }
      );
    }
    res.json({
      success: true,
      message: "Login Success",
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    });
    // if(){}
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: error });
  }
};
//create new access_token using refresh token
module.exports.refresh_token = async (req, res) => {
  const header = req.headers["authorization"];
  const bearer = header.split(" ");
  const refreshToken = bearer[1];
  const id = req.body.id;
  const user = await UserModel.findById(id);
  // console.log(user.name);

  t;
  //check refresh token from database
  if (!refreshToken) {
    res.status(405).json({ success: false, message: "Token not found" });
  }
  if (user.token !== refreshToken) {
    res.status(401).json({ success: false, message: "Invalid Refresh token" });
  }
  jwt.verify(
    user.token,
    process.env.REFRESH_TOKEN_SECRET_KEY,
    (err, decode) => {
      if (err) {
        res.status(406).json({ success: false, message: err.toString() });
      } else {
        const accessToken = createAccessToken(user);
        res.status(200).json({
          success: true,
          data: {
            access_token: accessToken,
          },
        });
      }
    }
  );
};

//create accessToken short-lice
function createAccessToken(user) {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      phone: user.phone,
      address: user.address,
      email: user.email,
    },
    process.env.ACCEESS_TOKEN_SECRET_KEY,
    { expiresIn: "30s" } //expire token in 10 seconds
  );
}
//refresh token for longer duration
function createRefreshToken(user) {
  // console.log(user);
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      phone: user.phone,
      address: user.address,
      email: user.email,
    },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: "10m" } //expire token in 10 seconds
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

//logout and remove user token from database
module.exports.logout_post = async (req, res) => {
  try {
    if (typeof req.body.id !== "undefined") {
      const id = req.body.id;
      // const user = await UserModel.findById(id);

      await UserModel.findByIdAndUpdate(id, {
        $unset: { token: 1, signedAt: 1 },
      });
      // console.log(user);

      res.json({ success: true, message: "Logout Success" });
    } else {
      res.status(401).json({ success: false, message: "Logout Failed" });
    }
  } catch (error) {
    res.status(401).json({ success: false, message: error.toString() });
  }
};
