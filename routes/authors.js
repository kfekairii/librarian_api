const express = require("express");
const {
  createAuthor,
  getAuthors,
  getAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/authorsController");

const router = express.Router();

router.route("/").get(getAuthors).post(createAuthor);
router
  .route("/:authorId")
  .get(getAuthor)
  .put(updateAuthor)
  .delete(deleteAuthor);

module.exports = router;
