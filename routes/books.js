const express = require("express");
const router = express.Router();
const advencedSearch = require("../middlewares/advancedSearch");
const BookModel = require("../models/BookModel");
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/booksController");

router.route("/").get(getBooks).post(createBook);

router.route("/:id").get(getBook).put(updateBook).delete(deleteBook);

module.exports = router;
