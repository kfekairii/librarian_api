const express = require("express");
const {
  getAuthors,
  createAuthor,
  getAuthor,
  deleteAuthor,
} = require("../controllers/authorsController");

const router = express.Router();

router.route("/").get(getAuthors).post(createAuthor);
router.route("/:authorId").get(getAuthor).delete(deleteAuthor);

module.exports = router;
