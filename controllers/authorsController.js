const asyncHandler = require("../middlewares/asycWrapper");
const AuthorModel = require("../models/AuthorModel");
const BookModel = require("../models/BookModel");
const ErrorResponse = require("../utils/errorResponse");

const cloudinary = require("../config/couldinary");

// @desc        Create new author
// @route       POST /api/v1/author
// @access      Private

exports.createAuthor = asyncHandler(async (req, res, next) => {
  // add user to the req body
  req.body.user = req.user._id;
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
  res.status(200).send(req.advencedSearch);
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

// @desc        Upload author's photo
// @route       /api/v1/authors/:id/photo
// @access      Private

exports.uploadAuthorPhoto = asyncHandler(async (req, res, next) => {
  const author = await AuthorModel.findById(req.params.authorId);
  if (!author) {
    const errResp = new ErrorResponse("Author doesn't exist", 404);
    return next(errResp);
  }
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "sblib/authors",
  });
  await author.updateOne(
    { image_url: result.secure_url },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(201).json({ success: true, author });
});
