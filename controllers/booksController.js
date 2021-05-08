const asyncHandler = require("../middlewares/asycWrapper");
const BookModel = require("../models/BookModel");
const ErrorResponse = require("../utils/errorResponse");
const cloudinary = require("../config/couldinary");

// @desc        Get all books
// @route       /api/v1/books
// @access      Public

exports.getBooks = asyncHandler(async (req, res, next) => {
  // req.advencedSearch came from books route advencedSearch middleware
  res.status(200).send(req.advencedSearch);
});

// @desc        Get book by ID
// @route       /api/v1/books/:id
// @access      Public

exports.getBook = asyncHandler(async (req, res, next) => {
  const book = await BookModel.findById(req.params.id).populate({
    path: "author",
    select: "_id fullName",
  });

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
  // add user to the req body
  req.body.user = req.user._id;
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
  }).populate({
    path: "author",
    select: "_id fullName",
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
  const book = await BookModel.findById(req.params.id);
  if (!book) {
    const errRes = new ErrorResponse(
      `Book not found with id of ${req.params.id}`,
      404
    );
    return next(errRes);
  }
  book.remove();
  res.status(200).send({
    success: true,
    book,
  });
});

// @desc        Upload book's photo
// @route       /api/v1/books/:id/photo
// @access      Private

exports.uploadBookPhoto = asyncHandler(async (req, res, next) => {
  const book = await BookModel.findById(req.params.bookId);
  if (!book) {
    const errResp = new ErrorResponse("Book doesn't exist", 404);
    return next(errResp);
  }
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "sblib/books",
  });
  await book.updateOne(
    { image_url: result.secure_url },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(201).json({ success: true, book });
});
