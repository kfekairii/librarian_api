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
const { protect } = require("../middlewares/auth");

router
  .route("/")
  .get(
    advencedSearch(BookModel, { path: "author", select: "_id fullName" }),
    getBooks
  )
  .post(protect, createBook);

router.route("/:id").get(getBook).put(updateBook).delete(deleteBook);

module.exports = router;
