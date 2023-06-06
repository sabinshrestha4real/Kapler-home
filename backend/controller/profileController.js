const jwt = require("jsonwebtoken");

module.exports.profile_post = (req, res) => {
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
};

module.exports.verifyToken = (req, res, next) => {
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
};
