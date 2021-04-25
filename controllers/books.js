// @desc        Get all books
// @route       /api/v1/books
// @access      Public

exports.getBooks = (req, res, next) => {
  res.send({ success: true, msg: "show all books" }).status(200);
};

// @desc        Get book by ID
// @route       /api/v1/books/:id
// @access      Public

exports.getBook = (req, res, next) => {
  res.send({ success: true, msg: `get book ${req.params.id}` }).status(200);
};

// @desc        Create a book
// @route       /api/v1/books/:id
// @access      Private

exports.createBook = (req, res, next) => {
  res
    .send({ success: true, msg: `create a book ${req.params.id}` })
    .status(201);
};

// @desc        Update book by ID
// @route       /api/v1/books/:id
// @access      Private

exports.updateBook = (req, res, next) => {
  res.send({ success: true, msg: `update book ${req.params.id}` }).status(200);
};

// @desc        Delete book by ID
// @route       /api/v1/books/:id
// @access      Public

exports.deleteBook = (req, res, next) => {
  res.send({ success: true, msg: `delete book ${req.params.id}` }).status(200);
};
