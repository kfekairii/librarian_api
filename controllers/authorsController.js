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
  let query = AuthorModel.find().populate({
    path: "books",
    select: "_id ",
  });

  const authors = await query;
  res.status(200).send({
    success: true,
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
    return next(errResp);
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
