const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

router.post("/login", authController.login_post);

router.post("/register", authController.register_post);
module.exports = router;
