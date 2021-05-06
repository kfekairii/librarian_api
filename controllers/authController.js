const asyncHandler = require("../middlewares/asycWrapper");
const AuthorModel = require("../models/AuthorModel");
const BookModel = require("../models/BookModel");
const UserModel = require("../models/UserModel");
const ErrorResponse = require("../utils/errorResponse");

// @desc        Register user
// @route       POST /api/v1/auth/register
// @access      Public

exports.registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password, role } = req.body;

  // Create User
  const user = await UserModel.create({
    username,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
});

// @desc        Login user
// @route       POST /api/v1/auth/login
// @access      Public

exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse("Please enter an email and pasword", 400));
  }
  // Check for user
  const user = await UserModel.findOne({ email }).select("+password"); // select:false in the model

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Check passwrod
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendTokenResponse(user, 200, res);
});

// Get token from user, create cookie and send respose
const sendTokenResponse = (user, statusCode, res) => {
  // create toekn
  const token = user.getSignedJwtTokwn();

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  res.status(statusCode).cookie("token", token, cookieOptions).json({
    success: true,
    token,
  });
};
