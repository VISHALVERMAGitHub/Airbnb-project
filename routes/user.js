const express = require("express");
const router = express.Router();
const User = require("../models/user");
const asyncWrap = require("../utils/asyncWrap");

const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controller/user");

router
   .route("/signup")
   .get(userController.renderSignInform)
   .post(asyncWrap(userController.userSignIn));

router
.route("/login")
.get(userController.renderLogInForm)
.post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: "/login", failureFlash: true }), userController.userLogIn);

router.get("/logout", userController.userLogout);

module.exports = router; 