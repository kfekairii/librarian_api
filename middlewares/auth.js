const jwt = require("jsonwebtoken");
const asyncHandler = require("./asycWrapper");
const ErrorResponse = require("../utils/errorResponse");
const UserModel = require("../models/UserModel");

// protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  console.log(req.headers.authorization);
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

  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  console.log(decoded);
  next();
});
