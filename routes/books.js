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
  uploadBookPhoto,
} = require("../controllers/booksController");
const { protect, authorize } = require("../middlewares/auth");
const upload = require("../config/multer");

router
  .route("/")
  .get(
    advencedSearch(BookModel, { path: "author", select: "_id fullName" }),
    getBooks
  )
  .post(protect, authorize("publisher", "admin"), createBook);

router
  .route("/:id")
  .get(getBook)
  .put(protect, authorize("publisher", "admin"), updateBook)
  .delete(protect, authorize("publisher", "admin"), deleteBook);

router
  .route("/:bookId/photo")
  .put(
    protect,
    authorize("publisher", "admin"),
    upload.single("image"),
    uploadBookPhoto
  );

module.exports = router;
