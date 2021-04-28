const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mogoose bad ObjectID
  if (err.name === "CastError") {
    const message = `Book not found with id of ${err.value}`;
    const statusCode = 404;
    error = new ErrorResponse(message, statusCode);
  }
  // Dublicated value error
  if (err.code === 11000) {
    const message = `Dublicated field : ${
      err.keyValue ? Object.keys(err.keyValue) : ""
    }`;

    const statusCode = 400;
    error = new ErrorResponse(message, statusCode);
  }
  // Mogoose ValidationError
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((obj) => obj.message);
    console.log(message);
    const statusCode = 400;
    error = new ErrorResponse(message, statusCode);
  }

  res.status(error.statusCode || 500).send({
    success: false,
    error: error.message || "Server error",
  });
};

module.exports = errorHandler;
