const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const profileController = require("../controller/profileController");

router.post("/login", authController.login_post);

router.post(
  "/profile",
  profileController.verifyToken,
  profileController.profile_post
);

router.post("/register", authController.register_post);
module.exports = router;
