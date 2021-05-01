const asyncHandler = require("../middlewares/asycWrapper");
const BookModel = require("../models/BookModel");
const ErrorResponse = require("../utils/errorResponse");

// @desc        Get all books
// @route       /api/v1/books
// @access      Public

exports.getBooks = asyncHandler(async (req, res, next) => {
  const reqQuery = { ...req.query };

  // Field to exclude from the request query
  const removeFields = ["select", "sort", "page", "limit"];

  // delete fields that not included in the query
  // to not let mogoose use them a book fields
  // but as mogoose queries
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create mogoose operators [$gt,$lt..]
  let queryString = JSON.stringify(reqQuery);
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  let query = BookModel.find(JSON.parse(queryString));

  // Slect custum fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await BookModel.countDocuments();

  query = query.skip(startIndex).limit(limit).populate({
    path: "author",
    select: "_id fullName",
  });

  const books = await query;

  // Pagination result
  const pagination = {};

  if (startIndex > 0) {
    pagination.prev = { page: page - 1, limit };
  }

  if (endIndex < total) {
    pagination.next = { page: page + 1, limit };
  }

  res.status(200).send({
    success: true,
    count: books.length,
    pagination,
    books,
  });
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
  const book = await BookModel.findByIdAndDelete(req.params.id).populate({
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
