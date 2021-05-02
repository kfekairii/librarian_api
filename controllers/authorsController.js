const asyncHandler = require("../middlewares/asycWrapper");
const AuthorModel = require("../models/AuthorModel");
const BookModel = require("../models/BookModel");
const ErrorResponse = require("../utils/errorResponse");

// @desc        Create new author
// @route       POST /api/v1/author
// @access      Public

exports.createAuthor = asyncHandler(async (req, res, next) => {
  let query = AuthorModel.create(req.body);

  const author = await query;
  res.status(200).send({
    success: true,
    author,
  });
});

// @desc        Get all authors
// @route       /api/v1/authors
// @access      Public

exports.getAuthors = asyncHandler(async (req, res, next) => {
  /* let query = AuthorModel.find().populate({
    path: "books",
    select: "_id ",
  });

  const authors = await query;
  res.status(200).send({
    success: true,
    authors,
  }); */
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

  let query = AuthorModel.find(JSON.parse(queryString));
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
  const total = await AuthorModel.countDocuments();

  query = query
    .skip(startIndex)
    .limit(limit)
    .populate({ path: "books", select: "_id title" });
  const authors = await query;

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
    count: authors.length,
    pagination,
    authors,
  });
});

// @desc        Get author by ID
// @route       /api/v1/authors
// @access      Public

exports.getAuthor = asyncHandler(async (req, res, next) => {
  let query = AuthorModel.findById(req.params.authorId).populate({
    path: "books",
    select: "_id title",
  });

  const author = await query;
  if (!author) {
    const errRes = new ErrorResponse(
      `Author not found with id of ${req.params.authorId}`,
      404
    );
    return next(errRes);
  }
  res.status(200).send({
    success: true,
    author,
  });
});

// @desc        Update author by ID
// @route       /api/v1/authors/:authorId
// @access      Private

exports.updateAuthor = asyncHandler(async (req, res, next) => {
  let query = AuthorModel.findByIdAndUpdate(req.params.authorId, req.body, {
    new: true,
    runValidators: true,
  });

  const author = await query;
  if (!author) {
    const errRes = new ErrorResponse(
      `Author not found with id of ${req.params.authorId}`,
      404
    );
    return next(errRes);
  }
  res.status(200).send({
    success: true,
    author,
  });
});

// @desc        Delete Author by ID
// @route       /api/v1/authors/:id
// @access      Private

exports.deleteAuthor = asyncHandler(async (req, res, next) => {
  const author = await AuthorModel.findById(req.params.authorId).populate({
    path: "books",
    select: "_id title",
  });
  if (!author) {
    const errRes = new ErrorResponse(
      `Author not found with id of ${req.params.id}`,
      404
    );
    return next(errRes);
  }

  author.remove();
  res.status(200).send({
    success: true,
    author,
  });
});
