const BookModel = require("../models/BookModel");

// @desc        Get all books
// @route       /api/v1/books
// @access      Public

exports.getBooks = async (req, res, next) => {
  try {
    const books = await BookModel.find();
    res.status(200).send({
      success: true,
      books,
    });
  } catch (err) {
    res.status(400).send({ success: false });
  }
};

// @desc        Get book by ID
// @route       /api/v1/books/:id
// @access      Public

exports.getBook = async (req, res, next) => {
  try {
    console.log(req.params.id);
    const book = await BookModel.findById(req.params.id);

    if (!book) {
      return res.status(400).send({ success: false });
    }

    res.status(200).send({
      success: true,
      book,
    });
  } catch (err) {
    res.status(400).send({ success: false });
  }
};

// @desc        Create a book
// @route       /api/v1/books/:id
// @access      Private

exports.createBook = async (req, res, next) => {
  try {
    const book = await BookModel.create(req.body);
    res.status(201).send({
      success: true,
      book,
    });
  } catch (err) {
    res.status(400).send({ success: false });
  }
};

// @desc        Update book by ID
// @route       /api/v1/books/:id
// @access      Private

exports.updateBook = async (req, res, next) => {
  try {
    const book = await BookModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return res.status(400).send({ success: false });
    }

    res.status(200).send({
      success: true,
      book,
    });
  } catch (err) {
    res.status(400).send({ success: false });
  }
};

// @desc        Delete book by ID
// @route       /api/v1/books/:id
// @access      Public

exports.deleteBook = async (req, res, next) => {
  try {
    const book = await BookModel.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(400).send({ success: false });
    }

    res.status(200).send({
      success: true,
      book,
    });
  } catch (err) {
    res.status(400).send({ success: false });
  }
};
