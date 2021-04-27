const express = require("express");
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/booksController");

const router = express.Router();

router.route("/").get(getBooks);

router
  .route("/:id")
  .get(getBook)
  .post(createBook)
  .put(updateBook)
  .delete(deleteBook);

module.exports = router;
