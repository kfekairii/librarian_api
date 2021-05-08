const jwt = require("jsonwebtoken");
const asyncHandler = require("./asycWrapper");
const ErrorResponse = require("../utils/errorResponse");
const UserModel = require("../models/UserModel");

// protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  /* else if (req.cookies.token) {
    token = req.cookies.token;
  } */

  // Check if token sent
  if (!token) {
    return next(new ErrorResponse("Not authorized", 401));
  }
  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find user and pass it in the req
    req.user = await UserModel.findById(decoded.UID);
    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorized", 401));
  }
});

// Garant access for specific roles

exports.authorize = (...roles) => (req, res, next) => {
  // Get the user role
  const role = req.user.role;
  if (!roles.includes(role)) {
    return next(new ErrorResponse(`Not authorized role ${role}`, 403));
  }
  next();
};
