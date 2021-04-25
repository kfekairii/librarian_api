const express = require("express");
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/books");

const router = express.Router();

router.route("/").get(getBooks);

router
  .route("/:id")
  .get(getBook)
  .post(createBook)
  .put(updateBook)
  .delete(deleteBook);

module.exports = router;
