const asyncHandler = require("../middlewares/asycWrapper");
const BookModel = require("../models/BookModel");
const ErrorResponse = require("../utils/errorResponse");

// @desc        Get all books
// @route       /api/v1/books
// @access      Public

exports.getBooks = asyncHandler(async (req, res, next) => {
  const books = await BookModel.find();
  res.status(200).send({
    success: true,
    books,
  });
});

// @desc        Get book by ID
// @route       /api/v1/books/:id
// @access      Public

exports.getBook = asyncHandler(async (req, res, next) => {
  const book = await BookModel.findById(req.params.id);

  if (!book) {
    //return res.status(400).send({ success: false });
    const errRes = new ErrorResponse(
      `Book not found with id of ${req.params.id}`,
      404
    );
    return next(errRes);
  }

  res.status(200).send({
    success: true,
    book,
  });
});

// @desc        Create a book
// @route       /api/v1/books/
// @access      Private

exports.createBook = asyncHandler(async (req, res, next) => {
  const book = await BookModel.create(req.body);
  res.status(201).send({
    success: true,
    book,
  });
});

// @desc        Update book by ID
// @route       /api/v1/books/:id
// @access      Private

exports.updateBook = asyncHandler(async (req, res, next) => {
  const book = await BookModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!book) {
    const errRes = new ErrorResponse(
      `Book not found with id of ${req.params.id}`,
      404
    );
    return next(errRes);
  }

  res.status(200).send({
    success: true,
    book,
  });
});

// @desc        Delete book by ID
// @route       /api/v1/books/:id
// @access      Public

exports.deleteBook = asyncHandler(async (req, res, next) => {
  const book = await BookModel.findByIdAndDelete(req.params.id);
  if (!book) {
    const errRes = new ErrorResponse(
      `Book not found with id of ${req.params.id}`,
      404
    );
    return next(errRes);
  }

  res.status(200).send({
    success: true,
    book,
  });
});
