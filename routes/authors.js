const express = require("express");
const {
  createAuthor,
  getAuthors,
  getAuthor,
  updateAuthor,
  deleteAuthor,
  uploadAuthorPhoto,
} = require("../controllers/authorsController");
const { getBooks } = require("../controllers/booksController");
const advancedSearch = require("../middlewares/advancedSearch");
const AuthorModel = require("../models/AuthorModel");
const upload = require("../config/multer");

const router = express.Router();

router
  .route("/")
  .get(
    advancedSearch(AuthorModel, { path: "books", select: "_id title" }),
    getAuthors
  )
  .post(createAuthor);
router
  .route("/:authorId")
  .get(getAuthor)
  .put(updateAuthor)
  .delete(deleteAuthor);

router.route("/:authorId/photo").put(upload.single("image"), uploadAuthorPhoto);

module.exports = router;
