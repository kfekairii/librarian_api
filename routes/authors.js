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
const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .get(
    advancedSearch(AuthorModel, { path: "books", select: "_id title" }),
    getAuthors
  )
  .post(protect, authorize("publisher", "admin"), createAuthor);
router
  .route("/:authorId")
  .get(getAuthor)
  .put(protect, authorize("publisher", "admin"), updateAuthor)
  .delete(protect, authorize("publisher", "admin"), deleteAuthor);

router
  .route("/:authorId/photo")
  .put(
    protect,
    authorize("publisher", "admin"),
    upload.single("image"),
    uploadAuthorPhoto
  );

module.exports = router;
